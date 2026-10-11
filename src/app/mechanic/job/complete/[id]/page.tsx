"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Wallet, ArrowLeft } from "lucide-react";

export default function CompleteJobPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const router = useRouter();

  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  const handleClaimPayout = () => {
    setReleasing(true);
    setTimeout(() => {
      setReleasing(false);
      setReleased(true);
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
          <h1 className="text-base font-bold text-[#121212]">Job Completed</h1>
          <p className="text-[11px] text-[#8A8A8A]">Ref: PM-REF-{jobId?.substring(0, 6)}</p>
        </div>
      </header>

      {released ? (
        /* Payout Released Banner */
        <div className="bg-white border border-emerald-200 rounded-[16px] p-6 text-center space-y-4 shadow-sm my-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">₦2,850 Payout Credited!</h2>
            <p className="text-xs text-[#8A8A8A]">
              Your 15% mechanic inspection payout has been credited to your PartMatch Wallet.
            </p>
          </div>
          <button
            onClick={() => router.push("/mechanic/wallet")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm flex items-center justify-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>Go to Mechanic Wallet</span>
          </button>
        </div>
      ) : (
        /* Final Release Claim UI */
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm my-4">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">15% Mechanic Fee Payout</span>
            <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
              ₦2,850
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-[12px] flex items-center gap-2 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Customer has signed off on the fitment photo proof. Click below to claim payout.</span>
          </div>

          <button
            onClick={handleClaimPayout}
            disabled={releasing}
            className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
          >
            <Wallet className="w-4 h-4" />
            <span>{releasing ? "Processing Atomic Payout..." : "Claim ₦2,850 Mechanic Payout"}</span>
          </button>
        </div>
      )}
    </main>
  );
}
