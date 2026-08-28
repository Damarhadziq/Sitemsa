import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const sessionId = req.nextUrl.searchParams.get('sessionId');

    if (!userId) {
      return apiError('User ID diperlukan', 400);
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return apiSuccess({ valid: true, message: 'Server fallback' });
    }

    const { data, error } = await supabase
      .from('active_sessions')
      .select('session_id, last_active')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return apiSuccess({ valid: true, note: error.message });
    }

    if (!data) {
      return apiSuccess({ valid: true, isNew: true });
    }

    const isMatch = !sessionId || data.session_id === sessionId;
    return apiSuccess({
      valid: isMatch,
      reason: isMatch ? undefined : 'concurrent_device',
      lastActive: data.last_active,
    });
  } catch (err: any) {
    return apiError(err?.message || 'Gagal memvalidasi sesi', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, role, sessionId } = body;

    if (!userId || !sessionId) {
      return apiError('User ID dan Session ID diperlukan', 400);
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return apiSuccess({ success: true, message: 'Server fallback' });
    }

    const deviceInfo = req.headers.get('user-agent') || 'Unknown device';

    const { data, error } = await supabase
      .from('active_sessions')
      .upsert({
        user_id: userId,
        email: (email || '').toLowerCase(),
        role: role || 'user',
        session_id: sessionId,
        device_info: deviceInfo.substring(0, 100),
        last_active: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess({ success: true, data }, 'Sesi aktif berhasil diperbarui');
  } catch (err: any) {
    return apiError(err?.message || 'Gagal mendaftarkan sesi', 500);
  }
}
