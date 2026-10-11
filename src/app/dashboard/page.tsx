"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  Bell,
  Scan,
  ShieldCheck,
  ChevronRight,
  Car,
  Package,
  Wrench,
  PlusCircle,
  Megaphone,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface Announcement {
  id: string;
  title: string;
  message: string;
}

interface OrderItem {
  id: string;
  part_title?: string;
  order_ref?: string;
  total_amount?: number;
  status?: string;
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string>("Driver");
  const [roleCode, setRoleCode] = useState<string>("R-01");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        // Query user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("user_id", userId)
          .maybeSingle();

        if (profile?.full_name) {
          const firstName = profile.full_name.trim().split(" ")[0];
          setProfileName(firstName);
        } else {
          setProfileName("Driver");
        }

        if (profile?.role) {
          setRoleCode(profile.role);
        }

        // Query wallet balance
        const { data: wallet } = await supabase
          .from("wallets")
          .select("available_balance")
          .eq("user_id", userId)
          .maybeSingle();

        setWalletBalance(Number(wallet?.available_balance || 0));

        // Query orders
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("buyer_id", userId)
          .order("created_at", { ascending: false })
          .limit(3);

        setOrders(orderData || []);
      } else {
        setProfileName("Driver");
        setWalletBalance(0);
        setOrders([]);
      }

      // Query announcements
      const { data: annData } = await supabase
        .from("announcements")
        .select("*")
        .in("target_role", ["All", "R-01"])
        .order("created_at", { ascending: false })
        .limit(1);

      setAnnouncements(annData || []);
      setLoading(false);
    }

    loadHomeData();
  }, []);

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Header: Hi Name + Help + Bell */}
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#FF4D1A] text-white rounded-full flex items-center justify-center font-bold text-sm">
            {profileName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#121212]">Hi, {profileName}</h1>
            <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {roleCode} Verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#121212]">
          <button
            onClick={() => router.push("/support")}
            className="p-2 rounded-xl bg-white border border-[#EAEAEA]"
          >
            <HelpCircle className="w-4 h-4 text-[#8A8A8A]" />
          </button>
          <button
            onClick={() => router.push("/notifications")}
            className="p-2 rounded-xl bg-white border border-[#EAEAEA] relative"
          >
            <Bell className="w-4 h-4 text-[#8A8A8A]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D1A] rounded-full" />
          </button>
        </div>
      </header>

      {/* Announcement Banner if present */}
      {announcements.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-3 flex items-start gap-2.5 text-xs text-amber-900">
          <Megaphone className="w-4 h-4 text-[#FF4D1A] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{announcements[0].title}</p>
            <p className="text-[11px] text-amber-800">{announcements[0].message}</p>
          </div>
        </div>
      )}

      {/* Wallet Balance Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
            Withdrawable Wallet Balance
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
            Escrow Protected
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-[48px] font-extrabold text-[#121212] leading-none tracking-tight">
            ₦{walletBalance.toLocaleString("en-NG")}
          </p>
          <button
            onClick={() => router.push("/wallet")}
            className="text-xs text-[#FF4D1A] font-bold flex items-center gap-0.5 hover:underline"
          >
            Wallet <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={() => router.push("/wallet")}
            className="flex-1 h-11 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.97] transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Fund Wallet</span>
          </button>
          <button
            onClick={() => router.push("/garage")}
            className="flex-1 h-11 bg-white border border-[#EAEAEA] hover:border-slate-300 text-[#121212] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
          >
            <Car className="w-4 h-4 text-[#FF4D1A]" />
            <span>Garage Vehicles</span>
          </button>
        </div>
      </div>

      {/* AI Diagnostic Scanner Quick Access Button */}
      <div
        onClick={() => router.push("/diagnose")}
        className="bg-[#FF4D1A] text-white rounded-[16px] p-4 flex items-center justify-between cursor-pointer active:scale-[0.97] transition-transform shadow-md"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Scan className="w-4 h-4 text-white" />
            <span>AI Part Diagnostic Scanner</span>
          </div>
          <p className="text-xs font-semibold text-white">Scan Part Photo or Describe Symptom</p>
          <p className="text-[10px] text-white/80">Instant OEM Part Number & Fitment Match</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white" />
      </div>

      {/* Recent Orders Section */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#FF4D1A]" />
            Recent Escrow Orders
          </h2>
          <button
            onClick={() => router.push("/orders")}
            className="text-xs text-[#FF4D1A] font-bold hover:underline"
          >
            See All
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-16 bg-neutral-200/80 rounded-[12px] animate-pulse" />
            <div className="h-16 bg-neutral-200/80 rounded-[12px] animate-pulse" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-6 text-center space-y-3 shadow-sm">
            <Package className="w-8 h-8 text-[#8A8A8A] mx-auto" />
            <p className="text-xs font-semibold text-[#121212]">
              No escrow orders yet - Diagnose your vehicle
            </p>
            <button
              onClick={() => router.push("/diagnose")}
              className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[48px] shadow-sm inline-flex items-center gap-1.5"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Diagnose Vehicle Part</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <div
                key={o.id}
                onClick={() => router.push(`/orders/${o.id}`)}
                className="bg-white border border-[#EAEAEA] rounded-[16px] p-3.5 flex items-center justify-between cursor-pointer hover:border-[#FF4D1A] transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#121212]">{o.part_title || "Spare Part Order"}</p>
                  <p className="text-[10px] text-[#8A8A8A] font-mono">{o.order_ref || o.id.slice(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-[#FF4D1A]">
                    ₦{Number(o.total_amount || 0).toLocaleString("en-NG")}
                  </p>
                  <span className="text-[9px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                    {o.status || "ESCROW HELD"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mobile Mechanic Booking Card */}
      <div
        onClick={() => router.push("/mechanics")}
        className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex items-center justify-between cursor-pointer shadow-sm hover:border-[#FF4D1A] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-700 font-bold">
            <Wrench className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#121212]">Book Mobile Mechanic Inspection</p>
            <p className="text-[10px] text-[#8A8A8A]">Find verified mechanics in your area</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
      </div>

      <BottomNav />
    </main>
  );
}
