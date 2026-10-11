"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, CheckCircle2, XCircle, ShieldCheck, MapPin, RefreshCw } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface MechanicJob {
  id: string;
  customer_id?: string;
  status: string;
  fee_amount: number;
  location?: string;
  created_at?: string;
}

export default function MechanicDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isOnline, setIsOnline] = useState(true);
  const [jobs, setJobs] = useState<MechanicJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMechanicJobs() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId && isOnline) {
        const { data } = await supabase
          .from("mechanic_jobs")
          .select("*")
          .eq("mechanic_id", userId)
          .order("created_at", { ascending: false });

        setJobs(data || []);
      } else {
        setJobs([]);
      }

      setLoading(false);
    }

    loadMechanicJobs();
  }, [isOnline]);

  const handleJobAction = async (jobId: string, newStatus: "ACCEPTED" | "REJECTED") => {
    await supabase.from("mechanic_jobs").update({ status: newStatus }).eq("id", jobId);
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)));

    if (newStatus === "ACCEPTED") {
      router.push(`/mechanic/job/active/${jobId}`);
    }
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
      {/* Top Bar with Online/Offline Toggle */}
      <header className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center font-bold text-sm">
            ME
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#121212]">Mobile Mechanic Jobs</h1>
            <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> R-04 Trade Certified
            </p>
          </div>
        </div>

        {/* Online/Offline Toggle Button */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 border ${
            isOnline
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-neutral-100 text-[#8A8A8A] border-[#EAEAEA]"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-600 animate-pulse" : "bg-[#8A8A8A]"}`} />
          <span>{isOnline ? "Online" : "Offline"}</span>
        </button>
      </header>

      {/* Map simulation banner */}
      <div className="w-full h-28 bg-[#121212] rounded-[16px] p-4 flex flex-col justify-between text-white shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#FF4D1A] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Service Area: 15km Radius
          </span>
          <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-mono px-2 py-0.5 rounded">
            GPS Active
          </span>
        </div>
        <p className="text-xs text-neutral-300">
          {isOnline ? "Listening for customer diagnostic & installation job requests..." : "You are currently offline."}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
          <div className="h-28 bg-neutral-200/80 rounded-[16px] animate-pulse" />
        </div>
      ) : !isOnline || jobs.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <Wrench className="w-12 h-12 text-[#8A8A8A] mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">
              {!isOnline ? "You are Offline" : "No jobs nearby - Go Online"}
            </h2>
            <p className="text-xs text-[#8A8A8A]">
              {!isOnline ? "Toggle Online switch above to accept installation jobs." : "Stay online to receive instant mobile mechanic requests."}
            </p>
          </div>
          {!isOnline && (
            <button
              onClick={() => setIsOnline(true)}
              className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Go Online Now</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
                <span className="text-xs font-bold text-[#121212]">Inspection & Installation Job</span>
                <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                  {job.status}
                </span>
              </div>

              {/* Price BIG 48px Hierarchy */}
              <div className="flex items-baseline justify-between">
                <p className="text-[36px] font-extrabold text-[#121212] leading-none tracking-tight">
                  ₦{Number(job.fee_amount || 5000).toLocaleString("en-NG")}
                </p>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  15% Escrow Allocation
                </span>
              </div>

              {job.status === "PENDING" && (
                <div className="flex gap-2 pt-2 border-t border-[#EAEAEA]">
                  <button
                    onClick={() => handleJobAction(job.id, "REJECTED")}
                    className="flex-1 h-11 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-[12px] flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleJobAction(job.id, "ACCEPTED")}
                    className="flex-1 h-11 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Job</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
