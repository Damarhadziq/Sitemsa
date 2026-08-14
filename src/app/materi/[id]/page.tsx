'use client';

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  UserIcon,
  File01Icon,
  Download01Icon,
  Book01Icon,
  ComputerIcon,
  Copy01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

interface MaterialDetail {
  id: number;
  subject: string;
  title: string;
  level: "Pemula" | "Menengah" | "Mahir";
  duration: string;
  author: string;
  updatedAt: string;
  icon: IconSvgElement;
  topics: string[];
  description: string;
  imageUrl: string;
  imageCaption: string;
  contentSections: {
    id: string;
    title: string;
    paragraphs: string[];
    callout?: string;
    codeSnippet?: {
      language: string;
      code: string;
    };
  }[];
  attachment: {
    fileName: string;
    fileSize: string;
  };
  prevMaterial?: { id: number; title: string };
  nextMaterial?: { id: number; title: string };
}

const MATERIAL_DATABASE: Record<number, MaterialDetail> = {
  1: {
    id: 1,
    subject: "Informatika",
    title: "Variabel, Tipe Data & Operasi Logika",
    level: "Pemula",
    duration: "25 Menit",
    author: "Pak Joko Supriyanto, S.Kom",
    updatedAt: "14 Agustus 2026",
    icon: ComputerIcon,
    topics: ["Variabel", "Tipe Data Primitif", "Operator Logika"],
    description: "Pelajari konsep penyimpanan data dan eksekusi operasi logika dasar dalam pemrograman.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 1.1: Eksekusi Kode dan Penyimpanan Variabel dalam Memori Komputer.",
    contentSections: [
      {
        id: "pengantar",
        title: "1. Pengenalan Variabel & Memori",
        paragraphs: [
          "Dalam dunia pemrograman, variabel dapat dianalogikan sebagai sebuah wadah atau kotak berlabel di dalam memori komputer. Setiap wadah memiliki nama unik dan nilai yang disimpan di dalamnya dapat diakses maupun diubah selama program berjalan.",
          "Memahami cara kerja variabel sangat penting karena seluruh manipulasi data — mulai dari angka sederhana, teks nama pengguna, hingga kalkulasi kompleks — bergantung pada deklarasi variabel yang benar.",
        ],
        callout: "Prinsip Utama: Deklarasikan variabel dengan nama yang deskriptif dan mencerminkan isi datanya agar kode mudah dibaca oleh tim pengembangan.",
      },
      {
        id: "tipe-data",
        title: "2. Tipe Data Primitif Dasar",
        paragraphs: [
          "Tipe data menentukan jenis nilai yang dapat disimpan oleh sebuah variabel serta operasi apa saja yang dapat dilakukan terhadap variabel tersebut. Pada sebagian besar bahasa pemrograman modern, terdapat tipe data primitif utama:",
          "Integer (bilangan bulat seperti 10, -5), Float/Double (bilangan desimal seperti 3.14), String (kumpulan karakter teks seperti 'Sitemsa'), serta Boolean (nilai kebenaran true atau false).",
        ],
        codeSnippet: {
          language: "JavaScript / TypeScript",
          code: `// Deklarasi Variabel & Tipe Data Dasar
let namaSiswa = "Budi Pratama"; // String
let nilaiUjian = 95;             // Integer
let ipk = 3.85;                  // Float
let isLulus = true;              // Boolean

console.log(\`Siswa \${namaSiswa} memperoleh nilai \${nilaiUjian}\`);`,
        },
      },
      {
        id: "operasi-logika",
        title: "3. Operator Logika & Tabel Kebenaran",
        paragraphs: [
          "Operator logika digunakan untuk menghubungkan dua atau lebih ekspresi relasional sehingga menghasilkan satu nilai kebenaran Boolean. Tiga operator logika dasar yang wajib dikuasai adalah AND (&&), OR (||), dan NOT (!).",
          "Operator AND hanya bernilai true jika kedua kondisi bernilai true. Operator OR bernilai true jika minimal salah satu kondisi true, sedangkan operator NOT membalikkan nilai kebenaran.",
        ],
        callout: "Tips Ujian: Pastikan Anda selalu mengevaluasi kondisi di dalam kurung terlebih dahulu sebelum menerapkan operator NOT.",
      },
    ],
    attachment: {
      fileName: "Modul_Variabel_dan_Tipe_Data_Informatika.pdf",
      fileSize: "2.4 MB",
    },
    prevMaterial: { id: 14, title: "Nutrisi Seimbang & Hidrasi Atlet" },
    nextMaterial: { id: 2, title: "Struktur Percabangan (If-Else & Switch)" },
  },
  2: {
    id: 2,
    subject: "Informatika",
    title: "Struktur Percabangan (If-Else & Switch)",
    level: "Pemula",
    duration: "30 Menit",
    author: "Bu Rina Wati, M.T",
    updatedAt: "12 Agustus 2026",
    icon: ComputerIcon,
    topics: ["Kondisi If-Else", "Nested If", "Switch Case"],
    description: "Kuasai pengambilan keputusan dalam kode berdasarkan kondisi logika yang dievaluasi.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 2.1: Alur Percabangan Keputusan dalam Algoritma.",
    contentSections: [
      {
        id: "pengantar",
        title: "1. Pengambilan Keputusan dalam Program",
        paragraphs: [
          "Komputer dapat membuat keputusan pintar karena adanya alur percabangan. Dengan struktur percabangan, kode dapat mengeksekusi blok instruksi berbeda tergantung apakah suatu kondisi terpenuhi atau tidak.",
        ],
      },
      {
        id: "if-else",
        title: "2. Pernyataan If-Else & Else-If",
        paragraphs: [
          "Pernyataan If mengevaluasi ekspresi boolean. Jika bernilai true, blok kode di dalam If dieksekusi. Jika false, program berpindah ke blok Else.",
        ],
        codeSnippet: {
          language: "TypeScript",
          code: `let nilai = 85;

if (nilai >= 90) {
  console.log("Grade: A (Sangat Baik)");
} else if (nilai >= 80) {
  console.log("Grade: B (Baik)");
} else {
  console.log("Grade: C (Cukup)");
}`,
        },
      },
    ],
    attachment: {
      fileName: "Modul_Struktur_Percabangan_Algoritma.pdf",
      fileSize: "1.8 MB",
    },
    prevMaterial: { id: 1, title: "Variabel, Tipe Data & Operasi Logika" },
    nextMaterial: { id: 3, title: "Perulangan & Iterasi Algoritma" },
  },
};

