"use client";

import React, { useState } from "react";
import { AlertOctagon, ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function AdminDisputesPage() {
  const [resolved, setResolved] = useState<string | null>(null);

  const handleResolve = (action: string) => {
    setResolved(action);
    setTimeout(() => setResolved(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#121212]">Dispute Arbitration & Resolution</h1>
        <p className="text-xs text-[#8A8A8A]">Review Photo Evidence & Settle Escrow Disputes</p>
      </div>

      {resolved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[16px] text-xs text-emerald-900 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Dispute settled via {resolved}. Escrow funds disbursed atomically.</span>
        </div>
      )}

      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-xs font-bold text-[#121212]">Dispute Case #DSP-881023</p>
              <p className="text-[11px] text-[#8A8A8A]">Order: PM-REF-11111111 • Reason: Incompatible Fitment</p>
            </div>
          </div>
          <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
            Under Arbitration
          </span>
        </div>

        <div className="p-3 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] space-y-1 text-xs text-[#121212]">
          <p className="font-bold flex items-center">
            Buyer Claims: <InfoTooltip id="kyc" />
          </p>
          <p className="text-[#8A8A8A] leading-relaxed">
            "Brake pads delivered do not match the OEM specifications for Toyota Corolla 2012. Mechanic fitment failed."
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => handleResolve("REFUND_BUYER")}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Full Refund to Buyer</span>
          </button>

          <button
            onClick={() => handleResolve("RELEASE_SELLER")}
            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Release Payout to Seller</span>
          </button>
        </div>
      </div>
    </div>
  );
}
