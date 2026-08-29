"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  X,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { ProgressService } from "@/services/progress.service";
import { addUserNotification } from "@/services/notification.service";
import { recordModuleCompletion } from "@/services/weekly-target.service";
import { getStudentProfile } from "@/services/student-profile.service";

// Audio player helper using user's MP3 assets with synthesis fallback
function playSoundEffect(type: "correct" | "wrong" | "result") {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio(`/audio/${type}.mp3`);
    audio.volume = type === "result" ? 0.7 : 0.55;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback Web Audio synth
        playSynthFallback(type);
      });
    }
  } catch {
    playSynthFallback(type);
  }
}

function playSynthFallback(type: "correct" | "wrong" | "result") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "correct") {
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
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "result") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    }
  } catch {}
}

// Custom SVG Icons
function CorrectCheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0">
      <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" fill="white" stroke="#10B981" strokeWidth="1.5" />
      <path d="M8 12.5L10.5 15L16 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WrongCancelIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0">
      <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" fill="white" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Default Sample Questions fallback
const DEFAULT_QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "Why does liquid water have such a high heat capacity?",
    options: [
      "The curved surface is a convex meniscus formed because of surface tension.",
      "The curved surface is a concave meniscus formed because of surface tension.",
      "The curved surface is a convex meniscus formed because of capillary action.",
      "The curved surface is a concave meniscus formed because of capillary action.",
    ],
    correctAnswer: 0,
    explanation:
      "Tegangan permukaan (surface tension) dan ikatan hidrogen yang kuat antar molekul air menciptakan kapasitas kalor yang tinggi serta meniskus cembung.",
  },
  {
    id: "q2",
    text: "Manakah struktur data berikut yang menerapkan prinsip First In First Out (FIFO)?",
    options: [
      "Stack (Tumpukan)",
      "Queue (Antrean)",
      "Binary Search Tree",
      "Graph Berbobot",
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
  const [isMuted, setIsMuted] = useState(false);

  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<Record<number, { isCorrect: boolean; selected: number }>>({});

  // Background Looping Music Ref
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = questionsList[currentIndex] || DEFAULT_QUIZ_QUESTIONS[0];

  // 3-Second Smooth Countdown Timer
  useEffect(() => {
    if (stage === "countdown") {
      setCountdownValue(3);

      const timer = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(() => setStage("in_quiz"), 400);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [stage]);

  // Background Music Controller
  useEffect(() => {
    if (stage === "in_quiz" && !isMuted) {
      try {
        if (!bgmAudioRef.current) {
          bgmAudioRef.current = new Audio("/audio/bgm.mp3");
          bgmAudioRef.current.loop = true;
          bgmAudioRef.current.volume = 0.22;
        }
        bgmAudioRef.current.play().catch(() => {});
      } catch {}
    } else {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
    }

    return () => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
    };
  }, [stage, isMuted]);

  // Direct Click Answer Handler (Click = Immediate Evaluation)
  const handleSelectOptionDirect = (index: number) => {
    if (isAnswerChecked || answeredMap[currentIndex] !== undefined) return;

    setSelectedOption(index);
    setIsAnswerChecked(true);
    const isCorrect = index === currentQuestion.correctAnswer;

    if (isCorrect) {
      playSoundEffect("correct");
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + 100);
    } else {
      playSoundEffect("wrong");
    }

    // Record answer permanently
    setAnsweredMap((prev) => ({
      ...prev,
      [currentIndex]: { isCorrect, selected: index },
    }));
  };

  // Next Question Handler
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionsList.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      finishQuiz();
    }
  };

  // Exit Handler back to material
  const handleExitQuiz = () => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
    }
    const returnPath = `/materi/${targetQuizData.moduleId || "1"}`;
    router.push(returnPath);
  };

  // Finish Quiz & Record Progress
  const finishQuiz = () => {
    setStage("completed");
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
    }
    playSoundEffect("result");

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
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCorrectCount(0);
    setScore(0);
    setAnsweredMap({});
    setStage("countdown");
  };

  // 1. 3-SECOND SMOOTH COUNTDOWN OVERLAY
  if (stage === "countdown") {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center font-sans overflow-hidden">
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

  // 2. RESULT COMPLETION SCREEN (ANIMATED BACKGROUND SVG & CONDITIONAL LOTTIE)
  if (stage === "completed") {
    const accuracy = Math.round((correctCount / questionsList.length) * 100);
    const isPassed = accuracy >= targetQuizData.passScore;

    return (
      <main className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center font-sans bg-[#C3DFFB] z-50">
        {/* Animated Background Buildings */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-next/no-img-element */}
          <img
            src="/bg-quiz-hasil.svg"
            alt="Background Hasil Kuis"
            className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-1000 ease-out"
          />
        </div>

        {/* Result Card (py-4, enlarged Lottie, contextual message) */}
        <div className="w-full max-w-lg bg-white rounded-[20px] border border-[#ECECEC] py-4 px-8 sm:px-10 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-500 z-10 relative mx-4">
          {/* Conditional Lottie Animation Embed (Enlarged) */}
          <div className="w-44 h-44 sm:w-52 sm:h-52 mx-auto relative flex items-center justify-center overflow-hidden">
            {isPassed ? (
              <iframe
                src="https://lottie.host/embed/67d35880-5f9d-4309-bee5-04db1bb3f075/b7nNeNfkhM.lottie"
                className="w-full h-full border-0 pointer-events-none scale-110"
                title="Tuntas KKM Animation"
              />
            ) : (
              <iframe
                src="https://lottie.host/embed/79ffc9b3-6c16-4009-95af-e29cdf513684/C3AhgLCcgu.lottie"
                className="w-full h-full border-0 pointer-events-none scale-110"
                title="Remedial Animation"
              />
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100 inline-block">
              {targetQuizData.subject}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2E2D2D] tracking-tight">
              {targetQuizData.title}
            </h2>
          </div>

          {/* Clean Score Card (Plain Text Numbers & Status without Background) */}
          <div className="p-4 rounded-[14px] bg-slate-50 border border-[#ECECEC] flex items-center justify-around">
            <div>
              <p className="text-2xl font-extrabold text-[#2E2D2D]">{accuracy}%</p>
              <p className="text-xs font-semibold text-[#737373] mt-0.5">Nilai Akhir</p>
            </div>
            <div className="w-[1px] h-9 bg-[#ECECEC]" />
            <div>
              <p className="text-2xl font-extrabold text-[#2E2D2D]">
                {correctCount}/{questionsList.length}
              </p>
              <p className="text-xs font-semibold text-[#737373] mt-0.5">Jawaban Benar</p>
            </div>
            <div className="w-[1px] h-9 bg-[#ECECEC]" />
            <div>
              <p
                className={`text-2xl font-extrabold ${
                  isPassed ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {isPassed ? "Tuntas" : "Remedial"}
              </p>
              <p className="text-xs font-semibold text-[#737373] mt-0.5">
                KKM {targetQuizData.passScore}%
              </p>
            </div>
          </div>

          {/* Contextual Copy Message Based on Condition */}
          <p className="text-xs text-[#64748B] leading-relaxed max-w-md mx-auto px-2">
            {isPassed
              ? "Selamat! Kamu telah berhasil menuntaskan kuis evaluasi ini dengan sangat baik. Terus pertahankan prestasimu!"
              : "Nilaimu masih di bawah standar kelulusan KKM. Silakan pelajari kembali materi dan coba lagi untuk hasil yang lebih baik!"}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:flex-1 py-2.5 px-5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
            >
              Ulangi Kuis
            </button>

            <Link href={`/materi/${targetQuizData.moduleId || "1"}`} className="w-full sm:flex-1">
              <button className="w-full py-2.5 px-5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs">
                Kembali ke Pembelajaran
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. ACTIVE QUIZ STAGE (FULL SIZE SVG BACKGROUND, CENTERED 2X2 GRID, TOP BAR, INSTANT CLICK)
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden flex flex-col justify-between font-sans text-[#2E2D2D] relative bg-cover bg-center bg-no-repeat selection:bg-blue-100"
      style={{ backgroundImage: "url('/bg-konten-quiz.svg')" }}
    >
      {/* TOP BAR (CANCEL, SUBJECT CHIP, SCORE POINTS, QUESTION COUNTER, BGM TOGGLE) */}
      <header className="w-full max-w-5xl mx-auto px-6 sm:px-10 pt-6 flex items-center justify-between z-20">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={() => setShowExitConfirmModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-white/90 backdrop-blur-xs border border-[#ECECEC] text-[#2E2D2D] hover:text-rose-600 hover:bg-white shadow-2xs text-xs font-semibold transition-all cursor-pointer"
          title="Keluar Kuis"
        >
          <X className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>

        {/* Center: Subject Chip */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-xs text-[#2563EB] border border-[#ECECEC] shadow-2xs">
            {targetQuizData.subject}
          </span>
        </div>

        {/* Right: Score Points, Question Counter, and Music Mute Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Score Points */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#ECECEC] shadow-2xs text-xs font-bold text-[#2E2D2D]">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{score} Pts</span>
          </div>

          {/* Question Counter (No progress bar) */}
          <span className="text-xs font-bold text-[#475569] bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-[#ECECEC] shadow-2xs">
            {currentIndex + 1} / {questionsList.length}
          </span>

          {/* BGM Mute/Unmute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-[#ECECEC] shadow-2xs text-[#475569] hover:text-[#2563EB] flex items-center justify-center transition-colors cursor-pointer"
            title={isMuted ? "Aktifkan Musik" : "Matikan Musik"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* CENTER MAIN CONTENT: QUESTION TEXT & 2X2 ANSWER GRID WITH WHITE FRAMED CARDS */}
      <main className="max-w-4xl w-full mx-auto px-6 sm:px-10 py-6 flex-1 flex flex-col justify-center items-center text-center z-10">
        {/* Large Centered Question Text */}
        <div className="space-y-2 mb-8 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E293B] leading-snug tracking-tight">
            {currentQuestion.text}
          </h1>
        </div>

        {/* 2x2 Answer Grid with White Framed Cards & Click Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
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
                onClick={() => handleSelectOptionDirect(index)}
                className={`w-full min-h-[76px] p-4 sm:p-5 rounded-[16px] text-left flex items-center gap-3.5 transition-all duration-200 cursor-pointer shadow-xs ${
                  !isAnswerChecked
                    ? "bg-white/95 backdrop-blur-xs border border-[#ECECEC] hover:border-[#2563EB]/60 hover:bg-white hover:-translate-y-0.5 active:scale-98"
                    : isSelectedCorrect || isRevealedCorrect
                    ? "bg-[#10B981] text-white font-semibold border-transparent shadow-md scale-[1.01]"
                    : isSelectedWrong
                    ? "bg-[#EF4444] text-white font-semibold border-transparent shadow-md"
                    : "bg-white/70 border border-[#ECECEC] text-[#94A3B8] opacity-50 cursor-default"
                }`}
              >
                {/* Option Letter Badge or SVG Status Icon */}
                <div className="shrink-0 flex items-center justify-center">
                  {!isAnswerChecked ? (
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-[#2563EB] font-bold text-xs flex items-center justify-center border border-slate-200">
                      {String.fromCharCode(65 + index)}
                    </div>
                  ) : isSelectedCorrect || isRevealedCorrect ? (
                    <CorrectCheckIcon />
                  ) : isSelectedWrong ? (
                    <WrongCancelIcon />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center border border-slate-200 opacity-60">
                      {String.fromCharCode(65 + index)}
                    </div>
                  )}
                </div>

                {/* Option Text */}
                <span
                  className={`text-xs sm:text-sm leading-relaxed flex-1 font-medium ${
                    !isAnswerChecked
                      ? "text-[#1E293B]"
                      : isSelectedCorrect || isRevealedCorrect || isSelectedWrong
                      ? "text-white font-semibold"
                      : "text-[#94A3B8]"
                  }`}
                >
                  {optionText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation Banner (Smooth Inside Fade-in) */}
        {isAnswerChecked && (
          <div className="w-full max-w-3xl mt-5 p-4 rounded-[14px] bg-white/95 backdrop-blur-xs border border-[#ECECEC] text-left text-xs leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-xs space-y-1">
            <span className="font-bold text-[#2E2D2D] block">Pembahasan:</span>
            <p className="text-[#475569]">{currentQuestion.explanation}</p>
          </div>
        )}
      </main>

      {/* BOTTOM ACTION BAR (NEXT BUTTON APPEARS ONCE ANSWERED) */}
      <footer className="w-full max-w-5xl mx-auto px-6 sm:px-10 pb-6 pt-2 flex items-center justify-center z-20 min-h-[56px]">
        {isAnswerChecked && (
          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-8 py-3 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-200 active:scale-98"
          >
            {currentIndex + 1 < questionsList.length ? "Lanjut" : "Lihat Hasil"}
          </button>
        )}
      </footer>

      {/* CONFIRMATION MODAL KELUAR KUIS */}
      {showExitConfirmModal && (
        <div
          onClick={() => setShowExitConfirmModal(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[12px] max-w-sm w-full p-6 space-y-4 shadow-xl border border-[#ECECEC] animate-in zoom-in-95 duration-200"
          >
            {/* Header without dividing border line */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">Keluar dari kuis</h3>
              <button
                onClick={() => setShowExitConfirmModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#737373] leading-relaxed">
              Apakah Anda yakin ingin keluar dari kuis? Progres pengerjaan saat ini tidak akan tersimpan.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
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
      )}
    </div>
  );
}
