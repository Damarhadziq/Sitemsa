'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  BookOpen,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore } from '@/lib/admin-store';

export function AdminHeader() {
  const { user, role, logout, activeSubjectFilter, setTeacherSubjectFilter } = useAuth();
  const { subjects } = useAdminStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
        setShowSubjectMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const assignedSubjects = user?.assignedSubjects || [];

  const availableSubjects =
    role === 'superadmin'
      ? subjects.map((s) => s.name)
      : assignedSubjects.length > 0
      ? assignedSubjects
      : ['Informatika'];

  const currentSubject =
    activeSubjectFilter || availableSubjects[0] || 'Informatika';

  return (
    <header className="h-16 bg-white border-b border-[#ECECEC] px-6 flex items-center justify-between font-sans sticky top-0 z-30">
      {/* LEFT: Switch Mapel Dropdown Button */}
      <div className="relative" ref={subjectRef}>
        <button
          onClick={() => setShowSubjectMenu(!showSubjectMenu)}
          className="h-9 px-3 rounded-[8px] bg-white border border-[#ECECEC] hover:border-blue-200 text-xs font-semibold text-[#2E2D2D] flex items-center gap-2 transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#2563EB]" />
          <span>Mapel: <strong className="font-bold">{mounted ? currentSubject : 'Informatika'}</strong></span>
          <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
        </button>

        {/* Custom Subject Switcher Menu */}
        {showSubjectMenu && (
          <div className="absolute left-0 mt-1.5 w-52 bg-white rounded-[10px] border border-[#ECECEC] p-1.5 z-50 shadow-xs space-y-0.5">
            <p className="px-2.5 py-1 text-[11px] font-semibold text-[#737373]">Pilih Mata Pelajaran:</p>
            {availableSubjects.map((subj) => (
              <button
                key={subj}
                onClick={() => {
                  setTeacherSubjectFilter(subj);
                  setShowSubjectMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-[6px] text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  currentSubject === subj
                    ? 'bg-blue-50 text-[#2563EB] font-bold'
                    : 'text-[#2E2D2D] hover:bg-slate-50'
                }`}
              >
                <span>{subj}</span>
                {currentSubject === subj && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Action Icons & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-9 h-9 rounded-[8px] bg-white border border-[#ECECEC] hover:border-blue-200 flex items-center justify-center text-[#737373] hover:text-[#2E2D2D] transition-colors cursor-pointer"
          title="Ganti Mode Tampilan"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Button */}
        <button
          className="w-9 h-9 rounded-[8px] bg-white border border-[#ECECEC] hover:border-blue-200 flex items-center justify-center text-[#737373] hover:text-[#2E2D2D] transition-colors cursor-pointer relative"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* Profile Avatar + Arrow strictly */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-9 px-2 rounded-[8px] bg-white border border-[#ECECEC] hover:border-blue-200 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Menu Akun"
          >
            {/* eslint-disable-next-next/no-img-element */}
            <img
              src={mounted ? (user?.avatar || 'https://i.pravatar.cc/150?img=60') : 'https://i.pravatar.cc/150?img=60'}
              alt={user?.name || 'Profil'}
              className="w-6 h-6 rounded-full object-cover border border-[#ECECEC]"
              suppressHydrationWarning
            />
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-[10px] border border-[#ECECEC] p-1.5 z-50 shadow-xs space-y-0.5 font-sans">
              <div className="px-3 py-2 border-b border-[#ECECEC]">
                <p className="text-xs font-bold text-[#2E2D2D] truncate">{user?.name || 'Pak Budi Prasetyo, M.Kom.'}</p>
                <p className="text-[11px] text-[#737373] truncate">{user?.email || 'budi.guru@sintesa.id'}</p>
              </div>

              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-3 py-2 rounded-[6px] text-xs font-medium text-[#2E2D2D] hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#737373]" />
                <span>Lihat Profil</span>
              </button>

              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-3 py-2 rounded-[6px] text-xs font-medium text-[#2E2D2D] hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#737373]" />
                <span>Pengaturan Akun</span>
              </button>

              <button
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
    </header>
  );
}
