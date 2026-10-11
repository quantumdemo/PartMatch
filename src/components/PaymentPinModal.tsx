"use client";

import React, { useState, useRef, useEffect } from "react";
import { Lock, X, AlertCircle, ShieldCheck } from "lucide-react";
import { PinService } from "@/lib/services/pinService";

interface PaymentPinModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  title?: string;
  description?: string;
}

export function PaymentPinModal({
  userId,
  isOpen,
  onClose,
  onVerified,
  title = "Enter Payment PIN",
  description = "Set your Payment PIN - required for all payments and withdrawals",
}: PaymentPinModalProps) {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isOpen) {
      setPin(["", "", "", ""]);
      setError(null);
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(null);

    // Auto-advance focus
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto trigger submission when all 4 boxes filled
    if (newPin.every((d) => d !== "")) {
      verifyPin(newPin.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyPin = async (rawPin: string) => {
    try {
      setVerifying(true);
      setError(null);
      const res = await PinService.verifyPaymentPin(userId, rawPin);

      if (res.success) {
        onVerified();
        onClose();
      } else {
        setError(res.message || "Incorrect Payment PIN.");
        setPin(["", "", "", ""]);
        inputRefs[0].current?.focus();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to verify PIN.";
      setError(msg);
      setPin(["", "", "", ""]);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#0F172A]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-10 h-10 bg-[#FF4D1A]/10 text-[#FF4D1A] rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-extrabold text-[#0F172A]">{title}</h3>
          <p className="text-xs text-[#64748B]">{description}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 4-Box PIN Input */}
        <div className="flex justify-center gap-3 py-2">
          {pin.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-[#FF4D1A] focus:bg-white focus:outline-none transition shadow-sm"
            />
          ))}
        </div>

        <button
          type="button"
          disabled={verifying || pin.some((d) => d === "")}
          onClick={() => verifyPin(pin.join(""))}
          className="w-full py-3 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          {verifying ? "Verifying PIN..." : "Authorize Transaction"}
        </button>
      </div>
    </div>
  );
}
