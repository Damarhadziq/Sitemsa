import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
  Book01Icon,
  ComputerIcon,
  CpuIcon,
  UserGroupIcon,
  MusicNote01Icon,
  Car01Icon,
  Dumbbell01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

interface Subject {
  id: number;
  name: string;
  isLastStudied?: boolean;
  modulesCount: number;
  completedMateri: number;
  totalMateri: number;
  description: string;
  icon: IconSvgElement;
}

const SUBJECTS: Subject[] = [
  {
    id: 1,
    name: "Informatika",
    isLastStudied: true,
    modulesCount: 12,
    completedMateri: 3,
    totalMateri: 5,
    description: "Pahami logika dan kuasai dunia digital.",
    icon: ComputerIcon,
  },
  {
    id: 2,
    name: "Elektronika",
    modulesCount: 12,
    completedMateri: 3,
    totalMateri: 5,
    description: "Dari sirkuit sederhana hingga inovasi masa depan.",
    icon: CpuIcon,
  },
  {
    id: 3,
    name: "Bimbingan dan Konseling",
    modulesCount: 12,
    completedMateri: 3,
    totalMateri: 5,
    description: "Kenali potensimu dan rancang masa depanmu.",
    icon: UserGroupIcon,
  },
  {
    id: 4,
    name: "Seni Tari",
    modulesCount: 12,
    completedMateri: 3,
    totalMateri: 5,
    description: "Ekspresikan dirimu melalui harmoni gerak.",
    icon: MusicNote01Icon,
  },
  {
    id: 5,
    name: "Otomotif",
    modulesCount: 12,
    completedMateri: 3,
    totalMateri: 5,
    description: "Bedah mesin dan pahami cara kerjanya.",
    icon: Car01Icon,
  },
  {
    id: 6,
    name: "Keolahragaan",
    modulesCount: 12,
    completedMateri: 3,
    totalMateri: 5,
    description: "Kuatkan fisik dan asah sportivitasmu.",
    icon: Dumbbell01Icon,
  },
];

export function SubjectCatalog() {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
          Bidang Studi
        </h2>
        <Link
          href="/materi"
          className="text-xs font-semibold text-[#0400F4] hover:underline"
        >
          Lihat Semua Materi
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUBJECTS.map((subject) => {
          const progressPercent = (subject.completedMateri / subject.totalMateri) * 100;

          return (
            <Link
              key={subject.id}
              href={`/materi/${subject.id}`}
              className="bg-white border border-[#ECECEC] rounded-[10px] p-4 space-y-3 hover:bg-[#F6F5FF] hover:border-[#0400F4]/40 transition-all duration-300 ease-out group cursor-pointer block"
            >
              {/* Header: Title + Optional Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[6px] bg-[#F4EFFF] flex items-center justify-center text-[#0400F4] shrink-0 group-hover:bg-[#0400F4] group-hover:text-white transition-colors duration-300">
                    <HugeiconsIcon icon={subject.icon} size={16} />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-[#2E2D2D] group-hover:text-[#0400F4] transition-colors duration-200">
                    {subject.name}
                  </h3>
                </div>

                {subject.isLastStudied && (
                  <span className="shrink-0 bg-[#E8E7FF] text-[#0400F4] px-2 py-0.5 rounded-[4px] text-[11px] font-medium">
                    Terakhir Kamu Pelajari
                  </span>
                )}
              </div>

              {/* Modules count */}
              <div className="flex items-center gap-1.5 text-[#0400F4]">
                <HugeiconsIcon icon={Book01Icon} size={15} />
                <span className="text-xs font-medium">
                  {subject.modulesCount} Modul Tersedia
                </span>
              </div>

              {/* Progress Bar + Counter */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 h-1.5 bg-[#ECECEC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0400F4] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[#2E2D2D] shrink-0">
                  {subject.completedMateri} dari {subject.totalMateri} Materi
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#737373] leading-normal">
                {subject.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
