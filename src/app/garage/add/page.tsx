"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AddVehiclePage() {
  const router = useRouter();
  const supabase = createClient();

  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<number>(2014);
  const [vin, setVin] = useState<string>("");
  const [plateNumber, setPlateNumber] = useState<string>("");
  const [engineType, setEngineType] = useState<string>("");

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!make.trim() || !model.trim() || !year) {
      setError("Vehicle Make, Model, and Year are required.");
      return;
    }

    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      setError("Please log in to add a vehicle.");
      setSaving(false);
      return;
    }

    const { error: insertErr } = await supabase.from("vehicles").insert({
      owner_id: userId,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      vin: vin.trim() || null,
      plate_number: plateNumber.trim().toUpperCase() || null,
      engine_type: engineType.trim() || null,
      created_at: new Date().toISOString(),
    });

    setSaving(false);

    if (insertErr) {
      setError(insertErr.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/garage"), 800);
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
          <label className="text-xs font-bold text-[#121212]">Vehicle Make (Manufacturer) *</label>
          <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="e.g. Toyota, Honda, Mercedes-Benz"
            required
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">Vehicle Model *</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Corolla, Camry, Accord, C300"
            required
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">Production Year *</label>
          <input
            type="number"
            min={1990}
            max={2026}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            required
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">Machine / Engine Type</label>
          <input
            type="text"
            value={engineType}
            onChange={(e) => setEngineType(e.target.value)}
            placeholder="e.g. 1.8L 4-Cylinder, V6, 2.4L i-VTEC"
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">VIN (17-Digit Vehicle Identification)</label>
          <input
            type="text"
            maxLength={17}
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="e.g. 4T1B11HK..."
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-mono focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">License Plate Number</label>
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            placeholder="e.g. EKY-123AA"
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-mono focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <div className="pt-2">
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
