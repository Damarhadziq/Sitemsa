'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Settings02Icon,
  Award01Icon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  Building01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";

import { UserProfileModal, ProfileTab } from "@/components/profile/UserProfileModal";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ProfileTab>("profile");

  const openModal = (tab: ProfileTab) => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1">
        {/* Profile Banner & Overview Card */}
        <section className="mb-8 p-6 md:p-8 bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden relative shrink-0 border border-[#ECECEC] bg-white">
              <Image
                src="https://i.pravatar.cc/100?img=12"
                alt="Budi Santoso"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold text-[#2E2D2D] tracking-tight">
                Budi Santoso
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#737373]">
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Mail01Icon} size={14} />
                  budi@siswa.belajar.id
                </span>
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Building01Icon} size={14} />
                  SMKN 1 Semarang
                </span>
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Calendar01Icon} size={14} />
                  Bergabung Jan 2026
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => openModal("profile")}
              className="w-full md:w-auto px-4 py-2 bg-white border border-[#ECECEC] hover:bg-gray-50 text-[#2E2D2D] text-xs font-semibold rounded-[6px] transition-colors flex items-center justify-center gap-2"
            >
              <HugeiconsIcon icon={Settings02Icon} size={14} />
              Edit Data Diri
            </button>

            <button
              type="button"
              onClick={() => openModal("history")}
              className="w-full md:w-auto px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-[6px] transition-colors flex items-center justify-center gap-2"
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
              <p className="text-lg font-bold text-[#2E2D2D]">12 Modul</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#ECECEC] rounded-[8px] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[6px] bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Clock01Icon} size={20} />
            </div>
            <div>
              <p className="text-[11px] text-[#737373] font-medium">Total Waktu Belajar</p>
              <p className="text-lg font-bold text-[#2E2D2D]">18.5 Jam</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#ECECEC] rounded-[8px] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[6px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
            </div>
            <div>
              <p className="text-[11px] text-[#737373] font-medium">Nilai Kuis Rata-rata</p>
              <p className="text-lg font-bold text-[#2E2D2D]">94.8%</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#ECECEC] rounded-[8px] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[6px] bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Award01Icon} size={20} />
            </div>
            <div>
              <p className="text-[11px] text-[#737373] font-medium">Sertifikat Kelulusan</p>
              <p className="text-lg font-bold text-[#2E2D2D]">3 Sertifikat</p>
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

              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    title: "Variabel, Tipe Data & Operasi Logika",
                    subject: "Informatika",
                    progress: 80,
                    lastRead: "10 menit yang lalu",
                  },
                  {
                    id: 4,
                    title: "Komponen Pasif (Resistor, Kapasitor, Induktor)",
                    subject: "Elektronika",
                    progress: 45,
                    lastRead: "Kemarin",
                  },
                  {
                    id: 6,
                    title: "Manajemen Waktu & Teknik Pomodoro",
                    subject: "Bimbingan & Konseling",
                    progress: 90,
                    lastRead: "2 hari yang lalu",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white border border-[#ECECEC] rounded-[8px] hover:bg-[#F6F5FF] hover:border-[#2563EB]/30 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#E8E7FF] text-[#2563EB] rounded-[4px]">
                          {item.subject}
                        </span>
                        <span className="text-[11px] text-[#737373]">
                          Terakhir dibaca: {item.lastRead}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors">
                        {item.title}
                      </h3>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    <Link href={`/materi/${item.id}`} className="shrink-0">
                      <button
                        type="button"
                        className="px-3.5 py-1.5 bg-[#FAFAFA] border border-[#ECECEC] hover:bg-[#2563EB] hover:text-white text-xs font-medium text-[#2E2D2D] rounded-[6px] transition-all"
                      >
                        Lanjutkan
                      </button>
                    </Link>
                  </div>
                ))}
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
                  <span className="font-semibold text-[#2E2D2D]">Budi Santoso</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#ECECEC]">
                  <span className="text-[#737373]">Status Akun</span>
                  <span className="font-semibold text-emerald-600">Aktif (Terverifikasi)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#ECECEC]">
                  <span className="text-[#737373]">NISN / ID</span>
                  <span className="font-mono text-[#2E2D2D]">0084920194</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#ECECEC]">
                  <span className="text-[#737373]">Kelas / Jurusan</span>
                  <span className="font-semibold text-[#2E2D2D]">XI PPLG 1</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openModal("profile")}
                className="w-full py-2 px-3 bg-white border border-[#ECECEC] hover:bg-gray-50 text-xs font-medium text-[#2E2D2D] rounded-[6px] transition-colors flex items-center justify-center gap-2"
              >
                <HugeiconsIcon icon={Settings02Icon} size={14} />
                Edit Pengaturan Akun
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
      />
    </div>
  );
}
