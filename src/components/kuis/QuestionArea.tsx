"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  FileQuestion,
  AlertTriangle,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { ProgressService } from "@/services/progress.service";
import { addUserNotification } from "@/services/notification.service";
import { recordModuleCompletion } from "@/services/weekly-target.service";
import { getStudentProfile } from "@/services/student-profile.service";

// Clean Web Audio API SFX (Subtle & Non-intrusive)
function playQuizSound(type: "pop" | "correct" | "wrong" | "tick" | "start") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "pop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === "tick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "start") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "correct") {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.2, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.2);
      });
    } else if (type === "wrong") {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch {
    // Audio context fallback
  }
}

// Default Sample Questions fallback
const DEFAULT_QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "Why does liquid water have such a high heat capacity?",
    options: [
      "The curved surface is a convex meniscus which has formed because of surface tension.",
      "The curved surface is a concave meniscus which has formed because of surface tension.",
      "The curved surface is a convex meniscus which has formed because of capillary action.",
      "The curved surface is a concave meniscus which has formed because of capillary action.",
      "All of the above is correct",
    ],
    correctAnswer: 0,
    explanation:
      "Tegangan permukaan (surface tension) dan gaya kohesi molekul air menciptakan kapasitas kalor tinggi serta meniskus cembung pada kondisi tertentu.",
  },
  {
    id: "q2",
    text: "Manakah struktur data berikut yang menerapkan prinsip First In First Out (FIFO)?",
    options: [
      "Stack (Tumpukan)",
      "Queue (Antrean)",
      "Binary Search Tree",
      "Graph Berbobot",
      "Semua jawaban salah",
    ],
    correctAnswer: 1,
    explanation:
      "Queue beroperasi menggunakan prinsip First In First Out (FIFO) di mana elemen yang masuk pertama kali akan diproses paling awal.",
  },
  {
    id: "q3",
    text: "Manakah kompleksitas waktu terbaik (Best Case) untuk algoritma Quick Sort?",
    options: [
      "O(N log N)",
      "O(N²)",
      "O(1)",
      "O(N)",
      "O(log N)",
    ],
    correctAnswer: 0,
    explanation:
      "Kompleksitas waktu terbaik Quick Sort adalah O(N log N) ketika pivot membagi array menjadi dua bagian yang seimbang.",
  },
];

