"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Upload, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileChangeRequestPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fieldToChange, setFieldToChange] = useState("formatted_address");
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");
  const [proofDoc, setProofDoc] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newValue.trim() || !reason.trim()) {
      setError("New value and reason for change are required.");
      return;
    }

    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      setError("Please log in to submit a request.");
      setSubmitting(false);
      return;
    }

    let proofUrl = null;
    if (proofDoc) {
      const path = `${userId}/change-${Date.now()}-${proofDoc.name}`;
      const { data } = await supabase.storage.from("kyc-documents").upload(path, proofDoc, { upsert: true });
      proofUrl = data?.path ? supabase.storage.from("kyc-documents").getPublicUrl(data.path).data.publicUrl : null;
    }

    const { error: insertErr } = await supabase.from("profile_change_requests").insert({
      user_id: userId,
      field_name: fieldToChange,
      new_value: newValue.trim(),
      reason: reason.trim(),
      proof_url: proofUrl,
      status: "PENDING",
      submitted_at: new Date().toISOString(),
    });

    setSubmitting(false);

    if (insertErr) {
      setError(insertErr.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-24 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#121212]">Request Profile Change</h1>
          <p className="text-xs text-[#8A8A8A]">Requires Admin Verification & Proof Document</p>
        </div>
      </header>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {submitted ? (
        <div className="bg-white border border-emerald-200 rounded-[16px] p-6 text-center space-y-3 shadow-sm my-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold text-[#121212]">Request Submitted to Queue</h2>
          <p className="text-xs text-[#8A8A8A]">
            PartMatch Admin will review your profile change request and document proof within 24 hours.
          </p>
          <button
            onClick={() => router.push("/me")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm"
          >
            Back to Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#121212]">Field to Update</label>
            <select
              value={fieldToChange}
              onChange={(e) => setFieldToChange(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
            >
              <option value="formatted_address">Primary Address</option>
              <option value="phone">Phone Number</option>
              <option value="full_name">Full Name</option>
              <option value="store_name">Store Name (R-03)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#121212]">New Value *</label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter requested new value"
              required
              className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#121212]">Reason for Change *</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State reason for modifying verified profile field..."
              required
              className="w-full p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#FF4D1A]" /> Supporting Proof Document
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setProofDoc(e.target.files?.[0] || null)}
              className="w-full text-xs text-[#121212] border border-[#EAEAEA] rounded-[12px] p-2 bg-[#FFFBF5]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? "Submitting Request..." : "Submit Change Request"}</span>
          </button>
        </form>
      )}
    </main>
  );
}
