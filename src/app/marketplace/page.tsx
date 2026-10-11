"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ShieldCheck, Star, Truck, ArrowLeft, ArrowRight, Store } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface InventoryItem {
  id: string;
  part_name: string;
  price_ngn: number;
  condition?: "GENUINE_OEM" | "AFTERMARKET_HIGH_GRADE" | "AFTERMARKET" | "USED";
  seller_id: string;
  seller_store_name?: string;
  delivery_time_hours?: number;
  rating?: number;
  stock_quantity?: number;
}

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKeyword = searchParams?.get("search") || "";
  const supabase = createClient();

  const [queryText, setQueryText] = useState(searchKeyword);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovedParts() {
      setLoading(true);
      let query = supabase.from("inventory").select("*").eq("status", "APPROVED");

      if (queryText.trim()) {
        query = query.ilike("part_name", `%${queryText.trim()}%`);
      }

      const { data } = await query;
      setItems(data || []);
      setLoading(false);
    }

    fetchApprovedParts();
  }, [queryText]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/marketplace?search=${encodeURIComponent(queryText)}`);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-28 font-sans space-y-4">
      {/* Search Header */}
      <header className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-[#121212]">Compare Verified Sellers</h1>
            <p className="text-[10px] text-[#8A8A8A]">Escrow-Protected Marketplace</p>
          </div>
          <div className="w-8" />
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search part name e.g. Brake Pad, Shock Absorber..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A] shadow-sm"
          />
          <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3.5" />
        </form>
      </header>

      {/* List / Skeleton / Empty */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-32 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-32 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <Store className="w-12 h-12 text-[#8A8A8A] mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No sellers for this part</h2>
            <p className="text-xs text-[#8A8A8A]">Try a broader search or request manual seller quotes.</p>
          </div>
          <button
            onClick={() => setQueryText("")}
            className="w-full h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] shadow-sm inline-flex items-center justify-center gap-1.5"
          >
            <span>Reset Search Filter</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/marketplace/${item.id}`)}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm cursor-pointer hover:border-[#FF4D1A] transition-colors"
            >
              {/* Top Row: Seller Name + Genuine Tag */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#121212]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{item.seller_store_name || "Ladipo Auto Spares Merchant"}</span>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                  {item.condition === "GENUINE_OEM" ? "Genuine OEM" : "Aftermarket"}
                </span>
              </div>

              {/* Part Name */}
              <h3 className="text-sm font-bold text-[#121212]">{item.part_name}</h3>

              {/* Price 48px Hierarchy Design Lock */}
              <div className="flex items-baseline justify-between pt-1 border-t border-[#EAEAEA]">
                <p className="text-[36px] font-extrabold text-[#121212] leading-none tracking-tight">
                  ₦{Number(item.price_ngn || 0).toLocaleString("en-NG")}
                </p>
                <div className="text-right space-y-0.5">
                  <p className="text-[10px] text-[#8A8A8A] flex items-center gap-1 justify-end">
                    <Truck className="w-3 h-3 text-[#FF4D1A]" /> {item.delivery_time_hours || 24}h Same-Day Delivery
                  </p>
                  <p className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5 justify-end">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {item.rating || 4.8} Seller Rating
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end text-xs text-[#FF4D1A] font-bold gap-1">
                <span>View Details & Escrow Buy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8A8A8A]">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
