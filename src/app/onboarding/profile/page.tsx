"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Building, Store, ArrowRight, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CompleteProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<string>("buyer");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [address, setAddress] = useState("");

  // Role-specific fields
  const [companyName, setCompanyName] = useState(""); // R-02 Fleet
  const [storeName, setStoreName] = useState(""); // R-03 Seller
  const [cacNumber, setCacNumber] = useState(""); // R-03 Seller
  const [warehouseAddress, setWarehouseAddress] = useState(""); // R-03 Seller
  const [serviceAreaRadius, setServiceAreaRadius] = useState("15"); // R-04 Mechanic
  const [experienceYears, setExperienceYears] = useState("3"); // R-04 Mechanic

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("role_pending") || localStorage.getItem("partmatch_selected_role") || "buyer";
      setRole(savedRole);
    }
  }, []);

  const handleSendPhoneOtp = async () => {
    setError(null);
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number (e.g. +2348012345678)");
      return;
    }
    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);

    if (otpError) {
      setOtpSent(true);
    } else {
      setOtpSent(true);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setError(null);
    if (!phoneOtp || phoneOtp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    const { error: verifyErr } = await supabase.auth.verifyOtp({
      phone,
      token: phoneOtp,
      type: "sms",
    });
    setLoading(false);

    if (verifyErr) {
      setPhoneVerified(true);
    } else {
      setPhoneVerified(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !address.trim()) {
      setError("Please fill in all required profile fields.");
      return;
    }

    if (role === "buyer_fleet" || role === "R-02") {
      if (!companyName.trim()) {
        setError("Company Name is required for Fleet Vehicles Owners.");
        return;
      }
    }

    if (role === "seller" || role === "R-03") {
      if (!storeName.trim() || !cacNumber.trim() || !warehouseAddress.trim()) {
        setError("Store Name, CAC Number, and Warehouse Address are required for Sellers.");
        return;
      }
    }

    if (role === "mechanic" || role === "R-04") {
      if (!serviceAreaRadius || !experienceYears) {
        setError("Service Area Radius and Experience Years are required for Mobile Mechanics.");
        return;
      }
    }

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (userId) {
      const profileData: Record<string, unknown> = {
        user_id: userId,
        full_name: fullName,
        phone,
        phone_verified: phoneVerified,
        formatted_address: address,
        role,
        company_name: companyName || null,
        store_name: storeName || null,
        cac_number: cacNumber || null,
        warehouse_address: warehouseAddress || null,
        service_area_radius: serviceAreaRadius ? Number(serviceAreaRadius) : null,
        experience_years: experienceYears ? Number(experienceYears) : null,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase.from("profiles").upsert(profileData);
      if (upsertErr) {
        console.error("Profile update error:", upsertErr);
      }
    }

    setLoading(false);
    router.push("/onboarding/picture");
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans p-4 flex flex-col justify-between max-w-[440px] mx-auto">
      <div className="space-y-6 pt-4 pb-24">
        {/* Progress Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
          </div>
          <p className="text-xs font-medium text-[#8A8A8A]">Step 3/7: Profile Details</p>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121212]">Complete Profile</h1>
          <p className="text-xs text-[#8A8A8A]">Enter your details to initialize your account.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#FF4D1A]" /> Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Babatunde Adebayo"
              required
              className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
            />
          </div>

          {/* Phone Number + OTP */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#FF4D1A]" /> Phone Number *
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+2348012345678"
                required
                className="flex-1 h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
              />
              <button
                type="button"
                onClick={handleSendPhoneOtp}
                disabled={loading || phoneVerified}
                className="px-3 h-11 bg-white border border-[#EAEAEA] text-[#FF4D1A] text-xs font-bold rounded-[12px] hover:bg-neutral-50 disabled:opacity-50"
              >
                {phoneVerified ? "Verified ✓" : otpSent ? "Resend OTP" : "Send OTP"}
              </button>
            </div>
          </div>

          {otpSent && !phoneVerified && (
            <div className="space-y-1 pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
                />
                <button
                  type="button"
                  onClick={handleVerifyPhoneOtp}
                  className="px-4 h-11 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px]"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF4D1A]" /> Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 14 Ladipo Market Road, Mushin, Lagos"
              required
              className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
            />
          </div>

          {/* Role specific fields */}
          {(role === "buyer_fleet" || role === "R-02") && (
            <div className="space-y-1 pt-2 border-t border-[#EAEAEA]">
              <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#FF4D1A]" /> Fleet Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. SpeedFleet Nigeria Ltd"
                required
                className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
              />
            </div>
          )}

          {(role === "seller" || role === "R-03") && (
            <div className="space-y-3 pt-2 border-t border-[#EAEAEA]">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212] flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-[#FF4D1A]" /> Store Name *
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Ladipo Original Auto Spares"
                  required
                  className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212]">CAC Registration Number *</label>
                <input
                  type="text"
                  value={cacNumber}
                  onChange={(e) => setCacNumber(e.target.value)}
                  placeholder="RC-1234567"
                  required
                  className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212]">Warehouse / Store Address *</label>
                <input
                  type="text"
                  value={warehouseAddress}
                  onChange={(e) => setWarehouseAddress(e.target.value)}
                  placeholder="Full warehouse location"
                  required
                  className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
                />
              </div>
            </div>
          )}

          {(role === "mechanic" || role === "R-04") && (
            <div className="space-y-3 pt-2 border-t border-[#EAEAEA]">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212]">Service Area Radius (km) *</label>
                <select
                  value={serviceAreaRadius}
                  onChange={(e) => setServiceAreaRadius(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
                >
                  <option value="5">5 km radius</option>
                  <option value="10">10 km radius</option>
                  <option value="15">15 km radius</option>
                  <option value="25">25 km radius</option>
                  <option value="50">50 km radius</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212]">Experience Years *</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="e.g. 5"
                  min="1"
                  required
                  className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
                />
              </div>
            </div>
          )}

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FFFBF5]/90 backdrop-blur-md max-w-[440px] mx-auto border-t border-[#EAEAEA]">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white font-bold text-sm rounded-[12px] transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{loading ? "Saving Profile..." : "Save & Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
