'use client';

import { useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  BellIcon,
  Book01Icon,
  Award01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

export interface NotificationItem {
  id: string;
  type: "materi" | "nilai" | "tips" | "pengingat";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  linkUrl?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
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

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
  onMarkAllRead?: () => void;
}

export function NotificationModal({
  isOpen,
  onClose,
  notifications = INITIAL_NOTIFICATIONS,
  onMarkAllRead,
}: NotificationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center md:items-center p-0 md:p-4 animate-in fade-in duration-200 overscroll-contain">
      {/* Backdrop Listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Notification Sheet (Mobile Bottom Sheet & Desktop Dialog) */}
      <div className="relative w-full max-w-md bg-white border-t md:border border-[#ECECEC] rounded-t-[20px] rounded-b-none md:rounded-[16px] overflow-hidden flex flex-col px-6 pt-3 md:pt-5 pb-4 space-y-3 z-10 animate-in slide-in-from-bottom duration-300 md:animate-in md:fade-in md:zoom-in-95 md:duration-150">
        {/* Drag Handle Indicator for Mobile */}
        <div className="w-12 h-1.5 bg-[#D4D4D4] rounded-full mx-auto mb-1 md:hidden shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#2E2D2D]">Notifikasi</h3>
            {unreadCount > 0 && (
              <span className="bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Tutup Notifikasi"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </button>
        </div>

        {/* Notifications — Plain List */}
        <div className="max-h-[380px] overflow-y-auto -mx-1 scrollbar-thin" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ECECEC transparent' }}>
          {notifications.map((item) => (
            <Link
              key={item.id}
              href={item.linkUrl || "#"}
              onClick={onClose}
              className="flex items-start gap-3 px-3 py-3 hover:bg-[#F6F5FF] transition-colors duration-150 rounded-[8px] cursor-pointer"
            >
              {/* Type Icon */}
              <div className="shrink-0 mt-0.5">
                <HugeiconsIcon
                  icon={
                    item.type === "materi"
                      ? Book01Icon
                      : item.type === "nilai"
                      ? Award01Icon
                      : item.type === "tips"
                      ? SparklesIcon
                      : BellIcon
                  }
                  size={16}
                  className={!item.isRead ? "text-[#2563EB]" : "text-[#2E2D2D]"}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs leading-tight truncate ${!item.isRead ? "font-semibold text-[#2563EB]" : "font-medium text-[#2E2D2D]"}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[#AAAAAA] shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs leading-relaxed line-clamp-2 text-[#737373] font-medium">
                  {item.message}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Modal Footer — Tandai dibaca only, aligned right */}
        <div className="flex items-center justify-end text-xs">
          {onMarkAllRead && unreadCount > 0 ? (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
            >
              Tandai semua dibaca
            </button>
          ) : (
            <span className="text-[#AAAAAA] text-[11px]">Semua notifikasi telah dibaca</span>
          )}
        </div>
      </div>
    </div>
  );
}
