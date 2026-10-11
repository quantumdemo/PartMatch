"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { VehicleService } from "@/lib/services/vehicleService";

export default function AddVehiclePage() {
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<number>(2014);
  const [vin, setVin] = useState<string>("");
  const [plateNumber, setPlateNumber] = useState<string>("");

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();
  const userId = "123e4567-e89b-12d3-a456-426614174000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!make || !model || !year) {
      setError("Vehicle Make, Model, and Year are mandatory.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await VehicleService.addVehicle(userId, {
        make,
        model,
        year: Number(year),
        vin,
        plate_number: plateNumber,
      });

      setSuccess(true);
      setTimeout(() => router.push("/garage"), 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add vehicle.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-24 font-sans">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-4 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#121212]">Add Vehicle to Garage</h1>
          <p className="text-xs text-[#8A8A8A]">Enable automatic fitment compatibility check</p>
        </div>
      </header>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[16px] mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[16px] mb-4 text-center space-y-1">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
          <p className="font-bold">Vehicle Saved to Garage!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">Vehicle Make (Manufacturer)</label>
          <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="e.g. Toyota, Honda, Mercedes-Benz"
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">Vehicle Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Corolla, Camry, Accord, C300"
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">Production Year</label>
          <input
            type="number"
            min={1990}
            max={2026}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212] flex items-center">
            VIN (17-Digit Vehicle Identification) <InfoTooltip id="nin" />
          </label>
          <input
            type="text"
            maxLength={17}
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Optional 17-digit VIN e.g. 4T1B11HK..."
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">Nigerian License Plate Number (Optional)</label>
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            placeholder="e.g. EKY-123AA"
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="sticky bottom-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          >
            <Plus className="w-4 h-4" />
            {saving ? "Saving Vehicle..." : "Save Vehicle to Garage"}
          </button>
        </div>
      </form>
    </main>
  );
}
