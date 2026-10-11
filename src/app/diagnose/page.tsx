"use client";

import React from "react";
import Link from "next/link";
import { Camera, Upload, Mic, FileText, ArrowRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const METHODS = [
  {
    id: "photo",
    title: "Take Photo of Part",
    description: "Point camera at the broken or replacement spare part",
    icon: Camera,
    href: "/diagnose/scanning",
  },
  {
    id: "upload",
    title: "Upload Part Image",
    description: "Select photo from gallery or mechanic diagnosis slip",
    icon: Upload,
    href: "/diagnose/scanning",
  },
  {
    id: "sound",
    title: "Record Engine Sound",
    description: "Capture knocking or squeaking audio for AI noise analysis",
    icon: Mic,
    href: "/diagnose/scanning",
  },
  {
    id: "symptom",
    title: "Describe Vehicle Problem",
    description: "Type symptoms e.g. 'hard brake pedal or overheating'",
    icon: FileText,
    href: "/diagnose/search",
  },
];

export default function DiagnoseMethodPage() {
  return (
    <main className="max-w-[440px] mx-auto px-4 bg-[#FFFBF5] min-h-screen pt-6 pb-24 font-sans space-y-6">
      <header className="border-b border-[#EAEAEA] pb-4">
        <h1 className="text-2xl font-bold text-[#121212]">AI Part Identification</h1>
        <p className="text-xs text-[#8A8A8A]">Select diagnostic method to identify required spare part</p>
      </header>

      <div className="space-y-3">
        {METHODS.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              href={m.href}
              className="p-4 bg-white border border-[#EAEAEA] rounded-[16px] flex items-center justify-between shadow-sm hover:border-[#FF4D1A] transition-colors active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFFBF5] border border-[#EAEAEA] text-[#FF4D1A] rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm text-[#121212]">{m.title}</h3>
                  <p className="text-xs text-[#8A8A8A] leading-tight">{m.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8A8A8A] shrink-0" />
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </main>
  );
}
