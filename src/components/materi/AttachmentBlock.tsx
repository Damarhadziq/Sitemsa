import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AttachmentBlock() {
  return (
    <section className="mt-12 mb-24">
      <h3 className="text-xl font-bold text-foreground mb-4">Bahan Bacaan Tambahan</h3>
      <div className="flex items-center justify-between bg-white border border-border p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Modul_Algoritma_Bab1.pdf</p>
            <p className="text-sm text-muted-foreground">2.4 MB</p>
          </div>
        </div>
        <Button className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white px-6">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </section>
  );
}
