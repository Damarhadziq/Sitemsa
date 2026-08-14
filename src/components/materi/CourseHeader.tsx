import { Badge } from "@/components/ui/badge";

export function CourseHeader() {
  return (
    <header className="mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
        Pengenalan Algoritma dan Struktur Data
      </h1>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs py-1.5 px-3 rounded-full font-semibold">
          Informatika
        </Badge>
        <Badge variant="outline" className="text-muted-foreground border-border text-xs py-1.5 px-3 rounded-full font-medium">
          Oleh Pak Joko
        </Badge>
        <Badge variant="outline" className="text-muted-foreground border-border text-xs py-1.5 px-3 rounded-full font-medium">
          15 Menit Baca
        </Badge>
        <Badge variant="outline" className="text-muted-foreground border-border text-xs py-1.5 px-3 rounded-full font-medium">
          Tingkat: Pemula
        </Badge>
      </div>
    </header>
  );
}
