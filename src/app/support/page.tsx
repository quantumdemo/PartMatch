"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Phone,
  Mail,
  Search,
  Wallet,
  Package,
  ShieldCheck,
  User,
  Wrench,
  Store,
  ArrowLeft,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const FAQ_CATEGORIES = [
  { id: "Wallet", label: "Wallet & Funding", icon: Wallet },
  { id: "Orders", label: "Orders & Shipping", icon: Package },
  { id: "Escrow", label: "72h Escrow Release", icon: ShieldCheck },
  { id: "KYC", label: "KYC Verification", icon: User },
  { id: "Mechanic Jobs", label: "Mechanic Jobs", icon: Wrench },
  { id: "Seller Listings", label: "Merchant Listings", icon: Store },
];

export default function CustomerSupportPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Top Header */}
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">OPay Support Center</h1>
          <p className="text-[11px] text-[#8A8A8A]">24/7 Live Assistance & FAQs</p>
        </div>
      </header>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search support FAQs..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
        />
      </div>

      {/* Categories Grid */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-[#121212]">Help Categories</p>
        <div className="grid grid-cols-2 gap-2.5">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => router.push(`/support/chat/new?category=${encodeURIComponent(cat.id)}`)}
                className="p-3.5 bg-white border border-[#EAEAEA] rounded-[16px] flex items-center gap-2.5 cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="w-8 h-8 bg-[#FFFBF5] border border-[#EAEAEA] rounded-xl flex items-center justify-center text-[#FF4D1A]">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#121212]">{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Chat & Contact CTAs */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm pt-4">
        <p className="text-xs font-bold text-[#121212]">Need Live Agent Help?</p>

        <button
          onClick={() => router.push("/support/chat/new?category=General")}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat With Us Online Now</span>
        </button>

        <div className="flex gap-2">
          <a
            href="tel:+2348007278628"
            className="flex-1 h-12 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Call Support</span>
          </a>

          <a
            href="mailto:support@partmatch.ng"
            className="flex-1 h-12 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5"
          >
            <Mail className="w-4 h-4 text-[#FF4D1A]" />
            <span>Email Us</span>
          </a>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
