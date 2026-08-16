'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  BellIcon,
  BookOpen01Icon,
  Task01Icon,
  SparklesIcon,
  Settings02Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

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
    description: "Modul Informatika 'Pengenalan Kecerdasan Buatan & Machine Learning' sekarang dapat dipelajari.",
    timestamp: "10 menit yang lalu",
    isRead: false,
    type: "materi",
    icon: BookOpen01Icon,
    linkUrl: "/materi/1",
  },
  {
    id: 2,
    title: "Pengingat Kuis Mingguan",
    description: "Jangan lupa selesaikan kuis 'Struktur Percabangan (If-Else & Switch)' untuk menjaga streak belajarmu.",
    timestamp: "1 jam yang lalu",
    isRead: false,
    type: "kuis",
    icon: Task01Icon,
    linkUrl: "/materi/2",
  },
  {
    id: 3,
    title: "Pemberitahuan Sistem",
    description: "Pembaruan platform Sitemsa v2.4 telah diterapkan dengan peningkatan performa dan UI baru.",
    timestamp: "Kemarin, 14:30",
    isRead: true,
    type: "system",
    icon: Settings02Icon,
    linkUrl: "#",
  },
  {
    id: 4,
    title: "Fitur Baru: Tips Belajar Pomodoro",
    description: "Pelajari strategi efektif mengelola waktu belajar dengan metode Pomodoro di kanal Tips Belajar.",
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
        {/* Top Action Header */}
        <section className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#ECECEC]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#2E2D2D] hover:text-[#2563EB] hover:bg-[#F6F5FF] flex items-center justify-center transition-all shrink-0 cursor-pointer"
              aria-label="Kembali"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-[#2E2D2D]">Notifikasi</h1>
                {unreadCount > 0 && (
                  <span className="bg-[#2563EB] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <p className="text-xs text-[#737373] mt-0.5">
                Pantau pembaruan materi, jadwal kuis, dan pengumuman sistem
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3.5 py-1.5 rounded-[6px] bg-[#F4EFFF] border border-[#2563EB]/30 text-[#2563EB] hover:bg-[#2563EB] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <HugeiconsIcon icon={Tick01Icon} size={14} />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}
        </section>

        {/* Filter Pills */}
        <section className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter("semua")}
            className={`px-3.5 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
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
            className={`px-3.5 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
              activeFilter === "unread"
                ? "bg-[#2563EB] text-white"
                : "bg-[#FAFAFA] border border-[#ECECEC] text-[#737373] hover:text-[#2E2D2D]"
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </section>

        {/* Notification List */}
        <section className="space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="p-12 text-center bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px] space-y-3">
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
                className={`p-4 rounded-[12px] border transition-all duration-200 flex items-start gap-4 cursor-pointer group ${
                  item.isRead
                    ? "bg-white border-[#ECECEC] hover:border-[#2563EB]/30"
                    : "bg-[#F6F5FF] border-[#2563EB]/30 hover:border-[#2563EB]"
                }`}
              >
                {/* Type Icon */}
                <div
                  className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5 ${
                    item.isRead
                      ? "bg-[#FAFAFA] text-[#737373] border border-[#ECECEC]"
                      : "bg-[#2563EB] text-white"
                  }`}
                >
                  <HugeiconsIcon icon={item.icon} size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      className={`text-sm font-semibold leading-snug truncate ${
                        item.isRead ? "text-[#2E2D2D]" : "text-[#2563EB]"
                      }`}
                    >
                      {item.title}
                    </h2>
                    <span className="text-[11px] text-[#737373] shrink-0 font-medium">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#737373] leading-relaxed">
                    {item.description}
                  </p>

                  {item.linkUrl && item.linkUrl !== "#" && (
                    <div className="pt-2">
                      <Link
                        href={item.linkUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
                      >
                        Buka Selengkapnya &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                {/* Unread dot */}
                {!item.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
