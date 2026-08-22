import { NextRequest } from 'next/server';
import { ProgressService } from '@/services/progress.service';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const subject = req.nextUrl.searchParams.get('subject') || undefined;
    const summary = ProgressService.getMonitoringSummary(subject);
    return apiSuccess(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
