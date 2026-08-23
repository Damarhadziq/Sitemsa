'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    subject: "Bimbingan Konseling",
    title: "Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!",
    level: "Pemula",
    duration: "30 Menit",
    topics: ["Prokrastinasi", "Penyebab & Dampak", "Self-Management", "Dukungan Kelompok"],
    description: "Memahami pengertian prokrastinasi, penyebab dan dampaknya, serta penerapan strategi self-management dan simulasi Buaya Gigitan untuk konsisten belajar.",
    icon: UserGroupIcon,
    isAiRecommended: true,
    aiReason: "Fondasi Self-Management",
  },
  {
    id: 8,
    subject: "Bimbingan Konseling",
    title: "Talent Quest: Temukan Potensimu, Kembangkan Dirimu!",
    level: "Pemula",
    duration: "35 Menit",
    topics: ["Potensi Diri", "Ragam Potensi", "Strength-Based", "Talent Quest Board"],
    description: "Mengenal dan mengembangkan potensi diri melalui pendekatan strength-based, refleksi personal, dan simulasi permainan edukatif Talent Quest.",
    icon: UserGroupIcon,
    isAiRecommended: true,
    aiReason: "Eksplorasi Minat & Bakat",
  },
  {
    id: 16,
    subject: "Bimbingan Konseling",
    title: "Jati Diri Tanpa Kenakalan",
    level: "Menengah",
    duration: "40 Menit",
    topics: ["Jati Diri Remaja", "Bentuk Kenakalan", "Norma Pergaulan", "Peer Pressure", "Mind Mapping"],
    description: "Memahami pembentukan jati diri remaja, menyelaraskan norma pergaulan teman sebaya, mengatasi peer pressure, dan studi kasus problem-based learning.",
    icon: UserGroupIcon,
  },
  {
    id: 17,
    subject: "Bimbingan Konseling",
    title: "Membangun Konsep Diri Positif",
    level: "Pemula",
    duration: "30 Menit",
    topics: ["Pengertian Konsep Diri", "Self-Image", "Self-Esteem", "Ideal Self", "Faktor Lingkungan"],
    description: "Memahami konsep diri remaja, 3 komponen utama (self-image, self-esteem, ideal self), faktor lingkungan, serta aktivitas refleksi diri telapak tangan.",
    icon: UserGroupIcon,
    isAiRecommended: true,
    aiReason: "Pengembangan Konsep Diri",
  },
  {
    id: 18,
    subject: "Bimbingan Konseling",
    title: "Personal Branding: Membangun Citra Diri Positif",
    level: "Pemula",
    duration: "35 Menit",
    topics: ["Personal Branding", "Potensi Diri", "Unsur Branding", "Kesiapan PKL & Kerja"],
    description: "Mengenali keunikan dan potensi diri, membangun citra profesional positif, serta persiapan menghadapi PKL dan dunia kerja bagi siswa SMK.",
    icon: UserGroupIcon,
    isAiRecommended: true,
    aiReason: "Kesiapan Karir & Vokasi",
  },
  {
    id: 19,
    subject: "Bimbingan Konseling",
    title: "Persiapan Magang dan Etika di Dunia Kerja",
    level: "Menengah",
    duration: "40 Menit",
    topics: ["Persiapan Magang", "Soft Skills Vokasi", "Etika Kerja", "Tips Profesional"],
    description: "Panduan komprehensif persiapan administratif, keterampilan, mental, dan penampilan serta etika profesional saat magang di industri.",
    icon: UserGroupIcon,
  },
  {
    id: 9,
    subject: "Seni Tari",
    title: "Konsep Koreografi dalam Seni Tari",
    level: "Pemula",
    duration: "30 Menit",
    topics: ["Koreografi", "Wirama", "Wiraga", "Wirasa"],
    description: "Mempelajari pengertian koreografi, unsur pendukung tari (wirama, wiraga, wirasa), sumber rangsang ide, serta elemen utama ruang, waktu, dan tenaga.",
    icon: MusicNote01Icon,
    isAiRecommended: true,
    aiReason: "Fondasi Utama Seni Tari",
  },
  {
    id: 10,
    subject: "Seni Tari",
    title: "Koreografi: Eksplorasi Gerak Dalam Seni Tari",
    level: "Pemula",
    duration: "35 Menit",
    topics: ["Eksplorasi Gerak", "Rangsang Kinestetik", "Transformasi Gerak", "Tempo & Level"],
    description: "Memahami prinsip eksplorasi gerak tari, berbagai sumber rangsangan (visual, audio, kinestetik, gagasan), dan teknik pengembangan gerak dasar.",
    icon: MusicNote01Icon,
  },
  {
    id: 12,
    subject: "Seni Tari",
    title: "Koreografi: Pola Lantai dalam Penunjang Komposisi Tari",
    level: "Menengah",
    duration: "40 Menit",
    topics: ["Komposisi Tari", "Pola Lantai", "Level Vertikal", "Prinsip Unity Balance"],
    description: "Mempelajari unsur utama komposisi tari, pola lantai, level, arah hadap, prinsip kesatuan & keseimbangan, serta ragam panggung pertunjukan.",
    icon: MusicNote01Icon,
  },
  {
    id: 13,
    subject: "Seni Tari",
    title: "Tata Rias dalam Seni Tari",
    level: "Pemula",
    duration: "30 Menit",
    topics: ["Tata Rias Tari", "Rias Korektif", "Rias Karakter", "Rias Fantasi"],
    description: "Mempelajari fungsi tata rias panggung, jenis rias (korektif, karakter, fantasi), dan langkah-langkah aplikasi riasan korektif.",
    icon: MusicNote01Icon,
  },
  {
    id: 14,
    subject: "Seni Tari",
    title: "Tata Kostum dan Busana dalam Seni Tari",
    level: "Pemula",
    duration: "30 Menit",
    topics: ["Tata Busana", "Pakaian Tubuh & Kepala", "Aksesori Tari", "Sapit Urang"],
    description: "Mempelajari peranan tata busana dalam mendukung karakter tari, unsur busana, serta praktik memakai kain jarit model sapit urang.",
    icon: MusicNote01Icon,
  },
  {
    id: 15,
    subject: "Seni Tari",
    title: "Properti dalam Seni Tari",
    level: "Pemula",
    duration: "25 Menit",
    topics: ["Properti Tari", "Stimulus Gerak", "Fungsi Properti", "Eksplorasi Properti"],
    description: "Memahami pemanfaatan properti sebagai pendukung dan stimulus koreografi gerak, serta ragam fungsi properti dalam karya tari.",
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
  "Bimbingan Konseling",
  "Seni Tari",
  "Otomotif",
  "Keolahragaan",
];

