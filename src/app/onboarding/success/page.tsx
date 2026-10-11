"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Shield, ArrowRight } from "lucide-react";

export default function OnboardingSuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans p-6 flex flex-col justify-center items-center max-w-[440px] mx-auto text-center">
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 space-y-6 shadow-sm w-full">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#121212]">Onboarding Complete!</h1>
          <p className="text-xs text-[#8A8A8A] leading-relaxed">
            Your profile setup and initial credentials have been recorded successfully.
          </p>
        </div>

        {/* KYC Pending Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-[12px] text-left space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <span>KYC Pending Verification</span>
          </div>
          <p className="text-[11px] text-amber-700 leading-snug">
            You can browse parts and mechanics on PartMatch, but escrow transactions remain locked until your KYC documents are approved.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] active:scale-[0.97] transition-transform text-white font-bold text-sm rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Go to Home Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
