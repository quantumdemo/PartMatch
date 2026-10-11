"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, MapPin, ArrowLeft, ArrowRight, Wallet, Info } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { createClient } from "@/lib/supabase/client";

function CheckoutEscrowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inventoryId = searchParams?.get("inventory_id") || "";
  const cartTotalStr = searchParams?.get("cart_total") || "";
  const supabase = createClient();

  const [address, setAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState<number>(18500);
  const [partTitle, setPartTitle] = useState("Ceramic Front Brake Pad Set");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCheckoutData() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("formatted_address")
          .eq("user_id", userId)
          .maybeSingle();

        if (profile?.formatted_address) {
          setAddress(profile.formatted_address);
        }
      }

      if (inventoryId) {
        const { data: item } = await supabase
          .from("inventory")
          .select("part_name, price_ngn")
          .eq("id", inventoryId)
          .maybeSingle();

        if (item) {
          setPartTitle(item.part_name);
          setTotalAmount(Number(item.price_ngn) || 18500);
        }
      } else if (cartTotalStr) {
        setTotalAmount(Number(cartTotalStr) || 18500);
        setPartTitle("Cart Order Items");
      }
      setLoading(false);
    }

    loadCheckoutData();
  }, [inventoryId, cartTotalStr]);

  const sellerSplit = Math.round(totalAmount * 0.85);
  const mechanicSplit = Math.round(totalAmount * 0.10);
  const platformFee = totalAmount - sellerSplit - mechanicSplit;

  const handleProceedToPay = () => {
    router.push(`/checkout/pay?amount=${totalAmount}&title=${encodeURIComponent(partTitle)}&address=${encodeURIComponent(address)}`);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Escrow Checkout</h1>
          <p className="text-[11px] text-[#8A8A8A]">Payment Protected by Escrow</p>
        </div>
      </header>

      {/* Escrow Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[16px] space-y-1 text-emerald-900">
        <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Payment Protected by Escrow</span>
          <InfoTooltip id="escrow_protection" />
        </div>
        <p className="text-[11px] text-emerald-700 leading-snug">
          Money is held securely in PartMatch Escrow. Funds are released only when you confirm successful part installation.
        </p>
      </div>

      {/* Order Item Overview */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">Order Details</span>
        <h2 className="text-sm font-bold text-[#121212]">{partTitle}</h2>
        <p className="text-2xl font-extrabold text-[#FF4D1A]">
          ₦{totalAmount.toLocaleString("en-NG")}
        </p>
      </div>

      {/* Delivery Address */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm">
        <label className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#FF4D1A]" />
          Delivery & Installation Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. 12 Ikeja Way, Lagos"
          className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
        />
      </div>

      {/* Escrow Split Breakdown */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm text-xs">
        <div className="flex items-center justify-between font-bold text-[#121212] pb-2 border-b border-[#EAEAEA]">
          <span className="flex items-center gap-1">
            <Wallet className="w-4 h-4 text-[#FF4D1A]" />
            Escrow Split Distribution
          </span>
          <Info className="w-3.5 h-3.5 text-[#8A8A8A]" />
        </div>

        <div className="flex justify-between text-[#8A8A8A]">
          <span>Part Merchant Payout (85%):</span>
          <span className="font-mono font-bold text-[#121212]">₦{sellerSplit.toLocaleString("en-NG")}</span>
        </div>

        <div className="flex justify-between text-[#8A8A8A]">
          <span>Mobile Mechanic Allocation (10%):</span>
          <span className="font-mono font-bold text-[#121212]">₦{mechanicSplit.toLocaleString("en-NG")}</span>
        </div>

        <div className="flex justify-between text-[#8A8A8A]">
          <span>Platform Escrow Fee (5%):</span>
          <span className="font-mono font-bold text-[#121212]">₦{platformFee.toLocaleString("en-NG")}</span>
        </div>

        <div className="pt-2 border-t border-[#EAEAEA] flex justify-between font-extrabold text-[#121212]">
          <span>Total Payable:</span>
          <span className="text-[#FF4D1A]">₦{totalAmount.toLocaleString("en-NG")}</span>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FFFBF5]/90 backdrop-blur-md max-w-[440px] mx-auto border-t border-[#EAEAEA]">
        <button
          type="button"
          disabled={loading || !address.trim()}
          onClick={handleProceedToPay}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white font-bold text-sm rounded-[12px] transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Proceed to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}

export default function CheckoutEscrowPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8A8A8A]">Loading checkout...</div>}>
      <CheckoutEscrowContent />
    </Suspense>
  );
}
