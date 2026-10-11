"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Wrench } from "lucide-react";
import { LiveVerificationCamera } from "@/components/LiveVerificationCamera";
import { LocationPickerMap } from "@/components/LocationPickerMap";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function MechanicOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"VERIFY" | "MAP" | "SUBMITTED">("VERIFY");
  const [location, setLocation] = useState({ lat: 6.5244, lng: 3.3792, address: "Ikeja Auto Hub, Lagos" });

  const handleVerified = (capturedImage: string) => {
    console.log("Captured image length:", capturedImage.length);
    setStep("MAP");
  };

  const handleComplete = () => {
    setStep("SUBMITTED");
    setTimeout(() => router.push("/mechanic/dashboard"), 1500);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-20 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Mechanic Verification (R-04)</h1>
          <p className="text-[11px] text-[#8A8A8A]">Trade Cert & Workshop GPS Registration</p>
        </div>
      </header>

      {step === "VERIFY" && (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-[#121212] flex items-center">
              Live Face Blink Scan <InfoTooltip id="kyc" />
            </h2>
            <p className="text-[11px] text-[#8A8A8A]">
              Position face in camera circle to unlock instant job radius dispatch.
            </p>
          </div>

          <LiveVerificationCamera userId="mechanic-001" onVerified={handleVerified} />
        </div>
      )}

      {step === "MAP" && (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-[#121212] flex items-center">
              Workshop Location GPS <InfoTooltip id="proof_address" />
            </h2>
            <p className="text-[11px] text-[#8A8A8A]">
              Pin your physical workshop or mobile service area in Lagos.
            </p>
          </div>

          <LocationPickerMap
            initialLat={location.lat}
            initialLng={location.lng}
            onLocationSelect={(loc) =>
              setLocation({
                lat: loc.latitude,
                lng: loc.longitude,
                address: loc.formattedAddress,
              })
            }
          />

          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs font-mono text-[#121212]">
            📍 {location.address}
          </div>

          <button
            onClick={handleComplete}
            className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
          >
            <Wrench className="w-4 h-4" />
            <span>Complete Mechanic KYC Registration</span>
          </button>
        </div>
      )}

      {step === "SUBMITTED" && (
        <div className="bg-white border border-emerald-200 rounded-[16px] p-6 text-center space-y-3 shadow-sm my-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold text-[#121212]">Verification Approved!</h2>
          <p className="text-xs text-[#8A8A8A]">
            You are now authorized as a PartMatch Verified Mechanic (R-04). Redirecting to Mechanic Dashboard...
          </p>
        </div>
      )}
    </main>
  );
}
