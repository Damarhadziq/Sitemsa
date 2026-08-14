import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

interface Article {
  id: number;
  category: string;
  title: string;
  readTime: string;
  author: string;
  description: string;
}

const ARTICLES: Article[] = [
  {
    id: 1,
    category: "Tips Belajar",
    title: "5 Strategi Efektif Menguasai Logika Pemrograman",
    readTime: "5 min baca",
    author: "Tim Informatika",
    description: "Pelajari pendekatan bertahap untuk mengasah logika komputasi dan memecahkan masalah dengan mudah.",
  },
  {
    id: 2,
    category: "Manajemen Waktu",
    title: "Teknik Pomodoro: Solusi Fokus Tanpa Cepat Lelah",
    readTime: "4 min baca",
    author: "Bimbingan Konseling",
    description: "Cara mengatur sesi belajar 25 menit dengan istirahat teratur untuk menjaga konsentrasi puncak.",
  },
  {
    id: 3,
    category: "Panduan Praktis",
    title: "Mengenal Dasar Rangkaian Listrik & Komponen Pasif",
    readTime: "6 min baca",
    author: "Tim Elektronika",
    description: "Panduan ringkas untuk memahami prinsip kerja resistor, kapasitor, dan induktor dalam sirkuit.",
  },
];

export function LearningArticles() {
  return (
    <section className="mb-10">
      <h2 className="text-base md:text-lg font-semibold text-[#2E2D2D] mb-6">
        Panduan & Tips Belajar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ARTICLES.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-[#ECECEC] rounded-[10px] p-4 flex flex-col justify-between hover:bg-[#F6F5FF] hover:border-[#0400F4]/40 transition-all duration-300 ease-out group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-block bg-[#E8E7FF] text-[#0400F4] px-2 py-0.5 rounded-[4px] text-xs font-medium">
                  {article.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-[#737373]">
                  <HugeiconsIcon icon={Clock01Icon} size={13} />
                  <span>{article.readTime}</span>
                </div>
              </div>

              <h3 className="text-sm md:text-base font-semibold text-[#2E2D2D] mb-2 leading-snug group-hover:text-[#0400F4] transition-colors duration-200">
                {article.title}
              </h3>

              <p className="text-xs text-[#737373] leading-relaxed mb-4">
                {article.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#ECECEC]/60">
              <span className="text-[11px] font-medium text-[#737373]">
                {article.author}
              </span>
              <Link
                href="#"
                className="text-xs font-semibold text-[#0400F4] hover:opacity-80 transition-opacity flex items-center gap-1 group/link"
              >
                <span>Baca</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover/link:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
