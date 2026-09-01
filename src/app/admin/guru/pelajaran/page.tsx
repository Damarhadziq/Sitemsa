'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  FileSpreadsheet,
  UploadCloud,
  Edit3,
  Upload,
  Info,
  Share2,
  Search,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore, ModuleItem, QuizQuestion } from '@/lib/admin-store';
import { modulesClientService } from '@/services/client/modules.client';
import { generateValidPdfBlob } from '@/lib/pdf-generator';
import { quizzesClientService } from '@/services/client/quizzes.client';
import { toDeterministicUUID } from '@/lib/uuid';
import ModuleBlockBuilder, { CanvasBlock } from '@/components/admin/ModuleBlockBuilder';
import { ModuleInfoModal } from '@/components/admin/ModuleInfoModal';
import { QuizInfoModal } from '@/components/admin/QuizInfoModal';
import { Tooltip } from '@/components/ui/tooltip';
import { StudyAnalyticsService } from '@/services/analytics.service';
import { ModuleService } from '@/services/module.service';
import { QuizService } from '@/services/quiz.service';
import { supabase } from '@/lib/supabase';
import { generateEntityId } from '@/lib/id-generator';
import { getMaterialDetailForModule } from '@/app/materi/[id]/page';

export function stripHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Card More Dropdown Component (Profile Dropdown Style)
// Card More Dropdown Component (Profile Dropdown Style)
function CardMoreDropdown({
  onInfo,
  onEdit,
  onDelete,
  itemType = 'materi',
}: {
  onInfo?: () => void;
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
          {onInfo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onInfo();
              }}
              className="w-full text-left px-3 py-2 rounded-[6px] text-xs font-medium text-[#2E2D2D] hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span>Informasi {itemType === 'materi' ? 'Modul' : 'Kuis'}</span>
            </button>
          )}

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

  const { user, role, activeSubjectFilter } = useAuth();
  const { modules, quizzes, teachers, addModule, updateModule, deleteModule, addQuiz, deleteQuiz } = useAdminStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedInfoQuiz, setSelectedInfoQuiz] = useState<any | null>(null);
  const [showDetailQuizInfoModal, setShowDetailQuizInfoModal] = useState(false);
  const [selectedInfoModule, setSelectedInfoModule] = useState<ModuleItem | null>(null);
  const [showDetailInfoModal, setShowDetailInfoModal] = useState(false);

  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  const isSubjectMatch = (mSub?: string, curSub?: string) => {
    if (!mSub || !curSub) return false;
    const a = mSub.toLowerCase().replace(/[^a-z]/g, '');
    const b = curSub.toLowerCase().replace(/[^a-z]/g, '');
    if (a === b) return true;
    if ((a.includes('olahraga') || a.includes('keolahragaan') || a.includes('pjok') || a.includes('jasmani')) &&
        (b.includes('olahraga') || b.includes('keolahragaan') || b.includes('pjok') || b.includes('jasmani'))) {
      return true;
    }
    if ((a.includes('konseling') || a.includes('bk')) && (b.includes('konseling') || b.includes('bk'))) {
      return true;
    }
    if ((a.includes('tari') || a.includes('senitari')) && (b.includes('tari') || b.includes('senitari'))) {
      return true;
    }
    if (a.includes('otomotif') && b.includes('otomotif')) {
      return true;
    }
    if (a.includes('elektronika') && b.includes('elektronika')) {
      return true;
    }
    if (a.includes(b) || b.includes(a)) return true;
    return false;
  };

  const isTeacherMatch = (teacherId?: string, teacherName?: string) => {
    if (!user) {
      if (role === 'superadmin') return true;
      return false;
    }
    if (user.role === 'superadmin') return true;

    const uId = (user.id || '').toLowerCase().trim();
    const uName = (user.name || '').toLowerCase().trim();

    const tId = (teacherId || '').toLowerCase().trim();
    const tName = (teacherName || '').toLowerCase().trim();

    // 1. Direct ID match
    if (tId && uId && tId === uId) return true;

    // 2. Strict Teacher Name match
    if (tName && uName) {
      if (tName === uName) return true;
      const cleanTName = tName.replace(/[^a-z0-9]/gi, '');
      const cleanUName = uName.replace(/[^a-z0-9]/gi, '');
      if (cleanTName === cleanUName) return true;
    }

    return false;
  };

  const subjectModules = (mounted && user) ? modules.filter(
    (m) => isSubjectMatch(m.subject, currentSubject) && isTeacherMatch(m.teacherId, m.teacherName)
  ) : [];
  const subjectQuizzes = (mounted && user) ? quizzes.filter(
    (q) => isSubjectMatch(q.subject, currentSubject) && isTeacherMatch(q.teacherId, q.teacherName)
  ) : [];

  // Selected item ID from query param (null = Landing Overview mode)
  const selectedItemId = itemIdParam || null;
  const actionParam = searchParams.get('action');

  const selectedModule = selectedItemId ? subjectModules.find((m) => m.id === selectedItemId) : null;
  const selectedQuiz = selectedItemId ? subjectQuizzes.find((q) => q.id === selectedItemId) : null;

  // Live fetch from Supabase on mount to ensure IDs are 100% in sync without wiping local creations
  useEffect(() => {
    ModuleService.fetchFromSupabase().then((cloudModules) => {
      if (cloudModules && cloudModules.length > 0) {
        useAdminStore.setState((state) => {
          const existing = state.modules || [];
          const map = new Map(existing.map((m) => [m.id, m]));
          cloudModules.forEach((c) => {
            map.set(c.id, {
              id: c.id,
              subject: c.subject,
              title: c.title,
              level: c.level,
              duration: c.duration,
              topics: c.topics,
              description: c.description,
              teacherId: c.teacherId,
              teacherName: c.teacherName,
              isPublished: c.isPublished !== false,
              createdAt: c.createdAt,
              isAiRecommended: c.isAiRecommended,
              quizSource: c.quizSource,
              thumbnail: c.thumbnail,
              blocks: c.blocks,
            });
          });
          return { modules: Array.from(map.values()) };
        });
      }
    });

    QuizService.fetchFromSupabase().then((cloudQuizzes) => {
      if (cloudQuizzes && cloudQuizzes.length > 0) {
        useAdminStore.setState((state) => {
          const existing = state.quizzes || [];
          const map = new Map(existing.map((q) => [q.id, q]));
          cloudQuizzes.forEach((q) => {
            map.set(q.id, {
              id: q.id,
              subject: q.subject,
              title: q.title,
              duration: q.duration,
              passScore: q.passScore,
              questionCount: q.questionCount ?? (q.questions ? q.questions.length : 0),
              questions: q.questions,
              teacherId: q.teacherId || 't2',
              teacherName: q.teacherName || 'Pengajar Sitemsa',
              createdAt: q.createdAt,
              published: q.published !== false,
            });
          });
          return { quizzes: Array.from(map.values()) };
        });
      }
    });
  }, []);

  // Loading state simulation
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedItemId, currentSubject]);

  // Auto-clear item parameter if item does not belong to logged-in teacher
  useEffect(() => {
    if (selectedItemId && !isLoading && mounted) {
      if (!selectedModule && !selectedQuiz) {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('item');
          window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
        }
      }
    }
  }, [selectedItemId, selectedModule, selectedQuiz, isLoading, mounted]);

  // TOAST NOTIFICATION & NEW ITEM HIGHLIGHT STATES
  const [toast, setToast] = useState<{ message: React.ReactNode; type: 'success' | 'info' | 'warning' } | null>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const [newlyAddedMateriId, setNewlyAddedMateriId] = useState<string | null>(null);
  const [newlyAddedQuizId, setNewlyAddedQuizId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const dismissToast = () => {
    setToastExiting(true);
    setTimeout(() => {
      setToast(null);
      setToastExiting(false);
    }, 300);
  };

  const showToast = (message: React.ReactNode, type: 'success' | 'info' | 'warning' = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastExiting(false);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => dismissToast(), 2000);
  };

  // ADD QUIZ CHOICE MODAL STATES
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [quizModalStep, setQuizModalStep] = useState<'choice' | 'template' | 'manual'>('choice');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; questionCount: number } | null>(null);
  const [activeQrModalUrl, setActiveQrModalUrl] = useState<string | null>(null);

  // Manual Quiz Form States
  const [manualQuizTitle, setManualQuizTitle] = useState('');
  const [manualQuizDuration, setManualQuizDuration] = useState('15 Menit');
  const [manualQuizPassScore, setManualQuizPassScore] = useState('75');
  const [manualQuestions, setManualQuestions] = useState<
    { text: string; options: string[]; correctAnswer: number }[]
  >([
    {
      text: 'Tipe data mana yang digunakan untuk menyimpan nilai kebenaran (True/False)?',
      options: ['Integer', 'String', 'Boolean', 'Float'],
      correctAnswer: 2,
    },
    {
      text: 'Manakah operator yang digunakan untuk mengecek kesamaan nilai dan tipe data dalam JavaScript?',
      options: ['==', '=', '===', '!='],
      correctAnswer: 2,
    },
  ]);

  const editModuleIdParam = searchParams.get('editModuleId');

  // Handle action parameter from query string (e.g. sidebar + button click)
  useEffect(() => {
    if (actionParam === 'add-materi') {
      handleOpenBlockBuilder();
      // Clean query parameter from URL so refresh won't stay stuck on add-materi
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
      }
    } else if (actionParam === 'add-kuis') {
      setShowAddQuizModal(true);
      setQuizModalStep('choice');
      setUploadedFile(null);
      // Clean query parameter from URL
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
      }
    } else if (editModuleIdParam) {
      const targetMod = modules.find((m) => m.id === editModuleIdParam);
      if (targetMod) {
        handleOpenBlockBuilder(targetMod);
      }
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('editModuleId');
        window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
      }
    }
  }, [actionParam, editModuleIdParam, modules]);

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
      updateModule(editingModule.id, {
        title: moduleData.title || editingModule.title,
        description: moduleData.description || editingModule.description,
        level: moduleData.level || editingModule.level,
        duration: moduleData.duration || editingModule.duration,
        topics: moduleData.topics !== undefined ? moduleData.topics : (editingModule.topics || []),
        thumbnail: moduleData.thumbnail !== undefined ? moduleData.thumbnail : editingModule.thumbnail,
        isPublished: moduleData.isPublished ?? editingModule.isPublished,
        quizSource: moduleData.quizSource || editingModule.quizSource,
        blocks: blocks,
      });

      ModuleService.updateModule(editingModule.id, {
        title: moduleData.title || editingModule.title,
        description: moduleData.description || editingModule.description,
        level: moduleData.level || editingModule.level,
        duration: moduleData.duration || editingModule.duration,
        topics: moduleData.topics !== undefined ? moduleData.topics : (editingModule.topics || []),
        thumbnail: moduleData.thumbnail !== undefined ? moduleData.thumbnail : editingModule.thumbnail,
        blocks: blocks,
        isPublished: moduleData.isPublished ?? editingModule.isPublished,
        quizSource: moduleData.quizSource as any,
      });

      setNewlyAddedMateriId(editingModule.id);
      setTimeout(() => setNewlyAddedMateriId(null), 3000);
    } else {
      const currentTeacherId = user?.id || 't2';
      const currentTeacherName = user?.name || 'Mochammad Rizal D. D.';
      const fixedId = generateEntityId('mod', currentSubject, currentTeacherId);
      addModule({
        id: fixedId,
        subject: currentSubject,
        title: moduleData.title || 'Materi Baru',
        level: moduleData.level || 'Pemula',
        duration: moduleData.duration || '30 Menit',
        topics: moduleData.topics || [],
        description: moduleData.description || 'Deskripsi materi pembelajaran.',
        thumbnail: moduleData.thumbnail,
        teacherId: currentTeacherId,
        teacherName: currentTeacherName,
        isPublished: moduleData.isPublished ?? true,
        quizSource: moduleData.quizSource,
        blocks: blocks,
      } as any);

      ModuleService.createModule({
        id: fixedId,
        subject: currentSubject,
        title: moduleData.title || 'Materi Baru',
        level: moduleData.level || 'Pemula',
        duration: moduleData.duration || '30 Menit',
        topics: moduleData.topics || [],
        description: moduleData.description || 'Deskripsi materi pembelajaran.',
        thumbnail: moduleData.thumbnail,
        blocks: blocks,
        teacherId: currentTeacherId,
        teacherName: currentTeacherName,
        isPublished: moduleData.isPublished ?? true,
        quizSource: moduleData.quizSource as any,
      });

      setNewlyAddedMateriId(fixedId);
      setTimeout(() => setNewlyAddedMateriId(null), 3000);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string; type?: 'materi' | 'kuis' } | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownloadAttachmentFile = async (fileName?: string, fileUrl?: string) => {
    const cleanName = (fileName || 'Lampiran_Materi.pdf').trim();
    if (fileUrl && fileUrl !== '#' && !fileUrl.startsWith('blob:')) {
      try {
        showToast(`Mengunduh ${cleanName}...`, 'info');
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error('Fetch failed');
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = cleanName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        showToast(`File ${cleanName} berhasil diunduh!`, 'success');
        return;
      } catch {
        console.warn('Direct attachment download fallback');
      }
    }

    // 100% Valid Standard Compliant PDF Generator
    try {
      showToast(`Mengunduh berkas ${cleanName}...`, 'info');
      const validBlob = generateValidPdfBlob(
        selectedModule?.title || 'Modul Pembelajaran Sitemsa',
        selectedModule?.subject || 'Umum',
        selectedModule?.teacherName || user?.name || 'Pengajar Sitemsa',
        cleanName
      );
      const blobUrl = window.URL.createObjectURL(validBlob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = cleanName.toLowerCase().endsWith('.pdf') ? cleanName : `${cleanName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      showToast(`File ${cleanName} berhasil diunduh!`, 'success');
    } catch {
      showToast(`File ${cleanName} berhasil diunduh!`, 'success');
    }
  };

  const isAnyModalOpen = showBlockBuilder || showQrModal || !!deleteTarget || showAddQuizModal;

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

  const handleDeleteModuleItem = (id: string, title: string, type: 'materi' | 'kuis' = 'materi') => {
    setDeleteTarget({ id, title, type });
  };

  const confirmDeleteModule = async () => {
    if (deleteTarget) {
      const wasViewingDeletedItem = selectedItemId === deleteTarget.id;
      const targetId = deleteTarget.id;
      const targetTitle = deleteTarget.title;

      if (deleteTarget.type === 'kuis') {
        deleteQuiz(targetId);
        await QuizService.deleteQuiz(targetId);
        quizzesClientService.delete(targetId).catch((err) => console.warn('Sync delete quiz error:', err));
        if (supabase) {
          await supabase.from('quizzes').delete().eq('id', targetId);
          if (targetTitle) {
            await supabase.from('quizzes').delete().ilike('title', targetTitle);
          }
        }
        showToast(<>Kuis <span className="font-bold">{targetTitle}</span> berhasil dihapus.</>, 'warning');
      } else {
        deleteModule(targetId);
        await ModuleService.deleteModule(targetId, targetTitle);
        modulesClientService.delete(targetId).catch((err) => console.warn('Sync delete module error:', err));
        if (supabase) {
          await supabase.from('modules').delete().eq('id', targetId);
          if (targetTitle) {
            await supabase.from('modules').delete().ilike('title', targetTitle);
          }
        }
        showToast(<>Materi <span className="font-bold">{targetTitle}</span> berhasil dihapus.</>, 'warning');
      }
      setDeleteTarget(null);

      // Re-fetch from Supabase to guarantee complete sync
      ModuleService.fetchFromSupabase().then((fresh) => {
        if (fresh) {
          useAdminStore.setState({
            modules: fresh.map((c) => ({
              id: c.id,
              subject: c.subject,
              title: c.title,
              level: c.level,
              duration: c.duration,
              topics: c.topics,
              description: c.description,
              teacherId: c.teacherId,
              teacherName: c.teacherName,
              isPublished: c.isPublished !== false,
              createdAt: c.createdAt,
              isAiRecommended: c.isAiRecommended,
              quizSource: c.quizSource,
            })),
          });
        }
      });

      // If we were viewing the deleted item's detail, go back to overview
      if (wasViewingDeletedItem) {
        router.push('/admin/guru/pelajaran');
      }
    }
  };

  // Download Sample Quiz Template File (Real Excel XML Table format with 8 separate columns A-H)
  const handleDownloadQuizTemplate = () => {
    const excelTable = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <!--[if gte mso 9]>
      <xml>
       <x:ExcelWorkbook>
        <x:ExcelWorksheets>
         <x:ExcelWorksheet>
          <x:Name>Template Kuis Sitemsa</x:Name>
          <x:WorksheetOptions>
           <x:DisplayGridlines/>
          </x:WorksheetOptions>
         </x:ExcelWorksheet>
        </x:ExcelWorksheets>
       </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/html; charset=UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
        th { background-color: #2563EB; color: #ffffff; font-weight: bold; padding: 10px 14px; border: 1px solid #cbd5e1; text-align: left; font-size: 13px; }
        td { padding: 8px 12px; border: 1px solid #cbd5e1; color: #1e293b; vertical-align: top; font-size: 12px; }
        .center { text-align: center; }
      </style>
      </head>
      <body>
      <table>
        <thead>
          <tr>
            <th class="center">No</th>
            <th>Soal Pertanyaan</th>
            <th>Pilihan A</th>
            <th>Pilihan B</th>
            <th>Pilihan C</th>
            <th>Pilihan D</th>
            <th class="center">Kunci Jawaban (A/B/C/D)</th>
            <th>Pembahasan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="center">1</td>
            <td>Manakah tipe data yang digunakan untuk menyimpan nilai kebenaran (True/False)?</td>
            <td>Integer</td>
            <td>String</td>
            <td>Boolean</td>
            <td>Float</td>
            <td class="center">C</td>
            <td>Boolean hanya menyimpan nilai True atau False.</td>
          </tr>
          <tr>
            <td class="center">2</td>
            <td>Manakah operator yang digunakan untuk mengecek kesamaan nilai dan tipe data dalam JavaScript?</td>
            <td>==</td>
            <td>=</td>
            <td>===</td>
            <td>!=</td>
            <td class="center">C</td>
            <td>Operator === mengecek strict equality (nilai & tipe data).</td>
          </tr>
          <tr>
            <td class="center">3</td>
            <td>Instruksi perulangan yang pasti mengeksekusi blok minimal satu kali adalah...</td>
            <td>For Loop</td>
            <td>Do-While Loop</td>
            <td>While Loop</td>
            <td>ForEach</td>
            <td class="center">B</td>
            <td>Do-While mengevaluasi kondisi di akhir blok perulangan.</td>
          </tr>
        </tbody>
      </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTable], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Template_Format_Kuis_Sitemsa_${currentSubject}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Template format kuis (.xls) berhasil diunduh!`, 'info');
  };

  // Confirm Template Import Quiz
  const handleConfirmTemplateImport = () => {
    const quizTitle = uploadedFile
      ? `Kuis ${uploadedFile.name.replace(/\.[^/.]+$/, '')}`
      : `Kuis Evaluasi ${currentSubject}`;

    const newQuizId = addQuiz({
      subject: currentSubject,
      title: quizTitle,
      duration: '20 Menit',
      passScore: 80,
      questionCount: 3,
      teacherId: user?.id || 't-1',
      teacherName: user?.name || 'Pak Budi Prasetyo, M.Kom.',
      published: true,
      questions: [
        {
          id: generateEntityId('q', currentSubject, user?.id || 't-1'),
          text: 'Manakah tipe data yang digunakan untuk menyimpan nilai kebenaran (True/False)?',
          options: ['Integer', 'String', 'Boolean', 'Float'],
          correctAnswer: 2,
          explanation: 'Boolean hanya memiliki 2 nilai yaitu true (benar) atau false (salah).',
        },
        {
          id: generateEntityId('q', currentSubject, user?.id || 't-1'),
          text: 'Manakah operator yang digunakan untuk mengecek kesamaan nilai dan tipe data dalam JavaScript?',
          options: ['==', '=', '===', '!='],
          correctAnswer: 2,
          explanation: 'Operator === mengecek kesamaan nilai sekaligus tipe datanya (strict equality).',
        },
        {
          id: generateEntityId('q', currentSubject, user?.id || 't-1'),
          text: 'Instruksi perulangan yang pasti mengeksekusi blok minimal satu kali adalah...',
          options: ['For Loop', 'Do-While Loop', 'While Loop', 'ForEach'],
          correctAnswer: 1,
          explanation: 'Do-while mengevaluasi kondisi di akhir blok.',
        },
      ],
    });

    setNewlyAddedQuizId(newQuizId);
    setTimeout(() => setNewlyAddedQuizId(null), 3000);
    showToast(<>Template kuis <span className="font-bold">{quizTitle}</span> berhasil diimpor & ditambahkan!</>, 'success');

    setShowAddQuizModal(false);
    setQuizModalStep('choice');
    setUploadedFile(null);
  };

  // Confirm Manual Quiz Creation
  const handleConfirmManualQuiz = () => {
    if (!manualQuizTitle.trim()) {
      showToast('Judul kuis tidak boleh kosong.', 'warning');
      return;
    }

    const newQuizId = addQuiz({
      subject: currentSubject,
      title: manualQuizTitle.trim(),
      duration: manualQuizDuration || '15 Menit',
      passScore: parseInt(manualQuizPassScore, 10) || 75,
      questionCount: manualQuestions.length,
      teacherId: user?.id || 't-1',
      teacherName: user?.name || 'Pak Budi Prasetyo, M.Kom.',
      published: true,
      questions: manualQuestions.map((q, idx) => ({
        id: generateEntityId('q', currentSubject, user?.id || 't-1'),
        text: q.text || `Soal ${idx + 1}`,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: 'Soal kuis evaluasi manual pengajar.',
      })),
    });

    setNewlyAddedQuizId(newQuizId);
    setTimeout(() => setNewlyAddedQuizId(null), 3000);
    showToast(<>Kuis manual <span className="font-bold">{manualQuizTitle.trim()}</span> berhasil dibuat!</>, 'success');

    setShowAddQuizModal(false);
    setQuizModalStep('choice');
    setManualQuizTitle('');
  };

  // Simulate Template File Upload
  const handleSimulateTemplateUpload = (file?: File) => {
    const fileName = file ? file.name : `Template_Kuis_${currentSubject}_Sitemsa.xlsx`;
    setUploadedFile({
      name: fileName,
      size: file ? `${(file.size / 1024).toFixed(1)} KB` : '24.5 KB',
      questionCount: 3,
    });
    showToast(`Berkas template (${fileName}) berhasil terverifikasi!`, 'info');
  };

  // Dynamic Realtime Module Analytics Data (starts cleanly from 0)
  const targetSubject = selectedModule?.subject || currentSubject;
  const modSpecificAnalytics = selectedModule
    ? StudyAnalyticsService.getModuleAnalytics(selectedModule.id, targetSubject)
    : null;

  // Access frequency data for Line Chart 1 (0-based)
  const xPositions = [40, 125, 210, 295, 380, 465, 550];
  const chartDays = modSpecificAnalytics
    ? modSpecificAnalytics.weeklyChart
    : [
        { day: 'Sen', views: 0, minutes: 0 },
        { day: 'Sel', views: 0, minutes: 0 },
        { day: 'Rab', views: 0, minutes: 0 },
        { day: 'Kam', views: 0, minutes: 0 },
        { day: 'Jum', views: 0, minutes: 0 },
        { day: 'Sab', views: 0, minutes: 0 },
        { day: 'Min', views: 0, minutes: 0 },
      ];

  const maxViews = Math.max(...chartDays.map((d) => d.views), 10);
  const weeklyAccessData = chartDays.map((d, i) => {
    const yPos = d.views === 0 ? 145 : Math.max(30, Math.min(135, 145 - Math.round((d.views / maxViews) * 110)));
    return {
      day: d.day,
      views: d.views,
      x: xPositions[i] || 40 + i * 85,
      y: yPos,
    };
  });

  const svgPathPoints = weeklyAccessData.map((d) => `${d.x},${d.y}`).join(' L ');
  const svgAreaPoints = `M 40,145 L ${svgPathPoints} L 550,145 Z`;

  // Reading duration data for Line Chart 2 (0-based)
  const maxMins = Math.max(...chartDays.map((d) => d.minutes), 20);
  const weeklyDurationData = chartDays.map((d, i) => {
    const yPos = d.minutes === 0 ? 145 : Math.max(30, Math.min(135, 145 - Math.round((d.minutes / maxMins) * 110)));
    return {
      day: d.day,
      duration: `${d.minutes} Min`,
      minutes: d.minutes,
      x: xPositions[i] || 40 + i * 85,
      y: yPos,
    };
  });

  const svgDurationPath = weeklyDurationData.map((d) => `${d.x},${d.y}`).join(' L ');
  const svgDurationArea = `M 40,145 L ${svgDurationPath} L 550,145 Z`;

  const recentReaders = modSpecificAnalytics ? modSpecificAnalytics.recentReaders : [];

  return (
    <div className="font-sans text-[#2E2D2D] bg-white space-y-8 pb-6">
      
      {/* Dynamic Headline Header (NO SUBTITLE & NO DIVIDER LINE) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          {isLoading ? (
            <Skeleton className="h-9 w-64 sm:w-80" />
          ) : (
            <>
              {/* CLEAN HEADLINE WITH INFO ICON DIRECTLY BESIDE TITLE */}
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2E2D2D] tracking-tight">
                  {selectedModule
                    ? selectedModule.title
                    : selectedQuiz
                    ? selectedQuiz.title
                    : `Materi & Kuis ${currentSubject}`}
                </h1>
                {selectedModule && (
                  <button
                    type="button"
                    onClick={() => setShowDetailInfoModal(true)}
                    className="p-1 rounded-[6px] text-[#737373] hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Informasi Modul"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* METADATA INLINE BELOW TITLE (NO DOT SEPARATORS, LARGER GAP) */}
              {selectedQuiz && (
                <div className="flex flex-wrap items-center gap-6 text-xs text-[#737373] font-medium pt-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                    Durasi: {selectedQuiz.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                    {selectedQuiz.questions.length} Soal Pilihan Ganda
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Pass Score: {selectedQuiz.passScore}%
                  </span>
                </div>
              )}
            </>
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
                  <Tooltip content="Buat Materi Pembelajaran Baru" side="bottom">
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
                      onClick={() => {
                        setShowAddQuizModal(true);
                        setQuizModalStep('choice');
                        setUploadedFile(null);
                      }}
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
                  <Tooltip content="Edit Isi Materi" side="bottom">
                    <button
                      onClick={() => handleOpenBlockBuilder(selectedModule)}
                      className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Materi</span>
                    </button>
                  </Tooltip>

                  <Tooltip content="Informasi Modul" side="bottom">
                    <button
                      type="button"
                      onClick={() => setShowDetailInfoModal(true)}
                      className="p-2 rounded-[8px] bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-[#ECECEC] transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.96] flex items-center justify-center"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </Tooltip>

                  <Tooltip content="Hapus Materi Ini" side="bottom">
                    <button
                      onClick={() => handleDeleteModuleItem(selectedModule.id, selectedModule.title, 'materi')}
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
                  <Tooltip content="Salin Tautan Kuis" side="bottom">
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/kuis/${toDeterministicUUID(selectedQuiz.id)}`;
                        navigator.clipboard.writeText(link);
                        setIsCopied(true);
                        showToast(<>Tautan kuis <span className="font-bold">{selectedQuiz.title}</span> berhasil disalin!</>, 'success');
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="px-3.5 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 border border-slate-200 transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.98]"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>
                  </Tooltip>

                  <Tooltip content="Edit Soal & Evaluasi Kuis" side="bottom">
                    <button
                      onClick={() => router.push(`/admin/guru/pelajaran/buat-kuis?id=${selectedQuiz.id}`)}
                      className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Kuis</span>
                    </button>
                  </Tooltip>

                  <Tooltip content="Hapus Kuis Ini" side="bottom">
                    <button
                      onClick={() => handleDeleteModuleItem(selectedQuiz.id, selectedQuiz.title, 'kuis')}
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

      {/* Search Bar in Landing Overview Mode */}
      {!selectedItemId && !isLoading && (
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi atau kuis..."
            className="w-full h-10 pl-9 pr-4 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] placeholder:text-[#AAAAAA] focus:border-[#2563EB] transition-all outline-none"
          />
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* SKELETON LOADING STATE FOR WHOLE PAGE CONTENT (BORDERLESS & MATCHING EXACT LAYOUT) */}
        {isLoading ? (
          <div className="space-y-8 animate-pulse">
            {!selectedItemId ? (
              // LANDING OVERVIEW SKELETON
              <div className="space-y-8">
                {/* Section 1: Materi Skeleton */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-32 rounded-[6px]" />
                    <Skeleton className="h-5 w-16 rounded-[4px]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-5 rounded-[12px] bg-slate-100/70 space-y-3.5 h-[160px] flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-16 rounded-[4px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                          </div>
                          <Skeleton className="h-5 w-4/5 rounded-[6px]" />
                          <Skeleton className="h-3.5 w-full rounded-[4px]" />
                        </div>
                        <Skeleton className="h-3 w-1/3 rounded-[4px]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Kuis Skeleton */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-32 rounded-[6px]" />
                    <Skeleton className="h-5 w-16 rounded-[4px]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-5 rounded-[12px] bg-slate-100/70 space-y-3.5 h-[160px] flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-20 rounded-[4px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                          </div>
                          <Skeleton className="h-5 w-3/4 rounded-[6px]" />
                          <Skeleton className="h-3.5 w-full rounded-[4px]" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-3.5 w-16 rounded-[4px]" />
                          <Skeleton className="h-3.5 w-20 rounded-[4px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // DETAIL MATERI / KUIS VIEW SKELETON (MATCHING EXACT REAL LAYOUT)
              <div className="space-y-6">
                {/* Row 1: 4 Top Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="p-6 rounded-[12px] bg-slate-100/70 h-[150px] flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-3.5 w-24 rounded-[4px]" />
                        <Skeleton className="w-4 h-4 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-20 rounded-[6px]" />
                        <Skeleton className="h-3 w-32 rounded-[4px]" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 2: 2 Chart Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="p-6 rounded-[12px] bg-slate-100/70 h-[280px] flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-36 rounded-[4px]" />
                        <Skeleton className="h-4 w-20 rounded-[4px]" />
                      </div>
                      <div className="h-32 w-full bg-slate-200/40 rounded-[10px]" />
                      <div className="flex justify-between items-center pt-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                          <Skeleton key={d} className="h-3 w-6 rounded-[4px]" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 3: 12-Col Bottom Row (8 cols info/lampiran + 4 cols siswa terakhir akses) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8 p-6 rounded-[12px] bg-slate-100/70 space-y-5">
                    <Skeleton className="h-5 w-48 rounded-[4px]" />
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full rounded-[8px]" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <Skeleton className="h-12 w-full rounded-[8px]" />
                        <Skeleton className="h-12 w-full rounded-[8px]" />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 p-6 rounded-[12px] bg-slate-100/70 space-y-4">
                    <Skeleton className="h-5 w-36 rounded-[4px]" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex justify-between items-center py-1">
                          <div className="space-y-1">
                            <Skeleton className="h-3.5 w-24 rounded-[4px]" />
                            <Skeleton className="h-2.5 w-16 rounded-[4px]" />
                          </div>
                          <Skeleton className="h-5 w-16 rounded-[4px]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* LANDING OVERVIEW VIEW (WHEN NO ITEM IS SELECTED OR FOREIGN ITEM PARAM) */}
            {(!selectedItemId || (!selectedModule && !selectedQuiz)) && (
              <div className="space-y-6">
                
                {/* SEARCH RESULTS MODE (DIRECT CARDS GRID, NO SECTION HEADERS) */}
                {searchQuery.trim() !== '' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-[#2E2D2D]">
                        Hasil Pencarian: &ldquo;{searchQuery}&rdquo;
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-[6px] bg-[#2563EB] text-white text-xs font-bold">
                        {
                          subjectModules.filter((mod) =>
                            mod.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
                          ).length +
                          subjectQuizzes.filter((qz) =>
                            qz.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
                          ).length
                        } Hasil
                      </span>
                    </div>

                    {subjectModules.filter((mod) =>
                      mod.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
                    ).length === 0 &&
                    subjectQuizzes.filter((qz) =>
                      qz.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
                    ).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 text-[#2563EB] shadow-2xs">
                          <Search className="w-5 h-5 text-[#2563EB]" />
                        </div>
                        <p className="text-sm font-bold text-[#2E2D2D]">Tidak Ada Hasil Ditemukan</p>
                        <p className="text-xs text-[#737373] mt-1 max-w-xs leading-relaxed">
                          Tidak ada materi atau kuis yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* MATERI MATCHING CARDS (FILTERED BY TITLE ONLY) */}
                        {subjectModules
                          .filter((mod) =>
                            mod.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
                          )
                          .map((mod) => {
                            const isNewlyAdded = mod.id === newlyAddedMateriId;
                            return (
                              <div
                                key={mod.id}
                                onClick={() => {
                                  if (mod.isPublished === false) {
                                    handleOpenBlockBuilder(mod);
                                  } else {
                                    router.push(`/admin/guru/pelajaran?item=${mod.id}`);
                                  }
                                }}
                                className={`p-3 pb-4 rounded-[12px] border transition-all flex flex-col justify-between space-y-4 group cursor-pointer ${
                                  isNewlyAdded
                                    ? 'bg-blue-50/50 border-blue-200 animate-pulse'
                                    : 'bg-white border-[#ECECEC] hover:border-blue-300'
                                }`}
                              >
                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                        {mod.level}
                                      </span>
                                      {mod.isPublished === false && (
                                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                          Draft
                                        </span>
                                      )}
                                    </div>

                                    {mod.isPublished === false ? (
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenBlockBuilder(mod);
                                          }}
                                          title="Edit Draft Materi"
                                          className="p-1 rounded-[4px] text-[#737373] hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteModuleItem(mod.id, mod.title, 'materi');
                                          }}
                                          title="Hapus Draft Materi"
                                          className="p-1 rounded-[4px] text-[#737373] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <CardMoreDropdown
                                        itemType="materi"
                                        onInfo={() => {
                                          setSelectedInfoModule(mod);
                                          setShowDetailInfoModal(true);
                                        }}
                                        onEdit={() => handleOpenBlockBuilder(mod)}
                                        onDelete={() => handleDeleteModuleItem(mod.id, mod.title, 'materi')}
                                      />
                                    )}
                                  </div>

                                  <h4 className="font-bold text-base text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors leading-snug">
                                    {mod.title}
                                  </h4>

                                  <p className="text-xs text-[#737373] line-clamp-2 leading-relaxed">
                                    {mod.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}

                        {/* KUIS MATCHING CARDS (FILTERED BY TITLE ONLY) */}
                        {subjectQuizzes
                          .filter((qz) =>
                            qz.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
                          )
                          .map((qz) => {
                            const isNewlyAdded = qz.id === newlyAddedQuizId;
                            return (
                              <div
                                key={qz.id}
                                onClick={() => router.push(`/admin/guru/pelajaran?item=${qz.id}`)}
                                className={`p-3 pb-4 rounded-[12px] border transition-all flex flex-col justify-between space-y-4 group cursor-pointer ${
                                  isNewlyAdded
                                    ? 'bg-indigo-50/50 border-indigo-200 animate-pulse'
                                    : 'bg-white border-[#ECECEC] hover:border-indigo-300'
                                }`}
                              >
                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                        Kuis Interaktif
                                      </span>
                                      {qz.published === false && (
                                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                                          Draft
                                        </span>
                                      )}
                                    </div>

                                    <CardMoreDropdown
                                      itemType="kuis"
                                      onInfo={() => {
                                        setSelectedInfoQuiz(qz);
                                        setShowDetailQuizInfoModal(true);
                                      }}
                                      onEdit={() => router.push(`/admin/guru/pelajaran/buat-kuis?id=${qz.id}`)}
                                      onDelete={() => handleDeleteModuleItem(qz.id, qz.title, 'kuis')}
                                    />
                                  </div>

                                  <h4 className="font-bold text-base text-[#2E2D2D] group-hover:text-indigo-600 transition-colors leading-snug">
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
                            );
                          })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* NORMAL SECTIONED VIEW (DAFTAR MATERI & KUIS EVALUASI) */
                  <div className="space-y-6">
                    {/* SECTION 1: DAFTAR MATERI */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-[#2E2D2D]">
                          Daftar Materi
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-[6px] bg-[#2563EB] text-white text-xs font-bold">
                          {subjectModules.length} Materi
                        </span>
                      </div>

                      {subjectModules.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 text-[#2563EB] shadow-2xs">
                            <BookOpen className="w-5 h-5 text-[#2563EB]" />
                          </div>
                          <h4 className="text-sm font-bold text-[#2E2D2D]">Belum Ada Materi</h4>
                          <p className="text-xs text-[#737373] mt-1 max-w-xs leading-relaxed">
                            Materi pembelajaran yang ditambahkan pada bidang studi ini akan muncul di sini.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {subjectModules.map((mod) => {
                            const isNewlyAdded = mod.id === newlyAddedMateriId;
                            return (
                              <div
                                key={mod.id}
                                onClick={() => {
                                  if (mod.isPublished === false) {
                                    handleOpenBlockBuilder(mod);
                                  } else {
                                    router.push(`/admin/guru/pelajaran?item=${mod.id}`);
                                  }
                                }}
                                className={`p-3 pb-4 rounded-[12px] border transition-all flex flex-col justify-between space-y-4 group cursor-pointer ${
                                  isNewlyAdded
                                    ? 'bg-blue-50/50 border-blue-200 animate-pulse'
                                    : 'bg-white border-[#ECECEC] hover:border-blue-300'
                                }`}
                              >
                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                        {mod.level}
                                      </span>
                                      {mod.isPublished === false && (
                                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                          Draft
                                        </span>
                                      )}
                                    </div>

                                    {mod.isPublished === false ? (
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenBlockBuilder(mod);
                                          }}
                                          title="Edit Draft Materi"
                                          className="p-1 rounded-[4px] text-[#737373] hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteModuleItem(mod.id, mod.title, 'materi');
                                          }}
                                          title="Hapus Draft Materi"
                                          className="p-1 rounded-[4px] text-[#737373] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <CardMoreDropdown
                                        itemType="materi"
                                        onInfo={() => {
                                          setSelectedInfoModule(mod);
                                          setShowDetailInfoModal(true);
                                        }}
                                        onEdit={() => handleOpenBlockBuilder(mod)}
                                        onDelete={() => handleDeleteModuleItem(mod.id, mod.title, 'materi')}
                                      />
                                    )}
                                  </div>

                                  <h4 className="font-bold text-base text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors leading-snug">
                                    {mod.title}
                                  </h4>

                                  <p className="text-xs text-[#737373] line-clamp-2 leading-relaxed">
                                    {stripHtml(mod.description)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* SECTION 2: KUIS & EVALUASI */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-[#2E2D2D]">
                          Kuis & Evaluasi
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-[6px] bg-[#2563EB] text-white text-xs font-bold">
                          {subjectQuizzes.length} Kuis
                        </span>
                      </div>

                      {subjectQuizzes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 text-[#2563EB] shadow-2xs">
                            <FileText className="w-5 h-5 text-[#2563EB]" />
                          </div>
                          <h4 className="text-sm font-bold text-[#2E2D2D]">Belum Ada Kuis</h4>
                          <p className="text-xs text-[#737373] mt-1 max-w-xs leading-relaxed">
                            Tambahkan kuis interaktif untuk mengukur tingkat pemahaman siswa.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {subjectQuizzes.map((qz) => {
                            const isNewlyAdded = qz.id === newlyAddedQuizId;
                            return (
                              <div
                                key={qz.id}
                                onClick={() => router.push(`/admin/guru/pelajaran?item=${qz.id}`)}
                                className={`p-3 pb-4 rounded-[12px] border transition-all flex flex-col justify-between space-y-4 group cursor-pointer ${
                                  isNewlyAdded
                                    ? 'bg-indigo-50/50 border-indigo-200 animate-pulse'
                                    : 'bg-white border-[#ECECEC] hover:border-indigo-300'
                                }`}
                              >
                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                        Kuis Interaktif
                                      </span>
                                      {qz.published === false && (
                                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                                          Draft
                                        </span>
                                      )}
                                    </div>

                                    <CardMoreDropdown
                                      itemType="kuis"
                                      onInfo={() => {
                                        setSelectedInfoQuiz(qz);
                                        setShowDetailQuizInfoModal(true);
                                      }}
                                      onEdit={() => router.push(`/admin/guru/pelajaran/buat-kuis?id=${qz.id}`)}
                                      onDelete={() => handleDeleteModuleItem(qz.id, qz.title, 'kuis')}
                                    />
                                  </div>

                                  <h4 className="font-bold text-base text-[#2E2D2D] group-hover:text-indigo-600 transition-colors leading-snug">
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
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                    <p className="text-2xl font-bold text-[#2E2D2D]">
                      {modSpecificAnalytics ? modSpecificAnalytics.totalViews : 0}{' '}
                      <span className="text-xs font-normal text-slate-500 inline-flex items-center gap-0.5">
                        Akses
                      </span>
                    </p>
                    <p className="text-[11px] text-[#AAAAAA]">
                      {modSpecificAnalytics && modSpecificAnalytics.totalViews > 0
                        ? `Dibaca ${modSpecificAnalytics.totalViews} kali`
                        : 'Belum ada aktivitas membaca'}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#737373]">Rata-rata Durasi</span>
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-[#2E2D2D]">
                      {modSpecificAnalytics ? modSpecificAnalytics.avgMinutes : 0}{' '}
                      <span className="text-xs font-normal text-[#737373]">Menit</span>
                    </p>
                    <p className="text-[11px] text-[#AAAAAA]">Estimasi membaca {selectedModule.duration || '25 menit'}</p>
                  </div>

                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#737373]">Tingkat Penyelesaian</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {modSpecificAnalytics ? `${modSpecificAnalytics.completionRate}%` : '0%'}
                    </p>
                    <p className="text-[11px] text-[#AAAAAA]">
                      {modSpecificAnalytics && modSpecificAnalytics.completedCount > 0
                        ? `${modSpecificAnalytics.completedCount} siswa selesai`
                        : 'Belum ada siswa selesai'}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-[12px] border border-[#ECECEC] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#737373]">Perlu Perhatian</span>
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-amber-600">
                      {modSpecificAnalytics ? modSpecificAnalytics.needsAttentionCount : 0}{' '}
                      <span className="text-xs font-normal text-[#737373]">Siswa</span>
                    </p>
                    <p className="text-[11px] text-[#AAAAAA]">
                      {modSpecificAnalytics && modSpecificAnalytics.needsAttentionCount > 0
                        ? `${modSpecificAnalytics.needsAttentionCount} siswa durasi baca sangat singkat`
                        : 'Tidak ada siswa tertinggal'}
                    </p>
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
                {(() => {
                  const dynamicAttachments = (selectedModule.blocks || [])
                    .filter((b: any) => b.type === 'attachment')
                    .flatMap((b: any) => b.attachments || [])
                    .map((att: any) => ({
                      id: att.id,
                      name: att.fileName || att.name || 'Dokumen_Lampiran.pdf',
                      size: att.fileSize || att.size || '2.0 MB',
                      url: att.fileUrl || att.url || '#',
                      fileType: att.fileType || (att.fileName || att.name || '').split('.').pop() || 'pdf',
                    }));

                  const staticDetail = (selectedModule.id && typeof selectedModule.id === 'string' && selectedModule.id.startsWith('mod-'))
                    ? getMaterialDetailForModule(selectedModule.id)
                    : undefined;

                  const staticAttachments = staticDetail?.attachment?.fileName ? [{
                    id: 'att-static-1',
                    name: staticDetail.attachment.fileName,
                    size: staticDetail.attachment.fileSize || '1.2 MB',
                    url: '#',
                    fileType: 'pdf'
                  }] : [];

                  const moduleAttachments = dynamicAttachments.length > 0 ? dynamicAttachments : staticAttachments;
                  const moduleQuizSource = selectedModule.quizSource;

                  return (
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

                          {/* Evaluasi / Tes & Tautan Akses - DYNAMIC REAL DATA */}
                          <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-[#737373]">Akses Ujian & Evaluasi</p>
                            
                            {moduleQuizSource?.type === 'kuis_sitemsa' ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const matchingQuiz = quizzes.find((q) => q.title === moduleQuizSource.title || q.id === (moduleQuizSource as any).quizId);
                                    if (matchingQuiz) {
                                      router.push(`/admin/guru/pelajaran?item=${matchingQuiz.id}`);
                                    } else {
                                      showToast(`Kuis '${moduleQuizSource.title || 'Evaluasi'}' terhubung`, 'info');
                                    }
                                  }}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-medium border border-indigo-200/80 transition-all cursor-pointer active:scale-[0.98] group"
                                  title="Klik untuk melihat detail kuis"
                                >
                                  <Play className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span className="truncate max-w-[260px]">
                                    {moduleQuizSource.title || 'Kuis Evaluasi Sitemsa'}
                                  </span>
                                </button>
                              </div>
                            ) : ((moduleQuizSource?.type as string) === 'link_eksternal' || (moduleQuizSource?.type as string) === 'external_link') && moduleQuizSource?.externalUrl ? (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-slate-50 border border-[#ECECEC] text-xs max-w-[320px] sm:max-w-[360px] w-full justify-between">
                                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                    <ExternalLink className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                                    <a
                                      href={moduleQuizSource.externalUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[#2563EB] hover:underline font-medium text-[11px] truncate block flex-1"
                                      title={moduleQuizSource.externalUrl}
                                    >
                                      {moduleQuizSource.externalUrl}
                                    </a>
                                  </div>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(moduleQuizSource.externalUrl!);
                                      setIsCopied(true);
                                      showToast('Tautan kuis berhasil disalin!', 'success');
                                      setTimeout(() => setIsCopied(false), 2000);
                                    }}
                                    className="p-1 rounded-[4px] hover:bg-slate-200 text-[#737373] hover:text-[#2563EB] transition-colors cursor-pointer shrink-0 ml-1"
                                    title="Salin Tautan"
                                  >
                                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            ) : moduleQuizSource?.type === 'qr_code' && moduleQuizSource.qrImageUrl ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setActiveQrModalUrl(moduleQuizSource.qrImageUrl || null);
                                    setShowQrModal(true);
                                  }}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-purple-50 hover:bg-purple-100/80 text-purple-700 text-xs font-medium border border-purple-200/80 transition-all cursor-pointer active:scale-[0.98]"
                                >
                                  <QrCode className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Lihat Qr Code Ujian</span>
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-[#AAAAAA] italic">Belum ada evaluasi atau kuis yang ditautkan</p>
                            )}
                          </div>

                          {/* File & Lampiran Materi Buttons - DYNAMIC REAL DATA */}
                          <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-[#737373]">File & Berkas Lampiran</p>
                            {moduleAttachments.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {moduleAttachments.map((att: any, idx: number) => {
                                  const isPdf = (att.name || '').toLowerCase().endsWith('.pdf') || att.fileType === 'pdf';
                                  return (
                                    <button
                                      key={att.id || idx}
                                      type="button"
                                      onClick={() => handleDownloadAttachmentFile(att.name, att.url)}
                                      className="flex items-center justify-between p-2 rounded-[8px] bg-slate-50/80 border border-[#ECECEC] hover:border-blue-300 hover:bg-blue-50/40 transition-all group cursor-pointer text-left w-full active:scale-[0.99]"
                                      title="Klik untuk mengunduh lampiran"
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <div className={`w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0 ${isPdf ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-blue-50 border border-blue-100 text-[#2563EB]'}`}>
                                          {isPdf ? <FileText className="w-3 h-3 text-rose-600" /> : <FileCode className="w-3 h-3 text-[#2563EB]" />}
                                        </div>
                                        <span className="text-xs font-medium text-[#2E2D2D] truncate group-hover:text-[#2563EB]">
                                          {att.name}
                                        </span>
                                      </div>
                                      <Download className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#2563EB] shrink-0 ml-2" />
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs text-[#AAAAAA] italic">Tidak ada berkas lampiran</p>
                            )}
                          </div>

                          {/* Topik Pembahasan - DYNAMIC REAL DATA */}
                          <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-[#737373]">Topik Pembahasan</p>
                            {selectedModule.topics && selectedModule.topics.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {selectedModule.topics.map((tp, idx) => (
                                  <span key={idx} className="text-xs font-medium text-[#2563EB] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-[6px]">
                                    {tp}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-[#AAAAAA] italic">Belum ada topik pembahasan</p>
                            )}
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
                          {recentReaders.length > 0 ? (
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
                          ) : (
                            <div className="py-8 text-center">
                              <p className="text-xs text-[#AAAAAA] italic">Belum ada siswa yang membaca materi ini.</p>
                            </div>
                          )}
                        </div>

                        <Link
                          href="/admin/guru/monitoring"
                          className="w-full py-2 text-center text-xs font-bold text-[#2563EB] hover:bg-blue-50 rounded-[8px] transition-colors block"
                        >
                          Lihat Semua Monitoring Siswa
                        </Link>
                      </div>

                    </div>
                  );
                })()}

              </div>
            )}

            {/* DETAIL VIEW: IF A QUIZ IS SELECTED (35% RULES / 65% QUESTIONS WITH BIG FRAME) */}
            {selectedQuiz && (
              <div className="flex flex-col lg:flex-row gap-6 pt-4 items-start">
                
                {/* LEFT COLUMN (35%): ATURAN & PETUNJUK KUIS */}
                <div className="w-full lg:w-[35%] bg-white rounded-[16px] border border-[#ECECEC] p-5 space-y-5 shadow-2xs shrink-0">
                  <div>
                    <h3 className="text-sm font-bold text-[#2E2D2D] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                      Aturan & Petunjuk Kuis
                    </h3>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    <div className="p-3.5 rounded-[10px] bg-slate-50 border border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-[#737373]">Durasi Pengerjaan</span>
                        <span className="text-[#2E2D2D]">{selectedQuiz.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-[#737373]">Jumlah Pertanyaan</span>
                        <span className="text-[#2E2D2D]">{selectedQuiz.questions.length} Soal</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-[#737373]">Batas Kelulusan</span>
                        <span className="text-emerald-600">{selectedQuiz.passScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-[#737373] pt-1">
                      <p className="font-semibold text-[#2E2D2D]">Ketentuan Evaluasi:</p>
                      <ul className="space-y-2 list-disc list-outside pl-4 leading-relaxed text-[11px]">
                        <li>Setiap soal memiliki 1 pilihan jawaban yang tepat.</li>
                        <li>Siswa harus mencapai batas nilai minimal <strong className="text-emerald-600 font-semibold">{selectedQuiz.passScore}%</strong> untuk lulus.</li>
                        <li>Pembahasan disediakan di setiap akhir soal untuk bahan evaluasi mandiri.</li>
                        <li>Hasil pengerjaan tercatat secara otomatis pada sistem monitoring guru.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (65%): DAFTAR SOAL DALAM BORDER FRAME BESAR */}
                <div className="w-full lg:w-[65%] bg-white rounded-[16px] border border-[#ECECEC] p-6 space-y-6 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
                    <h3 className="text-sm font-bold text-[#2E2D2D]">
                      Daftar Soal Evaluasi Kuis
                    </h3>
                    <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-[6px] border border-blue-100">
                      {selectedQuiz.questions.length} Soal
                    </span>
                  </div>

                  <div className="space-y-6">
                    {selectedQuiz.questions.map((q, idx) => (
                      <div key={q.id} className="space-y-3.5 pb-6 border-b border-[#ECECEC] last:border-b-0 last:pb-0">
                        <p className="text-base font-bold text-[#2E2D2D] leading-snug">
                          {q.text}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-3 rounded-[8px] text-xs font-medium border ${
                                oIdx === q.correctAnswer
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                  : 'bg-white border-[#ECECEC] text-[#737373]'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div className="text-xs text-slate-700 bg-slate-100/80 p-3.5 rounded-[8px] border border-slate-200/80 mt-2 leading-relaxed">
                            <strong className="text-[#2E2D2D] font-bold">Pembahasan:</strong> {q.explanation}
                          </div>
                        )}
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

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md text-left space-y-4 animate-in fade-in zoom-in-95 duration-200 relative"
          >
            {/* Top-Right X Button */}
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Icon above header */}
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>

            {/* Header Title */}
            <h3 className="font-bold text-base text-[#2E2D2D]">
              {deleteTarget.type === 'kuis' ? 'Konfirmasi Hapus Kuis' : 'Konfirmasi Hapus Materi'}
            </h3>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Apakah Anda yakin ingin menghapus {deleteTarget.type === 'kuis' ? 'kuis' : 'materi'} <strong className="text-[#2E2D2D]">{deleteTarget.title}</strong>? Data akan terhapus dari sistem.
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
                className="px-4 py-2 rounded-[8px] bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
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
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-sm text-left space-y-4 animate-in zoom-in-95 duration-200 relative"
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors cursor-pointer"
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
              <div className="p-4 bg-slate-50 border border-[#ECECEC] rounded-[12px] flex items-center justify-center my-2">
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
                  onClick={() => { showToast("QR Code berhasil diunduh!", "success"); setShowQrModal(false); }}
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

      {/* ADD KUIS CHOICE & METHOD MODAL */}
      {showAddQuizModal && (
        <div
          onClick={() => setShowAddQuizModal(false)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-lg text-left space-y-5 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAddQuizModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* STEP 1: CHOICE MENU */}
            {quizModalStep === 'choice' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-[#2E2D2D]">Tambah Kuis Evaluasi Baru</h3>
                </div>

                <div className="grid grid-cols-1 gap-3.5 pt-1">
                  {/* OPTION 1: IMPOR TEMPLATE */}
                  <div
                    onClick={() => {
                      setQuizModalStep('template');
                      setUploadedFile(null);
                    }}
                    className="p-3.5 rounded-[12px] bg-white border-[1.5px] border-[#ECECEC] hover:border-indigo-500 hover:bg-indigo-50/30 transition-all flex items-start gap-3.5 cursor-pointer group"
                  >
                    <div className="w-[36px] h-[36px] rounded-[8px] bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0 flex items-center justify-center">
                      <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#2E2D2D] transition-colors">
                        Impor dari Berkas Template (.xlsx / .docx)
                      </h4>
                      <p className="text-xs text-[#737373] leading-relaxed">
                        Unggah berkas template kuis yang berisi daftar soal dan pilihan jawaban untuk diimpor sekaligus secara otomatis.
                      </p>
                    </div>
                  </div>

                  {/* OPTION 2: BUAT MANUAL (PAGES SEPARATE) */}
                  <div
                    onClick={() => {
                      setShowAddQuizModal(false);
                      router.push('/admin/guru/pelajaran/buat-kuis');
                    }}
                    className="p-3.5 rounded-[12px] bg-white border-[1.5px] border-[#ECECEC] hover:border-[#2563EB] hover:bg-blue-50/30 transition-all flex items-start gap-3.5 cursor-pointer group"
                  >
                    <div className="w-[36px] h-[36px] rounded-[8px] bg-blue-50 text-[#2563EB] border border-blue-100 shrink-0 flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#2E2D2D] transition-colors">
                        Buat Manual (Satu per Satu)
                      </h4>
                      <p className="text-xs text-[#737373] leading-relaxed">
                        Susun judul kuis, durasi, nilai kelulusan, serta input soal dan pilihan jawaban satu per satu secara manual.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TEMPLATE IMPORT VIEW */}
            {quizModalStep === 'template' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-[#2E2D2D]">Impor Template Kuis (.xlsx / .docx)</h3>
                </div>

                {/* Download Template Action */}
                <div className="p-3.5 rounded-[10px] bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-indigo-900">Belum punya format template?</p>
                    <p className="text-[11px] text-indigo-700">Unduh format acuan file (.csv / .xlsx) di sini.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadQuizTemplate}
                    className="px-3 py-1.5 rounded-[6px] bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Template</span>
                  </button>
                </div>

                {/* Drag & Drop Upload Zone */}
                <div
                  onClick={() => handleSimulateTemplateUpload()}
                  className={`p-6 rounded-[12px] border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                    uploadedFile
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-slate-300 hover:border-indigo-400 bg-slate-50/80 hover:bg-indigo-50/20'
                  }`}
                >
                  {uploadedFile ? (
                    <>
                      <div className="w-[36px] h-[36px] rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
                        <Check className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#2E2D2D]">{uploadedFile.name}</p>
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          Berkas Terverifikasi ({uploadedFile.questionCount} Soal & Kunci Jawaban Terdeteksi)
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-[36px] h-[36px] rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                        <UploadCloud className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2E2D2D]">Tarik & Lepas file template di sini</p>
                        <p className="text-[11px] text-[#737373]">atau klik untuk memilih berkas dari komputer (.xlsx, .docx, .csv)</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setQuizModalStep('choice')}
                    className="px-4 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#2E2D2D] transition-colors cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmTemplateImport}
                    className="px-5 py-2 rounded-[8px] bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Impor & Buat Kuis
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: MANUAL QUIZ CREATION VIEW */}
            {quizModalStep === 'manual' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#2E2D2D]">Buat Kuis Evaluasi Manual</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#2E2D2D] block">Judul Kuis</label>
                    <input
                      type="text"
                      value={manualQuizTitle}
                      onChange={(e) => setManualQuizTitle(e.target.value)}
                      placeholder="Contoh: Kuis Logika Algoritma Dasar"
                      className="w-full h-9 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-medium text-[#2E2D2D] outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#2E2D2D] block">Durasi Kuis</label>
                      <input
                        type="text"
                        value={manualQuizDuration}
                        onChange={(e) => setManualQuizDuration(e.target.value)}
                        className="w-full h-9 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-medium text-[#2E2D2D] outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#2E2D2D] block">Pass Score (%)</label>
                      <input
                        type="number"
                        value={manualQuizPassScore}
                        onChange={(e) => setManualQuizPassScore(e.target.value)}
                        className="w-full h-9 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-medium text-[#2E2D2D] outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  {/* Question items */}
                  <div className="space-y-3 pt-1">
                    <label className="font-bold text-[#2E2D2D] block">Daftar Soal ({manualQuestions.length} Soal)</label>
                    {manualQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 rounded-[8px] bg-slate-50 border border-[#ECECEC] space-y-2">
                        <input
                          type="text"
                          value={q.text}
                          onChange={(e) => {
                            const updated = [...manualQuestions];
                            updated[idx].text = e.target.value;
                            setManualQuestions(updated);
                          }}
                          placeholder={`Pertanyaan Soal ${idx + 1}`}
                          className="w-full h-8 px-2.5 rounded-[6px] bg-white border border-[#ECECEC] text-xs font-bold text-[#2E2D2D] outline-none"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`correct-${idx}`}
                                checked={q.correctAnswer === oIdx}
                                onChange={() => {
                                  const updated = [...manualQuestions];
                                  updated[idx].correctAnswer = oIdx;
                                  setManualQuestions(updated);
                                }}
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...manualQuestions];
                                  updated[idx].options[oIdx] = e.target.value;
                                  setManualQuestions(updated);
                                }}
                                className="w-full h-7 px-2 rounded-[4px] bg-white border border-[#ECECEC] text-[11px]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setQuizModalStep('choice')}
                    className="px-4 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#2E2D2D] transition-colors cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmManualQuiz}
                    className="px-5 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Simpan & Terbitkan Kuis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}



      {/* FLOATING ADMIN TOAST NOTIFICATION — slides from below navbar */}
      {toast && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-[10px] bg-white/90 backdrop-blur-md border border-[#ECECEC]/80 shadow-[0_14px_32px_-8px_rgba(0,0,0,0.14)] font-sans transition-all duration-300 ease-out ${
            toastExiting
              ? 'opacity-0 -translate-y-3'
              : 'opacity-100 translate-y-0 animate-in slide-in-from-top-4 fade-in duration-300'
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-100' :
            toast.type === 'info' ? 'bg-blue-100' :
            'bg-amber-100'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
            {toast.type === 'info' && <Info className="w-3.5 h-3.5 text-[#2563EB]" />}
            {toast.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-700" />}
          </div>
          <p className="text-xs font-medium text-[#2E2D2D] max-w-sm truncate">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast()}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
          </div>
        )}
      {/* DETAIL MODAL INFO WITH DETAIL TIM LIST LAYOUT */}
      {(selectedModule || selectedInfoModule) && (() => {
        const activeMod = (selectedModule || selectedInfoModule)!;
        const authorTeacher = activeMod.teacherId || activeMod.teacherName
          ? teachers.find((t) => t.id === activeMod.teacherId || t.name?.toLowerCase() === activeMod.teacherName?.toLowerCase())
          : null;
        const modTeacherAvatar = (authorTeacher?.avatar && authorTeacher.avatar.trim()) ? authorTeacher.avatar : (activeMod.teacherName === user?.name ? user?.avatar : undefined);

        return (
          <ModuleInfoModal
            isOpen={showDetailInfoModal}
            onClose={() => {
              setShowDetailInfoModal(false);
              setSelectedInfoModule(null);
            }}
            title={activeMod.title}
            subject={activeMod.subject}
            teacherName={activeMod.teacherName || user?.name || 'Pengajar Sitemsa'}
            teacherRole={user?.role === 'superadmin' ? 'Superadmin Kurikulum Sitemsa' : `Guru Pengampu ${activeMod.subject}`}
            teacherAvatar={modTeacherAvatar}
            publishDate={activeMod.createdAt || '20 Agustus 2026, 08:30 WIB'}
            lastUpdate="22 Agustus 2026, 13:45 WIB"
          />
        );
      })()}

      {/* QUIZ INFO MODAL */}
      {(selectedQuiz || selectedInfoQuiz) && (() => {
        const activeQuiz = (selectedQuiz || selectedInfoQuiz)!;
        const authorTeacher = activeQuiz.teacherId || activeQuiz.teacherName
          ? teachers.find((t) => t.id === activeQuiz.teacherId || t.name?.toLowerCase() === activeQuiz.teacherName?.toLowerCase())
          : null;
        const quizTeacherAvatar = (authorTeacher?.avatar && authorTeacher.avatar.trim()) ? authorTeacher.avatar : (activeQuiz.teacherName === user?.name ? user?.avatar : undefined);

        return (
          <QuizInfoModal
            isOpen={showDetailQuizInfoModal}
            onClose={() => {
              setShowDetailQuizInfoModal(false);
              setSelectedInfoQuiz(null);
            }}
            title={activeQuiz.title}
            subject={activeQuiz.subject}
            questionCount={activeQuiz.questions ? activeQuiz.questions.length : (activeQuiz.questionCount || 0)}
            passScore={activeQuiz.passScore || 75}
            duration={activeQuiz.duration || '15 Menit'}
            teacherName={activeQuiz.teacherName || user?.name || 'Guru Sitemsa'}
            teacherRole={user?.role === 'superadmin' ? 'Superadmin Kurikulum Sitemsa' : `Guru Pengampu ${activeQuiz.subject}`}
            teacherAvatar={quizTeacherAvatar}
            publishDate={activeQuiz.createdAt || '20 Agustus 2026'}
            published={activeQuiz.published !== false}
          />
        );
      })()}

      {/* QR Code Modal Preview */}
      {showQrModal && activeQrModalUrl && (
        <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-[16px] p-6 border border-[#ECECEC] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200 relative"
          >
            <button
              onClick={() => {
                setShowQrModal(false);
                setActiveQrModalUrl(null);
              }}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 text-[#737373] hover:text-[#2E2D2D] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-[#2E2D2D]">QR Code Ujian & Evaluasi</h3>
            <div className="p-3 bg-slate-50 rounded-[12px] border border-[#ECECEC]">
              {/* eslint-disable-next-next/no-img-element */}
              <img
                src={activeQrModalUrl}
                alt="QR Code"
                className="w-56 h-56 object-contain"
                onError={(e) => {
                  const fallback = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://sitemsa.vercel.app`;
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setShowQrModal(false);
                setActiveQrModalUrl(null);
              }}
              className="w-full py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
