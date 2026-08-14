"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Timer01Icon, FireIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function QuizHeader() {
  return (
    <header className="w-full p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between w-full">
        <Link href="/materi/1">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 font-medium text-sm rounded-[6px] gap-2">
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
            Keluar
          </Button>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-[6px] border border-white/20">
            <HugeiconsIcon icon={Timer01Icon} size={18} className="text-amber-400" />
            <span className="text-white font-mono font-bold text-sm">00:45</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-[6px] border border-white/20">
            <HugeiconsIcon icon={FireIcon} size={18} className="text-orange-400" />
            <span className="text-white font-bold text-sm">150 Pts</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto w-full text-center">
        <p className="text-white/80 text-xs font-medium mb-2">Soal 1 dari 5</p>
        <Progress value={20} className="h-2 rounded-[4px] bg-white/10 [&>div]:bg-[#0400F4]" />
      </div>
    </header>
  );
}
