"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle2, Lock } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function ProfileChangeRequestPage() {
  const router = useRouter();
  const [fieldName, setFieldName] = useState("Phone Number");
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => router.push("/me"), 1500);
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
          <h1 className="text-base font-bold text-[#121212]">Request Profile Info Update</h1>
          <p className="text-[11px] text-[#8A8A8A]">Audit Approval Required for Verified Profiles</p>
        </div>
      </header>

      {submitted ? (
        <div className="bg-white border border-emerald-200 rounded-[16px] p-6 text-center space-y-3 shadow-sm my-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold text-[#121212]">Request Submitted!</h2>
          <p className="text-xs text-[#8A8A8A]">
            Your profile modification request is pending Admin auditing.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center gap-2 text-xs text-amber-900 font-bold">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>KYC Verified fields are locked to prevent fraud.</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212] flex items-center">
              Target Field <InfoTooltip id="kyc" />
            </label>
            <select
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            >
              <option value="Phone Number">Phone Number</option>
              <option value="Email Address">Email Address</option>
              <option value="Physical Address">Physical Address</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">New Proposed Value</label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter new verified info..."
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">Reason for Update</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide reason for profile update..."
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>

          <button
            type="submit"
            className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Submit Update Request</span>
          </button>
        </form>
      )}
    </main>
  );
}
