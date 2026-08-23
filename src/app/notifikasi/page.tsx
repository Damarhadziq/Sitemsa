'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { HugeiconsIcon } from "@hugeicons/react";
import { BellIcon } from "@hugeicons/core-free-icons";
import { ArrowLeft } from "lucide-react";
import {
  getStoredNotifications,
  markAllNotificationsRead,
  markNotificationAsRead,
  getNotificationIcon,
  AppNotification,
} from "@/services/notification.service";

export default function NotifikasiPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<"semua" | "unread">("semua");

  useEffect(() => {
    setNotifications(getStoredNotifications());

    const handleUpdate = () => {
      setNotifications(getStoredNotifications());
    };

    window.addEventListener("sintesa-notifications-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("sintesa-notifications-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
  };

  const handleMarkItemRead = (id: string) => {
    const updated = markNotificationAsRead(id);
    setNotifications(updated);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 sm:pb-32 md:pb-16 w-full flex-1 space-y-6">
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

        {/* Headline Section */}
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

        {/* Notification List Styled Exactly Matching Desktop Notification Modal */}
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
              <Link
                key={item.id}
                href={item.linkUrl || "#"}
                onClick={() => handleMarkItemRead(item.id)}
                className="flex items-start gap-3 py-3.5 px-3 -mx-3 hover:bg-[#F6F5FF] transition-colors duration-150 rounded-[10px] cursor-pointer group"
              >
                {/* Type Icon (Matching Desktop Modal Style: clean outline icon, blue on unread) */}
                <div className="shrink-0 mt-0.5">
                  <HugeiconsIcon
                    icon={getNotificationIcon(item.type)}
                    size={18}
                    className={!item.isRead ? "text-[#2563EB]" : "text-[#737373]"}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2
                      className={`text-sm leading-tight truncate transition-colors ${
                        !item.isRead ? "font-bold text-[#2563EB]" : "font-semibold text-[#2E2D2D] group-hover:text-[#2563EB]"
                      }`}
                    >
                      {item.title}
                    </h2>
                    <span className="text-[11px] text-[#AAAAAA] shrink-0 font-normal">
                      {item.time}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-[#737373] line-clamp-2">
                    {item.message}
                  </p>
                </div>
              </Link>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
