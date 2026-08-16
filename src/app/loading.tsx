import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] flex items-center justify-center font-sans">
      <p className="text-xs font-semibold text-[#737373] tracking-wide animate-pulse">
        Memuat...
      </p>
    </div>
  );
}
