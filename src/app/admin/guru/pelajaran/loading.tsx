import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PelajaranLoading() {
  return (
    <div className="space-y-8 font-sans text-[#2E2D2D] bg-white animate-pulse">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-[6px]" />
          <Skeleton className="h-4 w-80 rounded-[4px]" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-[8px]" />
          <Skeleton className="h-10 w-36 rounded-[8px]" />
        </div>
      </div>

      {/* 4 Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded-[4px]" />
              <Skeleton className="w-4 h-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 rounded-[6px]" />
            <Skeleton className="h-3 w-32 rounded-[4px]" />
          </div>
        ))}
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-5 w-40 rounded-[4px]" />
            <Skeleton className="h-4 w-20 rounded-[4px]" />
          </div>
          <Skeleton className="w-full h-44 rounded-[10px]" />
        </div>

        <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-5 w-40 rounded-[4px]" />
            <Skeleton className="h-4 w-20 rounded-[4px]" />
          </div>
          <Skeleton className="w-full h-44 rounded-[10px]" />
        </div>
      </div>

      {/* Module Content & Readers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-4 shadow-2xs">
          <Skeleton className="h-5 w-48 rounded-[4px]" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-[10px] bg-slate-50 flex items-center justify-between">
                <Skeleton className="h-4 w-3/4 rounded-[4px]" />
                <Skeleton className="h-6 w-16 rounded-[4px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-4 shadow-2xs">
          <Skeleton className="h-5 w-36 rounded-[4px]" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-2.5 flex items-center justify-between border-b border-slate-100">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 rounded-[4px]" />
                  <Skeleton className="h-3 w-16 rounded-[4px]" />
                </div>
                <Skeleton className="h-5 w-16 rounded-[4px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
