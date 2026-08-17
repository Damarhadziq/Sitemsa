'use client';

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

interface ArticleItem {
  id: number;
  title: string;
  author: string;
  summary: string;
  contentSections: {
    title: string;
    description: string;
    callout?: string;
  }[];
}

const TIPS_ARTICLES: ArticleItem[] = [
  {
    id: 1,
    title: "5 Strategi Efektif Menguasai Logika Pemrograman",
    author: "Tim Informatika",
    summary: "Pelajari pendekatan bertahap untuk mengasah logika komputasi, menyusun algoritma, dan memecahkan masalah pemrograman dengan mudah.",
    contentSections: [
      {
        title: "Pahami Alur Berpikir Komputasional",
        description: "Sebelum langsung menulis kode program di editor, biasakan menyusun algoritma sederhana dengan pseudocode atau diagram alur di kertas catatan. Pendekatan ini membantu memvisualisasikan struktur logika secara jernih tanpa terdistraksi syntax error.",
      },
      {
        title: "Pecah Masalah Kompleks Menjadi Bagian Kecil (Decomposisi)",
        description: "Jangan mencoba menyelesaikan seluruh masalah sekaligus. Pecah program menjadi fungsi-fungsi kecil yang berfokus pada satu tugas spesifik. Metode ini memudahkan proses pengujian dan pelacakan bug saat kode berjalan.",
        callout: "Tips: Mulailah dengan mengeksekusi variabel dan ekspresi logika dasar terlebih dahulu sebelum masuk ke struktur perulangan bertingkat.",
      },
      {
        title: "Manfaatkan Metode Rubber Duck Debugging",
        description: "Saat menemukan error yang membingungkan, jelaskan baris demi baris logika kodenya secara lisan atau tuliskan kembali kalimat penjelasannya. Cara ini terbukti ampuh menemukan logika yang terlewat.",
      },
      {
        title: "Gunakan Latihan Praktik Terukur",
        description: "Praktik langsung jauh lebih efektif dibandingkan sekadar membaca teori. Kerjakan soal-soal latihan kecil di setiap akhir modul materi Sitemsa untuk memperkuat insting pemrograman.",
      },
    ],
  },
  {
    id: 2,
    title: "Teknik Pomodoro: Solusi Fokus Tanpa Cepat Lelah",
    author: "Bimbingan Konseling",
    summary: "Cara praktis mengatur sesi belajar 25 menit dengan istirahat teratur untuk menjaga konsentrasi puncak dan mencegah kejenuhan mental.",
    contentSections: [
      {
        title: "Konsep Dasar Interval Pomodoro",
        description: "Bagi waktu belajarmu menjadi interval 25 menit fokus penuh tanpa distraksi gadget, dilanjutkan dengan istirahat singkat selama 5 menit. Siklus ini membantu otak menjaga kebugaran kognitif secara konsisten.",
      },
      {
        title: "Pentingnya Sesi Istirahat Panjang",
        description: "Setelah menyelesaikan 4 siklus Pomodoro (total 100 menit waktu belajar), luangkan waktu istirahat panjang selama 15-30 menit untuk menyegarkan pikiran dan mengonsolidasi daya ingat.",
        callout: "Gunakan waktu istirahat 5 menit untuk berdiri, melakukan peregangan tubuh, atau minum air hangat agar aliran darah tetap lancar.",
      },
      {
        title: "Hindari Multitasking Saat Sesi Belajar",
        description: "Fokuslah pada satu topik atau satu soal kuis saja dalam setiap interval Pomodoro. Berpindah-pindah tugas secara mendadak dapat menurunkan efisiensi memori hingga 40%.",
      },
    ],
  },
  {
    id: 3,
    title: "Mengenal Dasar Rangkaian Listrik & Komponen Pasif",
    author: "Tim Elektronika",
    summary: "Panduan komprehensif untuk memahami prinsip kerja resistor, kapasitor, dan induktor dalam sirkuit elektronika vokasi.",
    contentSections: [
      {
        title: "Peran Utama Resistor dalam Pembatasan Arus",
        description: "Resistor berfungsi membatasi besarnya arus listrik yang mengalir dalam sirkuit. Pelajari kode warna resistor untuk membaca nilai resistansi secara cepat dan akurat.",
      },
      {
        title: "Penyimpanan Energi Sementara pada Kapasitor",
        description: "Kapasitor bertindak sebagai penyimpan muatan energi listrik sementara dan penyaring gelombang frekuensi. Pahami perbedaan antara kapasitor polar dan non-polar untuk keamanan perakitan.",
        callout: "Perhatian: Selalu pastikan kapasitor polar dipasang sesuai dengan polaritas positif dan negatifnya untuk mencegah kerusakan komponen.",
      },
      {
        title: "Penerapan Hukum Ohm pada Praktik Bengkel",
        description: "Kuasai hubungan antara tegangan (V), arus (I), dan hambatan (R) melalui rumus dasar V = I × R. Rumus ini merupakan pondasi utama dalam merancang maupun menganalisis masalah sirkuit listrik.",
      },
    ],
  },
  {
    id: 4,
    title: "Metode Active Recall & Spaced Repetition untuk Teori Vokasi",
    author: "Tim Kurikulum",
    summary: "Teknik belajar berbasis bukti ilmiah untuk memperkuat daya ingat jangka panjang menghadapi ujian teori dan praktikum.",
    contentSections: [
      {
        title: "Tinggalkan Cara Membaca Ulang Pasif",
        description: "Membaca ulang catatan berkali-kali memberikan ilusi mastery. Sebaliknya, uji ingatanmu dengan menutup catatan dan mencoba menjelaskan kembali konsep utama secara lisan.",
      },
      {
        title: "Jadwalkan Pengulangan Berkala (Spaced Repetition)",
        description: "Ulangi materi yang dipelajari dengan interval waktu yang bertahap: H+1 setelah materi disampaikan, H+3, H+7, dan H+14. Pola ini mencegah meluruhnya kurva ingatan.",
        callout: "Manfaatkan fitur Uji Pemahaman di Sitemsa sebagai media pengulangan berkala yang cepat dan terukur.",
      },
    ],
  },
  {
    id: 5,
    title: "Menjaga Kebugaran Fisik & Stamina Saat Ujian Praktik Bengkel",
    author: "Tim Keolahragaan",
    summary: "Pengaturan gizi, hidrasi, dan postur ergonomy agar stamina tetap prima saat menempuh asesmen praktik laboratorium yang panjang.",
    contentSections: [
      {
        title: "Pentingnya Hidrasi Tubuh Secara Teratur",
        description: "Kekurangan cairan tubuh sebesar 2% saja dapat menurunkan tingkat konsentrasi dan respon motorik hingga 20%. Pastikan konsumsi air putih minimal 2 liter setiap hari.",
      },
      {
        title: "Pola Istirahat Cukup Sebelum Hari H",
        description: "Hindari sistem skenario belajar semalam suntuk (SKS). Tidur berkualitas selama 7-8 jam sebelum ujian sangat krusial agar koordinasi mata dan tangan saat praktik bengkel tetap presisi.",
      },
    ],
  },
  {
    id: 6,
    title: "Panduan Membaca Skema Elektronika & Wiring Diagram",
    author: "Tim Elektronika",
    summary: "Langkah-langkah sistematis menerjemahkan gambar diagram simbolis menjadi tata letak komponen nyata di breadboard atau PCB.",
    contentSections: [
      {
        title: "Kenali Simbol Standardisasi Internasional",
        description: "Pelajari simbol-simbol standar ISO/IEEE untuk komponen elektronik seperti transistor, dioda, sakelar, dan ground.",
      },
      {
        title: "Telusuri Jalur Daya & Ground Terlebih Dahulu",
        description: "Saat merakit di breadboard, sambungkan bus tegangan utama (VCC/GND) terlebih dahulu sebelum memasang jalur sinyal antar-komponen.",
      },
    ],
  },
  {
    id: 7,
    title: "Manajemen Catatan Digital: Menata Kode & Dokumentasi Proyek",
    author: "Tim Informatika",
    summary: "Tips mengorganisir snippet kode, jurnal laboratorium, dan repositori proyek agar rapi dan mudah diakses kapan saja.",
    contentSections: [
      {
        title: "Gunakan Penamaan File & Commit yang Konsisten",
        description: "Beri nama file project dan commit git dengan format yang jelas dan mendeskripsikan perubahan secara singkat.",
      },
      {
        title: "Dokumentasikan Langkah Troubleshooting",
        description: "Setiap kali berhasil menyelesaikan bug yang rumit, catat penyebab dan solusinya pada jurnal digital milikmu agar tidak perlu mencari dari awal jika masalah serupa terulang.",
      },
    ],
  },
];