const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case "Pemula":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold";
    case "Menengah":
      return "bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold";
    case "Mahir":
      return "bg-purple-50 text-purple-700 border border-purple-200/60 font-semibold";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200 font-semibold";
  }
};

export default function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const materialId = parseInt(resolvedParams.id, 10) || 1;
  const material = MATERIAL_DATABASE[materialId] || MATERIAL_DATABASE[1];

  const [activeSection, setActiveSection] = useState(material.contentSections[0]?.id || "pengantar");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [materialId]);

  // Scroll Sync Active Section Observer
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    material.contentSections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading, material.contentSections]);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -110;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1">
        {/* Top Header Navigation: Icon-only Back Button + Breadcrumb */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-xs">
          <Link
            href="/materi"
            aria-label="Kembali ke Materi"
            className="w-8 h-8 rounded-[6px] bg-white border border-[#ECECEC] text-[#2E2D2D] hover:text-[#0400F4] hover:bg-[#F6F5FF] hover:border-[#0400F4]/40 flex items-center justify-center transition-all duration-200 shrink-0"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </Link>

          <nav className="flex items-center gap-2 text-[#737373] overflow-x-auto py-1">
            <Link href="/" className="hover:text-[#0400F4] transition-colors shrink-0">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/materi" className="hover:text-[#0400F4] transition-colors shrink-0">
              Materi
            </Link>
            <span>/</span>
            <span className="text-[#2E2D2D] font-medium truncate max-w-[220px] md:max-w-none">
              {material.title}
            </span>
          </nav>
        </div>

        {/* Skeleton Loading State */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="w-1/3 h-8 bg-gray-100 rounded-[6px]" />
            <div className="w-full h-12 bg-gray-100 rounded-[8px]" />
            <div className="w-full h-[320px] bg-gray-100 rounded-[12px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Content Area (8 Columns) */}
            <article className="lg:col-span-8 space-y-8">
              {/* Header Info */}
              <header className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#E8E7FF] text-[#0400F4] px-2.5 py-1 rounded-[4px] text-xs font-semibold">
                    {material.subject}
                  </span>
                  <span className={`px-2.5 py-1 rounded-[4px] text-xs ${getLevelBadgeClass(material.level)}`}>
                    {material.level}
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold text-[#2E2D2D] leading-tight tracking-tight">
                  {material.title}
                </h1>

                <p className="text-xs md:text-sm text-[#737373] leading-relaxed">
                  {material.description}
                </p>

                {/* Author & Meta Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#737373] pt-1">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={UserIcon} size={15} className="text-[#0400F4]" />
                    <span className="font-medium text-[#2E2D2D]">{material.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Clock01Icon} size={15} className="text-[#0400F4]" />
                    <span>{material.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Diperbarui: {material.updatedAt}</span>
                  </div>
                </div>
              </header>

              {/* Main Feature Image */}
              <figure className="space-y-2">
                <div className="relative w-full h-[280px] md:h-[380px] rounded-[12px] overflow-hidden border border-[#ECECEC] bg-[#FAFAFA]">
                  <Image
                    src={material.imageUrl}
                    alt={material.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <figcaption className="text-center text-xs text-[#737373] italic">
                  {material.imageCaption}
                </figcaption>
              </figure>

              {/* Structured Content Sections */}
              <div className="space-y-8">
                {material.contentSections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="space-y-4"
                  >
                    <h2 className="text-lg md:text-xl font-bold text-[#2E2D2D]">
                      {section.title}
                    </h2>

                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {/* Highlighted Note Callout Box */}
                    {section.callout && (
                      <div className="bg-[#F4EFFF] border-l-4 border-[#0400F4] rounded-r-[8px] p-4 text-xs md:text-sm text-[#2E2D2D] leading-relaxed font-medium">
                        {section.callout}
                      </div>
                    )}

                    {/* Code Snippet Box with Copy Button */}
                    {section.codeSnippet && (
                      <div className="bg-[#1E1E2E] rounded-[10px] p-4 space-y-3 text-white overflow-hidden">
                        <div className="flex items-center justify-between text-xs text-[#A6ADC8] border-b border-[#313244] pb-2">
                          <span className="font-mono">{section.codeSnippet.language}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(section.codeSnippet!.code)}
                            className="inline-flex items-center gap-1.5 bg-[#313244] hover:bg-[#45475A] text-white px-2.5 py-1 rounded-[6px] transition-colors text-[11px]"
                          >
                            <HugeiconsIcon icon={copiedCode ? Tick01Icon : Copy01Icon} size={13} />
                            <span>{copiedCode ? "Tersalin!" : "Salin Kode"}</span>
                          </button>
                        </div>
                        <pre className="font-mono text-xs overflow-x-auto text-[#CDD6F4] leading-relaxed">
                          <code>{section.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Attachment Download Block */}
              <section className="bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#F4EFFF] text-[#0400F4] flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={File01Icon} size={20} />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-[#2E2D2D]">
                      {material.attachment.fileName}
                    </p>
                    <p className="text-[11px] text-[#737373]">
                      Modul Pelengkap • {material.attachment.fileSize}
                    </p>
                  </div>
                </div>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Mengunduh file: ${material.attachment.fileName}`);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 bg-white border border-[#ECECEC] hover:bg-[#F6F5FF] hover:border-[#0400F4]/40 text-[#0400F4] px-4 py-2 rounded-[6px] text-xs font-semibold transition-all duration-200"
                >
                  <HugeiconsIcon icon={Download01Icon} size={15} />
                  <span>Unduh Modul PDF</span>
                </a>
              </section>
            </article>

            {/* Sticky Sidebar Navigation (4 Columns) */}
            <aside className="lg:col-span-4 space-y-5 sticky top-28">
              {/* Table of Contents Box */}
              <div className="bg-white border border-[#ECECEC] rounded-[12px] p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#ECECEC] pb-3">
                  <HugeiconsIcon icon={Book01Icon} size={18} className="text-[#0400F4]" />
                  <h3 className="text-sm font-bold text-[#2E2D2D]">Daftar Isi Pembahasan</h3>
                </div>

                {/* Table of Contents Items - 0px rounded (rounded-none) with Active Indicator */}
                <nav className="space-y-1">
                  {material.contentSections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={(e) => handleScrollToSection(e, sec.id)}
                        className={`block px-3.5 py-2.5 text-xs font-medium rounded-none transition-all duration-200 ${
                          isActive
                            ? "bg-[#F4EFFF] text-[#0400F4] font-semibold border-l-2 border-[#0400F4]"
                            : "text-[#737373] hover:text-[#2E2D2D] hover:bg-[#FAFAFA] border-l-2 border-transparent"
                        }`}
                      >
                        {sec.title}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Start Quiz Card */}
              <div className="bg-gradient-to-br from-[#FAFAFF] via-[#F4EFFF] to-[#EBE4FF] border border-[#E0D7FF] rounded-[12px] p-5 space-y-3">
                <h4 className="text-xs font-semibold text-[#0400F4]">
                  Uji Pemahamanmu
                </h4>
                <h3 className="text-sm font-bold text-[#2E2D2D]">
                  Sudah Selesai Membaca Modul Ini?
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  Kerjakan kuis latihan 5 soal interaktif untuk mengukur pemahaman konsepmu.
                </p>
                <Link
                  href={`/kuis/${material.id}`}
                  className="w-full bg-[#0400F4] hover:bg-[#0300d4] active:scale-95 text-white py-2.5 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
                >
                  <span>Mulai Uji Pemahaman</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
