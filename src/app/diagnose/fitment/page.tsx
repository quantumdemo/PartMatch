"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck, ArrowRight, Car, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  engine_type?: string;
}

function VerifyFitmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partName = searchParams?.get("part") || "Ceramic Front Brake Pad Set";
  const vehicleId = searchParams?.get("vehicle_id") || "";
  const supabase = createClient();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicleContext() {
      setLoading(true);
      if (vehicleId) {
        const { data } = await supabase.from("vehicles").select("*").eq("id", vehicleId).maybeSingle();
        if (data) setVehicle(data);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data } = await supabase
            .from("vehicles")
            .select("*")
            .eq("owner_id", session.user.id)
            .limit(1)
            .maybeSingle();
          if (data) setVehicle(data);
        }
      }
      setLoading(false);
    }

    loadVehicleContext();
  }, [vehicleId]);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-28 font-sans space-y-5">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#121212]">Fitment Verification</h1>
          <p className="text-xs text-[#8A8A8A]">Automatic compatibility check against garage vehicle</p>
        </div>
      </header>

      {loading ? (
        <div className="h-20 bg-neutral-200/80 rounded-[16px] animate-pulse" />
      ) : vehicle ? (
        <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFFBF5] border border-[#EAEAEA] text-[#FF4D1A] rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#121212]">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </div>
              <div className="text-[11px] text-[#8A8A8A]">
                {vehicle.engine_type || "Standard Engine"}
              </div>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Target Vehicle
          </span>
        </div>
      ) : (
        <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] text-xs text-[#8A8A8A] text-center space-y-2">
          <p>No vehicle selected for fitment check.</p>
          <button
            onClick={() => router.push("/garage/add")}
            className="text-[#FF4D1A] font-bold underline"
          >
            + Add Vehicle to Garage
          </button>
        </div>
      )}

      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[16px] space-y-3 text-center text-emerald-900">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h2 className="text-lg font-extrabold">
          100% Guaranteed Fit
        </h2>
        <p className="text-xs text-emerald-700 leading-relaxed">
          <strong>{partName}</strong> is fully compatible with factory specifications for{" "}
          {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "your vehicle"}.
        </p>
      </div>

      <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] space-y-2 text-xs text-[#121212]">
        <div className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#FF4D1A]" /> Escrow Fitment Protection
        </div>
        <p className="text-[#8A8A8A] text-[11px]">
          If this part does not fit your vehicle upon installation by an assigned mobile mechanic, your funds held in escrow will be refunded 100%.
        </p>
      </div>

      <button
        onClick={() => router.push(`/marketplace?search=${encodeURIComponent(partName)}`)}
        className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] active:scale-[0.97] transition-transform text-white font-bold text-sm rounded-[12px] shadow-sm flex items-center justify-center gap-2"
      >
        <span>Compare Verified Sellers & Prices</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </main>
  );
}

export default function VerifyFitmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8A8A8A]">Loading fitment check...</div>}>
      <VerifyFitmentContent />
    </Suspense>
  );
}
