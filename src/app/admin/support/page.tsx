"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Send, CheckCircle2, User } from "lucide-react";
import { SupportService, SupportTicket, SupportChatMessage } from "@/lib/services/supportService";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    SupportService.getTickets().then((data) => {
      setTickets(data);
      if (data.length > 0) {
        setSelectedTicket(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      SupportService.getChatMessages(selectedTicket.id).then((msgs) => setMessages(msgs));
    }
  }, [selectedTicket]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;

    const newMsg: SupportChatMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: selectedTicket.id,
      sender_id: "admin-001",
      sender_role: "admin",
      message: reply,
      read: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setReply("");
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#121212]">Live Support & Dispute Chat Management</h1>
        <p className="text-xs text-[#8A8A8A]">Real-time Agent Chat Console & Support Ticket Arbitration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Tickets List */}
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
          <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5 border-b border-[#EAEAEA] pb-2">
            <MessageSquare className="w-4 h-4 text-[#FF4D1A]" /> Open Support Tickets
          </h2>

          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3 rounded-[12px] border cursor-pointer text-xs space-y-1 ${
                  selectedTicket?.id === t.id
                    ? "bg-[#FFFBF5] border-[#FF4D1A]"
                    : "bg-white border-[#EAEAEA] hover:border-neutral-300"
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span>{t.id}</span>
                  <span className="text-[10px] bg-[#121212] text-white px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                </div>
                {t.order_ref && <p className="text-[10px] text-[#8A8A8A] font-mono">{t.order_ref}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Chat Console */}
        <div className="md:col-span-2 bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex flex-col justify-between shadow-sm min-h-[400px]">
          {selectedTicket ? (
            <>
              <div className="border-b border-[#EAEAEA] pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-[#121212]">
                    Chat Thread #{selectedTicket.id} - {selectedTicket.category}
                  </h3>
                  <p className="text-xs text-[#8A8A8A]">User ID: {selectedTicket.user_id}</p>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded">
                  {selectedTicket.status}
                </span>
              </div>

              {/* Chat Thread Messages */}
              <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[300px]">
                {messages.map((m) => {
                  const isAdmin = m.sender_role === "admin" || m.sender_role === "support";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`p-3 rounded-[12px] text-xs max-w-[80%] font-medium ${
                          isAdmin
                            ? "bg-[#121212] text-white"
                            : "bg-[#FFFBF5] border border-[#EAEAEA] text-[#121212]"
                        }`}
                      >
                        <p>{m.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-[#EAEAEA] flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type official admin response..."
                  className="flex-1 px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-[#8A8A8A]">Select a ticket to open chat thread.</div>
          )}
        </div>
      </div>
    </div>
  );
}
