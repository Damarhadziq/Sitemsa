import { NextRequest } from 'next/server';
import { NotificationService } from '@/services/notification.service';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ok = NotificationService.markAsRead(id);
    if (!ok) {
      return apiError('Notifikasi tidak ditemukan', 404);
    }
    return apiSuccess(null, 'Notifikasi telah ditandai dibaca');
  } catch (error) {
    return handleApiError(error);
  }
}
