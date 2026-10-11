"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Clock } from "lucide-react";
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

    // Proceed to live camera verification
    router.push("/onboarding/live-verify");
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#0F172A] p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <header className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4D1A] bg-[#FF4D1A]/10 px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Step 2 of 5: Identity Authentication
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Account Security Verification</h1>
          <p className="text-xs text-[#64748B]">
            Email OTP verification with 10-minute WAT expiry & mandatory password creation.
          </p>
        </header>

        {(localError || error) && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* STEP A: Email Entry */}
        {step === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#FF4D1A]" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter.your.email@domain.com"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? "Sending OTP..." : "Send 6-Digit Email OTP"} <ArrowRight className="w-4 h-4" />
            </button>

            {/* Social Logins */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 text-[11px] text-[#64748B] uppercase font-semibold">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1.5"
              >
                Google OAuth
              </button>
              <button
                type="button"
                onClick={() => signInWithApple()}
                className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1.5"
              >
                Apple ID
              </button>
            </div>
          </form>
        )}

        {/* STEP B: Enter OTP */}
        {step === "verify_otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#64748B] flex items-center justify-between">
              <span>Code sent to: <strong className="text-[#0F172A]">{email}</strong></span>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-xs text-[#FF4D1A] underline font-bold"
              >
                Change
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A]">Enter 6-Digit Email OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                className="w-full text-center text-lg font-mono tracking-widest px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
              />
            </div>

            {/* Countdown timer display */}
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF4D1A]" />
                {canResend ? "Resend ready" : `Resend in ${countdown}s`}
              </span>
              <button
                type="button"
                disabled={!canResend || loading}
                onClick={() => sendOTP(email)}
                className="text-[#FF4D1A] disabled:text-slate-400 font-bold underline text-xs"
              >
                Resend Code
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || otpToken.length !== 6}
              className="w-full py-3 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? "Verifying OTP..." : "Verify Code & Proceed"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP C: Mandatory Set Password */}
        {step === "set_password" && (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#FF4D1A]" /> Create Account Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A]">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
            >
              Save Password & Continue <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
