'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Plus,
  User,
  Settings,
  LogOut,
  X,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore } from '@/lib/admin-store';

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentItemParam = searchParams.get('item');

  const { role, activeSubjectFilter, user, logout } = useAuth();
  const { modules, quizzes, subjects } = useAdminStore();

  const isSuperadmin = role === 'superadmin';
  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Settings form states
  const [settingsEmail, setSettingsEmail] = useState(user?.email || 'budi.guru@sintesa.id');
  const [settingsPhone, setSettingsPhone] = useState('0812-3456-7890');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSavedToast(true);
    setTimeout(() => {
      setSettingsSavedToast(false);
      setShowSettingsModal(false);
    }, 1200);
  };

  const availableSubjects =
    role === 'superadmin'
      ? subjects.map((s) => s.name)
      : assignedSubjects.length > 0
      ? assignedSubjects
      : ['Informatika'];

  // State for collapsible tree & sub-tree nodes in sidebar
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [isMateriExpanded, setIsMateriExpanded] = useState(true);
  const [isKuisExpanded, setIsKuisExpanded] = useState(true);

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
    <aside className="w-64 bg-white border-r border-[#ECECEC] flex flex-col h-full font-sans z-10 shrink-0 overflow-hidden">
      {/* Role-Based Brand SVG Logo (Sized compactly for header alignment) */}
      <div className="h-16 px-6 flex items-center shrink-0">
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
      <div className="p-4 pt-2 space-y-1.5 text-xs overflow-y-auto flex-1 min-h-0 scrollbar-none">
          
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
                    <span className="truncate">Materi & Kuis</span>
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
                      <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-[#737373] hover:text-[#2E2D2D] rounded-[6px] transition-colors group select-none">
                        <button
                          type="button"
                          onClick={() => setIsMateriExpanded(!isMateriExpanded)}
                          className="flex items-center gap-1.5 cursor-pointer flex-1 min-w-0 text-left"
                        >
                          {isMateriExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#2563EB] shrink-0" />
                          )}
                          <span className="truncate">Materi</span>
                          <span className="w-3.5 h-3.5 rounded-[2px] bg-blue-50 text-[#2563EB] text-[9px] font-bold flex items-center justify-center shrink-0 ml-0.5">
                            {currentModules.length}
                          </span>
                        </button>

                        <Link
                          href="/admin/guru/pelajaran?action=add-materi"
                          className="p-1 rounded-[4px] text-[#737373] hover:text-[#2563EB] hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
                          title="Tambah Materi Baru"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {isMateriExpanded && (
                        <div className="pl-3 space-y-1 border-l border-slate-200/80 ml-2 animate-in fade-in slide-in-from-top-1 duration-150">
                          {currentModules.map((mod) => {
                            const isItemActive = currentItemParam === mod.id;

                            return (
                              <Link
                                key={mod.id}
                                href={`/admin/guru/pelajaran?item=${mod.id}`}
                                className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[6px] text-xs transition-all truncate group ${
                                  isItemActive
                                    ? 'bg-blue-50/80 text-[#2563EB] font-bold'
                                    : 'text-[#737373] hover:text-[#2563EB] hover:bg-slate-50 font-medium'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate min-w-0">
                                  <FileCode className={`w-3.5 h-3.5 shrink-0 transition-colors ${isItemActive ? 'text-[#2563EB]' : 'text-[#737373] group-hover:text-[#2563EB]'}`} />
                                  <span className="truncate">{mod.title}</span>
                                </div>
                                {mod.isPublished === false && (
                                  <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                                    Draft
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* TREE NODE 2: KUIS */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-[#737373] hover:text-[#2E2D2D] rounded-[6px] transition-colors group select-none">
                        <button
                          type="button"
                          onClick={() => setIsKuisExpanded(!isKuisExpanded)}
                          className="flex items-center gap-1.5 cursor-pointer flex-1 min-w-0 text-left"
                        >
                          {isKuisExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#737373] group-hover:text-indigo-600 shrink-0" />
                          )}
                          <span className="truncate">Kuis</span>
                          <span className="w-3.5 h-3.5 rounded-[2px] bg-indigo-50 text-indigo-600 text-[9px] font-bold flex items-center justify-center shrink-0 ml-0.5">
                            {currentQuizzes.length}
                          </span>
                        </button>

                        <Link
                          href="/admin/guru/pelajaran?action=add-kuis"
                          className="p-1 rounded-[4px] text-[#737373] hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0 cursor-pointer"
                          title="Tambah Kuis Baru"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {isKuisExpanded && currentQuizzes.length > 0 && (
                        <div className="pl-3 space-y-1 border-l border-indigo-200 ml-2 animate-in fade-in slide-in-from-top-1 duration-150">
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
                      )}
                    </div>

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

      {/* Bottom Section: Bidang Indicator + Profile User Account Card */}
      <div className="p-3 space-y-2 shrink-0 bg-white relative">
        {/* Bidang Indicator Badge */}
        <div className="h-8 px-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[11px] font-semibold text-[#2E2D2D] flex items-center gap-2 select-none">
          <BookOpen className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
          <span className="truncate">Bidang: <strong className="font-bold text-[#2563EB]">{mounted ? currentSubject : 'Informatika'}</strong></span>
        </div>

        {/* Profile Card / Dropdown Trigger */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full p-2 rounded-[10px] hover:bg-slate-50 border border-transparent hover:border-[#ECECEC] flex items-center transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={mounted ? (user?.avatar || 'https://i.pravatar.cc/150?img=60') : 'https://i.pravatar.cc/150?img=60'}
                alt={user?.name || 'Profil'}
                className="w-8 h-8 rounded-full object-cover border border-[#ECECEC] shrink-0"
                suppressHydrationWarning
              />
              <div className="truncate min-w-0">
                <p className="text-xs font-bold text-[#2E2D2D] truncate group-hover:text-[#2563EB] transition-colors leading-tight">
                  {user?.name || 'Pak Budi Prasetyo'}
                </p>
                <p className="text-[10px] text-[#737373] truncate leading-tight mt-0.5">
                  {role === 'superadmin' ? 'Superadmin' : 'Pengajar'}
                </p>
              </div>
            </div>
          </button>

          {/* Profile Dropdown Popup (Opens Upwards above button) */}
          {showProfileMenu && (
            <div className="absolute left-0 bottom-full mb-1.5 w-full bg-white rounded-[12px] border border-[#ECECEC] shadow-md shadow-slate-900/5 p-1.5 z-50 space-y-0.5 font-sans animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowProfileModal(true);
                }}
                className="w-full text-left px-3 py-2 rounded-[6px] text-xs font-medium text-[#2E2D2D] hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#737373]" />
                <span>Lihat Profil</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowSettingsModal(true);
                }}
                className="w-full text-left px-3 py-2 rounded-[6px] text-xs font-medium text-[#2E2D2D] hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#737373]" />
                <span>Pengaturan Akun</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-[6px] text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ADMIN PROFILE MODAL */}
      {showProfileModal && (
        <div
          onClick={() => setShowProfileModal(false)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md space-y-5 relative animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Top-Right Close Button */}
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center cursor-pointer transition-colors shrink-0 absolute right-4 top-4"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Avatar Centered + Name & Role */}
            <div className="flex flex-col items-center text-center pt-2 pb-1 space-y-3">
              <div className="relative">
                {/* eslint-disable-next-next/no-img-element */}
                <img
                  src={user?.avatar || 'https://i.pravatar.cc/150?img=60'}
                  alt={user?.name || 'Profil'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#2563EB]"
                />
                <label
                  title="Update Foto Profil"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer border-2 border-white transition-transform active:scale-95 shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        alert(`Foto profil berhasil dipilih: ${file.name}`);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#2E2D2D]">
                  {user?.name || 'Pak Budi Prasetyo, M.Kom.'}
                </h3>
                <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 inline-block">
                  {role === 'superadmin' ? 'Super Administrator' : 'Pengajar / Guru'}
                </span>
              </div>
            </div>

            {/* Data Diri Info List */}
            <div className="space-y-4 px-1 pt-2 text-left">
              {/* Email Resmi */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#737373] block">
                  Email Resmi
                </span>
                <p className="text-sm font-bold text-[#2E2D2D]">
                  {(user?.email || 'budi.guru@sitemsa.sch.id').replace('@sintesa.id', '@sitemsa.sch.id')}
                </p>
              </div>

              {/* NIP / ID Pengajar */}
              <div className="pt-3 border-t border-[#F1F5F9] space-y-1">
                <span className="text-xs font-semibold text-[#737373] block">
                  NIP / ID Pengajar
                </span>
                <p className="text-sm font-bold text-[#2E2D2D]">
                  {user?.nip || '19840215 201001 1 004'}
                </p>
              </div>

              {/* Bidang Diampu */}
              <div className="pt-3 border-t border-[#F1F5F9] space-y-1">
                <span className="text-xs font-semibold text-[#737373] block">
                  Bidang Diampu
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {availableSubjects.map((subj) => (
                    <span
                      key={subj}
                      className="px-2.5 py-1 rounded-[6px] bg-blue-50 border border-blue-100 font-bold text-[#2563EB] text-xs"
                    >
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ACCOUNT SETTINGS MODAL */}
      {showSettingsModal && (
        <div
          onClick={() => setShowSettingsModal(false)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md space-y-5 relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center cursor-pointer transition-colors shrink-0 absolute right-4 top-4"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#2E2D2D]">Pengaturan Akun Pengajar</h3>
              <p className="text-xs text-[#737373]">Perbarui preferensi kontak dan informasi akun Anda.</p>
            </div>

            {settingsSavedToast && (
              <div className="p-3 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengaturan berhasil diperbarui!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-[#2E2D2D]">Email Kontak</label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-[8px] border border-[#ECECEC] outline-none focus:border-[#2563EB] text-[#2E2D2D]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-[#2E2D2D]">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-[8px] border border-[#ECECEC] outline-none focus:border-[#2563EB] text-[#2E2D2D]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-[8px] bg-slate-100 text-[#2E2D2D] font-semibold hover:bg-slate-200 cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[8px] bg-[#2563EB] text-white font-semibold hover:bg-blue-700 cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
