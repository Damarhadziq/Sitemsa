import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="mb-10 bg-[#0400F4] text-white rounded-[14px] p-6 lg:p-8 overflow-hidden relative flex flex-col md:flex-row items-stretch justify-between gap-6 lg:gap-8 transition-all duration-300">
      {/* Decorative subtle ambient pattern */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-between space-y-4 z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-white border border-white px-2.5 py-1 rounded-[6px] text-xs font-medium bg-transparent">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>Inovasi Pembelajaran</span>
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
            Ruang Belajar Digital yang Dirancang untuk Mengasah Potensimu
          </h2>

          <p className="text-xs lg:text-sm text-white/80 leading-relaxed max-w-xl">
            Sitemsa hadir sebagai wadah eksplorasi materi interaktif, fleksibel, dan mendukung perkembangan minat siswa secara berkelanjutan dalam satu platform terpadu.
          </p>
        </div>

        <div className="pt-2 flex items-center">
          <Link
            href="#"
            className="bg-white text-[#0400F4] hover:bg-gray-100 active:scale-98 px-4 py-2.5 rounded-[8px] text-xs lg:text-sm font-semibold flex items-center gap-2 transition-all duration-200"
          >
            <span>Eksplorasi Pembelajaran</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Link>
        </div>
      </div>

      {/* Right Image (Wider image, matching left height) */}
      <div className="w-full md:w-[380px] lg:w-[440px] xl:w-[480px] min-h-[200px] md:min-h-0 relative rounded-[10px] overflow-hidden border border-white/20 shrink-0 z-10 group cursor-pointer self-stretch">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
          alt="Sitemsa Learning Space"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>
    </section>
  );
}
