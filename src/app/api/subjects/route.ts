import { NextRequest } from 'next/server';
import { SubjectService } from '@/services/subject.service';
import { subjectSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const subjects = SubjectService.getAllSubjects();
    return apiSuccess(subjects);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = subjectSchema.parse(body);

    const newSubject = SubjectService.createSubject(validated);
    return apiSuccess(newSubject, 'Mata pelajaran berhasil ditambahkan', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
