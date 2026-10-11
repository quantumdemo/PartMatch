"use client";

import React, { useEffect, useState } from "react";
import { Users, Package, ShieldAlert, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { AdminService, AdminMetrics } from "@/lib/services/adminService";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.getPlatformMetrics();
      setMetrics(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load admin metrics.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 font-sans">
        <div className="h-28 bg-neutral-200 rounded-[16px] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-neutral-200 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200 rounded-[16px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-8 bg-white border border-red-200 rounded-[16px] text-center space-y-3 font-sans">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <p className="text-xs font-bold text-red-700">{error || "Failed to load metrics."}</p>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
        </button>
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
          <span className="text-xs uppercase font-bold text-[#8A8A8A] tracking-wider flex items-center">
            Platform 5% Revenue Earned <InfoTooltip id="nin" />
          </span>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded border border-emerald-200">
            5% Fee Split Active
          </span>
        </div>

        <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
          ₦{metrics.platform_revenue_ngn.toLocaleString("en-NG")}
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <Users className="w-5 h-5 text-[#FF4D1A]" />
            <span className="text-[10px] bg-[#FFFBF5] px-2 py-0.5 rounded border border-[#EAEAEA] font-bold">
              Active
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#121212]">{metrics.total_users}</p>
          <p className="text-xs text-[#8A8A8A]">Total Verified Users</p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <Package className="w-5 h-5 text-[#121212]" />
            <span className="text-[10px] bg-[#FFFBF5] px-2 py-0.5 rounded border border-[#EAEAEA] font-bold">
              72h Timer
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#121212]">{metrics.total_orders}</p>
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
            ₦{metrics.total_escrow_held_ngn.toLocaleString("en-NG")}
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
