"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, ShieldCheck, Clock, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { OrderService, OrderRecord } from "@/lib/services/orderService";
import { formatWAT } from "@/lib/timezone";
import { BottomNav } from "@/components/BottomNav";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = "123e4567-e89b-12d3-a456-426614174000";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OrderService.getUserOrders(userId);
      setOrders(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load orders.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Top Bar Header */}
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">My Escrow Orders</h1>
          <p className="text-[11px] text-[#8A8A8A]">Track active deliveries & escrow release</p>
        </div>
      </header>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-32 bg-neutral-200 rounded-[16px] animate-pulse" />
          <div className="h-32 bg-neutral-200 rounded-[16px] animate-pulse" />
        </div>
      ) : error ? (
        /* Error State with Retry */
        <div className="p-6 bg-white border border-red-200 rounded-[16px] text-center space-y-3 shadow-sm my-6">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-xs font-bold text-red-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
          </button>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State UI (Illustration + CTA) */
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 bg-[#FFFBF5] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto text-[#FF4D1A]">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No Active Orders</h2>
            <p className="text-xs text-[#8A8A8A] max-w-[280px] mx-auto">
              You have no active auto part escrow purchases. Orders made in marketplace will appear here.
            </p>
          </div>
          <button
            onClick={() => router.push("/diagnose/search")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
          >
            <span>Explore Spare Parts Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              onClick={() => router.push(`/orders/${o.id}`)}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm cursor-pointer hover:border-[#FF4D1A] transition-colors"
            >
              <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
                <span className="text-[11px] font-mono font-bold text-[#121212]">
                  {o.order_ref}
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  {o.status}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#121212]">{o.part_title}</p>
                  <p className="text-[11px] text-[#8A8A8A]">Part Ref: {o.part_number}</p>
                  <p className="text-[10px] text-[#8A8A8A] mt-1">
                    Ordered: {formatWAT(o.created_at)}
                  </p>
                </div>
                <p className="text-sm font-extrabold text-[#FF4D1A]">
                  ₦{o.amount.toLocaleString("en-NG")}
                </p>
              </div>

              <div className="p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-amber-900 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>72h Escrow Release: WAT Timer Active</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
