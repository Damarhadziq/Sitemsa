import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuizLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans animate-pulse">
      {/* Quiz Top Header */}
      <header className="h-16 border-b border-[#ECECEC] px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-5 w-48 rounded-[6px]" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24 rounded-[8px]" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      {/* Main Quiz Area (Question + Options + Sidebar) */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Question Frame (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[16px] border border-[#ECECEC] p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Skeleton className="h-5 w-32 rounded-[4px]" />
            <Skeleton className="h-4 w-20 rounded-[4px]" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-full rounded-[6px]" />
            <Skeleton className="h-6 w-4/5 rounded-[6px]" />
          </div>

          <div className="space-y-3 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-[10px] border border-[#ECECEC] flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-[4px]" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <Skeleton className="h-10 w-28 rounded-[8px]" />
            <Skeleton className="h-10 w-28 rounded-[8px]" />
          </div>
        </div>

        {/* Sidebar Nav & Timer (4 cols) */}
        <div className="hidden lg:block lg:col-span-4 bg-white rounded-[16px] border border-[#ECECEC] p-5 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Skeleton className="h-4 w-28 rounded-[4px]" />
            <Skeleton className="h-4 w-16 rounded-[4px]" />
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <Skeleton key={n} className="h-10 w-full rounded-[8px]" />
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Skeleton className="h-11 w-full rounded-[8px]" />
          </div>
        </div>
      </main>
    </div>
  );
}
