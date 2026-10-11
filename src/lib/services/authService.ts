import { createClient } from "@/lib/supabase/client";

export interface OTPRateLimitCheck {
  allowed: boolean;
  message?: string;
  remainingAttempts?: number;
}

// In-memory rate limiting map for client/mobile session fallback
// Tracks email -> Array of timestamps (in ms)
const otpAttemptsMap = new Map<string, number[]>();

export class AuthService {
  /**
   * Checks rate limiting for OTP requests.
   * Rule: Max 5 requests per hour WAT.
   * If exceeded, blocks with message: "Too many attempts, try after 1 hour"
   */
  static checkOTPRateLimit(email: string): OTPRateLimitCheck {
    const normalizedEmail = email.trim().toLowerCase();
    const now = Date.now();
    const ONE_HOUR_MS = 60 * 60 * 1000;

    const attempts = otpAttemptsMap.get(normalizedEmail) || [];
    // Filter attempts within the last 1 hour
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < ONE_HOUR_MS);

    if (recentAttempts.length >= 5) {
      return {
        allowed: false,
        message: "Too many attempts, try after 1 hour",
        remainingAttempts: 0,
      };
    }

    return {
      allowed: true,
      remainingAttempts: 5 - recentAttempts.length,
    };
  }

  /**
   * Records an OTP attempt for rate limiting
   */
  static recordOTPAttempt(email: string): void {
    const normalizedEmail = email.trim().toLowerCase();
    const now = Date.now();
    const ONE_HOUR_MS = 60 * 60 * 1000;

    const attempts = otpAttemptsMap.get(normalizedEmail) || [];
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < ONE_HOUR_MS);
    recentAttempts.push(now);

    otpAttemptsMap.set(normalizedEmail, recentAttempts);
  }

  /**
   * Triggers Email OTP verification via Supabase / Resend provider
   */
  static async sendEmailOTP(email: string): Promise<{ success: boolean; message: string }> {
    const rateCheck = this.checkOTPRateLimit(email);
    if (!rateCheck.allowed) {
      throw new Error(rateCheck.message);
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Record attempt on successful send
    this.recordOTPAttempt(email);

    return {
      success: true,
      message: "6-digit OTP code sent to your email. Valid for 10 minutes WAT.",
    };
  }

  /**
   * Verifies Email OTP token
   */
  static async verifyEmailOTP(email: string, token: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Sign In with Google OAuth
   */
  static async signInWithGoogle(redirectTo?: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Sign In with Apple OAuth
   */
  static async signInWithApple(redirectTo?: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Phone Verification (Phone OTP secondary step only)
   */
  static async sendPhoneOTP(phone: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) throw new Error(error.message);
    return data;
  }
}