const normalizeCategory = (cat?: string | null): string => {
  if (!cat) return "";
  const c = cat.toLowerCase().replace(/\s+/g, ' ').trim();
  if (c === 'bimbingan konseling' || c === 'bimbingan dan konseling' || c === 'bk' || c.includes('konseling')) {
    return 'Bimbingan Konseling';
  }
  if (c.includes('informatika') || c.includes('komputer')) return 'Informatika';
  if (c.includes('elektronika')) return 'Elektronika';
  if (c.includes('tari')) return 'Seni Tari';
  if (c.includes('otomotif')) return 'Otomotif';
  if (c.includes('olahraga') || c.includes('keolahragaan')) return 'Keolahragaan';
  return cat;
};

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

function MateriLandingContent() {
  const searchParams = useSearchParams();
  const kategoriParam = searchParams.get('kategori') || searchParams.get('bidang') || searchParams.get('subject');

  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [aiRecommendedModules, setAiRecommendedModules] = useState<ModulItem[]>([]);

  // Set category only if explicitly specified in URL query (e.g. from home page card click), otherwise default to "Semua"
  useEffect(() => {
    setCurrentPage(1);
    if (!kategoriParam) {
      setSelectedCategory("Semua");
      return;
    }

    const normalizedParam = normalizeCategory(kategoriParam);
    const matchedCategory = CATEGORIES.find(
      (c) => normalizeCategory(c).toLowerCase() === normalizedParam.toLowerCase()
    );

    setSelectedCategory(matchedCategory || "Semua");
  }, [kategoriParam]);

  // Compute 3 Dynamic AI Recommendations (Popular for new users, adaptive based on access history for active users)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawViews = localStorage.getItem('sintesa_user_views');
      const views: { id: number; subject: string; timestamp: number }[] = rawViews ? JSON.parse(rawViews) : [];

      if (views && views.length > 0) {
        // Frequency analysis of viewed subjects
        const subjectCounts: Record<string, number> = {};
        views.forEach((v) => {
          subjectCounts[v.subject] = (subjectCounts[v.subject] || 0) + 1;
        });

        // Sort subjects by highest view frequency
        const sortedSubjects = Object.keys(subjectCounts).sort(
          (a, b) => subjectCounts[b] - subjectCounts[a]
        );
        const topSubject = sortedSubjects[0];

        // Retrieve modules matching the student's top learning path
        const favoriteSubjectModules = MODUL_DATA.filter((m) => m.subject === topSubject);
        const otherModules = MODUL_DATA.filter((m) => m.subject !== topSubject);

        const recommendations: ModulItem[] = [];

        // 1. Recommend top relevant modules in user's most active subject
        favoriteSubjectModules.forEach((m) => {
          if (recommendations.length < 3) {
            recommendations.push({
              ...m,
              isAiRecommended: true,
              aiReason: `Minat Belajar ${topSubject}`,
            });
          }
        });

        // 2. Fill any remaining recommendation slot with popular cross-disciplinary modules
        otherModules.forEach((m) => {
          if (recommendations.length < 3) {
            recommendations.push({
              ...m,
              isAiRecommended: true,
              aiReason: "Eksplorasi Populer",
            });
          }
        });

        setAiRecommendedModules(recommendations.slice(0, 3));
      } else {
        // Default for new users: Exactly top 3 most popular and highly-viewed modules across disciplines
        const defaultTop3: ModulItem[] = [
          {
            ...MODUL_DATA.find((m) => m.id === 1)!, // Informatika: Variabel, Tipe Data
            isAiRecommended: true,
            aiReason: "Paling Banyak Dipelajari",
          },
          {
            ...MODUL_DATA.find((m) => m.id === 9)!, // Seni Tari: Konsep Koreografi
            isAiRecommended: true,
            aiReason: "Pilihan & Terpopuler",
          },
          {
            ...MODUL_DATA.find((m) => m.id === 4)!, // Elektronika: Sirkuit Resistor
            isAiRecommended: true,
            aiReason: "Terfavorit di Kelas 10",
          },
        ];
        setAiRecommendedModules(defaultTop3.slice(0, 3));
      }
    } catch {
      // Fallback
      setAiRecommendedModules(MODUL_DATA.filter((m) => [1, 9, 4].includes(m.id)).slice(0, 3));
    }
  }, []);

  // Simulate skeleton loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  const handleCategoryChange = (category: string) => {
    triggerLoading();
    setSelectedCategory(category);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      const newUrl = category === 'Semua' ? '/materi' : `/materi?kategori=${encodeURIComponent(category)}`;
      window.history.replaceState(null, '', newUrl);
    }
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
      selectedCategory === "Semua" ||
      normalizeCategory(item.subject).toLowerCase() === normalizeCategory(selectedCategory).toLowerCase();
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

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1">
        {/* Header Hero Section */}
        <section className="mb-6 text-center max-w-3xl mx-auto space-y-2 md:space-y-3">
          <h1 className="text-[28px] sm:text-3xl md:text-4xl font-bold text-[#2E2D2D] tracking-tight leading-tight max-w-[290px] sm:max-w-xs md:max-w-none mx-auto">
            Eksplorasi Materi & Modul Interaktif
          </h1>

          <p className="hidden md:block text-xs md:text-sm text-[#737373] leading-relaxed max-w-xl mx-auto">
            Pilih materi favoritmu dan tingkatkan keahlian secara bertahap.
          </p>

          {/* Interactive Search Bar with Live Recommendation Dropdown */}
          <div className="pt-4 sm:pt-5 md:pt-2 max-w-xl mx-auto relative">
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
                className={`w-full h-11 pr-10 bg-[#F3F3F3] rounded-[8px] text-sm text-[#2E2D2D] placeholder:text-[#AAAAAA] border border-transparent focus:bg-white focus:border-[#2563EB] outline-none transition-all duration-200 ${
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
                  className="w-7 h-7 rounded-[6px] bg-[#2563EB] text-white flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                </button>
              </div>
            </div>

            {/* Live Search Recommendation Dropdown (Hides when 0 results found) */}
            {isSearchFocused && (searchQuery.trim() ? filteredModul.length > 0 : true) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ECECEC] rounded-[12px] p-3 z-30 space-y-2 text-left animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-2 pb-1.5 border-b border-[#ECECEC]">
                  <span className="text-[11px] font-semibold text-[#2563EB]">
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
                      href={`/materi/${item.id}?from=${encodeURIComponent(selectedCategory)}`}
                      className="block p-2.5 rounded-[8px] hover:bg-[#F6F5FF] border border-transparent hover:border-[#2563EB]/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                          <span className="bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] text-[10px] font-semibold shrink-0">
                            {item.subject}
                          </span>
                          <span className="text-xs font-semibold text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors truncate min-w-0 flex-1">
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

        {/* Category Tabs Filter with Smooth Scroll Blur / Fade Edges */}
        <section className="mb-8 relative -mx-6 px-6 md:mx-0 md:px-0">
          {/* Left Gradient Fade (Mobile Only) */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-7 bg-gradient-to-r from-white via-white/90 to-transparent z-10 md:hidden" />

          {/* Right Gradient Fade (Mobile Only) */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-7 bg-gradient-to-l from-white via-white/90 to-transparent z-10 md:hidden" />

          {/* Scrollable Container with CSS Mask Image */}
          <div className="overflow-x-auto pb-2 scrollbar-none [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] md:[mask-image:none]">
            <div className="flex items-center justify-start md:justify-center gap-2 min-w-max px-4 md:px-0">
              {CATEGORIES.map((category) => {
                const isActive =
                  selectedCategory === category ||
                  normalizeCategory(selectedCategory).toLowerCase() === normalizeCategory(category).toLowerCase();
                const q = searchQuery.toLowerCase();
                const count =
                  category === "Semua"
                    ? MODUL_DATA.filter(
                        (m) =>
                          m.title.toLowerCase().includes(q) ||
                          m.subject.toLowerCase().includes(q) ||
                          m.description.toLowerCase().includes(q)
                      ).length
                    : MODUL_DATA.filter(
                        (m) =>
                          normalizeCategory(m.subject).toLowerCase() === normalizeCategory(category).toLowerCase() &&
                          (m.title.toLowerCase().includes(q) ||
                            m.subject.toLowerCase().includes(q) ||
                            m.description.toLowerCase().includes(q))
                      ).length;

                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3.5 py-1.5 rounded-[6px] text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#2563EB] text-white"
                        : "bg-[#FAFAFA] border border-[#ECECEC] text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100"
                    }`}
                  >
                    {category}{isActive ? ` (${count})` : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI Recommendations Interactive Frame (Exactly 3 Items) */}
        {selectedCategory === "Semua" && !searchQuery && (
          <section className="mb-10 bg-gradient-to-br from-[#FAFAFF] via-[#F4EFFF] to-[#EBE4FF] rounded-[14px] p-3 md:p-5 lg:p-6 border border-[#E0D7FF] relative overflow-hidden space-y-3 md:space-y-4 transition-all duration-300">
            {/* Ambient Background Glow */}
            <div className="absolute -right-12 -top-12 w-56 h-56 bg-[#2563EB]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Frame Header - Popping Gradient Badge */}
            <div className="flex items-center z-10 relative">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#EC4899] text-white px-3.5 py-1.5 rounded-[8px] text-xs font-semibold">
                <HugeiconsIcon icon={SparklesIcon} size={14} />
                <span>Rekomendasi AI</span>
              </span>
            </div>

              {/* Exactly 3 AI Recommended Material Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 z-10 relative">
                {aiRecommendedModules.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/materi/${item.id}?from=${encodeURIComponent(selectedCategory)}`}
                    className="bg-white/90 backdrop-blur-md border border-[#E0D7FF] rounded-[10px] p-3 md:p-4 flex flex-col justify-between transition-all duration-300 group hover:border-[#2563EB]/50 hover:bg-white"
                  >
                    <div className="space-y-1.5 md:space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] text-[11px] font-semibold">
                          {item.subject}
                        </span>
                        {item.aiReason && (
                          <span className="hidden md:inline text-[11px] font-medium text-[#737373]">
                            {item.aiReason}
                          </span>
                        )}
                      </div>

                      <h3
                        title={item.title}
                        className="text-xs md:text-sm font-semibold text-[#2E2D2D] leading-snug group-hover:text-[#2563EB] transition-colors duration-200 truncate"
                      >
                        {item.title}
                      </h3>

                      <p className="text-[11px] text-[#737373] line-clamp-1 md:line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="hidden md:flex pt-3 mt-3 items-center justify-between text-[11px] font-medium text-[#2563EB]">
                      <span>Lihat Materi</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </Link>
                ))}
              </div>
          </section>
        )}

        {/* Direct Individual Materials Grid List */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
              <span className="md:hidden">
                {selectedCategory === "Semua" ? "Daftar Materi Pembelajaran" : `Materi ${selectedCategory}`}
              </span>
              <span className="hidden md:inline">
                Daftar Materi Pembelajaran {selectedCategory !== "Semua" ? `: ${selectedCategory}` : ""}
              </span>
            </h2>
            <span className="hidden lg:inline text-xs text-[#737373]">
              Menampilkan {paginatedModul.length} dari {filteredModul.length} Materi
            </span>
          </div>

          {/* Skeleton Loading State (Borderless Cards) */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-slate-100/70 rounded-[12px] p-5 h-[180px] flex flex-col justify-between animate-pulse"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-24 h-4 bg-slate-200/80 rounded-[4px]" />
                      <div className="w-14 h-4 bg-slate-200/80 rounded-[4px]" />
                    </div>
                    <div className="w-3/4 h-5 bg-slate-200/80 rounded-[4px]" />
                    <div className="w-full h-8 bg-slate-200/80 rounded-[4px]" />
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
                  href={`/materi/${modul.id}?from=${encodeURIComponent(selectedCategory)}`}
                  className="bg-white border border-[#ECECEC] rounded-[10px] p-5 flex flex-col justify-between hover:bg-[#F6F5FF] hover:border-[#2563EB]/40 transition-all duration-300 ease-out group cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Header Top: Icon + Subject + Color-Coded Level Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[6px] bg-[#F4EFFF] flex items-center justify-center text-[#2563EB] shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                          <HugeiconsIcon icon={modul.icon} size={16} />
                        </div>
                        <span className="text-xs font-semibold text-[#2563EB]">
                          {modul.subject}
                        </span>
                      </div>

                      {/* Color-Coded Level Badge */}
                      <span className={`px-2.5 py-0.5 rounded-[4px] text-[11px] ${getLevelBadgeClass(modul.level)}`}>
                        {modul.level}
                      </span>
                    </div>

                    {/* Title (Single Line with Ellipsis) */}
                    <div>
                      <h3
                        title={modul.title}
                        className="text-sm md:text-base font-semibold text-[#2E2D2D] leading-snug group-hover:text-[#2563EB] transition-colors duration-200 truncate"
                      >
                        {modul.title}
                      </h3>
                    </div>

                    {/* Topics Checklist Pills */}
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] font-medium text-[#737373] block">
                        Topik Bahasan:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {modul.topics.slice(0, 4).map((topic, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FAFAFA] border border-[#ECECEC] text-[#4A4A4A] px-2.5 py-1 rounded-[6px] text-[11px] font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Interactive Pagination (Global Style: 6 items per page) */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 pb-2">
              {/* Frameless Previous Arrow */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
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
                    onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function MateriLandingPage() {
  return (
    <Suspense fallback={null}>
      <MateriLandingContent />
    </Suspense>
  );
}
