"use client";

import React, { useState } from "react";
import { Info, X } from "lucide-react";
import { TOOLTIP_DICTIONARY } from "@/lib/tooltipDictionary";

interface InfoTooltipProps {
  id: string;
}

export function InfoTooltip({ id }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipData = TOOLTIP_DICTIONARY[id];

  if (!tooltipData) return null;

  return (
    <span className="relative inline-flex items-center ml-1 z-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label={`Information about ${tooltipData.title}`}
        className="text-[#64748B] hover:text-[#FF4D1A] transition focus:outline-none p-0.5 rounded-full"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-[#0F172A] text-white text-xs rounded-xl shadow-xl z-50 pointer-events-auto border border-slate-700 space-y-1">
          <div className="flex items-center justify-between font-bold text-amber-400 border-b border-slate-700 pb-1">
            <span>{tooltipData.title}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-slate-200 text-[11px] leading-relaxed">
            {tooltipData.explanation}
          </p>
          <div className="text-[10px] text-amber-300 font-mono bg-slate-800/80 p-1.5 rounded border border-slate-700/50 mt-1">
            {tooltipData.example}
          </div>
        </div>
      )}
    </span>
  );
}
