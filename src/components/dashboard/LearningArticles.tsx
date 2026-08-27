'use client';

import { useMemo, useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useAdminStore } from "@/lib/admin-store";
import { getStudentProfile } from "@/services/student-profile.service";
import { ArticleService } from "@/services/article.service";

interface Article {
  id: number | string;
  title: string;
  author: string;
  category?: string;
  description: string;
}

const ALL_CURATED_TIPS: Article[] = [
  {
    id: 1,
    title: "5 Strategi Efektif Menguasai Logika Pemrograman",
    author: "Tim Informatika",
    category: "Informatika",
    description: "Pelajari pendekatan bertahap untuk mengasah logika komputasi dan memecahkan masalah dengan mudah.",
  },
  {
    id: 7,
    title: "Manajemen Catatan Digital: Menata Kode & Dokumentasi Proyek",
    author: "Tim Informatika",
    category: "Informatika",
    description: "Tips mengorganisir snippet kode, jurnal laboratorium, dan repositori proyek agar rapi dan mudah diakses.",
  },
  {
    id: 2,
    title: "Teknik Pomodoro: Solusi Fokus Tanpa Cepat Lelah",
    author: "Bimbingan Konseling",
    category: "Bimbingan Konseling",
    description: "Cara mengatur sesi belajar 25 menit dengan istirahat teratur untuk menjaga konsentrasi puncak.",
  },
  {
    id: 10,
    title: "Mengatasi Demam Panggung & Membangun Rasa Percaya Diri",
    author: "Bimbingan Konseling",
    category: "Bimbingan Konseling",
    description: "Teknik pernapasan diafragma 4-7-8 dan afirmasi positif untuk mengendalikan kecemasan sebelum ujian praktik.",
  },
  {
    id: 3,
    title: "Mengenal Dasar Rangkaian Listrik & Komponen Pasif",
    author: "Tim Elektronika",
    category: "Elektronika",
    description: "Panduan ringkas untuk memahami prinsip kerja resistor, kapasitor, dan induktor dalam sirkuit.",
  },
  {
    id: 6,
    title: "Panduan Membaca Skema Elektronika & Wiring Diagram",
    author: "Tim Elektronika",
    category: "Elektronika",
    description: "Langkah sistematis menerjemahkan gambar diagram simbolis menjadi tata letak komponen nyata di PCB.",
  },
  {
    id: 8,
    title: "Panduan Membaca Wiring Diagram Kelistrikan Mobil",
    author: "Tim Otomotif",
    category: "Otomotif",
    description: "Langkah sistematis membaca jalur arus utama, relay, fuse box, dan kode warna kabel sistem kelistrikan.",
  },
  {
    id: 9,
    title: "Teknik Olah Tubuh & Pemanasan Penari Tradisional",
    author: "Tim Seni Tari",
    category: "Seni Tari",
    description: "Latihan kelenturan sendi, penguatan otot inti, dan pernapasan ritmis untuk postur menari yang bebas cedera.",
  },
  {
    id: 5,
    title: "Menjaga Kebugaran Fisik & Stamina Saat Ujian Praktik Bengkel",
    author: "Tim Keolahragaan",
    category: "Keolahragaan",
    description: "Pengaturan gizi, hidrasi, dan postur ergonomi agar stamina tetap prima saat menempuh asesmen praktik panjang.",
  },
  {
    id: 4,
    title: "Metode Active Recall & Spaced Repetition untuk Teori Vokasi",
    author: "Tim Kurikulum",
    category: "Umum",
    description: "Teknik belajar berbasis bukti ilmiah untuk memperkuat daya ingat jangka panjang menghadapi ujian kejuruan.",
  },
];

export function LearningArticles() {
  const { articles: storeArticles } = useAdminStore();
  const [liveArticles, setLiveArticles] = useState<any[]>([]);
  const [userInterest, setUserInterest] = useState<string>('');

  useEffect(() => {
    // Detect student profile interest / department
    const profile = getStudentProfile();
    if (profile?.grade) {
      const g = profile.grade.toUpperCase();
      if (g.includes('PPLG') || g.includes('RPL') || g.includes('TKJ') || g.includes('SIJA')) {
        setUserInterest('Informatika');
      } else if (g.includes('TKR') || g.includes('TSM') || g.includes('OTO')) {
        setUserInterest('Otomotif');
      } else if (g.includes('TE') || g.includes('TITL') || g.includes('AV')) {
        setUserInterest('Elektronika');
      } else if (g.includes('TARI') || g.includes('SENI')) {
        setUserInterest('Seni Tari');
      } else if (g.includes('PJKR') || g.includes('OR')) {
        setUserInterest('Keolahragaan');
      }
    }

    ArticleService.fetchFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setLiveArticles(data);
      }
    });
  }, []);

  const displayArticles: Article[] = useMemo(() => {
    // 1. Gather all pool
    const combinedPool: Article[] = [
      ...ALL_CURATED_TIPS,
      ...(liveArticles.length > 0 ? liveArticles : storeArticles).map((art: any, idx: number) => ({
        id: art.id !== undefined ? art.id : idx + 100,
        title: art.title,
        author: art.author || 'Tim Sitemsa',
        category: art.category || 'Umum',
        description: art.excerpt || (art.content ? art.content.slice(0, 110) + '...' : 'Tips dan strategi belajar efektif.'),
      })),
    ];

    // Remove duplicates by title
    const uniqueMap = new Map<string, Article>();
    combinedPool.forEach((item) => {
      const key = item.title.toLowerCase().trim();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });
    const uniqueArticles = Array.from(uniqueMap.values());

    // 2. Personalize by student interest
    if (userInterest) {
      const matched = uniqueArticles.filter(
        (a) =>
          a.category?.toLowerCase() === userInterest.toLowerCase() ||
          a.author?.toLowerCase().includes(userInterest.toLowerCase())
      );
      const general = uniqueArticles.filter(
        (a) =>
          a.category?.toLowerCase() !== userInterest.toLowerCase() &&
          !a.author?.toLowerCase().includes(userInterest.toLowerCase())
      );

      // Take matched first, then fill with general up to 3
      return [...matched, ...general].slice(0, 3);
    }

    // Default fallback: return top 3 balanced tips
    return uniqueArticles.slice(0, 3);
  }, [liveArticles, storeArticles, userInterest]);

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
          <Link
            key={article.id}
            href={`/tips-belajar?id=${article.id}`}
            className="bg-white border border-[#ECECEC] rounded-[10px] p-4 flex flex-col justify-between hover:bg-[#F6F5FF] hover:border-[#2563EB]/40 transition-all duration-300 ease-out group block cursor-pointer"
          >
            <div>
              <h3 className="text-sm md:text-base font-semibold text-[#2E2D2D] mb-2 leading-snug group-hover:text-[#2563EB] transition-colors duration-200">
                {article.title}
              </h3>

              <p className="text-xs text-[#737373] leading-relaxed mb-4 line-clamp-3">
                {article.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#ECECEC]">
              <span className="text-[11px] font-medium text-[#737373]">
                {article.author}
              </span>
              <span className="text-xs font-semibold text-[#2563EB] group-hover:opacity-80 transition-opacity flex items-center gap-1">
                <span>Baca</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
