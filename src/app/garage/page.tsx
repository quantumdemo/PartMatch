"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Car, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { VehicleService, Vehicle } from "@/lib/services/vehicleService";

export default function GarageListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = "123e4567-e89b-12d3-a456-426614174000";

  const fetchGarage = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await VehicleService.getUserVehicles(userId);
      setVehicles(list);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load garage vehicles.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarage();
  }, []);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pb-24 pt-6 font-sans">
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#121212]">My Garage</h1>
          <p className="text-xs text-[#8A8A8A]">Save your vehicles for 100% fitment matching</p>
        </div>
        <Link
          href="/garage/add"
          className="w-10 h-10 bg-[#FF4D1A] text-white rounded-xl flex items-center justify-center shadow-sm active:scale-[0.97] transition-transform"
        >
          <Plus className="w-5 h-5" />
        </Link>
      </header>

      {/* STATE 1: LOADING SKELETON */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* STATE 2: ERROR STATE WITH RETRY */}
      {!loading && error && (
        <div className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-[16px] text-xs space-y-3 text-center">
          <AlertCircle className="w-6 h-6 mx-auto text-red-600" />
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchGarage}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
          </button>
        </div>
      )}

      {/* STATE 3: EMPTY STATE */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="p-8 bg-white border border-[#EAEAEA] rounded-[16px] text-center space-y-4 my-8">
          <div className="w-12 h-12 bg-[#FFFBF5] text-[#FF4D1A] rounded-2xl flex items-center justify-center mx-auto border border-[#EAEAEA]">
            <Car className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-[#121212]">No Vehicles in Garage</h3>
            <p className="text-xs text-[#8A8A8A]">
              Add your car make, model, and year to automatically verify compatible spare parts.
            </p>
          </div>
          <Link
            href="/garage/add"
            className="w-full py-3 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] inline-block shadow-sm active:scale-[0.97] transition-transform"
          >
            Add Your First Vehicle
          </Link>
        </div>
      )}

      {/* VEHICLES LIST */}
      {!loading && !error && vehicles.length > 0 && (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div key={v.id} className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#121212]">
                  {v.year} {v.make} {v.model}
                </h3>
                <p className="text-xs text-[#8A8A8A] font-mono">
                  VIN: {v.vin || "Not set"} | Plate: {v.plate_number || "Not set"}
                </p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
