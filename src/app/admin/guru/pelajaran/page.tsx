'use client';

import React, { useState } from 'react';
import {
  FileQuestion,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Layers,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore, ModuleItem, QuizItem, QuizQuestion } from '@/lib/admin-store';

export default function AdminGuruPelajaranPage() {
  const { user, activeSubjectFilter } = useAuth();
  const { modules, addModule, updateModule, deleteModule, quizzes, addQuiz, updateQuiz, deleteQuiz } = useAdminStore();

  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  const [activeTab, setActiveTab] = useState<'modules' | 'quizzes'>('modules');

  // Module Modal state
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    level: 'Pemula' as 'Pemula' | 'Menengah' | 'Mahir',
    duration: '30 Menit',
    topicsStr: 'Variabel, Tipe Data',
    description: '',
  });

  // Quiz Modal state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);
  const [quizForm, setQuizForm] = useState({
    title: '',
    duration: '20 Menit',
    passScore: 75,
    questions: [
      {
        id: 'q-new-1',
        text: 'Soal evaluasi pemahaman...',
        options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
        correctAnswer: 0,
        explanation: 'Penjelasan kunci jawaban...',
      },
    ] as QuizQuestion[],
  });

  const currentModules = modules.filter((m) => m.subject === currentSubject);
  const currentQuizzes = quizzes.filter((q) => q.subject === currentSubject);

  const levelOptions = ['Pemula', 'Menengah', 'Mahir'] as const;

  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleForm({
      title: '',
      level: 'Pemula',
      duration: '30 Menit',
      topicsStr: 'Konsep dasar, Latihan',
      description: '',
    });
    setShowModuleModal(true);
  };

  const handleOpenEditModule = (mod: ModuleItem) => {
    setEditingModule(mod);
    setModuleForm({
      title: mod.title,
      level: mod.level,
      duration: mod.duration,
      topicsStr: mod.topics.join(', '),
      description: mod.description,
    });
    setShowModuleModal(true);
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) return;

    const topicsArray = moduleForm.topicsStr.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingModule) {
      updateModule(editingModule.id, {
        title: moduleForm.title,
        level: moduleForm.level,
        duration: moduleForm.duration,
        topics: topicsArray,
        description: moduleForm.description,
      });
    } else {
      addModule({
        subject: currentSubject,
        title: moduleForm.title,
        level: moduleForm.level,
        duration: moduleForm.duration,
        topics: topicsArray,
        description: moduleForm.description,
        teacherId: user?.id || 't-1',
        teacherName: user?.name || 'Admin guru',
      });
    }

    setShowModuleModal(false);
  };

  const handleDeleteModule = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus modul "${title}"?`)) {
      deleteModule(id);
    }
  };

  const handleOpenAddQuiz = () => {
    setEditingQuiz(null);
    setQuizForm({
      title: `Kuis ujian ${currentSubject}`,
      duration: '20 Menit',
      passScore: 75,
      questions: [
        {
          id: 'q-new-1',
          text: 'Pertanyaan pertama...',
          options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
          correctAnswer: 0,
          explanation: 'Pembahasan soal...',
        },
      ],
    });
    setShowQuizModal(true);
  };

  const handleOpenEditQuiz = (qz: QuizItem) => {
    setEditingQuiz(qz);
    setQuizForm({
      title: qz.title,
      duration: qz.duration,
      passScore: qz.passScore,
      questions: [...qz.questions],
    });
    setShowQuizModal(true);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;

    if (editingQuiz) {
      updateQuiz(editingQuiz.id, {
        title: quizForm.title,
        duration: quizForm.duration,
        passScore: Number(quizForm.passScore),
        questionCount: quizForm.questions.length,
        questions: quizForm.questions,
      });
    } else {
      addQuiz({
        subject: currentSubject,
        title: quizForm.title,
        duration: quizForm.duration,
        passScore: Number(quizForm.passScore),
        questionCount: quizForm.questions.length,
        questions: quizForm.questions,
        teacherId: user?.id || 't-1',
        teacherName: user?.name || 'Admin guru',
        published: true,
      });
    }

    setShowQuizModal(false);
  };

  const handleDeleteQuiz = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kuis "${title}"?`)) {
      deleteQuiz(id);
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#2E2D2D] bg-white">
      {/* Big Page Title in Content */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2E2D2D]">
          Manajemen Pelajaran
        </h1>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#ECECEC]">
        <button
          onClick={() => setActiveTab('modules')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'modules'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Modul materi ({currentModules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'quizzes'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>Kuis interaktif & bank soal ({currentQuizzes.length})</span>
        </button>
      </div>

      {/* Tab 1: Modules List */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2E2D2D]">Modul pembelajaran {currentSubject}</h2>
            <button
              onClick={handleOpenAddModule}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah modul baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentModules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold bg-blue-50 text-[#2563EB] px-2.5 py-0.5 rounded-[4px]">
                      {mod.level}
                    </span>
                    <span className="text-[11px] text-[#737373] font-medium">{mod.duration}</span>
                  </div>

                  <h3 className="text-xs font-bold text-[#2E2D2D] mt-2">{mod.title}</h3>
                  <p className="text-[11px] text-[#737373] mt-1 line-clamp-3 leading-relaxed">{mod.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {mod.topics.map((tp) => (
                      <span key={tp} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-[4px] font-medium">
                        #{tp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-1 flex items-center justify-between text-[11px] text-[#737373]">
                  <span>Dibuat: {mod.createdAt}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModule(mod)}
                      className="p-1.5 rounded-[6px] bg-slate-50 hover:bg-blue-50 text-[#2E2D2D] hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(mod.id, mod.title)}
                      className="p-1.5 rounded-[6px] bg-slate-50 hover:bg-rose-50 text-[#737373] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {currentModules.length === 0 && (
              <div className="col-span-full py-12 text-center text-[#737373] text-xs bg-white rounded-[10px] border border-[#ECECEC]">
                Belum ada modul untuk {currentSubject}. Klik &ldquo;Tambah modul baru&rdquo; untuk membuat materi.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Quizzes List */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2E2D2D]">Ujian & kuis evaluasi {currentSubject}</h2>
            <button
              onClick={handleOpenAddQuiz}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat kuis & bank soal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentQuizzes.map((qz) => (
              <div
                key={qz.id}
                className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold bg-blue-50 text-[#2563EB] px-2.5 py-0.5 rounded-[4px]">
                      Target nilai: {qz.passScore}
                    </span>
                    <span className="text-[11px] text-[#737373] font-medium">{qz.duration}</span>
                  </div>

                  <h3 className="text-xs font-bold text-[#2E2D2D]">{qz.title}</h3>

                  <div className="mt-4 p-4 rounded-[8px] bg-slate-50 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[#2E2D2D]">
                      <span>Jumlah soal:</span>
                      <strong className="text-[#2E2D2D] font-bold">{qz.questions.length} soal pilihan ganda</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#2E2D2D]">
                      <span>Status publikasi:</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Dipublikasikan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-1 flex items-center justify-between text-[11px] text-[#737373]">
                  <span>Pengampu: {qz.teacherName}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditQuiz(qz)}
                      className="px-3 py-1.5 rounded-[6px] bg-slate-50 hover:bg-blue-50 text-[#2E2D2D] hover:text-[#2563EB] font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit soal</span>
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(qz.id, qz.title)}
                      className="p-2 rounded-[6px] bg-slate-50 hover:bg-rose-50 text-[#737373] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {currentQuizzes.length === 0 && (
              <div className="col-span-full py-12 text-center text-[#737373] text-xs bg-white rounded-[10px] border border-[#ECECEC]">
                Belum ada kuis untuk {currentSubject}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans">
            <div className="p-6 bg-white flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                {editingModule ? 'Edit modul materi' : `Tambah modul materi (${currentSubject})`}
              </h3>
              <button onClick={() => setShowModuleModal(false)} className="text-[#737373] hover:text-[#2E2D2D] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Judul modul materi</label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="Contoh: Pemrograman dasar & algoritma"
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Custom Level Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Tingkat kesulitan</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                      className="w-full h-10 px-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>{moduleForm.level}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
                    </button>

                    {showLevelDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white rounded-[8px] border border-[#ECECEC] p-1 z-50 shadow-xs">
                        {levelOptions.map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              setModuleForm({ ...moduleForm, level: lvl });
                              setShowLevelDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-[6px] text-xs font-semibold flex items-center justify-between cursor-pointer ${
                              moduleForm.level === lvl ? 'bg-blue-50 text-[#2563EB]' : 'text-[#2E2D2D] hover:bg-slate-50'
                            }`}
                          >
                            <span>{lvl}</span>
                            {moduleForm.level === lvl && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Durasi belajar</label>
                  <input
                    type="text"
                    value={moduleForm.duration}
                    onChange={(e) => setModuleForm({ ...moduleForm, duration: e.target.value })}
                    placeholder="25 Menit"
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Topik bahasan (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={moduleForm.topicsStr}
                  onChange={(e) => setModuleForm({ ...moduleForm, topicsStr: e.target.value })}
                  placeholder="Variabel, Tipe data, Operasi logika"
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Deskripsi singkat</label>
                <textarea
                  rows={3}
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="Penjelasan singkat cakupan materi..."
                  className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  Simpan modul materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans">
            <div className="p-6 bg-white flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                {editingQuiz ? 'Edit kuis & soal ujian' : `Buat kuis ujian baru (${currentSubject})`}
              </h3>
              <button onClick={() => setShowQuizModal(false)} className="text-[#737373] hover:text-[#2E2D2D] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Judul kuis ujian</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="Contoh: Evaluasi pemahaman logika"
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Durasi pengerjaan</label>
                  <input
                    type="text"
                    value={quizForm.duration}
                    onChange={(e) => setQuizForm({ ...quizForm, duration: e.target.value })}
                    placeholder="20 Menit"
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Target nilai kelulusan</label>
                  <input
                    type="number"
                    value={quizForm.passScore}
                    onChange={(e) => setQuizForm({ ...quizForm, passScore: Number(e.target.value) })}
                    placeholder="75"
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-[8px] bg-slate-50 space-y-3">
                <h4 className="text-xs font-bold text-[#2E2D2D]">Bank soal ({quizForm.questions.length} soal)</h4>

                {quizForm.questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-3 bg-white rounded-[8px] text-xs space-y-2 border border-[#ECECEC]">
                    <p className="font-semibold text-[#2E2D2D]">Soal #{idx + 1}</p>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => {
                        const updatedQ = [...quizForm.questions];
                        updatedQ[idx].text = e.target.value;
                        setQuizForm({ ...quizForm, questions: updatedQ });
                      }}
                      className="w-full p-2 rounded-[6px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D]"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  Simpan kuis ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
