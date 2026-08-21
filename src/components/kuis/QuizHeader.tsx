"use client";

import Link from "next/link";
import { X, Clock, Flame } from "lucide-react";

interface QuizHeaderProps {
  currentIndex?: number;
  totalQuestions?: number;
  timeLeft?: number;
  score?: number;
  streak?: number;
  exitUrl?: string;
}

export function QuizHeader({
  currentIndex = 0,
  totalQuestions = 5,
  timeLeft = 45,
  score = 150,
  streak = 3,
  exitUrl = "/materi",
}: QuizHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;
  const isTimeCritical = timeLeft <= 5 && timeLeft > 0;

  return (
    <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex flex-col gap-4">
      {/* Top Bar Navigation & Floating Stat Badges */}
      <div className="flex items-center justify-between w-full">
        {/* Minimalist Exit Button */}
        <Link href={exitUrl}>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs">
            <X className="w-4 h-4 text-slate-500" />
            <span>Keluar</span>
          </button>
        </Link>
        
        {/* Floating Stat Badges */}
        <div className="flex items-center gap-2.5">
          {/* Timer Badge */}
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border shadow-2xs text-xs font-bold transition-all duration-300 ${
              isTimeCritical
                ? "border-rose-300 text-rose-600 bg-rose-50 animate-pulse ring-2 ring-rose-200"
                : "border-slate-200 text-slate-700"
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isTimeCritical ? "text-rose-500 animate-spin" : "text-amber-500"}`} />
            <span className="font-mono text-xs">{formatTime(timeLeft)}</span>
          </div>

          {/* Streak / Score Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{score} Pts {streak > 1 ? `(${streak}x Streak)` : ""}</span>
          </div>
        </div>
      </div>
      
      {/* Dynamic Thick Progress Bar */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
          <span>Soal {currentIndex + 1} dari {totalQuestions}</span>
          <span className="text-[#2563EB] font-extrabold">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 p-0.5 border border-slate-200/80 shadow-inner overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
