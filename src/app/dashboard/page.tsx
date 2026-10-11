"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  Bell,
  Scan,
  ShieldCheck,
  ChevronRight,
  Car,
  Package,
  Wrench,
  PlusCircle,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { OrderService, OrderRecord } from "@/lib/services/orderService";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.getUserOrders("123e4567-e89b-12d3-a456-426614174000").then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Top Bar Header: Hi Name + Help + Bell */}
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#FF4D1A] text-white rounded-full flex items-center justify-center font-bold text-sm">
            PM
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#121212]">Hi, Tunde</h1>
            <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> R-01 Driver Verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#121212]">
          <button className="p-2 rounded-xl bg-white border border-[#EAEAEA]">
            <HelpCircle className="w-4 h-4 text-[#8A8A8A]" />
          </button>
          <button className="p-2 rounded-xl bg-white border border-[#EAEAEA] relative">
            <Bell className="w-4 h-4 text-[#8A8A8A]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D1A] rounded-full" />
          </button>
        </div>
      </header>

      {/* OPay Style Wallet Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
            Withdrawable Wallet Balance
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
            Escrow Protected
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
            ₦45,000
          </p>
          <button
            onClick={() => router.push("/wallet")}
            className="text-xs text-[#FF4D1A] font-bold flex items-center gap-0.5 hover:underline"
          >
            Wallet <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={() => router.push("/wallet")}
            className="flex-1 h-11 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Fund Wallet</span>
          </button>
          <button
            onClick={() => router.push("/garage")}
            className="flex-1 h-11 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5"
          >
            <Car className="w-4 h-4 text-[#FF4D1A]" />
            <span>Garage Vehicles</span>
          </button>
        </div>
      </div>

      {/* AI Diagnostic Scanner Quick Access */}
      <div
        onClick={() => router.push("/diagnose")}
        className="bg-[#121212] text-white rounded-[16px] p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform shadow-md"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF4D1A]">
            <Scan className="w-4 h-4 text-[#FF4D1A]" />
            <span>AI Part Diagnostic Scanner</span>
          </div>
          <p className="text-xs font-semibold text-white">Scan Part Photo or Audio Symptom</p>
          <p className="text-[10px] text-[#8A8A8A]">Instant OEM Part Number & Compatibility Match</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white" />
      </div>

      {/* Recent Orders Section */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#FF4D1A]" />
            Recent Escrow Orders
          </h2>
          <button
            onClick={() => router.push("/orders")}
            className="text-xs text-[#FF4D1A] font-bold hover:underline"
          >
            See All
          </button>
        </div>

        {loading ? (
          <div className="h-24 bg-neutral-200 rounded-[16px] animate-pulse" />
        ) : orders.length === 0 ? (
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-6 text-center text-xs text-[#8A8A8A]">
            No recent active orders found.
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 2).map((o) => (
              <div
                key={o.id}
                onClick={() => router.push(`/orders/${o.id}`)}
                className="bg-white border border-[#EAEAEA] rounded-[16px] p-3.5 flex items-center justify-between cursor-pointer hover:border-[#FF4D1A] transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#121212]">{o.part_title}</p>
                  <p className="text-[10px] text-[#8A8A8A] font-mono">{o.order_ref}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-[#FF4D1A]">
                    ₦{o.amount.toLocaleString("en-NG")}
                  </p>
                  <span className="text-[9px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mobile Mechanic Booking Card */}
      <div
        onClick={() => router.push("/diagnose/search")}
        className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex items-center justify-between cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-700 font-bold">
            <Wrench className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#121212]">Book Mobile Mechanic Inspection</p>
            <p className="text-[10px] text-[#8A8A8A]">15% inspection fee held securely in escrow</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
      </div>

      <BottomNav />
    </main>
  );
}
