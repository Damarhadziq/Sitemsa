'use client';

import { supabase } from '@/lib/supabase';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  school: string;
  nisn: string;
  grade: string;
  avatar: string;
  bio?: string;
  phone?: string;
  token?: string;
  loggedInAt?: number;
}

const STUDENT_PROFILE_STORAGE_KEY = 'sintesa_student_profile_v1';
const STUDENT_SESSION_KEY = 'sintesa_student_session_v1';

export const OFFICIAL_DUMMY_STUDENT: StudentProfile = {
  id: 'usr-student-1',
  name: 'Budi Santoso',
  email: 'siswa@belajar.id',
  school: 'SMKN 1 Semarang',
  nisn: '0071234567',
  grade: 'XI PPLG 1',
  avatar: 'https://i.pravatar.cc/300?img=12',
  bio: 'Siswa Rekayasa Perangkat Lunak SMKN 1 Semarang. Antusias dalam pengembangan web dan inovasi digital.',
  phone: '0812-3456-7890',
};

// Aliases for compatibility
export const DEFAULT_DUMMY_STUDENT = OFFICIAL_DUMMY_STUDENT;

/**
 * Valid student credentials list for login authentication
 */
export const VALID_STUDENT_CREDENTIALS = [
  {
    email: 'siswa@belajar.id',
    password: 'SiswaSitemsa#2026',
    profile: OFFICIAL_DUMMY_STUDENT,
  },
  {
    email: 'budi.siswa@sitemsa.sch.id',
    password: 'SiswaSitemsa#2026',
    profile: OFFICIAL_DUMMY_STUDENT,
  },
  {
    email: 'budi@siswa.belajar.id',
    password: 'SiswaSitemsa#2026',
    profile: OFFICIAL_DUMMY_STUDENT,
  },
];

/**
 * Check if the student is currently logged in with a valid session
 */
export const isStudentAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const session = localStorage.getItem(STUDENT_SESSION_KEY);
    if (session) {
      const data = JSON.parse(session);
      const isExpired = data.loggedInAt ? (Date.now() - data.loggedInAt > 7 * 24 * 60 * 60 * 1000) : false;
      if (!isExpired && (data.email || data.name)) return true;
    }
    const profile = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (profile) {
      const data = JSON.parse(profile);
      if (data.email || data.name) return true;
    }
    if (typeof document !== 'undefined') {
      if (document.cookie.includes('sintesa_student_auth=true') || document.cookie.includes('auth_student=')) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Authenticate student credentials
 */
export const authenticateStudent = (email: string, password?: string): { success: boolean; profile?: StudentProfile; message?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password ? password.trim() : '';

  const matched = VALID_STUDENT_CREDENTIALS.find((c) => c.email.toLowerCase() === cleanEmail);

  if (!matched) {
    return {
      success: false,
      message: 'Email siswa tidak terdaftar di sistem Sitemsa.',
    };
  }

  if (cleanPassword && cleanPassword !== matched.password) {
    return {
      success: false,
      message: 'Kata sandi siswa salah. Silakan periksa kembali.',
    };
  }

  const sessionData: StudentProfile = {
    ...matched.profile,
    token: `std_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    loggedInAt: Date.now(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(sessionData));
      localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(sessionData));
      document.cookie = `sintesa_student_auth=true; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      window.dispatchEvent(new CustomEvent('sintesa-student-profile-updated', { detail: sessionData }));
      window.dispatchEvent(new CustomEvent('sintesa-student-auth-changed', { detail: { isAuthenticated: true, user: sessionData } }));
      
      // Async sync from Supabase if available
      syncStudentProfileFromSupabase(cleanEmail);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    success: true,
    profile: sessionData,
  };
};

/**
 * Log out student and destroy session
 */
export const logoutStudent = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STUDENT_SESSION_KEY);
      document.cookie = 'sintesa_student_auth=; path=/; max-age=0; SameSite=Lax';
      window.dispatchEvent(new CustomEvent('sintesa-student-auth-changed', { detail: { isAuthenticated: false } }));
    } catch (e) {
      console.error(e);
    }
  }
};

/**
 * Get current student profile
 */
export const getStudentProfile = (): StudentProfile => {
  if (typeof window === 'undefined') return OFFICIAL_DUMMY_STUDENT;
  try {
    const raw = localStorage.getItem(STUDENT_SESSION_KEY) || localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (!raw) {
      return OFFICIAL_DUMMY_STUDENT;
    }
    return JSON.parse(raw);
  } catch {
    return OFFICIAL_DUMMY_STUDENT;
  }
};

/**
 * Save updated student profile locally & directly to Supabase public.users
 */
export const saveStudentProfile = (profile: Partial<StudentProfile>): StudentProfile => {
  if (typeof window === 'undefined') return OFFICIAL_DUMMY_STUDENT;
  const current = getStudentProfile();
  const updated: StudentProfile = {
    ...current,
    ...profile,
    loggedInAt: Date.now(),
  };

  try {
    localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(updated));
    document.cookie = `sintesa_student_auth=true; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent('sintesa-student-profile-updated', { detail: updated }));
    window.dispatchEvent(new CustomEvent('sintesa-student-auth-changed', { detail: { isAuthenticated: true, user: updated } }));

    // Sync updates directly to Supabase database public.users
    if (supabase) {
      supabase
        .from('users')
        .update({
          name: updated.name,
          avatar: updated.avatar,
          nip: updated.nisn,
        })
        .eq('email', updated.email)
        .then(({ data, error }) => {
          if (error) {
            console.warn('Gagal sinkronisasi profil ke Supabase users:', error.message);
          } else {
            console.log('✅ Profil siswa berhasil tersinkronisasi ke Supabase users:', data);
          }
        });
    }
  } catch (e) {
    console.error(e);
  }

  return updated;
};

/**
 * Fetch latest student profile from Supabase and sync locally
 */
export const syncStudentProfileFromSupabase = async (targetEmail?: string) => {
  if (typeof window === 'undefined' || !supabase) return;

  try {
    const current = getStudentProfile();
    const queryEmail = targetEmail || current.email || 'siswa@belajar.id';

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', queryEmail)
      .maybeSingle();

    if (!error && data) {
      const merged: StudentProfile = {
        ...current,
        name: data.name || current.name,
        avatar: data.avatar || current.avatar,
        nisn: data.nip || current.nisn,
        email: data.email || current.email,
      };
      localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(merged));
      if (localStorage.getItem(STUDENT_SESSION_KEY)) {
        localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(merged));
      }
      window.dispatchEvent(new CustomEvent('sintesa-student-profile-updated', { detail: merged }));
    }
  } catch (err) {
    console.warn('Error fetching student profile from Supabase:', err);
  }
};
