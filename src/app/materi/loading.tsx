'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function MateriSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Navbar Skeleton Placeholder */}
      <div className="h-16 bg-white px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30 border-b border-[#ECECEC]/40">
        <Skeleton className="h-7 w-28 rounded-[8px]" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-48 rounded-[8px] hidden md:block" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-28 sm:pb-32 md:pb-16 w-full flex-1 space-y-8 animate-pulse">
        {/* Hero Section Skeleton */}
        <section className="mb-6 text-center max-w-3xl mx-auto space-y-3">
          <Skeleton className="h-9 w-64 md:w-96 mx-auto rounded-[8px]" />
          <Skeleton className="h-4 w-72 md:w-80 mx-auto rounded-[6px] hidden md:block" />

          {/* Search Bar Skeleton */}
          <div className="pt-4 max-w-lg mx-auto">
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </div>

          {/* Category Filter Pills Skeleton */}
          <div className="pt-4 flex items-center justify-center gap-2 overflow-x-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 w-20 md:w-24 rounded-full shrink-0" />
            ))}
          </div>
        </section>

        {/* AI Recommendations Box Skeleton */}
        <section className="bg-gradient-to-br from-[#FAFAFF] via-[#F4EFFF] to-[#EBE4FF] rounded-[14px] p-3 md:p-5 border border-[#E0D7FF] space-y-3">
          <Skeleton className="h-6 w-32 rounded-[6px]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 rounded-[10px] p-3 md:p-4 space-y-2 border border-[#E0D7FF]/60">
                <Skeleton className="h-4 w-20 rounded-[4px]" />
                <Skeleton className="h-5 w-3/4 rounded-[4px]" />
                <Skeleton className="h-3 w-full rounded-[4px]" />
              </div>
            ))}
          </div>
        </section>

        {/* Material Cards Grid Skeleton */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-44 rounded-[6px]" />
            <Skeleton className="h-4 w-28 rounded-[4px] hidden lg:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-slate-100/70 rounded-[10px] p-5 h-[160px] flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-24 h-4 rounded-[4px]" />
                    <Skeleton className="w-14 h-4 rounded-[4px]" />
                  </div>
                  <Skeleton className="w-3/4 h-5 rounded-[4px]" />
                  <div className="flex gap-1.5 pt-2">
                    <Skeleton className="w-16 h-4 rounded-[4px]" />
                    <Skeleton className="w-20 h-4 rounded-[4px]" />
                    <Skeleton className="w-14 h-4 rounded-[4px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Loading() {
  return <MateriSkeleton />;
}
