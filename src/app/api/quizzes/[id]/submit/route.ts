import { NextRequest } from 'next/server';
import { GradingService } from '@/services/grading.service';
import { quizSubmitSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = quizSubmitSchema.parse(body);

    const result = GradingService.evaluateSubmission(id, validated);
    return apiSuccess(result, 'Kuis berhasil dinilai');
  } catch (error) {
    return handleApiError(error);
  }
}
