import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MaterialDetailLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar Skeleton Placeholder */}
      <header className="h-16 border-b border-[#ECECEC] bg-white/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <Skeleton className="h-6 w-28 rounded-[6px]" />
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-16 rounded-[4px]" />
            <Skeleton className="h-4 w-16 rounded-[4px]" />
            <Skeleton className="h-4 w-20 rounded-[4px]" />
            <Skeleton className="h-4 w-16 rounded-[4px]" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-16 w-full flex-1 animate-pulse">
        {/* Sticky Back Button Placeholder */}
        <div className="mb-6">
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>

        {/* 12-Column Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Category & Difficulty Badges */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-28 rounded-[4px]" />
              <Skeleton className="h-6 w-24 rounded-[4px]" />
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <Skeleton className="h-9 w-full max-w-xl rounded-[8px]" />
              <Skeleton className="h-9 w-3/4 rounded-[8px]" />
            </div>

            {/* Author & Meta Row */}
            <div className="flex items-center gap-4 pt-1">
              <Skeleton className="h-4 w-36 rounded-[4px]" />
              <Skeleton className="h-4 w-24 rounded-[4px]" />
              <Skeleton className="h-4 w-20 rounded-[4px]" />
            </div>

            {/* Video / Hero Preview Banner */}
            <Skeleton className="w-full h-72 md:h-80 rounded-[14px]" />

            {/* Article Content Paragraphs & Blocks */}
            <div className="space-y-4 pt-2">
              <Skeleton className="h-7 w-48 rounded-[6px]" />
              <Skeleton className="h-4 w-full rounded-[4px]" />
              <Skeleton className="h-4 w-full rounded-[4px]" />
              <Skeleton className="h-4 w-5/6 rounded-[4px]" />

              <div className="p-5 rounded-[12px] bg-slate-50 border border-slate-100 space-y-3 my-4">
                <Skeleton className="h-5 w-40 rounded-[4px]" />
                <Skeleton className="h-4 w-full rounded-[4px]" />
                <Skeleton className="h-4 w-4/5 rounded-[4px]" />
              </div>

              <Skeleton className="h-7 w-56 rounded-[6px] pt-4" />
              <Skeleton className="h-4 w-full rounded-[4px]" />
              <Skeleton className="h-4 w-full rounded-[4px]" />
              <Skeleton className="h-4 w-3/4 rounded-[4px]" />
            </div>
          </div>

          {/* Sidebar Column (4 Cols) */}
          <div className="hidden lg:block lg:col-span-4 space-y-5 sticky top-24">
            {/* Table of Contents & Quick Action Card */}
            <div className="bg-white rounded-[14px] border border-[#ECECEC] p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <Skeleton className="h-4 w-32 rounded-[4px]" />
                <Skeleton className="h-4 w-12 rounded-[4px]" />
              </div>

              <div className="space-y-2.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-full rounded-[4px]" />
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Skeleton className="h-10 w-full rounded-[8px]" />
              </div>
            </div>

            {/* Teacher Info Card */}
            <div className="bg-white rounded-[14px] border border-[#ECECEC] p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-28 rounded-[4px]" />
                  <Skeleton className="h-3 w-36 rounded-[4px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
