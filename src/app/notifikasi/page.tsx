'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
  BellIcon,
  BookOpen01Icon,
  Task01Icon,
  SparklesIcon,
  Settings02Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { ArrowLeft } from "lucide-react";

export interface NotificationPageItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: "materi" | "kuis" | "system" | "promo";
  icon: IconSvgElement;
  linkUrl?: string;
}

const INITIAL_NOTIFICATIONS: NotificationPageItem[] = [
  {
    id: 1,
    title: "Materi Baru Ditambahkan!",
    description: "Modul Informatika 'Pengenalan Kecerdasan Buatan & Machine Learning' sekarang dapat dipelajari di katalog materi utama Sitemsa.",
    timestamp: "10 menit yang lalu",
    isRead: false,
    type: "materi",
    icon: BookOpen01Icon,
    linkUrl: "/materi/1",
  },
  {
    id: 2,
    title: "Pengingat Kuis Mingguan",
    description: "Jangan lupa selesaikan kuis 'Struktur Percabangan (If-Else & Switch)' untuk menjaga streak belajarmu minggu ini.",
    timestamp: "1 jam yang lalu",
    isRead: false,
    type: "kuis",
    icon: Task01Icon,
    linkUrl: "/materi/2",
  },
  {
    id: 3,
    title: "Pemberitahuan Sistem",
    description: "Pembaruan platform Sitemsa v2.4 telah diterapkan dengan peningkatan performa, pembaruan responsif mobile, dan UI baru.",
    timestamp: "Kemarin, 14:30",
    isRead: true,
    type: "system",
    icon: Settings02Icon,
    linkUrl: "#",
  },
  {
    id: 4,
    title: "Fitur Baru: Tips Belajar Pomodoro",
    description: "Pelajari strategi efektif mengelola waktu belajar dengan metode Pomodoro di kanal Tips Belajar resmi Sitemsa.",
    timestamp: "2 hari yang lalu",
    isRead: true,
    type: "promo",
    icon: SparklesIcon,
    linkUrl: "/tips-belajar?id=2",
  },
];

export default function NotifikasiPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationPageItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<"semua" | "unread">("semua");

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full flex-1 space-y-6">
        {/* Sticky Fixed Arrow Back Button (Matching Tips & Dokumentasi Detail) */}
        <div className="sticky top-20 z-30 pt-1 pb-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/90 border border-[#ECECEC] text-[#2E2D2D] hover:text-[#2563EB] hover:bg-white shadow-2xs transition-all cursor-pointer flex items-center justify-center"
            aria-label="Kembali"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Headline Section (Under arrow, title + label, no subtitle, no divider line) */}
        <header className="space-y-4 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2E2D2D] tracking-tight">
              Notifikasi
            </h1>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-[#2563EB] hover:underline transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveFilter("semua")}
              className={`px-3.5 py-1.5 rounded-[6px] text-xs font-medium transition-all cursor-pointer ${
                activeFilter === "semua"
                  ? "bg-[#2563EB] text-white"
                  : "bg-[#FAFAFA] border border-[#ECECEC] text-[#737373] hover:text-[#2E2D2D]"
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("unread")}
              className={`px-3.5 py-1.5 rounded-[6px] text-xs font-medium transition-all cursor-pointer ${
                activeFilter === "unread"
                  ? "bg-[#2563EB] text-white"
                  : "bg-[#FAFAFA] border border-[#ECECEC] text-[#737373] hover:text-[#2E2D2D]"
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>
        </header>

        {/* Notification Direct Canvas List (Frameless, clean dividers, blue title and icon on unread) */}
        <section className="pt-2 divide-y divide-[#ECECEC]">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F4EFFF] text-[#2563EB] mx-auto flex items-center justify-center">
                <HugeiconsIcon icon={BellIcon} size={24} />
              </div>
              <h3 className="text-sm font-bold text-[#2E2D2D]">Tidak ada notifikasi</h3>
              <p className="text-xs text-[#737373] max-w-sm mx-auto">
                {activeFilter === "unread"
                  ? "Semua notifikasi kamu sudah dibaca."
                  : "Kamu belum menerima notifikasi terbaru."}
              </p>
            </div>
          ) : (
            filteredNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkAsRead(item.id)}
                className="py-4.5 px-2.5 -mx-2.5 rounded-[10px] hover:bg-slate-50/80 transition-colors duration-150 flex items-start gap-3.5 cursor-pointer group"
              >
                {/* Type Icon (Blue when unread, subtle neutral when read) */}
                <div
                  className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    item.isRead
                      ? "bg-[#F3F3F3] text-[#737373]"
                      : "bg-[#2563EB] text-white shadow-2xs"
                  }`}
                >
                  <HugeiconsIcon icon={item.icon} size={20} />
                </div>

                {/* Notification Text Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h2
                    className={`text-sm leading-snug truncate transition-colors ${
                      item.isRead
                        ? "font-semibold text-[#2E2D2D] group-hover:text-[#2563EB]"
                        : "font-bold text-[#2563EB]"
                    }`}
                  >
                    {item.title}
                  </h2>

                  {/* Description: Max 2 lines with ellipsis */}
                  <p className="text-xs text-[#737373] leading-relaxed font-normal line-clamp-2">
                    {item.description}
                  </p>

                  {/* Timestamp placed at bottom */}
                  <span className="text-[11px] text-[#888888] font-medium block pt-0.5">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
