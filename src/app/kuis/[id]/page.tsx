import { QuizHeader } from "@/components/kuis/QuizHeader";
import { QuestionArea } from "@/components/kuis/QuestionArea";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <QuizHeader exitUrl="/materi" />
      <QuestionArea quizId={id} />
    </div>
  );
}
