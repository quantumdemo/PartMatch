"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { SupportService } from "@/lib/services/supportService";

function NewSupportChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") || "General Support";

  const [message, setMessage] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setCreating(true);
    const ticket = await SupportService.createTicket("user-123", category, message, orderRef || undefined);
    setCreating(false);
    router.push(`/support/chat/${ticket.id}`);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-20 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">New Live Support Chat</h1>
          <p className="text-[11px] text-[#8A8A8A]">Category: {category}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">Order PM-REF Reference (Optional)</label>
          <input
            type="text"
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value.toUpperCase())}
            placeholder="e.g. PM-REF-11111111"
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">Describe Your Issue</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you need help with..."
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <Send className="w-4 h-4" />
          <span>{creating ? "Connecting to Support..." : "Start Live Chat Session"}</span>
        </button>
      </form>
    </main>
  );
}

export default function NewSupportChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#8A8A8A]">Loading...</div>}>
      <NewSupportChatContent />
    </Suspense>
  );
}
