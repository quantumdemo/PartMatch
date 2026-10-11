"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { PinService } from "@/lib/services/pinService";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPINPage() {
  const [userId, setUserId] = useState<string>("123e4567-e89b-12d3-a456-426614174000");
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
    <main className="min-h-screen bg-[#FFFBF5] text-[#0F172A] p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <header className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4D1A] bg-[#FF4D1A]/10 px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Step 5 of 5: Payment Authorization PIN
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Set Your 4-Digit Payment PIN</h1>
          <p className="text-xs text-[#64748B]">
            Required for all future payments and withdrawals <InfoTooltip id="payment_pin" />
          </p>
        </header>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 text-emerald-900">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-extrabold">Payment PIN Created!</h3>
            <p className="text-xs text-emerald-700">
              Your secret PIN has been hashed with bcrypt and saved. You can now use PartMatch securely.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              Complete Onboarding & Go to Home <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {step === "enter" && (
              <div className="space-y-3 text-center">
                <label className="text-xs font-bold text-[#0F172A]">Enter 4-Digit Secret PIN</label>
                <div className="flex justify-center gap-3">
                  {pin.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={enterRefs[idx]}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleEnterDigit(idx, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-[#FF4D1A] focus:bg-white focus:outline-none transition shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {step === "confirm" && (
              <div className="space-y-4 text-center">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#64748B] flex items-center justify-between">
                  <span>PIN entered: <strong>••••</strong></span>
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

                <label className="text-xs font-bold text-[#0F172A]">Re-enter 4-Digit PIN to Confirm</label>
                <div className="flex justify-center gap-3">
                  {confirmPin.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={confirmRefs[idx]}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleConfirmDigit(idx, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-[#FF4D1A] focus:bg-white focus:outline-none transition shadow-sm"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={saving || confirmPin.some((d) => d === "")}
                  onClick={handleSavePin}
                  className="w-full py-3.5 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  {saving ? "Saving PIN..." : "Save Payment PIN & Complete"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
