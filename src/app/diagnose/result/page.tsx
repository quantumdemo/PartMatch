"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function AIResultPage() {
  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-24 font-sans space-y-6">
      <header className="border-b border-[#EAEAEA] pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D1A] bg-[#FF4D1A]/10 px-2.5 py-0.5 rounded-full">
          Scan Identified
        </span>
        <h1 className="text-2xl font-bold text-[#121212] mt-1">Diagnostic Match Result</h1>
      </header>

      {/* Result Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 94% AI Confidence
          </span>
          <span className="text-xs font-mono text-[#8A8A8A]">OEM-04465-02220</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-[#121212]">
            Front Brake Pads (Ceramic Set) <InfoTooltip id="nin" />
          </h2>
          <p className="text-xs text-[#8A8A8A]">
            Compatible with Toyota Corolla (2009–2019) & Toyota Matrix
          </p>
        </div>

        <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-xl text-xs space-y-1">
          <div className="font-bold text-[#121212] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#FF4D1A]" /> Estimated Market Price
          </div>
          <div className="text-2xl font-extrabold text-[#121212]">₦18,500 <span className="text-xs font-normal text-[#8A8A8A]">NGN</span></div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/diagnose/fitment"
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white font-bold text-sm rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <span>Verify Fitment with My Garage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/diagnose/search"
          className="w-full py-3 bg-white border border-[#EAEAEA] text-[#121212] font-semibold text-xs rounded-[12px] flex items-center justify-center text-center"
        >
          Not the right part? Search Catalogue Manually
        </Link>
      </div>
    </main>
  );
}
