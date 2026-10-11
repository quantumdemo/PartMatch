"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, CheckCircle2 } from "lucide-react";
import { OrderService, OrderRecord } from "@/lib/services/orderService";
import { formatWAT } from "@/lib/timezone";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function SellerOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("GIG Logistics");
  const [shipping, setShipping] = useState(false);
  const [shipped, setShipped] = useState(false);

  useEffect(() => {
    if (orderId) {
      OrderService.getOrderById(orderId).then((data) => {
        setOrder(data);
        if (data?.status === "SHIPPED" || data?.status === "DELIVERED") {
          setShipped(true);
        }
      });
    }
  }, [orderId]);

  const handleConfirmShipment = (e: React.FormEvent) => {
    e.preventDefault();
    setShipping(true);
    setTimeout(() => {
      setShipping(false);
      setShipped(true);
    }, 1000);
  };

  if (!order) return null;

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-20 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">{order.order_ref}</h1>
          <p className="text-[11px] text-[#8A8A8A]">Purchased: {formatWAT(order.created_at)}</p>
        </div>
      </header>

      {/* Escrow Status Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[16px] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs text-emerald-900">
            <p className="font-bold">Funds Locked in Escrow</p>
            <p className="text-[10px] text-emerald-700">Dispatch item to trigger release timer</p>
          </div>
        </div>
        <span className="text-sm font-extrabold text-[#FF4D1A]">
          ₦{(order.amount * 0.85).toLocaleString("en-NG")}
        </span>
      </div>

      {/* Part Details */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-2 shadow-sm">
        <p className="text-xs font-bold text-[#121212]">Ordered Spare Part</p>
        <div className="p-3 bg-[#FFFBF5] rounded-[12px] border border-[#EAEAEA] space-y-1 text-xs text-[#121212]">
          <p className="font-bold">{order.part_title}</p>
          <p className="text-[11px] text-[#8A8A8A]">OEM Ref: {order.part_number}</p>
        </div>
      </div>

      {/* Dispatch Confirmation Form */}
      {shipped ? (
        <div className="bg-white border border-emerald-200 rounded-[16px] p-6 text-center space-y-3 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold text-[#121212]">Order Dispatched!</h2>
          <p className="text-xs text-[#8A8A8A]">
            Customer notified. 72-hour escrow payout countdown is active.
          </p>
          <button
            onClick={() => router.push("/seller/orders")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] shadow-sm"
          >
            Back to Orders List
          </button>
        </div>
      ) : (
        <form onSubmit={handleConfirmShipment} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-[#121212] flex items-center">
            Confirm Dispatch & Waybill <InfoTooltip id="kyc" />
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">Courier / Waybill Partner</label>
            <input
              type="text"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">Waybill / Tracking Reference</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              placeholder="e.g. GIG-LAG-88210"
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>

          <button
            type="submit"
            disabled={shipping}
            className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>{shipping ? "Confirming Waybill..." : "Confirm Shipment & Dispatch"}</span>
          </button>
        </form>
      )}
    </main>
  );
}
