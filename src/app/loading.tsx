import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] flex flex-col font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1 space-y-8">
        {/* Banner Skeleton */}
        <Skeleton className="w-full h-52 md:h-64 rounded-[16px]" />

        {/* Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-44 rounded-[10px]" />
            <Skeleton className="h-44 rounded-[10px]" />
            <Skeleton className="h-44 rounded-[10px]" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
