"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  X,
  Check,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  MessageSquare,
  PenLine,
  ChevronLeft,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { ProgressService } from "@/services/progress.service";
import { addUserNotification } from "@/services/notification.service";
import { recordModuleCompletion } from "@/services/weekly-target.service";
import { getStudentProfile } from "@/services/student-profile.service";

// Clean Web Audio API SFX (Subtle & Non-intrusive)
function playQuizSound(type: "pop" | "correct" | "wrong") {
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
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === "correct") {
      const now = ctx.currentTime;
      [523.25, 659.25].forEach((freq, i) => {
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
      osc.frequency.linearRampToValueAtTime(190, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {
    // Audio context fallback
  }
}

// Default Mock Questions fallback
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
      "Tegangan permukaan (surface tension) dan gaya kohesi antar molekul air menciptakan bentuk kurva meniskus cembung pada kondisi tertentu dengan kapasitas kalor tinggi.",
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
      "Queue beroperasi menggunakan prinsip First In First Out (FIFO) di mana elemen yang masuk pertama kali akan diproses pertama kali.",
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
                  explanation: q.explanation || "Pembahasan kuis materi Sitemsa.",
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
              explanation: q.explanation || "Pembahasan kuis materi Sitemsa.",
            })),
          };
        }
      }
    }

    return {
      title: "Evaporative Cooling Quiz",
      subject: "Informatika",
      passScore: 75,
      questions: DEFAULT_QUIZ_QUESTIONS,
    };
  }, [quizId, quizzes, modules]);

  const questionsList = targetQuizData.questions;

  // Quiz Interaction State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questionsList[currentIndex] || DEFAULT_QUIZ_QUESTIONS[0];
  const progressPercent = Math.round(((currentIndex + 1) / questionsList.length) * 100);

  // Select Option (Radio click before check)
  const handleSelectRadio = (index: number) => {
    if (isAnswerChecked) return;
    playQuizSound("pop");
    setSelectedOption(index);
  };

  // Check Answer Handler (Periksa)
  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerChecked) return;

    setIsAnswerChecked(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      playQuizSound("correct");
      setCorrectCount((prev) => prev + 1);
    } else {
      playQuizSound("wrong");
    }
  };

  // Skip Question Handler (Lewati)
  const handleSkipQuestion = () => {
    playQuizSound("pop");
    if (currentIndex + 1 < questionsList.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      finishQuiz();
    }
  };

  // Next Question Handler (Lanjut)
  const handleNextQuestion = () => {
    playQuizSound("pop");
    if (currentIndex + 1 < questionsList.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      finishQuiz();
    }
  };

  // Complete Quiz & Sync Record
  const finishQuiz = () => {
    setIsCompleted(true);
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

      // Notify Student
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
    setIsCompleted(false);
  };

  // RESULT COMPLETION SCREEN
  if (isCompleted) {
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
                <span>Kembali ke Materi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ACTIVE QUESTION SCREEN (MATCHING USER MOCKUP EXACTLY)
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans text-[#2E2D2D] relative pb-28">
      {/* Top Navbar / Exit Bar */}
      <div className="max-w-4xl w-full mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/materi">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-slate-50 hover:bg-slate-100 text-[#737373] hover:text-[#2E2D2D] text-xs font-semibold border border-[#ECECEC] transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </Link>
      </div>

      {/* Main Content Column */}
      <main className="max-w-2xl w-full mx-auto px-6 pt-2 pb-8 flex-1 flex flex-col justify-center">
        {/* Top Badges (Google Classroom / Microsoft Teams Style from mockup) */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]">
            {targetQuizData.subject}
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            Kuis Sitemsa
          </span>
        </div>

        {/* Big Centered Quiz Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] text-center tracking-tight mb-8">
          {targetQuizData.title}
        </h1>

        {/* Question Header & Subtitle */}
        <div className="space-y-1.5 mb-6 text-left">
          <h2 className="text-base sm:text-lg font-bold text-[#1E293B] leading-snug">
            {currentQuestion.text}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium">
            Choose only 1 answer:
          </p>
        </div>

        {/* Options List (Vertical Stack of Pill Cards matching Mockup) */}
        <div className="space-y-3">
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
                onClick={() => handleSelectRadio(index)}
                className={`w-full p-4 sm:p-4.5 rounded-[16px] border text-left flex items-center gap-4 transition-all duration-150 cursor-pointer ${
                  !isAnswerChecked
                    ? isSelected
                      ? "bg-[#EEF2FF] border-[#6366F1] shadow-xs"
                      : "bg-white border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50/60"
                    : isSelectedCorrect
                    ? "bg-emerald-50/90 border-emerald-500 text-emerald-950"
                    : isSelectedWrong
                    ? "bg-rose-50/90 border-rose-500 text-rose-950"
                    : isRevealedCorrect
                    ? "bg-emerald-50/60 border-emerald-400 text-emerald-900"
                    : "bg-white border-[#E2E8F0] opacity-50 cursor-default"
                }`}
              >
                {/* Radio Bullet Indicator */}
                <div className="shrink-0">
                  {!isAnswerChecked ? (
                    isSelected ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#6366F1] flex items-center justify-center bg-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
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
                  className={`text-xs sm:text-sm font-medium leading-relaxed flex-1 ${
                    !isAnswerChecked
                      ? isSelected
                        ? "text-[#1E293B] font-semibold"
                        : "text-[#334155]"
                      : isSelectedCorrect || isRevealedCorrect
                      ? "text-emerald-950 font-semibold"
                      : isSelectedWrong
                      ? "text-rose-950 font-semibold"
                      : "text-[#64748B]"
                  }`}
                >
                  {optionText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation Card (Clean inside fade-in without bouncing) */}
        {isAnswerChecked && (
          <div
            className={`mt-5 p-4 rounded-[14px] border text-xs leading-relaxed animate-in fade-in duration-200 ${
              selectedOption === currentQuestion.correctAnswer
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1 text-xs">
              {selectedOption === currentQuestion.correctAnswer ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Jawaban Tepat!</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Jawaban Kurang Tepat</span>
                </>
              )}
            </div>
            <p className="text-slate-700">
              <strong className="font-bold">Pembahasan:</strong> {currentQuestion.explanation}
            </p>
          </div>
        )}
      </main>

      {/* Floating Side Helper Icons (Matching Right Side in User Mockup) */}
      <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20 hidden md:flex">
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-[#1E293B] text-white flex items-center justify-center shadow-md hover:bg-slate-700 transition-colors cursor-pointer"
          title="Bantuan Kuis"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-[#1E293B] text-white flex items-center justify-center shadow-md hover:bg-slate-700 transition-colors cursor-pointer"
          title="Kirim Masukan"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Sticky Action Bar (Matching Bottom in User Mockup) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#ECECEC] py-3.5 px-6 sm:px-12 z-30 flex items-center justify-between">
        {/* Left: Utility Note/Pencil Icon Button */}
        <button
          type="button"
          className="w-10 h-10 rounded-full border border-[#E2E8F0] hover:bg-slate-50 text-[#64748B] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="Catatan"
        >
          <PenLine className="w-4 h-4" />
        </button>

        {/* Center: Progress Bar & Counter (e.g. 3/5) */}
        <div className="flex items-center gap-3">
          <div className="w-28 sm:w-56 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
            <div
              className="h-full bg-[#4F46E5] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#64748B]">
            {currentIndex + 1}/{questionsList.length}
          </span>
        </div>

        {/* Right: Skip & Action Button (Check / Next) */}
        <div className="flex items-center gap-3">
          {!isAnswerChecked ? (
            <>
              <button
                type="button"
                onClick={handleSkipQuestion}
                className="text-xs font-bold text-[#64748B] hover:text-[#1E293B] px-3 py-2 cursor-pointer transition-colors"
              >
                Skip
              </button>
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleCheckAnswer}
                className="px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
              >
                Check
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>{currentIndex + 1 < questionsList.length ? "Next" : "Finish"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
