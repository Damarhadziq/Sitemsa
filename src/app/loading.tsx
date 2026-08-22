'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] flex flex-col font-sans">
      {/* Top Navbar Skeleton (Borderless) */}
      <div className="h-16 bg-white px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
        <Skeleton className="h-7 w-32 rounded-[8px]" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-48 rounded-[8px] hidden md:block" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Main Content Area Skeleton (Borderless Elements) */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-12 w-full flex-1 space-y-10 animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-6">
          <div className="space-y-4 w-full md:w-1/2">
            <Skeleton className="h-5 w-32 rounded-[4px]" />
            <Skeleton className="h-10 w-full max-w-md rounded-[8px]" />
            <Skeleton className="h-4 w-5/6 rounded-[6px]" />
            <Skeleton className="h-4 w-2/3 rounded-[6px]" />
            <div className="pt-2 flex items-center gap-3">
              <Skeleton className="h-10 w-36 rounded-[8px]" />
              <Skeleton className="h-10 w-32 rounded-[8px]" />
            </div>
          </div>
          <Skeleton className="w-full md:w-[420px] h-[220px] rounded-[16px]" />
        </div>

        {/* Featured Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 rounded-[6px]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full rounded-[14px]" />
            <Skeleton className="h-48 w-full rounded-[14px]" />
            <Skeleton className="h-48 w-full rounded-[14px]" />
          </div>
        </div>

        {/* Content List Skeleton */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-44 rounded-[6px]" />
            <Skeleton className="h-5 w-24 rounded-[6px]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-5 bg-slate-100/70 rounded-[14px] space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded-[4px]" />
                  <Skeleton className="h-4 w-12 rounded-[4px]" />
                </div>
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