export function QuestionArea({ quizId }: { quizId?: string }) {
  const router = useRouter();
  const { quizzes, modules } = useAdminStore();

  // Find Target Quiz & Subject Metadata
  const targetQuizData = useMemo(() => {
    if (quizId) {
      // 1. By ID or Title in quizzes
      const byQuizId = quizzes.find(
        (q) => q.id === quizId || q.title.toLowerCase().includes(quizId.toLowerCase())
      );
      if (byQuizId) {
        return {
          title: byQuizId.title,
          subject: byQuizId.subject || "Informatika",
          passScore: byQuizId.passScore || 75,
          questions:
            byQuizId.questions && byQuizId.questions.length > 0
              ? byQuizId.questions.map((q, idx) => ({
                  id: q.id || `q-${idx}`,
                  text: q.text,
                  options: q.options.filter((opt) => opt.trim().length > 0),
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation || "Pembahasan materi kuis Sitemsa.",
                }))
              : DEFAULT_QUIZ_QUESTIONS,
        };
      }

      // 2. By Module ID
      const byModule = modules.find((m) => m.id === quizId || String(m.id) === String(quizId));
      if (byModule) {
        const subQuiz = quizzes.find(
          (q) => q.subject.toLowerCase() === byModule.subject.toLowerCase()
        );
        if (subQuiz && subQuiz.questions && subQuiz.questions.length > 0) {
          return {
            title: subQuiz.title,
            subject: subQuiz.subject || byModule.subject,
            passScore: subQuiz.passScore || 75,
            questions: subQuiz.questions.map((q, idx) => ({
              id: q.id || `q-${idx}`,
              text: q.text,
              options: q.options.filter((opt) => opt.trim().length > 0),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || "Pembahasan materi kuis Sitemsa.",
            })),
          };
        }
      }
    }

    return {
      title: "Evaluasi Pemahaman Materi",
      subject: "Informatika",
      passScore: 75,
      questions: DEFAULT_QUIZ_QUESTIONS,
    };
  }, [quizId, quizzes, modules]);

  const questionsList = targetQuizData.questions;

  // Stages: 'ready_modal' -> 'countdown' -> 'in_quiz' -> 'completed'
  const [stage, setStage] = useState<"ready_modal" | "countdown" | "in_quiz" | "completed">("ready_modal");
  const [countdownValue, setCountdownValue] = useState(3);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<Record<number, { isCorrect: boolean; selected: number }>>({});

  // Neon Glow Vignette Flash State
  const [neonGlow, setNeonGlow] = useState<"correct" | "wrong" | null>(null);

  const currentQuestion = questionsList[currentIndex] || DEFAULT_QUIZ_QUESTIONS[0];
  const progressPercent = Math.round(((Object.keys(answeredMap).length) / questionsList.length) * 100);

  // 3-Second Countdown Timer
  useEffect(() => {
    if (stage === "countdown") {
      setCountdownValue(3);
      playQuizSound("tick");

      const timer = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            playQuizSound("start");
            setTimeout(() => setStage("in_quiz"), 400);
            return 0;
          }
          playQuizSound("tick");
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [stage]);

  // Select Option Handler with wave effect
  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    playQuizSound("pop");
    setSelectedOption(index);
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerChecked) return;

    setIsAnswerChecked(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // Trigger Neon Glow Vignette
    if (isCorrect) {
      playQuizSound("correct");
      setCorrectCount((prev) => prev + 1);
      setNeonGlow("correct");
    } else {
      playQuizSound("wrong");
      setNeonGlow("wrong");
    }

    // Record answer
    setAnsweredMap((prev) => ({
      ...prev,
      [currentIndex]: { isCorrect, selected: selectedOption },
    }));

    // Fade out neon glow smoothly after 1.8s
    setTimeout(() => {
      setNeonGlow(null);
    }, 1800);
  };

  // Next Question Handler
  const handleNextQuestion = () => {
    playQuizSound("pop");
    setNeonGlow(null);

    if (currentIndex + 1 < questionsList.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      finishQuiz();
    }
  };

  // Jump to Question (if needed from sidebar)
  const handleJumpQuestion = (targetIdx: number) => {
    if (targetIdx === currentIndex) return;
    playQuizSound("pop");
    setNeonGlow(null);
    setCurrentIndex(targetIdx);
    if (answeredMap[targetIdx] !== undefined) {
      setSelectedOption(answeredMap[targetIdx].selected);
      setIsAnswerChecked(true);
    } else {
      setSelectedOption(null);
      setIsAnswerChecked(false);
    }
  };

  // Finish Quiz & Record Progress
  const finishQuiz = () => {
    setStage("completed");
    const finalScorePercent = Math.round((correctCount / questionsList.length) * 100);
    try {
      const studentProfile = getStudentProfile();
      const studentId = studentProfile.id || studentProfile.email || "std-1";

      ProgressService.recordQuizAttempt(
        studentId,
        {
          quizId: quizId || "quiz-active",
          quizTitle: targetQuizData.title,
          subject: targetQuizData.subject,
          score: finalScorePercent,
          maxScore: 100,
          status: finalScorePercent >= targetQuizData.passScore ? "Lulus" : "Perlu Bimbingan",
        },
        studentProfile.name,
        studentProfile.email
      );

      ProgressService.updateProgress(
        studentId,
        targetQuizData.subject,
        finalScorePercent,
        studentProfile.name,
        studentProfile.email
      );

      recordModuleCompletion(quizId || "mod-quiz-active");

      addUserNotification({
        type: "nilai",
        title: "Nilai Kuis Selesai Dikerjakan",
        message: `Kamu menyelesaikan ${targetQuizData.title} dengan nilai ${finalScorePercent}/100.`,
        linkUrl: "/profil",
      });
    } catch (err) {
      console.error("Failed to record quiz progress", err);
    }
  };

  // Restart Quiz
  const handleRestartQuiz = () => {
    playQuizSound("pop");
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCorrectCount(0);
    setAnsweredMap({});
    setNeonGlow(null);
    setStage("countdown");
  };

  // 1. PRE-QUIZ READY MODAL (Before Start)
  if (stage === "ready_modal") {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 font-sans">
        <div className="bg-white rounded-[20px] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#ECECEC] animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto border border-blue-100">
              <FileQuestion className="w-7 h-7 text-[#2563EB]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-2">
                {targetQuizData.subject}
              </span>
              <h2 className="text-xl font-bold text-[#2E2D2D] tracking-tight">
                {targetQuizData.title}
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-slate-50 border border-[#ECECEC] space-y-2.5 text-xs text-[#2E2D2D]">
            <div className="flex items-center justify-between">
              <span className="text-[#737373] flex items-center gap-1.5 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" /> Total Pertanyaan
              </span>
              <span className="font-bold">{questionsList.length} Soal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#737373] flex items-center gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-emerald-600" /> Standar KKM
              </span>
              <span className="font-bold text-emerald-700">{targetQuizData.passScore}%</span>
            </div>
          </div>

          <p className="text-xs text-[#737373] text-center leading-relaxed">
            Pastikan Anda telah mempelajari materi terkait. Klik tombol <strong>&quot;Mulai Mengerjakan&quot;</strong> saat sudah siap.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/materi")}
              className="w-1/2 py-2.5 px-4 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] font-semibold text-xs transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={() => setStage("countdown")}
              className="w-1/2 py-2.5 px-4 rounded-[10px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-98"
            >
              Mulai Mengerjakan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. 3-SECOND COUNTDOWN OVERLAY
  if (stage === "countdown") {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center font-sans">
        <div className="text-center space-y-4 animate-in zoom-in-75 duration-300">
          <p className="text-sm font-bold text-[#737373] uppercase tracking-widest">Kuis Dimulai Dalam</p>
          <div className="w-28 h-28 rounded-full bg-blue-50 border-4 border-[#2563EB] flex items-center justify-center mx-auto shadow-xl shadow-blue-500/10">
            <span className="text-5xl font-black text-[#2563EB] animate-pulse">
              {countdownValue > 0 ? countdownValue : "Mulai!"}
            </span>
          </div>
          <p className="text-xs font-semibold text-[#2E2D2D]">{targetQuizData.title}</p>
        </div>
      </div>
    );
  }

  // 3. RESULT COMPLETION SCREEN
  if (stage === "completed") {
    const accuracy = Math.round((correctCount / questionsList.length) * 100);
    const isPassed = accuracy >= targetQuizData.passScore;

    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-xl mx-auto my-auto font-sans">
        <div className="w-full bg-white rounded-[20px] border border-[#ECECEC] p-8 sm:p-10 shadow-xs text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto border border-blue-100">
            <Sparkles className="w-8 h-8 text-[#2563EB]" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
              {targetQuizData.subject}
            </span>
            <h2 className="text-2xl font-bold text-[#2E2D2D] tracking-tight">
              {targetQuizData.title}
            </h2>
            <p className="text-xs text-[#737373]">
              Evaluasi kuis telah selesai. Hasil jawaban Anda telah tersimpan secara otomatis.
            </p>
          </div>

          {/* Clean Score Card */}
          <div className="p-5 rounded-[14px] bg-slate-50 border border-[#ECECEC] flex items-center justify-around">
            <div>
              <p className="text-2xl font-extrabold text-[#2E2D2D]">{accuracy}%</p>
              <p className="text-xs font-semibold text-[#737373] mt-0.5">Nilai Akhir</p>
            </div>
            <div className="w-[1px] h-10 bg-[#ECECEC]" />
            <div>
              <p className="text-2xl font-extrabold text-[#2E2D2D]">
                {correctCount}/{questionsList.length}
              </p>
              <p className="text-xs font-semibold text-[#737373] mt-0.5">Jawaban Benar</p>
            </div>
            <div className="w-[1px] h-10 bg-[#ECECEC]" />
            <div>
              <span
                className={`inline-block text-xs font-bold px-2.5 py-1 rounded-[6px] ${
                  isPassed
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isPassed ? "Tuntas KKM" : "Perlu Remedial"}
              </span>
              <p className="text-[11px] text-[#737373] mt-0.5">KKM {targetQuizData.passScore}%</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:flex-1 py-3 px-4 rounded-[12px] bg-white border border-[#ECECEC] hover:bg-slate-50 text-[#2E2D2D] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis</span>
            </button>

            <Link href="/materi" className="w-full sm:flex-1">
              <button className="w-full py-3 px-4 rounded-[12px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs">
                <span>Kembali ke Pembelajaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 4. ACTIVE QUIZ STAGE (TWO-COLUMN WITH LEFT SIDEBAR + NEON GLOW VIGNETTE)
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex font-sans text-[#2E2D2D] relative selection:bg-blue-100">
      {/* FULLSCREEN NEON EDGE GLOW VIGNETTE */}
      {neonGlow && (
        <div
          className={`pointer-events-none fixed inset-0 z-40 transition-opacity duration-300 ${
            neonGlow === "correct"
              ? "opacity-100 shadow-[inset_0_0_80px_rgba(16,185,129,0.3)] ring-8 ring-inset ring-emerald-500/40"
              : "opacity-100 shadow-[inset_0_0_80px_rgba(244,63,94,0.3)] ring-8 ring-inset ring-rose-500/40"
          }`}
        />
      )}

      {/* LEFT SIDEBAR (Desktop Fixed, Mobile Responsive) */}
      <aside className="w-72 sm:w-80 bg-white border-r border-[#ECECEC] p-6 flex flex-col justify-between hidden md:flex shrink-0 h-screen sticky top-0 z-30">
        <div className="space-y-6">
          {/* Back Button with Standard Main Website Style */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowExitConfirmModal(true)}
              className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#2E2D2D] hover:text-[#2563EB] hover:bg-slate-50 shadow-2xs transition-all cursor-pointer flex items-center justify-center"
              aria-label="Kembali"
              title="Keluar Kuis"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-[6px] border border-blue-100">
              {targetQuizData.subject}
            </span>
          </div>

          {/* Quiz Metadata */}
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#2E2D2D] leading-snug">
              {targetQuizData.title}
            </h3>
            <p className="text-[11px] text-[#737373]">
              Pilih jawaban dan tekan tombol Periksa.
            </p>
          </div>

          {/* Questions Grid Navigator */}
          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-bold text-[#737373] block uppercase tracking-wider">
              Daftar Soal
            </span>
            <div className="grid grid-cols-4 gap-2">
              {questionsList.map((_, qIdx) => {
                const isCurrent = qIdx === currentIndex;
                const record = answeredMap[qIdx];
                const isAnswered = record !== undefined;

                return (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => handleJumpQuestion(qIdx)}
                    className={`h-9 rounded-[8px] text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? "bg-[#2563EB] text-white shadow-xs scale-105"
                        : isAnswered
                        ? record.isCorrect
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-slate-50 text-[#737373] border border-[#ECECEC] hover:bg-slate-100"
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar in Sidebar */}
        <div className="pt-4 border-t border-[#ECECEC] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#737373]">Progres</span>
            <span className="text-[#2563EB]">
              {Object.keys(answeredMap).length}/{questionsList.length} Soal
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CANVAS AREA */}
      <main className="flex-1 flex flex-col justify-between min-h-screen pb-24 p-6 sm:p-12 max-w-3xl">
        {/* Mobile Top Header (with Back button) */}
        <div className="flex md:hidden items-center justify-between pb-6 border-b border-[#ECECEC] mb-6">
          <button
            type="button"
            onClick={() => setShowExitConfirmModal(true)}
            className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#2E2D2D] hover:text-[#2563EB] hover:bg-slate-50 shadow-2xs transition-all cursor-pointer flex items-center justify-center"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-right">
            <span className="text-xs font-bold text-[#2563EB]">
              Soal {currentIndex + 1} dari {questionsList.length}
            </span>
          </div>
        </div>

        {/* Question Area (Prominent Text, Left-Aligned) */}
        <div className="space-y-6 text-left my-auto">
          {/* Question Text as the biggest text replacing headline */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1E293B] leading-snug tracking-tight">
              {currentQuestion.text}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">
              Pilih 1 jawaban yang tepat:
            </p>
          </div>

          {/* Options List (Vertical Stack with Ripple / Wave Effect) */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((optionText, index) => {
              const isSelected = selectedOption === index;
              const isCorrectOption = index === currentQuestion.correctAnswer;
              const isSelectedWrong = isAnswerChecked && isSelected && !isCorrectOption;
              const isSelectedCorrect = isAnswerChecked && isSelected && isCorrectOption;
              const isRevealedCorrect = isAnswerChecked && isCorrectOption;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isAnswerChecked}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full p-4 sm:p-4.5 rounded-[16px] border text-left flex items-center gap-4 transition-all duration-200 relative overflow-hidden cursor-pointer ${
                    !isAnswerChecked
                      ? isSelected
                        ? "bg-[#EEF2FF] border-[#2563EB] shadow-xs ring-1 ring-[#2563EB]/20"
                        : "bg-white border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50/70"
                    : isSelectedCorrect
                    ? "bg-emerald-50/95 border-emerald-500 text-emerald-950"
                    : isSelectedWrong
                    ? "bg-rose-50/95 border-rose-500 text-rose-950"
                    : isRevealedCorrect
                    ? "bg-emerald-50/60 border-emerald-400 text-emerald-900"
                    : "bg-white border-[#E2E8F0] opacity-50 cursor-default"
                  }`}
                >
                  {/* Subtle selection wave highlight */}
                  {isSelected && !isAnswerChecked && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 pointer-events-none animate-in fade-in duration-150" />
                  )}

                  {/* Radio Bullet Indicator */}
                  <div className="shrink-0 relative z-10">
                    {!isAnswerChecked ? (
                      isSelected ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center bg-white">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#CBD5E1] bg-white" />
                      )
                    ) : isSelectedCorrect || isRevealedCorrect ? (
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-600 bg-emerald-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    ) : isSelectedWrong ? (
                      <div className="w-5 h-5 rounded-full border-2 border-rose-600 bg-rose-600 flex items-center justify-center">
                        <X className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#CBD5E1] bg-white opacity-60" />
                    )}
                  </div>

                  {/* Option Text */}
                  <span
                    className={`text-xs sm:text-sm leading-relaxed flex-1 relative z-10 ${
                      !isAnswerChecked
                        ? isSelected
                          ? "text-[#1E293B] font-semibold"
                          : "text-[#334155] font-medium"
                        : isSelectedCorrect || isRevealedCorrect
                        ? "text-emerald-950 font-semibold"
                        : isSelectedWrong
                        ? "text-rose-950 font-semibold"
                        : "text-[#64748B] font-medium"
                    }`}
                  >
                    {optionText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation Card (Smooth inside fade-in without bouncing) */}
          {isAnswerChecked && (
            <div
              className={`p-4 rounded-[14px] border text-xs leading-relaxed animate-in fade-in duration-200 mt-5 ${
                selectedOption === currentQuestion.correctAnswer
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {selectedOption === currentQuestion.correctAnswer ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Jawaban Tepat!</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-rose-600" />
                    <span>Jawaban Belum Tepat</span>
                  </>
                )}
              </div>
              <p className="text-slate-700">
                <strong className="font-bold">Pembahasan:</strong> {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM FIXED ACTION BAR (Right Side Control) */}
        <div className="fixed bottom-0 right-0 left-0 md:left-72 lg:left-80 bg-white/95 backdrop-blur-md border-t border-[#ECECEC] py-3.5 px-6 sm:px-12 z-30 flex items-center justify-between">
          <span className="text-xs font-bold text-[#737373]">
            Soal {currentIndex + 1} dari {questionsList.length}
          </span>

          <div className="flex items-center gap-3">
            {!isAnswerChecked ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleCheckAnswer}
                className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
              >
                Periksa
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>{currentIndex + 1 < questionsList.length ? "Lanjut" : "Lihat Hasil"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* CONFIRMATION MODAL KELUAR KUIS */}
      {showExitConfirmModal && (
        <div
          onClick={() => setShowExitConfirmModal(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#ECECEC] animate-in zoom-in-95 duration-200 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#2E2D2D]">Keluar dari Kuis?</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Apakah Anda yakin ingin keluar? Progres pengerjaan saat ini tidak akan tersimpan.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="w-1/2 py-2.5 px-3 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] font-semibold text-xs transition-colors cursor-pointer"
              >
                Lanjutkan Kuis
              </button>
              <button
                type="button"
                onClick={() => router.push("/materi")}
                className="w-1/2 py-2.5 px-3 rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
