export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white text-[#2E2D2D] font-sans relative overflow-x-hidden selection:bg-blue-100 selection:text-[#2563EB]">
      {/* Soft Top Mesh Gradient Accent (#F0F7FF to #FFFFFF) */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC]/60 to-transparent pointer-events-none -z-10" />
      {children}
    </div>
  );
}
