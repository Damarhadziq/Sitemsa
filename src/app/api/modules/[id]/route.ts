import { NextRequest } from 'next/server';
import { ModuleService } from '@/services/module.service';
import { moduleSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const moduleItem = ModuleService.getModuleById(id);
    if (!moduleItem) {
      return apiError('Modul pembelajaran tidak ditemukan', 404);
    }
    return apiSuccess(moduleItem);
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
    const validated = moduleSchema.partial().parse(body);

    const updated = ModuleService.updateModule(id, validated);
    if (!updated) {
      return apiError('Modul pembelajaran tidak ditemukan', 404);
    }

    return apiSuccess(updated, 'Modul pembelajaran berhasil diperbarui');
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
    const deleted = ModuleService.deleteModule(id);
    if (!deleted) {
      return apiError('Modul pembelajaran tidak ditemukan', 404);
    }

    return apiSuccess(null, 'Modul pembelajaran berhasil dihapus');
  } catch (error) {
    return handleApiError(error);
  }
}
