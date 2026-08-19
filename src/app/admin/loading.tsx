'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] font-sans space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-2 border-b border-[#ECECEC]">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56 rounded-[8px]" />
          <Skeleton className="h-4 w-80 rounded-[6px]" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-[8px]" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Top Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-[12px] border border-[#ECECEC] space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24 rounded-[4px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-7 w-20 rounded-[6px]" />
            <Skeleton className="h-3 w-32 rounded-[4px]" />
          </div>
        ))}
      </div>

      {/* Main Table / Charts Skeleton */}
      <div className="p-6 rounded-[12px] border border-[#ECECEC] bg-white space-y-4">
        <div className="flex justify-between items-center pb-2">
          <Skeleton className="h-5 w-44 rounded-[6px]" />
          <Skeleton className="h-8 w-28 rounded-[6px]" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded-[4px]" />
                  <Skeleton className="h-3 w-24 rounded-[4px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-20 rounded-[4px]" />
              <Skeleton className="h-4 w-16 rounded-[4px]" />
              <Skeleton className="h-7 w-24 rounded-[6px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
