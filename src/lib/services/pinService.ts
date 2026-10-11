import { createClient } from "@/lib/supabase/client";
import { hashPaymentPin, comparePaymentPin } from "@/lib/security";
import { getPinLockoutWAT, isExpired } from "@/lib/timezone";

export interface PinVerifyResult {
  success: boolean;
  message?: string;
  isLocked?: boolean;
  lockedUntil?: Date | string;
  failedAttempts?: number;
}

export class PinService {
  /**
   * Force sets a new 4-digit payment PIN for a user
   */
  static async setPaymentPin(userId: string, pin: string): Promise<boolean> {
    if (!/^\d{4}$/.test(pin)) {
      throw new Error("Payment PIN must be exactly 4 numeric digits.");
    }

    const pinHash = await hashPaymentPin(pin);
    const supabase = createClient();

    const { error } = await supabase.from("payment_pins").upsert({
      user_id: userId,
      pin_hash: pinHash,
      failed_attempts: 0,
      locked_until: null,
      updated_at: new Date().toISOString(),
    });

    if (error) throw new Error(error.message);

    // Audit log
    await supabase.from("pin_change_logs").insert({
      user_id: userId,
      reason: "Initial 4-digit PIN setup after KYC completion",
    });

    return true;
  }

  /**
   * Verifies PIN with 3-attempt rate limit and 30-min WAT lockout
   */
  static async verifyPaymentPin(userId: string, rawPin: string): Promise<PinVerifyResult> {
    const supabase = createClient();

    const { data: record, error } = await supabase
      .from("payment_pins")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !record) {
      return { success: false, message: "Payment PIN not set. Please set your 4-digit PIN first." };
    }

    // Check if account is locked out
    if (record.locked_until && !isExpired(record.locked_until)) {
      return {
        success: false,
        isLocked: true,
        lockedUntil: record.locked_until,
        message: "PIN locked due to 3 failed attempts. Try again after 30 minutes WAT.",
      };
    }

    const isValid = await comparePaymentPin(rawPin, record.pin_hash);

    if (isValid) {
      // Reset failed attempts on success
      await supabase
        .from("payment_pins")
        .update({ failed_attempts: 0, locked_until: null })
        .eq("user_id", userId);

      return { success: true };
    }

    // Handle failed attempt counter
    const newFailedAttempts = (record.failed_attempts || 0) + 1;
    const isNowLocked = newFailedAttempts >= 3;
    const lockoutTime = isNowLocked ? getPinLockoutWAT().toISOString() : null;

    await supabase
      .from("payment_pins")
      .update({
        failed_attempts: newFailedAttempts,
        locked_until: lockoutTime,
      })
      .eq("user_id", userId);

    if (isNowLocked) {
      return {
        success: false,
        isLocked: true,
        lockedUntil: lockoutTime!,
        message: "3 incorrect attempts! PIN locked for 30 minutes WAT.",
      };
    }

    return {
      success: false,
      failedAttempts: newFailedAttempts,
      message: `Incorrect PIN. ${3 - newFailedAttempts} attempts remaining before 30-min lockout.`,
    };
  }

  /**
   * Changes PIN with Old PIN verification
   */
  static async changePaymentPin(userId: string, oldPin: string, newPin: string): Promise<boolean> {
    const verifyRes = await this.verifyPaymentPin(userId, oldPin);
    if (!verifyRes.success) {
      throw new Error(verifyRes.message || "Old PIN verification failed.");
    }

    return this.setPaymentPin(userId, newPin);
  }

  /**
   * Resets PIN using Email OTP + Last 4 digits of NIN
   */
  static async resetPaymentPinWithNIN(userId: string, ninLast4: string, newPin: string): Promise<boolean> {
    const supabase = createClient();

    const { data: kyc, error } = await supabase
      .from("kyc_submissions")
      .select("nin")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !kyc?.nin) {
      throw new Error("KYC verification record not found.");
    }

    if (!kyc.nin.endsWith(ninLast4)) {
      throw new Error("NIN last 4 digits do not match verified records.");
    }

    return this.setPaymentPin(userId, newPin);
  }
}
