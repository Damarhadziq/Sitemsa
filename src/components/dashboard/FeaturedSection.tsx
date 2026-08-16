import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  StarIcon,
  Clock01Icon,
  FireIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";

export function FeaturedSection() {
  return (
    <section className="mb-8 bg-[#F4EFFF] rounded-[12px] p-5 lg:p-6">
      <h2 className="text-base md:text-lg font-semibold text-[#2E2D2D] mb-6">
        Paling Banyak Dipelajari Minggu Ini
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Informatika */}
        <div className="bg-white rounded-[10px] p-4 flex flex-col justify-between border border-[#ECECEC] hover:border-[#2563EB]/30 transition-colors duration-300 ease-out group">
          <div>
            <span className="inline-block bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] text-xs font-medium mb-2.5">
              Informatika
            </span>
            <h3 className="text-sm font-semibold text-[#2E2D2D] mb-3 leading-snug group-hover:text-[#2563EB] transition-colors duration-200">
              Logika Dasar dan Algoritma
            </h3>
            <div className="flex items-center gap-2.5 text-[#737373] text-xs mb-5">
              <div className="flex -space-x-1.5 shrink-0">
                {[15, 16, 17].map((id) => (
                  <div key={id} className="w-5 h-5 rounded-full border border-white bg-gray-200 overflow-hidden relative">
                    <Image src={`https://i.pravatar.cc/100?img=${id}`} alt="User" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <span className="leading-tight">125 siswa baru saja menyelesaikan ini.</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/materi/1"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white px-3.5 py-2 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
            >
              <span>Mulai Belajar</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Card 2: Bimbingan & Konseling */}
        <div className="bg-white rounded-[10px] p-4 flex flex-col justify-between border border-[#ECECEC] hover:border-[#2563EB]/30 transition-colors duration-300 ease-out group">
          <div>
            <span className="inline-block bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] text-xs font-medium mb-2.5">
              Bimbingan & Konseling
            </span>
            <h3 className="text-sm font-semibold text-[#2E2D2D] mb-3 leading-snug group-hover:text-[#2563EB] transition-colors duration-200">
              Manajemen Waktu untuk Pelajar
            </h3>
            <div className="flex items-center gap-3 text-[#737373] text-xs mb-5">
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={StarIcon} size={14} className="text-[#FFCE03]" />
                <span className="font-medium text-[#2E2D2D]">4.9/5</span>
              </div>
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={Clock01Icon} size={14} className="text-[#737373]" />
                <span>10 Menit baca.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/materi/3"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white px-3.5 py-2 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
            >
              <span>Mulai Belajar</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Card 3: Elektronika */}
        <div className="bg-white rounded-[10px] p-4 flex flex-col justify-between border border-[#ECECEC] hover:border-[#2563EB]/30 transition-colors duration-300 ease-out group">
          <div>
            <span className="inline-block bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] text-xs font-medium mb-2.5">
              Elektronika
            </span>
            <h3 className="text-sm font-semibold text-[#2E2D2D] mb-3 leading-snug group-hover:text-[#2563EB] transition-colors duration-200">
              Mengenal Komponen Resistor & Kapasitor
            </h3>
            <div className="flex items-center gap-1.5 text-[#737373] text-xs mb-5">
              <HugeiconsIcon icon={FireIcon} size={14} className="text-[#FFCE03]" />
              <span>Sedang tren di kelas 10</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/materi/2"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white px-3.5 py-2 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
            >
              <span>Mulai Belajar</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
