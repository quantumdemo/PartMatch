"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function ConfirmDeliveryPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();

  const [confirming, setConfirming] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setCompleted(true);
    }, 1200);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-20 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Confirm Part Fitment & Delivery</h1>
          <p className="text-[11px] text-[#8A8A8A]">Order Ref: PM-REF-{orderId?.substring(0, 6)}</p>
        </div>
      </header>

      {completed ? (
        /* Success Confirmation */
        <div className="bg-white border border-emerald-200 rounded-[16px] p-6 text-center space-y-3 shadow-sm my-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold text-[#121212]">Escrow Funds Released!</h2>
          <p className="text-xs text-[#8A8A8A]">
            Merchant and mechanic payouts have been processed atomically. Thank you for using PartMatch.
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm"
          >
            Back to Orders
          </button>
        </div>
      ) : (
        /* Confirmation Checklist & CTA */
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-[#121212] flex items-center">
              Inspection Checklist <InfoTooltip id="kyc" />
            </h2>
            <p className="text-[11px] text-[#8A8A8A]">
              Ensure all items are verified before releasing funds.
            </p>
          </div>

          <div className="space-y-2 text-xs text-[#121212]">
            <label className="flex items-center gap-2 p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#FF4D1A] w-4 h-4" />
              <span>Part brand and OEM number match order description</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#FF4D1A] w-4 h-4" />
              <span>Physical inspection completed with no damage or defects</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#FF4D1A] w-4 h-4" />
              <span>Mechanic installation / fitment test verified 100%</span>
            </label>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-start gap-2 text-[11px] text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              By clicking below, you instruct PartMatch Escrow to permanently disburse 85% to the seller and 15% to the mechanic.
            </span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{confirming ? "Releasing Escrow Payouts..." : "Confirm & Release Escrow Payouts"}</span>
          </button>
        </div>
      )}
    </main>
  );
}
