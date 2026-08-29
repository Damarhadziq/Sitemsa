"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { ProgressService } from "@/services/progress.service";
import { addUserNotification } from "@/services/notification.service";
import { recordModuleCompletion } from "@/services/weekly-target.service";
import { getStudentProfile } from "@/services/student-profile.service";

// Fallback synthesizer in case audio files fail to load
function playSynthFallback(type: "correct" | "wrong" | "result" | "remedial" | "countdown") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "countdown") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(540, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "correct") {
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
    } else if (type === "wrong" || type === "remedial") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.35);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
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

  // Preloaded Audio Cache for Instant 0ms Latency Playback
  const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const soundNames = ["correct", "wrong", "result", "remedial", "countdown"];
    soundNames.forEach((name) => {
      try {
        const audio = new Audio(`/audio/${name}.mp3`);
        audio.preload = "auto";
        audio.load();
        audioCacheRef.current[name] = audio;
      } catch {}
    });
  }, []);

  const playInstantSound = (type: "correct" | "wrong" | "result" | "remedial" | "countdown") => {
    if (typeof window === "undefined") return;
    try {
      const audio = audioCacheRef.current[type];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = type === "result" || type === "remedial" ? 0.75 : 0.65;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => playSynthFallback(type));
        }
      } else {
        const newAudio = new Audio(`/audio/${type}.mp3`);
        newAudio.play().catch(() => playSynthFallback(type));
      }
    } catch {
      playSynthFallback(type);
    }
  };

  // Find Target Quiz & Subject Metadata
  const targetQuizData = useMemo(() => {
    const cleanQuizId = quizId ? decodeURIComponent(quizId).trim() : "";

    if (cleanQuizId) {
      // 1. By Module ID first (exact material navigation)
      const byModule = modules.find(
        (m) =>
          m.id === cleanQuizId ||
          String(m.id).toLowerCase() === cleanQuizId.toLowerCase() ||
          m.id.replace(/\s+/g, "-").toLowerCase() === cleanQuizId.replace(/\s+/g, "-").toLowerCase()
      );

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

        return {
          title: `Evaluasi ${byModule.title}`,
          subject: byModule.subject,
          passScore: 75,
          moduleId: byModule.id,
          questions: DEFAULT_QUIZ_QUESTIONS,
        };
      }

      // 2. By ID or Title in quizzes
      const byQuizId = quizzes.find(
        (q) => q.id === cleanQuizId || q.title.toLowerCase().includes(cleanQuizId.toLowerCase())
      );
      if (byQuizId) {
        return {
          title: byQuizId.title,
          subject: byQuizId.subject || "Informatika",
          passScore: byQuizId.passScore || 75,
          moduleId: cleanQuizId,
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
    }

    return {
      title: "Evaluasi Pemahaman Materi",
      subject: "Informatika",
      passScore: 75,
      moduleId: cleanQuizId || "1",
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
  const [answeredMap, setAnsweredMap] = useState<Record<number, { isCorrect: boolean; selected: number }>>({});

  // Celebration Lottie on Correct Answer
  const [showCelebrationLottie, setShowCelebrationLottie] = useState(false);

  // Background Looping Music Ref
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = questionsList[currentIndex] || DEFAULT_QUIZ_QUESTIONS[0];

  // Lock body scroll during entire quiz session to eliminate right scrollbar gutter
  useEffect(() => {
    document.documentElement.classList.add("quiz-mode");
    document.body.classList.add("quiz-mode");

    return () => {
      document.documentElement.classList.remove("quiz-mode");
      document.body.classList.remove("quiz-mode");
    };
  }, []);

  // 3-Second Smooth Countdown Timer & Sound
  useEffect(() => {
    if (stage === "countdown") {
      setCountdownValue(3);
      playInstantSound("countdown");

      const timer = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(() => {
              setStage("in_quiz");
            }, 550);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [stage]);

  // Background Music Controller with increased volume
  useEffect(() => {
    if (stage === "in_quiz" && !isMuted) {
      try {
        if (!bgmAudioRef.current) {
          bgmAudioRef.current = new Audio("/audio/bgm.mp3");
          bgmAudioRef.current.loop = true;
          bgmAudioRef.current.volume = 0.48;
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
      playInstantSound("correct");
      setCorrectCount((prev) => prev + 1);
      setShowCelebrationLottie(true);
      setTimeout(() => setShowCelebrationLottie(false), 2800);
    } else {
      playInstantSound("wrong");
    }

    // Record answer permanently
    setAnsweredMap((prev) => ({
      ...prev,
      [currentIndex]: { isCorrect, selected: index },
    }));
  };

  // Next Question Handler
  const handleNextQuestion = () => {
    setShowCelebrationLottie(false);

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
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      const returnPath = `/materi/${encodeURIComponent(targetQuizData.moduleId || "1")}`;
      router.push(returnPath);
    }
  };

  // Finish Quiz & Record Progress
  const finishQuiz = () => {
    setStage("completed");
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
    }

    const finalScorePercent = Math.round((correctCount / questionsList.length) * 100);
    const isPassed = finalScorePercent >= targetQuizData.passScore;

    // Play appropriate sound based on pass / remedial condition
    if (isPassed) {
      playInstantSound("result");
    } else {
      playInstantSound("remedial");
    }

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
          status: isPassed ? "Lulus" : "Perlu Bimbingan",
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
    setAnsweredMap({});
    setShowCelebrationLottie(false);
    setStage("countdown");
  };

  // 1. RESULT COMPLETION SCREEN (ANIMATED BACKGROUND SVG & CONDITIONAL LOTTIE)
  if (stage === "completed") {
    const accuracy = Math.round((correctCount / questionsList.length) * 100);
    const isPassed = accuracy >= targetQuizData.passScore;

    return (
      <main className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center font-sans bg-[#C3DFFB] z-50">
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
        <div className="w-full max-w-lg bg-white rounded-[20px] border border-[#ECECEC] py-4 px-8 sm:px-10 shadow-2xl text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-500 z-10 relative mx-4">
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

            <Link href={`/materi/${encodeURIComponent(targetQuizData.moduleId || "1")}`} className="w-full sm:flex-1">
              <button className="w-full py-2.5 px-5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs">
                Kembali ke Pembelajaran
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2. ACTIVE QUIZ STAGE (FULL SIZE SVG BACKGROUND WITH DARK TINT, WHITE QUESTION TEXT, 60PX MARGIN)
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col justify-between font-sans text-[#2E2D2D] relative bg-[#60a5fa] selection:bg-blue-100">
      {/* QUESTION & BACKGROUND WRAPPER (BLURRED DURING COUNTDOWN, ZOOM IN ON START) */}
      <div
        className={`fixed inset-0 w-full h-full flex flex-col justify-between transition-all duration-700 ease-out z-10 ${
          stage === "countdown"
            ? "filter blur-md scale-95 opacity-75 pointer-events-none"
            : "filter-none scale-100 opacity-100"
        }`}
      >
        {/* Full-window SVG Background aligned to bottom to showcase the green hill */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
          {/* eslint-disable-next-next/no-img-element */}
          <img
            src="/bg-konten-quiz.svg"
            alt="Quiz Background"
            className="w-full h-full object-fill object-bottom pointer-events-none select-none"
          />
          {/* Dark Overlay for text contrast */}
          <div className="absolute inset-0 bg-slate-950/25 pointer-events-none" />
        </div>

        {/* CELEBRATION LOTTIE ANIMATION RISING FROM BOTTOM ON CORRECT ANSWER */}
        {showCelebrationLottie && (
          <div className="fixed inset-x-0 bottom-0 flex items-end justify-center pointer-events-none z-[100] animate-in slide-in-from-bottom-12 duration-400 fade-in">
            <div className="w-96 h-80 relative flex items-center justify-center">
              <iframe
                src="https://lottie.host/embed/522d1d2c-7fa8-443b-b605-b7a455444486/VVxd2YUFkE.lottie"
                className="w-full h-full border-0 pointer-events-none"
                title="Celebration Animation"
              />
            </div>
          </div>
        )}

        {/* TOP BAR (60PX MARGIN, MATCHING CIRCLE BACK BUTTON, ENLARGED UNIFIED CHIPS) */}
        <header className="w-full px-6 md:px-[60px] pt-6 flex items-center justify-between z-20 shrink-0">
          {/* Circle Back Button (Matching Main Website Style) */}
          <button
            type="button"
            onClick={() => setShowExitConfirmModal(true)}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-white/40 text-[#2E2D2D] hover:text-[#2563EB] shadow-xs transition-all cursor-pointer flex items-center justify-center"
            aria-label="Kembali"
            title="Keluar Kuis"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Right Area: Unified Height Chips (Mapel Gradient Chip, Question Counter, Sound Toggle) */}
          <div className="flex items-center gap-3">
            {/* Subject Gradient Chip (Enlarged, h-9) */}
            <div className="h-9 px-4.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-bold text-xs shadow-sm flex items-center border border-white/20">
              {targetQuizData.subject}
            </div>

            {/* Question Counter Chip (Enlarged, h-9) */}
            <div className="h-9 px-4 rounded-full bg-white/90 backdrop-blur-xs text-[#1E293B] font-bold text-xs shadow-xs flex items-center border border-white/40">
              {currentIndex + 1} / {questionsList.length}
            </div>

            {/* BGM Mute/Unmute Toggle (h-9 w-9) */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-white/40 shadow-xs text-[#1E293B] hover:text-[#2563EB] flex items-center justify-center transition-colors cursor-pointer"
              title={isMuted ? "Aktifkan Musik" : "Matikan Musik"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* CENTER MAIN CONTENT: WHITE QUESTION TEXT & 2X2 ANSWER GRID (LETTERS STAY AS A/B/C/D) */}
        <main className="max-w-4xl w-full mx-auto px-6 sm:px-10 py-6 flex-1 flex flex-col justify-center items-center text-center z-10">
          {/* Large Centered White Question Text */}
          <div className="space-y-2 mb-8 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight drop-shadow-md">
              {currentQuestion.text}
            </h1>
          </div>

          {/* 2x2 Answer Grid with White Framed Cards & Color Shift Only */}
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
                  className={`w-full min-h-[76px] p-4 sm:p-5 rounded-[16px] text-left flex items-center gap-3.5 transition-colors duration-150 cursor-pointer shadow-xs ${
                    !isAnswerChecked
                      ? "bg-white/95 backdrop-blur-xs border border-[#ECECEC] hover:bg-[#EEF2FF] hover:border-[#2563EB] text-[#1E293B] hover:text-[#2563EB]"
                      : isSelectedCorrect || isRevealedCorrect
                      ? "bg-[#10B981] text-white font-semibold border-transparent shadow-md"
                      : isSelectedWrong
                      ? "bg-[#EF4444] text-white font-semibold border-transparent shadow-md"
                      : "bg-white/95 backdrop-blur-xs border border-[#ECECEC] text-[#94A3B8] cursor-default"
                  }`}
                >
                  {/* Option Letter Badge (A, B, C, D Always Visible) */}
                  <div className="shrink-0 flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border transition-colors ${
                        !isAnswerChecked
                          ? "bg-slate-100 text-[#2563EB] border-slate-200"
                          : isSelectedCorrect || isRevealedCorrect || isSelectedWrong
                          ? "bg-white/20 text-white border-white/40"
                          : "bg-slate-100 text-[#94A3B8] border-slate-200"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                  </div>

                  {/* Option Text */}
                  <span
                    className={`text-xs sm:text-sm leading-relaxed flex-1 font-medium ${
                      !isAnswerChecked
                        ? "text-inherit"
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
        <footer className="w-full max-w-5xl mx-auto px-6 sm:px-10 pb-6 pt-2 flex items-center justify-center z-20 min-h-[56px] shrink-0">
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
      </div>

      {/* COUNTDOWN OVERLAY (ON TOP OF BLURRED CANVAS, Z-50) */}
      {stage === "countdown" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 pointer-events-none select-none">
          <div
            key={countdownValue}
            className="text-8xl sm:text-9xl md:text-[160px] lg:text-[190px] font-black text-white drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)] animate-in zoom-in-75 fade-in duration-300 tracking-tight text-center leading-none"
          >
            {countdownValue > 0 ? countdownValue : "Mulai!"}
          </div>
        </div>
      )}

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
