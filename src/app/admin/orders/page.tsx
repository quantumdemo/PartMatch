"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { OrderService, OrderRecord } from "@/lib/services/orderService";
import { formatWAT } from "@/lib/timezone";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.getUserOrders("123e4567-e89b-12d3-a456-426614174000").then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#121212]">Global Escrow Orders Audit</h1>
        <p className="text-xs text-[#8A8A8A]">Audit Part Purchases, Waybills & Automatic 72h Release Timers</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-16 bg-neutral-200 rounded-[12px] animate-pulse" />
          <div className="h-16 bg-neutral-200 rounded-[12px] animate-pulse" />
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center bg-white border border-[#EAEAEA] rounded-[16px] text-xs text-[#8A8A8A]">
          No escrow orders found in system database.
        </div>
      ) : (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#121212]">
              <thead className="bg-[#FFFBF5] border-b border-[#EAEAEA] font-bold text-[#8A8A8A]">
                <tr>
                  <th className="p-3.5">PM-REF</th>
                  <th className="p-3.5">Part Title</th>
                  <th className="p-3.5">Escrow Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Created WAT Date</th>
                  <th className="p-3.5">Release WAT Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FFFBF5]">
                    <td className="p-3.5 font-mono text-[11px] font-bold">{o.order_ref}</td>
                    <td className="p-3.5 font-bold">{o.part_title}</td>
                    <td className="p-3.5 font-extrabold text-[#FF4D1A]">
                      ₦{o.amount.toLocaleString("en-NG")} NGN
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[11px] text-[#8A8A8A]">{formatWAT(o.created_at)}</td>
                    <td className="p-3.5 text-[11px] text-[#8A8A8A]">{formatWAT(o.escrow_release_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
