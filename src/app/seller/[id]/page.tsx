"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, MapPin, Star, Award, CheckCircle2 } from "lucide-react";
import { MarketplaceService, SellerProfileInfo, PartProduct } from "@/lib/services/marketplaceService";

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params?.id as string;
  const router = useRouter();

  const [seller, setSeller] = useState<SellerProfileInfo | null>(null);
  const [parts, setParts] = useState<PartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerId) {
      Promise.all([
        MarketplaceService.getSellerProfile(sellerId),
        MarketplaceService.searchParts(""),
      ]).then(([sellerData, partsData]) => {
        setSeller(sellerData);
        setParts(partsData.filter((p) => p.seller_id === sellerId));
        setLoading(false);
      });
    }
  }, [sellerId]);

  if (loading) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 text-center font-sans">
        <p className="text-xs text-[#8A8A8A]">Loading seller profile & store inventory...</p>
      </main>
    );
  }

  if (!seller) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 text-center font-sans">
        <p className="text-xs text-red-600 font-bold">Seller profile not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#121212] text-white text-xs font-bold rounded-[12px]"
        >
          Go Back
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-20 font-sans space-y-4">
      {/* Top Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">{seller.store_name}</h1>
          <p className="text-[11px] text-[#8A8A8A]">Verified Auto Parts Dealer</p>
        </div>
      </header>

      {/* Seller Hero Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FF4D1A] text-white rounded-full flex items-center justify-center font-bold text-lg">
              {seller.store_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-[#121212]">{seller.store_name}</h2>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-[#8A8A8A] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#FF4D1A]" />
                <span>{seller.location}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Verification & Metrics badges */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#EAEAEA]">
          <div className="p-2 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
            <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{seller.rating}</span>
            </div>
            <p className="text-[10px] text-[#8A8A8A] mt-0.5">Rating</p>
          </div>

          <div className="p-2 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
            <p className="text-xs font-bold text-[#121212]">{seller.total_sales}</p>
            <p className="text-[10px] text-[#8A8A8A] mt-0.5">Parts Sold</p>
          </div>

          <div className="p-2 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
            <p className="text-xs font-bold text-emerald-700">{seller.fitment_guarantee_rate}</p>
            <p className="text-[10px] text-[#8A8A8A] mt-0.5">Fitment Match</p>
          </div>
        </div>

        {/* KYC Compliance Status */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] flex items-center gap-2.5 text-xs text-emerald-900">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">CAC & Physical Store Live-Verified</p>
            <p className="text-[10px] text-emerald-700">
              Identity, store photo, and GPS verified by PartMatch Field Team.
            </p>
          </div>
        </div>
      </div>

      {/* Store Inventory Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#121212]">
            Store Inventory ({parts.length})
          </h3>
          <span className="text-[11px] text-[#8A8A8A]">Sorted by Fitment Rating</span>
        </div>

        {parts.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#EAEAEA] rounded-[16px] text-xs text-[#8A8A8A]">
            No parts listed in store currently.
          </div>
        ) : (
          <div className="space-y-3">
            {parts.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/marketplace/${p.id}`)}
                className="bg-white border border-[#EAEAEA] rounded-[16px] p-3.5 flex items-center justify-between cursor-pointer hover:border-[#FF4D1A] transition-colors"
              >
                <div className="space-y-1">
                  <span className="bg-[#121212] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {p.brand}
                  </span>
                  <p className="text-xs font-bold text-[#121212]">{p.title}</p>
                  <p className="text-[11px] text-[#8A8A8A]">
                    Fits {p.compatibility.makes.join(", ")} ({p.compatibility.year_start}-{p.compatibility.year_end})
                  </p>
                  <p className="text-sm font-extrabold text-[#FF4D1A] pt-1">
                    ₦{p.price.toLocaleString("en-NG")}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    In Stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
