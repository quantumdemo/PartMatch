"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingKYCPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<string>("buyer");
  const [ninNumber, setNinNumber] = useState("");
  const [ninDoc, setNinDoc] = useState<File | null>(null);
  const [driverLicenseFront, setDriverLicenseFront] = useState<File | null>(null);
  const [driverLicenseBack, setDriverLicenseBack] = useState<File | null>(null);
  const [selfieWithId, setSelfieWithId] = useState<File | null>(null);
  const [cacDoc, setCacDoc] = useState<File | null>(null);
  const [tradeCert, setTradeCert] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedWAT, setSubmittedWAT] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("role_pending") || localStorage.getItem("partmatch_selected_role") || "buyer";
      setRole(savedRole);
    }
  }, []);

  const handleSubmitKYC = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ninNumber || ninNumber.length !== 11) {
      setError("Please enter a valid 11-digit NIN Number.");
      return;
    }

    if (!ninDoc || !driverLicenseFront || !driverLicenseBack || !selfieWithId) {
      setError("Please upload NIN document, Driver License (front/back), and Selfie holding ID.");
      return;
    }

    if ((role === "seller" || role === "R-03") && !cacDoc) {
      setError("CAC document upload is required for Sellers.");
      return;
    }

    if ((role === "mechanic" || role === "R-04") && !tradeCert) {
      setError("Trade Certificate upload is required for Mobile Mechanics.");
      return;
    }

    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || "dev-user-id";

    const nowWAT = new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" }) + " WAT";

    const uploadFile = async (file: File | null, prefix: string) => {
      if (!file) return null;
      const path = `${userId}/${prefix}-${Date.now()}-${file.name}`;
      const { data } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: true });
      return data?.path ? supabase.storage.from("kyc-documents").getPublicUrl(data.path).data.publicUrl : null;
    };

    const ninDocUrl = await uploadFile(ninDoc, "nin");
    const driverLicenseFrontUrl = await uploadFile(driverLicenseFront, "dl-front");
    const driverLicenseBackUrl = await uploadFile(driverLicenseBack, "dl-back");
    const selfieWithIdUrl = await uploadFile(selfieWithId, "selfie");
    const cacDocUrl = await uploadFile(cacDoc, "cac");
    const tradeCertUrl = await uploadFile(tradeCert, "trade-cert");

    const { error: insertErr } = await supabase.from("kyc_submissions").insert({
      user_id: userId,
      nin_number: ninNumber,
      nin_doc_url: ninDocUrl,
      driver_license_front_url: driverLicenseFrontUrl,
      driver_license_back_url: driverLicenseBackUrl,
      selfie_url: selfieWithIdUrl,
      cac_doc_url: cacDocUrl,
      trade_cert_url: tradeCertUrl,
      status: "PENDING",
      submitted_at: new Date().toISOString(),
    });

    if (insertErr) {
      console.warn("KYC submission note:", insertErr.message);
    }

    await supabase.from("profiles").update({ kyc_status: "PENDING" }).eq("user_id", userId);

    setSubmitting(false);
    setSubmittedWAT(nowWAT);
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
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
          </div>
          <p className="text-xs font-medium text-[#8A8A8A]">Step 5/7: KYC Verification</p>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121212]">KYC Documents Upload</h1>
          <p className="text-xs text-[#8A8A8A]">
            Upload identity documents to verify your PartMatch account.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submittedWAT ? (
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-6 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#121212]">Pending Verification</h2>
              <p className="text-xs text-[#8A8A8A]">
                Submitted at <strong className="text-[#121212]">{submittedWAT}</strong>. Verification usually takes 2-4 hours.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/onboarding/pin")}
              className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Set Transaction PIN Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitKYC} className="space-y-4">
            {/* NIN Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#121212]">NIN Number (11 Digits) *</label>
              <input
                type="text"
                maxLength={11}
                value={ninNumber}
                onChange={(e) => setNinNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="12345678901"
                required
                className="w-full h-11 px-3.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs font-mono text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
              />
            </div>

            {/* NIN Doc Photo */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#121212]">NIN Document Photo *</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setNinDoc(e.target.files?.[0] || null)}
                required
                className="w-full text-xs text-[#121212] file:mr-3 file:py-2 file:px-3 file:rounded-[8px] file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[#FF4D1A] border border-[#EAEAEA] rounded-[12px] p-1.5 bg-white"
              />
            </div>

            {/* Driver License Front & Back */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#121212]">Driver License Front *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDriverLicenseFront(e.target.files?.[0] || null)}
                  required
                  className="w-full text-[10px] border border-[#EAEAEA] rounded-[12px] p-1 bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#121212]">Driver License Back *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDriverLicenseBack(e.target.files?.[0] || null)}
                  required
                  className="w-full text-[10px] border border-[#EAEAEA] rounded-[12px] p-1 bg-white"
                />
              </div>
            </div>

            {/* Selfie Holding NIN */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#121212]">Selfie with ID holding NIN *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelfieWithId(e.target.files?.[0] || null)}
                required
                className="w-full text-xs text-[#121212] border border-[#EAEAEA] rounded-[12px] p-1.5 bg-white"
              />
            </div>

            {/* Role specific document */}
            {(role === "seller" || role === "R-03") && (
              <div className="space-y-1 pt-2 border-t border-[#EAEAEA]">
                <label className="text-xs font-bold text-[#121212]">CAC Document *</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setCacDoc(e.target.files?.[0] || null)}
                  required
                  className="w-full text-xs text-[#121212] border border-[#EAEAEA] rounded-[12px] p-1.5 bg-white"
                />
              </div>
            )}

            {(role === "mechanic" || role === "R-04") && (
              <div className="space-y-1 pt-2 border-t border-[#EAEAEA]">
                <label className="text-xs font-bold text-[#121212]">Trade Certificate *</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setTradeCert(e.target.files?.[0] || null)}
                  required
                  className="w-full text-xs text-[#121212] border border-[#EAEAEA] rounded-[12px] p-1.5 bg-white"
                />
              </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FFFBF5]/90 backdrop-blur-md max-w-[440px] mx-auto border-t border-[#EAEAEA]">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white font-bold text-sm rounded-[12px] transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{submitting ? "Uploading KYC Docs..." : "Submit KYC Documents"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
