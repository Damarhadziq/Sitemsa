'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  LogOut,
  User,
  Settings,
  BookOpen,
  Check,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Mail,
  Phone,
  BookMarked,
  Sparkles,
  Pencil,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore } from '@/lib/admin-store';

export function AdminHeader() {
  const { user, role, logout, activeSubjectFilter, setTeacherSubjectFilter } = useAuth();
  const { subjects } = useAdminStore();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Settings form states
  const [settingsEmail, setSettingsEmail] = useState(user?.email || '');
  const [settingsPhone, setSettingsPhone] = useState('0812-3456-7890');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setSettingsEmail(user.email);
    }
  }, [user?.email]);

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

  const isAnyModalOpen = showProfileModal || showSettingsModal;

  useEffect(() => {
    if (isAnyModalOpen) {
      document.documentElement.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [isAnyModalOpen]);

  const assignedSubjects = user?.assignedSubjects || [];

  const availableSubjects =
    role === 'superadmin'
      ? subjects.map((s) => s.name)
      : assignedSubjects.length > 0
      ? assignedSubjects
      : ['Informatika'];

  const currentSubject =
    activeSubjectFilter || availableSubjects[0] || 'Informatika';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSavedToast(true);
    setTimeout(() => {
      setSettingsSavedToast(false);
      setShowSettingsModal(false);
    }, 2000);
  };

  return (
    <header className="h-16 bg-white border-b border-[#ECECEC] px-6 flex items-center justify-between font-sans sticky top-0 z-30">
      {/* LEFT: Static Subject Indicator Badge */}
      <div className="h-9 px-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-semibold text-[#2E2D2D] flex items-center gap-2 select-none">
        <BookOpen className="w-4 h-4 text-[#2563EB]" />
        <span>Bidang: <strong className="font-bold">{mounted ? currentSubject : 'Informatika'}</strong></span>
      </div>

      {/* RIGHT: Action Icons & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Profile Avatar + Dropdown (FULL 100% ROUNDED-FULL) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-9 px-2.5 rounded-full bg-white border border-[#ECECEC] hover:border-blue-200 flex items-center gap-1.5 transition-all duration-200 ease-in-out active:scale-[0.95] cursor-pointer"
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

          {/* Profile Dropdown Menu (Clean, No Shadow) */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-[10px] border border-[#ECECEC] p-1.5 z-50 space-y-0.5 font-sans animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#ECECEC]">
                <p className="text-xs font-bold text-[#2E2D2D] truncate">{user?.name || 'Pak Budi Prasetyo, M.Kom.'}</p>
                <p className="text-[11px] text-[#737373] truncate">{user?.email || 'budi.guru@sitemsa.sch.id'}</p>
              </div>

              <button
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
              onClick={() => setShowProfileModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center cursor-pointer transition-colors shrink-0 absolute right-4 top-4"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Avatar Centered + Pencil Edit Icon + Name & Role */}
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

            {/* Data Diri Info List (Directly on Modal Canvas, Matching Detail Tim Style) */}
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
              onClick={() => setShowSettingsModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center cursor-pointer transition-colors shrink-0 absolute right-4 top-4"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#2E2D2D]">Pengaturan Akun Pengajar</h3>
            </div>

            {settingsSavedToast && (
              <div className="p-3 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profil berhasil diperbarui!</span>
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

    </header>
  );
}
