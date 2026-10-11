"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, ShieldCheck, MessageSquare, Package } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface NotificationItem {
  id: string;
  type: "announcement" | "order" | "escrow" | "support";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        setNotifications(data || []);
      } else {
        setNotifications([]);
      }

      setLoading(false);
    }

    loadNotifications();
  }, []);

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "escrow":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "support":
        return <MessageSquare className="w-4 h-4 text-amber-600" />;
      case "order":
        return <Package className="w-4 h-4 text-[#FF4D1A]" />;
      default:
        return <Bell className="w-4 h-4 text-[#FF4D1A]" />;
    }
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Notifications</h1>
          <p className="text-[11px] text-[#8A8A8A]">Order & Escrow Alerts</p>
        </div>
      </header>

      {loading ? (
        <div className="space-y-3">
          <div className="h-20 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-20 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <Bell className="w-12 h-12 text-[#8A8A8A] mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No notifications yet</h2>
            <p className="text-xs text-[#8A8A8A]">Order, escrow and support notifications will show up here.</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 bg-white border rounded-[16px] space-y-1 shadow-sm transition-colors ${
                !n.read ? "border-[#FF4D1A]/50 bg-[#FF4D1A]/5" : "border-[#EAEAEA]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(n.type)}
                  <span className="text-xs font-bold text-[#121212]">{n.title}</span>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#FF4D1A]" />
                )}
              </div>
              <p className="text-xs text-[#8A8A8A]">{n.message}</p>
              <p className="text-[9px] text-[#8A8A8A] font-mono">
                {new Date(n.created_at || Date.now()).toLocaleTimeString("en-NG", {
                  timeZone: "Africa/Lagos",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WAT
              </p>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
