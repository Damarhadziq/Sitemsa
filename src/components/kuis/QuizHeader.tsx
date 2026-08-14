"use client";

import Link from "next/link";
import { X, Timer, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function QuizHeader() {
  return (
    <header className="w-full p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between w-full">
        <Link href="/materi/algoritma-dasar">
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 font-medium text-lg">
            <X className="w-5 h-5 mr-2" />
            Keluar
          </Button>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Timer className="w-5 h-5 text-amber-400" />
            <span className="text-white font-mono font-bold text-lg">00:45</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-white font-bold text-lg">150 Pts</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto w-full text-center">
        <p className="text-white/80 font-medium mb-3">Soal 1 dari 5</p>
        <Progress value={20} className="h-3 rounded-full bg-white/10 [&>div]:bg-indigo-400 [&>div]:shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
      </div>
    </header>
  );
}
