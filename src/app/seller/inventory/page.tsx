"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Boxes, ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface InventoryItem {
  id: string;
  part_name: string;
  price_ngn: number;
  stock_quantity?: number;
  status?: string;
  condition?: string;
}

export default function SellerInventoryPage() {
  const router = useRouter();
  const supabase = createClient();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInventory() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data } = await supabase
          .from("inventory")
          .select("*")
          .eq("seller_id", userId)
          .order("created_at", { ascending: false });

        setItems(data || []);
      } else {
        setItems([]);
      }

      setLoading(false);
    }

    loadInventory();
  }, []);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/seller/dashboard")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Store Inventory</h1>
          <p className="text-[11px] text-[#8A8A8A]">Active & Pending Part Listings</p>
        </div>
        <button
          onClick={() => router.push("/seller/inventory/add")}
          className="p-2 bg-[#FF4D1A] text-white rounded-[12px]"
        >
          <Plus className="w-4 h-4" />
        </button>
      </header>

      {loading ? (
        <div className="space-y-3">
          <div className="h-24 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <Boxes className="w-12 h-12 text-[#8A8A8A] mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No parts listed</h2>
            <p className="text-xs text-[#8A8A8A]">List auto spare parts to start receiving escrow buyer orders.</p>
          </div>
          <button
            onClick={() => router.push("/seller/inventory/add")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Part Listing</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
                <h3 className="text-xs font-bold text-[#121212]">{item.part_name}</h3>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                    item.status === "APPROVED"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {item.status || "PENDING_REVIEW"}
                </span>
              </div>

              {/* Price BIG 48px Hierarchy */}
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-[32px] font-extrabold text-[#121212] leading-none tracking-tight">
                  ₦{Number(item.price_ngn || 0).toLocaleString("en-NG")}
                </p>
                <span className="text-[11px] text-[#8A8A8A]">
                  Stock: <strong>{item.stock_quantity || 0} units</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
