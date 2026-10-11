"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, Upload, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmDeliveryPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmInstallation = async () => {
    setError(null);
    setConfirming(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (evidenceFile && userId) {
        const filePath = `${userId}/${orderId}-${Date.now()}-${evidenceFile.name}`;
        await supabase.storage.from("job-evidence").upload(filePath, evidenceFile, { upsert: true });
      }

      // Update order status to RELEASED
      if (orderId) {
        await supabase.from("orders").update({ status: "RELEASED" }).eq("id", orderId);
        await supabase.from("escrow_transactions").update({ status: "RELEASED" }).eq("order_id", orderId);
      }

      setConfirming(false);
      setCompleted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Confirmation failed.";
      setError(msg);
      setConfirming(false);
    }
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
          <h1 className="text-base font-bold text-[#121212]">Confirm Installation & Fitment</h1>
          <p className="text-[11px] text-[#8A8A8A]">Order Ref: {orderId?.substring(0, 8)}</p>
        </div>
      </header>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {completed ? (
        <div className="bg-white border border-emerald-200 rounded-[16px] p-6 text-center space-y-3 shadow-sm my-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold text-[#121212]">Escrow Funds Released!</h2>
          <p className="text-xs text-[#8A8A8A]">
            Merchant and mechanic payouts have been credited atomically. Thank you for confirming!
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm"
          >
            Back to Orders
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-[#121212]">Upload Working Part Video Evidence</h2>
            <p className="text-[11px] text-[#8A8A8A]">
              Upload a short video showing the new part installed and tested working on your vehicle.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#FF4D1A]" /> Choose Working Part Video / Photo
            </label>
            <input
              type="file"
              accept="video/*,image/*"
              onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-[#121212] border border-[#EAEAEA] rounded-[12px] p-2 bg-[#FFFBF5]"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-start gap-2 text-[11px] text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              By confirming, you authorize PartMatch Escrow to permanently release funds to seller and mechanic.
            </span>
          </div>

          {/* Big Orange 48px Confirm Installation CTA */}
          <button
            onClick={handleConfirmInstallation}
            disabled={confirming}
            className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-base font-extrabold rounded-[48px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.97] transition-transform"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{confirming ? "Releasing Payouts..." : "Confirm Installation"}</span>
          </button>
        </div>
      )}
    </main>
  );
}
