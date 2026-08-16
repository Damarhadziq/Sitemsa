'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function AdminSidebar() {
  const pathname = usePathname();
  const { role } = useAuth();

  const isSuperadmin = role === 'superadmin';

  const superadminNav = [
    { name: 'Dashboard', href: '/admin/superadmin', icon: LayoutDashboard },
    { name: 'Manajemen Guru', href: '/admin/superadmin/guru', icon: Users },
    { name: 'Konten Website', href: '/admin/superadmin/konten', icon: FileText },
    { name: 'Monitoring Siswa', href: '/admin/superadmin/siswa', icon: GraduationCap },
  ];

  const guruNav = [
    { name: 'Dashboard Guru', href: '/admin/guru', icon: LayoutDashboard },
    { name: 'Modul & Kuis', href: '/admin/guru/pelajaran', icon: BookOpen },
    { name: 'Monitoring Siswa', href: '/admin/guru/monitoring', icon: GraduationCap },
  ];

  const navItems = isSuperadmin ? superadminNav : guruNav;

  return (
    <aside className="w-64 bg-white border-r border-[#ECECEC] flex flex-col justify-between h-screen sticky top-0 font-sans z-40 shrink-0">
      <div>
        {/* Brand Logo Only (Strictly no icon box, no subtitle) */}
        <div className="h-16 px-6 flex items-center border-b border-[#ECECEC]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#2E2D2D] tracking-tight">
              Sitemsa
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#737373] hover:bg-slate-50 hover:text-[#2E2D2D]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#737373]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="p-6 border-t border-[#ECECEC]">
        <p className="text-[11px] text-[#AAAAAA] leading-relaxed">
          &copy; 2026 Sitemsa. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
