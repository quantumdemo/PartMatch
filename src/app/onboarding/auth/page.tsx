"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, AlertCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function OnboardingAuthPage() {
  const [email, setEmail] = useState<string>("");
  const [otpToken, setOtpToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [step, setStep] = useState<"email" | "verify_otp" | "set_password">("email");

  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  const { countdown, canResend, loading, error, sendOTP, verifyOTP, signInWithGoogle, signInWithApple } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !email.includes("@")) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    try {
      await sendOTP(email);
      setStep("verify_otp");
    } catch (err: unknown) {
      if (err instanceof Error) setLocalError(err.message);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!otpToken || otpToken.length !== 6) {
      setLocalError("Please enter the 6-digit OTP sent to your email.");
      return;
    }

    try {
      await verifyOTP(email, otpToken);
      setStep("set_password");
    } catch (err: unknown) {
      if (err instanceof Error) setLocalError(err.message);
    }
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    router.push("/onboarding/profile");
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans p-4 flex flex-col justify-between max-w-[440px] mx-auto">
      <div className="space-y-6 pt-4 pb-24">
        {/* Top Progress Stepper Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
          </div>
          <p className="text-xs font-medium text-[#8A8A8A]">Step 2/7: Account Security</p>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121212]">Account Authentication</h1>
          <p className="text-xs text-[#8A8A8A]">
            Verify email address with 6-digit OTP code & create account password.
          </p>
        </div>

        {(localError || error) && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* STEP A: Email Entry */}
        {step === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#FF4D1A]" /> Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter.your.email@domain.com"
                required
                className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>{loading ? "Sending OTP..." : "Send 6-Digit Email OTP"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Social Logins */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EAEAEA]"></div>
              </div>
              <span className="relative bg-[#FFFBF5] px-3 text-[11px] text-[#8A8A8A] uppercase font-semibold">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="h-11 bg-white hover:bg-neutral-50 border border-[#EAEAEA] rounded-[12px] text-xs font-bold text-[#121212] flex items-center justify-center gap-1.5"
              >
                Google OAuth
              </button>
              <button
                type="button"
                onClick={() => signInWithApple()}
                className="h-11 bg-white hover:bg-neutral-50 border border-[#EAEAEA] rounded-[12px] text-xs font-bold text-[#121212] flex items-center justify-center gap-1.5"
              >
                Apple ID
              </button>
            </div>
          </form>
        )}

        {/* STEP B: Enter OTP */}
        {step === "verify_otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="p-3 bg-white rounded-[12px] border border-[#EAEAEA] text-xs text-[#8A8A8A] flex items-center justify-between">
              <span>Code sent to: <strong className="text-[#121212]">{email}</strong></span>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-xs text-[#FF4D1A] underline font-bold"
              >
                Change
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#121212]">Enter 6-Digit Email OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                className="w-full text-center text-lg font-mono tracking-widest h-12 bg-white border border-[#EAEAEA] rounded-[12px] text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF4D1A]" />
                {canResend ? "Resend ready" : `Resend in ${countdown}s`}
              </span>
              <button
                type="button"
                disabled={!canResend || loading}
                onClick={() => sendOTP(email)}
                className="text-[#FF4D1A] disabled:text-[#8A8A8A] font-bold underline text-xs"
              >
                Resend Code
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || otpToken.length !== 6}
              className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-[#EAEAEA] disabled:text-[#8A8A8A] text-white text-xs font-bold rounded-[12px] transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>{loading ? "Verifying OTP..." : "Verify Code & Proceed"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP C: Mandatory Set Password */}
        {step === "set_password" && (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#FF4D1A]" /> Create Account Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#121212]">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>Save Password & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
