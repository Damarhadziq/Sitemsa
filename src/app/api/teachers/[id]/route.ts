import { NextRequest } from 'next/server';
import { TeacherService } from '@/services/teacher.service';
import { teacherSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacher = TeacherService.getTeacherById(id);
    if (!teacher) {
      return apiError('Akun guru tidak ditemukan', 404);
    }
    return apiSuccess(teacher);
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
    const validated = teacherSchema.partial().parse(body);

    const updated = TeacherService.updateTeacher(id, validated);
    if (!updated) {
      return apiError('Akun guru tidak ditemukan', 404);
    }

    return apiSuccess(updated, 'Data guru berhasil diperbarui');
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
    const deleted = TeacherService.deleteTeacher(id);
    if (!deleted) {
      return apiError('Akun guru tidak ditemukan', 404);
    }

    return apiSuccess(null, 'Akun guru berhasil dihapus');
  } catch (error) {
    return handleApiError(error);
  }
}
