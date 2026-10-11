"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Scan, AlertCircle } from "lucide-react";
import { InventoryService } from "@/lib/services/inventoryService";
import { InfoTooltip } from "@/components/InfoTooltip";

export default function AddPartPage() {
  const router = useRouter();
  const sellerId = "seller-001";

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("Toyota OEM");
  const [partNumber, setPartNumber] = useState("");
  const [price, setPrice] = useState<number>(18500);
  const [stockQuantity, setStockQuantity] = useState<number>(5);
  const [condition, setCondition] = useState("NEW GENUINE OEM");

  const [aiScanning, setAiScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAiAutoFill = async () => {
    try {
      setAiScanning(true);
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: title || "Brake Pad" }),
      });
      const result = await res.json();
      setAiScanning(false);

      if (result?.part_name) {
        setTitle(result.part_name);
        setPartNumber(result.oem_guess || "OEM-REF");
        setPrice(result.price_range_ngn || 18500);
      }
    } catch {
      setAiScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !partNumber || !price) {
      setError("Part name, OEM number, and price are mandatory.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await InventoryService.addPart(sellerId, {
        title,
        brand,
        part_number: partNumber,
        price: Number(price),
        condition,
        stock_quantity: Number(stockQuantity),
        is_active: true,
      });

      router.push("/seller/inventory");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save part.";
      setError(msg);
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-base font-bold text-[#121212]">List New Spare Part</h1>
          <p className="text-[11px] text-[#8A8A8A]">AI Auto-Fill OEM Specification Support</p>
        </div>
      </header>

      {/* AI Scanner Prompt Banner */}
      <div
        onClick={handleAiAutoFill}
        className="p-3.5 bg-[#121212] text-white rounded-[16px] flex items-center justify-between cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <Scan className="w-5 h-5 text-[#FF4D1A]" />
          <div>
            <p className="text-xs font-bold">Auto-Fill specs using AI API</p>
            <p className="text-[10px] text-[#8A8A8A]">Auto-detect OEM part number & catalog specs</p>
          </div>
        </div>
        <span className="text-[10px] bg-[#FF4D1A] text-white font-bold px-2 py-0.5 rounded">
          {aiScanning ? "Scanning..." : "Auto Fill"}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[12px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Part Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212] flex items-center">
            Part Name <InfoTooltip id="nin" />
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Toyota Corolla Front Ceramic Brake Pads"
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">OEM / Manufacturer Part Number</label>
          <input
            type="text"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value.toUpperCase())}
            placeholder="e.g. OEM-04465-02220"
            required
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">Selling Price (₦ NGN)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">In Stock Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">Part Condition Grade</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
          >
            <option value="NEW GENUINE OEM">NEW GENUINE OEM</option>
            <option value="AFTERMARKET HIGH GRADE">AFTERMARKET HIGH GRADE</option>
            <option value="REFURBISHED">REFURBISHED</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>{saving ? "Publishing Listing..." : "Publish Part Listing"}</span>
        </button>
      </form>
    </main>
  );
}
