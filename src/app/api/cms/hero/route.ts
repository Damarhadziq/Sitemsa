import { NextRequest } from 'next/server';
import { CmsService } from '@/services/cms.service';
import { heroCmsSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const hero = CmsService.getHeroContent();
    return apiSuccess(hero);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = heroCmsSchema.partial().parse(body);

    const updated = CmsService.updateHeroContent(validated);
    return apiSuccess(updated, 'Konten banner hero beranda berhasil diperbarui');
  } catch (error) {
    return handleApiError(error);
  }
}
