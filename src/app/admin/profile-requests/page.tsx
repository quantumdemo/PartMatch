"use client";

import React, { useState } from "react";
import { UserCheck, CheckCircle2, XCircle } from "lucide-react";
import { PaymentPinModal } from "@/components/PaymentPinModal";

export default function AdminProfileRequestsPage() {
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleAction = (type: string) => {
    setSelectedAction(type);
    setPinModalOpen(true);
  };

  const handlePinVerified = () => {
    setPinModalOpen(false);
    setStatusMessage(`Profile change request ${selectedAction} authorized!`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#121212]">Profile Update Request Audit</h1>
        <p className="text-xs text-[#8A8A8A]">Approve or Reject KYC Profile Modifications with PIN Security</p>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[16px] text-xs text-emerald-900 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#FF4D1A]" />
            <div>
              <p className="text-xs font-bold text-[#121212]">Request #REQ-88910</p>
              <p className="text-[11px] text-[#8A8A8A]">User ID: user-123 • Role: R-01 Driver</p>
            </div>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded border border-amber-200">
            PENDING AUDIT
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] space-y-0.5">
            <span className="text-[10px] text-[#8A8A8A] uppercase font-bold">Field Requested</span>
            <p className="font-bold text-[#121212]">Phone Number</p>
          </div>

          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] space-y-0.5">
            <span className="text-[10px] text-[#8A8A8A] uppercase font-bold">New Proposed Value</span>
            <p className="font-mono font-bold text-emerald-600">+234 812 990 1122</p>
          </div>
        </div>

        <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] space-y-1">
          <p className="font-bold">Reason Provided:</p>
          <p className="text-[#8A8A8A] leading-relaxed">
            &quot;Changed primary phone SIM card for OTP verification access in Lagos.&quot;
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => handleAction("APPROVED")}
            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve Update</span>
          </button>

          <button
            onClick={() => handleAction("REJECTED")}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Request</span>
          </button>
        </div>
      </div>

      <PaymentPinModal
        userId="admin-001"
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onVerified={handlePinVerified}
        title="Admin Security PIN Authorization"
      />
    </div>
  );
}
