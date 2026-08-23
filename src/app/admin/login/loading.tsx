import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoginLoading() {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white font-sans overflow-hidden animate-pulse">
      {/* Left Column Skeleton (60%) */}
      <div className="hidden lg:flex lg:w-[60%] relative bg-slate-100 p-8 xl:p-12 flex-col justify-between overflow-hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-28 rounded-[6px] bg-slate-200" />
        </div>
        <div />
      </div>

      {/* Right Column Form Skeleton (40%) */}
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-between p-8 sm:p-12 xl:p-14 bg-white overflow-hidden">
        {/* Mobile Logo Fallback */}
        <div className="lg:hidden pb-2">
          <Skeleton className="h-7 w-24 rounded-[6px]" />
        </div>

        {/* Form Container Skeleton */}
        <div className="my-auto w-full max-w-md mx-auto space-y-6">
          {/* Title & Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 rounded-[8px]" />
            <Skeleton className="h-3.5 w-72 rounded-[4px]" />
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32 rounded-[4px]" />
              <Skeleton className="h-10 w-full rounded-[8px]" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20 rounded-[4px]" />
              <Skeleton className="h-10 w-full rounded-[8px]" />
            </div>

            <div className="pt-1.5">
              <Skeleton className="h-10 w-full rounded-[8px] bg-blue-100/70" />
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="w-full max-w-md mx-auto pt-2">
          <Skeleton className="h-3 w-56 rounded-[4px]" />
        </div>
      </div>
    </div>
  );
}
