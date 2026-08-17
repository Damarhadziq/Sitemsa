'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  FileCode,
  Play,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore } from '@/lib/admin-store';

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentItemParam = searchParams.get('item');

  const { role, activeSubjectFilter, user } = useAuth();
  const { modules, quizzes } = useAdminStore();

  const isSuperadmin = role === 'superadmin';
  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  // State for collapsible tree in sidebar
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);

  // Filter modules & quizzes for active subject
  const currentModules = modules.filter((m) => m.subject === currentSubject);
  const currentQuizzes = quizzes.filter((q) => q.subject === currentSubject);

  const superadminNav = [
    { name: 'Dashboard', href: '/admin/superadmin', icon: LayoutDashboard },
    { name: 'Manajemen Guru', href: '/admin/superadmin/guru', icon: Users },
    { name: 'Konten Website', href: '/admin/superadmin/konten', icon: FileText },
    { name: 'Monitoring Siswa', href: '/admin/superadmin/siswa', icon: GraduationCap },
  ];

  const isPelajaranActive = pathname === '/admin/guru/pelajaran';
  const isLandingActive = isPelajaranActive && !currentItemParam;

  return (
    <aside className="w-64 bg-white border-r border-[#ECECEC] flex flex-col justify-between h-screen sticky top-0 font-sans z-40 shrink-0 overflow-y-auto">
      <div>
        {/* Role-Based Brand SVG Logo (Sized compactly for header alignment) */}
        <div className="h-16 px-6 flex items-center">
          <div className="flex items-center select-none">
            {/* eslint-disable-next-next/no-img-element */}
            <img
              src={isSuperadmin ? "/logos/logo-sitemsa-superadmin.svg" : "/logos/logo-sitemsa-guru.svg"}
              alt={isSuperadmin ? "Sitemsa Superadmin" : "Sitemsa Guru"}
              className="h-6 max-h-6 max-w-[130px] object-contain object-left cursor-default"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 pt-2 space-y-1.5 text-xs">
          
          {isSuperadmin ? (
            superadminNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] font-bold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-blue-50/50 text-[#2563EB]'
                      : 'text-[#737373] hover:bg-slate-50 hover:text-[#2563EB]'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#2563EB]' : 'text-[#737373] group-hover:text-[#2563EB]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })
          ) : (
            <>
              {/* Dashboard Guru Link */}
              <Link
                href="/admin/guru"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] font-bold transition-all cursor-pointer group ${
                  pathname === '/admin/guru'
                    ? 'bg-blue-50/50 text-[#2563EB]'
                    : 'text-[#737373] hover:bg-slate-50 hover:text-[#2563EB]'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 transition-colors ${pathname === '/admin/guru' ? 'text-[#2563EB]' : 'text-[#737373] group-hover:text-[#2563EB]'}`} />
                <span>Dashboard Guru</span>
              </Link>

              {/* FIGMA COLLAPSIBLE TREE NAVIGATION */}
              <div className="space-y-1 pt-1">
                
                {/* Parent Title Row */}
                <div
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-[8px] transition-all group ${
                    isLandingActive
                      ? 'bg-blue-50/50 text-[#2563EB]'
                      : 'text-[#737373] hover:bg-slate-50 hover:text-[#2563EB]'
                  }`}
                >
                  <Link
                    href="/admin/guru/pelajaran"
                    className="flex-1 flex items-center gap-3 font-bold text-xs cursor-pointer truncate"
                  >
                    <BookOpen className={`w-4 h-4 shrink-0 transition-colors ${isLandingActive ? 'text-[#2563EB]' : 'text-[#737373] group-hover:text-[#2563EB]'}`} />
                    <span className="truncate">Modul & Kuis</span>
                  </Link>

                  <button
                    onClick={() => setIsTreeExpanded(!isTreeExpanded)}
                    title="Toggle Tree Menu"
                    className="p-0.5 hover:opacity-80 cursor-pointer ml-1"
                  >
                    {isTreeExpanded ? (
                      <ChevronDown className={`w-4 h-4 ${isLandingActive ? 'text-[#2563EB]' : 'text-[#737373] group-hover:text-[#2563EB]'}`} />
                    ) : (
                      <ChevronRight className={`w-4 h-4 ${isLandingActive ? 'text-[#2563EB]' : 'text-[#737373] group-hover:text-[#2563EB]'}`} />
                    )}
                  </button>
                </div>

                {/* EXPANDED TREE DROPDOWN CONTAINER (SMOOTH IN-OUT FADE/SLIDE ANIMATION) */}
                {isTreeExpanded && (
                  <div className="pl-3 pr-1 space-y-3 pt-1 border-l-2 border-slate-100 ml-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    
                    {/* TREE NODE 1: MATERI */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-[#737373]">
                        <ChevronDown className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Materi</span>
                        <span className="w-3.5 h-3.5 rounded-[2px] bg-blue-50 text-[#2563EB] text-[9px] font-bold flex items-center justify-center shrink-0 ml-0.5">
                          {currentModules.length}
                        </span>
                      </div>

                      <div className="pl-3 space-y-1 border-l border-slate-200/80 ml-2">
                        {currentModules.map((mod) => {
                          const isItemActive = currentItemParam === mod.id;

                          return (
                            <Link
                              key={mod.id}
                              href={`/admin/guru/pelajaran?item=${mod.id}`}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-xs transition-all truncate group ${
                                isItemActive
                                  ? 'bg-blue-50/80 text-[#2563EB] font-bold'
                                  : 'text-[#737373] hover:text-[#2563EB] hover:bg-slate-50 font-medium'
                              }`}
                            >
                              <FileCode className={`w-3.5 h-3.5 shrink-0 transition-colors ${isItemActive ? 'text-[#2563EB]' : 'text-[#737373] group-hover:text-[#2563EB]'}`} />
                              <span className="truncate">{mod.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* TREE NODE 2: KUIS */}
                    {currentQuizzes.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-[#737373]">
                          <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Kuis</span>
                          <span className="w-3.5 h-3.5 rounded-[2px] bg-indigo-50 text-indigo-600 text-[9px] font-bold flex items-center justify-center shrink-0 ml-0.5">
                            {currentQuizzes.length}
                          </span>
                        </div>

                        <div className="pl-3 space-y-1 border-l border-indigo-200 ml-2">
                          {currentQuizzes.map((qz) => {
                            const isQuizActive = currentItemParam === qz.id;

                            return (
                              <Link
                                key={qz.id}
                                href={`/admin/guru/pelajaran?item=${qz.id}`}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-xs transition-all truncate group ${
                                  isQuizActive
                                    ? 'bg-indigo-50/80 text-indigo-600 font-bold'
                                    : 'text-[#737373] hover:text-indigo-600 hover:bg-slate-50 font-medium'
                                }`}
                              >
                                <Play className={`w-3.5 h-3.5 shrink-0 transition-colors ${isQuizActive ? 'text-indigo-600' : 'text-[#737373] group-hover:text-indigo-600'}`} />
                                <span className="truncate">{qz.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Monitoring Siswa Link */}
              <Link
                href="/admin/guru/monitoring"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] font-bold transition-all cursor-pointer group ${
                  pathname === '/admin/guru/monitoring'
                    ? 'bg-blue-50/50 text-[#2563EB]'
                    : 'text-[#737373] hover:bg-slate-50 hover:text-[#2563EB]'
                }`}
              >
                <GraduationCap className={`w-4 h-4 transition-colors ${pathname === '/admin/guru/monitoring' ? 'text-[#2563EB]' : 'text-[#737373] group-hover:text-[#2563EB]'}`} />
                <span>Monitoring Siswa</span>
              </Link>
            </>
          )}

        </div>
      </div>

      {/* Footer Copyright */}
      <div className="p-6 pt-2">
        <p className="text-[11px] text-[#AAAAAA] leading-relaxed">
          &copy; 2026 Sitemsa. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
