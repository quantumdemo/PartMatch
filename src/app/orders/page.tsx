"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, ShieldCheck, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface OrderRecord {
  id: string;
  order_ref?: string;
  part_title?: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filterTab, setFilterTab] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", userId)
        .order("created_at", { ascending: false });

      if (filterTab === "ACTIVE") {
        query = query.in("status", ["SECURED_IN_ESCROW", "SHIPPED", "DISPATCHED"]);
      } else if (filterTab === "COMPLETED") {
        query = query.in("status", ["CONFIRMED", "RELEASED", "DELIVERED"]);
      }

      const { data, error: fetchErr } = await query;

      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        setOrders(data || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load orders.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterTab]);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Top Bar Header */}
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">My Escrow Orders</h1>
          <p className="text-[11px] text-[#8A8A8A]">Track active deliveries & escrow release</p>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex bg-white border border-[#EAEAEA] p-1 rounded-[12px] gap-1">
        {(["ALL", "ACTIVE", "COMPLETED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-[8px] transition-colors ${
              filterTab === tab
                ? "bg-[#FF4D1A] text-white"
                : "text-[#8A8A8A] hover:text-[#121212]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : error ? (
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
        /* Empty State */
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 bg-[#FFFBF5] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto text-[#FF4D1A]">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No Orders Found</h2>
            <p className="text-xs text-[#8A8A8A] max-w-[280px] mx-auto">
              You have no {filterTab.toLowerCase()} escrow purchases.
            </p>
          </div>
          <button
            onClick={() => router.push("/marketplace")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
          >
            <span>Explore Spare Parts Marketplace</span>
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
                  {o.order_ref || o.id.slice(0, 8)}
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  {o.status || "SECURED_IN_ESCROW"}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#121212]">{o.part_title || "Spare Part Order"}</p>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5">
                    {new Date(o.created_at || Date.now()).toLocaleDateString("en-NG")}
                  </p>
                </div>
                <p className="text-sm font-extrabold text-[#FF4D1A]">
                  ₦{Number(o.total_amount || 0).toLocaleString("en-NG")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
