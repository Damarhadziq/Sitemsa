import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/lib/auth-context';

export const ADMIN_INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 Menit untuk Pengelola / Guru
export const STUDENT_INACTIVITY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000; // 7 Hari (1 Minggu) untuk Siswa
export const INACTIVITY_LIMIT_MS = ADMIN_INACTIVITY_LIMIT_MS;
export const STORAGE_SESSION_ID_KEY = 'sintesa_session_id';
export const STORAGE_LAST_ACTIVE_KEY = 'sintesa_last_active';
export const STORAGE_USER_KEY = 'sintesa_user';

export interface ActiveSessionRecord {
  user_id: string;
  email: string;
  role: string;
  session_id: string;
  device_info?: string;
  last_active: string;
}

export class SessionSecurityService {
  /**
   * Generate unique session identifier per login
   */
  static generateSessionId(userId: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `sess_${userId}_${timestamp}_${randomStr}`;
  }

  /**
   * Get current local session ID
   */
  static getLocalSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_SESSION_ID_KEY);
  }

  /**
   * Get last active timestamp
   */
  static getLastActiveTimestamp(): number {
    if (typeof window === 'undefined') return Date.now();
    const stored = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
    if (!stored) return Date.now();
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? Date.now() : parsed;
  }

  /**
   * Claim and register active session for this device (both in browser and Supabase)
   */
  static async claimActiveSession(user: AuthUser, sessionId: string): Promise<void> {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    localStorage.setItem(STORAGE_SESSION_ID_KEY, sessionId);
    localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, now.toString());

    // Role-isolated cookies
    if (user.role === 'siswa') {
      document.cookie = `${STORAGE_SESSION_ID_KEY}=${sessionId}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `auth_student=siswa; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `auth=true; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `sintesa_student_auth=true; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `auth_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;`;
    } else {
      document.cookie = `${STORAGE_SESSION_ID_KEY}=${sessionId}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `auth_admin=${user.role || 'guru'}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `auth_student=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;`;
      document.cookie = `auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;`;
      document.cookie = `sintesa_student_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;`;
    }

    // Sync to Supabase cloud table `active_sessions` for single-device concurrent enforcement
    if (supabase && user) {
      try {
        const deviceInfo = typeof navigator !== 'undefined' ? `${navigator.platform || ''} - ${navigator.userAgent.substring(0, 80)}` : 'Web Browser';
        
        await supabase
          .from('active_sessions')
          .upsert({
            user_id: user.id,
            email: user.email.toLowerCase(),
            role: user.role || 'user',
            session_id: sessionId,
            device_info: deviceInfo,
            last_active: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      } catch (err) {
        console.warn('Gagal mencatat sesi aktif ke Supabase:', err);
      }
    }
  }

  /**
   * Verify if current local session is still valid:
   * 1. Check if user is inactive:
   *    - Siswa: Inactivity > 1 Minggu (7 hari)
   *    - Admin / Guru: Inactivity > 30 Menit
   * 2. Check if another device logged in with the same account (single device enforcement)
   */
  static async validateSession(
    user: AuthUser | null,
    currentSessionId: string | null
  ): Promise<{ valid: boolean; reason?: 'inactivity' | 'concurrent_device' }> {
    if (!user) return { valid: false };

    // 1. Role-aware inactivity check
    const now = Date.now();
    const lastActive = this.getLastActiveTimestamp();
    const isStudent = user.role === 'siswa';
    const limit = isStudent ? STUDENT_INACTIVITY_LIMIT_MS : ADMIN_INACTIVITY_LIMIT_MS;

    if (now - lastActive > limit) {
      return { valid: false, reason: 'inactivity' };
    }

    // 2. Single Device Concurrent Login Check via Supabase
    if (supabase && user && currentSessionId) {
      try {
        const { data, error } = await supabase
          .from('active_sessions')
          .select('session_id, last_active')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data && data.session_id) {
          if (data.session_id !== currentSessionId) {
            return { valid: false, reason: 'concurrent_device' };
          }
        }
      } catch (err) {
        console.warn('Session cloud check error:', err);
      }
    }

    return { valid: true };
  }

  /**
   * Refresh activity timestamp on user interactions
   */
  static touchActivity(user?: AuthUser | null, throttled = true): void {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const last = this.getLastActiveTimestamp();

    // Only update if throttled interval (e.g. 15 seconds) passed
    if (!throttled || now - last > 15000) {
      localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, now.toString());

      // Periodically update last_active on cloud (every 2 minutes)
      if (supabase && user && now - last > 120000) {
        Promise.resolve(
          supabase
            .from('active_sessions')
            .update({ last_active: new Date().toISOString() })
            .eq('user_id', user.id)
        ).catch(() => {});
      }
    }
  }

  /**
   * Clear session on logout or invalidation
   */
  static async clearSession(user?: AuthUser | null): Promise<void> {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_SESSION_ID_KEY);
    localStorage.removeItem(STORAGE_LAST_ACTIVE_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);

    document.cookie = `${STORAGE_SESSION_ID_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;`;

    if (supabase && user) {
      try {
        await supabase
          .from('active_sessions')
          .delete()
          .eq('user_id', user.id);
      } catch (err) {
        console.warn('Gagal menghapus sesi aktif dari Supabase:', err);
      }
    }
  }
}
