export function HeroSection() {
  return (
    <section className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Left Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2E2D2D] tracking-tight leading-tight">
          Selamat Pagi, Budi!
        </h1>
      </div>

      {/* Right Target Mingguan Card */}
      <div className="w-full md:w-[380px] bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px] p-5 space-y-3 shrink-0 hover:border-[#2563EB]/30 transition-colors duration-300 ease-out">
        <h2 className="text-sm font-semibold text-[#2E2D2D]">
          Target Mingguan
        </h2>

        <div className="flex items-center justify-between gap-3">
          {/* Custom Progress Bar */}
          <div className="flex-1 h-2 bg-white border border-[#ECECEC] rounded-full overflow-hidden p-[1px]">
            <div className="h-full w-[60%] bg-[#2563EB] rounded-full transition-all duration-500 ease-out" />
          </div>
          <span className="text-xs font-semibold text-[#2E2D2D] shrink-0">
            3 dari 5 Materi Selesai
          </span>
        </div>

        <p className="text-xs text-[#737373]">
          Sedikit lagi, pertahankan rentetan belajarmu!
        </p>
      </div>
    </section>
  );
}
