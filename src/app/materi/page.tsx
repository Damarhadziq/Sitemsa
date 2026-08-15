'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
  Search01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  SparklesIcon,
  ComputerIcon,
  CpuIcon,
  UserGroupIcon,
  MusicNote01Icon,
  Car01Icon,
  Dumbbell01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

interface ModulItem {
  id: number;
  subject: string;
  title: string;
  level: "Pemula" | "Menengah" | "Mahir";
  duration: string;
  topics: string[];
  description: string;
  icon: IconSvgElement;
  isAiRecommended?: boolean;
  aiReason?: string;
}

const MODUL_DATA: ModulItem[] = [
  {
    id: 1,
    subject: "Informatika",
    title: "Variabel, Tipe Data & Operasi Logika",
    level: "Pemula",
    duration: "25 Menit",
    topics: ["Variabel", "Tipe Data Primitif", "Operator Logika"],
    description: "Pelajari konsep penyimpanan data dan eksekusi operasi logika dasar dalam pemrograman.",
    icon: ComputerIcon,
    isAiRecommended: true,
    aiReason: "Fondasi Utama Informatika",
  },
  {
    id: 2,
    subject: "Informatika",
    title: "Struktur Percabangan (If-Else & Switch)",
    level: "Pemula",
    duration: "30 Menit",
    topics: ["Kondisi If-Else", "Nested If", "Switch Case"],
    description: "Kuasai pengambilan keputusan dalam kode berdasarkan kondisi logika yang dievaluasi.",
    icon: ComputerIcon,
  },
  {
    id: 3,
    subject: "Informatika",
    title: "Perulangan & Iterasi Algoritma",
    level: "Pemula",
    duration: "35 Menit",
    topics: ["For Loop", "While & Do-While", "Break & Continue"],
    description: "Pahami teknik mengeksekusi instruksi berulang secara efisien menggunakan perulangan.",
    icon: ComputerIcon,
  },
  {
    id: 4,
    subject: "Elektronika",
    title: "Analisis Sirkuit Seri & Paralel Resistor",
    level: "Pemula",
    duration: "20 Menit",
    topics: ["Hukum Ohm", "Hambatan Total", "Pengukur Multimeter"],
    description: "Hitung dan praktikkkan arus serta tegangan listrik pada rangkaian komponen pasif.",
    icon: CpuIcon,
    isAiRecommended: true,
    aiReason: "Paling Populer di Kelas 10",
  },
  {
    id: 5,
    subject: "Elektronika",
    title: "Karakteristik Dioda & Aplikasi Transistor",
    level: "Menengah",
    duration: "40 Menit",
    topics: ["Dioda Penyearah", "Transistor BJT", "Sakelar Elektronik"],
    description: "Prinsip pemotongan arus satu arah dan penggunaan transistor sebagai penguat sinyal.",
    icon: CpuIcon,
  },
  {
    id: 6,
    subject: "Elektronika",
    title: "Pemrograman Dasar Arduino & Sensor",
    level: "Menengah",
    duration: "45 Menit",
    topics: ["Ide Arduino", "GPIO Output", "Sensor Ultrasonik"],
    description: "Latihan langsung menulis kode mikro untuk membaca input sensor fisik secara otomatis.",
    icon: CpuIcon,
  },
  {
    id: 7,
    subject: "Bimbingan dan Konseling",
    title: "Penerapan Teknik Pomodoro dalam Belajar",
    level: "Pemula",
    duration: "15 Menit",
    topics: ["Interval 25 Min", "Sesi Istirahat", "Evaluasi Fokus"],
    description: "Metode manajemen waktu teruji untuk meningkatkan konsentrasi tanpa mengalami keletihan mental.",
    icon: UserGroupIcon,
    isAiRecommended: true,
    aiReason: "Rekomendasi Produktivitas",
  },
  {
    id: 8,
    subject: "Bimbingan dan Konseling",
    title: "Matriks Prioritas Eisenhower untuk Pelajar",
    level: "Pemula",
    duration: "20 Menit",
    topics: ["Mendesak vs Penting", "Delegasi Tugas", "Penjadwalan"],
    description: "Klasifikasikan tugas harianmu agar tidak tertumpuk di akhir tenggat waktu.",
    icon: UserGroupIcon,
  },
  {
    id: 9,
    subject: "Seni Tari",
    title: "Ragam Gerak Dasar Posisi Kaki & Tangan",
    level: "Pemula",
    duration: "30 Menit",
    topics: ["Sikap Agem", "Mendhak", "Gerak Ukel Tangan"],
    description: "Pelajari posisi anatomis dan nilai estetika awal dalam teknik seni tari tradisional.",
    icon: MusicNote01Icon,
  },
  {
    id: 10,
    subject: "Seni Tari",
    title: "Ritme, Irama & Pengiring Musik Tradisional",
    level: "Menengah",
    duration: "25 Menit",
    topics: ["Tempo Gamelan", "Kesesuaian Ketukan", "Dinamika Tari"],
    description: "Penyelarasan pola gerak tari dengan ritme instrumen musik tradisional.",
    icon: MusicNote01Icon,
  },
  {
    id: 11,
    subject: "Otomotif",
    title: "Prinsip Kerja & Komponen Mesin 4-Langkah",
    level: "Menengah",
    duration: "40 Menit",
    topics: ["Langkah Hisap & Kompresi", "Piston & Katup", "Sistem Pelumasan"],
    description: "Bedah siklus termodinamika mesin pembakaran dalam 4-tak beserta siklus komponennya.",
    icon: Car01Icon,
  },
  {
    id: 12,
    subject: "Otomotif",
    title: "Diagnosis Jalur Kelistrikan Pengapian Mobil",
    level: "Menengah",
    duration: "45 Menit",
    topics: ["Busi & Koil", "Relay & Sekring", "Bagan Wiring"],
    description: "Cara membaca skema wiring dan melacak gangguan arus pengapian pada mesin.",
    icon: Car01Icon,
  },
  {
    id: 13,
    subject: "Keolahragaan",
    title: "Program Latihan Daya Tahan Jasmani",
    level: "Pemula",
    duration: "25 Menit",
    topics: ["Latihan Kebugaran", "Jogging Terukur", "Tes Kebugaran"],
    description: "Panduan praktis membangun kapasitas sistem kardiovaskular secara bertahap.",
    icon: Dumbbell01Icon,
  },
  {
    id: 14,
    subject: "Keolahragaan",
    title: "Nutrisi Seimbang & Hidrasi Atlet",
    level: "Pemula",
    duration: "20 Menit",
    topics: ["Asupan Karbohidrat", "Keseimbangan Cairan", "Pemulihan Otot"],
    description: "Kebutuhan gizi dan pengaturan konsumsi air saat dan setelah beraktivitas fisik berat.",
    icon: Dumbbell01Icon,
  },
];

