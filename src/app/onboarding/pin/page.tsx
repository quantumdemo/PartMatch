"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { PinService } from "@/lib/services/pinService";
import { createClient } from "@/lib/supabase/client";

function OnboardingPINContent() {
  const searchParams = useSearchParams();
  const fromSource = searchParams?.get("from") || "";
  const isSettingsMode = fromSource === "settings" || fromSource === "dashboard" || fromSource === "wallet";

  const [userId, setUserId] = useState<string>("dev-user-id");
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState<string[]>(["", "", "", ""]);
  const [step, setStep] = useState<"enter" | "confirm">("enter");

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();

  const enterRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const confirmRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) setUserId(data.user.id);
    }
    loadUser();
  }, []);

  const handleEnterDigit = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...pin];
    newPin[index] = val.slice(-1);
    setPin(newPin);
    setError(null);

    if (val && index < 3) enterRefs[index + 1].current?.focus();
    if (newPin.every((d) => d !== "")) setStep("confirm");
  };

  const handleConfirmDigit = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newConfirm = [...confirmPin];
    newConfirm[index] = val.slice(-1);
    setConfirmPin(newConfirm);
    setError(null);

    if (val && index < 3) confirmRefs[index + 1].current?.focus();
  };

  const handleSavePin = async () => {
    const rawPin = pin.join("");
    const rawConfirm = confirmPin.join("");

    if (rawPin.length !== 4 || rawConfirm.length !== 4) {
      setError("PIN must be exactly 4 numeric digits.");
      return;
    }

    if (rawPin !== rawConfirm) {
      setError("PINs do not match. Please try again.");
      setConfirmPin(["", "", "", ""]);
      confirmRefs[0].current?.focus();
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await PinService.setPaymentPin(userId, rawPin);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to set Payment PIN.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans p-4 flex flex-col justify-between max-w-[440px] mx-auto">
      <div className="space-y-6 pt-4 pb-24">
        {/* Progress Header - Only show if in onboarding flow */}
        {!isSettingsMode ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            </div>
            <p className="text-xs font-medium text-[#8A8A8A]">Step 6/7: Transaction PIN</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-xs text-[#8A8A8A] hover:text-[#121212] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Settings</span>
          </button>
        )}

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121212]">
            {isSettingsMode ? "Change Transaction PIN" : "Set Transaction PIN"}
          </h1>
          <p className="text-xs text-[#8A8A8A]">
            Set a secret 4-digit PIN for authorizing escrow payouts and withdrawals.
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
            <h3 className="text-lg font-extrabold text-[#121212]">PIN Set Successfully!</h3>
            <p className="text-xs text-[#8A8A8A]">
              Your 4-digit PIN has been bcrypt hashed and stored securely.
            </p>
            <button
              type="button"
              onClick={() => router.push(isSettingsMode ? "/me" : "/onboarding/bank")}
              className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isSettingsMode ? "Return to Profile" : "Continue to Bank Details"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {step === "enter" && (
              <div className="space-y-3 text-center">
                <label className="text-xs font-bold text-[#121212]">Enter 4-Digit Secret PIN</label>
                <div className="flex justify-center gap-3">
                  {pin.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={enterRefs[idx]}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleEnterDigit(idx, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-bold bg-white border border-[#EAEAEA] rounded-[12px] focus:border-[#FF4D1A] focus:outline-none shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {step === "confirm" && (
              <div className="space-y-4 text-center">
                <div className="p-2.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#8A8A8A] flex items-center justify-between">
                  <span>PIN entered: <strong className="text-[#121212]">••••</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setPin(["", "", "", ""]);
                      setConfirmPin(["", "", "", ""]);
                      setStep("enter");
                    }}
                    className="text-xs text-[#FF4D1A] font-bold underline"
                  >
                    Reset
                  </button>
                </div>

                <label className="text-xs font-bold text-[#121212]">Re-enter 4-Digit PIN to Confirm</label>
                <div className="flex justify-center gap-3">
                  {confirmPin.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={confirmRefs[idx]}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleConfirmDigit(idx, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-bold bg-white border border-[#EAEAEA] rounded-[12px] focus:border-[#FF4D1A] focus:outline-none shadow-sm"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={saving || confirmPin.some((d) => d === "")}
                  onClick={handleSavePin}
                  className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-[#EAEAEA] text-white text-xs font-bold rounded-[12px] transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  {saving ? "Saving PIN..." : "Save PIN & Proceed"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function OnboardingPINPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8A8A8A]">Loading PIN Setup...</div>}>
      <OnboardingPINContent />
    </Suspense>
  );
}
