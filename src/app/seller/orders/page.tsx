"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ShieldCheck, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { OrderService, OrderRecord } from "@/lib/services/orderService";
import { formatWAT } from "@/lib/timezone";
import { BottomNav } from "@/components/BottomNav";

export default function SellerOrdersPage() {
  const router = useRouter();
  const sellerId = "seller-001";

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.getUserOrders(sellerId).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [sellerId]);

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
          <h1 className="text-base font-bold text-[#121212]">Customer Orders to Fulfill</h1>
          <p className="text-[11px] text-[#8A8A8A]">Escrow Secured Payouts</p>
        </div>
      </header>

      {/* Buyer Protection Promise */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-[16px] flex items-center gap-2.5 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span className="font-bold">Payment Secured in Escrow — Safe to Dispatch Orders</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-28 bg-neutral-200 rounded-[16px] animate-pulse" />
          <div className="h-28 bg-neutral-200 rounded-[16px] animate-pulse" />
        </div>
      ) : orders.length === 0 ? (
        /* Empty State UI */
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 bg-[#FFFBF5] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto text-[#FF4D1A]">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No Pending Orders</h2>
            <p className="text-xs text-[#8A8A8A] max-w-[280px] mx-auto">
              New customer purchases will appear here with 85% escrow payout locks.
            </p>
          </div>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              onClick={() => router.push(`/seller/orders/${o.id}`)}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm cursor-pointer hover:border-[#FF4D1A] transition-colors"
            >
              <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
                <span className="text-[11px] font-mono font-bold text-[#121212]">
                  {o.order_ref}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Secured in Escrow
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
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-[#8A8A8A]">85% Seller Split</p>
                  <p className="text-sm font-extrabold text-[#FF4D1A]">
                    ₦{(o.amount * 0.85).toLocaleString("en-NG")}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] flex items-center justify-between text-[11px] font-bold text-[#121212]">
                <span className="flex items-center gap-1 text-amber-900">
                  <Clock className="w-3.5 h-3.5 text-amber-700" /> 72h Auto Payout Release Active
                </span>
                <ChevronRight className="w-4 h-4 text-[#FF4D1A]" />
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
