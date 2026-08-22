import { NextRequest } from 'next/server';
import { NotificationService } from '@/services/notification.service';
import { notificationSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') || undefined;
    const notifications = NotificationService.getNotifications(userId);
    return apiSuccess(notifications);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = notificationSchema.parse(body);

    const newNotif = NotificationService.createNotification(validated);
    return apiSuccess(newNotif, 'Notifikasi berhasil dikirim', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
