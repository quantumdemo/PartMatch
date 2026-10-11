"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Truck, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { OrderService, OrderRecord } from "@/lib/services/orderService";
import { formatWAT } from "@/lib/timezone";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      OrderService.getOrderById(orderId).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [orderId]);

  if (loading) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 text-center font-sans">
        <p className="text-xs text-[#8A8A8A]">Loading order progress...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-12 text-center font-sans space-y-4">
        <p className="text-xs text-red-600 font-bold">Order record not found.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#121212] text-white text-xs font-bold rounded-[12px]"
        >
          Go Back
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-20 font-sans space-y-4">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">{order.order_ref}</h1>
          <p className="text-[11px] text-[#8A8A8A]">Created: {formatWAT(order.created_at)}</p>
        </div>
      </header>

      {/* Escrow Progress Bar */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#121212]">Escrow Contract Status</span>
          <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
            {order.status}
          </span>
        </div>

        {/* 4-Step Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <div className="h-2 bg-[#FF4D1A] rounded-full" />
          <div className="h-2 bg-[#FF4D1A] rounded-full" />
          <div className="h-2 bg-neutral-200 rounded-full" />
          <div className="h-2 bg-neutral-200 rounded-full" />
        </div>

        <div className="p-3 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] space-y-1 text-xs text-[#121212]">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>72-Hour Auto-Release Countdown</span>
          </div>
          <p className="text-[11px] text-[#8A8A8A]">
            Auto-Release WAT Date: {formatWAT(order.escrow_release_at)}
          </p>
        </div>
      </div>

      {/* Part Item Summary */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm">
        <p className="text-xs font-bold text-[#121212]">Part Summary</p>
        <div className="flex justify-between items-baseline">
          <div>
            <p className="text-xs font-bold text-[#121212]">{order.part_title}</p>
            <p className="text-[11px] text-[#8A8A8A]">OEM Ref: {order.part_number}</p>
          </div>
          <p className="text-sm font-extrabold text-[#FF4D1A]">
            ₦{order.amount.toLocaleString("en-NG")}
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => router.push(`/orders/tracking/${order.id}`)}
          className="w-full h-12 bg-white border border-[#EAEAEA] hover:border-[#FF4D1A] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-between px-4 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#FF4D1A]" />
            Live Rider Delivery Tracking
          </span>
          <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
        </button>

        <button
          onClick={() => router.push(`/delivery/confirm/${order.id}`)}
          className="w-full h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm Fitment & Delivery</span>
        </button>
      </div>
    </main>
  );
}
