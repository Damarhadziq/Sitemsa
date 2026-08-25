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
  Timer,
  Activity,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore } from '@/lib/admin-store';
import { StudyAnalyticsService, DayStudyStat, ModuleStudyStat } from '@/services/analytics.service';
import BorderGlow from '@/components/ui/BorderGlow';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminGuruDashboard() {
  const { user, activeSubjectFilter } = useAuth();
  const { modules, quizzes, students } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');

  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  const [analytics, setAnalytics] = useState(() => StudyAnalyticsService.getSubjectAnalytics(currentSubject));

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setAnalytics(StudyAnalyticsService.getSubjectAnalytics(currentSubject));
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [currentSubject]);

  // Listen to realtime reading analytics events
  useEffect(() => {
    const handleAnalyticsUpdate = () => {
      setAnalytics(StudyAnalyticsService.getSubjectAnalytics(currentSubject));
    };
    window.addEventListener('sintesa-analytics-updated', handleAnalyticsUpdate);
    return () => window.removeEventListener('sintesa-analytics-updated', handleAnalyticsUpdate);
  }, [currentSubject]);

  const quickPrompts = [
    { id: 1, text: 'Analisis Belajar Siswa', primary: true },
    { id: 2, text: 'Rekomendasi Remedial' },
    { id: 3, text: 'Evaluasi Kuis' },
  ];

  const subjectModules = modules.filter(
    (m) =>
      m.subject === currentSubject &&
      (!user ||
        user.role === 'superadmin' ||
        m.teacherId === user.id ||
        m.teacherName?.toLowerCase() === user.name?.toLowerCase() ||
        m.teacherName?.toLowerCase().includes(user.name?.toLowerCase()) ||
        user.name?.toLowerCase().includes(m.teacherName?.toLowerCase()))
  );

  const subjectQuizzes = quizzes.filter(
    (q) =>
      q.subject === currentSubject &&
      (!user ||
        user.role === 'superadmin' ||
        q.teacherId === user.id ||
        q.teacherName?.toLowerCase() === user.name?.toLowerCase() ||
        q.teacherName?.toLowerCase().includes(user.name?.toLowerCase()) ||
        user.name?.toLowerCase().includes(q.teacherName?.toLowerCase()))
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

  // Max minutes for weekly chart scaling
  const maxWeeklyMin = Math.max(...analytics.weeklyChart.map((d) => d.minutes), 45);

  return (
    <div className="font-sans text-[#2E2D2D] bg-white space-y-6">
      {/* Page Title & Realtime Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2E2D2D] tracking-tight">
            Dashboard Guru
          </h1>
          <p className="text-xs text-[#737373] mt-1">
            Pemantauan aktivitas membaca, progres modul, dan evaluasi hasil belajar siswa {currentSubject}.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1.5 rounded-[8px] text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Data Realtime Aktif</span>
        </div>
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

              {/* Stat 4: Rata-Rata Waktu Baca Realtime */}
              <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737373]">Rata-rata Waktu Baca</span>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-[4px] flex items-center gap-0.5">
                    <Flame className="w-3 h-3" /> Realtime
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <div>
                    <span className="text-3xl sm:text-4xl font-bold text-[#2E2D2D] tracking-tight">
                      {analytics.averageMinutesPerSession}
                    </span>
                    <span className="text-xs text-[#737373] ml-1.5 font-medium">Menit / sesi</span>
                  </div>
                  <div className="w-9 h-9 rounded-[8px] bg-amber-50/80 flex items-center justify-center border border-amber-100/50">
                    <Timer className="w-4 h-4 text-[#F59E0B]" />
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

          {/* REALTIME GRAPH SECTION: Aktivitas Belajar Mingguan & Waktu Baca Siswa */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Chart: Weekly Reading Time Bar Chart (Span 7) */}
            <div className="lg:col-span-7 bg-white rounded-[10px] border border-[#ECECEC] p-6 space-y-5 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[6px] bg-blue-50 text-[#2563EB] flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-semibold text-[#2E2D2D]">
                      Grafik Aktivitas Waktu Belajar Realtime
                    </h3>
                  </div>
                  <p className="text-xs text-[#737373]">
                    Total durasi waktu membaca siswa (dalam menit) selama 7 hari terakhir pada bidang {currentSubject}.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#2563EB] bg-[#F4EFFF] px-2.5 py-1 rounded-[6px]">
                  Total: {analytics.totalReadingMinutes} Menit
                </span>
              </div>

              {/* Bar Graph Columns */}
              <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end pt-4 pb-2 h-44 border-b border-[#ECECEC]">
                {analytics.weeklyChart.map((d, idx) => {
                  const heightPercent = Math.min(100, Math.max(15, (d.minutes / maxWeeklyMin) * 100));
                  const isToday = idx === 6;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                      {/* Tooltip value */}
                      <span className="text-[10px] font-semibold text-[#737373] opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.minutes}m
                      </span>
                      
                      {/* Bar Column */}
                      <div className="w-full max-w-[36px] bg-slate-100 rounded-t-[6px] overflow-hidden flex items-end h-full">
                        <div
                          className={`w-full rounded-t-[6px] transition-all duration-500 ease-out ${
                            isToday ? 'bg-[#2563EB]' : 'bg-[#60A5FA] group-hover:bg-[#2563EB]'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      {/* Day Label */}
                      <span className={`text-xs font-semibold ${isToday ? 'text-[#2563EB]' : 'text-[#737373]'}`}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[#737373] pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                  Hari Ini
                </span>
                <span>Rata-rata: <strong>{analytics.averageMinutesPerSession} Menit/Sesi</strong></span>
              </div>
            </div>

            {/* Right Chart: Per-Module Reading Stats (Span 5) */}
            <div className="lg:col-span-5 bg-white rounded-[10px] border border-[#ECECEC] p-6 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[6px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-[#2E2D2D]">
                    Analisis Durasi per Modul
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-[4px]">
                  Realtime
                </span>
              </div>

              <div className="space-y-3 divide-y divide-[#ECECEC]">
                {analytics.moduleStats.slice(0, 3).map((ms, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#2E2D2D] truncate max-w-[220px]" title={ms.title}>
                        {ms.title}
                      </span>
                      <span className="font-bold text-[#2563EB] shrink-0">
                        {ms.avgMinutes} Menit
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${ms.completionRate}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#737373]">
                      <span>{ms.totalReads}x Sesi Pembelajaran</span>
                      <span>{ms.completionRate}% Penyelesaian</span>
                    </div>
                  </div>
                ))}

                {analytics.moduleStats.length === 0 && (
                  <div className="py-6 text-center text-xs text-[#737373]">
                    Belum ada data membaca siswa untuk modul ini.
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#ECECEC]">
                <Link
                  href="/admin/guru/monitoring"
                  className="w-full py-2 bg-[#F6F5FF] hover:bg-[#E8E7FF] text-[#2563EB] rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Buka Detail Pemantauan Siswa</span>
                </Link>
              </div>
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
