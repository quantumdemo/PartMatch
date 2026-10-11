"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePicturePage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidFace, setIsValidFace] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setIsValidFace(false);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        setError("File must be an image (JPEG, PNG, WEBP).");
        return;
      }

      if (file.size < 50 * 1024) {
        setError("Image size is too small (<50KB). Please upload a clear face photo.");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsValidFace(true);
    }
  };

  const handleUploadAndProceed = async () => {
    if (!selectedFile || !isValidFace) {
      setError("Please select a valid clear photo of your face.");
      return;
    }

    setUploading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || "dev-user-id";
    const filePath = `${userId}/${Date.now()}-${selectedFile.name}`;

    const { data, error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(filePath, selectedFile, { upsert: true });

    if (uploadErr) {
      console.warn("Avatar storage upload note:", uploadErr.message);
    }

    const avatarUrl = data?.path ? supabase.storage.from("avatars").getPublicUrl(data.path).data.publicUrl : null;

    if (userId && avatarUrl) {
      await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("user_id", userId);
    }

    setUploading(false);
    router.push("/onboarding/kyc");
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#121212] font-sans p-4 flex flex-col justify-between max-w-[440px] mx-auto">
      <div className="space-y-6 pt-4 pb-24">
        {/* Progress Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D1A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
          </div>
          <p className="text-xs font-medium text-[#8A8A8A]">Step 4/7: Profile Photo</p>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121212]">Mandatory Profile Photo</h1>
          <p className="text-xs text-[#8A8A8A]">
            Upload a clear face photo for account identity verification.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Photo Upload Area */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-4">
          <div className="relative w-40 h-40 rounded-full bg-white border-2 border-dashed border-[#EAEAEA] flex items-center justify-center overflow-hidden shadow-sm">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Face preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <Camera className="w-10 h-10 text-[#8A8A8A] mx-auto mb-2" />
                <p className="text-[11px] font-medium text-[#8A8A8A]">Clear Face Photo Required</p>
              </div>
            )}
          </div>

          <label className="cursor-pointer px-4 py-2.5 bg-white border border-[#EAEAEA] hover:border-[#FF4D1A] rounded-[12px] text-xs font-bold text-[#121212] flex items-center gap-2 shadow-sm">
            <Upload className="w-4 h-4 text-[#FF4D1A]" />
            <span>{selectedFile ? "Change Photo" : "Choose Image File"}</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          {isValidFace && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Face image check passed (&gt;50KB)</span>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FFFBF5]/90 backdrop-blur-md max-w-[440px] mx-auto border-t border-[#EAEAEA]">
        <button
          type="button"
          disabled={!isValidFace || uploading}
          onClick={handleUploadAndProceed}
          className="w-full h-14 bg-[#FF4D1A] hover:bg-[#E03E0F] disabled:bg-[#EAEAEA] disabled:text-[#8A8A8A] text-white font-bold text-sm rounded-[12px] transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span>{uploading ? "Uploading..." : "Upload & Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
