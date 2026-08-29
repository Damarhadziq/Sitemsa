"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { ProgressService } from "@/services/progress.service";
import { addUserNotification } from "@/services/notification.service";
import { recordModuleCompletion } from "@/services/weekly-target.service";
import { getStudentProfile } from "@/services/student-profile.service";

// Clean Web Audio API SFX
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
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "tick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } else if (type === "start") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === "correct") {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.18, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.18);
      });
    } else if (type === "wrong") {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.16);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch {
    // Audio fallback
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
      "Tegangan permukaan (surface tension) dan gaya kohesi antar molekul air menciptakan kapasitas kalor yang tinggi serta meniskus cembung pada kondisi spesifik.",
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
      "Kompleksitas waktu terbaik Quick Sort adalah O(N log N) ketika pivot membagi data menjadi dua bagian yang seimbang.",
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
          moduleId: quizId,
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
            moduleId: byModule.id,
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
      moduleId: "1",
      questions: DEFAULT_QUIZ_QUESTIONS,
    };
  }, [quizId, quizzes, modules]);

  const questionsList = targetQuizData.questions;

  // Stages: 'countdown' -> 'in_quiz' -> 'completed'
  const [stage, setStage] = useState<"countdown" | "in_quiz" | "completed">("countdown");
  const [countdownValue, setCountdownValue] = useState(3);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<Record<number, { isCorrect: boolean; selected: number }>>({});

  // Diffuse Neon Glow Layer State with smooth in/out
  const [neonGlow, setNeonGlow] = useState<"correct" | "wrong" | null>(null);

  const currentQuestion = questionsList[currentIndex] || DEFAULT_QUIZ_QUESTIONS[0];
  const answeredCount = Object.keys(answeredMap).length;
  const progressPercent = Math.round((answeredCount / questionsList.length) * 100);

  // 3-Second Smooth Countdown Timer
  useEffect(() => {
    if (stage === "countdown") {
      setCountdownValue(3);
      playQuizSound("tick");

      const timer = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            playQuizSound("start");
            setTimeout(() => setStage("in_quiz"), 450);
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
    if (isAnswerChecked || answeredMap[currentIndex] !== undefined) return;
    playQuizSound("pop");
    setSelectedOption(index);
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerChecked || answeredMap[currentIndex] !== undefined) return;

    setIsAnswerChecked(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // Trigger Diffuse Layered Neon Glow
    if (isCorrect) {
      playQuizSound("correct");
      setCorrectCount((prev) => prev + 1);
      setNeonGlow("correct");
    } else {
      playQuizSound("wrong");
      setNeonGlow("wrong");
    }

    // Record answer permanently
    setAnsweredMap((prev) => ({
      ...prev,
      [currentIndex]: { isCorrect, selected: selectedOption },
    }));

    // Fade out neon glow smoothly
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

  // Jump Question in Sidebar (Only allowed to jump forward if unanswered, cannot re-edit answered)
  const handleJumpQuestion = (targetIdx: number) => {
    if (targetIdx === currentIndex) return;
    // If the target is already answered, show it in read-only mode
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

  // Exit Handler back to material
  const handleExitQuiz = () => {
    const returnPath = `/materi/${targetQuizData.moduleId || "1"}`;
    router.push(returnPath);
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

  // 1. 3-SECOND SMOOTH COUNTDOWN OVERLAY
  if (stage === "countdown") {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center font-sans">
        <div className="text-center space-y-4 animate-in zoom-in-90 duration-300">
          <p className="text-xs font-semibold text-[#737373] tracking-wide">
            Kuis dimulai dalam
          </p>
          <div className="w-24 h-24 rounded-full bg-blue-50 border-3 border-[#2563EB] flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
            <span className="text-4xl font-extrabold text-[#2563EB] animate-pulse">
              {countdownValue > 0 ? countdownValue : "Mulai!"}
            </span>
          </div>
          <p className="text-xs font-bold text-[#2E2D2D] max-w-xs mx-auto truncate px-4">
            {targetQuizData.title}
          </p>
        </div>
      </div>
    );
  }

  // 2. RESULT COMPLETION SCREEN
  if (stage === "completed") {
    const accuracy = Math.round((correctCount / questionsList.length) * 100);
    const isPassed = accuracy >= targetQuizData.passScore;

    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-xl mx-auto my-auto font-sans bg-white">
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

            <Link href={`/materi/${targetQuizData.moduleId || "1"}`} className="w-full sm:flex-1">
              <button className="w-full py-3 px-4 rounded-[12px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs">
                <span>Kembali ke Materi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. ACTIVE QUIZ STAGE (WHITE CANVAS, FIXED TOP MARGIN, VERTICAL SIDEBAR LIST, RIGHT EXPLANATION)
  return (
    <div className="min-h-screen bg-white flex font-sans text-[#2E2D2D] relative selection:bg-blue-100">
      {/* HIGH-DIFFUSE NEON GLOW LAYER (Smooth In/Out with High Blur Spread) */}
      <div
        className={`pointer-events-none fixed inset-0 z-40 transition-all duration-700 ease-in-out ${
          neonGlow === "correct"
            ? "opacity-100 shadow-[inset_0_0_120px_35px_rgba(16,185,129,0.32)] backdrop-blur-[1px]"
            : neonGlow === "wrong"
            ? "opacity-100 shadow-[inset_0_0_120px_35px_rgba(239,68,68,0.32)] backdrop-blur-[1px]"
            : "opacity-0 shadow-none pointer-events-none"
        }`}
      />

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

          {/* Quiz Title (Bigger Text, No Subtitle/Helper) */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#2E2D2D] leading-tight tracking-tight">
              {targetQuizData.title}
            </h2>
          </div>

          {/* Vertical Question List (Display Question Text with Ellipsis) */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-[#737373] block">
              Daftar soal
            </span>
            <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {questionsList.map((q, qIdx) => {
                const isCurrent = qIdx === currentIndex;
                const record = answeredMap[qIdx];
                const isAnswered = record !== undefined;

                return (
                  <button
                    key={qIdx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleJumpQuestion(qIdx)}
                    className={`w-full text-left p-3 rounded-[10px] text-xs transition-all flex items-center gap-2.5 ${
                      isCurrent
                        ? "bg-blue-50 text-[#2563EB] border border-blue-200 font-bold shadow-2xs cursor-default"
                        : isAnswered
                        ? "bg-[#2563EB] text-white border border-[#2563EB] font-semibold cursor-not-allowed opacity-95"
                        : "bg-white text-[#737373] border border-[#ECECEC] hover:bg-slate-50 font-medium cursor-pointer"
                    }`}
                  >
                    <span className="font-bold shrink-0">{qIdx + 1}.</span>
                    <span className="truncate flex-1">{q.text}</span>
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
              {answeredCount}/{questionsList.length} Soal
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

      {/* RIGHT MAIN CANVAS AREA (Pure White, Top Margin) */}
      <main className="flex-1 flex flex-col justify-between min-h-screen bg-white pt-10 sm:pt-14 pb-28 px-6 sm:px-12">
        {/* Mobile Top Header (with Back button) */}
        <div className="flex md:hidden items-center justify-between pb-4 border-b border-[#ECECEC] mb-6">
          <button
            type="button"
            onClick={() => setShowExitConfirmModal(true)}
            className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#2E2D2D] hover:text-[#2563EB] hover:bg-slate-50 shadow-2xs transition-all cursor-pointer flex items-center justify-center"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-[#2563EB]">
            Soal {currentIndex + 1} dari {questionsList.length}
          </span>
        </div>

        {/* Main Content Row: Question & Options on Left, Explanation on Desktop Right */}
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start">
          {/* Question & Options Column */}
          <div className="flex-1 w-full space-y-6 text-left">
            {/* Question Text as the biggest text replacing headline */}
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] leading-snug tracking-tight">
                {currentQuestion.text}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                Pilih 1 jawaban yang tepat:
              </p>
            </div>

            {/* Options List (Seamless Cards with Solid Primary Background on Submit) */}
            <div className="space-y-3 pt-1">
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
                    disabled={isAnswerChecked || answeredMap[currentIndex] !== undefined}
                    onClick={() => handleSelectOption(index)}
                    className={`w-full p-4 sm:p-4.5 rounded-[16px] text-left flex items-center gap-4 transition-all duration-200 relative overflow-hidden cursor-pointer ${
                      !isAnswerChecked
                        ? isSelected
                          ? "bg-[#EEF2FF] shadow-xs ring-2 ring-[#2563EB]"
                          : "bg-slate-50/80 hover:bg-slate-100/90 text-[#334155]"
                        : isSelectedCorrect || isRevealedCorrect
                        ? "bg-[#10B981] text-white shadow-sm font-semibold"
                        : isSelectedWrong
                        ? "bg-[#EF4444] text-white shadow-sm font-semibold"
                        : "bg-slate-50 text-[#94A3B8] opacity-50 cursor-default"
                    }`}
                  >
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
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                        </div>
                      ) : isSelectedWrong ? (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
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
                          : isSelectedCorrect || isRevealedCorrect || isSelectedWrong
                          ? "text-white"
                          : "text-[#94A3B8]"
                      }`}
                    >
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Explanation (Shown beneath on small screens) */}
            {isAnswerChecked && (
              <div className="lg:hidden p-4 rounded-[14px] bg-slate-50 border border-[#ECECEC] text-xs leading-relaxed animate-in fade-in duration-200 mt-4 space-y-1">
                <span className="font-bold text-[#2E2D2D] block">Pembahasan:</span>
                <p className="text-[#475569]">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* DESKTOP RIGHT EXPLANATION PANEL (Clean, No Icon) */}
          {isAnswerChecked && (
            <div className="hidden lg:block w-80 shrink-0 p-5 rounded-[16px] bg-slate-50 border border-[#ECECEC] text-xs leading-relaxed animate-in fade-in slide-in-from-right-3 duration-300 space-y-2 sticky top-14">
              <span className="font-bold text-sm text-[#2E2D2D] block">Pembahasan:</span>
              <p className="text-[#475569] leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM FIXED ACTION BAR (Right-aligned action button only, no redundant counter text) */}
        <div className="fixed bottom-0 right-0 left-0 md:left-72 lg:left-80 bg-white/95 backdrop-blur-md border-t border-[#ECECEC] py-3.5 px-6 sm:px-12 z-30 flex items-center justify-end">
          <div className="flex items-center gap-3">
            {!isAnswerChecked ? (
              <button
                type="button"
                disabled={selectedOption === null || answeredMap[currentIndex] !== undefined}
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

      {/* CONFIRMATION MODAL KELUAR KUIS (STANDARD MODAL DESIGN SYSTEM) */}
      {showExitConfirmModal && (
        <div
          onClick={() => setShowExitConfirmModal(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[12px] max-w-sm w-full border border-[#ECECEC] overflow-hidden shadow-xl animate-in zoom-in-95 duration-200"
          >
            {/* Headline Only Header with Close X button */}
            <div className="p-5 pb-4 bg-white flex items-center justify-between border-b border-[#ECECEC]">
              <h3 className="text-base font-bold text-[#2E2D2D]">Keluar dari kuis</h3>
              <button
                onClick={() => setShowExitConfirmModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-[#737373] leading-relaxed">
                Apakah Anda yakin ingin keluar dari kuis? Progres pengerjaan saat ini tidak akan tersimpan.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#ECECEC]">
                <button
                  type="button"
                  onClick={() => setShowExitConfirmModal(false)}
                  className="px-4 py-2 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExitQuiz}
                  className="px-5 py-2 rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Ya, keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
