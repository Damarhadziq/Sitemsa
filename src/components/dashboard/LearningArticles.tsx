'use client';

import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useAdminStore } from "@/lib/admin-store";

interface Article {
  id: number | string;
  title: string;
  author: string;
  description: string;
}

const FALLBACK_ARTICLES: Article[] = [
  {
    id: 1,
    title: "5 Strategi Efektif Menguasai Logika Pemrograman",
    author: "Tim Informatika",
    description: "Pelajari pendekatan bertahap untuk mengasah logika komputasi dan memecahkan masalah dengan mudah.",
  },
  {
    id: 2,
    title: "Teknik Pomodoro: Solusi Fokus Tanpa Cepat Lelah",
    author: "Bimbingan Konseling",
    description: "Cara mengatur sesi belajar 25 menit dengan istirahat teratur untuk menjaga konsentrasi puncak.",
  },
  {
    id: 3,
    title: "Mengenal Dasar Rangkaian Listrik & Komponen Pasif",
    author: "Tim Elektronika",
    description: "Panduan ringkas untuk memahami prinsip kerja resistor, kapasitor, dan induktor dalam sirkuit.",
  },
];

export function LearningArticles() {
  const { articles } = useAdminStore();

  const displayArticles: Article[] = useMemo(() => {
    if (articles && articles.length > 0) {
      return articles.slice(0, 3).map((art, idx) => ({
        id: parseInt(String(art.id).replace(/\D/g, ''), 10) || idx + 1,
        title: art.title,
        author: art.author || 'Tim Sitemsa',
        description: art.excerpt || (art.content ? art.content.slice(0, 110) + '...' : 'Tips dan strategi belajar efektif.'),
      }));
    }
    return FALLBACK_ARTICLES;
  }, [articles]);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
          Tips Belajar
        </h2>
        <Link
          href="/tips-belajar"
          className="text-xs font-semibold text-[#2563EB] hover:opacity-80 transition-opacity flex items-center gap-1 group"
        >
          <span>Lihat Semua</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-[#ECECEC] rounded-[10px] p-4 flex flex-col justify-between hover:bg-[#F6F5FF] hover:border-[#2563EB]/40 transition-all duration-300 ease-out group"
          >
            <div>
              <h3 className="text-sm md:text-base font-semibold text-[#2E2D2D] mb-2 leading-snug group-hover:text-[#2563EB] transition-colors duration-200">
                {article.title}
              </h3>

              <p className="text-xs text-[#737373] leading-relaxed mb-4">
                {article.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#ECECEC]">
              <span className="text-[11px] font-medium text-[#737373]">
                {article.author}
              </span>
              <Link
                href={`/tips-belajar?id=${article.id}`}
                className="text-xs font-semibold text-[#2563EB] hover:opacity-80 transition-opacity flex items-center gap-1 group/link"
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