// Beautiful Skeleton Fallback for Tips Belajar Page
function TipsBelajarSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-48 md:w-64" />
        <Skeleton className="h-10 w-full max-w-lg" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Sidebar Skeleton */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-[#ECECEC] rounded-[10px] p-5 space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-full rounded-[6px]" />
              <Skeleton className="h-9 w-full rounded-[6px]" />
              <Skeleton className="h-9 w-full rounded-[6px]" />
              <Skeleton className="h-9 w-full rounded-[6px]" />
              <Skeleton className="h-9 w-full rounded-[6px]" />
            </div>
          </div>
        </aside>

        {/* Main Article Canvas Skeleton */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-16 w-full rounded-[8px]" />
            </div>
          </div>

          <div className="pt-6 border-t border-[#ECECEC] flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </main>
  );
}

function TipsBelajarContent() {
  const searchParams = useSearchParams();
  const queryIdStr = searchParams.get("id");

  const initialId = useMemo(() => {
    if (queryIdStr) {
      const parsed = parseInt(queryIdStr, 10);
      if (!isNaN(parsed) && TIPS_ARTICLES.some((a) => a.id === parsed)) {
        return parsed;
      }
    }
    return 1;
  }, [queryIdStr]);

  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const activeArticleId = selectedArticleId ?? initialId;

  const filteredArticles = TIPS_ARTICLES.filter(
    (art) =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeArticle =
    TIPS_ARTICLES.find((art) => art.id === activeArticleId) || TIPS_ARTICLES[0];

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1 space-y-6">
      {/* Header (Title Only: "Tips Belajar") */}
      <section className="space-y-4 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#2E2D2D] tracking-tight">
          Tips Belajar
        </h1>
      </section>

      {/* 2-Column Clean Canvas Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Sidebar List (4 Columns) */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
          <div className="bg-white border border-[#ECECEC] rounded-[10px] p-5 space-y-4">
            {/* Search Bar Inside Frame */}
            <div className="relative w-full">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]"
              />
              <input
                type="text"
                placeholder="Cari tips belajar (misal: logika, pomodoro)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#ECECEC] rounded-[8px] pl-9 pr-3 py-2 text-xs text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Sidebar Title (No Count Badge) */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-[#2E2D2D]">Daftar Tips Belajar</h3>
            </div>

            <nav className="space-y-1 max-h-[540px] overflow-y-auto pr-1">
              {filteredArticles.length === 0 ? (
                <div className="py-4 text-xs text-[#737373]">
                  Tidak ada tips yang cocok
                </div>
              ) : (
                filteredArticles.map((art) => {
                  const isActive = activeArticleId === art.id;
                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`block w-full text-left py-2 px-3 text-xs transition-colors duration-200 cursor-pointer ${
                        isActive
                          ? "text-[#2563EB] font-semibold border-l-2 border-[#2563EB] bg-[#F6F5FF]"
                          : "text-[#737373] font-medium hover:text-[#2E2D2D] border-l-2 border-transparent"
                      }`}
                    >
                      {art.title}
                    </button>
                  );
                })
              )}
            </nav>
          </div>
        </aside>

        {/* Right Main Article View — Pure Canvas (8 Columns) */}
        <article className="lg:col-span-8 space-y-8">
          <header className="space-y-2">
            <h2 className="text-xl md:text-3xl font-semibold text-[#2E2D2D] leading-tight">
              {activeArticle.title}
            </h2>
            <p className="text-xs md:text-sm text-[#737373] leading-relaxed">
              {activeArticle.summary}
            </p>
          </header>

          {/* Standardized Sections Canvas */}
          <div className="space-y-6">
            {activeArticle.contentSections.map((sec, idx) => (
              <section key={idx} className="space-y-2">
                <h3 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
                  {sec.title}
                </h3>
                <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                  {sec.description}
                </p>

                {sec.callout && (
                  <div className="bg-[#F4EFFF] border-l-4 border-[#2563EB] rounded-r-[8px] p-4 text-xs md:text-sm text-[#2E2D2D] font-medium leading-relaxed my-3">
                    {sec.callout}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Footer Metadata */}
          <footer className="pt-6 border-t border-[#ECECEC] flex items-center justify-between text-xs text-[#737373]">
            <span>Penulis: {activeArticle.author}</span>
          </footer>
        </article>
      </section>
    </main>
  );
}

export default function TipsBelajarPage() {
  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] flex flex-col font-sans">
      <Navbar />
      <Suspense fallback={<TipsBelajarSkeleton />}>
        <TipsBelajarContent />
      </Suspense>
      <Footer />
    </div>
  );
}
