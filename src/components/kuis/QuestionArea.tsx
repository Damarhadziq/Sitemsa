"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "A", text: "Array" },
  { id: "B", text: "Linked List" },
  { id: "C", text: "Tree" },
  { id: "D", text: "Stack" },
];

export function QuestionArea() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto mt-8 md:mt-12">
      <Card className="w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.3)] rounded-[32px] mb-12">
        <CardContent className="p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Manakah dari berikut ini yang <span className="text-indigo-300">BUKAN</span> merupakan jenis struktur data linear?
          </h2>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {OPTIONS.map((option) => (
          <Card 
            key={option.id}
            onClick={() => setSelectedId(option.id)}
            className={cn(
              "cursor-pointer rounded-[24px] overflow-hidden transition-all duration-300 transform hover:scale-[1.02]",
              selectedId === option.id 
                ? "bg-indigo-600 border-4 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
                : "bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-white/30"
            )}
          >
            <CardContent className="p-8 flex items-center gap-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-colors",
                selectedId === option.id ? "bg-white text-indigo-600" : "bg-white/20 text-white"
              )}>
                {option.id}
              </div>
              <span className="text-2xl font-bold text-white">{option.text}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
