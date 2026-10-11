"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Upload, Mic, FileText, ArrowRight, Car, AlertCircle, CheckCircle2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface GarageVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
}

function DiagnoseMethodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVehicleId = searchParams?.get("vehicle_id") || "";
  const supabase = createClient();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const soundInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicleId);
  const [descriptionText, setDescriptionText] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("camera");
  const [capturedFileName, setCapturedFileName] = useState<string | null>(null);
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

  const handleProceed = (overrides?: { method?: string; description?: string }) => {
    setError(null);
    if (!selectedVehicleId && vehicles.length > 0) {
      setError("Please select a vehicle from your garage for fitment match.");
      return;
    }

    const activeMethod = overrides?.method || selectedMethod;
    const activeDesc = overrides?.description !== undefined ? overrides.description : descriptionText;

    const query = new URLSearchParams({
      vehicle_id: selectedVehicleId,
      method: activeMethod,
      description: activeDesc || (capturedFileName ? `Attached file: ${capturedFileName}` : ""),
    });

    router.push(`/diagnose/scanning?${query.toString()}`);
  };

  const handleMethodCardClick = (methodId: string) => {
    setSelectedMethod(methodId);
    setError(null);

    if (methodId === "camera") {
      cameraInputRef.current?.click();
    } else if (methodId === "upload") {
      uploadInputRef.current?.click();
    } else if (methodId === "sound") {
      soundInputRef.current?.click();
    } else if (methodId === "text") {
      textInputRef.current?.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, methodId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedFileName(file.name);
      setSelectedMethod(methodId);
      // Auto trigger scanning with file reference
      handleProceed({ method: methodId, description: `File attached: ${file.name}` });
    }
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

      {/* Hidden File & Camera Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileChange(e, "camera")}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "upload")}
      />
      <input
        ref={soundInputRef}
        type="file"
        accept="audio/*,video/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "sound")}
      />

      {/* Select Diagnostic Method Cards */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#121212]">Choose Diagnostic Method</label>
        <div className="grid grid-cols-1 gap-2.5">
          {/* 1. Take Photo */}
          <button
            type="button"
            onClick={() => handleMethodCardClick("camera")}
            className={`w-full p-4 text-left rounded-[16px] transition-all active:scale-[0.98] flex items-center justify-between ${
              selectedMethod === "camera"
                ? "bg-white border-2 border-[#FF4D1A] shadow-md"
                : "bg-white border border-[#EAEAEA] shadow-sm hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedMethod === "camera" ? "bg-[#FF4D1A] text-white" : "bg-[#FFFBF5] border border-[#EAEAEA] text-[#121212]"
              }`}>
                <Camera className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-[#121212]">Take Photo of Part</h3>
                <p className="text-xs text-[#8A8A8A] leading-tight">Point camera at the broken or replacement spare part</p>
              </div>
            </div>
            {selectedMethod === "camera" && capturedFileName && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
          </button>

          {/* 2. Upload Photo */}
          <button
            type="button"
            onClick={() => handleMethodCardClick("upload")}
            className={`w-full p-4 text-left rounded-[16px] transition-all active:scale-[0.98] flex items-center justify-between ${
              selectedMethod === "upload"
                ? "bg-white border-2 border-[#FF4D1A] shadow-md"
                : "bg-white border border-[#EAEAEA] shadow-sm hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedMethod === "upload" ? "bg-[#FF4D1A] text-white" : "bg-[#FFFBF5] border border-[#EAEAEA] text-[#121212]"
              }`}>
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-[#121212]">Upload Part Image</h3>
                <p className="text-xs text-[#8A8A8A] leading-tight">Select photo from gallery or mechanic diagnosis slip</p>
              </div>
            </div>
            {selectedMethod === "upload" && capturedFileName && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
          </button>

          {/* 3. Record Sound */}
          <button
            type="button"
            onClick={() => handleMethodCardClick("sound")}
            className={`w-full p-4 text-left rounded-[16px] transition-all active:scale-[0.98] flex items-center justify-between ${
              selectedMethod === "sound"
                ? "bg-white border-2 border-[#FF4D1A] shadow-md"
                : "bg-white border border-[#EAEAEA] shadow-sm hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedMethod === "sound" ? "bg-[#FF4D1A] text-white" : "bg-[#FFFBF5] border border-[#EAEAEA] text-[#121212]"
              }`}>
                <Mic className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-[#121212]">Record Engine Sound</h3>
                <p className="text-xs text-[#8A8A8A] leading-tight">Capture knocking or squeaking audio for AI noise analysis</p>
              </div>
            </div>
            {selectedMethod === "sound" && capturedFileName && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
          </button>

          {/* 4. Describe Problem */}
          <button
            type="button"
            onClick={() => handleMethodCardClick("text")}
            className={`w-full p-4 text-left rounded-[16px] transition-all active:scale-[0.98] flex items-center justify-between ${
              selectedMethod === "text"
                ? "bg-white border-2 border-[#FF4D1A] shadow-md"
                : "bg-white border border-[#EAEAEA] shadow-sm hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedMethod === "text" ? "bg-[#FF4D1A] text-white" : "bg-[#FFFBF5] border border-[#EAEAEA] text-[#121212]"
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-[#121212]">Describe Vehicle Problem</h3>
                <p className="text-xs text-[#8A8A8A] leading-tight">Type symptoms e.g. &apos;hard brake pedal or overheating&apos;</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Symptom text description - Disabled unless Describe Vehicle Problem option is selected */}
      <div className={`bg-white border rounded-[16px] p-4 space-y-1.5 shadow-sm transition-opacity ${
        selectedMethod === "text" ? "border-[#FF4D1A] opacity-100" : "border-[#EAEAEA] opacity-60"
      }`}>
        <label className="text-xs font-bold text-[#121212] flex items-center justify-between">
          <span>Describe Problem or Symptom Details</span>
          {selectedMethod !== "text" && (
            <span className="text-[10px] font-normal text-[#8A8A8A] bg-[#FFFBF5] px-2 py-0.5 rounded-full border border-[#EAEAEA]">
              Select &apos;Describe Vehicle Problem&apos; above to edit
            </span>
          )}
        </label>
        <textarea
          ref={textInputRef}
          rows={3}
          disabled={selectedMethod !== "text"}
          value={descriptionText}
          onChange={(e) => setDescriptionText(e.target.value)}
          placeholder={
            selectedMethod === "text"
              ? "e.g. Squealing noise when applying brake, or metallic knocking sound under load..."
              : "Select 'Describe Vehicle Problem' above to enable symptom text input"
          }
          className="w-full p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A] disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-[#8A8A8A]"
        />
        {capturedFileName && (
          <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> File Selected: {capturedFileName}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => handleProceed()}
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
