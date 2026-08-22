import { NextRequest } from 'next/server';
import { QuizService } from '@/services/quiz.service';
import { quizSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const role = req.nextUrl.searchParams.get('role') || undefined;

    const quiz = QuizService.getQuizById(id, role);
    if (!quiz) {
      return apiError('Kuis tidak ditemukan', 404);
    }
    return apiSuccess(quiz);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = quizSchema.partial().parse(body);

    const updated = QuizService.updateQuiz(id, validated);
    if (!updated) {
      return apiError('Kuis tidak ditemukan', 404);
    }

    return apiSuccess(updated, 'Kuis berhasil diperbarui');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = QuizService.deleteQuiz(id);
    if (!deleted) {
      return apiError('Kuis tidak ditemukan', 404);
    }

    return apiSuccess(null, 'Kuis berhasil dihapus');
  } catch (error) {
    return handleApiError(error);
  }
}
