'use client';

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  HelpCircleIcon,
  Copy01Icon,
  Tick01Icon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "@hugeicons/core-free-icons";
import { ArrowLeft, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

interface ArticleSection {
  title: string;
  description: string;
  callout?: string;
}

interface DocArticle {
  id: string;
  category: "Modul & Pembelajaran" | "Kuis & Barcode" | "Profil & Nilai";
  title: string;
  summary: string;
  screenshotUrl?: string;
  sections: ArticleSection[];
}

interface FaqItem {
  question: string;
  answer: string;
}

const ITEMS_PER_PAGE = 5;

const TUTORIAL_ARTICLES: DocArticle[] = [
  {
    id: "siswa-alur-pembelajaran",
    category: "Modul & Pembelajaran",
    title: "Alur Pembelajaran & Navigasi Modul Sitemsa",
    summary: "Panduan langkah demi langkah cara menavigasi modul materi, menonton video tutorial, dan mempraktikkan panduan kerja.",
    screenshotUrl: "/images/docs/nav_tutorial.jpg",
    sections: [
      {
        title: "Pilih Materi dari Katalog Pembelajaran",
        description: "Buka halaman Materi melalui menu utama navigasi, lalu pilih materi vokasi sesuai bidang studi milikmu (Informatika, Elektronika, Seni Tari, Otomotif, dll).",
      },
      {
        title: "Gunakan Daftar Isi Pembahasan di Sidebar",
        description: "Di sebelah kanan layar desktop atau bagian atas mobile, gunakan widget 'Daftar Isi Pembahasan' untuk melompat secara instan ke bagian sub-materi tertentu.",
      },
      {
        title: "Simak Video Tutorial & Langkah Kerja",
        description: "Tonton video simulasi interaktif yang disediakan oleh pengajar, lalu ikuti panduan langkah kerja praktik secara bertahap.",
      },
    ],
  },
  {
    id: "siswa-kuis-interaktif",
    category: "Kuis & Barcode",
    title: "Cara Mengikuti Kuis: Barcode, Link Eksternal & Internal",
    summary: "Penjelasan lengkap mengenai 3 jenis metode uji pemahaman yang disediakan pengajar di Sitemsa.",
    screenshotUrl: "/images/docs/barcode_tutorial.jpg",
    sections: [
      {
        title: "Klik Tombol 'Mulai Uji Pemahaman'",
        description: "Temukan kartu 'Uji Pemahaman' pada sidebar kanan di halaman materi, kemudian klik tombol utama berwarna biru.",
      },
      {
        title: "Memahami 3 Tipe Kuis",
        description: "Sitemsa mendukung 3 sumber kuis interaktif dari pengajar: 1. Barcode/QR Code Modal (Kahoot/Quizizz), 2. Konfirmasi Link Eksternal (Google Forms), dan 3. Kuis Sitemsa.",
      },
      {
        title: "Memindai Barcode / Membuka Link Kuis",
        description: "Gunakan kamera smartphone milikmu untuk memindai Barcode di layar, atau klik tombol 'Salin Link' / 'Buka Kuis Direct' jika ingin membukanya langsung di perangkat komputer.",
      },
    ],
  },
  {
    id: "siswa-riwayat-dan-nilai",
    category: "Profil & Nilai",
    title: "Melacak Riwayat Belajar & Rekap Nilai Kuis",
    summary: "Cara melihat daftar modul yang telah selesai dipelajari beserta statistik capaian nilai kuis.",
    sections: [
      {
        title: "Buka Halaman Profil Siswa",
        description: "Klik avatar foto profilmu di navbar bagian atas kanan, lalu pilih menu 'Profil Saya' atau klik tombol 'Riwayat & Nilai Kuis'.",
      },
      {
        title: "Pilih Tab 'Riwayat Belajar & Nilai'",
        description: "Di dalam modal profil, pindah ke tab kedua untuk melihat 3 daftar modul terakhir yang kamu pelajari dan skor kuis yang berhasil kamu capai.",
      },
    ],
  },
  {
    id: "siswa-edit-profil",
    category: "Profil & Nilai",
    title: "Cara Mengubah Foto & Informasi Profil Siswa",
    summary: "Petunjuk memperbarui data diri, foto avatar, serta kata sandi akun siswa di Sitemsa.",
    sections: [
      {
        title: "Masuk ke Jendela Modal Profil",
        description: "Klik foto avatar di navbar kanan atas lalu pilih opsi 'Profil Saya'.",
      },
      {
        title: "Unggah Foto Baru atau Perbarui Informasi",
        description: "Klik tombol ikon kamera untuk mengunggah foto avatar baru, kemudian simpan perubahan dengan mengklik tombol 'Simpan Perubahan'.",
      },
    ],
  },
  {
    id: "siswa-bantu-kendala",
    category: "Modul & Pembelajaran",
    title: "Mengatasi Kendala Koneksi & Gagal Muat Media",
    summary: "Tips cepat penanganan masalah saat gambar skema atau video tutorial mengalami lambat muat di ruang kelas.",
    sections: [
      {
        title: "Muat Ulang Halaman Materi",
        description: "Tekan tombol muat ulang di browser milikmu atau periksa apakah sambungan Wi-Fi laboratorium aktif.",
      },
      {
        title: "Manfaatkan Opsi Lampiran Dokumen",
        description: "Jika video simulasi terkendala, kamu dapat mengunduh lampiran file PDF panduan yang disediakan pengajar pada widget bagian bawah.",
      },
    ],
  },
  {
    id: "siswa-sertifikat-vokasi",
    category: "Profil & Nilai",
    title: "Panduan Pengunduhan Sertifikat & Rekap Capaian",
    summary: "Petunjuk mencetak sertifikat apresiasi setelah menyelesaikan seluruh modul bidang vokasi.",
    sections: [
      {
        title: "Penyelesaian 100% Progres Pembelajaran",
        description: "Pastikan seluruh modul dan kuis evaluasi pada satu bidang studi telah diselesaikan dengan skor tuntas.",
      },
      {
        title: "Unduh Sertifikat Digital",
        description: "Buka tab Riwayat Belajar di modal profil, lalu klik tombol 'Unduh Sertifikat' berbentuk format PDF resmi.",
      },
    ],
  },
];

const FAQ_LIST: FaqItem[] = [
  {
    question: "Mengapa Barcode QR Code kuis tidak dapat dipindai?",
    answer: "Hal ini dapat terjadi akibat pencahayaan layar proyektor yang terlalu terang atau koneksi internet yang lambat saat memuat gambar QR Code.",
  },
  {
    question: "Apa solusi alternatif jika scan QR Code gagal?",
    answer: "Di bawah gambar Barcode pada modal, tersedia tombol 'Salin Link Kuis Direct'. Kamu dapat menyalin tautan tersebut dan mengkliknya langsung untuk bergabung ke kuis.",
  },
  {
    question: "Apakah kuis Sitemsa bisa dikerjakan di smartphone?",
    answer: "Ya, seluruh tampilan Sitemsa dan modal kuis sudah dioptimalkan penuh untuk layar hp maupun komputer tablet.",
  },
  {
    question: "Bagaimana cara mereset progres belajar modul?",
    answer: "Progres modul diperbarui secara otomatis ketika kamu membaca materi hingga selesai. Kamu dapat mengulang membaca modul kapan saja melalui katalog materi.",
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

  return (
    <div className="flex items-center justify-center gap-2 pt-6 pb-2">
      {/* Frameless Previous Arrow */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-8 h-8 rounded-full bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Halaman Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Numbered Page Buttons - Active is 100% Circle Filled */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isActive = currentPage === page;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-full text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
              isActive
                ? "bg-[#2563EB] text-white shadow-2xs"
                : "bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Frameless Next Arrow */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-8 h-8 rounded-full bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Halaman Selanjutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [desktopActiveArticleId, setDesktopActiveArticleId] = useState<string>("siswa-alur-pembelajaran");
  const [mobileSelectedId, setMobileSelectedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | null>(null);

  const [mobilePage, setMobilePage] = useState<number>(1);
  const [desktopPage, setDesktopPage] = useState<number>(1);

  useEffect(() => {
    setMobilePage(1);
    setDesktopPage(1);
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    return TUTORIAL_ARTICLES.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

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
    return (
      TUTORIAL_ARTICLES.find((art) => art.id === desktopActiveArticleId) || TUTORIAL_ARTICLES[0]
    );
  }, [desktopActiveArticleId]);

  const mobileActiveArticle = useMemo(() => {
    if (!mobileSelectedId || mobileSelectedId === "faq-section") return null;
    return TUTORIAL_ARTICLES.find((art) => art.id === mobileSelectedId) || null;
  }, [mobileSelectedId]);

  const isDesktopFaqActive = desktopActiveArticleId === "faq-section";
  const isMobileFaqActive = mobileSelectedId === "faq-section";

  const handleCopyArticleLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1 space-y-6">
        {/* DESKTOP VIEW (100% ORIGINAL 2-COLUMN UNTOUCHED WITH PAGINATION) */}
        <div className="hidden lg:block space-y-6">
          <section className="space-y-4 max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#2E2D2D] tracking-tight">
              Dokumentasi &amp; Panduan Siswa
            </h1>
          </section>

          <section className="grid grid-cols-12 gap-8 items-start pt-2">
            {/* Left Sidebar Navigation */}
            <aside className="col-span-4 space-y-5 sticky top-28">
              <div className="bg-white border border-[#ECECEC] rounded-[10px] p-5 space-y-5 shadow-none">
                <div className="relative w-full">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]"
                  />
                  <input
                    type="text"
                    placeholder="Cari panduan (misal: barcode, profil)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#ECECEC] rounded-[8px] pl-9 pr-3 py-2 text-xs text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all duration-200 shadow-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-[#2E2D2D]">Daftar Panduan</h3>
                  </div>

                  <nav className="space-y-1">
                    {filteredArticles.length === 0 ? (
                      <div className="py-4 text-xs text-[#737373]">
                        Tidak ada panduan yang cocok
                      </div>
                    ) : (
                      filteredArticles.map((art) => {
                        const isActive = !isDesktopFaqActive && desktopActiveArticleId === art.id;
                        return (
                          <button
                            key={art.id}
                            type="button"
                            onClick={() => {
                              setDesktopActiveArticleId(art.id);
                              setFeedback(null);
                            }}
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
                </div>

                <div className="space-y-2 pt-2 border-t border-[#ECECEC]">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-[#2E2D2D]">Tanya Jawab (FAQ)</h3>
                  </div>

                  <nav className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDesktopActiveArticleId("faq-section");
                        setFeedback(null);
                      }}
                      className={`block w-full text-left py-2.5 px-3 text-xs transition-colors duration-200 cursor-pointer ${
                        isDesktopFaqActive
                          ? "text-[#2563EB] font-semibold border-l-2 border-[#2563EB] bg-[#F6F5FF]"
                          : "text-[#737373] font-medium hover:text-[#2E2D2D] border-l-2 border-transparent"
                      }`}
                    >
                      Pertanyaan Sering Diajukan
                    </button>
                  </nav>
                </div>
              </div>
            </aside>

            {/* Right Main Article View */}
            <article className="col-span-8 space-y-8">
              {isDesktopFaqActive ? (
                <div className="space-y-6">
                  <header className="space-y-2">
                    <h2 className="text-2xl md:text-4xl font-bold text-[#2E2D2D] leading-tight tracking-tight">
                      Tanya Jawab Umum (FAQ)
                    </h2>
                  </header>

                  <div className="space-y-4">
                    {FAQ_LIST.map((faq, fIdx) => (
                      <section key={fIdx} className="space-y-2">
                        <h3 className="text-sm md:text-base font-semibold text-[#2E2D2D]">
                          {faq.question}
                        </h3>
                        <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                          {faq.answer}
                        </p>
                      </section>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <header className="space-y-2">
                    <h2 className="text-2xl md:text-4xl font-bold text-[#2E2D2D] leading-tight tracking-tight">
                      {desktopActiveArticle.title}
                    </h2>
                  </header>

                  {desktopActiveArticle.screenshotUrl && (
                    <figure>
                      <div className="relative w-full h-[280px] md:h-[380px] rounded-[10px] overflow-hidden border border-[#ECECEC] bg-[#FAFAFA]">
                        <Image
                          src={desktopActiveArticle.screenshotUrl}
                          alt={desktopActiveArticle.title}
                          fill
                          unoptimized
                          className="object-cover"
                          priority
                        />
                      </div>
                    </figure>
                  )}

                  <div className="space-y-6">
                    {desktopActiveArticle.sections.map((sec, idx) => (
                      <section key={idx} className="space-y-2">
                        <h3 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
                          {sec.title}
                        </h3>
                        <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                          {sec.description}
                        </p>
                      </section>
                    ))}
                  </div>
                </div>
              )}

              <footer className="pt-6 border-t border-[#ECECEC] flex flex-wrap items-center justify-between gap-4 text-xs">
                <button
                  type="button"
                  onClick={handleCopyArticleLink}
                  className="inline-flex items-center gap-1.5 bg-[#FAFAFA] hover:bg-[#F6F5FF] border border-[#ECECEC] text-[#2E2D2D] px-3.5 py-2 rounded-[6px] font-medium transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={copiedLink ? Tick01Icon : Copy01Icon} size={14} className="text-[#2563EB]" />
                  <span>{copiedLink ? "Link Tersalin!" : "Bagikan Panduan Ini"}</span>
                </button>

                <div className="flex items-center gap-3 text-[#737373]">
                  <span>Apakah panduan ini membantu?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFeedback("helpful")}
                      className={`p-2 rounded-[6px] border transition-all cursor-pointer ${
                        feedback === "helpful"
                          ? "bg-[#E8E7FF] text-[#2563EB] border-[#2563EB]"
                          : "bg-white border-[#ECECEC] hover:bg-[#F6F5FF]"
                      }`}
                      aria-label="Bermanfaat"
                    >
                      <HugeiconsIcon icon={ThumbsUpIcon} size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedback("not_helpful")}
                      className={`p-2 rounded-[6px] border transition-all cursor-pointer ${
                        feedback === "not_helpful"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "bg-white border-[#ECECEC] hover:bg-[#F6F5FF]"
                      }`}
                      aria-label="Kurang Bermanfaat"
                    >
                      <HugeiconsIcon icon={ThumbsDownIcon} size={14} />
                    </button>
                  </div>
                </div>
              </footer>
            </article>
          </section>
        </div>

        {/* MOBILE VIEW (CARDS LANDING LIST WITH 5-CARD PAGINATION -> DETAIL VIEW) */}
        <div className="lg:hidden">
          {mobileSelectedId !== null ? (
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

              {isMobileFaqActive ? (
                <div className="space-y-6 pt-1">
                  <header className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#2E2D2D] leading-tight tracking-tight">
                      Tanya Jawab Umum (FAQ)
                    </h1>
                  </header>

                  <div className="space-y-6 pt-2">
                    {FAQ_LIST.map((faq, fIdx) => (
                      <section key={fIdx} className="space-y-2">
                        <h3 className="text-base font-bold text-[#2E2D2D]">
                          {faq.question}
                        </h3>
                        <p className="text-xs text-[#4A4A4A] leading-relaxed">
                          {faq.answer}
                        </p>
                      </section>
                    ))}
                  </div>
                </div>
              ) : mobileActiveArticle ? (
                <article className="space-y-6 pt-1">
                  <header className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#2E2D2D] leading-tight tracking-tight">
                      {mobileActiveArticle.title}
                    </h1>
                  </header>

                  {mobileActiveArticle.screenshotUrl && (
                    <figure>
                      <div className="relative w-full h-[240px] rounded-[12px] overflow-hidden border border-[#ECECEC] bg-[#FAFAFA]">
                        <Image
                          src={mobileActiveArticle.screenshotUrl}
                          alt={mobileActiveArticle.title}
                          fill
                          unoptimized
                          className="object-cover"
                          priority
                        />
                      </div>
                    </figure>
                  )}

                  <div className="space-y-6 pt-2">
                    {mobileActiveArticle.sections.map((sec, idx) => (
                      <section key={idx} className="space-y-2">
                        <h3 className="text-base font-bold text-[#2E2D2D]">
                          {sec.title}
                        </h3>
                        <p className="text-xs text-[#4A4A4A] leading-relaxed">
                          {sec.description}
                        </p>
                      </section>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>
          ) : (
            /* MOBILE LANDING VIEW: CARDS GRID (5 PER PAGE WITH PAGINATION) */
            <div className="space-y-6 animate-in fade-in duration-200">
              <header className="space-y-4">
                <h1 className="text-2xl font-bold text-[#2E2D2D] tracking-tight">
                  Dokumentasi &amp; Panduan Siswa
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
                    placeholder="Cari panduan (misal: barcode, profil)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#ECECEC] rounded-[10px] pl-9 pr-3 py-2.5 text-xs text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all duration-200 shadow-none"
                  />
                </div>
              </header>

              {/* Panduan Mobile Cards List */}
              <div className="space-y-4 pt-1">
                <h2 className="text-base font-bold text-[#2E2D2D]">Panduan Penggunaan</h2>

                {mobilePaginatedArticles.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#737373]">
                    Tidak ada panduan yang cocok
                  </div>
                ) : (
                  mobilePaginatedArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setMobileSelectedId(art.id)}
                      className="p-5 rounded-[16px] bg-white border border-[#ECECEC] active:border-[#2563EB] active:bg-slate-50 transition-all duration-200 cursor-pointer space-y-2.5"
                    >
                      <span className="inline-block text-[11px] font-semibold text-[#2563EB] bg-[#E8E7FF] px-2.5 py-0.5 rounded-[4px]">
                        {art.category}
                      </span>

                      <h3 className="text-base font-bold text-[#2E2D2D] leading-snug">
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

              {/* FAQ Mobile Card (Placed below pagination with right arrow indicator) */}
              <div className="pt-2">
                <div
                  onClick={() => setMobileSelectedId("faq-section")}
                  className="p-5 rounded-[16px] bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-100 hover:border-[#2563EB] active:border-[#2563EB] transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div>
                    <h3 className="text-sm font-bold text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors">
                      Tanya Jawab Umum (FAQ)
                    </h3>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Lihat jawaban pertanyaan seputar Sitemsa
                    </p>
                  </div>

                  {/* Right Arrow Indicator */}
                  <ChevronRight className="w-5 h-5 text-[#2563EB] group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
