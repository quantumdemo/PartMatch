"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Car, Trash2, Scan, CheckCircle2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface VehicleDetail {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  plate_number?: string;
  engine_type?: string;
  created_at?: string;
}

export default function VehicleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params?.id as string;
  const supabase = createClient();

  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicle() {
      if (!vehicleId) return;
      setLoading(true);
      const { data } = await supabase.from("vehicles").select("*").eq("id", vehicleId).maybeSingle();
      setVehicle(data);
      setLoading(false);
    }

    loadVehicle();
  }, [vehicleId]);

  const handleDelete = async () => {
    if (!vehicleId) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      await supabase.from("vehicles").delete().eq("id", vehicleId).eq("owner_id", session.user.id);
      router.push("/garage");
    }
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-28 font-sans space-y-4">
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/garage")}
            className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#121212]">Vehicle Details</h1>
            <p className="text-xs text-[#8A8A8A]">Garage Vehicle Record</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="p-2.5 bg-red-50 text-red-600 rounded-[12px] border border-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </header>

      {loading ? (
        <div className="h-40 bg-neutral-200/80 rounded-[16px] animate-pulse" />
      ) : !vehicle ? (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-6 text-center text-xs text-[#8A8A8A]">
          Vehicle not found.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-[#FF4D1A]">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#121212]">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Fitment Ready</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EAEAEA] pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Engine / Machine:</span>
                <span className="font-bold text-[#121212]">{vehicle.engine_type || "Standard Engine"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">VIN Number:</span>
                <span className="font-mono font-bold text-[#121212]">{vehicle.vin || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Plate Number:</span>
                <span className="font-mono font-bold text-[#121212]">{vehicle.plate_number || "Not provided"}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(`/diagnose?vehicle_id=${vehicle.id}`)}
            className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
          >
            <Scan className="w-4 h-4" />
            <span>Diagnose Part for this Vehicle</span>
          </button>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
