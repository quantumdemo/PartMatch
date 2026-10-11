"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Power,
  User,
  Wallet,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { MechanicService, MechanicJob, MechanicProfile } from "@/lib/services/mechanicService";

export default function MechanicJobsPage() {
  const router = useRouter();
  const mechanicId = "mechanic-001";

  const [profile, setProfile] = useState<MechanicProfile | null>(null);
  const [jobs, setJobs] = useState<MechanicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const prof = await MechanicService.getMechanicProfile(mechanicId);
      setProfile(prof);

      if (prof.is_online) {
        const availableJobs = await MechanicService.getAvailableJobs(mechanicId);
        setJobs(availableJobs);
      } else {
        setJobs([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load jobs.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [mechanicId]);

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
          <h1 className="text-base font-bold text-[#121212]">Nearby Inspection Jobs</h1>
          <p className="text-[11px] text-[#8A8A8A]">15% Escrow Fee Payout Opportunities</p>
        </div>
      </header>

      {/* Offline Alert State */}
      {profile && !profile.is_online && (
        <div className="p-4 bg-neutral-100 border border-neutral-300 rounded-[16px] text-center space-y-2">
          <Power className="w-8 h-8 text-neutral-500 mx-auto" />
          <p className="text-xs font-bold text-[#121212]">You are Currently Offline</p>
          <p className="text-[11px] text-[#8A8A8A]">
            Turn your status online on dashboard to scan for nearby fitment jobs.
          </p>
          <button
            onClick={() => router.push("/mechanic/dashboard")}
            className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm"
          >
            Go to Dashboard & Turn ON
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-32 bg-neutral-200 rounded-[16px] animate-pulse" />
          <div className="h-32 bg-neutral-200 rounded-[16px] animate-pulse" />
        </div>
      ) : error ? (
        /* Error State */
        <div className="p-6 bg-white border border-red-200 rounded-[16px] text-center space-y-3 shadow-sm my-6">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-xs font-bold text-red-700">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
          </button>
        </div>
      ) : profile?.is_online && jobs.length === 0 ? (
        /* Empty State UI (Illustration + CTA) */
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 bg-[#FFFBF5] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto text-[#FF4D1A]">
            <Wrench className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">No Jobs Near You</h2>
            <p className="text-xs text-[#8A8A8A] max-w-[280px] mx-auto">
              Scanning 5km radius around your workshop. New part installation requests will appear here in real-time.
            </p>
          </div>
        </div>
      ) : (
        /* Available Jobs List */
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/mechanic/jobs/${job.id}`)}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm cursor-pointer hover:border-[#FF4D1A] transition-colors"
            >
              <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
                <span className="text-[11px] font-mono font-bold text-[#121212]">
                  {job.order_ref}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Escrow Secured
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#121212]">{job.part_title}</p>
                  <p className="text-[11px] text-[#8A8A8A]">Target: {job.vehicle_info}</p>
                  <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-[#FF4D1A]" />
                    <span>{job.installation_address} ({job.distance_km} km away)</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-[#8A8A8A]">15% Fee Payout</p>
                  <p className="text-sm font-extrabold text-[#FF4D1A]">
                    ₦{job.payout_amount.toLocaleString("en-NG")}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] flex items-center justify-between text-xs text-[#121212] font-bold">
                <span>View Job Details & Accept</span>
                <ChevronRight className="w-4 h-4 text-[#FF4D1A]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mechanic Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto bg-white border-t border-[#EAEAEA] h-16 flex items-center justify-around z-50">
        <button
          onClick={() => router.push("/mechanic/jobs")}
          className="flex flex-col items-center gap-1 text-[#FF4D1A]"
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[10px] font-bold">Jobs</span>
        </button>

        <button
          onClick={() => router.push("/mechanic/wallet")}
          className="flex flex-col items-center gap-1 text-[#8A8A8A]"
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-bold">Wallet</span>
        </button>

        <button
          onClick={() => router.push("/mechanic/dashboard")}
          className="flex flex-col items-center gap-1 text-[#8A8A8A]"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Me</span>
        </button>
      </nav>
    </main>
  );
}
