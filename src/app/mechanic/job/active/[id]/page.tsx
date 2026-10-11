"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Camera } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function ActiveJobPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const router = useRouter();

  const [status, setStatus] = useState<"ARRIVED" | "INSTALLING" | "PROOFS_ADDED">("ARRIVED");

  const handleNext = () => {
    if (status === "ARRIVED") setStatus("INSTALLING");
    else if (status === "INSTALLING") setStatus("PROOFS_ADDED");
    else if (status === "PROOFS_ADDED") router.push(`/mechanic/job/complete/${jobId}`);
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
          <h1 className="text-base font-bold text-[#121212]">Active Inspection & Fitment</h1>
          <p className="text-[11px] text-[#8A8A8A]">Job Ref: PM-REF-{jobId?.substring(0, 6)}</p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-[#121212]">
          <span>Installation Workflow</span>
          <span className="text-[10px] text-[#FF4D1A] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className={`h-2 rounded-full ${status === "ARRIVED" || status === "INSTALLING" || status === "PROOFS_ADDED" ? "bg-[#FF4D1A]" : "bg-neutral-200"}`} />
          <div className={`h-2 rounded-full ${status === "INSTALLING" || status === "PROOFS_ADDED" ? "bg-[#FF4D1A]" : "bg-neutral-200"}`} />
          <div className={`h-2 rounded-full ${status === "PROOFS_ADDED" ? "bg-[#FF4D1A]" : "bg-neutral-200"}`} />
        </div>
      </div>

      {/* Checklist Form */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <h2 className="text-xs font-bold text-[#121212] flex items-center">
          Fitment Checklist & Proof <InfoTooltip id="kyc" />
        </h2>

        <div className="space-y-2.5 text-xs text-[#121212]">
          <label className="flex items-center gap-2 p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#FF4D1A] w-4 h-4" />
            <span>Customer vehicle and part OEM number verified</span>
          </label>

          <label className="flex items-center gap-2 p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#FF4D1A] w-4 h-4" />
            <span>Old part removed and new part installed to factory specs</span>
          </label>

          <label className="flex items-center gap-2 p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#FF4D1A] w-4 h-4" />
            <span>Post-installation test drive completed with customer</span>
          </label>
        </div>

        {/* Photo Proof Upload Area */}
        <div className="p-4 border border-dashed border-[#FF4D1A] bg-[#FFFBF5] rounded-[12px] text-center space-y-2">
          <Camera className="w-6 h-6 text-[#FF4D1A] mx-auto" />
          <p className="text-xs font-bold text-[#121212]">Upload Installed Part Photo Proof</p>
          <p className="text-[10px] text-[#8A8A8A]">Camera photo required for escrow release approval</p>
        </div>

        <button
          onClick={handleNext}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {status === "ARRIVED"
              ? "Confirm Arrival & Start Work"
              : status === "INSTALLING"
              ? "Attach Proof Photo & Proceed"
              : "Proceed to Payout Completion"}
          </span>
        </button>
      </div>
    </main>
  );
}
