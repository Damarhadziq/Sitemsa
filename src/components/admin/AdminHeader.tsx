'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Bell,
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
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore } from '@/lib/admin-store';

export function AdminHeader() {
  const { user, role, logout, activeSubjectFilter, setTeacherSubjectFilter } = useAuth();
  const { subjects } = useAdminStore();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const profileRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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
      if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
        setShowSubjectMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
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

  const mockNotifications = [
    {
      id: 1,
      title: 'Siswa Menyelesaikan Kuis',
      desc: 'Ahmad Fauzi menyelesaikan Kuis Dioda dengan nilai 100.',
      time: '5 menit lalu',
      unread: true,
    },
    {
      id: 2,
      title: 'Pengingat Membaca Modul',
      desc: '2 siswa belum menyelesaikan modul Resistor Minggu ini.',
      time: '1 jam lalu',
      unread: true,
    },
    {
      id: 3,
      title: 'Pembaruan Sistem Sintesa',
      desc: 'Fitur Dribbble Editor Block Kanvas telah diperbarui.',
      time: '1 hari lalu',
      unread: false,
    },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSavedToast(true);
    setTimeout(() => {
      setSettingsSavedToast(false);
      setShowSettingsModal(false);
    }, 1200);
  };

  return (
    <header className="h-16 bg-white border-b border-[#ECECEC] px-6 flex items-center justify-between font-sans sticky top-0 z-30">
      {/* LEFT: Switch Mapel Dropdown Button */}
      <div className="relative" ref={subjectRef}>
        <button
          onClick={() => setShowSubjectMenu(!showSubjectMenu)}
          className="h-9 px-3 rounded-[8px] bg-white border border-[#ECECEC] hover:border-blue-200 text-xs font-semibold text-[#2E2D2D] flex items-center gap-2 transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#2563EB]" />
          <span>Bidang: <strong className="font-bold">{mounted ? currentSubject : 'Informatika'}</strong></span>
          <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
        </button>

        {/* Custom Subject Switcher Menu */}
        {showSubjectMenu && (
          <div className="absolute left-0 mt-1.5 w-52 bg-white rounded-[10px] border border-[#ECECEC] p-1.5 z-50 shadow-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
            <p className="px-2.5 py-1 text-[11px] font-semibold text-[#737373]">Pilih Bidang:</p>
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
        {/* Notifications Button & Dropdown Modal (FULL 100% ROUNDED-FULL) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] hover:border-blue-200 flex items-center justify-center text-[#737373] hover:text-[#2E2D2D] transition-all duration-200 ease-in-out active:scale-[0.95] cursor-pointer relative"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Notifications Dropdown Modal */}
          {showNotifMenu && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-[12px] border border-[#ECECEC] p-4 z-50 shadow-xl space-y-3 font-sans animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECECEC]">
                <h3 className="text-xs font-bold text-[#2E2D2D]">Notifikasi Portal</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] font-semibold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Tandai Semua Dibaca
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-[8px] border transition-all ${
                      notif.unread && unreadCount > 0
                        ? 'bg-blue-50/50 border-blue-100'
                        : 'bg-white border-[#ECECEC]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[#2E2D2D]">{notif.title}</p>
                      <span className="text-[10px] text-[#AAAAAA] shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-[#737373] mt-1 leading-relaxed">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-[10px] border border-[#ECECEC] p-1.5 z-50 shadow-xs space-y-0.5 font-sans animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#ECECEC]">
                <p className="text-xs font-bold text-[#2E2D2D] truncate">{user?.name || 'Pak Budi Prasetyo, M.Kom.'}</p>
                <p className="text-[11px] text-[#737373] truncate">{user?.email || 'budi.guru@sintesa.id'}</p>
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
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 border-b border-[#ECECEC] pb-4">
              {/* eslint-disable-next-next/no-img-element */}
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150?img=60'}
                alt={user?.name || 'Profil'}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#2563EB]"
              />
              <div>
                <h3 className="text-base font-bold text-[#2E2D2D]">{user?.name || 'Pak Budi Prasetyo, M.Kom.'}</h3>
                <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 inline-block mt-1">
                  {role === 'superadmin' ? 'Super Administrator' : 'Pengajar / Guru'}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-[8px] bg-slate-50 border border-[#ECECEC]">
                <span className="text-[#737373] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#2563EB]" /> Email Resmi:
                </span>
                <span className="font-bold text-[#2E2D2D]">{user?.email || 'budi.guru@sintesa.id'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-[8px] bg-slate-50 border border-[#ECECEC]">
                <span className="text-[#737373] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" /> NIP / ID Pengajar:
                </span>
                <span className="font-bold text-[#2E2D2D]">19840215 201001 1 004</span>
              </div>

              <div className="p-3 rounded-[8px] bg-slate-50 border border-[#ECECEC] space-y-2">
                <span className="text-[#737373] flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-[#2563EB]" /> Bidang Diampu:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableSubjects.map((subj) => (
                    <span key={subj} className="px-2.5 py-1 rounded-[6px] bg-white border border-[#ECECEC] font-bold text-[#2563EB]">
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full py-2.5 rounded-[8px] bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs transition-all duration-200 ease-in-out active:scale-[0.98]"
            >
              Tutup Profil
            </button>
          </div>
        </div>
      )}

      {/* ADMIN ACCOUNT SETTINGS MODAL */}
      {showSettingsModal && (
        <div
          onClick={() => setShowSettingsModal(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
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
                  className="px-5 py-2 rounded-[8px] bg-[#2563EB] text-white font-semibold hover:bg-blue-700 cursor-pointer shadow-xs transition-all duration-200 ease-in-out active:scale-[0.98]"
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
