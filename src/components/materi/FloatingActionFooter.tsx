import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FloatingActionFooter() {
  return (
    <div className="fixed bottom-6 left-0 w-full flex justify-center z-50 pointer-events-none">
      <div className="pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-[var(--shadow-ambient)] rounded-full px-6 py-4 flex items-center gap-6">
        <span className="font-medium text-foreground">Selesai membaca?</span>
        <Link href="/kuis/algoritma-dasar">
          <Button className="rounded-full bg-primary hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] font-bold px-6 py-5">
            Mulai Post-Test
          </Button>
        </Link>
      </div>
    </div>
  );
}
