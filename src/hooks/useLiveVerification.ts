import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface LiveVerificationState {
  isStreaming: boolean;
  isBlinkingDetected: boolean;
  capturedImageBase64: string | null;
  uploading: boolean;
  error: string | null;
}

export function useLiveVerification(userId?: string) {
  const [state, setState] = useState<LiveVerificationState>({
    isStreaming: false,
    isBlinkingDetected: false,
    capturedImageBase64: null,
    uploading: false,
    error: null,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Starts user media camera video stream
   */
  const startCamera = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isStreaming: true, error: null }));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to access camera.";
      setState((prev) => ({ ...prev, isStreaming: false, error: msg }));
    }
  }, []);

  /**
   * Stops video stream and releases camera track
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  /**
   * Simulates/Triggers blink detection verification flag
   */
  const markBlinkDetected = useCallback(() => {
    setState((prev) => ({ ...prev, isBlinkingDetected: true }));
  }, []);

  /**
   * Captures frame from active video stream into base64 canvas image
   */
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    setState((prev) => ({ ...prev, capturedImageBase64: dataUrl }));
    stopCamera();
    return dataUrl;
  }, [stopCamera]);

  /**
   * Uploads captured selfie to live-verification bucket & updates profiles table
   */
  const uploadAndVerify = useCallback(async (): Promise<string | null> => {
    if (!userId) {
      setState((prev) => ({ ...prev, error: "User ID missing for profile verification." }));
      return null;
    }

    if (!state.capturedImageBase64) {
      setState((prev) => ({ ...prev, error: "No live selfie captured." }));
      return null;
    }

    try {
      setState((prev) => ({ ...prev, uploading: true, error: null }));
      const supabase = createClient();

      // Convert Base64 dataUrl to Blob
      const res = await fetch(state.capturedImageBase64);
      const blob = await res.blob();
      const fileName = `${userId}/live_verify_${Date.now()}.jpg`;

      // Upload to live-verification storage bucket
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("live-verification")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadErr) throw uploadErr;

      // Get public URL
      const { data: publicUrlObj } = supabase.storage
        .from("live-verification")
        .getPublicUrl(uploadData.path);

      const avatarUrl = publicUrlObj.publicUrl;

      // Update profiles table with avatar_url & set live_verified = true
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
          live_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (profileErr) throw profileErr;

      setState((prev) => ({ ...prev, uploading: false }));
      return avatarUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload live verification photo.";
      setState((prev) => ({ ...prev, uploading: false, error: msg }));
      return null;
    }
  }, [userId, state.capturedImageBase64]);

  return {
    videoRef,
    isStreaming: state.isStreaming,
    isBlinkingDetected: state.isBlinkingDetected,
    capturedImageBase64: state.capturedImageBase64,
    uploading: state.uploading,
    error: state.error,
    startCamera,
    stopCamera,
    markBlinkDetected,
    captureFrame,
    uploadAndVerify,
  };
}
