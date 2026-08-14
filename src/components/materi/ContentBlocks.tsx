export function ContentBlocks() {
  return (
    <article className="max-w-none text-foreground">
      <section className="mb-10">
        <h2 className="font-bold text-2xl mb-4 text-foreground">1. Apa itu Algoritma?</h2>
        <p className="text-[#64748B] leading-relaxed text-lg">
          Algoritma adalah serangkaian instruksi langkah demi langkah yang dirancang untuk
          menyelesaikan masalah atau melakukan tugas tertentu. Dalam ilmu komputer, algoritma adalah
          fondasi dari setiap program.
        </p>
      </section>

      <section className="mb-10">
        <div className="w-full h-[300px] md:h-[400px] rounded-[24px] bg-indigo-100 flex items-center justify-center mb-3 shadow-[var(--shadow-ambient)] overflow-hidden">
          <div className="text-indigo-300 flex flex-col items-center">
            <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Placeholder Illustration</span>
          </div>
        </div>
        <p className="text-center text-sm italic text-muted-foreground mt-0">
          Gambar 1.1: Diagram Alir (Flowchart) Algoritma Dasar.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-bold text-2xl mb-4 text-foreground">2. Karakteristik Algoritma</h2>
        <p className="text-[#64748B] leading-relaxed text-lg">
          Sebuah algoritma yang baik harus memiliki input yang jelas, output yang pasti, dan instruksi
          yang tidak ambigu. Selain itu, algoritma harus memiliki titik henti (finiteness).
        </p>
      </section>
    </article>
  );
}
