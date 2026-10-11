"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Boxes, ArrowLeft, RefreshCw, AlertCircle, Edit3 } from "lucide-react";
import { InventoryService, InventoryItem } from "@/lib/services/inventoryService";
import { BottomNav } from "@/components/BottomNav";

export default function SellerInventoryPage() {
  const router = useRouter();
  const sellerId = "seller-001";

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InventoryService.getSellerInventory(sellerId, search);
      setItems(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load inventory.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [sellerId, search]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const filteredItems = items.filter((item) => {
    if (filterCondition === "GENUINE") return item.condition.includes("OEM");
    if (filterCondition === "AFTERMARKET") return item.condition.includes("AFTERMARKET");
    return true;
  });

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#121212]">Store Inventory</h1>
            <p className="text-[11px] text-[#8A8A8A]">Manage Part Listings & Stock Levels</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/seller/inventory/add")}
          className="p-2.5 bg-[#FF4D1A] text-white rounded-[12px] flex items-center justify-center shadow-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </header>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by part name or OEM number..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs font-bold">
        {["ALL", "GENUINE", "AFTERMARKET"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterCondition(tab)}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              filterCondition === tab
                ? "bg-[#121212] text-white border-[#121212]"
                : "bg-white text-[#8A8A8A] border-[#EAEAEA]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-24 bg-neutral-200 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200 rounded-[16px] animate-pulse" />
        </div>
      ) : error ? (
        /* Error State */
        <div className="p-6 bg-white border border-red-200 rounded-[16px] text-center space-y-3 shadow-sm my-6">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-xs font-bold text-red-700">{error}</p>
          <button
            onClick={fetchInventory}
            className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        /* Empty State UI (Illustration + CTA) */
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 bg-[#FFFBF5] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto text-[#FF4D1A]">
            <Boxes className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No Parts in Inventory</h2>
            <p className="text-xs text-[#8A8A8A] max-w-[280px] mx-auto">
              You have no active spare part listings matching your search filter.
            </p>
          </div>
          <button
            onClick={() => router.push("/seller/inventory/add")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Spare Part</span>
          </button>
        </div>
      ) : (
        /* Inventory Item List */
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/seller/inventory/${item.id}`)}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#FF4D1A] transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[9px] bg-[#121212] text-white font-bold px-1.5 py-0.5 rounded">
                  {item.condition}
                </span>
                <p className="text-xs font-bold text-[#121212]">{item.title}</p>
                <p className="text-[11px] text-[#8A8A8A]">OEM: {item.part_number}</p>
                <p className="text-sm font-extrabold text-[#FF4D1A]">
                  ₦{item.price.toLocaleString("en-NG")}
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 block">
                  {item.stock_quantity} units
                </span>
                <div className="p-1.5 text-[#8A8A8A] hover:text-[#121212]">
                  <Edit3 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
