"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Clock, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function MechanicTrackingPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [jobStatus, setJobStatus] = useState<string>("ACCEPTED");

  useEffect(() => {
    async function loadJobStatus() {
      if (!jobId) return;
      const { data } = await supabase.from("mechanic_jobs").select("*").eq("id", jobId).maybeSingle();
      if (data?.status) setJobStatus(data.status);
    }
    loadJobStatus();
  }, [jobId]);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Mechanic Live Location</h1>
          <p className="text-[11px] text-[#8A8A8A]">Job Ref: {jobId?.substring(0, 8)}</p>
        </div>
      </header>

      {/* Map simulation container */}
      <div className="w-full h-56 bg-[#121212] rounded-[16px] p-4 flex flex-col justify-between text-white relative shadow-md overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] bg-[#FF4D1A] text-white font-bold px-2 py-0.5 rounded-full">
            Status: {jobStatus}
          </span>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> ETA: 18 mins
          </span>
        </div>

        <div className="z-10 text-center space-y-1">
          <MapPin className="w-8 h-8 text-[#FF4D1A] mx-auto animate-bounce" />
          <p className="text-xs font-bold text-white">Mechanic En Route via Lagos Express Way</p>
          <p className="text-[10px] text-neutral-400">Arriving at your installation location shortly</p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-800 pt-2">
          <span>Mapbox Live Route</span>
          <span>15% Inspection Fee Escrow Locked</span>
        </div>
      </div>

      {/* Unmasked Phone Option if accepted */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#121212]">Direct Mechanic Call</p>
            <p className="text-[11px] font-mono text-[#8A8A8A]">+234 803 123 4589</p>
          </div>
        </div>
        <a
          href="tel:+2348031234589"
          className="px-3 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px]"
        >
          Call Now
        </a>
      </div>

      <button
        onClick={() => router.push(`/delivery/confirm/${jobId}`)}
        className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
      >
        <Wrench className="w-4 h-4" />
        <span>Proceed to Confirm Installation</span>
      </button>
    </main>
  );
}
