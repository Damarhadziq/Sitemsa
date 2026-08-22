'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Send,
  Sparkles,
  Users,
  Layers,
  UserCheck,
  FileText,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import BorderGlow from '@/components/ui/BorderGlow';
import { Skeleton } from '@/components/ui/skeleton';

export default function SuperadminDashboard() {
  const { teachers, subjects, articles, modules, quizzes, students } = useAdminStore();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const totalTeachers = teachers.length;
  const totalSubjects = subjects.length;
  const totalContentItems = articles.length + modules.length + quizzes.length;
  const totalStudents = students.length;

  const quickPrompts = [
    { id: 1, text: 'Ringkasan aktivitas minggu ini', primary: true },
    { id: 2, text: 'Terakhir kamu pelajari', primary: false },
    { id: 3, text: 'Rekomendasi mata pelajaran', primary: false },
  ];

  return (
    <div className="font-sans text-[#2E2D2D] bg-white space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2E2D2D] tracking-tight">
          Dashboard Superadmin
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          {/* TOP ROW SKELETON */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 2x2 Grid (Span 7) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-[12px] bg-slate-100/70 min-h-[160px] flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3.5 w-24 rounded-[4px]" />
                    <Skeleton className="h-5 w-12 rounded-[4px]" />
                  </div>
                  <div className="flex items-baseline justify-between mt-4">
                    <Skeleton className="h-9 w-16 rounded-[6px]" />
                    <Skeleton className="w-9 h-9 rounded-[8px]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right AI Card (Span 5) */}
            <div className="lg:col-span-5 bg-slate-100/70 rounded-[12px] p-6 flex flex-col justify-between min-h-[336px] space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="h-5 w-32 rounded-[4px]" />
                </div>
                <Skeleton className="h-3.5 w-full rounded-[4px]" />
                <Skeleton className="h-3.5 w-4/5 rounded-[4px]" />
                <div className="flex flex-wrap gap-2 pt-2">
                  <Skeleton className="h-6 w-36 rounded-[6px]" />
                  <Skeleton className="h-6 w-28 rounded-[6px]" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-[8px]" />
            </div>
          </div>

          {/* BOTTOM ROW SKELETON */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 bg-slate-100/70 rounded-[12px] p-6 space-y-4">
              <div className="flex justify-between items-center pb-2">
                <Skeleton className="h-5 w-32 rounded-[4px]" />
                <Skeleton className="h-4 w-16 rounded-[4px]" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-48 rounded-[4px]" />
                      <div className="flex gap-2">
                        <Skeleton className="h-3 w-20 rounded-[4px]" />
                        <Skeleton className="h-3 w-20 rounded-[4px]" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-[4px]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-100/70 rounded-[12px] p-6 space-y-4">
              <div className="flex justify-between items-center pb-2">
                <Skeleton className="h-5 w-36 rounded-[4px]" />
                <Skeleton className="h-4 w-16 rounded-[4px]" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-36 rounded-[4px]" />
                      <Skeleton className="h-3 w-44 rounded-[4px]" />
                    </div>
                    <Skeleton className="h-6 w-14 rounded-[4px]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TOP ROW: Left (2x2 Stat Cards) & Right (AI Card with React Bits <BorderGlow />) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN: 2x2 Stat Cards Grid (Span 7) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stat 1: Total Guru */}
              <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737373]">Total guru</span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> 8.5%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{totalTeachers}</span>
                  <div className="w-9 h-9 rounded-[8px] bg-blue-50/80 flex items-center justify-center border border-blue-100/50">
                    <UserCheck className="w-4 h-4 text-[#2563EB]" />
                  </div>
                </div>
              </div>

              {/* Stat 2: Bidang Keahlian */}
              <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737373]">Bidang keahlian</span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> 1.1%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{totalSubjects}</span>
                  <div className="w-9 h-9 rounded-[8px] bg-indigo-50/80 flex items-center justify-center border border-indigo-100/50">
                    <Layers className="w-4 h-4 text-[#6366F1]" />
                  </div>
                </div>
              </div>

              {/* Stat 3: Total Konten Modul */}
              <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737373]">Konten & modul</span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> 12.0%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{totalContentItems}</span>
                  <div className="w-9 h-9 rounded-[8px] bg-emerald-50/80 flex items-center justify-center border border-emerald-100/50">
                    <BookOpen className="w-4 h-4 text-[#10B981]" />
                  </div>
                </div>
              </div>

              {/* Stat 4: Total Siswa */}
              <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737373]">Siswa terdaftar</span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> 4.3%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{totalStudents}</span>
                  <div className="w-9 h-9 rounded-[8px] bg-amber-50/80 flex items-center justify-center border border-amber-100/50">
                    <GraduationCap className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: AI Copilot Card (Span 5) */}
            <div className="lg:col-span-5 relative rounded-[10px] min-h-[336px] flex flex-col group">
              <BorderGlow
                borderRadius={10}
                glowColor="220 90% 60%"
                className="w-full h-full"
              >
                <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#EFF6FF] rounded-[9px] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-white">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                        AI Sistem Pengelola
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#2E2D2D] leading-snug mb-2">
                      Laporan Cepat Sekolah
                    </h3>

                    <p className="text-xs text-[#737373] leading-relaxed mb-4">
                      Tanyakan status sistem, rekapitulasi data guru, penambahan mata pelajaran, atau performa kurikulum Sitemsa.
                    </p>

                    {/* Quick Pill Prompts */}
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAiPrompt(item.text)}
                          className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors cursor-pointer ${
                            item.primary
                              ? 'bg-[#2563EB] text-white hover:bg-blue-700 font-semibold'
                              : 'bg-white text-[#2E2D2D] border border-[#ECECEC] hover:bg-slate-50'
                          }`}
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Prompt Box */}
                  <div className="relative mt-6">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ketik pertanyaan untuk sistem AI..."
                      className="w-full h-11 pl-4 pr-12 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] placeholder:text-[#AAAAAA] focus:border-[#2563EB] transition-all outline-none"
                    />
                    <button
                      type="button"
                      title="Kirim Prompt AI"
                      className="w-8 h-8 rounded-[6px] bg-[#2563EB] hover:bg-blue-700 text-white flex items-center justify-center absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </BorderGlow>
            </div>
          </div>

          {/* BOTTOM ROW: Additional Matching Grid Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* BOTTOM LEFT CARD: Materi List Card */}
            <div className="lg:col-span-7 bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-semibold text-[#2E2D2D]">Materi</h3>
                    <span className="text-[11px] font-semibold text-white bg-[#2563EB] px-2.5 py-0.5 rounded-[4px]">
                      {modules.length} Materi
                    </span>
                  </div>
                  <Link href="/admin/superadmin/guru" className="text-xs font-semibold text-[#2563EB] hover:underline">
                    Lihat Semua
                  </Link>
                </div>

                <div className="divide-y divide-[#ECECEC]">
                  <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-[#2E2D2D] text-sm">Verifikasi Penugasan Hak Akses Guru</p>
                      <div className="flex items-center gap-3 text-xs text-[#737373]">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-[#737373]" />
                          Pak Budi Prasetyo
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#737373]" />
                          Informatika
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-[6px]">
                      Medium
                    </span>
                  </div>

                  <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-[#2E2D2D] text-sm">Update Banner Utama & Artikel Tips Belajar</p>
                      <div className="flex items-center gap-3 text-xs text-[#737373]">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#737373]" />
                          Konten Website
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#737373]" />
                          5 Artikel Aktif
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[6px]">
                      Selesai
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM RIGHT CARD: Ringkasan Akun Guru & Bidang */}
            <div className="lg:col-span-5 bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-semibold text-[#2E2D2D]">Ringkasan Akun & Bidang</h3>
                    <span className="text-[11px] font-semibold text-white bg-[#2563EB] px-2.5 py-0.5 rounded-[4px]">
                      {subjects.length} Bidang
                    </span>
                  </div>
                  <Link href="/admin/superadmin/konten" className="text-xs font-semibold text-[#2563EB] hover:underline">
                    Lihat Semua
                  </Link>
                </div>

                <div className="divide-y divide-[#ECECEC]">
                  <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-[#2E2D2D] text-sm">{subjects.length} Kategori Bidang Utama</p>
                      <div className="flex items-center gap-3 text-xs text-[#737373]">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#737373]" />
                          Informatika, Elektronika, Otomotif, Seni
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-[6px]">
                      Aktif
                    </span>
                  </div>

                  <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-[#2E2D2D] text-sm">Status Keaktifan Guru</p>
                      <div className="flex items-center gap-3 text-xs text-[#737373]">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#737373]" />
                          3 Guru Aktif Berlisensi
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-[6px]">
                      100% Aktif
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