const CATEGORIES = [
  "Semua",
  "Informatika",
  "Elektronika",
  "Bimbingan dan Konseling",
  "Seni Tari",
  "Otomotif",
  "Keolahragaan",
];

const ITEMS_PER_PAGE = 6;

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

export default function MateriLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate skeleton loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 250);
  };

  const handleCategoryChange = (category: string) => {
    triggerLoading();
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    triggerLoading();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter modules
  const filteredModul = MODUL_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.subject === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredModul.length / ITEMS_PER_PAGE);
  const paginatedModul = filteredModul.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // AI Recommended items (3 modules in 1 frame)
  const aiRecommendedModules = MODUL_DATA.filter((m) => m.isAiRecommended);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1">
        {/* Header Hero Section */}
        <section className="mb-6 text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-2xl md:text-4xl font-bold text-[#2E2D2D] tracking-tight leading-tight">
            Eksplorasi Materi & Modul Interaktif
          </h1>

          <p className="text-xs md:text-sm text-[#737373] leading-relaxed max-w-xl mx-auto">
            Pilih materi favoritmu dan tingkatkan keahlian secara bertahap.
          </p>

          {/* Interactive Search Bar with Live Recommendation Dropdown */}
          <div className="pt-2 max-w-xl mx-auto relative">
            <div className="relative">
              {/* Left Search Icon (Fades out when focused) */}
              <div
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] flex items-center transition-all duration-200 pointer-events-none ${
                  isSearchFocused ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"
                }`}
              >
                <HugeiconsIcon icon={Search01Icon} size={18} />
              </div>

              <input
                type="text"
                placeholder="Cari materi, topik, atau kata kunci..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full h-11 pr-10 bg-[#F3F3F3] rounded-[8px] text-sm text-[#2E2D2D] placeholder:text-[#AAAAAA] border border-transparent focus:bg-white focus:border-[#0400F4] outline-none transition-all duration-200 ${
                  isSearchFocused ? "pl-4" : "pl-10"
                }`}
              />

              {/* Right Action Icon (Appears when focused with distinct brand color) */}
              <div
                className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-200 flex items-center ${
                  isSearchFocused ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1 pointer-events-none"
                }`}
              >
                <button
                  type="button"
                  className="w-7 h-7 rounded-[6px] bg-[#0400F4] text-white flex items-center justify-center hover:bg-[#0300d4] transition-colors"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                </button>
              </div>
            </div>

            {/* Live Search Recommendation Dropdown (Hides when 0 results found) */}
            {isSearchFocused && (searchQuery.trim() ? filteredModul.length > 0 : true) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ECECEC] rounded-[12px] p-3 z-30 space-y-2 text-left animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-2 pb-1.5 border-b border-[#ECECEC]">
                  <span className="text-[11px] font-semibold text-[#0400F4]">
                    {searchQuery.trim() ? "Hasil Pencarian Cepat" : "Rekomendasi Pencarian"}
                  </span>
                  <span className="text-[10px] text-[#737373]">
                    {searchQuery.trim() ? `${filteredModul.length} Ditemukan` : "Topik Populer"}
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1">
                  {(searchQuery.trim() ? filteredModul.slice(0, 4) : MODUL_DATA.slice(0, 4)).map((item) => (
                    <Link
                      key={item.id}
                      href={`/materi/${item.id}`}
                      className="block p-2.5 rounded-[8px] hover:bg-[#F6F5FF] border border-transparent hover:border-[#0400F4]/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                          <span className="bg-[#E8E7FF] text-[#0400F4] px-2 py-0.5 rounded-[4px] text-[10px] font-semibold shrink-0">
                            {item.subject}
                          </span>
                          <span className="text-xs font-semibold text-[#2E2D2D] group-hover:text-[#0400F4] transition-colors truncate min-w-0 flex-1">
                            {item.title}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-[4px] shrink-0 ${getLevelBadgeClass(item.level)}`}>
                          {item.level}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Category Tabs Filter */}
        <section className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-start md:justify-center gap-2 min-w-max">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3.5 py-1.5 rounded-[6px] text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#0400F4] text-white"
                      : "bg-[#FAFAFA] border border-[#ECECEC] text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* AI Recommendations Interactive Frame */}
        {selectedCategory === "Semua" && !searchQuery && (
          <section className="mb-10 bg-gradient-to-br from-[#FAFAFF] via-[#F4EFFF] to-[#EBE4FF] rounded-[14px] p-5 lg:p-6 border border-[#E0D7FF] relative overflow-hidden space-y-4 transition-all duration-300">
            {/* Ambient Background Glow */}
            <div className="absolute -right-12 -top-12 w-56 h-56 bg-[#0400F4]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Frame Header - Popping Gradient Badge */}
            <div className="flex items-center z-10 relative">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#0400F4] via-[#6366F1] to-[#EC4899] text-white px-3.5 py-1.5 rounded-[8px] text-xs font-semibold">
                <HugeiconsIcon icon={SparklesIcon} size={14} />
                <span>Rekomendasi AI</span>
              </span>
            </div>

            {/* 3 AI Recommended Material Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-10 relative">
              {aiRecommendedModules.map((item) => (
                <Link
                  key={item.id}
                  href={`/materi/${item.id}`}
                  className="bg-white/90 backdrop-blur-md border border-[#E0D7FF] rounded-[10px] p-4 flex flex-col justify-between transition-all duration-300 group hover:border-[#0400F4]/50 hover:bg-white"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-[#E8E7FF] text-[#0400F4] px-2 py-0.5 rounded-[4px] text-[11px] font-semibold">
                        {item.subject}
                      </span>
                      <span className="text-[11px] font-medium text-[#737373]">
                        {item.aiReason}
                      </span>
                    </div>

                    <h3 className="text-xs md:text-sm font-semibold text-[#2E2D2D] leading-snug group-hover:text-[#0400F4] transition-colors duration-200">
                      {item.title}
                    </h3>

                    <p className="text-[11px] text-[#737373] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 flex items-center justify-between text-[11px] font-medium text-[#0400F4]">
                    <span>Lihat Materi</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Direct Individual Materials Grid List - Cleaned Cards without Divider or Bottom Buttons */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
              Daftar Materi Pembelajaran {selectedCategory !== "Semua" ? `: ${selectedCategory}` : ""}
            </h2>
            <span className="text-xs text-[#737373]">
              Menampilkan {paginatedModul.length} dari {filteredModul.length} Materi
            </span>
          </div>

          {/* Skeleton Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-[#FAFAFA] border border-[#ECECEC] rounded-[10px] p-5 h-[180px] flex flex-col justify-between animate-pulse"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-24 h-4 bg-gray-200 rounded-[4px]" />
                      <div className="w-14 h-4 bg-gray-200 rounded-[4px]" />
                    </div>
                    <div className="w-3/4 h-5 bg-gray-200 rounded-[4px]" />
                    <div className="w-full h-8 bg-gray-200 rounded-[4px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredModul.length === 0 ? (
            <div className="text-center py-16 bg-[#FAFAFA] border border-[#ECECEC] rounded-[10px] space-y-2">
              <p className="text-sm font-semibold text-[#2E2D2D]">
                Tidak ada materi yang cocok
              </p>
              <p className="text-xs text-[#737373]">
                Coba gunakan kata kunci lain atau pilih kategori bidang studi berbeda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-300">
              {paginatedModul.map((modul) => (
                <Link
                  key={modul.id}
                  href={`/materi/${modul.id}`}
                  className="bg-white border border-[#ECECEC] rounded-[10px] p-5 flex flex-col justify-between hover:bg-[#F6F5FF] hover:border-[#0400F4]/40 transition-all duration-300 ease-out group cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Header Top: Icon + Subject + Color-Coded Level Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[6px] bg-[#F4EFFF] flex items-center justify-center text-[#0400F4] shrink-0 group-hover:bg-[#0400F4] group-hover:text-white transition-colors duration-300">
                          <HugeiconsIcon icon={modul.icon} size={16} />
                        </div>
                        <span className="text-xs font-semibold text-[#0400F4]">
                          {modul.subject}
                        </span>
                      </div>

                      {/* Color-Coded Level Badge */}
                      <span className={`px-2.5 py-0.5 rounded-[4px] text-[11px] ${getLevelBadgeClass(modul.level)}`}>
                        {modul.level}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-[#2E2D2D] leading-snug group-hover:text-[#0400F4] transition-colors duration-200">
                        {modul.title}
                      </h3>
                    </div>

                    {/* Topics Checklist Pills */}
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] font-medium text-[#737373] block">
                        Topik Bahasan:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {modul.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 bg-[#FAFAFA] border border-[#ECECEC] text-[#2E2D2D] px-2.5 py-1 rounded-[6px] text-[11px] font-medium"
                          >
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={11} className="text-[#0400F4]" />
                            <span>{topic}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Interactive Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {/* Frameless Previous Arrow */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Halaman Sebelumnya"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </button>

              {/* Numbered Page Buttons - Active is 100% Circle Filled */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-all flex items-center justify-center ${
                      isActive
                        ? "bg-[#0400F4] text-white"
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Halaman Selanjutnya"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
