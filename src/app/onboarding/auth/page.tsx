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

            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="w-full h-12 bg-white hover:bg-neutral-50 active:scale-[0.98] border border-[#EAEAEA] rounded-[12px] text-xs font-bold text-[#121212] flex items-center justify-center gap-2 shadow-sm transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => signInWithApple()}
                className="w-full h-12 bg-black hover:bg-neutral-800 active:scale-[0.98] rounded-[12px] text-xs font-bold text-white flex items-center justify-center gap-2 shadow-sm transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.58.67-1.09 1.74-.95 2.78 1.01.08 2.05-.53 2.67-1.28z"/>
                </svg>
                Continue with Apple
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
