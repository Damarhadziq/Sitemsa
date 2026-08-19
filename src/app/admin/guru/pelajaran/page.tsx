'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  BookOpen,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Play,
  FileText,
  Clock,
  CheckCircle2,
  FileCode,
  TrendingUp,
  Users,
  Eye,
  ArrowUpRight,
  AlertCircle,
  ArrowLeft,
  QrCode,
  ExternalLink,
  Download,
  X,
  Copy,
  Check,
  MoreVertical,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore, ModuleItem } from '@/lib/admin-store';
import ModuleBlockBuilder, { CanvasBlock } from '@/components/admin/ModuleBlockBuilder';
import { Tooltip } from '@/components/ui/tooltip';

// Card More Dropdown Component (Profile Dropdown Style)
function CardMoreDropdown({
  onPreview,
  onEdit,
  onDelete,
  itemType = 'materi',
}: {
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  itemType?: 'materi' | 'kuis';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <Tooltip content="Opsi Pilihan" side="top">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="p-1 rounded-[6px] text-[#737373] hover:text-[#2E2D2D] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </Tooltip>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1.5 z-50 w-48 bg-white border border-[#ECECEC] rounded-[10px] p-1.5 shadow-xs space-y-0.5 font-sans animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onPreview();
            }}
            className="w-full text-left px-3 py-2 rounded-[6px] text-xs font-medium text-[#2E2D2D] hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#2E2D2D] shrink-0" />
            <span>Preview Website</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onEdit();
            }}
            className="w-full text-left px-3 py-2 rounded-[6px] text-xs font-medium text-[#2E2D2D] hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#2E2D2D] shrink-0" />
            <span>Edit {itemType === 'materi' ? 'Materi' : 'Kuis'}</span>
          </button>

          <div className="my-1 border-t border-[#ECECEC]" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete();
            }}
            className="w-full text-left px-3 py-2 rounded-[6px] text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Hapus {itemType === 'materi' ? 'Materi' : 'Kuis'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Skeleton Component for smooth loading states
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-[8px] ${className || ''}`} />;
}

export default function AdminGuruPelajaranPage() {
  const router = useRouter();
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

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isAnyModalOpen = showBlockBuilder || showQrModal || !!deleteTarget;

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

  const handleDeleteModuleItem = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const confirmDeleteModule = () => {
    if (deleteTarget) {
      deleteModule(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Access frequency data for Line Chart 1
  const weeklyAccessData = [
    { day: 'Sen', views: 24, x: 40, y: 105 },
    { day: 'Sel', views: 38, x: 125, y: 75 },
    { day: 'Rab', views: 45, x: 210, y: 60 },
    { day: 'Kam', views: 32, x: 295, y: 88 },
    { day: 'Jum', views: 56, x: 380, y: 35 },
    { day: 'Sab', views: 18, x: 465, y: 118 },
    { day: 'Min', views: 12, x: 550, y: 130 },
  ];

  const svgPathPoints = weeklyAccessData.map((d) => `${d.x},${d.y}`).join(' L ');
  const svgAreaPoints = `M 40,145 L ${svgPathPoints} L 550,145 Z`;

  // Reading duration data for Line Chart 2
  const weeklyDurationData = [
    { day: 'Sen', duration: '12 Min', x: 40, y: 115 },
    { day: 'Sel', duration: '16 Min', x: 125, y: 90 },
    { day: 'Rab', duration: '19 Min', x: 210, y: 70 },
    { day: 'Kam', duration: '15 Min', x: 295, y: 98 },
    { day: 'Jum', duration: '24 Min', x: 380, y: 38 },
    { day: 'Sab', duration: '18 Min', x: 465, y: 78 },
    { day: 'Min', duration: '14 Min', x: 550, y: 105 },
  ];

  const svgDurationPath = weeklyDurationData.map((d) => `${d.x},${d.y}`).join(' L ');
  const svgDurationArea = `M 40,145 L ${svgDurationPath} L 550,145 Z`;

  const recentReaders = [
    { name: 'Ahmad Fauzi', time: '10 menit lalu', status: 'Selesai (100%)' },
    { name: 'Bintang Permata', time: '25 menit lalu', status: 'Membaca (75%)' },
    { name: 'Citra Dewi', time: '1 jam lalu', status: 'Selesai (100%)' },
    { name: 'Dian Sastro', time: '3 jam lalu', status: 'Membaca (40%)' },
  ];

  return (
    <div className="font-sans text-[#2E2D2D] bg-white space-y-8 pb-6">
      
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

        {/* Action Header Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoading ? (
            <Skeleton className="h-10 w-36" />
          ) : (
            <>
              {/* SHOW "+ Tambah Materi Baru" AND "+ Tambah Kuis Baru" ONLY IN LANDING OVERVIEW MODE */}
              {!selectedItemId && (
                <div className="flex items-center gap-2">
                  <Tooltip content="Buat Modul Materi Pembelajaran Baru" side="bottom">
                    <button
                      onClick={() => handleOpenBlockBuilder()}
                      className="px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Materi Baru</span>
                    </button>
                  </Tooltip>
                  <Tooltip content="Buat Kuis & Evaluasi Pembelajaran Baru" side="bottom">
                    <button
                      onClick={() => handleOpenBlockBuilder()}
                      className="px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Kuis Baru</span>
                    </button>
                  </Tooltip>
                </div>
              )}

              {/* MATERIAL DETAIL MODE ACTIONS */}
              {selectedModule && (
                <div className="flex items-center gap-2">
                  <Tooltip content="Pratinjau Tampilan Materi di Website Utama" side="bottom">
                    <a
                      href={`/materi/${selectedModule.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 border border-slate-200 transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.98]"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Preview Website</span>
                    </a>
                  </Tooltip>

                  <Tooltip content="Edit Isi & Blok Modul Materi" side="bottom">
                    <button
                      onClick={() => handleOpenBlockBuilder(selectedModule)}
                      className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Materi</span>
                    </button>
                  </Tooltip>

                  <Tooltip content="Hapus Modul Ini" side="bottom">
                    <button
                      onClick={() => handleDeleteModuleItem(selectedModule.id, selectedModule.title)}
                      className="p-2 rounded-[8px] bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-[#ECECEC] transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.96]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              )}

              {/* QUIZ DETAIL MODE ACTIONS */}
              {selectedQuiz && (
                <div className="flex items-center gap-2">
                  <Tooltip content="Pratinjau Tampilan Kuis di Website Utama" side="bottom">
                    <a
                      href={`/kuis/${selectedQuiz.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 border border-slate-200 transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.98]"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Preview Website</span>
                    </a>
                  </Tooltip>

                  <Tooltip content="Edit Soal & Evaluasi Kuis" side="bottom">
                    <button
                      onClick={() => handleOpenBlockBuilder()}
                      className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Kuis</span>
                    </button>
                  </Tooltip>

                  <Tooltip content="Hapus Kuis Ini" side="bottom">
                    <button
                      onClick={() => handleDeleteModuleItem(selectedQuiz.id, selectedQuiz.title)}
                      className="p-2 rounded-[8px] bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-[#ECECEC] transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.96]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-56 w-full rounded-[12px]" />
              <Skeleton className="h-56 w-full rounded-[12px]" />
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
                
                {/* MODULES & QUIZZES GRID */}
                <div className="space-y-6">
                  
                  {/* SECTION 1: DAFTAR MODUL MATERI */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-[#2E2D2D]">
                        Daftar Modul Materi
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-[6px] bg-[#2563EB] text-white text-xs font-bold">
                        {subjectModules.length} Materi
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjectModules.map((mod) => (
                        <div
                          key={mod.id}
                          onClick={() => router.push(`/admin/guru/pelajaran?item=${mod.id}`)}
                          className="bg-white p-3 pb-4 rounded-[12px] border border-[#ECECEC] hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {mod.level}
                              </span>

                              <CardMoreDropdown
                                itemType="materi"
                                onPreview={() => window.open(`/materi/${mod.id}`, '_blank')}
                                onEdit={() => handleOpenBlockBuilder(mod)}
                                onDelete={() => handleDeleteModuleItem(mod.id, mod.title)}
                              />
                            </div>

                            <h4 className="font-bold text-sm text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors leading-snug">
                              {mod.title}
                            </h4>

                            <p className="text-xs text-[#737373] line-clamp-2 leading-relaxed">
                              {mod.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 2: KUIS & EVALUASI */}
                  {subjectQuizzes.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-[#2E2D2D]">
                          Kuis & Evaluasi
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-[6px] bg-[#2563EB] text-white text-xs font-bold">
                          {subjectQuizzes.length} Kuis
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjectQuizzes.map((qz) => (
                          <div
                            key={qz.id}
                            onClick={() => router.push(`/admin/guru/pelajaran?item=${qz.id}`)}
                            className="bg-white p-3 pb-4 rounded-[12px] border border-[#ECECEC] hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                  Kuis Interaktif
                                </span>

                                <CardMoreDropdown
                                  itemType="kuis"
                                  onPreview={() => window.open(`/kuis/${qz.id}`, '_blank')}
                                  onEdit={() => handleOpenBlockBuilder()}
                                  onDelete={() => handleDeleteModuleItem(qz.id, qz.title)}
                                />
                              </div>

                              <h4 className="font-bold text-sm text-[#2E2D2D] group-hover:text-indigo-600 transition-colors leading-snug">
                                {qz.title}
                              </h4>

                              <div className="flex items-center gap-3 text-xs text-[#737373] pt-0.5">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{qz.questions.length} Soal</span>
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Pass Score {qz.passScore}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* MATERIAL DETAIL VIEW (WITH 2 SIDE-BY-SIDE CHARTS & NO DIVIDER BORDERS) */}
            {selectedModule && (
              <div className="space-y-6">
                
                {/* 1. TOP ANALYTICS STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#737373]">Total Akses Siswa</span>
                      <Eye className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <p className="text-2xl font-bold text-[#2E2D2D]">225 <span className="text-xs font-normal text-emerald-600 flex items-center inline-flex gap-0.5"><TrendingUp className="w-3 h-3" /> 18%</span></p>
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

                {/* 2. TWO CHARTS SIDE-BY-SIDE (BACKGROUND DASHED GRID LINES, CLEAN HEADLINES WITHOUT ICONS OR SUBTITLES) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* CHART 1: FREKUENSI AKSES MATERI */}
                  <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#2E2D2D]">
                        Frekuensi Akses Materi
                      </h3>
                      <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-[6px]">
                        7 Hari Terakhir
                      </span>
                    </div>

                    {/* SVG LINE CHART 1 */}
                    <div className="relative pt-1">
                      <svg viewBox="0 0 600 160" className="w-full h-40 overflow-visible">
                        <defs>
                          <linearGradient id="accessChartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Background Grid Lines for easy visual scanning */}
                        <line x1="30" y1="30" x2="570" y2="30" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1.5" />
                        <line x1="30" y1="68" x2="570" y2="68" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1.5" />
                        <line x1="30" y1="106" x2="570" y2="106" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1.5" />
                        <line x1="30" y1="145" x2="570" y2="145" stroke="#E2E8F0" strokeWidth="1" />

                        {/* Area Fill */}
                        <path d={svgAreaPoints} fill="url(#accessChartGradient)" />

                        {/* Line Stroke */}
                        <path
                          d={`M ${svgPathPoints}`}
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data Dots, Vertical Guides & Labels */}
                        {weeklyAccessData.map((d, i) => (
                          <g key={i} className="group cursor-pointer">
                            {/* Invisible full-height vertical hit area column */}
                            <rect
                              x={d.x - 35}
                              y="10"
                              width="70"
                              height="140"
                              fill="transparent"
                              className="cursor-pointer"
                            />

                            {/* Vertical Guide Line on Hover */}
                            <line
                              x1={d.x}
                              y1="25"
                              x2={d.x}
                              y2="145"
                              stroke="#2563EB"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                              className="opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none"
                            />

                            <circle
                              cx={d.x}
                              cy={d.y}
                              r="4.5"
                              className="fill-white stroke-[#2563EB] stroke-[2.5] group-hover:r-6 transition-all"
                            />
                            <text
                              x={d.x}
                              y="160"
                              textAnchor="middle"
                              className="text-[11px] font-semibold fill-[#737373] group-hover:fill-[#2563EB] transition-colors"
                            >
                              {d.day}
                            </text>

                            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <rect
                                x={d.x - 28}
                                y={d.y - 30}
                                width="56"
                                height="20"
                                rx="4"
                                fill="#2E2D2D"
                              />
                              <text
                                x={d.x}
                                y={d.y - 16}
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

                  {/* CHART 2: DURASI MEMBACA RATA-RATA */}
                  <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#2E2D2D]">
                        Durasi Membaca Rata-Rata
                      </h3>
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-[6px]">
                        7 Hari Terakhir
                      </span>
                    </div>

                    {/* SVG LINE CHART 2 */}
                    <div className="relative pt-1">
                      <svg viewBox="0 0 600 160" className="w-full h-40 overflow-visible">
                        <defs>
                          <linearGradient id="durationChartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Background Grid Lines for easy visual scanning */}
                        <line x1="30" y1="30" x2="570" y2="30" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1.5" />
                        <line x1="30" y1="68" x2="570" y2="68" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1.5" />
                        <line x1="30" y1="106" x2="570" y2="106" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1.5" />
                        <line x1="30" y1="145" x2="570" y2="145" stroke="#E2E8F0" strokeWidth="1" />

                        {/* Area Fill */}
                        <path d={svgDurationArea} fill="url(#durationChartGradient)" />

                        {/* Line Stroke */}
                        <path
                          d={`M ${svgDurationPath}`}
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data Dots, Vertical Guides & Labels */}
                        {weeklyDurationData.map((d, i) => (
                          <g key={i} className="group cursor-pointer">
                            {/* Invisible full-height vertical hit area column */}
                            <rect
                              x={d.x - 35}
                              y="10"
                              width="70"
                              height="140"
                              fill="transparent"
                              className="cursor-pointer"
                            />

                            {/* Vertical Guide Line on Hover */}
                            <line
                              x1={d.x}
                              y1="25"
                              x2={d.x}
                              y2="145"
                              stroke="#4F46E5"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                              className="opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none"
                            />

                            <circle
                              cx={d.x}
                              cy={d.y}
                              r="4.5"
                              className="fill-white stroke-[#4F46E5] stroke-[2.5] group-hover:r-6 transition-all"
                            />
                            <text
                              x={d.x}
                              y="160"
                              textAnchor="middle"
                              className="text-[11px] font-semibold fill-[#737373] group-hover:fill-[#4F46E5] transition-colors"
                            >
                              {d.day}
                            </text>

                            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <rect
                                x={d.x - 28}
                                y={d.y - 30}
                                width="56"
                                height="20"
                                rx="4"
                                fill="#2E2D2D"
                              />
                              <text
                                x={d.x}
                                y={d.y - 16}
                                textAnchor="middle"
                                fill="#FFFFFF"
                                fontSize="10"
                                fontWeight="bold"
                              >
                                {d.duration}
                              </text>
                            </g>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                </div>

                {/* 3. BOTTOM SECTION: DESCRIPTION & RECENT READERS SIDE-BY-SIDE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Left Column: Informasi & Lampiran Pembelajaran Card */}
                  <div className="md:col-span-2 bg-white rounded-[12px] border border-[#ECECEC] p-6 space-y-4 shadow-2xs flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      
                      {/* Header Title */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#2E2D2D] flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-[#2563EB]" />
                          Informasi & Lampiran Pembelajaran
                        </h3>
                      </div>

                      {/* Evaluasi / Tes & Tautan Akses - SINGLE OPTION PER MODULE */}
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-[#737373]">Akses Ujian & Evaluasi</p>
                        
                        {/* Single Test Display based on selected module */}
                        {selectedModule.id === 'mod-1' ? (
                          // OPTION 1: KUIS SITEMSA (Judul Quiz, klik menuju detail quiz)
                          <div className="flex items-center gap-2">
                            <a
                              href={`/admin/guru/pelajaran?item=${subjectQuizzes[0]?.id || 'qz-1'}`}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-medium border border-indigo-200/80 transition-all cursor-pointer active:scale-[0.98] group"
                              title="Klik untuk melihat detail kuis"
                            >
                              <Play className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span className="truncate max-w-[260px]">
                                {subjectQuizzes[0]?.title || 'Kuis Sirkuit Listrik & Komponen Pasif'}
                              </span>
                            </a>
                          </div>
                        ) : selectedModule.id === 'mod-2' ? (
                          // OPTION 2: LINK EKSTERNAL (Display link langsung, frame fixed max-width, ellipsis jika panjang, icon copy di kanan)
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-slate-50 border border-[#ECECEC] text-xs max-w-[320px] sm:max-w-[360px] w-full justify-between">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <ExternalLink className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                                <a
                                  href="https://forms.google.com/d/e/1FAIpQLSc_Sitemsa_Elektronika_Quiz_2026/viewform"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#2563EB] hover:underline font-medium text-[11px] truncate block flex-1"
                                  title="https://forms.google.com/d/e/1FAIpQLSc_Sitemsa_Elektronika_Quiz_2026/viewform"
                                >
                                  https://forms.google.com/d/e/1FAIpQLSc_Sitemsa_Elektronika_Quiz_2026/viewform
                                </a>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText("https://forms.google.com/d/e/1FAIpQLSc_Sitemsa_Elektronika_Quiz_2026/viewform");
                                  setIsCopied(true);
                                  setTimeout(() => setIsCopied(false), 2000);
                                }}
                                className="p-1 rounded-[4px] hover:bg-slate-200 text-[#737373] hover:text-[#2563EB] transition-colors cursor-pointer shrink-0 ml-1"
                                title="Salin Tautan"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        ) : (
                          // OPTION 3: QR CODE (Lihat Qr Code Ujian)
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowQrModal(true)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-purple-50 hover:bg-purple-100/80 text-purple-700 text-xs font-medium border border-purple-200/80 transition-all cursor-pointer active:scale-[0.98]"
                            >
                              <QrCode className="w-3.5 h-3.5 text-purple-600" />
                              <span>Lihat Qr Code Ujian</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* File & Lampiran Materi Buttons */}
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-[#737373]">File & Berkas Lampiran</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); alert("Mengunduh file: Modul_Praktikum_Elektronika.pdf"); }}
                            className="flex items-center justify-between p-2 rounded-[8px] bg-slate-50/80 border border-[#ECECEC] hover:border-blue-300 hover:bg-blue-50/40 transition-all group cursor-pointer"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <div className="w-6 h-6 rounded-[5px] bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                                <FileText className="w-3 h-3 text-rose-600" />
                              </div>
                              <span className="text-xs font-medium text-[#2E2D2D] truncate group-hover:text-[#2563EB]">
                                Modul_Praktikum_Elektronika.pdf
                              </span>
                            </div>
                            <Download className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#2563EB] shrink-0 ml-2" />
                          </a>

                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); alert("Mengunduh file: Lembar_Kerja_Resistor.docx"); }}
                            className="flex items-center justify-between p-2 rounded-[8px] bg-slate-50/80 border border-[#ECECEC] hover:border-blue-300 hover:bg-blue-50/40 transition-all group cursor-pointer"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <div className="w-6 h-6 rounded-[5px] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                <FileCode className="w-3 h-3 text-[#2563EB]" />
                              </div>
                              <span className="text-xs font-medium text-[#2E2D2D] truncate group-hover:text-[#2563EB]">
                                Lembar_Kerja_Resistor.docx
                              </span>
                            </div>
                            <Download className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#2563EB] shrink-0 ml-2" />
                          </a>
                        </div>
                      </div>

                      {/* Topik Pembahasan */}
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-[#737373]">Topik Pembahasan</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedModule.topics.map((tp, idx) => (
                            <span key={idx} className="text-xs font-medium text-[#2563EB] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-[6px]">
                              {tp}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Recent Readers Student Table (LIMITED TO 3 ITEMS, NO SLANTED ARROW) */}
                  <div className="bg-white rounded-[12px] border border-[#ECECEC] p-5 space-y-4 shadow-2xs flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-sm font-bold text-[#2E2D2D] pb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2563EB]" />
                        Siswa Terakhir Akses
                      </h3>
                      <div className="divide-y divide-slate-100">
                        {recentReaders.slice(0, 3).map((rr, idx) => (
                          <div key={idx} className="py-3 flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-[#2E2D2D] leading-tight">{rr.name}</p>
                              <p className="text-xs font-medium text-[#737373] leading-none">{rr.time}</p>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                              {rr.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href="/admin/guru/monitoring"
                      className="text-xs font-bold text-[#2563EB] hover:underline flex items-center justify-center pt-2 transition-colors"
                    >
                      <span>Lihat Semua Monitoring Siswa</span>
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
                      <span>&bull;</span>
                      <span>{selectedQuiz.questions.length} Soal Pilihan Ganda</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteModuleItem(selectedQuiz.id, selectedQuiz.title)}
                    className="p-2 rounded-[8px] bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-[#ECECEC] transition-all cursor-pointer"
                    title="Hapus Kuis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#2E2D2D]">Daftar Soal Kuis</h3>
                  <div className="space-y-3">
                    {selectedQuiz.questions.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-[10px] bg-slate-50 border border-[#ECECEC] space-y-2">
                        <p className="text-xs font-bold text-[#2E2D2D]">
                          Soal {idx + 1}: {q.text}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-[6px] text-xs font-medium border ${
                                oIdx === q.correctAnswer
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                                  : 'bg-white border-[#ECECEC] text-[#737373]'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
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

      {/* DRIBBBLE EDIT BLOCK BUILDER MODAL */}
      {showBlockBuilder && (
        <ModuleBlockBuilder
          initialModule={editingModule || undefined}
          subjectName={currentSubject}
          onClose={() => setShowBlockBuilder(false)}
          onSave={handleSaveFromBuilder}
        />
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL (DARK BG OVERLAY, LEFT ALIGNED, NO BLUR) */}
      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md text-left space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Icon above header */}
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>

            {/* Header Title */}
            <h3 className="font-bold text-base text-[#2E2D2D]">Konfirmasi Hapus Modul</h3>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Apakah Anda yakin ingin menghapus modul &ldquo;<strong className="text-[#2E2D2D]">{deleteTarget.title}</strong>&rdquo;? Data modul akan terhapus dari sistem.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 text-[#2E2D2D] text-xs font-semibold hover:bg-slate-200 cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteModule}
                className="px-4 py-2 rounded-[8px] bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs transition-all duration-200 ease-in-out active:scale-[0.98]"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL QR CODE TEST PREVIEW */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-sm text-left space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 relative"
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#2E2D2D]">QR Code Ujian & Presensi</h3>
                <p className="text-xs text-[#737373]">Scan untuk membuka lembar evaluasi digital siswa</p>
              </div>

              {/* QR Code SVG Illustration Box */}
              <div className="p-4 bg-slate-50 border border-[#ECECEC] rounded-[12px] flex items-center justify-center my-2 shadow-xs">
                <svg className="w-44 h-44 text-[#2E2D2D]" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="30" height="30" rx="3" fill="#2E2D2D" />
                  <rect x="10" y="10" width="20" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="15" y="15" width="10" height="10" rx="1" fill="#2563EB" />

                  <rect x="65" y="5" width="30" height="30" rx="3" fill="#2E2D2D" />
                  <rect x="70" y="10" width="20" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="75" y="15" width="10" height="10" rx="1" fill="#2563EB" />

                  <rect x="5" y="65" width="30" height="30" rx="3" fill="#2E2D2D" />
                  <rect x="10" y="70" width="20" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="15" y="75" width="10" height="10" rx="1" fill="#2563EB" />

                  <rect x="42" y="10" width="16" height="16" rx="2" fill="#2E2D2D" />
                  <rect x="42" y="42" width="16" height="16" rx="2" fill="#2563EB" />
                  <rect x="65" y="42" width="16" height="16" rx="2" fill="#2E2D2D" />
                  <rect x="42" y="70" width="16" height="16" rx="2" fill="#2E2D2D" />
                  <rect x="70" y="70" width="25" height="25" rx="3" fill="#6366F1" />
                </svg>
              </div>

              <div className="w-full pt-2">
                <button
                  onClick={() => { alert("QR Code berhasil diunduh!"); setShowQrModal(false); }}
                  className="w-full py-2.5 rounded-[8px] bg-[#2563EB] text-white text-xs font-medium hover:bg-blue-700 transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Qr Code</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
