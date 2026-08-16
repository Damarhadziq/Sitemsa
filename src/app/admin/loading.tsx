'use client';

import React from 'react';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white font-bold text-lg flex items-center justify-center animate-pulse">
          S
        </div>
        <span className="text-xs font-semibold text-[#737373]">Memuat Portal Admin Sitemsa...</span>
      </div>
    </div>
  );
}
