import { Navbar } from "@/components/layout/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DokumentasiLoading() {
  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] flex flex-col font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1 space-y-6">
        <div className="space-y-4 max-w-3xl">
          <Skeleton className="h-8 w-64 md:w-80" />
          <Skeleton className="h-10 w-full max-w-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-[#ECECEC] rounded-[10px] p-5 space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-9 w-full rounded-[6px]" />
                <Skeleton className="h-9 w-full rounded-[6px]" />
                <Skeleton className="h-9 w-full rounded-[6px]" />
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>

            <Skeleton className="w-full h-[280px] md:h-[380px] rounded-[10px]" />

            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-[10px]" />
              <Skeleton className="h-20 w-full rounded-[10px]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
