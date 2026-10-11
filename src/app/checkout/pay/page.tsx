"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Building2, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { PaymentPinModal } from "@/components/PaymentPinModal";
import { createClient } from "@/lib/supabase/client";

function PaymentMethodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amountStr = searchParams?.get("amount") || "18500";
  const title = searchParams?.get("title") || "Ceramic Front Brake Pad Set";
  const address = searchParams?.get("address") || "";
  const supabase = createClient();

  const amount = Number(amountStr) || 18500;
  const [method, setMethod] = useState<"card" | "bank">("card");
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("dev-user-id");

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    }
    loadUser();
  }, []);

  const handlePayClick = () => {
    setShowPinModal(true);
  };

  const handlePinVerified = async () => {
    const orderRef = "PM-ESCROW-" + Math.floor(100000 + Math.random() * 900000);

    const { data: orderData } = await supabase.from("orders").insert({
      buyer_id: userId,
      order_ref: orderRef,
      part_title: title,
      total_amount: amount,
      delivery_address: address,
      status: "SECURED_IN_ESCROW",
      created_at: new Date().toISOString(),
    }).select().maybeSingle();

    const orderId = orderData?.id || "order-created";

    await supabase.from("escrow_transactions").insert({
      order_id: orderId,
      buyer_id: userId,
      amount: amount,
      status: "SECURED",
      created_at: new Date().toISOString(),
    });

    router.push(`/orders/${orderId}?secured=true`);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-28 font-sans space-y-5">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#121212]">Select Payment Channel</h1>
          <p className="text-xs text-[#8A8A8A]">Paystack Protected NGN Payment</p>
        </div>
      </header>

      {/* Amount Display */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 text-center space-y-1 shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">Escrow Total Amount</span>
        <p className="text-[36px] font-extrabold text-[#121212] leading-none tracking-tight">
          ₦{amount.toLocaleString("en-NG")}
        </p>
        <p className="text-xs text-[#8A8A8A]">{title}</p>
      </div>

      {/* Payment Options */}
      <div className="space-y-3">
        <div
          onClick={() => setMethod("card")}
          className={`p-4 bg-white border rounded-[16px] flex items-center justify-between cursor-pointer transition-colors ${
            method === "card" ? "border-[#FF4D1A] ring-2 ring-[#FF4D1A]/20" : "border-[#EAEAEA]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFFBF5] border border-[#EAEAEA] text-[#FF4D1A] rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#121212]">Paystack Debit / Credit Card</h3>
              <p className="text-xs text-[#8A8A8A]">Mastercard, Visa, Verve NGN</p>
            </div>
          </div>
          <input type="radio" checked={method === "card"} readOnly className="accent-[#FF4D1A]" />
        </div>

        <div
          onClick={() => setMethod("bank")}
          className={`p-4 bg-white border rounded-[16px] flex items-center justify-between cursor-pointer transition-colors ${
            method === "bank" ? "border-[#FF4D1A] ring-2 ring-[#FF4D1A]/20" : "border-[#EAEAEA]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFFBF5] border border-[#EAEAEA] text-[#FF4D1A] rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#121212]">Instant Bank Transfer</h3>
              <p className="text-xs text-[#8A8A8A]">GTB, Access, Moniepoint, Zenith NUBAN</p>
            </div>
          </div>
          <input type="radio" checked={method === "bank"} readOnly className="accent-[#FF4D1A]" />
        </div>
      </div>

      <div className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] text-xs text-[#8A8A8A] space-y-1">
        <div className="font-bold text-[#121212] flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transaction PIN Verification
        </div>
        <p className="text-[11px]">
          Enter your 4-digit PIN to authorize securing funds in Escrow.
        </p>
      </div>

      <button
        type="button"
        onClick={handlePayClick}
        className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white font-bold text-xs rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
      >
        <Lock className="w-4 h-4" /> Authorize & Pay ₦{amount.toLocaleString("en-NG")} NGN
      </button>

      <PaymentPinModal
        userId={userId}
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onVerified={handlePinVerified}
        title="Enter Transaction PIN"
        description="Authorization required to lock NGN funds in escrow"
      />
    </main>
  );
}

export default function PaymentMethodPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8A8A8A]">Loading payment options...</div>}>
      <PaymentMethodContent />
    </Suspense>
  );
}
