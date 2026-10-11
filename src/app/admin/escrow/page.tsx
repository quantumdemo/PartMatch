"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, Clock, CheckCircle2, PauseCircle, AlertCircle } from "lucide-react";
import { PaymentPinModal } from "@/components/PaymentPinModal";
import { createClient } from "@/lib/supabase/client";

interface EscrowHolding {
  id: string;
  order_id?: string;
  buyer_id?: string;
  seller_id?: string;
  amount: number;
  status: string;
  created_at?: string;
}

export default function AdminEscrowControlPage() {
  const supabase = createClient();

  const [holdings, setHoldings] = useState<EscrowHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [selectedHoldingId, setSelectedHoldingId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadEscrowHoldings() {
      setLoading(true);
      const { data } = await supabase
        .from("escrow_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      setHoldings(data || []);
      setLoading(false);
    }

    loadEscrowHoldings();
  }, []);

  const handleTriggerAction = (holdingId: string, actionType: string) => {
    setSelectedHoldingId(holdingId);
    setSelectedAction(actionType);
    setPinModalOpen(true);
  };

  const handlePinSuccess = async () => {
    setPinModalOpen(false);

    if (selectedHoldingId && selectedAction === "FORCE_RELEASE_PAYOUT") {
      await supabase
        .from("escrow_transactions")
        .update({ status: "RELEASED" })
        .eq("id", selectedHoldingId);

      setHoldings((prev) =>
        prev.map((h) => (h.id === selectedHoldingId ? { ...h, status: "RELEASED" } : h))
      );
    }

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

      {loading ? (
        <div className="space-y-3">
          <div className="h-32 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-32 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : holdings.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-2 text-xs text-[#8A8A8A]">
          <AlertCircle className="w-8 h-8 text-[#8A8A8A] mx-auto" />
          <p className="font-bold text-[#121212]">No active escrow holdings found</p>
          <p>Escrow holdings created upon order checkout will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {holdings.map((h) => (
            <div key={h.id} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-xs font-bold text-[#121212]">Escrow Contract #{h.id.slice(0, 8)}</p>
                    <p className="text-[11px] text-[#8A8A8A]">Buyer ID: {h.buyer_id || "Customer"}</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#FF4D1A]">₦{Number(h.amount || 0).toLocaleString("en-NG")} NGN</span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Status: {h.status}</span>
                </div>
              </div>

              {h.status === "SECURED" && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleTriggerAction(h.id, "FORCE_RELEASE_PAYOUT")}
                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Force Release Payouts (85/10/5)</span>
                  </button>

                  <button
                    onClick={() => handleTriggerAction(h.id, "HOLD_ESCROW_RELEASE")}
                    className="flex-1 h-11 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <PauseCircle className="w-4 h-4" />
                    <span>Hold Release</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <PaymentPinModal
        userId="admin-001"
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onVerified={handlePinSuccess}
        title="Admin PIN Authorization"
      />
    </div>
  );
}
