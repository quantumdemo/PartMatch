"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, ShieldCheck, ChevronRight, Trash2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

interface CartItem {
  id: string;
  title: string;
  price: number;
  seller_name: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read cart items from local state or empty array
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("partmatch_cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    }
    setLoading(false);
  }, []);

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((i) => i.id !== id);
    setCartItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("partmatch_cart", JSON.stringify(updated));
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
          <h1 className="text-base font-bold text-[#121212]">My Shopping Cart</h1>
          <p className="text-[11px] text-[#8A8A8A]">72-Hour Escrow Protection Included</p>
        </div>
      </header>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-24 bg-neutral-200 rounded-[16px] animate-pulse" />
          <div className="h-24 bg-neutral-200 rounded-[16px] animate-pulse" />
        </div>
      ) : cartItems.length === 0 ? (
        /* Empty State UI from Prompt (Illustration + CTA) */
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-8 text-center space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 bg-[#FFFBF5] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto text-[#FF4D1A]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#121212]">Your Cart is Empty</h2>
            <p className="text-xs text-[#8A8A8A] max-w-[280px] mx-auto">
              Browse verified auto spare parts from genuine Nigerian merchants with 72-hour escrow guarantee.
            </p>
          </div>
          <button
            onClick={() => router.push("/diagnose/search")}
            className="w-full h-12 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
          >
            <span>Browse Auto Parts Marketplace</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Cart Items List */
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex items-center justify-between shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#121212]">{item.title}</p>
                <p className="text-[11px] text-[#8A8A8A]">Merchant: {item.seller_name}</p>
                <p className="text-sm font-extrabold text-[#FF4D1A]">
                  ₦{item.price.toLocaleString("en-NG")}
                </p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="p-2 text-neutral-400 hover:text-red-600 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Total & Proceed */}
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 space-y-3 shadow-sm mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#121212]">
              <span>Cart Subtotal</span>
              <span className="text-base font-extrabold text-[#FF4D1A]">
                ₦{totalAmount.toLocaleString("en-NG")}
              </span>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center gap-2 text-[11px] text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Funds locked safely in 72h PartMatch Escrow until delivery.</span>
            </div>

            <button
              onClick={() => router.push(`/checkout/escrow?part_id=${cartItems[0]?.id}`)}
              className="w-full h-12 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Escrow Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
