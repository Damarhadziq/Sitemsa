'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Send,
  Sparkles,
  AlertTriangle,
  Clock,
  BarChart2,
  BookOpen,
  FileQuestion,
  Users,
  Award,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore } from '@/lib/admin-store';
import BorderGlow from '@/components/ui/BorderGlow';

export default function AdminGuruDashboard() {
  const { user, activeSubjectFilter } = useAuth();
  const { modules, quizzes, students } = useAdminStore();
  const [aiPrompt, setAiPrompt] = useState('');

  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  const subjectModules = modules.filter((m) => m.subject === currentSubject);
  const subjectQuizzes = quizzes.filter((q) => q.subject === currentSubject);
  const subjectStudents = students.filter((s) => s.enrolledSubjects.includes(currentSubject));

  let totalScore = 0;
  let scoreCount = 0;
  subjectStudents.forEach((s) => {
    s.quizHistory
      .filter((q) => q.subject === currentSubject)
      .forEach((q) => {
        totalScore += q.score;
        scoreCount++;
      });
  });
  const avgSubjectScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

  const quickPrompts = [
    { id: 1, text: 'Buat 5 soal kuis pilihan ganda', primary: true },
    { id: 2, text: 'Terakhir kamu pelajari', primary: false },
    { id: 3, text: 'Analisis nilai siswa', primary: false },
  ];

  return (
    <div className="font-sans text-[#2E2D2D] bg-white space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2E2D2D] tracking-tight">
          Dashboard Guru
        </h1>
      </div>

      {/* TOP ROW: Left (2x2 Stat Cards) & Right (AI Card with React Bits <BorderGlow />) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: 2x2 Stat Cards Grid (Span 7) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Stat 1: Modul Materi */}
          <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737373]">Modul {currentSubject}</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> 08.5%
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{subjectModules.length}</span>
              <div className="w-9 h-9 rounded-[8px] bg-blue-50/80 flex items-center justify-center border border-blue-100/50">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>
          </div>

          {/* Stat 2: Kuis Interaktif */}
          <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737373]">Kuis interaktif</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> 01.1%
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{subjectQuizzes.length}</span>
              <div className="w-9 h-9 rounded-[8px] bg-indigo-50/80 flex items-center justify-center border border-indigo-100/50">
                <FileQuestion className="w-4 h-4 text-[#6366F1]" />
              </div>
            </div>
          </div>

          {/* Stat 3: Siswa Terdaftar */}
          <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737373]">Siswa terdaftar</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> 02.4%
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{subjectStudents.length}</span>
              <div className="w-9 h-9 rounded-[8px] bg-purple-50/80 flex items-center justify-center border border-purple-100/50">
                <Users className="w-4 h-4 text-[#A855F7]" />
              </div>
            </div>
          </div>

          {/* Stat 4: Rata-rata Ujian */}
          <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737373]">Rata-rata ujian</span>
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> 03.7%
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{avgSubjectScore}</span>
              <div className="w-9 h-9 rounded-[8px] bg-amber-50/80 flex items-center justify-center border border-amber-100/50">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Card wrapped in React Bits <BorderGlow /> */}
        <div className="lg:col-span-5 flex">
          <BorderGlow
            className="w-full h-full min-h-[340px]"
            edgeSensitivity={30}
            glowColor="220 90 60"
            backgroundColor="#FFFFFF"
            borderRadius={12}
            glowRadius={20}
            glowIntensity={1.0}
            coneSpread={25}
            animated={true}
            colors={['#2563EB', '#6366F1', '#a855f7']}
          >
            <div className="bg-gradient-to-b from-blue-50/50 via-purple-50/20 to-white p-6 flex flex-col justify-between items-center text-center w-full h-full relative overflow-hidden">
              
              {/* Top Centered Icon Badge */}
              <div className="mt-2">
                <div className="w-10 h-10 rounded-[8px] bg-white border border-[#ECECEC] flex items-center justify-center text-[#2E2D2D] shadow-xs">
                  <Sparkles className="w-5 h-5 text-[#2563EB]" />
                </div>
              </div>

              {/* Center Titles & Subtitle */}
              <div className="my-2 space-y-1 max-w-sm">
                <h2 className="text-lg md:text-xl font-semibold text-[#2E2D2D] tracking-tight">
                  Tanyakan AI Sitemsa
                </h2>
                <p className="text-xs text-[#737373] leading-normal">
                  Asisten kecerdasan buatan untuk analisis belajar & kuis
                </p>
              </div>

              {/* Centered Input Box & Bottom Recommendation Pills Container */}
              <div className="w-full space-y-3 mb-1">
                {/* Input Field Box with Send Icon */}
                <div className="relative w-full">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Tulis pertanyaan..."
                    className="w-full h-11 pl-4 pr-11 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] placeholder:text-[#AAAAAA] focus:border-[#2563EB] outline-none shadow-xs"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[6px] text-[#2563EB] hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Centered Recommendation Pills */}
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  {quickPrompts.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAiPrompt(item.text)}
                      className={`px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-all cursor-pointer ${
                        item.primary
                          ? 'bg-white border border-blue-200 text-[#2563EB] hover:bg-blue-50'
                          : 'bg-white border border-[#ECECEC] text-[#737373] hover:border-blue-200 hover:text-[#2563EB]'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
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
                  {subjectModules.length} Materi
                </span>
              </div>
              <Link href="/admin/guru/pelajaran" className="text-xs font-semibold text-[#2563EB] hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="divide-y divide-[#ECECEC]">
              {subjectModules.slice(0, 3).map((mod) => (
                <div key={mod.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="space-y-1.5">
                    <p className="font-semibold text-[#2E2D2D] text-sm">{mod.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[#737373]">
                      <span className="flex items-center gap-1">
                        <BarChart2 className="w-3.5 h-3.5 text-[#737373]" />
                        {mod.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#737373]" />
                        {mod.duration}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-[6px]">
                    Aktif
                  </span>
                </div>
              ))}

              {subjectModules.length === 0 && (
                <div className="py-6 text-center text-[#737373] text-xs">Belum ada materi terdaftar.</div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT CARD: Monitoring Siswa */}
        <div className="lg:col-span-5 bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-semibold text-[#2E2D2D]">Monitoring Siswa</h3>
                <span className="text-[11px] font-semibold text-white bg-[#2563EB] px-2.5 py-0.5 rounded-[4px]">
                  2 Perhatian
                </span>
              </div>
              <Link href="/admin/guru/monitoring" className="text-xs font-semibold text-[#2563EB] hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="divide-y divide-[#ECECEC]">
              {/* Item 1: Quiz Remedial */}
              <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="space-y-1.5">
                  <p className="font-semibold text-[#2E2D2D] text-sm">Rian Hidayat</p>
                  <div className="flex items-center gap-3 text-xs text-[#737373]">
                    <span className="flex items-center gap-1 text-rose-600">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      Skor kuis 60 (Di bawah target pass 75)
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-[6px]">
                  Remidi
                </span>
              </div>

              {/* Item 2: Module Progress Behind Target */}
              <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="space-y-1.5">
                  <p className="font-semibold text-[#2E2D2D] text-sm">Andi Pratama</p>
                  <div className="flex items-center gap-3 text-xs text-[#737373]">
                    <span className="flex items-center gap-1 text-amber-600">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Progress Modul 40% (Belum Selesai)
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-[6px]">
                  Tertinggal
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
