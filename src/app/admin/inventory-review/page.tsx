"use client";

import React, { useState } from "react";
import { Boxes, CheckCircle2, XCircle } from "lucide-react";
import { PaymentPinModal } from "@/components/PaymentPinModal";

export default function AdminInventoryReviewPage() {
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setSelectedAction(action);
    setPinModalOpen(true);
  };

  const handlePinVerified = () => {
    setPinModalOpen(false);
    setStatusMessage(`Listing review ${selectedAction} successfully!`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#121212]">Merchant Inventory Catalog Review</h1>
        <p className="text-xs text-[#8A8A8A]">Audit & Authorize New Spare Part Listings Before Marketplace Publishing</p>
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
            <Boxes className="w-5 h-5 text-[#FF4D1A]" />
            <div>
              <p className="text-xs font-bold text-[#121212]">Toyota Corolla Ceramic Front Brake Pads</p>
              <p className="text-[11px] text-[#8A8A8A]">Merchant: Ladipo Merchant #12 • OEM: OEM-04465-02220</p>
            </div>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded border border-amber-200">
            PENDING_REVIEW
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] space-y-0.5">
            <span className="text-[10px] text-[#8A8A8A] uppercase font-bold">Listing Price</span>
            <p className="font-extrabold text-[#FF4D1A]">₦18,500 NGN</p>
          </div>

          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] space-y-0.5">
            <span className="text-[10px] text-[#8A8A8A] uppercase font-bold">Stock Batch</span>
            <p className="font-bold text-[#121212]">15 Units</p>
          </div>

          <div className="p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] space-y-0.5">
            <span className="text-[10px] text-[#8A8A8A] uppercase font-bold">Grade</span>
            <p className="font-bold text-[#121212]">GENUINE OEM</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => handleAction("APPROVED")}
            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve for Marketplace</span>
          </button>

          <button
            onClick={() => handleAction("REJECTED")}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Listing</span>
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
