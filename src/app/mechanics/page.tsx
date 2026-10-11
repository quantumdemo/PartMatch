"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Star, ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface MechanicProfile {
  user_id: string;
  full_name: string;
  formatted_address?: string;
  service_area_radius?: number;
  experience_years?: number;
  online_status?: boolean;
  avatar_url?: string;
}

export default function MechanicsNearMePage() {
  const router = useRouter();
  const supabase = createClient();

  const [mechanics, setMechanics] = useState<MechanicProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOnlineMechanics() {
      setLoading(true);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["R-04", "mechanic"]);

      setMechanics(data || []);
      setLoading(false);
    }

    fetchOnlineMechanics();
  }, []);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-[#121212]">Mobile Mechanics Near Me</h1>
          <p className="text-[10px] text-[#8A8A8A]">Escrow-Protected Inspection & Fitment</p>
        </div>
        <div className="w-8" />
      </header>

      {/* Map simulation banner */}
      <div className="w-full h-32 bg-[#121212] rounded-[16px] p-4 flex flex-col justify-between text-white shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-xs text-[#FF4D1A] font-bold">
          <MapPin className="w-4 h-4" />
          <span>Active Map Area: Lagos, Nigeria</span>
        </div>
        <p className="text-xs text-neutral-300">
          Mobile mechanics nearby ready for on-site inspection & installation.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : mechanics.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <Wrench className="w-12 h-12 text-[#8A8A8A] mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No mechanics nearby</h2>
            <p className="text-xs text-[#8A8A8A]">Try increasing search radius or check back shortly.</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {mechanics.map((m) => (
            <div
              key={m.user_id}
              onClick={() => router.push(`/mechanics/${m.user_id}`)}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex items-center justify-between cursor-pointer hover:border-[#FF4D1A] transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-700 font-bold text-sm">
                  {m.full_name?.slice(0, 2).toUpperCase() || "ME"}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-[#121212]">{m.full_name || "Verified Mobile Mechanic"}</h3>
                  <p className="text-[10px] text-[#8A8A8A]">
                    {m.formatted_address || "Lagos, Nigeria"} • {m.experience_years || 5} yrs exp
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9 Rating • Available Now
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-xs font-extrabold text-[#FF4D1A]">15% Job Fee</span>
                <div className="flex items-center text-xs text-[#FF4D1A] font-bold gap-0.5 justify-end">
                  <span>Assign</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
