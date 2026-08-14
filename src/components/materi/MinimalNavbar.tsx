import Link from "next/link";
import { ChevronLeft, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MinimalNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-white/20">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-indigo-50/50 text-indigo-600 font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Kembali ke Informatika
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-indigo-600">
          <Bookmark className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  );
}
