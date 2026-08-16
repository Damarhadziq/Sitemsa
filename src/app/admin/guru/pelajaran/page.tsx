'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Play,
  FileText,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  FileCode,
  TrendingUp,
  Users,
  Eye,
  BarChart3,
  ArrowUpRight,
  AlertCircle,
  ArrowLeft,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore, ModuleItem } from '@/lib/admin-store';
import ModuleBlockBuilder, { CanvasBlock } from '@/components/admin/ModuleBlockBuilder';

// Skeleton Component for smooth loading states
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-[8px] ${className || ''}`} />;
}

export default function AdminGuruPelajaranPage() {
  const searchParams = useSearchParams();
  const itemIdParam = searchParams.get('item');

  const { user, activeSubjectFilter } = useAuth();
  const { modules, quizzes, addModule, deleteModule } = useAdminStore();

  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  const subjectModules = modules.filter((m) => m.subject === currentSubject);
  const subjectQuizzes = quizzes.filter((q) => q.subject === currentSubject);

  // Selected item ID from query param (null = Landing Overview mode)
  const selectedItemId = itemIdParam || null;

  const selectedModule = selectedItemId ? subjectModules.find((m) => m.id === selectedItemId) : null;
  const selectedQuiz = selectedItemId ? subjectQuizzes.find((q) => q.id === selectedItemId) : null;

  // Loading state simulation
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedItemId, currentSubject]);

  // DRIBBBLE BLOCK BUILDER MODAL STATE
  const [showBlockBuilder, setShowBlockBuilder] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);

  // Open Block Builder
  const handleOpenBlockBuilder = (mod?: ModuleItem) => {
    setEditingModule(mod || null);
    setShowBlockBuilder(true);
  };

  // Handle Save from Block Builder
  const handleSaveFromBuilder = (
    moduleData: Partial<ModuleItem>,
    blocks: CanvasBlock[]
  ) => {
    if (editingModule) {
      // Edit existing module
    } else {
      addModule({
        subject: currentSubject,
        title: moduleData.title || 'Modul Materi Baru',
        level: moduleData.level || 'Pemula',
        duration: moduleData.duration || '30 Menit',
        topics: ['Materi Sintesa', 'Praktikum'],
        description: blocks.find((b) => b.type === 'text')?.textValue || 'Deskripsi modul materi.',
        teacherId: user?.id || 't-1',
        teacherName: user?.name || 'Pak Budi Prasetyo, M.Kom.',
      });
    }
  };

  const handleDeleteModuleItem = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus modul "${title}"?`)) {
      deleteModule(id);
    }
  };

  // Access frequency data for Line Chart
  const weeklyAccessData = [
    { day: 'Sen', views: 24, x: 40, y: 110 },
    { day: 'Sel', views: 38, x: 125, y: 80 },
    { day: 'Rab', views: 45, x: 210, y: 65 },
    { day: 'Kam', views: 32, x: 295, y: 92 },
    { day: 'Jum', views: 56, x: 380, y: 40 },
    { day: 'Sab', views: 18, x: 465, y: 122 },
    { day: 'Min', views: 12, x: 550, y: 135 },
  ];

  const svgPathPoints = weeklyAccessData.map((d) => `${d.x},${d.y}`).join(' L ');
  const svgAreaPoints = `M 40,150 L ${svgPathPoints} L 550,150 Z`;

  const recentReaders = [
    { name: 'Ahmad Fauzi', class: 'X RPL 1', time: '10 menit lalu', status: 'Selesai (100%)' },
    { name: 'Bintang Permata', class: 'X RPL 2', time: '25 menit lalu', status: 'Membaca (75%)' },
    { name: 'Citra Dewi', class: 'X TKJ 1', time: '1 jam lalu', status: 'Selesai (100%)' },
    { name: 'Dian Sastro', class: 'X RPL 1', time: '3 jam lalu', status: 'Membaca (40%)' },
  ];

  return (
    <div className="font-sans text-[#2E2D2D] bg-white space-y-6 pb-6">
      
      {/* Dynamic Headline Header (NO SUBTITLE & NO DIVIDER LINE) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {isLoading ? (
            <Skeleton className="h-9 w-64 sm:w-80" />
          ) : (
            /* CLEAN HEADLINE (NO SUBTITLE BELOW) */
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2E2D2D] tracking-tight">
              {selectedModule
                ? selectedModule.title
                : selectedQuiz
                ? selectedQuiz.title
                : `Modul & Kuis ${currentSubject}`}
            </h1>
          )}
        </div>

        {/* Dynamic Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoading ? (
            <Skeleton className="h-10 w-36" />
          ) : (
            <>
              {/* SHOW "+ Tambah Modul Materi Baru" ONLY IN LANDING OVERVIEW MODE */}
              {!selectedItemId && (
                <button
                  onClick={() => handleOpenBlockBuilder()}
                  className="px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Modul Materi Baru</span>
                </button>
              )}

              {/* MATERIAL DETAIL MODE ACTIONS */}
              {selectedModule && (
                <div className="flex items-center gap-2">
                  <a
                    href="/admin/guru/pelajaran"
                    className="px-3.5 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Semua Modul</span>
                  </a>
                  <button
                    onClick={() => handleOpenBlockBuilder(selectedModule)}
                    className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Blok Kanvas</span>
                  </button>
                  <button
                    onClick={() => handleDeleteModuleItem(selectedModule.id, selectedModule.title)}
                    title="Hapus Modul"
                    className="p-2 rounded-[8px] bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-[#ECECEC] transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="space-y-6">
        
        {/* SKELETON LOADING STATE FOR WHOLE PAGE CONTENT */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 rounded-[12px] border border-[#ECECEC] space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>

            <div className="p-6 rounded-[12px] border border-[#ECECEC] space-y-4">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-44 w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="md:col-span-2 h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          </div>
        ) : (
          <>
            {/* LANDING OVERVIEW VIEW (WHEN NO ITEM IS SELECTED) */}
            {!selectedItemId && (
              <div className="space-y-6">
                
                {/* STATS OVERVIEW CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-1 shadow-2xs">
                    <p className="text-xs font-semibold text-[#737373]">Total Modul Pembelajaran</p>
                    <p className="text-2xl font-bold text-[#2563EB]">{subjectModules.length}</p>
                    <p className="text-[11px] text-[#AAAAAA]">Modul Aktif {currentSubject}</p>
                  </div>

                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-1 shadow-2xs">
                    <p className="text-xs font-semibold text-[#737373]">Total Kuis & Evaluasi</p>
                    <p className="text-2xl font-bold text-indigo-600">{subjectQuizzes.length}</p>
                    <p className="text-[11px] text-[#AAAAAA]">Kuis Terdaftar</p>
                  </div>

                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-1 shadow-2xs">
                    <p className="text-xs font-semibold text-[#737373]">Tingkat Kesulitan</p>
                    <p className="text-2xl font-bold text-[#2E2D2D]">Pemula &mdash; Mahir</p>
                    <p className="text-[11px] text-[#AAAAAA]">Kurikulum Merdeka SMK</p>
                  </div>
                </div>

                {/* ALL MODULES & QUIZZES LANDING GRID */}
                <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <h3 className="text-base font-bold text-[#2E2D2D]">Semua Modul & Kuis {currentSubject}</h3>
                      <p className="text-xs text-[#737373]">Pilih salah satu materi di bawah atau via menu sidebar tree untuk melihat detail.</p>
                    </div>
                    <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-[6px]">
                      {subjectModules.length} Modul &bull; {subjectQuizzes.length} Kuis
                    </span>
                  </div>

                  {/* MODULES LIST CARDS */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#737373] flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-[#2563EB]" /> Modul Pembelajaran
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subjectModules.map((mod) => (
                        <div
                          key={mod.id}
                          className="p-5 rounded-[10px] bg-slate-50/60 border border-[#ECECEC] hover:border-[#2563EB] hover:bg-blue-50/20 transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#2563EB] bg-white px-2 py-0.5 rounded border border-[#ECECEC]">
                                {mod.level}
                              </span>
                              <span className="text-xs text-[#737373] flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {mod.duration}
                              </span>
                            </div>
                            <h5 className="font-bold text-sm text-[#2E2D2D]">{mod.title}</h5>
                            <p className="text-xs text-[#737373] line-clamp-2">{mod.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <a
                              href={`/admin/guru/pelajaran?item=${mod.id}`}
                              className="text-xs font-bold text-[#2563EB] hover:underline"
                            >
                              Lihat Detail Modul &rarr;
                            </a>
                            <button
                              onClick={() => handleOpenBlockBuilder(mod)}
                              className="px-3 py-1 rounded-[6px] bg-white border border-[#ECECEC] hover:border-[#2563EB] text-xs font-semibold text-[#2E2D2D] hover:text-[#2563EB] cursor-pointer shadow-2xs"
                            >
                              Edit Modul
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QUIZZES LIST CARDS */}
                  {subjectQuizzes.length > 0 && (
                    <div className="space-y-3 pt-4">
                      <h4 className="text-xs font-bold text-[#737373] flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-600" /> Kuis & Evaluasi
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subjectQuizzes.map((qz) => (
                          <div
                            key={qz.id}
                            className="p-5 rounded-[10px] bg-slate-50/60 border border-[#ECECEC] hover:border-indigo-500 hover:bg-indigo-50/20 transition-all flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-[#ECECEC]">
                                  Kuis Interactive
                                </span>
                                <span className="text-xs text-[#737373] flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> {qz.duration}
                                </span>
                              </div>
                              <h5 className="font-bold text-sm text-[#2E2D2D]">{qz.title}</h5>
                              <p className="text-xs text-[#737373]">Jumlah Soal: {qz.questions.length} Soal &bull; Passing Score: {qz.passScore}</p>
                            </div>

                            <div className="pt-2">
                              <a
                                href={`/admin/guru/pelajaran?item=${qz.id}`}
                                className="text-xs font-bold text-indigo-600 hover:underline"
                              >
                                Lihat Detail Kuis &rarr;
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* MATERIAL DETAIL VIEW (WITH LINE CHART & NO DIVIDER BORDERS) */}
            {selectedModule && (
              <div className="space-y-6">
                
                {/* 1. TOP ANALYTICS STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#737373]">Total Akses Siswa</span>
                      <Eye className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <p className="text-2xl font-bold text-[#2E2D2D]">225 <span className="text-xs font-normal text-emerald-600 flex items-center inline-flex gap-0.5"><TrendingUp className="w-3 h-3" /> +18%</span></p>
                    <p className="text-[11px] text-[#AAAAAA]">Dibaca 225 kali bulan ini</p>
                  </div>

                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#737373]">Rata-rata Durasi</span>
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-[#2E2D2D]">18.5 <span className="text-xs font-normal text-[#737373]">Menit</span></p>
                    <p className="text-[11px] text-[#AAAAAA]">Estimasi membaca 25 menit</p>
                  </div>

                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#737373]">Tingkat Penyelesaian</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">94.2%</p>
                    <p className="text-[11px] text-[#AAAAAA]">34 dari 36 siswa lulus</p>
                  </div>

                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#737373]">Perlu Perhatian</span>
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-amber-600">2 <span className="text-xs font-normal text-[#737373]">Siswa</span></p>
                    <p className="text-[11px] text-[#AAAAAA]">Belum tuntas membaca</p>
                  </div>
                </div>

                {/* 2. FREQUENCY ACCESS GRAPH (SMOOTH SVG LINE CHART) */}
                <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <h3 className="text-base font-bold text-[#2E2D2D] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#2563EB]" />
                        Grafik Frekuensi Akses Materi (7 Hari Terakhir)
                      </h3>
                      <p className="text-xs text-[#737373]">Trend harian siswa yang membaca modul materi ini.</p>
                    </div>
                    <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-[6px]">
                      Puncak: Jumat (56 akses)
                    </span>
                  </div>

                  {/* SVG LINE CHART VISUALIZATION */}
                  <div className="relative pt-2">
                    <svg viewBox="0 0 600 170" className="w-full h-48 overflow-visible">
                      <defs>
                        <linearGradient id="lineChartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path d={svgAreaPoints} fill="url(#lineChartGradient)" />

                      {/* Line Stroke */}
                      <path
                        d={`M ${svgPathPoints}`}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Dots & Tooltips */}
                      {weeklyAccessData.map((d, i) => (
                        <g key={i} className="group cursor-pointer">
                          {/* Dot Circle */}
                          <circle
                            cx={d.x}
                            cy={d.y}
                            r="5"
                            className="fill-white stroke-[#2563EB] stroke-[3] group-hover:r-7 transition-all"
                          />
                          {/* Day Label */}
                          <text
                            x={d.x}
                            y="165"
                            textAnchor="middle"
                            className="text-[11px] font-bold fill-[#737373] group-hover:fill-[#2563EB]"
                          >
                            {d.day}
                          </text>

                          {/* Hover Tooltip Box */}
                          <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <rect
                              x={d.x - 30}
                              y={d.y - 32}
                              width="60"
                              height="22"
                              rx="4"
                              fill="#2E2D2D"
                            />
                            <text
                              x={d.x}
                              y={d.y - 18}
                              textAnchor="middle"
                              fill="#FFFFFF"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              {d.views} Akses
                            </text>
                          </g>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* 3. MATERIAL CONTENT & DRIBBBLE BLOCK BUILDER BANNER */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Metadata & Canvas Banner */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-4 shadow-2xs">
                      <h3 className="text-sm font-bold text-[#2E2D2D]">Deskripsi & Konten Kanvas</h3>
                      <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-4 rounded-[8px] border border-[#ECECEC]">
                        {selectedModule.description}
                      </p>

                      <h3 className="text-sm font-bold text-[#2E2D2D] pt-2">Topik Pembahasan</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedModule.topics.map((tp, idx) => (
                          <span key={idx} className="text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-[6px]">
                            {tp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dribbble Block Builder Banner */}
                    <div className="p-5 rounded-[12px] bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[10px] bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#2E2D2D]">Disusun dengan Editor Kanvas Blok Dribbble</p>
                          <p className="text-xs text-[#737373]">Tambahkan teks, gambar, lampiran PDF, atau kuis langsung di kanvas.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenBlockBuilder(selectedModule)}
                        className="px-4 py-2 rounded-[8px] bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs shrink-0"
                      >
                        Buka Kanvas
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Recent Readers Student Table (NO DIVIDER BORDER) */}
                  <div className="bg-white rounded-[12px] border border-[#ECECEC] p-5 space-y-4 shadow-2xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#2E2D2D] pb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2563EB]" />
                        Siswa Terakhir Akses
                      </h3>
                      <div className="divide-y divide-slate-100">
                        {recentReaders.map((rr, idx) => (
                          <div key={idx} className="py-3 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-[#2E2D2D]">{rr.name}</p>
                              <p className="text-[10px] text-[#737373]">{rr.class} &bull; {rr.time}</p>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              {rr.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href="/admin/guru/monitoring"
                      className="text-xs font-bold text-[#2563EB] hover:underline flex items-center justify-center gap-1 pt-2"
                    >
                      <span>Lihat Semua Monitoring Siswa</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            )}

            {/* DETAIL VIEW: IF A QUIZ IS SELECTED */}
            {selectedQuiz && (
              <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-6 shadow-2xs">
                <div className="flex items-start justify-between pb-4">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-[4px] inline-block mb-2">
                      Kuis Interaktif Sintesa
                    </span>
                    <h2 className="text-xl font-bold text-[#2E2D2D] tracking-tight">{selectedQuiz.title}</h2>
                    <div className="flex items-center gap-3 text-xs text-[#737373] mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#737373]" />
                        Durasi: {selectedQuiz.duration}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Passing Score: {selectedQuiz.passScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#2E2D2D]">Soal Kuis Terdaftar ({selectedQuiz.questions.length} Soal)</h3>
                  <div className="space-y-3">
                    {selectedQuiz.questions.map((q, qIdx) => (
                      <div key={q.id} className="p-4 rounded-[8px] bg-slate-50 border border-[#ECECEC] space-y-2">
                        <p className="font-semibold text-xs text-[#2E2D2D]">
                          {qIdx + 1}. {q.text}
                        </p>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-[6px] text-xs ${
                                q.correctAnswer === oIdx
                                  ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                                  : 'bg-white text-[#737373] border border-[#ECECEC]'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* FULL-SCREEN DRIBBBLE ADD-SHOT BLOCK BUILDER MODAL */}
      {showBlockBuilder && (
        <ModuleBlockBuilder
          initialModule={editingModule}
          subjectName={currentSubject}
          onClose={() => setShowBlockBuilder(false)}
          onSave={handleSaveFromBuilder}
        />
      )}

    </div>
  );
}
