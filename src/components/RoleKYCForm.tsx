"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, Upload, AlertCircle } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { LiveVerificationCamera } from "@/components/LiveVerificationCamera";
import { LocationPickerMap } from "@/components/LocationPickerMap";
import { createClient } from "@/lib/supabase/client";

interface RoleKYCFormProps {
  userId: string;
  userRole: "buyer" | "seller" | "mechanic";
  isLocked?: boolean;
}

export function RoleKYCForm({ userId, userRole, isLocked = false }: RoleKYCFormProps) {
  const [liveVerifyUrl, setLiveVerifyUrl] = useState<string>("");
  const [nin, setNin] = useState<string>("");
  const [cac, setCac] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [driverLicense, setDriverLicense] = useState<string>("");
  const [serviceRadius, setServiceRadius] = useState<number>(10);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; formattedAddress: string }>({
    latitude: 6.5244,
    longitude: 3.3792,
    formattedAddress: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(isLocked);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!liveVerifyUrl) {
      setError("Live camera verification selfie is mandatory.");
      return;
    }

    if (!nin || nin.length !== 11) {
      setError("A valid 11-digit NIN is mandatory.");
      return;
    }

    if (userRole === "buyer" && !address) {
      setError("Buyer delivery address is mandatory.");
      return;
    }

    if (userRole === "seller" && (!cac || !location.formattedAddress)) {
      setError("Seller CAC registration and store business location are mandatory.");
      return;
    }

    if (userRole === "mechanic" && (!location.formattedAddress || !serviceRadius)) {
      setError("Mechanic workshop location and service radius are mandatory.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const supabase = createClient();

      const { error: kycErr } = await supabase.from("kyc_submissions").insert({
        user_id: userId,
        role: userRole,
        nin,
        cac: userRole === "seller" ? cac : null,
        proof_address: address || location.formattedAddress,
        live_verification_image: liveVerifyUrl,
        latitude: location.latitude,
        longitude: location.longitude,
        status: "PENDING",
      });

      if (kycErr) throw kycErr;

      // Update profile status
      await supabase
        .from("profiles")
        .update({
          kyc_status: "PENDING",
          latitude: location.latitude,
          longitude: location.longitude,
          formatted_address: address || location.formattedAddress,
        })
        .eq("user_id", userId);

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit KYC documentation.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // If KYC is already submitted or approved, show locked screen indicator
  if (submitted || isLocked) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 max-w-lg mx-auto text-center shadow-sm">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center justify-center gap-2">
          KYC Profile Locked <Lock className="w-4 h-4 text-amber-600" />
        </h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          Your identity and role documentation have been submitted and locked for security verification. Direct editing is restricted to prevent fraud.
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1 text-[#0F172A]">
          <div className="font-semibold text-[#FF4D1A]">Need to change your CAC, address, or store info?</div>
          <p className="text-slate-500">
            Submit an official request via Profile Change Requests for admin authorization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 max-w-xl mx-auto shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4D1A] bg-[#FF4D1A]/10 px-3 py-1 rounded-full mb-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Mandatory KYC Verification
        </div>
        <h2 className="text-2xl font-extrabold text-[#0F172A]">
          {userRole.toUpperCase()} Account Verification
        </h2>
        <p className="text-xs text-[#64748B]">
          Complete all mandatory fields to unlock full account features and payment withdrawals.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Live Selfie Verification */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#0F172A] flex items-center">
          1. Live Face Verification Photo <InfoTooltip id="live_verification" />
        </label>
        {liveVerifyUrl ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <span>✓ Live selfie verified and uploaded</span>
            <button
              type="button"
              onClick={() => setLiveVerifyUrl("")}
              className="text-xs text-[#FF4D1A] font-bold underline"
            >
              Re-verify
            </button>
          </div>
        ) : (
          <LiveVerificationCamera userId={userId} onVerified={(url) => setLiveVerifyUrl(url)} />
        )}
      </div>

      {/* 2. NIN Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0F172A] flex items-center">
          2. National Identification Number (NIN) <InfoTooltip id="nin" />
        </label>
        <input
          type="text"
          maxLength={11}
          value={nin}
          onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 11-digit NIN"
          required
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
        />
      </div>

      {/* Role Specific Fields */}
      {userRole === "buyer" && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] flex items-center">
            3. Delivery Address (Editable for shipping) <InfoTooltip id="proof_address" />
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter full home/office address in Nigeria"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-600">
              Driver&apos;s License (Optional)
            </label>
            <input
              type="text"
              value={driverLicense}
              onChange={(e) => setDriverLicense(e.target.value)}
              placeholder="Driver's License Number (Optional)"
              className="w-full mt-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A]"
            />
          </div>
        </div>
      )}

      {userRole === "seller" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] flex items-center">
              3. CAC Registration Number <InfoTooltip id="cac" />
            </label>
            <input
              type="text"
              value={cac}
              onChange={(e) => setCac(e.target.value)}
              placeholder="e.g. RC-1234567 or BN-9876543"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>

          <LocationPickerMap
            initialAddress={address}
            onLocationSelect={(loc) => {
              setLocation(loc);
              setAddress(loc.formattedAddress);
            }}
          />
        </div>
      )}

      {userRole === "mechanic" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] flex items-center">
              3. Service Radius (Kilometers) <InfoTooltip id="service_radius" />
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={serviceRadius}
              onChange={(e) => setServiceRadius(Number(e.target.value))}
              placeholder="e.g. 15 km"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>

          <LocationPickerMap
            initialAddress={address}
            onLocationSelect={(loc) => {
              setLocation(loc);
              setAddress(loc.formattedAddress);
            }}
          />
        </div>
      )}

      {/* Submit Action */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {submitting ? "Submitting Verification..." : "Submit Verification & Lock Profile"}
      </button>
    </form>
  );
}
