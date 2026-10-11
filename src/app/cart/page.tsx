"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShieldCheck } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export default function CartPage() {
  const [quantity, setQuantity] = useState<number>(1);
  const unitPrice = 18500;
  const subtotal = unitPrice * quantity;

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-24 font-sans space-y-6">
      <header className="border-b border-[#EAEAEA] pb-4">
        <h1 className="text-2xl font-bold text-[#121212]">Shopping Cart</h1>
        <p className="text-xs text-[#8A8A8A]">Review selected spare parts & installation option</p>
      </header>

      {/* Cart Item Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono text-[#8A8A8A]">OEM-04465-02220</span>
            <h3 className="font-bold text-sm text-[#121212]">Front Brake Pads (Ceramic Set)</h3>
            <p className="text-xs text-[#8A8A8A]">Seller: Ladipo Auto Spares Merchant 12</p>
          </div>
          <div className="text-right">
            <div className="text-base font-extrabold text-[#121212]">₦{unitPrice.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EAEAEA]">
          <span className="text-xs font-bold text-[#121212]">Order Quantity</span>
          <div className="flex items-center gap-3 bg-[#FFFBF5] border border-[#EAEAEA] rounded-xl px-3 py-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-[#121212] hover:text-[#FF4D1A] font-bold"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold font-mono text-[#121212]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="text-[#121212] hover:text-[#FF4D1A] font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-3 shadow-sm text-xs">
        <div className="flex justify-between text-[#8A8A8A]">
          <span>Parts Subtotal</span>
          <span className="font-mono text-[#121212]">₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[#8A8A8A]">
          <span>Escrow Protection Fee (5%)</span>
          <span className="font-mono text-[#121212]">₦{Math.round(subtotal * 0.05).toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-extrabold text-base text-[#121212] border-t border-[#EAEAEA] pt-2">
          <span>Total Payable</span>
          <span>₦{(subtotal + Math.round(subtotal * 0.05)).toLocaleString()} NGN</span>
        </div>
      </div>

      {/* Sticky Bottom Checkout CTA */}
      <div className="sticky bottom-16 pt-2">
        <Link
          href="/checkout/escrow"
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <ShieldCheck className="w-4 h-4" /> Proceed to Escrow Checkout
        </Link>
      </div>

      <BottomNav />
    </main>
  );
}
