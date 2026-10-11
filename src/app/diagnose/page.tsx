"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Upload, Mic, FileText, ArrowRight, Car, AlertCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface GarageVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
}

const METHODS = [
  {
    id: "camera",
    title: "Take Photo of Part",
    description: "Point camera at the broken or replacement spare part",
    icon: Camera,
  },
  {
    id: "upload",
    title: "Upload Part Image",
    description: "Select photo from gallery or mechanic diagnosis slip",
    icon: Upload,
  },
  {
    id: "sound",
    title: "Record Engine Sound",
    description: "Capture knocking or squeaking audio for AI noise analysis",
    icon: Mic,
  },
  {
    id: "text",
    title: "Describe Vehicle Problem",
    description: "Type symptoms e.g. 'hard brake pedal or overheating'",
    icon: FileText,
  },
];

function DiagnoseMethodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVehicleId = searchParams?.get("vehicle_id") || "";
  const supabase = createClient();

  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicleId);
  const [descriptionText, setDescriptionText] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("camera");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGarage() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from("vehicles")
          .select("id, make, model, year")
          .eq("owner_id", session.user.id);

        if (data && data.length > 0) {
          setVehicles(data);
          if (!selectedVehicleId) {
            setSelectedVehicleId(data[0].id);
          }
        }
      }
    }
    fetchGarage();
  }, [selectedVehicleId]);

  const handleProceed = () => {
    setError(null);
    if (!selectedVehicleId && vehicles.length > 0) {
      setError("Please select a vehicle from your garage for fitment match.");
      return;
    }

    const query = new URLSearchParams({
      vehicle_id: selectedVehicleId,
      method: selectedMethod,
      description: descriptionText,
    });

    router.push(`/diagnose/scanning?${query.toString()}`);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-28 font-sans space-y-6">
      <header className="border-b border-[#EAEAEA] pb-4">
        <h1 className="text-2xl font-bold text-[#121212]">AI Part Diagnosis</h1>
        <p className="text-xs text-[#8A8A8A]">Select diagnostic method & vehicle from your garage</p>
      </header>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Select Vehicle from Garage */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm">
        <label className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
          <Car className="w-4 h-4 text-[#FF4D1A]" />
          Select Target Vehicle (Required)
        </label>
        {vehicles.length === 0 ? (
          <div className="text-xs text-[#8A8A8A] space-y-2">
            <p>No vehicle in garage yet. Add a vehicle first for fitment guarantee.</p>
            <button
              onClick={() => router.push("/garage/add")}
              className="text-xs font-bold text-[#FF4D1A] underline"
            >
              + Add Vehicle to Garage
            </button>
          </div>
        ) : (
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full h-11 px-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs font-bold text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.year} {v.make} {v.model}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Select Diagnostic Method Cards */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#121212]">Choose Diagnostic Method</label>
        <div className="grid grid-cols-1 gap-2.5">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMethod === m.id;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`p-4 rounded-[16px] cursor-pointer flex items-center justify-between transition-all active:scale-[0.98] ${
                  isSelected
                    ? "bg-white border-2 border-[#FF4D1A] shadow-md"
                    : "bg-white border border-[#EAEAEA] shadow-sm hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[#FF4D1A] text-white"
                        : "bg-[#FFFBF5] border border-[#EAEAEA] text-[#121212]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-[#121212]">{m.title}</h3>
                    <p className="text-xs text-[#8A8A8A] leading-tight">{m.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional symptom text description */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-1.5 shadow-sm">
        <label className="text-xs font-bold text-[#121212]">Describe Problem or Symptom Details</label>
        <textarea
          rows={3}
          value={descriptionText}
          onChange={(e) => setDescriptionText(e.target.value)}
          placeholder="e.g. Squealing noise when applying brake, or metallic knocking sound under load..."
          className="w-full p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
        />
      </div>

      <button
        type="button"
        onClick={handleProceed}
        className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] active:scale-[0.97] transition-transform text-white font-bold text-sm rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
      >
        <span>Start AI Scanning</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <BottomNav />
    </main>
  );
}

export default function DiagnoseMethodPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8A8A8A]">Loading diagnosis...</div>}>
      <DiagnoseMethodContent />
    </Suspense>
  );
}
