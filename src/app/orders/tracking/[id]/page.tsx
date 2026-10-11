"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Truck, Phone, Navigation, ShieldCheck } from "lucide-react";
import { TrackingService, TrackingLocation } from "@/lib/services/trackingService";
import { LocationPickerMap } from "@/components/LocationPickerMap";

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();

  const [tracking, setTracking] = useState<TrackingLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      TrackingService.getOrderTracking(orderId).then((data) => {
        setTracking(data);
        setLoading(false);
      });
    }
  }, [orderId]);

  if (loading) {
    return (
      <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen py-10 text-center font-sans">
        <p className="text-xs text-[#8A8A8A]">Connecting to delivery GPS tracking...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-20 font-sans space-y-4">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Live Delivery Tracking</h1>
          <p className="text-[11px] text-[#8A8A8A]">Real-time Courier Map</p>
        </div>
      </header>

      {/* Map View */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] overflow-hidden shadow-sm space-y-2 p-2">
        <LocationPickerMap
          initialLat={tracking?.latitude || 6.5244}
          initialLng={tracking?.longitude || 3.3792}
          onLocationSelect={() => {}}
        />
      </div>

      {/* Courier Status Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#FF4D1A]" />
            <span className="text-xs font-bold text-[#121212]">
              {tracking?.courier_name || "PartMatch Express Courier"}
            </span>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
            {tracking?.status || "IN_TRANSIT"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8A8A8A]">Current Courier Location</p>
            <p className="text-xs font-bold text-[#121212] flex items-center gap-1 mt-0.5">
              <Navigation className="w-3 h-3 text-[#FF4D1A]" />
              <span>{tracking?.address || "Lagos Metro Transit"}</span>
            </p>
          </div>

          <a
            href={`tel:${tracking?.courier_phone}`}
            className="p-2.5 bg-[#FFFBF5] border border-[#EAEAEA] text-[#121212] rounded-[12px] flex items-center gap-1.5 text-xs font-bold"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call Courier</span>
          </a>
        </div>
      </div>

      {/* Escrow Guarantee Reminder */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-[16px] flex items-center gap-2 text-xs text-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
        <span>Inspect part thoroughly with courier before confirming delivery.</span>
      </div>
    </main>
  );
}
