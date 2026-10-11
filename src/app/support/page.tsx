"use client";

import React, { useState, useEffect } from "react";
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
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

const FAQ_CATEGORIES = [
  { id: "Account", label: "Account", icon: User },
  { id: "Wallet", label: "Wallet", icon: Wallet },
  { id: "Orders", label: "Orders", icon: Package },
  { id: "Escrow", label: "Escrow", icon: ShieldCheck },
  { id: "KYC", label: "KYC", icon: User },
  { id: "Mechanic Jobs", label: "Mechanic Jobs", icon: Wrench },
  { id: "Seller Listings", label: "Seller Listings", icon: Store },
  { id: "Report Issue", label: "Report Issue", icon: AlertTriangle },
];

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function CustomerSupportPage() {
  const router = useRouter();
  const supabase = createClient();

  const [search, setSearch] = useState("");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFaqs() {
      const { data } = await supabase.from("faqs").select("*");
      setFaqs(data || []);
    }
    loadFaqs();
  }, []);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Top Header */}
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">PartMatch Support Center</h1>
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
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
        />
      </div>

      {/* 8 Categories Grid */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-[#121212]">8 Help Categories</p>
        <div className="grid grid-cols-2 gap-2">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => router.push(`/support/chat/new?category=${encodeURIComponent(cat.id)}`)}
                className="p-3 bg-white border border-[#EAEAEA] rounded-[12px] flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-transform hover:border-[#FF4D1A]"
              >
                <div className="w-7 h-7 bg-[#FFFBF5] border border-[#EAEAEA] rounded-lg flex items-center justify-center text-[#FF4D1A] shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-[#121212] truncate">{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm">
        <p className="text-xs font-bold text-[#121212]">Frequently Asked Questions</p>
        {filteredFaqs.length === 0 ? (
          <p className="text-xs text-[#8A8A8A]">No matching FAQ articles. Start a live chat below.</p>
        ) : (
          <div className="space-y-2 text-xs">
            {filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div key={faq.id} className="border border-[#EAEAEA] rounded-[12px] overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : faq.id)}
                    className="w-full p-3 bg-[#FFFBF5] text-left font-bold text-[#121212] flex justify-between items-center"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#FF4D1A]" /> : <ChevronDown className="w-4 h-4 text-[#8A8A8A]" />}
                  </button>
                  {isOpen && (
                    <div className="p-3 bg-white text-[#8A8A8A] text-[11px] border-t border-[#EAEAEA]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Chat & Contact CTAs */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <p className="text-xs font-bold text-[#121212]">Need Live Agent Assistance?</p>

        {/* Big #FF4D1A CTA */}
        <button
          onClick={() => router.push("/support/chat/new?category=General")}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[48px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat with us Online now</span>
        </button>

        <div className="flex gap-2">
          <a
            href="tel:+2348007278628"
            className="flex-1 h-11 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call</span>
          </a>

          <a
            href="mailto:support@partmatch.ng"
            className="flex-1 h-11 bg-white border border-[#EAEAEA] text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#FF4D1A]" />
            <span>Email</span>
          </a>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
