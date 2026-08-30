'use client';

import React, { useState, useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminGuruDashboard() {
  const { user, activeSubjectFilter } = useAuth();
  const { modules, quizzes, students } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');

  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [currentSubject]);

  const quickPrompts = [
    { id: 1, text: 'Analisis Belajar Siswa', primary: true },
    { id: 2, text: 'Rekomendasi Remedial' },
    { id: 3, text: 'Evaluasi Kuis' },
  ];

  const isSubjectMatch = (mSub?: string, curSub?: string) => {
    if (!mSub || !curSub) return false;
    const a = mSub.toLowerCase().replace(/[^a-z]/g, '');
    const b = curSub.toLowerCase().replace(/[^a-z]/g, '');
    if (a === b) return true;
    if ((a.includes('olahraga') || a.includes('keolahragaan') || a.includes('pjok') || a.includes('jasmani')) &&
        (b.includes('olahraga') || b.includes('keolahragaan') || b.includes('pjok') || b.includes('jasmani'))) {
      return true;
    }
    return false;
  };

  const isTeacherMatch = (teacherId?: string, teacherName?: string) => {
    if (!user) return true;
    if (user.role === 'superadmin') return true;

    const uId = (user.id || '').toLowerCase().trim();
    const uName = (user.name || '').toLowerCase().trim();

    const tId = (teacherId || '').toLowerCase().trim();
    const tName = (teacherName || '').toLowerCase().trim();

    if (tId && uId && tId === uId) return true;
    if (tName && uName) {
      if (tName === uName) return true;
      if (tName.includes(uName) || uName.includes(tName)) return true;
    }
    return false;
  };

  const subjectModules = modules.filter(
    (m) => isSubjectMatch(m.subject, currentSubject) && isTeacherMatch(m.teacherId, m.teacherName)
  );

  const subjectQuizzes = quizzes.filter(
    (q) => isSubjectMatch(q.subject, currentSubject) && isTeacherMatch(q.teacherId, q.teacherName)
  );

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

  return (
    <div className="font-sans text-[#2E2D2D] bg-white space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2E2D2D] tracking-tight">
          Dashboard Guru
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          {/* TOP ROW SKELETON: Left (2x2 Stat Cards) & Right (AI Card) */}
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

          {/* BOTTOM ROW SKELETON: Materi & Monitoring List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 bg-slate-100/70 rounded-[12px] p-6 space-y-4">
              <div className="flex justify-between items-center pb-2">
                <Skeleton className="h-5 w-32 rounded-[4px]" />
                <Skeleton className="h-4 w-16 rounded-[4px]" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-44 rounded-[4px]" />
                      <div className="flex gap-2">
                        <Skeleton className="h-3 w-16 rounded-[4px]" />
                        <Skeleton className="h-3 w-16 rounded-[4px]" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-14 rounded-[4px]" />
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
                      <Skeleton className="h-4 w-32 rounded-[4px]" />
                      <Skeleton className="h-3 w-48 rounded-[4px]" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-[4px]" />
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
              {/* Stat 1: Modul Materi */}
              <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737373]">Modul {currentSubject}</span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> 8.5%
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
                    <TrendingUp className="w-3 h-3" /> 1.1%
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
                    <TrendingUp className="w-3 h-3" /> 2.4%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{subjectStudents.length}</span>
                  <div className="w-9 h-9 rounded-[8px] bg-emerald-50/80 flex items-center justify-center border border-emerald-100/50">
                    <Users className="w-4 h-4 text-[#10B981]" />
                  </div>
                </div>
              </div>

              {/* Stat 4: Rata-Rata Nilai Kuis */}
              <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737373]">Rata-rata kuis</span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> 0.8%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">{avgSubjectScore}%</span>
                  <div className="w-9 h-9 rounded-[8px] bg-amber-50/80 flex items-center justify-center border border-amber-100/50">
                    <Award className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: AI Copilot Card (Span 5) */}
            <div className="lg:col-span-5 relative rounded-[12px] min-h-[336px] flex flex-col group">
              <BorderGlow
                backgroundColor="#FFFFFF"
                borderRadius={12}
                glowRadius={20}
                glowIntensity={1.0}
                coneSpread={25}
                animated={true}
                colors={['#2563EB', '#6366F1', '#a855f7']}
                className="w-full h-full"
              >
                <div className="bg-gradient-to-b from-blue-50/50 via-purple-50/20 to-white p-6 flex flex-col justify-center items-center text-center w-full h-full relative overflow-hidden space-y-6">
                  
                  {/* Header Section: Icon + Titles in tight vertical layout */}
                  <div className="flex flex-col items-center space-y-2.5 max-w-sm">
                    <div className="w-10 h-10 rounded-[8px] bg-white border border-[#ECECEC] flex items-center justify-center text-[#2E2D2D] shadow-xs">
                      <Sparkles className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#2E2D2D] flex items-center justify-center gap-1.5">
                        Tanyakan AI Sitemsa
                        <span className="text-[10px] bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] font-semibold">
                          Coming Soon
                        </span>
                      </h3>
                      <p className="text-xs text-[#737373] leading-relaxed max-w-xs mx-auto">
                        Asisten kecerdasan buatan untuk analisis belajar & kuis
                      </p>
                    </div>
                  </div>

                  {/* Input Search Box & Send Button */}
                  <div className="w-full max-w-md space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        placeholder="Fitur Asisten AI segera hadir..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50/60 border border-[#ECECEC] rounded-[8px] text-xs text-[#2E2D2D] placeholder-[#A3A3A3] cursor-not-allowed opacity-75"
                      />
                      <button
                        type="button"
                        disabled
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-200 text-slate-400 rounded-[6px] flex items-center justify-center cursor-not-allowed"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </BorderGlow>
            </div>
          </div>

          {/* BOTTOM ROW: Materi & Monitoring List */}
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
                        <div className="flex items-center gap-3 text-xs text-[#737373] font-medium">
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
      )}
    </div>
  );
}
