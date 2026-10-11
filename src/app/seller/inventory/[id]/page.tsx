"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Power, ShieldCheck } from "lucide-react";

export default function EditPartPage() {
  const params = useParams();
  const partId = params?.id as string;
  const router = useRouter();

  const [title, setTitle] = useState("Toyota Corolla Ceramic Front Brake Pads");
  const [partNumber, setPartNumber] = useState("OEM-04465-02220");
  const [price, setPrice] = useState<number>(18500);
  const [stockQuantity, setStockQuantity] = useState<number>(15);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      router.push("/seller/inventory");
    }, 800);
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-24 font-sans space-y-4">
      <header className="flex items-center gap-3 border-b border-[#EAEAEA] pb-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-[#EAEAEA] text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#121212]">Edit Inventory Item</h1>
          <p className="text-[11px] text-[#8A8A8A]">Listing ID: {partId?.substring(0, 8)}</p>
        </div>
      </header>

      {/* Active/Inactive Switch Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#121212]">Listing Visibility Status</p>
          <p className="text-[11px] text-[#8A8A8A]">
            {isActive ? "Active on Marketplace Catalog" : "Hidden / Inactive"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`px-3.5 py-2 rounded-[12px] text-xs font-bold flex items-center gap-1.5 transition-colors ${
            isActive ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-700"
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isActive ? "ACTIVE" : "HIDDEN"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">Part Name Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">OEM / Part Number</label>
          <input
            type="text"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value.toUpperCase())}
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">Price (₦ NGN)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">Available Stock</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Part Listing Changes"}</span>
        </button>
      </form>
    </main>
  );
}
