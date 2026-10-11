"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, MapPin, Wrench, X } from "lucide-react";
import { MechanicService } from "@/lib/services/mechanicService";

export default function MechanicJobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const router = useRouter();

  const [accepting, setAccepting] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    await MechanicService.acceptJob(jobId, "mechanic-001");
    setAccepting(false);
    router.push(`/mechanic/job/active/${jobId}`);
  };

  const handleDecline = () => {
    router.push("/mechanic/jobs");
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-24 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Job Overview</h1>
          <p className="text-[11px] text-[#8A8A8A]">Ref: PM-REF-{jobId?.substring(0, 6)}</p>
        </div>
      </header>

      {/* Escrow Guarantee Status Card */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[16px] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs text-emerald-900">
            <p className="font-bold">15% Payout Guaranteed in Escrow</p>
            <p className="text-[10px] text-emerald-700">Funds locked until customer confirms installation</p>
          </div>
        </div>
        <span className="text-base font-extrabold text-[#FF4D1A]">₦2,850</span>
      </div>

      {/* Part & Vehicle Specifications */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <p className="text-xs font-bold text-[#121212]">Part & Vehicle Details</p>

        <div className="p-3 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] space-y-1.5 text-xs text-[#121212]">
          <p className="font-bold flex justify-between">
            <span>Part Name:</span>
            <span className="font-semibold text-[#8A8A8A]">Toyota Ceramic Brake Pads</span>
          </p>
          <p className="font-bold flex justify-between">
            <span>OEM Number:</span>
            <span className="font-mono text-[#121212]">OEM-04465-02220</span>
          </p>
          <p className="font-bold flex justify-between">
            <span>Target Vehicle:</span>
            <span className="font-semibold text-[#8A8A8A]">2012 Toyota Corolla 1.8L</span>
          </p>
        </div>
      </div>

      {/* Customer Location */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm">
        <p className="text-xs font-bold text-[#121212]">Installation Address</p>
        <div className="flex items-start gap-2 text-xs text-[#121212]">
          <MapPin className="w-4 h-4 text-[#FF4D1A] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Adekoya Street, Ikeja, Lagos</p>
            <p className="text-[11px] text-[#8A8A8A]">2.4 km away from your registered workshop</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action CTAs */}
      <div className="sticky bottom-4 bg-[#FFFBF5] pt-2 flex gap-2">
        <button
          onClick={handleDecline}
          className="w-1/3 h-14 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1 hover:bg-neutral-50 active:scale-[0.98] transition-transform"
        >
          <X className="w-4 h-4 text-neutral-500" />
          <span>Decline</span>
        </button>

        <button
          onClick={handleAccept}
          disabled={accepting}
          className="w-2/3 h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <Wrench className="w-4 h-4" />
          <span>{accepting ? "Accepting..." : "Accept Fitment Job"}</span>
        </button>
      </div>
    </main>
  );
}
