"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Wrench, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MechanicDetail {
  user_id: string;
  full_name: string;
  formatted_address?: string;
  experience_years?: number;
  service_area_radius?: number;
}

export default function MechanicProfilePage() {
  const params = useParams();
  const mechanicId = params?.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [mechanic, setMechanic] = useState<MechanicDetail | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignedJobId, setAssignedJobId] = useState<string | null>(null);

  useEffect(() => {
    async function loadMechanic() {
      if (!mechanicId) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", mechanicId)
        .maybeSingle();

      setMechanic(data);
    }

    loadMechanic();
  }, [mechanicId]);

  const handleAssignJob = async () => {
    setAssigning(true);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const { data: jobData } = await supabase.from("mechanic_jobs").insert({
      mechanic_id: mechanicId,
      customer_id: userId,
      status: "PENDING",
      fee_amount: 5000,
      created_at: new Date().toISOString(),
    }).select().maybeSingle();

    setAssigning(false);
    const jobId = jobData?.id || "job-assigned";
    setAssignedJobId(jobId);
  };

  if (!mechanic) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 font-sans">
        <p className="text-xs text-[#8A8A8A]">Loading mechanic details...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Mobile Mechanic Profile</h1>
          <p className="text-[11px] text-[#8A8A8A]">Verified On-Site Inspection</p>
        </div>
      </header>

      {/* Profile Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-700 font-extrabold text-lg">
            {mechanic.full_name?.slice(0, 2).toUpperCase() || "ME"}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#121212]">{mechanic.full_name}</h2>
            <p className="text-xs text-[#8A8A8A]">{mechanic.formatted_address || "Lagos, Nigeria"}</p>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.9 Rating (38 Jobs)
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#EAEAEA] grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-[10px] text-[#8A8A8A]">Experience</p>
            <p className="font-bold text-[#121212]">{mechanic.experience_years || 5} Years</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8A8A8A]">Service Radius</p>
            <p className="font-bold text-[#121212]">{mechanic.service_area_radius || 15} km</p>
          </div>
        </div>
      </div>

      {/* Masked Contact Info */}
      <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] space-y-1.5 text-xs shadow-sm">
        <div className="font-bold text-[#121212] flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-[#FF4D1A]" />
          <span>Contact Number (Masked)</span>
        </div>
        <p className="text-[#8A8A8A] font-mono">+234 803 *** **89</p>
        <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
          Phone number unmasks automatically after mechanic accepts job request.
        </p>
      </div>

      {assignedJobId ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[16px] p-6 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-emerald-900">Job Request Sent!</h3>
          <p className="text-xs text-emerald-700">
            Mechanic notified. Funds reserved in Escrow until completion.
          </p>
          <button
            onClick={() => router.push(`/mechanics/job/${assignedJobId}`)}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Track Mechanic On The Way</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAssignJob}
          disabled={assigning}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <Wrench className="w-4 h-4" />
          <span>{assigning ? "Sending Request..." : "Assign Inspection & Installation Job"}</span>
        </button>
      )}
    </main>
  );
}
