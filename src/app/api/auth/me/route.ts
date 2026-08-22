import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return apiError('User ID diperlukan', 400);
  }

  const profile = AuthService.getProfileById(userId);
  if (!profile) {
    return apiError('Pengguna tidak ditemukan', 404);
  }

  return apiSuccess(profile);
}
