"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
  Zap,
  Flame,
  Clock,
  X,
} from "lucide-react";
import { ProgressService } from "@/services/progress.service";
import { addUserNotification } from "@/services/notification.service";
import { recordModuleCompletion } from "@/services/weekly-target.service";

// Web Audio API Synthesizer (Zero-dependency SFX)
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
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "correct") {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.3, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } else if (type === "wrong") {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Autoplay policy fallback
  }
}

// Pastel Confetti Burst Function
function triggerPastelConfetti() {
  if (typeof window === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#2563EB", "#22C55E", "#F59E0B", "#EC4899", "#8B5CF6", "#3B82F6"];
  const particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rSpeed: number;
  }[] = [];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 300,
      y: canvas.height / 3 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6,
      rotation: Math.random() * Math.PI * 2,
      rSpeed: (Math.random() - 0.5) * 0.2,
    });
  }

  let animationFrameId: number;
  let opacity = 1;

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    opacity -= 0.015;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.rSpeed;

      ctx.save();
      ctx.globalAlpha = Math.max(0, opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (opacity > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  };

  render();
}

// Sample Quiz Questions Data
const QUIZ_QUESTIONS = [
  {
    id: "q1",
    text: "Manakah dari berikut ini yang bukan merupakan jenis struktur data linear?",
    options: ["Array", "Linked List", "Tree", "Stack"],
    correctAnswer: 2,
    explanation:
      "Tree adalah struktur data non-linear berhirarki (hierarchical), sedangkan Array, Linked List, dan Stack adalah struktur data linear.",
  },
  {
    id: "q2",
    text: "Manakah prinsip kerja utama dari struktur data Queue (Antrean)?",
    options: [
      "LIFO (Last In First Out)",
      "FIFO (First In First Out)",
      "LILO (Last In Last Out)",
      "Random Access",
    ],
    correctAnswer: 1,
    explanation:
      "Queue menerapkan prinsip FIFO (First In First Out) di mana elemen yang pertama kali dimasukkan akan diproses paling pertama.",
  },
  {
    id: "q3",
    text: "Manakah kompleksitas waktu terbaik (Best Case) untuk algoritma Quick Sort?",
    options: ["O(N log N)", "O(N²)", "O(1)", "O(N)"],
    correctAnswer: 0,
    explanation:
      "Algoritma Quick Sort memiliki kompleksitas waktu terbaik dan rata-rata sebesar O(N log N) ketika pivot membagi array secara seimbang.",
  },
];

