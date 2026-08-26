import { NextRequest } from 'next/server';
import { ModuleService } from '@/services/module.service';
import { moduleSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const subject = searchParams.get('subject') || undefined;
    const level = searchParams.get('level') || undefined;
    const teacherId = searchParams.get('teacherId') || undefined;

    const modules = ModuleService.getAllModules({ subject, level, teacherId });
    return apiSuccess(modules);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = moduleSchema.parse(body);

    const newModule = await ModuleService.createModule(validated);
    return apiSuccess(newModule, 'Modul pembelajaran berhasil diterbitkan', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
