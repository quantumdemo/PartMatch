"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, KeyRound, Clock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PinService } from "@/lib/services/pinService";

const WEAK_PINS = ["1234", "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "4321", "0123"];

export default function SecurityResetPinPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [kycStatus, setKycStatus] = useState<string>("PENDING");
  const [checkingKyc, setCheckingKyc] = useState<boolean>(true);

  // Step 1: Identity verification states
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [sendingOtp, setSendingOtp] = useState<boolean>(false);
  const [otpCountdown, setOtpCountdown] = useState<number>(0);

  const [verifyingIdentity, setVerifyingIdentity] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  // Step 2: New PIN states
  const [step, setStep] = useState<"verify_identity" | "enter_new_pin">("verify_identity");
  const [newPin, setNewPin] = useState<string[]>(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState<string[]>(["", "", "", ""]);
  const [savingPin, setSavingPin] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const newPinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const confirmPinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    async function loadUserKyc() {
      setCheckingKyc(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
        setUserEmail(session.user.email || "");

        const { data: profile } = await supabase
          .from("profiles")
          .select("kyc_status")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (profile?.kyc_status) {
          setKycStatus(profile.kyc_status);
        }
      }
      setCheckingKyc(false);
    }
    loadUserKyc();
  }, []);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const handleSendOtp = async () => {
    if (!userEmail) return;
    try {
      setSendingOtp(true);
      setError(null);
      const { error: sendErr } = await supabase.auth.signInWithOtp({ email: userEmail });
      if (sendErr) throw sendErr;
      setOtpSent(true);
      setOtpCountdown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send OTP code.";
      setError(msg);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Lockout check (15 minutes)
    if (lockedUntil && Date.now() < lockedUntil) {
      const minsLeft = Math.ceil((lockedUntil - Date.now()) / (60 * 1000));
      setError(`Security lockout active. Try again in ${minsLeft} minute(s).`);
      return;
    }

    if (!password) {
      setError("Account password is required.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    try {
      setVerifyingIdentity(true);
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token || "";

      const res = await fetch("/api/verify-pin-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= 3) {
          const lockTime = Date.now() + 15 * 60 * 1000; // 15 min lock
          setLockedUntil(lockTime);
          throw new Error("3 failed verification attempts! Locked for 15 minutes.");
        }
        throw new Error(data.error || `Invalid password or OTP. ${3 - attempts} attempt(s) remaining.`);
      }

      // Success Step 1 -> Move to Step 2
      setStep("enter_new_pin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Identity verification failed.";
      setError(msg);
    } finally {
      setVerifyingIdentity(false);
    }
  };

  const handleNewPinDigit = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...newPin];
    updated[index] = val.slice(-1);
    setNewPin(updated);
    setError(null);

    if (val && index < 3) newPinRefs[index + 1].current?.focus();
  };

  const handleConfirmPinDigit = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...confirmPin];
    updated[index] = val.slice(-1);
    setConfirmPin(updated);
    setError(null);

    if (val && index < 3) confirmPinRefs[index + 1].current?.focus();
  };

  const handleSaveNewPin = async () => {
    const rawNewPin = newPin.join("");
    const rawConfirm = confirmPin.join("");

    if (rawNewPin.length !== 4 || rawConfirm.length !== 4) {
      setError("Transaction PIN must be 4 numeric digits.");
      return;
    }

    if (WEAK_PINS.includes(rawNewPin)) {
      setError("Sequential or repetitive PINs (e.g. 1234, 0000) are blocked for security.");
      return;
    }

    if (rawNewPin !== rawConfirm) {
      setError("PINs do not match. Please try again.");
      setConfirmPin(["", "", "", ""]);
      confirmPinRefs[0].current?.focus();
      return;
    }

    try {
      setSavingPin(true);
      setError(null);

      // Save via PinService
      await PinService.setPaymentPin(userId, rawNewPin);

      // Also update profiles.pin_hash if existing using bcryptjs import
      try {
        const bcrypt = await import("bcryptjs");
        const hashed = await bcrypt.hash(rawNewPin, 10);
        await supabase.from("profiles").update({ pin_hash: hashed }).eq("user_id", userId);
      } catch {
        // Fallback if bcryptjs unavailable
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/me");
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update PIN.";
      setError(msg);
    } finally {
      setSavingPin(false);
    }
  };

  if (checkingKyc) {
    return (
      <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans p-4 max-w-[440px] mx-auto flex items-center justify-center">
        <p className="text-xs text-[#8A8A8A] animate-pulse">Checking security credentials...</p>
      </main>
    );
  }

  // Block Reset PIN if KYC is not verified
  if (kycStatus !== "VERIFIED") {
    return (
      <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans p-4 flex flex-col justify-between max-w-[440px] mx-auto">
        <div className="space-y-6 pt-4 pb-24">
          <button
            onClick={() => router.push("/me")}
            className="flex items-center gap-1 text-xs text-[#8A8A8A] hover:text-[#121212] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </button>

          <div className="p-6 bg-amber-50 border border-amber-200 rounded-[16px] space-y-3 text-center">
            <Lock className="w-12 h-12 text-amber-600 mx-auto" />
            <h2 className="text-lg font-extrabold text-amber-900">KYC Verification Required</h2>
            <p className="text-xs text-amber-800 leading-relaxed">
              Your KYC status is currently <strong>{kycStatus}</strong>. You cannot reset your transaction PIN until your identity documents are fully VERIFIED.
            </p>
            <button
              onClick={() => router.push("/onboarding/kyc")}
              className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Complete KYC Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans p-4 flex flex-col justify-between max-w-[440px] mx-auto">
      <div className="space-y-6 pt-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <button
            onClick={() => router.push("/me")}
            className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 bg-[#FF4D1A]/10 text-[#FF4D1A] px-3 py-1 rounded-full border border-[#FF4D1A]/20 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Security Center</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121212]">
            {step === "verify_identity" ? "Reset Transaction PIN" : "Set New Transaction PIN"}
          </h1>
          <p className="text-xs text-[#8A8A8A]">
            {step === "verify_identity"
              ? "Verify your account password & 6-digit email OTP before resetting your PIN."
              : "Enter a secret 4-digit PIN for authorizing escrow payouts and withdrawals."}
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 bg-white border border-[#EAEAEA] rounded-[16px] text-center space-y-3 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-extrabold text-[#121212]">PIN Reset Successful!</h3>
            <p className="text-xs text-[#8A8A8A]">
              Your transaction PIN has been updated and hashed securely. Redirecting to your account...
            </p>
          </div>
        ) : (
          <>
            {/* STEP 1: Verify Identity */}
            {step === "verify_identity" && (
              <form onSubmit={handleVerifyIdentity} className="space-y-4">
                <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#FF4D1A]" /> Current Account Password *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      required
                      className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#FF4D1A]" /> 6-Digit Email OTP *
                      </label>
                      <button
                        type="button"
                        disabled={sendingOtp || otpCountdown > 0}
                        onClick={handleSendOtp}
                        className="text-[11px] font-bold text-[#FF4D1A] disabled:text-[#8A8A8A] underline"
                      >
                        {sendingOtp ? "Sending..." : otpCountdown > 0 ? `Resend in ${otpCountdown}s` : "Send OTP"}
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      required
                      className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs font-mono tracking-widest text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
                    />
                    {otpSent && (
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 pt-0.5">
                        <Clock className="w-3 h-3" /> OTP code sent to {userEmail}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={verifyingIdentity}
                  className="w-full h-14 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold rounded-[12px] transition shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{verifyingIdentity ? "Verifying Credentials..." : "Verify Identity"}</span>
                </button>
              </form>
            )}

            {/* STEP 2: Enter New PIN */}
            {step === "enter_new_pin" && (
              <div className="space-y-6">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Identity Verified. Create your new 4-digit PIN below.</span>
                </div>

                <div className="space-y-3 text-center">
                  <label className="text-xs font-bold text-[#121212]">Enter New 4-Digit PIN</label>
                  <div className="flex justify-center gap-3">
                    {newPin.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={newPinRefs[idx]}
                        type="password"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleNewPinDigit(idx, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold bg-white border border-[#EAEAEA] rounded-[12px] focus:border-[#FF4D1A] focus:outline-none shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-center">
                  <label className="text-xs font-bold text-[#121212]">Confirm New 4-Digit PIN</label>
                  <div className="flex justify-center gap-3">
                    {confirmPin.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={confirmPinRefs[idx]}
                        type="password"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleConfirmPinDigit(idx, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold bg-white border border-[#EAEAEA] rounded-[12px] focus:border-[#FF4D1A] focus:outline-none shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={savingPin || newPin.some((d) => d === "") || confirmPin.some((d) => d === "")}
                  onClick={handleSaveNewPin}
                  className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-[#EAEAEA] text-white text-xs font-bold rounded-[12px] transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4" />
                  <span>{savingPin ? "Updating PIN..." : "Save New PIN"}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
