"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  ShoppingCart,
  CheckCircle2,
  ChevronRight,
  Truck,
  AlertCircle,
  PackageOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface InventoryDetail {
  id: string;
  part_name: string;
  category: string;
  price_ngn: number;
  condition?: string;
  seller_id: string;
  seller_store_name?: string;
  seller_location?: string;
  stock_quantity?: number;
  compatibility?: string;
  description?: string;
  oem_number?: string;
}

export default function PartDetailPage() {
  const params = useParams();
  const partId = params?.partId as string;
  const router = useRouter();
  const supabase = createClient();

  const [item, setItem] = useState<InventoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadItem() {
      if (!partId) return;
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("inventory")
        .select("*")
        .eq("id", partId)
        .maybeSingle();

      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        setItem(data);
      }
      setLoading(false);
    }

    loadItem();
  }, [partId]);

  const handleAddToCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (userId && item) {
      await supabase.from("cart_items").upsert({
        user_id: userId,
        inventory_id: item.id,
        part_name: item.part_name,
        price_ngn: item.price_ngn,
        quantity: 1,
      });
    }

    setAdded(true);
  };

  const handleBuyEscrow = () => {
    router.push(`/checkout?inventory_id=${partId}`);
  };

  if (loading) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 font-sans space-y-4">
        <div className="h-8 bg-neutral-200/80 rounded-xl animate-pulse w-1/2" />
        <div className="h-44 bg-neutral-200/80 rounded-[16px] animate-pulse w-full" />
        <div className="h-32 bg-neutral-200/80 rounded-[16px] animate-pulse w-full" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-12 text-center font-sans space-y-4">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <p className="text-xs font-bold text-red-700">{error}</p>
        <button
          onClick={() => router.push("/marketplace")}
          className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px]"
        >
          Back to Marketplace
        </button>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-12 pb-20 text-center font-sans space-y-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-[#121212]">
          <PackageOpen className="w-8 h-8 text-[#8A8A8A]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[#121212]">Part Listing Not Found</h2>
          <p className="text-xs text-[#8A8A8A]">
            This spare part has been purchased or is unavailable in the database.
          </p>
        </div>
        <button
          onClick={() => router.push("/marketplace")}
          className="px-5 py-3 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm active:scale-[0.98] transition-transform"
        >
          Search Marketplace
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212] truncate max-w-[280px]">
            {item.part_name}
          </h1>
          <p className="text-[11px] text-[#8A8A8A]">
            OEM Ref: {item.oem_number || "GENUINE-OEM"}
          </p>
        </div>
      </header>

      {/* Part Header Card */}
      <div className="w-full h-36 bg-[#121212] rounded-[16px] p-5 flex flex-col justify-between text-white shadow-md relative">
        <span className="self-start text-[10px] bg-[#FF4D1A] text-white font-bold px-2 py-0.5 rounded-full">
          {item.condition || "GENUINE_OEM"}
        </span>
        <div>
          <h2 className="text-lg font-bold text-white">{item.part_name}</h2>
          <p className="text-xs text-[#8A8A8A]">{item.category}</p>
        </div>
      </div>

      {/* Big 48px Price Hierarchy */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">Listing Price</span>
        <div className="flex items-baseline justify-between">
          <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
            ₦{Number(item.price_ngn || 0).toLocaleString("en-NG")}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fitment Guaranteed via Escrow Protection</span>
        </div>

        <div className="p-3 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] space-y-1 text-xs text-[#121212]">
          <p className="font-bold flex items-center justify-between">
            <span>Seller:</span>
            <span className="font-semibold text-[#8A8A8A]">{item.seller_store_name || "Ladipo Merchant"}</span>
          </p>
          <p className="font-bold flex items-center justify-between">
            <span>Stock Available:</span>
            <span className="font-semibold text-[#121212]">{item.stock_quantity || 1} units</span>
          </p>
        </div>
      </div>

      {/* Escrow Protection Promise */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-[16px] flex items-start gap-3">
        <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-0.5">
          <p className="font-bold">Payment Protected by Escrow</p>
          <p className="text-[11px] leading-tight">
            Money held securely until you or your mechanic confirm part installation.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FFFBF5]/90 backdrop-blur-md max-w-[440px] mx-auto border-t border-[#EAEAEA] flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 h-14 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 hover:bg-neutral-50 active:scale-[0.98] transition-transform"
        >
          {added ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 text-[#121212]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyEscrow}
          className="flex-1 h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.97] transition-transform"
        >
          <span>Buy via Escrow</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
