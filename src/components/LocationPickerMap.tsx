"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation } from "lucide-react";

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onLocationSelect: (location: { latitude: number; longitude: number; formattedAddress: string }) => void;
}

export function LocationPickerMap({
  initialLat = 6.5244, // Default Lagos latitude
  initialLng = 3.3792, // Default Lagos longitude
  initialAddress = "",
  onLocationSelect,
}: LocationPickerMapProps) {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [address, setAddress] = useState<string>(initialAddress || "Lagos, Nigeria");
  const [locating, setLocating] = useState<boolean>(false);

  const callbackRef = useRef(onLocationSelect);
  useEffect(() => {
    callbackRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Trigger initial selection propagation
  useEffect(() => {
    callbackRef.current({
      latitude: lat,
      longitude: lng,
      formattedAddress: address,
    });
  }, [lat, lng, address]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const formattedAddress = `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Lagos`;

        setLat(latitude);
        setLng(longitude);
        setAddress(formattedAddress);
        setLocating(false);

        callbackRef.current({ latitude, longitude, formattedAddress });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to acquire GPS coordinates. Please type your location manually.");
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-[#0F172A]">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#FF4D1A]" /> Business / Workshop Location Map Pin
        </span>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locating}
          className="text-[#FF4D1A] hover:underline flex items-center gap-1 font-bold"
        >
          <Navigation className="w-3.5 h-3.5" />
          {locating ? "Locating..." : "Use Current GPS"}
        </button>
      </div>

      {/* Location Input Field */}
      <div>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            callbackRef.current({ latitude: lat, longitude: lng, formattedAddress: e.target.value });
          }}
          placeholder="Enter detailed shop/workshop address e.g. 14 Ladipo Auto Market, Mushin, Lagos"
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
        />
      </div>

      {/* Simulated Map Visualizer Box */}
      <div className="relative w-full h-32 bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300 text-slate-500 text-xs">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/3.3792,6.5244,12/400x150?access_token=pk.dummy')" }} />
        <div className="relative z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 font-mono text-[11px] text-[#0F172A]">
          <MapPin className="w-3.5 h-3.5 text-[#FF4D1A]" />
          Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
}
