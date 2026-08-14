export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen w-full bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-foreground overflow-hidden font-sans">
      {children}
    </div>
  );
}
