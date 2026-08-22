import { NextRequest } from 'next/server';
import { ProgressService } from '@/services/progress.service';
import { studentProgressSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get('studentId');
  if (!studentId) {
    return apiError('studentId diperlukan', 400);
  }

  const student = ProgressService.getStudentById(studentId);
  if (!student) {
    return apiError('Data siswa tidak ditemukan', 404);
  }

  return apiSuccess({
    studentId: student.id,
    name: student.name,
    moduleProgress: student.moduleProgress,
    quizHistory: student.quizHistory,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = studentProgressSchema.parse(body);

    const updated = ProgressService.updateProgress(validated.studentId, validated.subject, validated.progress);
    if (!updated) {
      return apiError('Data siswa tidak ditemukan', 404);
    }

    return apiSuccess(updated, 'Progres belajar siswa berhasil diperbarui');
  } catch (error) {
    return handleApiError(error);
  }
}