export function QuestionArea() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  // Timer Countdown
  useEffect(() => {
    if (isAnswered || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit timeout
          handleSelectOption(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isCompleted]);

  // Handle Option Click
  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswer;

    if (isCorrect) {
      playQuizSound("correct");
      triggerPastelConfetti();

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setScore((prev) => prev + 50 + newStreak * 10);
      setCorrectCount((prev) => prev + 1);
    } else {
      playQuizSound("wrong");
      setStreak(0);
    }
  };

  // Next Question Handler
  const handleNextQuestion = () => {
    playQuizSound("pop");

    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(45);
    } else {
      setIsCompleted(true);
      const finalScorePercent = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
      try {
        ProgressService.recordQuizAttempt('std-1', {
          quizId: 'quiz-active',
          quizTitle: 'Kuis Evaluasi Sitemsa',
          subject: 'Informatika',
          score: finalScorePercent,
          maxScore: 100,
          status: finalScorePercent >= 70 ? 'Lulus' : 'Perlu Bimbingan',
        });
        ProgressService.updateProgress('std-1', 'Informatika', 100);
        recordModuleCompletion('mod-quiz-active');

        // Dispatch live dynamic notification
        addUserNotification({
          type: 'nilai',
          title: 'Nilai Kuis Berhasil Tercatat',
          message: `Selamat! Kamu menyelesaikan Kuis Evaluasi Sitemsa dengan skor ${finalScorePercent}/100.`,
          linkUrl: '/materi/1',
        });
      } catch (e) {
        console.error('Failed to auto-record quiz progress', e);
      }
    }
  };

  // Restart Quiz Handler
  const handleRestartQuiz = () => {
    playQuizSound("pop");
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTimeLeft(45);
    setIsCompleted(false);
  };

  // Helper to highlight keywords in question text
  const renderQuestionText = (text: string) => {
    const keywords = ["bukan", "kecuali", "utama", "terbaik", "paling"];
    let result = text;
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b(${kw})\\b`, "gi");
      result = result.replace(
        regex,
        `<span class="px-2 py-0.5 rounded-lg bg-blue-50 text-[#2563EB] font-black border border-blue-100">$1</span>`
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  // RESULTS SCREEN
  if (isCompleted) {
    const accuracy = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-xl mx-auto my-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl shadow-blue-500/5 text-center space-y-6">
          {/* Quiz Completion Lottie Animation */}
          <div className="w-48 h-48 mx-auto relative flex items-center justify-center overflow-hidden">
            <iframe
              src="https://lottie.host/embed/67d35880-5f9d-4309-bee5-04db1bb3f075/b7nNeNfkhM.lottie"
              className="w-full h-full border-0 pointer-events-none"
              title="Quiz Completion Lottie Animation"
            />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kuis Evaluasi Selesai!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Kerja bagus! Hasil evaluasi pemahaman materi Anda telah tersimpan.
            </p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <Zap className="w-5 h-5 text-amber-500 mx-auto" />
              <p className="text-lg font-extrabold text-slate-900">{score}</p>
              <p className="text-[11px] font-bold text-slate-500">Total Poin</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <Award className="w-5 h-5 text-emerald-500 mx-auto" />
              <p className="text-lg font-extrabold text-emerald-600">{accuracy}%</p>
              <p className="text-[11px] font-bold text-slate-500">Akurasi</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-400 mx-auto" />
              <p className="text-lg font-extrabold text-slate-900">{maxStreak}x</p>
              <p className="text-[11px] font-bold text-slate-500">Max Streak</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis</span>
            </button>

            <Link href="/materi" className="w-full sm:flex-1">
              <button className="w-full py-3 px-4 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98">
                <span>Kembali ke Pembelajaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ACTIVE QUESTION SCREEN
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-3xl mx-auto my-auto space-y-6">
      {/* Main Question Card Container */}
      <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-500/5 space-y-6 relative overflow-hidden transition-all duration-300">
        {/* Question Header Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Pertanyaan #{currentIndex + 1}</span>
        </div>

        {/* Large Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
          {renderQuestionText(currentQuestion.text)}
        </h2>

        {/* 2x2 Gamified 3D Answer Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-2">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const isSelectedWrong = isSelected && !isCorrect;
            const showCorrectStyle = isAnswered && isCorrect;

            return (
              <button
                key={index}
                disabled={isAnswered}
                onClick={() => {
                  playQuizSound("pop");
                  handleSelectOption(index);
                }}
                className={`group relative w-full p-4 sm:p-5 rounded-2xl border-2 border-b-4 flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                  !isAnswered
                    ? "bg-white border-slate-200 border-b-slate-300 hover:border-blue-400 hover:border-b-blue-500 hover:-translate-y-0.5 active:translate-y-1 active:border-b-2"
                    : showCorrectStyle
                    ? "bg-emerald-50 border-emerald-500 border-b-emerald-600 text-emerald-950 shadow-md shadow-emerald-500/10 scale-[1.01]"
                    : isSelectedWrong
                    ? "bg-rose-50 border-rose-500 border-b-rose-600 text-rose-950 animate-bounce"
                    : "bg-white border-slate-200/60 border-b-slate-200 opacity-50 cursor-default"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Badge Huruf (A, B, C, D) */}
                  <div
                    className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                      showCorrectStyle
                        ? "bg-emerald-500 text-white"
                        : isSelectedWrong
                        ? "bg-rose-500 text-white"
                        : "bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-[#2563EB]"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>

                  {/* Option Text */}
                  <span
                    className={`text-sm sm:text-base font-bold truncate ${
                      showCorrectStyle
                        ? "text-emerald-900"
                        : isSelectedWrong
                        ? "text-rose-900"
                        : "text-slate-800"
                    }`}
                  >
                    {option}
                  </span>
                </div>

                {/* Right Feedback State Icon */}
                {isAnswered && (
                  <div className="shrink-0 ml-2">
                    {showCorrectStyle && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-bounce" />
                    )}
                    {isSelectedWrong && (
                      <XCircle className="w-6 h-6 text-rose-600 animate-pulse" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Feedback Banner & Explanation */}
        {isAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200 mt-4 ${
              selectedOption === currentQuestion.correctAnswer
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                : "bg-rose-50/80 border-rose-200 text-rose-900"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-black text-sm">
                {selectedOption === currentQuestion.correctAnswer ? (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Jawaban Tepat Sekali! (+50 Pts)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Jawaban Belum Tepat</span>
                  </>
                )}
              </div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed max-w-xl">
                <strong>Pembahasan:</strong> {currentQuestion.explanation}
              </p>
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0 active:scale-98"
            >
              <span>
                {currentIndex + 1 < QUIZ_QUESTIONS.length
                  ? "Soal Berikutnya"
                  : "Lihat Hasil Kuis"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
