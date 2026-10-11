"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Scan, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AddPartPage() {
  const router = useRouter();
  const supabase = createClient();

  const [partName, setPartName] = useState("");
  const [category, setCategory] = useState("Brakes & Suspension");
  const [oemNumber, setOemNumber] = useState("");
  const [price, setPrice] = useState<number>(18500);
  const [stockQuantity, setStockQuantity] = useState<number>(5);
  const [condition, setCondition] = useState("GENUINE_OEM");
  const [compatibilityJson, setCompatibilityJson] = useState('{"makes":["Toyota"],"models":["Corolla"],"years":[2012,2013,2014]}');

  const [aiScanning, setAiScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAiAutoFill = async () => {
    try {
      setAiScanning(true);
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: partName || "Brake Pad" }),
      });
      const result = await res.json();
      setAiScanning(false);

      if (result?.part_name) {
        setPartName(result.part_name);
        setCategory(result.category || "Engine Components");
        setOemNumber(result.oem_guess || "OEM-REF");
        setPrice(result.price_range_ngn || 18500);
      }
    } catch {
      setAiScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!partName.trim() || !price) {
      setError("Part name and price are required.");
      return;
    }

    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      setError("Please log in as a seller.");
      setSaving(false);
      return;
    }

    // Query seller store name
    const { data: profile } = await supabase
      .from("profiles")
      .select("store_name, formatted_address")
      .eq("user_id", userId)
      .maybeSingle();

    const { error: insertErr } = await supabase.from("inventory").insert({
      seller_id: userId,
      seller_store_name: profile?.store_name || "Ladipo Merchant",
      seller_location: profile?.formatted_address || "Lagos, Nigeria",
      part_name: partName.trim(),
      category,
      oem_number: oemNumber.trim() || null,
      price_ngn: Number(price),
      stock_quantity: Number(stockQuantity),
      condition,
      compatibility: compatibilityJson,
      status: "PENDING_REVIEW",
      created_at: new Date().toISOString(),
    });

    setSaving(false);

    if (insertErr) {
      setError(insertErr.message);
    } else {
      setSuccessMsg("Part saved with status PENDING_REVIEW. It will appear on the marketplace once approved by Admin.");
      setTimeout(() => router.push("/seller/inventory"), 1500);
    }
  };

  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-4 pb-28 font-sans space-y-4">
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

      {/* AI Scanner Banner */}
      <div
        onClick={handleAiAutoFill}
        className="p-3.5 bg-[#FF4D1A] text-white rounded-[16px] flex items-center justify-between cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <Scan className="w-5 h-5 text-white" />
          <div>
            <p className="text-xs font-bold text-white">Auto-Fill specs using AI API</p>
            <p className="text-[10px] text-white/80">Auto-detect OEM part number & catalog specs</p>
          </div>
        </div>
        <span className="text-[10px] bg-white text-[#FF4D1A] font-bold px-2 py-0.5 rounded">
          {aiScanning ? "Scanning..." : "Auto Fill"}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[12px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[12px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-[16px] p-5 space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">Part Name *</label>
          <input
            type="text"
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
            placeholder="e.g. Toyota Corolla Front Ceramic Brake Pads"
            required
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          >
            <option value="Brakes & Suspension">Brakes & Suspension</option>
            <option value="Engine Components">Engine Components</option>
            <option value="Electrical & Lighting">Electrical & Lighting</option>
            <option value="Transmission & Gear">Transmission & Gear</option>
            <option value="Body & Exterior">Body & Exterior</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">OEM / Part Number</label>
          <input
            type="text"
            value={oemNumber}
            onChange={(e) => setOemNumber(e.target.value.toUpperCase())}
            placeholder="e.g. OEM-04465-02220"
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs font-mono text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">Price (₦ NGN) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#121212]">In Stock Quantity *</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              required
              className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          >
            <option value="GENUINE_OEM">Genuine OEM</option>
            <option value="AFTERMARKET_HIGH_GRADE">Aftermarket High Grade</option>
            <option value="USED">Used / Tokunbo</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#121212]">Compatible Vehicles (JSON)</label>
          <input
            type="text"
            value={compatibilityJson}
            onChange={(e) => setCompatibilityJson(e.target.value)}
            className="w-full h-11 px-3.5 bg-[#FFFBF5] border border-[#EAEAEA] rounded-[12px] text-xs font-mono text-[#121212] focus:outline-none focus:border-[#FF4D1A]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] text-white text-xs font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>{saving ? "Submitting for Review..." : "Submit Listing for Admin Approval"}</span>
        </button>
      </form>
    </main>
  );
}
