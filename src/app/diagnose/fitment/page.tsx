"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, Car } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function VerifyFitmentPage() {
  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-24 font-sans space-y-6">
      <header className="border-b border-[#EAEAEA] pb-4">
        <h1 className="text-2xl font-bold text-[#121212]">Fitment Verification</h1>
        <p className="text-xs text-[#8A8A8A]">Automatic compatibility check against active vehicle</p>
      </header>

      {/* Active Garage Vehicle Banner */}
      <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFFBF5] border border-[#EAEAEA] text-[#FF4D1A] rounded-xl flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#121212]">2012 Toyota Corolla</div>
            <div className="text-[11px] text-[#8A8A8A] font-mono">1.8L L4 DOHC 16V Engine</div>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
          Active
        </span>
      </div>

      {/* Compatibility Result Box */}
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[16px] space-y-3 text-center text-emerald-900">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h2 className="text-lg font-extrabold flex items-center justify-center gap-1">
          100% Fits Your Vehicle <InfoTooltip id="nin" />
        </h2>
        <p className="text-xs text-emerald-700 leading-relaxed">
          Front Ceramic Brake Pads (OEM-04465-02220) match factory rotor dimensions and brake caliper brackets for Toyota Corolla 2012.
        </p>
      </div>

      <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] space-y-2 text-xs text-[#121212]">
        <div className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#FF4D1A]" /> Guaranteed Fit Protection
        </div>
        <p className="text-[#8A8A8A] text-[11px]">
          If this part does not fit your 2012 Toyota Corolla upon arrival, PartMatch will provide a 100% full refund under Escrow Protection.
        </p>
      </div>

      <Link
        href="/marketplace/part-brake-pads-001"
        className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white font-bold text-sm rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
      >
        <span>Compare Verified Sellers & Prices</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </main>
  );
}
