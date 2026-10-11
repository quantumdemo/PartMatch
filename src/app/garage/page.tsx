"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Car, Trash2, ArrowLeft, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface VehicleItem {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  plate_number?: string;
  engine_type?: string;
}

export default function GaragePage() {
  const router = useRouter();
  const supabase = createClient();

  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data } = await supabase
          .from("vehicles")
          .select("*")
          .eq("owner_id", userId)
          .order("created_at", { ascending: false });

        setVehicles(data || []);
      } else {
        setVehicles([]);
      }
      setLoading(false);
    }

    fetchVehicles();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (userId) {
      await supabase.from("vehicles").delete().eq("id", id).eq("owner_id", userId);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-28 font-sans space-y-4">
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#121212]">My Garage</h1>
            <p className="text-xs text-[#8A8A8A]">Save vehicles for instant fitment verification</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/garage/add")}
          className="p-2.5 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white rounded-[12px] flex items-center justify-center shadow-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </header>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : vehicles.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 bg-[#FFFBF5] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto text-[#FF4D1A]">
            <Car className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No vehicle yet</h2>
            <p className="text-xs text-[#8A8A8A] max-w-[280px] mx-auto">
              Add your car or fleet vehicle to guarantee 100% part compatibility before making escrow payments.
            </p>
          </div>
          <button
            onClick={() => router.push("/garage/add")}
            className="w-full h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Vehicle</span>
          </button>
        </div>
      ) : (
        /* Real Vehicles List */
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => router.push(`/garage/${v.id}`)}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#FF4D1A] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#121212]">
                    {v.year} {v.make} {v.model}
                  </span>
                </div>
                {v.vin && <p className="text-[11px] text-[#8A8A8A] font-mono">VIN: {v.vin}</p>}
                {v.plate_number && (
                  <p className="text-[11px] text-[#8A8A8A] font-mono">Plate: {v.plate_number}</p>
                )}
                {v.engine_type && (
                  <p className="text-[11px] text-[#8A8A8A]">Engine: {v.engine_type}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDelete(v.id, e)}
                  className="p-2 text-neutral-400 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
              </div>
            </div>
          ))}

          <button
            onClick={() => router.push("/garage/add")}
            className="w-full h-12 bg-white border border-dashed border-[#FF4D1A] text-[#FF4D1A] text-xs font-bold rounded-[12px] flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Vehicle</span>
          </button>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
