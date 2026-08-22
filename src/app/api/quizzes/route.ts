import { NextRequest } from 'next/server';
import { QuizService } from '@/services/quiz.service';
import { quizSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const subject = searchParams.get('subject') || undefined;
    const teacherId = searchParams.get('teacherId') || undefined;
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    const quizzes = QuizService.getAllQuizzes({ subject, teacherId, publishedOnly });
    return apiSuccess(quizzes);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = quizSchema.parse(body);

    const newQuiz = QuizService.createQuiz(validated);
    return apiSuccess(newQuiz, 'Kuis berhasil dibuat & diterbitkan', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
