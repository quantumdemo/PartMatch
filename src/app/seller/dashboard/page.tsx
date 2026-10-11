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
  PlusCircle,
  Wallet,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

export default function SellerDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [storeName, setStoreName] = useState<string>("Seller Store");
  const [todaySales, setTodaySales] = useState<number>(0);
  const [pendingEscrow, setPendingEscrow] = useState<number>(0);
  const [newOrdersCount, setNewOrdersCount] = useState<number>(0);
  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSellerMetrics() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        // Query profile for store name
        const { data: profile } = await supabase
          .from("profiles")
          .select("store_name, company_name, full_name")
          .eq("user_id", userId)
          .maybeSingle();

        setStoreName(profile?.store_name || profile?.company_name || profile?.full_name || "Merchant Store");

        // Query sales & orders where seller_id = user.id
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .eq("seller_id", userId);

        if (orders) {
          const totalSalesVal = orders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);
          setTodaySales(totalSalesVal);
          setNewOrdersCount(orders.filter((o) => o.status === "SECURED_IN_ESCROW").length);
        }

        // Query pending escrow
        const { data: escrows } = await supabase
          .from("escrow_transactions")
          .select("amount")
          .eq("seller_id", userId)
          .eq("status", "SECURED");

        const pending = (escrows || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
        setPendingEscrow(pending);

        // Query inventory count
        const { count } = await supabase
          .from("inventory")
          .select("*", { count: "exact", head: true })
          .eq("seller_id", userId);

        setInventoryCount(count || 0);
      } else {
        setTodaySales(0);
        setPendingEscrow(0);
        setNewOrdersCount(0);
        setInventoryCount(0);
      }

      setLoading(false);
    }

    loadSellerMetrics();
  }, []);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF4D1A] text-white rounded-full flex items-center justify-center font-bold text-sm">
            {storeName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#121212] truncate max-w-[200px]">
              {storeName}
            </h1>
            <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> R-03 Verified Seller
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#121212]">
          <button onClick={() => router.push("/support")} className="p-2 rounded-xl bg-white border border-[#EAEAEA]">
            <HelpCircle className="w-4 h-4 text-[#8A8A8A]" />
          </button>
          <button onClick={() => router.push("/notifications")} className="p-2 rounded-xl bg-white border border-[#EAEAEA] relative">
            <Bell className="w-4 h-4 text-[#8A8A8A]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D1A] rounded-full" />
          </button>
        </div>
      </header>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-36 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : (
        <>
          {/* Total Sales 48px Display Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
                Total Sales Payouts
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                Escrow Protected
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
                ₦{todaySales.toLocaleString("en-NG")}
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between text-xs text-amber-900">
              <span>Pending Escrow Release:</span>
              <span className="font-extrabold">₦{pendingEscrow.toLocaleString("en-NG")} NGN</span>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                onClick={() => router.push("/seller/inventory/add")}
                className="flex-1 h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.97] transition-transform"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Part</span>
              </button>
              <button
                onClick={() => router.push("/seller/wallet")}
                className="flex-1 h-12 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
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
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-1 shadow-sm cursor-pointer hover:border-[#FF4D1A] transition-colors"
            >
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <Package className="w-4 h-4 text-[#FF4D1A]" />
                <ChevronRight className="w-4 h-4" />
              </div>
              <p className="text-2xl font-extrabold text-[#121212]">{newOrdersCount}</p>
              <p className="text-[11px] text-[#8A8A8A]">Orders in Escrow</p>
            </div>

            <div
              onClick={() => router.push("/seller/inventory")}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-1 shadow-sm cursor-pointer hover:border-[#FF4D1A] transition-colors"
            >
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <Boxes className="w-4 h-4 text-[#121212]" />
                <ChevronRight className="w-4 h-4" />
              </div>
              <p className="text-2xl font-extrabold text-[#121212]">{inventoryCount}</p>
              <p className="text-[11px] text-[#8A8A8A]">Total Active Listings</p>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </main>
  );
}
