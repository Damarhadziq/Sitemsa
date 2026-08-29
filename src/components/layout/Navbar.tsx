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
import { NotificationModal } from "@/components/layout/NotificationModal";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { useAuth } from "@/lib/auth-context";
import {
  getStoredNotifications,
  markAllNotificationsRead,
  AppNotification,
} from "@/services/notification.service";
import {
  getStudentProfile,
  DEFAULT_DUMMY_STUDENT,
  StudentProfile,
  isStudentAuthenticated,
  logoutStudent,
  syncFromUrlParamsOrSupabase,
} from "@/services/student-profile.service";

interface QuickSearchResult {
  id: number;
  subject: string;
  title: string;
  level: string;
  icon: IconSvgElement;
}

const QUICK_SEARCH_DATA: QuickSearchResult[] = [
  { id: 7, subject: "Bimbingan Konseling", title: "Yuk, Lawan Rasa Malas: Self-Management", level: "Pemula", icon: UserGroupIcon },
  { id: 8, subject: "Bimbingan Konseling", title: "Talent Quest: Temukan Potensimu", level: "Pemula", icon: UserGroupIcon },
  { id: 16, subject: "Bimbingan Konseling", title: "Jati Diri Tanpa Kenakalan", level: "Menengah", icon: UserGroupIcon },
  { id: 17, subject: "Bimbingan Konseling", title: "Membangun Konsep Diri Positif", level: "Pemula", icon: UserGroupIcon },
  { id: 18, subject: "Bimbingan Konseling", title: "Personal Branding: Membangun Citra Diri", level: "Pemula", icon: UserGroupIcon },
  { id: 19, subject: "Bimbingan Konseling", title: "Persiapan Magang dan Etika di Dunia Kerja", level: "Menengah", icon: UserGroupIcon },
  { id: 9, subject: "Seni Tari", title: "Konsep Koreografi dalam Seni Tari", level: "Pemula", icon: MusicNote01Icon },
  { id: 10, subject: "Seni Tari", title: "Koreografi: Eksplorasi Gerak Dalam Seni Tari", level: "Pemula", icon: MusicNote01Icon },
  { id: 12, subject: "Seni Tari", title: "Koreografi: Komposisi Gerak Tari", level: "Menengah", icon: MusicNote01Icon },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavFocused, setIsNavFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalQuery, setModalQuery] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const modalInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<ProfileTab>("profile");
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DEFAULT_DUMMY_STUDENT);

  useEffect(() => {
    syncFromUrlParamsOrSupabase().then(() => {
      setIsLoggedIn(isStudentAuthenticated() || !!user);
      setStudentProfile(getStudentProfile());
    });

    setIsLoggedIn(isStudentAuthenticated() || !!user);
    setNotifications(getStoredNotifications());
    setStudentProfile(getStudentProfile());

    const handleNotifUpdate = () => {
      setNotifications(getStoredNotifications());
    };

    const handleProfileUpdate = () => {
      setStudentProfile(getStudentProfile());
    };

    const handleAuthCheck = () => {
      setIsLoggedIn(isStudentAuthenticated() || !!user);
      setStudentProfile(getStudentProfile());
    };

    const handleLogoutStart = () => {
      setIsLoggingOut(true);
    };

    window.addEventListener("sintesa-notifications-updated", handleNotifUpdate);
    window.addEventListener("sintesa-student-profile-updated", handleProfileUpdate);
    window.addEventListener("sintesa-student-auth-changed", handleAuthCheck);
    window.addEventListener("sintesa-logging-out", handleLogoutStart);
    window.addEventListener("storage", handleNotifUpdate);

    return () => {
      window.removeEventListener("sintesa-notifications-updated", handleNotifUpdate);
      window.removeEventListener("sintesa-student-profile-updated", handleProfileUpdate);
      window.removeEventListener("sintesa-student-auth-changed", handleAuthCheck);
      window.removeEventListener("sintesa-logging-out", handleLogoutStart);
      window.removeEventListener("storage", handleNotifUpdate);
    };
  }, [user]);

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
  };

  const openProfileModalTab = (tab: ProfileTab) => {
    setProfileModalTab(tab);
    setIsProfileModalOpen(true);
    setIsProfileOpen(false);
  };

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
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2563EB] after:rounded-full"
                    : "text-[#8E8E8E] hover:text-[#2E2D2D]"
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/materi"
                className={`text-sm font-medium relative py-1 transition-colors duration-200 ${
                  pathname.startsWith("/materi")
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2563EB] after:rounded-full"
                    : "text-[#8E8E8E] hover:text-[#2E2D2D]"
                }`}
              >
                Materi
              </Link>
              <Link
                href="/tips-belajar"
                className={`text-sm font-medium relative py-1 transition-colors duration-200 ${
                  pathname.startsWith("/tips-belajar")
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2563EB] after:rounded-full"
                    : "text-[#8E8E8E] hover:text-[#2E2D2D]"
                }`}
              >
                Tips Belajar
              </Link>
              <Link
                href="/dokumentasi"
                className={`text-sm font-medium relative py-1 transition-colors duration-200 ${
                  pathname.startsWith("/dokumentasi")
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2563EB] after:rounded-full"
                    : "text-[#8E8E8E] hover:text-[#2E2D2D]"
                }`}
              >
                Dokumentasi
              </Link>
              <Link
                href="/team"
                className={`text-sm font-medium relative py-1 transition-colors duration-200 ${
                  pathname.startsWith("/team")
                    ? "text-[#2E2D2D] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2563EB] after:rounded-full"
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
                className="w-full h-9 pl-9 pr-3 bg-[#F3F3F3] rounded-[8px] text-xs text-[#2E2D2D] placeholder:text-[#AAAAAA] border border-transparent hover:border-[#2563EB]/30 outline-none transition-all duration-200 cursor-pointer"
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
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#2563EB] border-2 border-white animate-pulse" />
              )}
            </button>

            {/* 3. User Profile Avatar or Login Button */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center shrink-0 p-[1px] ${
                    isProfileOpen ? "ring-2 ring-[#2563EB]" : "hover:ring-2 hover:ring-[#2563EB]/50"
                  }`}
                  aria-label="Profil Pengguna"
                >
                  <InitialsAvatar
                    name={studentProfile.name}
                    avatar={studentProfile.avatar}
                    sizeClass="w-full h-full"
                    textSizeClass="text-[11px]"
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white border border-[#ECECEC] rounded-[12px] p-2 z-50 origin-top-right animate-in fade-in slide-in-from-top-1 duration-150 shadow-md">
                    <div className="p-3 bg-[#F9F9FF] rounded-[8px] mb-1.5 flex items-center gap-3">
                      <InitialsAvatar
                        name={studentProfile.name}
                        avatar={studentProfile.avatar}
                        sizeClass="w-10 h-10"
                        textSizeClass="text-xs"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-[#2E2D2D] truncate">{studentProfile.name}</p>
                        <p className="text-[11px] text-[#737373] truncate">{studentProfile.email}</p>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => openProfileModalTab("profile")}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#2E2D2D] hover:bg-[#F6F5FF] hover:text-[#2563EB] rounded-[6px] transition-colors text-left cursor-pointer"
                      >
                        <HugeiconsIcon icon={UserIcon} size={16} />
                        Profil Saya
                      </button>

                      <button
                        type="button"
                        onClick={() => openProfileModalTab("history")}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#2E2D2D] hover:bg-[#F6F5FF] hover:text-[#2563EB] rounded-[6px] transition-colors text-left cursor-pointer"
                      >
                        <HugeiconsIcon icon={Clock01Icon} size={16} />
                        Riwayat Belajar
                      </button>
                    </div>

                    <div className="my-1 border-t border-[#ECECEC]" />

                    <button
                      type="button"
                      onClick={async () => {
                        setIsLoggingOut(true);
                        setIsProfileOpen(false);
                        window.dispatchEvent(new Event('sintesa-logging-out'));
                        await logoutStudent();
                        logout();
                        window.location.href = '/login';
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-[6px] transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon icon={Logout01Icon} size={16} />
                      Keluar dari Akun
                    </button>
                  </div>
                )}
              </div>
            ) : isLoggingOut ? (
              <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-[8px]" />
            ) : (
              <Link
                href="/login"
                className="h-9 px-4 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <HugeiconsIcon icon={UserIcon} size={15} />
                <span>Masuk</span>
              </Link>
            )}

          </div>
        </div>
      </header>

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
              <HugeiconsIcon icon={Search01Icon} size={20} className="text-[#2563EB] shrink-0" />
              <input
                ref={modalInputRef}
                type="text"
                placeholder="Ketik nama materi, topik, atau modul..."
                value={modalQuery}
                onChange={(e) => setModalQuery(e.target.value)}
                className="w-full bg-transparent text-base md:text-sm text-[#2E2D2D] placeholder:text-[#AAAAAA] outline-none font-medium"
              />
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-white border border-[#ECECEC] text-[#737373] hover:text-[#2563EB] hover:bg-[#F6F5FF] hover:border-[#2563EB]/40 flex items-center justify-center transition-all shrink-0 cursor-pointer"
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
                  className="px-2.5 py-1 rounded-[5px] bg-white border border-[#ECECEC] text-[11px] font-medium text-[#2E2D2D] hover:bg-[#F4EFFF] hover:text-[#2563EB] transition-all shrink-0 cursor-pointer"
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
                    className="w-full text-left p-3 rounded-[8px] hover:bg-[#F6F5FF] border border-transparent hover:border-[#2563EB]/30 flex items-center justify-between transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-[6px] bg-[#F4EFFF] text-[#2563EB] flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={item.icon} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] text-[10px] font-semibold inline-block mb-0.5">
                          {item.subject}
                        </span>
                        <h4 className="text-xs md:text-sm font-semibold text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors truncate">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                        {item.level}
                      </span>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity" />
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

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </>
  );
}
