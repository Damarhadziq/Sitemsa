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
    <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto mt-4 md:mt-8">
      <Card className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[12px] mb-8">
        <CardContent className="p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed tracking-tight">
            Manakah dari berikut ini yang <span className="text-indigo-300 font-semibold">bukan</span> merupakan jenis struktur data linear?
          </h2>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {OPTIONS.map((option) => (
          <Card 
            key={option.id}
            onClick={() => setSelectedId(option.id)}
            className={cn(
              "cursor-pointer rounded-[8px] overflow-hidden transition-all duration-200",
              selectedId === option.id 
                ? "bg-[#0400F4] border-2 border-white text-white" 
                : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30"
            )}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn(
                "w-9 h-9 rounded-[6px] flex items-center justify-center text-sm font-bold transition-colors",
                selectedId === option.id ? "bg-white text-[#0400F4]" : "bg-white/20 text-white"
              )}>
                {option.id}
              </div>
              <span className="text-lg font-semibold text-white">{option.text}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
