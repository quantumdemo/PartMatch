"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MessageSquare, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function NewSupportChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") || "General";
  const supabase = createClient();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subject.trim() || !description.trim()) {
      setError("Please fill in both subject and issue description.");
      return;
    }

    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || "dev-user-id";

    const { data: ticketData, error: ticketErr } = await supabase.from("support_tickets").insert({
      user_id: userId,
      category,
      subject: subject.trim(),
      status: "OPEN",
      created_at: new Date().toISOString(),
    }).select().maybeSingle();

    if (ticketErr) {
      setError(ticketErr.message);
      setSubmitting(false);
      return;
    }

    const ticketId = ticketData?.id || "ticket-created";

    await supabase.from("support_messages").insert({
      ticket_id: ticketId,
      sender_id: userId,
      sender_role: "user",
      message_text: description.trim(),
      created_at: new Date().toISOString(),
      read: true,
    });

    setSubmitting(false);
    router.push(`/support/chat/${ticketId}`);
  };

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
          <h1 className="text-base font-bold text-[#121212]">New Support Ticket</h1>
          <p className="text-[11px] text-[#8A8A8A]">Category: {category}</p>
        </div>
      </header>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCreateTicket} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">Subject Summary *</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Question regarding escrow release or part compatibility"
            required
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121212]">Describe Your Issue *</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type detailed description of the issue or inquiry..."
            required
            className="w-full p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[48px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{submitting ? "Opening Ticket..." : "Start Live Chat Now"}</span>
        </button>
      </form>
    </main>
  );
}

export default function NewSupportChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8A8A8A]">Loading support chat...</div>}>
      <NewSupportChatContent />
    </Suspense>
  );
}
