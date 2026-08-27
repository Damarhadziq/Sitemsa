'use client';

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface ArticleItem {
  id: number | string;
  title: string;
  author: string;
  summary: string;
  category?: string;
  contentSections: {
    title: string;
    description: string;
    callout?: string;
  }[];
}

const ITEMS_PER_PAGE = 5;

const TIPS_ARTICLES: ArticleItem[] = [
  {
    id: 1,
    title: "5 Strategi Efektif Menguasai Logika Pemrograman",
    author: "Tim Informatika",
    category: "Informatika",
    summary: "Pelajari pendekatan bertahap untuk mengasah logika komputasi, menyusun algoritma, dan memecahkan masalah pemrograman dengan mudah.",
    contentSections: [
      {
        title: "Pahami Alur Berpikir Komputasional",
        description: "Sebelum langsung menulis kode program di editor, biasakan menyusun algoritma sederhana dengan pseudocode atau diagram alur di kertas catatan. Pendekatan ini membantu memvisualisasikan struktur logika secara jernih tanpa terdistraksi syntax error.",
      },
      {
        title: "Pecah Masalah Kompleks Menjadi Bagian Kecil (Dekomposisi)",
        description: "Jangan mencoba menyelesaikan seluruh masalah sekaligus. Pecah program menjadi fungsi-fungsi kecil yang berfokus pada satu tugas spesifik. Metode ini memudahkan proses pengujian dan pelacakan bug saat kode berjalan.",
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
    category: "Bimbingan Konseling",
    summary: "Cara praktis mengatur sesi belajar 25 menit dengan istirahat teratur untuk menjaga konsentrasi puncak dan mencegah kejenuhan mental.",
    contentSections: [
      {
        title: "Konsep Dasar Interval Pomodoro",
        description: "Bagi waktu belajarmu menjadi interval 25 menit fokus penuh tanpa distraksi gadget, dilanjutkan dengan istirahat singkat selama 5 menit. Siklus ini membantu otak menjaga kebugaran kognitif secara konsisten.",
      },
      {
        title: "Pentingnya Sesi Istirahat Panjang",
        description: "Setelah menyelesaikan 4 siklus Pomodoro (total 100 menit waktu belajar), luangkan waktu istirahat panjang selama 15-30 menit untuk menyegarkan pikiran dan mengonsolidasi daya ingat.",
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
    category: "Elektronika",
    summary: "Panduan komprehensif untuk memahami prinsip kerja resistor, kapasitor, dan induktor dalam sirkuit elektronika vokasi.",
    contentSections: [
      {
        title: "Peran Utama Resistor dalam Pembatasan Arus",
        description: "Resistor berfungsi membatasi besarnya arus listrik yang mengalir dalam sirkuit. Pelajari kode warna resistor untuk membaca nilai resistansi secara cepat dan akurat.",
      },
      {
        title: "Penyimpanan Energi Sementara pada Kapasitor",
        description: "Kapasitor bertindak sebagai penyimpan muatan energi listrik sementara dan penyaring gelombang frekuensi. Pahami perbedaan antara kapasitor polar dan non-polar untuk keamanan perakitan.",
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
    category: "Umum",
    summary: "Teknik belajar berbasis bukti ilmiah untuk memperkuat daya ingat jangka panjang menghadapi ujian teori dan praktikum.",
    contentSections: [
      {
        title: "Tinggalkan Cara Membaca Ulang Pasif",
        description: "Membaca ulang catatan berkali-kali memberikan ilusi mastery. Sebaliknya, uji ingatanmu dengan menutup catatan dan mencoba menjelaskan kembali konsep utama secara lisan.",
      },
      {
        title: "Jadwalkan Pengulangan Berkala (Spaced Repetition)",
        description: "Ulangi materi yang dipelajari dengan interval waktu yang bertahap: H+1 setelah materi disampaikan, H+3, H+7, dan H+14. Pola ini mencegah meluruhnya kurva ingatan.",
      },
    ],
  },
  {
    id: 5,
    title: "Menjaga Kebugaran Fisik & Stamina Saat Ujian Praktik Bengkel",
    author: "Tim Keolahragaan",
    category: "Keolahragaan",
    summary: "Pengaturan gizi, hidrasi, dan postur ergonomi agar stamina tetap prima saat menempuh asesmen praktik laboratorium yang panjang.",
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
    category: "Elektronika",
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
    category: "Informatika",
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
  {
    id: 8,
    title: "Panduan Membaca Wiring Diagram Kelistrikan Mobil",
    author: "Tim Otomotif",
    category: "Otomotif",
    summary: "Langkah sistematis membaca jalur arus utama, relay, fuse box, dan kode warna kabel pada sistem kelistrikan otomotif modern.",
    contentSections: [
      {
        title: "Pahami Kode Warna Kabel dan Simbol Standar",
        description: "Setiap produsen otomotif menggunakan kode warna standar (seperti B = Black/Ground, W = White, R = Red). Menguasai kode ini mempercepat pelacakan sumber arus tanpa salah potong kabel.",
      },
      {
        title: "Uji Tegangan dengan Multimeter dan Test Lamp",
        description: "Gunakan test lamp untuk verifikasi cepat adanya arus dan multimeter digital untuk mengukur drop tegangan pada sambungan konektor.",
      },
    ],
  },
  {
    id: 9,
    title: "Teknik Olah Tubuh & Pemanasan Penari Tradisional",
    author: "Tim Seni Tari",
    category: "Seni Tari",
    summary: "Latihan kelenturan sendi, penguatan otot inti, dan pernapasan ritmis untuk mendukung postur menari yang anggun dan bebas cedera.",
    contentSections: [
      {
        title: "Latihan Peregangan Dinamis Sendi dan Tulang Belakang",
        description: "Lakukan peregangan leher, bahu, pergelangan tangan, dan pinggul selama 10-15 menit sebelum mulai menari agar gerak wiraga mengalir luwes.",
      },
      {
        title: "Pernapasan Diafragma untuk Stabilitas Gerak",
        description: "Kuasai pernapasan diafragma agar tidak terengah-engah saat membawakan tarian bertempo cepat dan dinamis.",
      },
    ],
  },
  {
    id: 10,
    title: "Mengatasi Demam Panggung & Membangun Rasa Percaya Diri",
    author: "Bimbingan Konseling",
    category: "Bimbingan Konseling",
    summary: "Teknik pernapasan diafragma 4-7-8 dan afirmasi positif untuk mengendalikan kecemasan sebelum presentasi atau ujian praktik.",
    contentSections: [
      {
        title: "Metode Relaksasi Pernapasan 4-7-8",
        description: "Tarik napas melalui hidung selama 4 detik, tahan selama 7 detik, dan hembuskan perlahan lewat mulut selama 8 detik. Lakukan 3-4 siklus untuk menurunkan detak jantung yang berdebar kencang.",
      },
      {
        title: "Fokus pada Nilai Manfaat yang Disampaikan",
        description: "Alihkan fokus dari rasa takut dinilai orang lain menjadi semangat membagikan hasil karya dan proses belajarmu yang terbaik.",
      },
    ],
  },
];

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPaginationRange = (curr: number, total: number): (number | string)[] => {
    if (total <= 6) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (curr <= 3) {
      return [1, 2, 3, 4, '...right', total];
    }
    if (curr >= total - 2) {
      return [1, '...left', total - 3, total - 2, total - 1, total];
    }
    return [1, '...left', curr - 1, curr, curr + 1, '...right', total];
  };

  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-2 pt-6 pb-2">
      {/* Frameless Previous Arrow */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="w-8 h-8 rounded-full bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Halaman Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Numbered Page Buttons with Smart Dynamic Ellipsis Windowing */}
      {getPaginationRange(currentPage, totalPages).map((item, idx) => {
        if (typeof item === 'string') {
          const isLeft = item === '...left';
          return (
            <button
              key={`ellipsis-${idx}`}
              type="button"
              onClick={() => onPageChange(isLeft ? Math.max(1, currentPage - 3) : Math.min(totalPages, currentPage + 3))}
              title={isLeft ? "Lompat 3 Halaman ke Belakang" : "Lompat 3 Halaman ke Depan"}
              className="w-8 h-8 rounded-full text-xs font-semibold text-[#8C8C8C] hover:text-[#2563EB] hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              ...
            </button>
          );
        }

        const pageNum = item as number;
        const isActive = currentPage === pageNum;

        return (
          <button
            key={`page-${pageNum}`}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-full text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
              isActive
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Frameless Next Arrow */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="w-8 h-8 rounded-full bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Halaman Selanjutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function TipsBelajarSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1 space-y-6">
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-48 md:w-64" />
        <Skeleton className="h-10 w-full max-w-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-[#ECECEC] rounded-[10px] p-5 space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-9 w-full rounded-[6px]" />
              ))}
            </div>
          </div>
        </aside>
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </main>
  );
}

import { useAdminStore } from "@/lib/admin-store";
import { ArticleService } from "@/services/article.service";

function TipsBelajarContent() {
  const searchParams = useSearchParams();
  const queryIdStr = searchParams.get("id");
  const { articles: storeArticles } = useAdminStore();
  const [liveArticles, setLiveArticles] = useState<any[]>([]);

  useEffect(() => {
    ArticleService.fetchFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setLiveArticles(data);
      }
    });
  }, []);

  const allArticles: ArticleItem[] = useMemo(() => {
    const sourceList = liveArticles.length > 0 ? liveArticles : storeArticles;
    if (!sourceList || sourceList.length === 0) return TIPS_ARTICLES;

    return sourceList.map((art: any, idx: number) => {
      let sections: { title: string; description: string }[] = [];

      if (art.content) {
        // Split by double newline to get content blocks
        const rawBlocks = art.content.split('\n\n').map((b: string) => b.trim()).filter(Boolean);
        
        rawBlocks.forEach((block: string, bIdx: number) => {
          const lines = block.split('\n').map((l: string) => l.trim()).filter(Boolean);
          if (lines.length > 1) {
            // First line is section header, rest is description
            sections.push({
              title: lines[0].replace(/^#+\s*/, '').replace(/^\d+\.\s*/, ''),
              description: lines.slice(1).join('\n'),
            });
          } else {
            // Single paragraph
            sections.push({
              title: bIdx === 0 ? 'Poin Utama Pembahasan' : `Langkah ${bIdx + 1}`,
              description: block,
            });
          }
        });
      }

      return {
        id: art.id !== undefined ? art.id : (idx + 1),
        title: art.title,
        author: art.author || 'Tim Sitemsa',
        category: art.category || 'Umum',
        summary: art.excerpt || art.title,
        contentSections:
          sections.length > 0
            ? sections
            : [
                {
                  title: 'Penjelasan & Panduan Belajar',
                  description: art.content || art.excerpt || 'Belum ada detail pembahasan.',
                },
              ],
      };
    });
  }, [liveArticles, storeArticles]);

  const initialId = useMemo(() => {
    if (queryIdStr) {
      const match = allArticles.find(
        (a) => String(a.id) === String(queryIdStr) || a.id === parseInt(queryIdStr, 10)
      );
      if (match) return match.id;
    }
    return allArticles[0]?.id || 1;
  }, [queryIdStr, allArticles]);

  const [desktopSelectedId, setDesktopSelectedId] = useState<number | string>(initialId);
  const [mobileSelectedId, setMobileSelectedId] = useState<number | string | null>(
    queryIdStr ? initialId : null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobilePage, setMobilePage] = useState<number>(1);
  const [desktopPage, setDesktopPage] = useState<number>(1);

  // Sync selected article when query param changes
  useEffect(() => {
    if (queryIdStr) {
      const match = allArticles.find(
        (a) => String(a.id) === String(queryIdStr) || a.id === parseInt(queryIdStr, 10)
      );
      if (match) {
        setDesktopSelectedId(match.id);
        setMobileSelectedId(match.id);
      }
    }
  }, [queryIdStr, allArticles]);

  useEffect(() => {
    setMobilePage(1);
    setDesktopPage(1);
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter(
      (art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.category && art.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allArticles, searchQuery]);

  const desktopTotalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const mobileTotalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const desktopPaginatedArticles = useMemo(() => {
    const start = (desktopPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, desktopPage]);

  const mobilePaginatedArticles = useMemo(() => {
    const start = (mobilePage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, mobilePage]);

  const desktopActiveArticle = useMemo(() => {
    return allArticles.find((art) => String(art.id) === String(desktopSelectedId)) || allArticles[0] || TIPS_ARTICLES[0];
  }, [allArticles, desktopSelectedId]);

  const mobileActiveArticle = useMemo(() => {
    if (mobileSelectedId === null) return null;
    return allArticles.find((art) => String(art.id) === String(mobileSelectedId)) || null;
  }, [allArticles, mobileSelectedId]);

  // Hide mobile bottom navigation only when reading detail article on mobile
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileActiveArticle !== null) {
      document.documentElement.classList.add("hide-mobile-bottom-nav");
    } else {
      document.documentElement.classList.remove("hide-mobile-bottom-nav");
    }
    return () => {
      document.documentElement.classList.remove("hide-mobile-bottom-nav");
    };
  }, [mobileActiveArticle]);

  // Scroll to top immediately when switching or opening tips article
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [mobileSelectedId, desktopSelectedId]);

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-28 sm:pb-32 md:pb-16 w-full flex-1 space-y-6">
      {/* DESKTOP VIEW (100% ORIGINAL 2-COLUMN UNTOUCHED WITH PAGINATION) */}
      <div className="hidden lg:block space-y-6">
        <section className="space-y-4 max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#2E2D2D] tracking-tight">
            Tips Belajar
          </h1>
        </section>

        <section className="grid grid-cols-12 gap-8 items-start pt-2">
          {/* Left Sidebar List */}
          <aside className="col-span-4 space-y-5 sticky top-28">
            <div className="bg-white border border-[#ECECEC] rounded-[10px] p-5 space-y-4 shadow-none">
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
                  className="w-full bg-[#FAFAFA] border border-[#ECECEC] rounded-[8px] pl-9 pr-3 py-2 text-xs text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all duration-200 shadow-none"
                />
              </div>

              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-[#2E2D2D]">Daftar Tips Belajar</h3>
              </div>

              <nav className="space-y-1">
                {filteredArticles.length === 0 ? (
                  <div className="py-4 text-xs text-[#737373]">
                    Tidak ada tips yang cocok
                  </div>
                ) : (
                  desktopPaginatedArticles.map((art) => {
                    const isActive = desktopActiveArticle.id === art.id;
                    return (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => setDesktopSelectedId(art.id)}
                        className={`block w-full text-left py-2.5 px-3 text-xs transition-colors duration-200 cursor-pointer ${
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

              {/* Desktop Sidebar Pagination */}
              {desktopTotalPages > 1 && (
                <div className="pt-2 border-t border-[#ECECEC]">
                  <Pagination
                    currentPage={desktopPage}
                    totalPages={desktopTotalPages}
                    onPageChange={setDesktopPage}
                  />
                </div>
              )}
            </div>
          </aside>

          {/* Right Main Article View (100% Original UI Layout) */}
          <article className="col-span-8 space-y-8">
            <header className="space-y-2">
              <h2 className="text-2xl md:text-4xl font-bold text-[#2E2D2D] leading-tight tracking-tight">
                {desktopActiveArticle.title}
              </h2>
            </header>

            <div className="space-y-6">
              {desktopActiveArticle.contentSections.map((sec, idx) => (
                <section key={idx} className="space-y-2">
                  <h3 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
                    {sec.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line">
                    {sec.description}
                  </p>
                </section>
              ))}
            </div>
          </article>
        </section>
      </div>

      {/* MOBILE VIEW (CARDS LANDING LIST WITH PAGINATION -> DETAIL VIEW) */}
      <div className="lg:hidden">
        {mobileActiveArticle ? (
          /* MOBILE DETAIL VIEW WITH ICON-ONLY BACK BUTTON */
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="sticky top-20 z-30 pt-1 pb-1">
              <button
                type="button"
                onClick={() => setMobileSelectedId(null)}
                className="w-9 h-9 rounded-full bg-white/90 border border-[#ECECEC] text-[#2E2D2D] hover:text-[#2563EB] hover:bg-white shadow-2xs transition-all cursor-pointer flex items-center justify-center"
                aria-label="Kembali"
                title="Kembali"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            <article className="space-y-6 pt-1">
              <header className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2E2D2D] leading-tight tracking-tight">
                  {mobileActiveArticle.title}
                </h1>
              </header>

              <div className="space-y-6 pt-2">
                {mobileActiveArticle.contentSections.map((sec, idx) => (
                  <section key={idx} className="space-y-2">
                    <h3 className="text-base font-bold text-[#2E2D2D]">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-[#4A4A4A] leading-relaxed whitespace-pre-line">
                      {sec.description}
                    </p>
                  </section>
                ))}
              </div>
            </article>
          </div>
        ) : (
          /* MOBILE LANDING VIEW: CARDS GRID (5 PER PAGE WITH PAGINATION) */
          <div className="space-y-6 animate-in fade-in duration-200">
            <header className="space-y-4">
              <h1 className="text-2xl font-bold text-[#2E2D2D] tracking-tight">
                Tips Belajar
              </h1>

              {/* Flat Search Bar (No shadow!) */}
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
                  className="w-full bg-[#FAFAFA] border border-[#ECECEC] rounded-[10px] pl-9 pr-3 py-2.5 text-xs text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all duration-200 shadow-none"
                />
              </div>
            </header>

            {/* Mobile Cards List */}
            <div className="space-y-4 pt-1">
              {mobilePaginatedArticles.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#737373]">
                  Tidak ada tips yang cocok
                </div>
              ) : (
                mobilePaginatedArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setMobileSelectedId(art.id)}
                    className="p-3 rounded-[14px] bg-white border border-[#ECECEC] active:border-[#2563EB] active:bg-slate-50 transition-all duration-200 cursor-pointer space-y-2"
                  >
                    <span className="inline-block text-[11px] font-semibold text-[#2563EB] bg-[#E8E7FF] px-2.5 py-0.5 rounded-[4px]">
                      {art.author}
                    </span>

                    <h3 className="text-base font-semibold text-[#2E2D2D] leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-[#737373] line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Mobile Cards Pagination (5 cards per page) */}
            <Pagination
              currentPage={mobilePage}
              totalPages={mobileTotalPages}
              onPageChange={(p) => setMobilePage(p)}
            />
          </div>
        )}
      </div>
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
    </div>
  );
}
