import { NextRequest } from 'next/server';
import { TeacherService } from '@/services/teacher.service';
import { teacherSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const teachers = TeacherService.getAllTeachers();
    return apiSuccess(teachers);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = teacherSchema.parse(body);

    const newTeacher = TeacherService.createTeacher(validated);
    return apiSuccess(newTeacher, 'Akun guru berhasil dibuat', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
