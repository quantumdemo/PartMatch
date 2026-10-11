"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const SAMPLE_RESULTS = [
  {
    id: "part-brake-pads-001",
    oem: "OEM-04465-02220",
    title: "Front Brake Pads (Ceramic Set)",
    price_ngn: 18500,
    sellers_count: 3,
  },
  {
    id: "part-[#FF4D1A]-filter-002",
    oem: "OEM-17801-21050",
    title: "Air Filter Element",
    price_ngn: 6500,
    sellers_count: 5,
  },
];

export default function ManualSearchFallbackPage() {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-24 font-sans space-y-6">
      <header className="border-b border-[#EAEAEA] pb-4">
        <h1 className="text-2xl font-bold text-[#121212]">Search Parts Catalogue</h1>
        <p className="text-xs text-[#8A8A8A]">Manual fallback search by part name or OEM number</p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by part name e.g. Brake Pads, Oil Filter..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A] shadow-sm"
        />
        <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3.5" />
      </form>

      {/* STATE 1: LOADING SKELETON */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* STATE 2: ERROR STATE */}
      {!loading && error && (
        <div className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-[16px] text-xs space-y-2 text-center">
          <AlertCircle className="w-6 h-6 mx-auto text-red-600" />
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* STATE 3: RESULTS LIST */}
      {!loading && !error && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider">
            Matching Catalogue Items ({SAMPLE_RESULTS.length})
          </h3>

          {SAMPLE_RESULTS.map((item) => (
            <Link
              key={item.id}
              href={`/marketplace/${item.id}`}
              className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] flex items-center justify-between shadow-sm hover:border-[#FF4D1A] transition-colors active:scale-[0.98]"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#8A8A8A]">{item.oem}</span>
                <h4 className="font-bold text-sm text-[#121212]">{item.title}</h4>
                <div className="text-xs font-extrabold text-[#121212] flex items-center gap-1.5 pt-0.5">
                  <span>From ₦{item.price_ngn.toLocaleString()} NGN</span>
                  <span className="text-[10px] bg-slate-100 text-[#8A8A8A] font-normal px-2 py-0.5 rounded-full">
                    {item.sellers_count} Sellers
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <ArrowRight className="w-4 h-4 text-[#8A8A8A]" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
