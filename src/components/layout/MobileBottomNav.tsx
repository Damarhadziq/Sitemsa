'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  BookOpen01Icon,
  SparklesIcon,
  File01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide bottom bar on notifikasi, material detail reading page, quiz taking page, login, or admin routes
  if (
    pathname.startsWith("/kuis") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/notifikasi") ||
    (pathname.startsWith("/materi/") && pathname !== "/materi")
  ) {
    return null;
  }

  const NAV_ITEMS = [
    {
      label: "Beranda",
      href: "/",
      icon: Home01Icon,
      isActive: pathname === "/",
    },
    {
      label: "Materi",
      href: "/materi",
      icon: BookOpen01Icon,
      isActive: pathname === "/materi",
    },
    {
      label: "Tips",
      href: "/tips-belajar",
      icon: SparklesIcon,
      isActive: pathname.startsWith("/tips-belajar"),
    },
    {
      label: "Dokumentasi",
      href: "/dokumentasi",
      icon: File01Icon,
      isActive: pathname.startsWith("/dokumentasi"),
    },
    {
      label: "Tim",
      href: "/team",
      icon: UserGroupIcon,
      isActive: pathname.startsWith("/team"),
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECECEC] px-2 py-3 shadow-none"
    >
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1.5 py-1 px-1 w-full rounded-[10px] transition-all duration-200 cursor-pointer ${
                active
                  ? "text-[#2563EB]"
                  : "text-[#737373] hover:text-[#2E2D2D] active:scale-95"
              }`}
            >
              <div
                className={`flex items-center justify-center transition-transform duration-200 ${
                  active ? "scale-110" : ""
                }`}
              >
                <HugeiconsIcon icon={item.icon} size={20} />
              </div>
              <span
                className={`text-[10px] leading-none tracking-tight transition-all duration-200 ${
                  active ? "font-bold text-[#2563EB]" : "font-medium text-[#737373]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
