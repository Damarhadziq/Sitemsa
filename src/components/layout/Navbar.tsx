'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
  Search01Icon,
  BellIcon,
  Cancel01Icon,
  ArrowRight01Icon,
  ComputerIcon,
  CpuIcon,
  UserGroupIcon,
  MusicNote01Icon,
  Car01Icon,
} from "@hugeicons/core-free-icons";

interface QuickSearchResult {
  id: number;
  subject: string;
  title: string;
  level: string;
  icon: IconSvgElement;
}

const QUICK_SEARCH_DATA: QuickSearchResult[] = [
  { id: 1, subject: "Informatika", title: "Variabel, Tipe Data & Operasi Logika", level: "Pemula", icon: ComputerIcon },
  { id: 2, subject: "Informatika", title: "Struktur Percabangan (If-Else & Switch)", level: "Pemula", icon: ComputerIcon },
  { id: 3, subject: "Informatika", title: "Perulangan & Iterasi Algoritma", level: "Menengah", icon: ComputerIcon },
  { id: 4, subject: "Elektronika", title: "Komponen Pasif (Resistor, Kapasitor, Induktor)", level: "Pemula", icon: CpuIcon },
  { id: 5, subject: "Elektronika", title: "Hukum Ohm & Sirkuit Listrik Dasar", level: "Pemula", icon: CpuIcon },
  { id: 6, subject: "Bimbingan & Konseling", title: "Manajemen Waktu & Teknik Pomodoro", level: "Pemula", icon: UserGroupIcon },
  { id: 7, subject: "Seni Tari", title: "Wiraga, Wirama, & Wirasa dalam Tari", level: "Pemula", icon: MusicNote01Icon },
  { id: 8, subject: "Otomotif", title: "Prinsip Kerja Mesin 4-Langkah", level: "Menengah", icon: Car01Icon },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavFocused, setIsNavFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuery, setModalQuery] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const modalInputRef = useRef<HTMLInputElement>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalQuery("");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      } else if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setTimeout(() => modalInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isModalOpen]);

  const filteredResults = modalQuery.trim()
    ? QUICK_SEARCH_DATA.filter(
        (item) =>
          item.title.toLowerCase().includes(modalQuery.toLowerCase()) ||
          item.subject.toLowerCase().includes(modalQuery.toLowerCase())
      )
    : QUICK_SEARCH_DATA.slice(0, 4);

  const handleSelectResult = (id: number) => {
    setIsModalOpen(false);
    router.push(`/materi/${id}`);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-[#ECECEC]"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo & Links */}
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-xl font-bold text-[#292929] tracking-tight hover:opacity-80 transition-opacity"
            >
              Sitemsa
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`text-sm font-medium relative py-1 transition-colors duration-200 ${
                  pathname === "/"
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0400F4] after:rounded-full"
                    : "text-[#8E8E8E] hover:text-[#2E2D2D]"
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/materi"
                className={`text-sm font-medium relative py-1 transition-colors duration-200 ${
                  pathname.startsWith("/materi")
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0400F4] after:rounded-full"
                    : "text-[#8E8E8E] hover:text-[#2E2D2D]"
                }`}
              >
                Materi
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-[#8E8E8E] hover:text-[#2E2D2D] transition-colors duration-200"
              >
                Dokumentasi
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-[#8E8E8E] hover:text-[#2E2D2D] transition-colors duration-200"
              >
                Kontak
              </Link>
            </nav>
          </div>

          {/* Right: Notification & Interactive Nav Search Bar */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-9 h-9 rounded-[8px] bg-white border border-[#ECECEC] flex items-center justify-center text-[#2E2D2D] hover:bg-gray-50 active:scale-95 transition-all duration-200"
              aria-label="Notifikasi"
            >
              <HugeiconsIcon icon={BellIcon} size={18} />
            </button>

            {/* Interactive Search Bar: Focus toggles Left Icon & Right Action Button */}
            <div className="relative w-48 sm:w-60 md:w-64">
              {/* Left Search Icon (Fades out when focused) */}
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] flex items-center transition-all duration-200 pointer-events-none ${
                  isNavFocused ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"
                }`}
              >
                <HugeiconsIcon icon={Search01Icon} size={16} />
              </div>

              <input
                type="text"
                placeholder="Cari materi..."
                onFocus={() => {
                  setIsNavFocused(true);
                  setIsModalOpen(true);
                }}
                onBlur={() => setIsNavFocused(false)}
                onClick={() => setIsModalOpen(true)}
                readOnly
                className={`w-full h-9 pr-8 bg-[#F3F3F3] rounded-[8px] text-xs text-[#2E2D2D] placeholder:text-[#AAAAAA] border border-transparent focus:bg-white focus:border-[#0400F4] outline-none transition-all duration-200 cursor-pointer ${
                  isNavFocused ? "pl-3.5" : "pl-9"
                }`}
              />

              {/* Right Action Icon (Appears when focused with distinct brand color) */}
              <div
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 transition-all duration-200 flex items-center ${
                  isNavFocused ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1 pointer-events-none"
                }`}
              >
                <span className="w-6 h-6 rounded-[5px] bg-[#0400F4] text-white flex items-center justify-center">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spotlight Command Palette Modal (Center-Focused with Dark Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
          {/* Backdrop Click Listener */}
          <div
            className="absolute inset-0"
            onClick={handleCloseModal}
          />

          {/* Centered Modal Card */}
          <div className="relative w-full max-w-xl bg-white border border-[#ECECEC] rounded-[14px] overflow-hidden space-y-0 z-10">
            {/* Modal Input Row */}
            <div className="p-4 border-b border-[#ECECEC] flex items-center gap-3 bg-[#FAFAFA]">
              <HugeiconsIcon icon={Search01Icon} size={20} className="text-[#0400F4] shrink-0" />
              <input
                ref={modalInputRef}
                type="text"
                placeholder="Ketik nama materi, topik, atau modul..."
                value={modalQuery}
                onChange={(e) => setModalQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#2E2D2D] placeholder:text-[#737373] outline-none font-medium"
              />
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-[#737373] hover:text-[#2E2D2D] p-1 rounded-[4px] hover:bg-gray-200 transition-colors shrink-0"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            {/* Quick Keyword Suggestion Chips */}
            <div className="px-4 py-2.5 bg-[#F9F9FF] border-b border-[#ECECEC] flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-semibold text-[#737373] shrink-0">Rekomendasi:</span>
              {["Informatika", "Resistor", "Variabel", "Pomodoro", "Otomotif"].map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setModalQuery(keyword)}
                  className="px-2.5 py-1 rounded-[5px] bg-white border border-[#ECECEC] text-[11px] font-medium text-[#2E2D2D] hover:bg-[#F4EFFF] hover:text-[#0400F4] transition-all shrink-0"
                >
                  {keyword}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="p-3 max-h-80 overflow-y-auto space-y-1">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectResult(item.id)}
                    className="w-full text-left p-3 rounded-[8px] hover:bg-[#F6F5FF] hover:border-[#0400F4]/30 border border-transparent flex items-center justify-between transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[6px] bg-[#E8E7FF] text-[#0400F4] flex items-center justify-center shrink-0 group-hover:bg-[#0400F4] group-hover:text-white transition-colors">
                        <HugeiconsIcon icon={item.icon} size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#2E2D2D] group-hover:text-[#0400F4] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#737373]">{item.subject}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-[4px] bg-gray-100 text-gray-700 shrink-0">
                      {item.level}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#737373]">
                  Tidak ada materi yang cocok dengan pencarian &quot;{modalQuery}&quot;
                </div>
              )}
            </div>

            {/* Modal Footer Keyboard Shortcuts */}
            <div className="px-4 py-2.5 bg-[#FAFAFA] border-t border-[#ECECEC] flex items-center justify-between text-[11px] text-[#737373]">
              <span>Tekan <kbd className="px-1.5 py-0.5 bg-white border border-[#ECECEC] rounded text-[#2E2D2D] font-mono">ESC</kbd> untuk menutup</span>
              <span>Pilih materi untuk membaca</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
