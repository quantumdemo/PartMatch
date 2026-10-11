"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, Package, CheckCircle2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface SellerOrder {
  id: string;
  order_ref?: string;
  part_title?: string;
  total_amount?: number;
  delivery_address?: string;
  status?: string;
  tracking_number?: string;
}

export default function SellerOrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSellerOrders() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("seller_id", userId)
          .order("created_at", { ascending: false });

        setOrders(data || []);
      } else {
        setOrders([]);
      }

      setLoading(false);
    }

    loadSellerOrders();
  }, []);

  const handleAddTracking = async (orderId: string) => {
    const trackingNum = trackingInput[orderId];
    if (!trackingNum) return;

    await supabase
      .from("orders")
      .update({
        tracking_number: trackingNum,
        status: "SHIPPED",
      })
      .eq("id", orderId);

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, tracking_number: trackingNum, status: "SHIPPED" } : o))
    );
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/seller/dashboard")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Seller Orders Fulfillment</h1>
          <p className="text-[11px] text-[#8A8A8A]">Ship Orders & Attach Tracking Ref</p>
        </div>
      </header>

      {loading ? (
        <div className="space-y-3">
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <Package className="w-12 h-12 text-[#8A8A8A] mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No orders yet</h2>
            <p className="text-xs text-[#8A8A8A]">Incoming buyer orders will show up here once secured in escrow.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm"
            >
              {/* Badge Payment Secured in Escrow - Safe to Ship */}
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[12px] flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Payment Secured in Escrow - Safe to Ship
                </span>
                <span>{o.status}</span>
              </div>

              <div className="space-y-1 text-xs text-[#121212]">
                <div className="flex justify-between font-bold">
                  <span>{o.part_title || "Spare Part Order"}</span>
                  <span className="text-[#FF4D1A] font-extrabold">₦{Number(o.total_amount || 0).toLocaleString("en-NG")}</span>
                </div>
                <p className="text-[11px] text-[#8A8A8A]">Delivery: {o.delivery_address || "Lagos, Nigeria"}</p>
                {o.tracking_number && (
                  <p className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Tracking: {o.tracking_number}
                  </p>
                )}
              </div>

              {!o.tracking_number && (
                <div className="flex gap-2 pt-1 border-t border-[#EAEAEA]">
                  <input
                    type="text"
                    placeholder="Enter Tracking Number e.g. GIG-18920"
                    value={trackingInput[o.id] || ""}
                    onChange={(e) =>
                      setTrackingInput({ ...trackingInput, [o.id]: e.target.value })
                    }
                    className="flex-1 h-10 px-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[10px] text-xs font-mono focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddTracking(o.id)}
                    className="px-3 h-10 bg-[#FF4D1A] text-white text-xs font-bold rounded-[10px] flex items-center gap-1 shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Attach & Ship</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
