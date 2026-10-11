"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  ShoppingCart,
  CheckCircle2,
  ChevronRight,
  Phone,
  Truck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { MarketplaceService, PartProduct, SellerOffer } from "@/lib/services/marketplaceService";
import { formatWAT } from "@/lib/timezone";

export default function PartDetailPage() {
  const params = useParams();
  const partId = params?.partId as string;
  const router = useRouter();

  const [part, setPart] = useState<PartProduct | null>(null);
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const fetchPartDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [partData, offersData] = await Promise.all([
        MarketplaceService.getPartById(partId),
        MarketplaceService.getPartSellers(partId),
      ]);
      setPart(partData);
      setOffers(offersData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load part details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partId) {
      fetchPartDetails();
    }
  }, [partId]);

  // Skeleton Loading State
  if (loading) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 font-sans space-y-4">
        <div className="h-8 bg-neutral-200 rounded-xl animate-pulse w-1/2" />
        <div className="h-48 bg-neutral-200 rounded-[16px] animate-pulse w-full" />
        <div className="h-28 bg-neutral-200 rounded-[16px] animate-pulse w-full" />
        <div className="h-32 bg-neutral-200 rounded-[16px] animate-pulse w-full" />
      </main>
    );
  }

  // Error State with Retry
  if (error) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-12 text-center font-sans space-y-4">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <p className="text-xs font-bold text-red-700">{error}</p>
        <button
          onClick={fetchPartDetails}
          className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
        </button>
      </main>
    );
  }

  if (!part) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 text-center font-sans">
        <p className="text-xs text-red-600 font-bold">Auto part not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#121212] text-white text-xs font-bold rounded-[12px]"
        >
          Go Back
        </button>
      </main>
    );
  }

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
    }, 600);
  };

  const handleProceedEscrow = () => {
    router.push(`/checkout/escrow?part_id=${part.id}`);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-24 font-sans space-y-4">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212] truncate max-w-[280px]">
            {part.title}
          </h1>
          <p className="text-[11px] text-[#8A8A8A]">
            Part Ref: {part.part_number || "GENUINE-OEM"}
          </p>
        </div>
      </header>

      {/* Part Image / Photo Placeholder */}
      <div className="w-full h-44 bg-[#121212] rounded-[16px] flex items-center justify-center text-white relative overflow-hidden">
        <div className="text-center p-4">
          <p className="text-sm font-bold">{part.title}</p>
          <p className="text-xs text-[#8A8A8A] mt-1">{part.brand} OEM Part</p>
        </div>
        <span className="absolute top-3 right-3 bg-[#FF4D1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {part.condition}
        </span>
      </div>

      {/* Pricing with mandatory 48px Typography & Compatibility Badge */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm">
        <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
          Best Available Price
        </span>
        <div className="flex items-baseline justify-between">
          <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
            ₦{part.price.toLocaleString("en-NG")}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-emerald-200 mt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fitment Verified 100% for Garage Vehicle</span>
        </div>

        {/* Compatibility Specs */}
        <div className="p-3 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] space-y-1 text-xs text-[#121212]">
          <p className="font-bold flex items-center justify-between">
            <span>Compatible Vehicles:</span>
            <span className="font-semibold text-[#8A8A8A]">
              {part.compatibility.makes.join(", ")} ({part.compatibility.year_start}-{part.compatibility.year_end})
            </span>
          </p>
          <p className="font-bold flex items-center justify-between">
            <span>Stock Available:</span>
            <span className="font-semibold text-[#121212]">{part.stock_quantity} units in store</span>
          </p>
        </div>
      </div>

      {/* Compare Sellers Section with Phone Masking */}
      <section className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
          <h2 className="text-xs font-bold text-[#121212]">Compare Verified Sellers ({offers.length})</h2>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
            PartMatch KYC
          </span>
        </div>

        {offers.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#8A8A8A]">No comparative offers available.</div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.seller_id}
                className="p-3 border border-[#EAEAEA] rounded-[12px] bg-[#FFFBF5] space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#121212]">{offer.seller_name}</p>
                    <p className="text-[11px] text-[#8A8A8A]">
                      📍 {offer.location} • ★ {offer.rating} ({offer.reviews_count} reviews)
                    </p>
                  </div>
                  <p className="text-sm font-extrabold text-[#FF4D1A]">
                    ₦{offer.price_ngn.toLocaleString("en-NG")}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#EAEAEA]/80">
                  <span className="flex items-center gap-1 text-[#8A8A8A]">
                    <Truck className="w-3 h-3 text-[#121212]" /> {offer.delivery_days}
                  </span>

                  {/* Masked Phone Number Security Requirement */}
                  <span className="flex items-center gap-1 font-mono text-[#121212] bg-white px-2 py-0.5 border border-[#EAEAEA] rounded-md text-[10px]">
                    <Phone className="w-3 h-3 text-amber-600" />
                    <span>{offer.contact_phone_masked}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Primary Seller Details */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
          <p className="text-xs font-bold text-[#121212]">Primary Verified Dealer</p>
          <button
            onClick={() => router.push(`/seller/${part.seller.id}`)}
            className="text-xs text-[#FF4D1A] font-bold flex items-center gap-0.5 hover:underline"
          >
            Store Profile <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#121212]">{part.seller.store_name}</p>
            <p className="text-xs text-[#8A8A8A]">
              📍 {part.seller.location} • ★ {part.seller.rating} ({part.seller.total_sales} sales)
            </p>
            <p className="text-[10px] text-[#8A8A8A] mt-0.5">
              Verified {formatWAT(part.seller.verified_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Part Description */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2">
        <p className="text-xs font-bold text-[#121212]">Part Description & Specifications</p>
        <p className="text-xs text-[#8A8A8A] leading-relaxed">{part.description}</p>
      </div>

      {/* Escrow Protection Promise */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-[16px] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-0.5">
          <p className="font-bold">72-Hour Escrow Protection Included</p>
          <p className="text-[11px] leading-tight">
            Funds held securely in PartMatch Escrow. Seller receives payment only after you or your mechanic confirms part fitment.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-4 bg-[#FFFBF5] pt-2 flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="flex-1 h-14 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 hover:bg-neutral-50 active:scale-[0.98] transition-transform"
        >
          {added ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 text-[#121212]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          onClick={handleProceedEscrow}
          className="flex-1 h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <span>Buy via Escrow</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
