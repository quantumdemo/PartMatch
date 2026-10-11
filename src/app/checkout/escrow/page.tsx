"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, ChevronRight, Lock } from "lucide-react";
import { EscrowService, EscrowSplit } from "@/lib/services/escrowService";

function EscrowCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partId = searchParams?.get("part_id") || "part-001";

  const [partAmount] = useState<number>(18500);
  const [split, setSplit] = useState<EscrowSplit | null>(null);

  useEffect(() => {
    const calculated = EscrowService.calculateSplit(partAmount);
    setSplit(calculated);
  }, [partAmount]);

  if (!split) return null;

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
          <h1 className="text-base font-bold text-[#121212]">Escrow Contract Summary</h1>
          <p className="text-[11px] text-[#8A8A8A]">72-Hour Automatic Release Countdown</p>
        </div>
      </header>

      {/* Escrow Shield Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-[16px] flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">72-Hour Escrow Protection Contract</p>
          <p className="text-[11px] leading-relaxed">
            Your funds are held securely in PartMatch Escrow. Payment is released to the seller only after you or your designated mechanic confirms part fitment.
          </p>
        </div>
      </div>

      {/* Financial Split Breakdown */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <p className="text-xs font-bold text-[#121212]">Escrow Disbursement Breakdown</p>

        <div className="space-y-2 text-xs text-[#121212]">
          <div className="flex justify-between">
            <span className="text-[#8A8A8A]">Part Price (85% Seller Payout)</span>
            <span className="font-bold">₦{split.sellerAmount.toLocaleString("en-NG")} NGN</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8A8A8A]">Mechanic Inspection Reserve (15%)</span>
            <span className="font-bold">₦{split.mechanicAmount.toLocaleString("en-NG")} NGN</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8A8A8A]">Platform Escrow Fee (5%)</span>
            <span className="font-bold">₦{split.platformFee.toLocaleString("en-NG")} NGN</span>
          </div>

          <div className="flex justify-between border-t border-[#EAEAEA] pt-2 font-extrabold text-sm text-[#121212]">
            <span>Total Escrow Lock</span>
            <span>₦{split.totalAmount.toLocaleString("en-NG")} NGN</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => router.push(`/checkout/pay?part_id=${partId}&amount=${split.totalAmount}`)}
        className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
      >
        <Lock className="w-4 h-4" />
        <span>Fund Escrow (₦{split.totalAmount.toLocaleString("en-NG")})</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </main>
  );
}

export default function EscrowCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#8A8A8A]">Loading Escrow Checkout...</div>}>
      <EscrowCheckoutContent />
    </Suspense>
  );
}
