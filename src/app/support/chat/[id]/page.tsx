"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Image as ImageIcon, CheckCheck, Clock, Sparkles, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ChatMessage {
  id: string;
  sender_role: "user" | "support";
  message_text: string;
  image_url?: string;
  created_at: string;
  read?: boolean;
}

const SMART_PILLS = [
  { label: "📦 Track Order", query: "Where is my order current location and estimated delivery?" },
  { label: "🛡️ Escrow Payout", query: "How does 72-hour escrow release money to sellers?" },
  { label: "🛠️ Book Mechanic", query: "Can a mobile mechanic install my spare part at home?" },
  { label: "💳 Deposit Issue", query: "My Paystack deposit is pending, how to verify transaction?" },
];

export default function RealtimeChatPage() {
  const params = useParams();
  const ticketId = params?.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadChatMessages() {
      if (!ticketId) return;
      const { data } = await supabase
        .from("support_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      setMessages(data || []);
    }

    loadChatMessages();

    // Subscribe to Supabase Realtime channel for live support messages
    const channel = supabase
      .channel(`support_chat:${ticketId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages", filter: `ticket_id=eq.${ticketId}` },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendDirectMessage = async (textToSend: string) => {
    if (!textToSend.trim() && !uploadFile) return;

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || "dev-user";

    let imageUrl = null;
    if (uploadFile) {
      const path = `${userId}/${ticketId}-${Date.now()}-${uploadFile.name}`;
      const { data } = await supabase.storage.from("support-tickets").upload(path, uploadFile, { upsert: true });
      imageUrl = data?.path ? supabase.storage.from("support-tickets").getPublicUrl(data.path).data.publicUrl : null;
    }

    const newMsgObj = {
      ticket_id: ticketId,
      sender_id: userId,
      sender_role: "user" as const,
      message_text: textToSend.trim(),
      image_url: imageUrl,
      created_at: new Date().toISOString(),
      read: true,
    };

    setInputText("");
    setUploadFile(null);

    await supabase.from("support_messages").insert(newMsgObj);

    // Intelligent AI Support Agent Response logic
    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);

      let aiReply = "Thank you for contacting PartMatch Support. A human live agent is assigned to your ticket and will reply shortly.";
      const lower = textToSend.toLowerCase();

      if (lower.includes("track") || lower.includes("order") || lower.includes("location")) {
        aiReply = "📦 Your order is tracked via live GPS on Mapbox. Check the 'Orders' tab to view real-time courier movement and driver phone number!";
      } else if (lower.includes("escrow") || lower.includes("payout") || lower.includes("release")) {
        aiReply = "🛡️ Escrow Protection holds funds safely in escrow. Once you confirm receipt and testing of your spare part, 85% goes to Seller, 15% to Mechanic!";
      } else if (lower.includes("mechanic") || lower.includes("install")) {
        aiReply = "🛠️ Certified Mobile Mechanics are available within your service radius. You can assign a mechanic at checkout or from the 'Mechanics' tab.";
      } else if (lower.includes("deposit") || lower.includes("paystack") || lower.includes("wallet")) {
        aiReply = "💳 Paystack deposits are credited automatically to your PartMatch NGN Wallet upon bank confirmation. Go to 'Wallet' to refresh your balance.";
      }

      await supabase.from("support_messages").insert({
        ticket_id: ticketId,
        sender_id: "ai-assistant",
        sender_role: "support",
        message_text: aiReply,
        created_at: new Date().toISOString(),
        read: true,
      });
    }, 1200);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendDirectMessage(inputText);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-20 font-sans flex flex-col justify-between">
      {/* Top Bar */}
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3 bg-[#FFFBF5] sticky top-0 z-10">
        <button
          onClick={() => router.push("/support")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm font-bold text-[#121212]">Live Support Agent</h1>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online • Ticket #{ticketId?.slice(0, 6)}
          </p>
        </div>
      </header>

      {/* Messages Thread Container */}
      <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[calc(100vh-160px)]">
        {messages.map((msg, idx) => {
          const isUser = msg.sender_role === "user";
          const formattedWAT = new Date(msg.created_at || Date.now()).toLocaleTimeString("en-NG", {
            timeZone: "Africa/Lagos",
            hour: "2-digit",
            minute: "2-digit",
          }) + " WAT";

          return (
            <div key={msg.id || idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-[16px] p-3 text-xs space-y-1 shadow-sm ${
                  isUser
                    ? "bg-[#FF4D1A] text-white rounded-br-none"
                    : "bg-white border border-[#EAEAEA] text-[#121212] rounded-bl-none"
                }`}
              >
                {msg.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={msg.image_url} alt="Uploaded attachment" className="w-full h-32 object-cover rounded-[10px] mb-1" />
                )}
                <p className="leading-snug">{msg.message_text}</p>

                <div className={`flex items-center justify-end gap-1 text-[9px] ${isUser ? "text-white/80" : "text-[#8A8A8A]"}`}>
                  <Clock className="w-2.5 h-2.5" />
                  <span>{formattedWAT}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#EAEAEA] text-[#8A8A8A] text-xs px-3 py-2 rounded-[16px] rounded-bl-none flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF4D1A] animate-ping" />
              <span>Support Agent is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AI Smart Quick Reply Pills */}
      <div className="py-2 space-y-1.5 border-t border-[#EAEAEA] bg-[#FFFBF5]">
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#8A8A8A]">
          <Sparkles className="w-3 h-3 text-[#FF4D1A]" />
          <span>AI Quick Assistant Prompts:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SMART_PILLS.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendDirectMessage(pill.query)}
              className="px-2.5 py-1 bg-white hover:bg-[#FF4D1A] hover:text-white text-[11px] font-semibold text-[#121212] border border-[#EAEAEA] rounded-full shrink-0 shadow-sm transition active:scale-[0.97] flex items-center gap-1"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Attachment Preview */}
      {uploadFile && (
        <div className="p-2 bg-white border border-[#FF4D1A] rounded-[12px] flex items-center justify-between text-xs text-[#121212] shadow-sm mb-1">
          <div className="flex items-center gap-2 truncate">
            <ImageIcon className="w-4 h-4 text-[#FF4D1A] shrink-0" />
            <span className="truncate font-semibold">{uploadFile.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadFile(null)}
            className="p-1 text-[#8A8A8A] hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <form onSubmit={handleSendMessage} className="sticky bottom-2 bg-[#FFFBF5]">
        <div className="flex items-center gap-2 bg-white border border-[#EAEAEA] rounded-[24px] p-2 shadow-md">
          <label className="p-2 text-[#8A8A8A] hover:text-[#FF4D1A] cursor-pointer">
            <ImageIcon className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={uploadFile ? `Ready to send image...` : "Ask AI or support agent..."}
            className="flex-1 bg-transparent text-xs text-[#121212] focus:outline-none px-1"
          />

          <button
            type="submit"
            className="w-10 h-10 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </main>
  );
}
