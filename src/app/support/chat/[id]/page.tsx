"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { SupportService, SupportChatMessage } from "@/lib/services/supportService";
import { formatWAT } from "@/lib/timezone";

export default function SupportChatThreadPage() {
  const params = useParams();
  const ticketId = params?.id as string;
  const router = useRouter();

  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState("");

  useEffect(() => {
    if (ticketId) {
      SupportService.getChatMessages(ticketId).then((data) => setMessages(data));
    }
  }, [ticketId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const currentMsg = inputMsg;
    setInputMsg("");

    const newMsg = await SupportService.sendMessage(ticketId, "user-123", "user", currentMsg);
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <main className="max-w-[440px] mx-auto bg-[#FFFBF5] min-h-screen font-sans flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-4 bg-white border-b border-[#EAEAEA] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-[#FFFBF5] border border-[#EAEAEA] text-[#121212]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#121212]">Live Support #{ticketId}</h1>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Agent Online
            </p>
          </div>
        </div>
      </header>

      {/* Chat Threads Area */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto pb-24">
        {messages.map((m) => {
          const isUser = m.sender_role === "user";
          const isSystem = m.sender_role === "system";

          if (isSystem) {
            return (
              <div key={m.id} className="text-center my-2">
                <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-bold">
                  {m.message}
                </span>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-[16px] text-xs font-medium space-y-1 shadow-sm ${
                  isUser
                    ? "bg-[#FF4D1A] text-white rounded-tr-none"
                    : "bg-white border border-[#EAEAEA] text-[#121212] rounded-tl-none"
                }`}
              >
                <p>{m.message}</p>
                <p
                  className={`text-[9px] text-right font-mono ${
                    isUser ? "text-white/80" : "text-[#8A8A8A]"
                  }`}
                >
                  {formatWAT(m.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Input Bar */}
      <form
        onSubmit={handleSend}
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto p-3 bg-white border-t border-[#EAEAEA] flex items-center gap-2 z-20"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
        />
        <button
          type="submit"
          className="w-10 h-10 bg-[#FF4D1A] text-white rounded-[12px] flex items-center justify-center shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </main>
  );
}
