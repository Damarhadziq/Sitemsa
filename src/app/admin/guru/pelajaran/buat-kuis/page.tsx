'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Plus, Copy, Trash2, CheckCircle2, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { useAdminStore, QuizQuestion } from '@/lib/admin-store';
import { useAuth } from '@/lib/auth-context';
import { QuizService } from '@/services/quiz.service';
import { quizzesClientService } from '@/services/client/quizzes.client';

function BuatKuisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');

  const { addQuiz, updateQuiz, quizzes, subjects } = useAdminStore();
  const { user, role, activeSubjectFilter } = useAuth();

  const existingQuiz = quizId ? quizzes.find((q) => q.id === quizId) : null;
  const isAlreadyPublished = existingQuiz ? existingQuiz.published === true : false;

  // Filter subjects based on teacher assignment or superadmin
  const assignedSubjects = user?.assignedSubjects || [];
  const availableSubjects =
    role === 'superadmin'
      ? subjects.map((s) => s.name)
      : assignedSubjects.length > 0
      ? assignedSubjects
      : ['Informatika'];

  const defaultSubject =
    activeSubjectFilter && availableSubjects.includes(activeSubjectFilter)
      ? activeSubjectFilter
      : availableSubjects[0] || 'Informatika';

  // Quiz Form Metadata State (Clean/Empty defaults)
  const [title, setTitle] = useState(existingQuiz?.title || '');
  const [subject, setSubject] = useState(existingQuiz?.subject || defaultSubject);
  const [duration, setDuration] = useState(existingQuiz?.duration || '15 Menit');
  const [passScore, setPassScore] = useState<number | ''>(existingQuiz?.passScore ?? 75);
  const [description, setDescription] = useState('');
  const [isRandomized, setIsRandomized] = useState(false);

  // Modal States
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Questions List State - Default Kosong Murni
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    existingQuiz && existingQuiz.questions && existingQuiz.questions.length > 0
      ? existingQuiz.questions
      : [
          {
            id: 'q-1',
            text: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
          },
        ]
  );

  // Sync state if existingQuiz loads
  useEffect(() => {
    if (existingQuiz) {
      setTitle(existingQuiz.title);
      setSubject(existingQuiz.subject);
      setDuration(existingQuiz.duration);
      setPassScore(existingQuiz.passScore);
      if (existingQuiz.questions && existingQuiz.questions.length > 0) {
        setQuestions(existingQuiz.questions);
      }
    }
  }, [existingQuiz]);

  // Custom Dropdown State for Mata Pelajaran
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isModalSubjectDropdownOpen, setIsModalSubjectDropdownOpen] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement | null>(null);
  const modalSubjectDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close custom dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(e.target as Node)) {
        setIsSubjectDropdownOpen(false);
      }
      if (modalSubjectDropdownRef.current && !modalSubjectDropdownRef.current.contains(e.target as Node)) {
        setIsModalSubjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock global body scroll when any modal is open
  const isAnyModalOpen = showPublishModal || showSuccessModal || deleteTargetIndex !== null || showExitConfirmModal;

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

  // Intercept browser back button, Alt+Left shortcut, and refresh/close tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Push dummy state to trap back button
    window.history.pushState({ quizEditorOpen: true }, '');

    const handlePopState = () => {
      setShowExitConfirmModal(true);
      window.history.pushState({ quizEditorOpen: true }, '');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Realtime Form Validation Checks
  const isTitleValid = title.trim().length > 0;
  const isPassScoreValid = passScore !== '' && !isNaN(Number(passScore)) && Number(passScore) > 0;
  const hasQuestions = questions.length > 0;
  const allQuestionsHaveText = questions.every((q) => q.text.trim().length > 0);
  const allQuestionsHaveAllOptions = questions.every((q) =>
    q.options.length >= 2 && q.options.every((opt) => opt.trim().length > 0)
  );
  const allQuestionsValidKeys = questions.every(
    (q) => q.options[q.correctAnswer] !== undefined && q.options[q.correctAnswer].trim().length > 0
  );

  // Entire form mandatory completeness condition: title + each question has title & options with selected answer
  const isFormComplete =
    isTitleValid &&
    isPassScoreValid &&
    hasQuestions &&
    allQuestionsHaveText &&
    allQuestionsHaveAllOptions &&
    allQuestionsValidKeys;

  // Question Helper Functions
  const handleAddQuestion = () => {
    const newQuestionNumber = questions.length + 1;
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('Kuis harus memiliki minimal 1 pertanyaan.');
      return;
    }
    setDeleteTargetIndex(index);
  };

  const confirmDeleteQuestion = () => {
    if (deleteTargetIndex !== null) {
      setQuestions((prev) => prev.filter((_, i) => i !== deleteTargetIndex));
      setDeleteTargetIndex(null);
    }
  };

  const handleDuplicateQuestion = (index: number) => {
    const target = questions[index];
    const duplicated: QuizQuestion = {
      ...target,
      id: `q-${Date.now()}`,
      text: target.text ? `${target.text} (Salinan)` : '',
    };
    setQuestions((prev) => [
      ...prev.slice(0, index + 1),
      duplicated,
      ...prev.slice(index + 1),
    ]);
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text } : q))
    );
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    val: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, qI) => {
        if (qI !== questionIndex) return q;
        const newOptions = [...q.options];
        newOptions[optionIndex] = val;
        return { ...q, options: newOptions };
      })
    );
  };

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === questionIndex ? { ...q, correctAnswer: optionIndex } : q))
    );
  };

  const handleExplanationChange = (index: number, explanation: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, explanation } : q))
    );
  };

  // Form Submission (Create or Update)
  const handleSubmitQuiz = (published: boolean) => {
    if (published && !isFormComplete) {
      alert('Mohon lengkapi seluruh bidang formulir wajib (Judul, Batas KKM, Soal, Kunci Jawaban & Pembahasan) sebelum mempublikasikan kuis.');
      return;
    }

    if (!title.trim()) {
      alert('Mohon isi Judul Kuis terlebih dahulu.');
      return;
    }

    if (published) {
      setIsPublishing(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      if (existingQuiz) {
        // Update existing quiz
        updateQuiz(existingQuiz.id, {
          subject,
          title: title.trim(),
          duration: duration || '15 Menit',
          passScore: Number(passScore) || 75,
          questionCount: questions.length,
          questions,
          published: isAlreadyPublished ? true : published,
        });

        QuizService.updateQuiz(existingQuiz.id, {
          subject,
          title: title.trim(),
          duration: duration || '15 Menit',
          passScore: Number(passScore) || 75,
          questions,
          published: isAlreadyPublished ? true : published,
        });
        quizzesClientService.update(existingQuiz.id, {
          subject,
          title: title.trim(),
          duration: duration || '15 Menit',
          passScore: Number(passScore) || 75,
          questions,
          published: isAlreadyPublished ? true : published,
        } as any).catch((e) => console.warn('Quiz client sync update error:', e));

        if (published) {
          setIsPublishing(false);
          setShowPublishModal(false);
          setShowSuccessModal(true);
        } else {
          setToastMessage('Draft kuis berhasil disimpan!');
          setTimeout(() => {
            router.push('/admin/guru/pelajaran');
          }, 1000);
        }
      } else {
        // Create new quiz
        const newQuizId = addQuiz({
          subject,
          title: title.trim(),
          duration: duration || '15 Menit',
          passScore: Number(passScore) || 75,
          questionCount: questions.length,
          questions,
          teacherId: user?.id || 't2',
          teacherName: user?.name || 'Damar Hadziq H.',
          published,
        });

        QuizService.createQuiz({
          id: newQuizId,
          subject,
          title: title.trim(),
          duration: duration || '15 Menit',
          passScore: Number(passScore) || 75,
          questions,
          teacherId: user?.id || 't2',
          teacherName: user?.name || 'Damar Hadziq H.',
          published,
        });
        quizzesClientService.create({
          id: newQuizId,
          subject,
          title: title.trim(),
          duration: duration || '15 Menit',
          passScore: Number(passScore) || 75,
          questions,
          teacherId: user?.id || 't-1',
          teacherName: user?.name || 'Pengajar Sitemsa',
          published,
        } as any).catch((e) => console.warn('Quiz client sync create error:', e));

        if (published) {
          setIsPublishing(false);
          setShowPublishModal(false);
          setShowSuccessModal(true);
        } else {
          setToastMessage('Draft kuis berhasil disimpan!');
          setTimeout(() => {
            router.push('/admin/guru/pelajaran');
          }, 1000);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan kuis. Mohon periksa kembali inputan Anda.');
      setIsPublishing(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2E2D2D] flex flex-col font-sans">
      {/* 1. TOP HEADER BAR (Matching Tambah Materi: Cancel X + Title Input + Save as draft + Continue) */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#ECECEC] h-16 px-6 lg:px-12 flex items-center justify-between shrink-0">
        {/* Left Section: Circular Cancel Button + Title Input */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
          <button
            type="button"
            onClick={() => setShowExitConfirmModal(true)}
            title="Batal / Keluar"
            className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#737373] hover:text-[#2E2D2D] hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Judul Kuis Sitemsa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full max-w-md font-bold text-lg sm:text-xl text-[#2E2D2D] placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent p-0 m-0"
          />
        </div>

        {/* Right Section: Action Buttons (No Draft button if already published, 'Continue' to open Publish Modal) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!isAlreadyPublished && (
            <button
              type="button"
              disabled={isSubmitting || !title.trim()}
              onClick={() => handleSubmitQuiz(false)}
              className={`px-4 py-2 rounded-[8px] border border-[#ECECEC] text-xs font-semibold transition-all ${
                title.trim() && !isSubmitting
                  ? 'bg-white hover:bg-slate-50 text-[#2E2D2D] cursor-pointer'
                  : 'bg-slate-100 text-[#AAAAAA] cursor-not-allowed opacity-50'
              }`}
            >
              Simpan Draft
            </button>
          )}

          <button
            type="button"
            disabled={!isFormComplete}
            onClick={() => setShowPublishModal(true)}
            className={`px-5 py-2 rounded-[8px] text-xs font-semibold transition-all ${
              isFormComplete
                ? 'bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer active:scale-98 shadow-xs'
                : 'bg-slate-100 text-[#AAAAAA] cursor-not-allowed opacity-50 shadow-none'
            }`}
          >
            Continue
          </button>
        </div>
      </header>

      {/* 2. DEDICATED PERSONAL BUILDER CANVAS */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-16 w-full flex-1">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-[10px] flex items-center gap-3 text-xs font-semibold text-emerald-800 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT FORM & QUESTION BUILDER (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            {/* CARD 1: INFORMASI UTAMA KUIS (Headline text only, no subtitle, no divider line) */}
            <section className="bg-white border border-[#ECECEC] rounded-[16px] p-6 space-y-5">
              <h2 className="text-base font-bold text-[#2E2D2D]">Pengaturan Utama Kuis</h2>

              <div className="space-y-4">
                {/* Judul Kuis */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2E2D2D] block">
                    Judul Kuis <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Evaluasi Logika Pemrograman & Operator Boolean"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                  />
                </div>

                {/* Grid 2-Column: Mata Pelajaran (Only Assigned Subjects) & Estimasi Durasi Pengerjaan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mata Pelajaran (Custom Dropdown Popover matching Tambah Materi level dropdown) */}
                  <div ref={subjectDropdownRef} className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-[#2E2D2D] block">
                      Mata Pelajaran <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                        className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] flex items-center justify-between cursor-pointer transition-colors font-medium"
                      >
                        <span className="font-medium text-[#2E2D2D]">{subject}</span>
                        <ChevronDown className={`w-4 h-4 text-[#737373] transition-transform duration-200 ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isSubjectDropdownOpen && (
                        <div
                          className="absolute left-0 top-full mt-1.5 w-full bg-white border border-[#ECECEC] rounded-[12px] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5 shadow-xl"
                        >
                          {availableSubjects.map((subName) => {
                            const isSelected = subject === subName;
                            return (
                              <button
                                key={subName}
                                type="button"
                                onClick={() => {
                                  setSubject(subName);
                                  setIsSubjectDropdownOpen(false);
                                }}
                                className={`w-full px-3 py-2.5 rounded-[8px] text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                                  isSelected
                                    ? 'text-[#2563EB] font-bold'
                                    : 'text-[#2E2D2D] hover:bg-slate-50 font-medium'
                                }`}
                              >
                                <span>{subName}</span>
                                {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estimasi Durasi Pengerjaan */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2E2D2D] block">
                      Estimasi Durasi Pengerjaan
                    </label>
                    <input
                      type="text"
                      placeholder="15 Menit"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                    />
                  </div>
                </div>

                {/* Grid 2-Column: KKM Pass Score & Petunjuk */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Batas Nilai Kelulusan (KKM %) - WAJIB DIISI */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2E2D2D] block">
                      Batas Nilai Kelulusan (KKM %) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="75"
                      value={passScore}
                      onChange={(e) => setPassScore(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                    />
                  </div>
                </div>

                {/* Deskripsi / Petunjuk Pengerjaan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2E2D2D] block">
                    Petunjuk Pengerjaan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan petunjuk kuis untuk siswa..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] transition-colors resize-none font-medium"
                  />
                </div>
              </div>
            </section>

            {/* CARD 2: QUESTION BUILDER CANVAS */}
            <section className="space-y-4">
              {/* Header Title with Chip Badge (No helper on the right) */}
              <div className="flex items-center gap-2.5 px-1">
                <h3 className="text-base font-bold text-[#2E2D2D]">
                  Daftar Pertanyaan
                </h3>
                <span className="bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold px-2.5 py-0.5 rounded-[4px]">
                  {questions.length} Soal
                </span>
              </div>

              {/* Question Items List */}
              <div className="space-y-5">
                {questions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="bg-white border border-[#ECECEC] rounded-[16px] p-6 space-y-4 relative group transition-colors duration-200 hover:border-[#2563EB]/40"
                  >
                    {/* Item Header (NO BORDER DIVIDER LINE, Pure Seamless) */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-extrabold flex items-center justify-center">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-sm font-bold text-[#2E2D2D]">
                          Pertanyaan {qIndex + 1}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDuplicateQuestion(qIndex)}
                          className="px-2.5 py-1 rounded-[6px] bg-white border border-[#ECECEC] hover:bg-slate-50 text-[#737373] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Duplikasi Pertanyaan"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Duplikasi</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          className="p-1.5 rounded-[6px] bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs transition-colors cursor-pointer"
                          title="Hapus Pertanyaan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Text Input directly on canvas (Upsized font, no label, no box container) */}
                    <div className="pt-1">
                      <textarea
                        rows={2}
                        placeholder="Tuliskan pertanyaan di sini..."
                        value={q.text}
                        onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                        className="w-full text-base sm:text-lg font-bold text-[#2E2D2D] placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent p-0 resize-none leading-snug"
                      />
                    </div>

                    {/* 4 Answer Options Grid */}
                    <div className="space-y-2 pt-1">
                      <label className="text-xs font-bold text-[#2E2D2D] block flex items-center justify-between">
                        <span>Pilihan Jawaban &amp; Kunci Jawaban <span className="text-rose-500">*</span></span>
                        <span className="text-[11px] font-normal text-[#737373]">
                          Pilih bulatan hijau pada opsi yang benar
                        </span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((optText, optIndex) => {
                          const isCorrect = q.correctAnswer === optIndex;
                          const labelLetter = String.fromCharCode(65 + optIndex); // A, B, C, D

                          return (
                            <div
                              key={optIndex}
                              onClick={() => handleCorrectAnswerChange(qIndex, optIndex)}
                              className={`p-3 rounded-[10px] border transition-all cursor-pointer flex items-center gap-3 ${
                                isCorrect
                                  ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                                  : 'bg-white border-[#ECECEC] hover:border-gray-300'
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                                  isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-[#ECECEC] text-[#737373]'
                                }`}
                              >
                                {labelLetter}
                              </div>

                              <input
                                type="text"
                                value={optText}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleOptionChange(qIndex, optIndex, e.target.value)
                                }
                                className="flex-1 bg-transparent border-none text-xs text-[#2E2D2D] focus:outline-none font-medium"
                                placeholder={`Opsi ${labelLetter}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanation / Pembahasan Jawaban (Mandatory, No Divider Line) */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-bold text-[#2E2D2D] block">
                        Pembahasan Jawaban <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Tambahkan penjelasan mengapa jawaban tersebut benar..."
                        value={q.explanation}
                        onChange={(e) => handleExplanationChange(qIndex, e.target.value)}
                        className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Question Button */}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-4 border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] rounded-[16px] bg-white hover:bg-[#F6F5FF] text-[#2563EB] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Tambah Pertanyaan Baru</span>
              </button>
            </section>
          </div>

          {/* RIGHT SIDEBAR SUMMARY (4 Columns, Realtime Dashboard) */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            {/* Realtime Ringkasan Kuis Card (Without line divider, without publish button) */}
            <div className="bg-white border border-[#ECECEC] rounded-[16px] p-6 space-y-5">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                Ringkasan Kuis
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">Mata Pelajaran</span>
                  <span className="font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-[4px]">
                    {subject}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">Total Pertanyaan</span>
                  <span className="font-bold text-[#2E2D2D]">
                    {questions.length} Soal
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">Alokasi Waktu</span>
                  <span className="font-bold text-[#2E2D2D]">
                    {duration || '15 Menit'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">Batas KKM</span>
                  <span
                    className={`font-bold ${
                      isPassScoreValid ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {isPassScoreValid ? `${passScore}%` : 'Belum diisi'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white border border-blue-100 rounded-[16px] p-5 space-y-2 text-xs">
              <h4 className="font-bold text-[#2E2D2D]">
                Tips Menyusun Kuis Vokasi
              </h4>
              <p className="text-[#737373] leading-relaxed">
                Gunakan bahasa yang ringkas dan jelas. Sertakan pembahasan di setiap kunci jawaban agar siswa dapat belajar secara mandiri setelah kuis berakhir.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* 3. PUBLISH QUIZ MODAL (Opened on Continue Click) */}
      {showPublishModal && (
        <div
          onClick={() => setShowPublishModal(false)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-[16px] border border-[#ECECEC] p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header (No Subtitle) */}
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-base text-[#2E2D2D]">
                {isAlreadyPublished ? 'Publikasikan Ulang Kuis' : 'Publikasikan Kuis'}
              </h3>

              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Fields for Crosscheck */}
            <div className="space-y-4 pt-1">
              {/* 1. Judul Kuis */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2E2D2D] block">
                  Judul Kuis <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Misal: Evaluasi Logika Pemrograman & Operator Boolean"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                />
              </div>

              {/* 2. Mata Pelajaran (Custom Popover Dropdown - Filtered by Teacher Assignment) */}
              <div ref={modalSubjectDropdownRef} className="space-y-1.5 relative">
                <label className="text-xs font-bold text-[#2E2D2D] block">
                  Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModalSubjectDropdownOpen(!isModalSubjectDropdownOpen)}
                    className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] flex items-center justify-between cursor-pointer transition-colors font-medium"
                  >
                    <span className="font-medium text-[#2E2D2D]">{subject}</span>
                    <ChevronDown className={`w-4 h-4 text-[#737373] transition-transform duration-200 ${isModalSubjectDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isModalSubjectDropdownOpen && (
                    <div
                      className="absolute left-0 top-full mt-1.5 w-full bg-white border border-[#ECECEC] rounded-[12px] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5 shadow-xl"
                    >
                      {availableSubjects.map((subName) => {
                        const isSelected = subject === subName;
                        return (
                          <button
                            key={subName}
                            type="button"
                            onClick={() => {
                              setSubject(subName);
                              setIsModalSubjectDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 rounded-[8px] text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'text-[#2563EB] font-bold'
                                : 'text-[#2E2D2D] hover:bg-slate-50 font-medium'
                            }`}
                          >
                            <span>{subName}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 3 & 4. Grid 2-Column: Estimasi Durasi & KKM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2E2D2D] block">
                    Estimasi Pengerjaan
                  </label>
                  <input
                    type="text"
                    placeholder="15 Menit"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2E2D2D] block">
                    Batas Nilai Kelulusan (KKM %) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="75"
                    value={passScore}
                    onChange={(e) => setPassScore(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                  />
                </div>
              </div>

              {/* 5. Info Jumlah Soal */}
              <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-[10px] border border-blue-100 text-xs">
                <span className="text-[#2E2D2D] font-medium">Total Soal Terdaftar</span>
                <span className="font-bold text-[#2563EB] bg-white px-2.5 py-0.5 rounded-[4px] border border-blue-200">
                  {questions.length} Soal
                </span>
              </div>

              {/* 6. Toggle Randomize Urutan Soal (At the very bottom) */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-[12px] border border-[#ECECEC]">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-[#2E2D2D] block">
                    Acak Urutan Soal (Randomize)
                  </span>
                  <span className="text-[11px] text-[#737373] block leading-tight">
                    Mengacak susunan pertanyaan untuk setiap siswa saat kuis
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRandomized(!isRandomized)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer shrink-0 ${
                    isRandomized ? 'bg-[#2563EB]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      isRandomized ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Modal Action Buttons (No Top Divider Line) */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              {!isAlreadyPublished && (
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => handleSubmitQuiz(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Save as draft
                </button>
              )}

              <button
                type="button"
                disabled={isPublishing || !isFormComplete}
                onClick={() => handleSubmitQuiz(true)}
                className={`px-6 py-2.5 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  !isFormComplete || isPublishing
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    : 'bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer active:scale-98'
                }`}
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white shrink-0" />
                    <span>{isAlreadyPublished ? 'Menerbitkan Ulang...' : 'Menerbitkan Kuis...'}</span>
                  </>
                ) : (
                  <span>{isAlreadyPublished ? 'Publikasikan Ulang' : 'Publikasikan Kuis'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUCCESS MODAL WITH LOTTIE ANIMATION (Matching Tambah Materi) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-[16px] border border-[#ECECEC] p-6 text-center space-y-5 animate-in zoom-in-95 duration-200"
          >
            <div className="w-48 h-48 mx-auto relative flex items-center justify-center overflow-hidden">
              <iframe
                src="https://lottie.host/embed/878825de-212a-443e-89a9-c5573cfe890b/3v8OMNEl30.lottie"
                className="w-full h-full border-0 pointer-events-none"
                title="Publish Success Lottie Animation"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[#2E2D2D]">
                {isAlreadyPublished ? 'Kuis Berhasil Dipublikasikan Ulang!' : 'Kuis Berhasil Dipublikasikan!'}
              </h3>
              <p className="text-xs text-[#737373] leading-relaxed max-w-xs mx-auto">
                Kuis evaluasi ini sekarang telah aktif dan siap dikerjakan oleh seluruh siswa di platform Sitemsa.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/admin/guru/pelajaran');
                }}
                className="w-full py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Selesai &amp; Kembali ke Pelajaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DELETE QUESTION CONFIRMATION MODAL */}
      {deleteTargetIndex !== null && (
        <div
          onClick={() => setDeleteTargetIndex(null)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-[16px] border border-[#ECECEC] p-6 space-y-5 animate-in zoom-in-95 duration-200 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-base text-[#2E2D2D]">
                Hapus Pertanyaan
              </h3>
              <button
                type="button"
                onClick={() => setDeleteTargetIndex(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3.5 rounded-[10px] border border-[#ECECEC]">
              Apakah Anda yakin ingin menghapus <strong className="text-[#2E2D2D]">Pertanyaan {deleteTargetIndex + 1}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTargetIndex(null)}
                className="px-4 py-2.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDeleteQuestion}
                className="px-5 py-2.5 rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors active:scale-98"
              >
                Hapus Pertanyaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. EXIT / CANCEL CONFIRMATION MODAL */}
      {showExitConfirmModal && (
        <div
          onClick={() => setShowExitConfirmModal(false)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md space-y-5 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            {/* Header Title & Close Button */}
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-base text-[#2E2D2D]">Simpan Perubahan Sebelum Keluar?</h3>
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Anda sedang membuat atau mengedit kuis ini. Apakah Anda ingin menyimpannya sebagai draft terlebih dahulu atau keluar tanpa menyimpan?
            </p>

            {/* Action Buttons: Keluar + Simpan Sebagai Draft */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  router.push('/admin/guru/pelajaran');
                }}
                className="px-4 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] text-xs font-semibold cursor-pointer transition-colors"
              >
                Keluar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  handleSubmitQuiz(false);
                }}
                className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Simpan Sebagai Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuatKuisManualPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BuatKuisContent />
    </Suspense>
  );
}
