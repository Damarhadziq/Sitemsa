import { NextRequest } from 'next/server';
import { TeacherService } from '@/services/teacher.service';
import { assignSubjectsSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = assignSubjectsSchema.parse(body);

    const updated = TeacherService.assignSubjects(id, validated.assignedSubjects);
    if (!updated) {
      return apiError('Akun guru tidak ditemukan', 404);
    }

    return apiSuccess(updated, 'Penugasan mata pelajaran guru berhasil diperbarui');
  } catch (error) {
    return handleApiError(error);
  }
}
