'use client';

import { useState, useMemo } from "react";
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
        callout: "Tips: Sidebar daftar isi akan otomatis menandai bagian materi yang sedang aktif saat kamu melakukan scroll layar.",
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
        description: "Sitemsa mendukung 3 sumber kuis interaktif dari pengajar: 1. Barcode/QR Code Modal (Kahoot/Quizizz), 2. Konfirmasi Link Eksternal (Google Forms), dan 3. Kuis Native Sitemsa.",
        callout: "Jika pengajar memilih Barcode Modal, jendela pop-up QR Code akan muncul di layar tanpa perlu membuka tab baru.",
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

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticleId, setActiveArticleId] = useState<string>("siswa-alur-pembelajaran");
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | null>(null);

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    return TUTORIAL_ARTICLES.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  // Currently selected active article
  const activeArticle = useMemo(() => {
    return (
      TUTORIAL_ARTICLES.find((art) => art.id === activeArticleId) || TUTORIAL_ARTICLES[0]
    );
  }, [activeArticleId]);

  const isFaqActive = activeArticleId === "faq-section";

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
        {/* Minimal Header (Title Only) */}
        <section className="space-y-4 max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#2E2D2D] tracking-tight">
            Dokumentasi &amp; Panduan Siswa
          </h1>

          {/* Minimal Search Bar */}
          <div className="relative max-w-lg">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]"
            />
            <input
              type="text"
              placeholder="Cari panduan (misal: barcode kuis, alur modul, profil)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#ECECEC] rounded-[8px] pl-10 pr-4 py-2 text-xs md:text-sm text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#0400F4] focus:bg-white transition-all duration-200"
            />
          </div>
        </section>

        {/* Documentation Content Area (2-Column Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left Sidebar Navigation (4 Columns) */}
          <aside className="lg:col-span-4 space-y-5 sticky top-28">
            <div className="bg-white border border-[#ECECEC] rounded-[10px] p-5 space-y-6">
              {/* 1. Daftar Panduan */}
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
                      const isActive = !isFaqActive && activeArticleId === art.id;
                      return (
                        <button
                          key={art.id}
                          type="button"
                          onClick={() => {
                            setActiveArticleId(art.id);
                            setFeedback(null);
                          }}
                          className={`block w-full text-left py-2 px-3 text-xs transition-colors duration-200 cursor-pointer ${
                            isActive
                              ? "text-[#0400F4] font-semibold border-l-2 border-[#0400F4] bg-[#F6F5FF]"
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

              {/* 2. Terpisah: Tanya Jawab (FAQ) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-[#2E2D2D]">Tanya Jawab (FAQ)</h3>
                </div>

                <nav className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveArticleId("faq-section");
                      setFeedback(null);
                    }}
                    className={`block w-full text-left py-2 px-3 text-xs transition-colors duration-200 cursor-pointer ${
                      isFaqActive
                        ? "text-[#0400F4] font-semibold border-l-2 border-[#0400F4] bg-[#F6F5FF]"
                        : "text-[#737373] font-medium hover:text-[#2E2D2D] border-l-2 border-transparent"
                    }`}
                  >
                    Pertanyaan Sering Diajukan
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          {/* Right Main Article View — Plain Canvas (No Outer Frame Cards) */}
          <article className="lg:col-span-8 space-y-8">
            {isFaqActive ? (
              /* FAQ Section View (Canvas Direct) */
              <div className="space-y-6">
                <header className="space-y-2">
                  <h2 className="text-xl md:text-3xl font-semibold text-[#2E2D2D] leading-tight">
                    Tanya Jawab Umum (FAQ)
                  </h2>
                  <p className="text-xs md:text-sm text-[#737373] leading-relaxed">
                    Jawaban atas pertanyaan yang paling sering diajukan mengenai penggunaan platform Sitemsa.
                  </p>
                </header>

                <div className="space-y-4">
                  {FAQ_LIST.map((faq, fIdx) => (
                    <section key={fIdx} className="space-y-2">
                      <h3 className="text-sm md:text-base font-semibold text-[#0400F4] flex items-center gap-2">
                        <HugeiconsIcon icon={HelpCircleIcon} size={16} />
                        <span>{faq.question}</span>
                      </h3>
                      <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed pl-6">
                        {faq.answer}
                      </p>
                    </section>
                  ))}
                </div>
              </div>
            ) : (
              /* Standard Article View (Canvas Direct) */
              <div className="space-y-8">
                {/* Article Header */}
                <header className="space-y-2">
                  <h2 className="text-xl md:text-3xl font-semibold text-[#2E2D2D] leading-tight">
                    {activeArticle.title}
                  </h2>
                  <p className="text-xs md:text-sm text-[#737373] leading-relaxed">
                    {activeArticle.summary}
                  </p>
                </header>

                {/* Direct Screenshot Image Canvas */}
                {activeArticle.screenshotUrl && (
                  <figure>
                    <div className="relative w-full h-[280px] md:h-[380px] rounded-[10px] overflow-hidden border border-[#ECECEC] bg-[#FAFAFA]">
                      <Image
                        src={activeArticle.screenshotUrl}
                        alt={activeArticle.title}
                        fill
                        unoptimized
                        className="object-cover"
                        priority
                      />
                    </div>
                  </figure>
                )}

                {/* Standardized Sections Canvas */}
                <div className="space-y-6">
                  {activeArticle.sections.map((sec, idx) => (
                    <section key={idx} className="space-y-2">
                      <h3 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
                        {sec.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                        {sec.description}
                      </p>

                      {sec.callout && (
                        <div className="bg-[#F4EFFF] border-l-4 border-[#0400F4] rounded-r-[8px] p-4 text-xs md:text-sm text-[#2E2D2D] font-medium leading-relaxed my-3">
                          {sec.callout}
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions & Feedback */}
            <footer className="pt-6 border-t border-[#ECECEC] flex flex-wrap items-center justify-between gap-4 text-xs">
              <button
                type="button"
                onClick={handleCopyArticleLink}
                className="inline-flex items-center gap-1.5 bg-[#FAFAFA] hover:bg-[#F6F5FF] border border-[#ECECEC] text-[#2E2D2D] px-3.5 py-2 rounded-[6px] font-medium transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={copiedLink ? Tick01Icon : Copy01Icon} size={14} className="text-[#0400F4]" />
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
                        ? "bg-[#E8E7FF] text-[#0400F4] border-[#0400F4]"
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
      </main>

      <Footer />
    </div>
  );
}
