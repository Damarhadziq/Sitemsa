'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] flex flex-col font-sans">
      {/* Top Navbar Skeleton */}
      <div className="h-16 bg-white border-b border-[#ECECEC] px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
        <Skeleton className="h-7 w-32 rounded-[8px]" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-48 rounded-[8px] hidden md:block" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-12 w-full flex-1 space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 bg-slate-50 border border-[#ECECEC] rounded-[16px]">
          <div className="space-y-3 w-full md:w-1/2">
            <Skeleton className="h-5 w-28 rounded-[4px]" />
            <Skeleton className="h-8 w-full max-w-sm rounded-[8px]" />
            <Skeleton className="h-4 w-3/4 rounded-[6px]" />
          </div>
          <Skeleton className="w-full md:w-[320px] h-[140px] rounded-[12px]" />
        </div>

        {/* Feature Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-44 w-full rounded-[12px]" />
          <Skeleton className="h-44 w-full rounded-[12px]" />
          <Skeleton className="h-44 w-full rounded-[12px]" />
        </div>

        {/* Content List Skeleton */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-44 rounded-[6px]" />
            <Skeleton className="h-5 w-24 rounded-[6px]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-5 bg-white border border-[#ECECEC] rounded-[12px] space-y-3">
                <Skeleton className="h-4 w-20 rounded-[4px]" />
                <Skeleton className="h-5 w-full rounded-[6px]" />
                <Skeleton className="h-3 w-4/5 rounded-[4px]" />
                <Skeleton className="h-3 w-2/3 rounded-[4px]" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
