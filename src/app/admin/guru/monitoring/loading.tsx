import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MonitoringLoading() {
  return (
    <div className="space-y-6 font-sans text-[#2E2D2D] bg-white animate-pulse">
      {/* Top Page Title */}
      <div>
        <Skeleton className="h-8 w-56 rounded-[6px]" />
      </div>

      {/* Action Row & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-10 w-full max-w-md rounded-[8px]" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-32 rounded-[4px]" />
          <Skeleton className="h-10 w-36 rounded-[8px]" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <Skeleton className="h-4 w-28 rounded-[4px]" />
          <Skeleton className="h-4 w-20 rounded-[4px]" />
          <Skeleton className="h-4 w-32 rounded-[4px]" />
          <Skeleton className="h-4 w-24 rounded-[4px]" />
          <Skeleton className="h-4 w-24 rounded-[4px]" />
          <Skeleton className="h-4 w-20 rounded-[4px]" />
        </div>

        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
              <div className="flex items-center gap-3 w-48">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 rounded-[4px]" />
                  <Skeleton className="h-3 w-20 rounded-[4px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-16 rounded-[4px]" />
              <Skeleton className="h-4 w-20 rounded-[4px]" />
              <Skeleton className="h-4 w-16 rounded-[4px]" />
              <Skeleton className="h-6 w-24 rounded-[4px]" />
              <Skeleton className="h-8 w-24 rounded-[6px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
