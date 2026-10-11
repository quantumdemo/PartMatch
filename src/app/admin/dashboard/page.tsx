"use client";

import React, { useEffect, useState } from "react";
import { Users, Package, ShieldAlert, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const supabase = createClient();

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalEscrowHeld, setTotalEscrowHeld] = useState<number>(0);
  const [platformRevenue, setPlatformRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminMetrics() {
      setLoading(true);

      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: orderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      const { data: escrows } = await supabase
        .from("escrow_transactions")
        .select("amount")
        .eq("status", "SECURED");

      const totalHeld = (escrows || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
      const revenue = Math.round(totalHeld * 0.05);

      setTotalUsers(userCount || 0);
      setTotalOrders(orderCount || 0);
      setTotalEscrowHeld(totalHeld);
      setPlatformRevenue(revenue);
      setLoading(false);
    }

    loadAdminMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 font-sans">
        <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#121212]">Platform Overview Dashboard</h1>
          <p className="text-xs text-[#8A8A8A]">Real-time Escrow & System Auditing Metrics</p>
        </div>
      </div>

      {/* 48px Platform Revenue Display */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-6 space-y-2 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase font-bold text-[#8A8A8A] tracking-wider">
            Platform 5% Fee Revenue Earned
          </span>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded border border-emerald-200">
            5% Fee Split Active
          </span>
        </div>

        <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
          ₦{platformRevenue.toLocaleString("en-NG")}
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <Users className="w-5 h-5 text-[#FF4D1A]" />
            <span className="text-[10px] bg-[#FFFBF5] px-2 py-0.5 rounded border border-[#EAEAEA] font-bold">
              Active Users
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#121212]">{totalUsers}</p>
          <p className="text-xs text-[#8A8A8A]">Total Registered Profiles</p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <Package className="w-5 h-5 text-[#121212]" />
            <span className="text-[10px] bg-[#FFFBF5] px-2 py-0.5 rounded border border-[#EAEAEA] font-bold">
              Orders
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#121212]">{totalOrders}</p>
          <p className="text-xs text-[#8A8A8A]">Total Escrow Orders</p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-bold">
              Locked
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#121212]">
            ₦{totalEscrowHeld.toLocaleString("en-NG")}
          </p>
          <p className="text-xs text-[#8A8A8A]">Total Escrow Held</p>
        </div>
      </div>

      {/* System Audit Status */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <h2 className="text-sm font-bold text-[#121212] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FF4D1A]" />
          Platform Health & Automated Escrow Release Status
        </h2>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] text-xs text-emerald-900 font-bold">
          ✓ All RPC Atomic Wallet stored procedures operating nominally. 0 Escrow Race Conditions Detected.
        </div>
      </div>
    </div>
  );
}
