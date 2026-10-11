"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, Lock, LogOut, HelpCircle, Settings, ChevronRight, Phone, Mail, MapPin, Edit } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";

interface ProfileData {
  user_id: string;
  full_name?: string;
  phone?: string;
  formatted_address?: string;
  role?: string;
  kyc_status?: string;
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        setEmail(session.user.email || "");

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        setProfile(data);
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      document.cookie = "partmatch_user_role=; path=/; max-age=0;";
      localStorage.removeItem("partmatch_selected_role");
      localStorage.removeItem("role_pending");
    }
    router.push("/onboarding");
  };

  const isVerified = profile?.kyc_status === "VERIFIED";

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      <header className="border-b border-[#EAEAEA] pb-3">
        <h1 className="text-base font-bold text-[#121212]">Account & Profile (Me)</h1>
        <p className="text-[11px] text-[#8A8A8A]">KYC Status & Security Settings</p>
      </header>

      {loading ? (
        <div className="space-y-3">
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-40 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : (
        <>
          {/* User Hero Avatar Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#FF4D1A] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-sm">
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-bold text-[#121212]">{profile?.full_name || "Driver Account"}</h2>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  {profile?.role || "R-01 Driver"} • KYC {profile?.kyc_status || "PENDING"}
                </span>
              </div>
            </div>
          </div>

          {/* Locked KYC Profile Information Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
              <h3 className="text-xs font-bold text-[#121212] flex items-center gap-1">
                Profile Details
              </h3>
              {isVerified && (
                <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3 text-amber-600" /> Locked Post-Verification
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs text-[#121212]">
              <div className="flex items-center justify-between p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
                <span className="text-[#8A8A8A] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#121212]" /> Phone Number
                </span>
                <span className="font-mono font-bold flex items-center gap-1">
                  {profile?.phone || "Not set"}
                  {isVerified && <Lock className="w-3 h-3 text-[#8A8A8A]" />}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
                <span className="text-[#8A8A8A] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#121212]" /> Email Address
                </span>
                <span className="font-mono font-bold flex items-center gap-1">
                  {email || "Not set"}
                  {isVerified && <Lock className="w-3 h-3 text-[#8A8A8A]" />}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA]">
                <span className="text-[#8A8A8A] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF4D1A]" /> Primary Address
                </span>
                <span className="font-bold flex items-center gap-1">
                  {profile?.formatted_address || "Not set"}
                  {isVerified && <Lock className="w-3 h-3 text-[#8A8A8A]" />}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/me/request-change")}
              className="w-full h-11 bg-white border border-[#EAEAEA] hover:border-[#FF4D1A] text-[#FF4D1A] text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Request Profile Field Change</span>
            </button>
          </div>

          {/* Account Settings List */}
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
            <p className="text-xs font-bold text-[#121212]">Security & Preferences</p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#8A8A8A]">App Display Theme</label>
              <ThemeToggle />
            </div>

            <button
              onClick={() => router.push("/me/security/reset-pin")}
              className="w-full p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between text-xs font-bold text-[#121212] hover:border-[#FF4D1A] transition"
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#FF4D1A]" /> Reset Transaction PIN
              </span>
              <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
            </button>

            <button
              onClick={() => router.push("/support")}
              className="w-full p-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] flex items-center justify-between text-xs font-bold text-[#121212] hover:border-[#FF4D1A] transition"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#8A8A8A]" /> Support & Live Chat
              </span>
              <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
            </button>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="w-full h-12 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Account</span>
          </button>
        </>
      )}

      <BottomNav />
    </main>
  );
}
