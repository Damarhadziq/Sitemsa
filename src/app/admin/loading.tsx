'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] font-sans space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-2">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56 rounded-[8px]" />
          <Skeleton className="h-4 w-80 rounded-[6px]" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-[8px]" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Top 2x2 Stat Cards + Right AI Card Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-[12px] space-y-4 bg-slate-100/70 min-h-[150px] flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-24 rounded-[4px]" />
                <Skeleton className="h-5 w-12 rounded-[4px]" />
              </div>
              <div className="flex items-baseline justify-between">
                <Skeleton className="h-8 w-16 rounded-[6px]" />
                <Skeleton className="w-9 h-9 rounded-[8px]" />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-5 bg-slate-100/70 rounded-[12px] p-6 space-y-4 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-[4px]" />
            <Skeleton className="h-3.5 w-full rounded-[4px]" />
            <Skeleton className="h-3.5 w-4/5 rounded-[4px]" />
          </div>
          <Skeleton className="h-10 w-full rounded-[8px]" />
        </div>
      </div>

      {/* Main Table Skeleton (Borderless) */}
      <div className="p-6 rounded-[12px] bg-slate-100/60 space-y-4">
        <div className="flex justify-between items-center pb-2">
          <Skeleton className="h-5 w-44 rounded-[6px]" />
          <Skeleton className="h-8 w-28 rounded-[6px]" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded-[4px]" />
                  <Skeleton className="h-3 w-24 rounded-[4px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded-[4px]" />
              <Skeleton className="h-4 w-16 rounded-[4px]" />
              <Skeleton className="h-7 w-20 rounded-[6px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
