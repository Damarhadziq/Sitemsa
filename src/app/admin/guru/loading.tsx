import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminGuruLoading() {
  return (
    <div className="space-y-8 font-sans text-[#2E2D2D] bg-white animate-pulse">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-[6px]" />
          <Skeleton className="h-4 w-96 rounded-[4px]" />
        </div>
        <Skeleton className="h-10 w-36 rounded-[8px]" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-[4px]" />
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 rounded-[6px]" />
            <Skeleton className="h-3 w-32 rounded-[4px]" />
          </div>
        ))}
      </div>

      {/* AI Copilot Frame */}
      <div className="bg-gradient-to-br from-[#FAFAFF] via-[#F4EFFF] to-[#EBE4FF] rounded-[16px] p-6 border border-[#E0D7FF] space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36 rounded-[6px]" />
          <Skeleton className="h-6 w-24 rounded-[6px]" />
        </div>
        <Skeleton className="h-4 w-3/4 rounded-[4px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Skeleton className="h-24 rounded-[10px]" />
          <Skeleton className="h-24 rounded-[10px]" />
          <Skeleton className="h-24 rounded-[10px]" />
        </div>
      </div>

      {/* Bottom 2-Column Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <Skeleton className="h-5 w-36 rounded-[4px]" />
            <Skeleton className="h-4 w-16 rounded-[4px]" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-[10px] bg-slate-50 flex items-center justify-between">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-[4px]" />
                  <Skeleton className="h-3 w-1/2 rounded-[4px]" />
                </div>
                <Skeleton className="h-7 w-20 rounded-[6px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <Skeleton className="h-5 w-36 rounded-[4px]" />
            <Skeleton className="h-4 w-16 rounded-[4px]" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-[10px] bg-slate-50 flex items-center justify-between">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-[4px]" />
                  <Skeleton className="h-3 w-1/2 rounded-[4px]" />
                </div>
                <Skeleton className="h-7 w-20 rounded-[6px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
