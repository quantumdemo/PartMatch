"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  Bell,
  ShieldCheck,
  ChevronRight,
  Package,
  Boxes,
  AlertTriangle,
  PlusCircle,
  Wallet,
} from "lucide-react";
import { SellerService, SellerProfileMetrics } from "@/lib/services/sellerService";
import { BottomNav } from "@/components/BottomNav";

export default function SellerDashboardPage() {
  const router = useRouter();
  const sellerId = "seller-001";

  const [metrics, setMetrics] = useState<SellerProfileMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SellerService.getSellerMetrics(sellerId).then((data) => {
      setMetrics(data);
      setLoading(false);
    });
  }, [sellerId]);

  if (loading || !metrics) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 text-center font-sans">
        <p className="text-xs text-[#8A8A8A]">Loading Merchant Portal...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF4D1A] text-white rounded-full flex items-center justify-center font-bold text-sm">
            LA
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#121212] truncate max-w-[200px]">
              {metrics.store_name}
            </h1>
            <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> CAC Verified Merchant
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

      {/* Total Earnings 48px Display Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
            Total Sales Payouts
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
            Escrow Secured
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
            ₦{metrics.total_earnings_ngn.toLocaleString("en-NG")}
          </p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between text-xs text-amber-900">
          <span>Pending Escrow Release:</span>
          <span className="font-extrabold">₦{metrics.pending_escrow_ngn.toLocaleString("en-NG")} NGN</span>
        </div>

        <div className="pt-1 flex gap-2">
          <button
            onClick={() => router.push("/seller/inventory/add")}
            className="flex-1 h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Part</span>
          </button>
          <button
            onClick={() => router.push("/seller/wallet")}
            className="flex-1 h-12 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5"
          >
            <Wallet className="w-4 h-4 text-[#FF4D1A]" />
            <span>Seller Wallet</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => router.push("/seller/orders")}
          className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-1 shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <Package className="w-4 h-4 text-[#FF4D1A]" />
            <ChevronRight className="w-4 h-4" />
          </div>
          <p className="text-xl font-extrabold text-[#121212]">{metrics.today_orders_count}</p>
          <p className="text-[11px] text-[#8A8A8A]">New Orders Today</p>
        </div>

        <div
          onClick={() => router.push("/seller/inventory")}
          className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-1 shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <Boxes className="w-4 h-4 text-[#121212]" />
            <ChevronRight className="w-4 h-4" />
          </div>
          <p className="text-xl font-extrabold text-[#121212]">{metrics.inventory_count}</p>
          <p className="text-[11px] text-[#8A8A8A]">Total Active Listings</p>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {metrics.low_stock_alerts_count > 0 && (
        <div
          onClick={() => router.push("/seller/inventory")}
          className="p-3.5 bg-amber-50 border border-amber-200 rounded-[16px] flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{metrics.low_stock_alerts_count} parts low on stock (&lt;3 items left)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-800 shrink-0" />
        </div>
      )}

      <BottomNav />
    </main>
  );
}
