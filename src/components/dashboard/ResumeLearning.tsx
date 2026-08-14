import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export function ResumeLearning() {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">Terakhir Dibaca</h2>
      
      <Card className="rounded-[24px] border-none shadow-[var(--shadow-ambient)] bg-white overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
              <BookOpen className="text-indigo-500 w-8 h-8" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-500 mb-1 tracking-wide uppercase">Informatika</p>
              <h3 className="text-xl font-bold text-foreground mb-3">Algoritma Dasar</h3>
              <div className="flex items-center gap-4">
                <Progress value={70} className="h-2 w-48 rounded-full bg-slate-100 [&>div]:bg-indigo-500" />
                <span className="text-sm font-medium text-muted-foreground">70%</span>
              </div>
            </div>
          </div>
          
          <Link href="/materi/algoritma-dasar" className="w-full md:w-auto">
            <Button className="w-full md:w-auto rounded-full px-8 py-6 text-base font-semibold shadow-md hover:shadow-lg bg-primary text-white transition-all">
              Lanjutkan
            </Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
