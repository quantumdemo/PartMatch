"use client";

import React, { useState } from "react";
import { ShieldAlert, Clock, CheckCircle2, PauseCircle } from "lucide-react";
import { PaymentPinModal } from "@/components/PaymentPinModal";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function AdminEscrowControlPage() {
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const adminUserId = "admin-001";

  const handleTriggerAction = (actionType: string) => {
    setSelectedAction(actionType);
    setPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setPinModalOpen(false);
    setActionSuccess(`Admin Escrow override ${selectedAction} successfully authorized!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#121212]">Escrow Release & Manual Hold Control</h1>
        <p className="text-xs text-[#8A8A8A]">72-Hour Automatic Countdown Overrides & Security PIN Protection</p>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[16px] text-xs text-emerald-900 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs font-bold text-[#121212]">Active Escrow Contract #PM-REF-11111111</p>
              <p className="text-[11px] text-[#8A8A8A]">Buyer: Tunde Oladipo • Seller: Ladipo Merchant #12</p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-[#FF4D1A]">₦18,500 NGN</span>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>72h Timer Remaining: 42 Hours</span>
          </div>
          <InfoTooltip id="kyc" />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => handleTriggerAction("FORCE_RELEASE_PAYOUT")}
            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Force Release Payouts (85/15/5)</span>
          </button>

          <button
            onClick={() => handleTriggerAction("HOLD_ESCROW_RELEASE")}
            className="flex-1 h-11 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PauseCircle className="w-4 h-4" />
            <span>Hold Release Timer</span>
          </button>
        </div>
      </div>

      <PaymentPinModal
        userId={adminUserId}
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onVerified={handlePinSuccess}
        title="Admin Payment PIN Authorization"
      />
    </div>
  );
}
