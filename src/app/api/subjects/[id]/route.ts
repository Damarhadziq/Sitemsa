import { NextRequest } from 'next/server';
import { SubjectService } from '@/services/subject.service';
import { subjectSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subject = SubjectService.getSubjectById(id);
    if (!subject) {
      return apiError('Mata pelajaran tidak ditemukan', 404);
    }
    return apiSuccess(subject);
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
    const validated = subjectSchema.partial().parse(body);

    const updated = SubjectService.updateSubject(id, validated);
    if (!updated) {
      return apiError('Mata pelajaran tidak ditemukan', 404);
    }

    return apiSuccess(updated, 'Mata pelajaran berhasil diperbarui');
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
    const deleted = SubjectService.deleteSubject(id);
    if (!deleted) {
      return apiError('Mata pelajaran tidak ditemukan', 404);
    }

    return apiSuccess(null, 'Mata pelajaran berhasil dihapus');
  } catch (error) {
    return handleApiError(error);
  }
}
