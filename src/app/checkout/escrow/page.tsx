"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { EscrowService } from "@/lib/services/escrowService";

export default function CheckoutEscrowPage() {
  const partsSubtotal = 18500;
  const split = EscrowService.calculateSplit(partsSubtotal);
  const now = new Date();
  const formatWAT = `${now.getDate()} Oct ${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()} WAT`;

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-24 font-sans space-y-6">
      <header className="border-b border-[#EAEAEA] pb-4">
        <span className="text-[10px] font-bold text-[#FF4D1A] bg-[#FF4D1A]/10 px-2.5 py-0.5 rounded-full">
          Escrow Terms & Protection
        </span>
        <h1 className="text-2xl font-bold text-[#121212] mt-1">Order Checkout</h1>
        <p className="text-xs text-[#8A8A8A]">Ref: PM-REF-20261011-829A</p>
      </header>

      {/* Escrow Protection Banner */}
      <div className="p-4 bg-[#FF4D1A]/10 border border-[#FF4D1A]/30 rounded-[16px] space-y-2 text-xs text-[#121212]">
        <div className="font-bold flex items-center gap-1.5 text-[#FF4D1A]">
          <ShieldCheck className="w-5 h-5 shrink-0" /> Payment Protected by Escrow
        </div>
        <p className="text-[11px] leading-relaxed text-[#8A8A8A]">
          Money is held securely by PartMatch for 72 hours WAT. Funds are released to merchant and mechanic ONLY after you confirm delivery and installation.
        </p>
      </div>

      {/* Shipping Address */}
      <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] space-y-2 text-xs">
        <div className="font-bold text-[#121212] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#FF4D1A]" /> Delivery Shipping Address <InfoTooltip id="proof_address" />
        </div>
        <p className="text-[#8A8A8A] text-[11px]">
          14 Ladipo Auto Market Road, Mushin, Lagos State, Nigeria
        </p>
      </div>

      {/* Payment Settlement Split Breakdown */}
      <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] space-y-3 text-xs">
        <div className="font-bold text-[#121212] border-b border-[#EAEAEA] pb-2 flex items-center justify-between">
          <span>Escrow Financial Allocation</span>
          <span className="text-[10px] text-[#8A8A8A] font-mono">{formatWAT}</span>
        </div>

        <div className="space-y-2 text-[#8A8A8A]">
          <div className="flex justify-between">
            <span>Parts Seller Allocation (85%)</span>
            <span className="font-mono text-[#121212]">₦{split.sellerAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Mobile Mechanic Fee (15%)</span>
            <span className="font-mono text-[#121212]">₦{split.mechanicAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Commission Fee (5%)</span>
            <span className="font-mono text-[#121212]">₦{split.platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-[#EAEAEA] pt-2 font-extrabold text-sm text-[#121212]">
            <span>Total Escrow Lock</span>
            <span>₦{split.total.toLocaleString()} NGN</span>
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 pt-2">
        <Link
          href="/checkout/pay"
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <span>Confirm & Pay ₦{split.total.toLocaleString()}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
