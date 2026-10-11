"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Building2, ShieldCheck, Lock } from "lucide-react";
import { PaymentPinModal } from "@/components/PaymentPinModal";

export default function PaymentMethodPage() {
  const [method, setMethod] = useState<"card" | "bank">("card");
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const router = useRouter();

  const userId = "123e4567-e89b-12d3-a456-426614174000";

  const handlePayClick = () => {
    setShowPinModal(true);
  };

  const handlePinVerified = () => {
    router.push("/orders/placed");
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-24 font-sans space-y-6">
      <header className="border-b border-[#EAEAEA] pb-4">
        <h1 className="text-2xl font-bold text-[#121212]">Select Payment Method</h1>
        <p className="text-xs text-[#8A8A8A]">Choose payment channel via Paystack NGN gateway</p>
      </header>

      {/* Payment Options */}
      <div className="space-y-3">
        <div
          onClick={() => setMethod("card")}
          className={`p-4 bg-white border rounded-[16px] flex items-center justify-between cursor-pointer transition-colors ${
            method === "card" ? "border-[#FF4D1A] ring-2 ring-[#FF4D1A]/20" : "border-[#EAEAEA]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFFBF5] border border-[#EAEAEA] text-[#FF4D1A] rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#121212]">Debit / Credit Card</h3>
              <p className="text-xs text-[#8A8A8A]">Mastercard, Visa, Verve</p>
            </div>
          </div>
          <input type="radio" checked={method === "card"} readOnly className="accent-[#FF4D1A]" />
        </div>

        <div
          onClick={() => setMethod("bank")}
          className={`p-4 bg-white border rounded-[16px] flex items-center justify-between cursor-pointer transition-colors ${
            method === "bank" ? "border-[#FF4D1A] ring-2 ring-[#FF4D1A]/20" : "border-[#EAEAEA]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFFBF5] border border-[#EAEAEA] text-[#FF4D1A] rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#121212]">Instant Bank Transfer</h3>
              <p className="text-xs text-[#8A8A8A]">GTB, Access, Kuda, OPay NUBAN</p>
            </div>
          </div>
          <input type="radio" checked={method === "bank"} readOnly className="accent-[#FF4D1A]" />
        </div>
      </div>

      <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] text-xs text-[#8A8A8A] space-y-1">
        <div className="font-bold text-[#121212] flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security PIN Verification Required
        </div>
        <p className="text-[11px]">
          Enter your 4-digit bcrypt payment PIN to authorize escrow lock.
        </p>
      </div>

      <button
        type="button"
        onClick={handlePayClick}
        className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white font-bold text-xs rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
      >
        <Lock className="w-4 h-4" /> Authorize & Pay ₦18,500 NGN
      </button>

      {/* PIN Authorization Modal */}
      <PaymentPinModal
        userId={userId}
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onVerified={handlePinVerified}
        title="Enter Payment PIN"
        description="Authorization required to lock NGN funds in escrow"
      />
    </main>
  );
}
