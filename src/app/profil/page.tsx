'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Settings02Icon,
  Award01Icon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  Building01Icon,
  Calendar01Icon,
  Book01Icon,
} from "@hugeicons/core-free-icons";

import { UserProfileModal, ProfileTab } from "@/components/profile/UserProfileModal";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { getStudentProfile, StudentProfile } from "@/services/student-profile.service";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ProfileTab>("profile");
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const updateProfile = () => {
      setProfile(getStudentProfile());
    };
    updateProfile();
    window.addEventListener('sintesa-student-profile-updated', updateProfile);
    window.addEventListener('storage', updateProfile);
    return () => {
      window.removeEventListener('sintesa-student-profile-updated', updateProfile);
      window.removeEventListener('storage', updateProfile);
    };
  }, []);

  const openModal = (tab: ProfileTab) => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const studentName = profile?.name || 'Siswa Sitemsa';
  const studentEmail = profile?.email || 'Belum diatur';
  const studentSchool = profile?.school || 'SMK Negeri 1 Semarang';
  const studentGrade = profile?.grade || 'X';
  const studentNisn = profile?.nisn || '-';

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-36 md:pb-16 w-full flex-1">
        {/* Profile Banner & Overview Card */}
        <section className="mb-8 p-6 md:p-8 bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <InitialsAvatar
              name={studentName}
              avatar={profile?.avatar}
              sizeClass="w-20 h-20"
              textSizeClass="text-2xl"
            />
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold text-[#2E2D2D] tracking-tight">
                {studentName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#737373]">
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Mail01Icon} size={14} />
                  {studentEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Building01Icon} size={14} />
                  {studentSchool}
                </span>
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Calendar01Icon} size={14} />
                  Akun Aktif
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => openModal("profile")}
              className="w-full md:w-auto px-4 py-2 bg-white border border-[#ECECEC] hover:bg-gray-50 text-[#2E2D2D] text-xs font-semibold rounded-[6px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <HugeiconsIcon icon={Settings02Icon} size={14} />
              Edit Data Diri
            </button>

            <button
              type="button"
              onClick={() => openModal("history")}
              className="w-full md:w-auto px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-[6px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <HugeiconsIcon icon={Clock01Icon} size={14} />
              Riwayat &amp; Nilai Kuis
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-[#ECECEC] rounded-[8px] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[6px] bg-[#E8E7FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Award01Icon} size={20} />
            </div>
            <div>
              <p className="text-[11px] text-[#737373] font-medium">Modul Diselesaikan</p>
              <p className="text-lg font-bold text-[#2E2D2D]">0 Modul</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#ECECEC] rounded-[8px] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[6px] bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Clock01Icon} size={20} />
            </div>
            <div>
              <p className="text-[11px] text-[#737373] font-medium">Status Pembelajaran</p>
              <p className="text-lg font-bold text-[#2E2D2D]">Baru Memulai</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#ECECEC] rounded-[8px] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[6px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
            </div>
            <div>
              <p className="text-[11px] text-[#737373] font-medium">Nilai Kuis Rata-rata</p>
              <p className="text-lg font-bold text-[#2E2D2D]">-</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#ECECEC] rounded-[8px] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[6px] bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Award01Icon} size={20} />
            </div>
            <div>
              <p className="text-[11px] text-[#737373] font-medium">Target Mingguan</p>
              <p className="text-lg font-bold text-[#2E2D2D]">0 / 5</p>
            </div>
          </div>
        </section>

        {/* Content Section: Active Progress & Completed Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2-Cols: Recent Material Progress */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#2E2D2D] mb-4">
                Progres Materi Aktif
              </h2>

              <div className="p-8 bg-[#FAFAFA] border border-[#ECECEC] rounded-[10px] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                  <HugeiconsIcon icon={Book01Icon} size={24} />
                </div>
                <h3 className="text-sm font-bold text-[#2E2D2D]">Belum Ada Materi yang Sedang Dipelajari</h3>
                <p className="text-xs text-[#737373] max-w-sm mx-auto">
                  Pilih salah satu materi dari 6 bidang keahlian vokasi untuk mulai membaca dan menguji pemahamanmu.
                </p>
                <div className="pt-2">
                  <Link
                    href="/materi"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-[8px] transition-colors"
                  >
                    Buka Katalog Materi
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Account Info & Quick Settings */}
          <div className="space-y-6">
            <div className="p-5 bg-[#FAFAFA] border border-[#ECECEC] rounded-[10px] space-y-4">
              <h3 className="text-sm font-bold text-[#2E2D2D]">Informasi Akun</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#ECECEC]">
                  <span className="text-[#737373]">Nama Lengkap</span>
                  <span className="font-semibold text-[#2E2D2D]">{studentName}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#ECECEC]">
                  <span className="text-[#737373]">Status Akun</span>
                  <span className="font-semibold text-emerald-600">Aktif (Siswa)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#ECECEC]">
                  <span className="text-[#737373]">NISN / ID</span>
                  <span className="font-mono text-[#2E2D2D]">{studentNisn}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#ECECEC]">
                  <span className="text-[#737373]">Kelas / Jurusan</span>
                  <span className="font-semibold text-[#2E2D2D]">{studentGrade}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openModal("profile")}
                className="w-full py-2 px-3 bg-white border border-[#ECECEC] hover:bg-gray-50 text-xs font-medium text-[#2E2D2D] rounded-[6px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <HugeiconsIcon icon={Settings02Icon} size={14} />
                Edit Pengaturan Akun
              </button>
            </div>
          </div>
        </div>
      </main>

      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
      />
    </div>
  );
}
