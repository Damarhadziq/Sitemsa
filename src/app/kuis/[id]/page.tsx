import { QuestionArea } from "@/components/kuis/QuestionArea";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-[#60a5fa]">
      <QuestionArea quizId={id} />
    </div>
  );
}
