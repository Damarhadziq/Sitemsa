'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamLoading() {
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

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-8 md:pb-20 w-full space-y-12 animate-pulse">
        {/* Header Section Skeleton */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <Skeleton className="h-6 w-32 mx-auto rounded-full" />
          <Skeleton className="h-10 w-72 md:w-96 mx-auto rounded-[8px]" />
          <Skeleton className="h-4 w-full max-w-md mx-auto rounded-[6px]" />
        </div>

        {/* 4x6 Team Grid Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="p-5 bg-white border border-[#ECECEC] rounded-[16px] space-y-4 shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <Skeleton className="w-14 h-14 rounded-full" />
                <Skeleton className="w-20 h-5 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-3/4 h-5 rounded-[4px]" />
                <Skeleton className="w-1/2 h-4 rounded-[4px]" />
              </div>
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <Skeleton className="w-24 h-3 rounded-[4px]" />
                <Skeleton className="w-4 h-4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
