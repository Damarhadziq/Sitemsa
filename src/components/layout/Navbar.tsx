'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  UserIcon,
  Clock01Icon,
  Settings02Icon,
  Logout01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

import { UserProfileModal, ProfileTab } from "@/components/profile/UserProfileModal";
import { NotificationModal, NotificationItem } from "@/components/layout/NotificationModal";

interface QuickSearchResult {
  id: number;
  subject: string;
  title: string;
  level: string;
  icon: IconSvgElement;
}

const INITIAL_NAV_NOTIFS: NotificationItem[] = [
  {
    id: "n1",
    type: "materi",
    title: "Modul Praktik Baru Rilis",
    message: "Pak Herman Susilo menambahkan modul baru 'Analisis Sirkuit Seri & Paralel Resistor'.",
    time: "10 menit lalu",
    isRead: false,
    linkUrl: "/materi/2",
  },
  {
    id: "n2",
    type: "nilai",
    title: "Nilai Kuis Berhasil Tercatat",
    message: "Selamat! Kuis 'Operasi Logika & Tabel Kebenaran' milikmu mendapat skor 100/100.",
    time: "1 jam lalu",
    isRead: false,
    linkUrl: "/materi/1",
  },
  {
    id: "n3",
    type: "tips",
    title: "Tips Belajar Terbaru",
    message: "Artikel '5 Strategi Efektif Menguasai Logika Pemrograman' kini siap dibaca.",
    time: "3 jam lalu",
    isRead: false,
    linkUrl: "/tips-belajar?id=1",
  },
  {
    id: "n4",
    type: "pengingat",
    title: "Pengingat Asesmen Vokasi",
    message: "Jangan lupa menyelesaikan laporan praktikum multimeter digital sebelum hari esok.",
    time: "Kemarin",
    isRead: true,
    linkUrl: "/materi/2",
  },
];

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalQuery, setModalQuery] = useState("");

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<ProfileTab>("profile");
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NAV_NOTIFS);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const openProfileModalTab = (tab: ProfileTab) => {
    setProfileModalTab(tab);
    setIsProfileModalOpen(true);
    setIsProfileOpen(false);
  };
  const pathname = usePathname();
  const router = useRouter();
  const modalInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      setTimeout(() => modalInputRef.current?.focus(), 50);
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
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
    handleCloseModal();
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
                href="/tips-belajar"
                className={`text-sm font-medium relative py-1 transition-colors duration-200 ${
                  pathname.startsWith("/tips-belajar")
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0400F4] after:rounded-full"
                    : "text-[#8E8E8E] hover:text-[#2E2D2D]"
                }`}
              >
                Tips Belajar
              </Link>
              <Link
                href="/dokumentasi"
                className={`text-sm font-medium relative py-1 transition-colors duration-200 ${
                  pathname.startsWith("/dokumentasi")
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0400F4] after:rounded-full"
                    : "text-[#8E8E8E] hover:text-[#2E2D2D]"
                }`}
              >
                Dokumentasi
              </Link>
              <Link
                href="/team"
                className={`text-sm font-medium relative py-1 transition-colors duration-200 ${
                  pathname.startsWith("/team")
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0400F4] after:rounded-full"
                    : "text-[#8E8E8E] hover:text-[#2E2D2D]"
                }`}
              >
                Tim
              </Link>
            </nav>
          </div>

          {/* Right: Search Bar (Desktop Input / Mobile Icon) > Notification > Profile Avatar > Mobile Menu */}
          <div className="flex items-center gap-2.5">
            {/* 1a. Desktop Search Bar Input Trigger */}
            <div className="hidden md:block relative w-52 lg:w-60">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] flex items-center pointer-events-none">
                <HugeiconsIcon icon={Search01Icon} size={16} />
              </div>
              <input
                type="text"
                placeholder="Cari materi..."
                onClick={() => setIsModalOpen(true)}
                onFocus={() => setIsModalOpen(true)}
                readOnly
                className="w-full h-9 pl-9 pr-3 bg-[#F3F3F3] rounded-[8px] text-xs text-[#2E2D2D] placeholder:text-[#AAAAAA] border border-transparent hover:border-[#0400F4]/30 outline-none transition-all duration-200 cursor-pointer"
              />
            </div>

            {/* 1b. Mobile Search Icon Button Trigger */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-[#2E2D2D] hover:bg-gray-100/80 active:scale-95 transition-all duration-200 rounded-[8px] cursor-pointer"
              aria-label="Cari Materi"
              title="Cari Materi"
            >
              <HugeiconsIcon icon={Search01Icon} size={20} />
            </button>

            {/* 2. Notification Button */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  router.push("/notifikasi");
                } else {
                  setIsNotifModalOpen(true);
                }
              }}
              className="relative w-9 h-9 flex items-center justify-center text-[#2E2D2D] hover:bg-gray-100/80 active:scale-95 transition-all duration-200 rounded-[8px] cursor-pointer"
              aria-label="Notifikasi"
            >
              <HugeiconsIcon icon={BellIcon} size={20} />
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#0400F4] border-2 border-white animate-pulse" />
              )}
            </button>

            {/* 3. User Profile Avatar */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-9 h-9 rounded-full border overflow-hidden transition-colors duration-200 flex items-center justify-center shrink-0 ${
                  isProfileOpen ? "border-[#0400F4] bg-[#F4EFFF]" : "border-[#ECECEC] hover:border-[#0400F4]"
                }`}
                aria-label="Profil Pengguna"
              >
                <Image
                  src="https://i.pravatar.cc/100?img=12"
                  alt="Budi Santoso"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full rounded-full"
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white border border-[#ECECEC] rounded-[12px] p-2 z-50 origin-top-right animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-3 bg-[#F9F9FF] rounded-[8px] mb-1.5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 border border-[#ECECEC]">
                      <Image
                        src="https://i.pravatar.cc/100?img=12"
                        alt="Budi Santoso"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-[#2E2D2D] truncate">Budi Santoso</p>
                      <p className="text-[11px] text-[#737373] truncate">budi@siswa.belajar.id</p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => openProfileModalTab("profile")}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#2E2D2D] hover:bg-[#F6F5FF] hover:text-[#0400F4] rounded-[6px] transition-colors text-left cursor-pointer"
                    >
                      <HugeiconsIcon icon={UserIcon} size={16} />
                      Profil Saya
                    </button>

                    <button
                      type="button"
                      onClick={() => openProfileModalTab("history")}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#2E2D2D] hover:bg-[#F6F5FF] hover:text-[#0400F4] rounded-[6px] transition-colors text-left cursor-pointer"
                    >
                      <HugeiconsIcon icon={Clock01Icon} size={16} />
                      Riwayat Belajar
                    </button>
                  </div>

                  <div className="my-1 border-t border-[#ECECEC]" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      router.push('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-[6px] transition-colors cursor-pointer"
                  >
                    <HugeiconsIcon icon={Logout01Icon} size={16} />
                    Keluar dari Akun
                  </button>
                </div>
              )}
            </div>

            {/* 4. Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 md:hidden flex items-center justify-center text-[#2E2D2D] hover:bg-gray-100/80 active:scale-95 transition-all duration-200 rounded-[8px] cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              <HugeiconsIcon icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon} size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Side Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col p-6 animate-in slide-in-from-right duration-200 overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#ECECEC]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-[#292929] tracking-tight"
            >
              Sitemsa
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white border border-[#ECECEC] text-[#737373] hover:text-[#0400F4] hover:bg-[#F6F5FF] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Tutup Menu"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={20} />
            </button>
          </div>

          {/* Navigation Links - Text only, active item in blue font */}
          <nav className="flex flex-col py-6 space-y-2 flex-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-3.5 border-b border-gray-100 text-lg transition-colors ${
                pathname === "/"
                  ? "text-[#0400F4] font-bold"
                  : "text-[#2E2D2D] font-medium hover:text-[#0400F4]"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/materi"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-3.5 border-b border-gray-100 text-lg transition-colors ${
                pathname.startsWith("/materi")
                  ? "text-[#0400F4] font-bold"
                  : "text-[#2E2D2D] font-medium hover:text-[#0400F4]"
              }`}
            >
              Materi
            </Link>
            <Link
              href="/tips-belajar"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-3.5 border-b border-gray-100 text-lg transition-colors ${
                pathname.startsWith("/tips-belajar")
                  ? "text-[#0400F4] font-bold"
                  : "text-[#2E2D2D] font-medium hover:text-[#0400F4]"
              }`}
            >
              Tips Belajar
            </Link>
            <Link
              href="/dokumentasi"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-3.5 border-b border-gray-100 text-lg transition-colors ${
                pathname.startsWith("/dokumentasi")
                  ? "text-[#0400F4] font-bold"
                  : "text-[#2E2D2D] font-medium hover:text-[#0400F4]"
              }`}
            >
              Dokumentasi
            </Link>
            <Link
              href="/team"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-3.5 border-b border-gray-100 text-lg transition-colors ${
                pathname.startsWith("/team")
                  ? "text-[#0400F4] font-bold"
                  : "text-[#2E2D2D] font-medium hover:text-[#0400F4]"
              }`}
            >
              Tim
            </Link>
          </nav>
        </div>
      )}

      {/* Spotlight Command Palette Modal (Centered Spotlight Card with Dark Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150 overscroll-contain">
          {/* Backdrop Click Listener */}
          <div
            className="absolute inset-0"
            onClick={handleCloseModal}
          />

          {/* Centered Modal Card */}
          <div className="relative w-full max-w-xl bg-white border border-[#ECECEC] rounded-[14px] overflow-hidden space-y-0 z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Input Row */}
            <div className="p-4 border-b border-[#ECECEC] flex items-center gap-3 bg-[#FAFAFA]">
              <HugeiconsIcon icon={Search01Icon} size={20} className="text-[#0400F4] shrink-0" />
              <input
                ref={modalInputRef}
                type="text"
                placeholder="Ketik nama materi, topik, atau modul..."
                value={modalQuery}
                onChange={(e) => setModalQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#2E2D2D] placeholder:text-[#AAAAAA] outline-none font-medium"
              />
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-white border border-[#ECECEC] text-[#737373] hover:text-[#0400F4] hover:bg-[#F6F5FF] hover:border-[#0400F4]/40 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                aria-label="Tutup Pencarian"
                title="Tutup Pencarian"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
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
                  className="px-2.5 py-1 rounded-[5px] bg-white border border-[#ECECEC] text-[11px] font-medium text-[#2E2D2D] hover:bg-[#F4EFFF] hover:text-[#0400F4] transition-all shrink-0 cursor-pointer"
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
                    className="w-full text-left p-3 rounded-[8px] hover:bg-[#F6F5FF] border border-transparent hover:border-[#0400F4]/30 flex items-center justify-between transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-[6px] bg-[#F4EFFF] text-[#0400F4] flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={item.icon} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="bg-[#E8E7FF] text-[#0400F4] px-2 py-0.5 rounded-[4px] text-[10px] font-semibold inline-block mb-0.5">
                          {item.subject}
                        </span>
                        <h4 className="text-xs md:text-sm font-semibold text-[#2E2D2D] group-hover:text-[#0400F4] transition-colors truncate">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                        {item.level}
                      </span>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-[#0400F4] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#737373]">
                  Tidak ada materi yang cocok dengan pencarian "{modalQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Profile & Settings Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialTab={profileModalTab}
      />

      {/* Notification Center Modal (With In/Out Light Animations) */}
      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
}
