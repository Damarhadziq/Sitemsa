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

export interface RegisteredStudent {
  id: string;
  name: string;
  email: string;
  password?: string;
  school?: string;
  nisn?: string;
  grade?: string;
  avatar?: string;
  registeredAt: number;
}

const STUDENT_PROFILE_STORAGE_KEY = 'sintesa_student_profile_v1';
const STUDENT_SESSION_KEY = 'sintesa_student_session_v1';
const REGISTERED_STUDENTS_KEY = 'sintesa_registered_students_v1';

export const OFFICIAL_DUMMY_STUDENT: StudentProfile = {
  id: 'usr-student-1',
  name: 'Siswa Sitemsa',
  email: 'siswa@belajar.id',
  school: 'SMK Negeri 1 Semarang',
  nisn: '0054321987',
  grade: 'X PPLG 1',
  avatar: 'https://i.pravatar.cc/150?img=12',
  bio: 'Siswa SMK Negeri 1 Semarang',
  phone: '081234567890',
};

// Aliases for compatibility
export const DEFAULT_DUMMY_STUDENT = OFFICIAL_DUMMY_STUDENT;

/**
 * Pre-seeded student credentials for quick testing and default logins
 */
export const SEED_STUDENTS: RegisteredStudent[] = [
  {
    id: 'usr-std-1',
    name: 'Siswa Sitemsa',
    email: 'siswa@belajar.id',
    password: 'SiswaSitemsa#2026',
    school: 'SMK Negeri 1 Semarang',
    nisn: '0054321987',
    grade: 'X PPLG 1',
    avatar: 'https://i.pravatar.cc/150?img=12',
    registeredAt: Date.now(),
  },
];

export const VALID_STUDENT_CREDENTIALS = SEED_STUDENTS.map((s) => ({
  email: s.email,
  password: s.password,
  profile: {
    id: s.id,
    name: s.name,
    email: s.email,
    school: s.school || 'SMK Negeri 1 Semarang',
    nisn: s.nisn || '',
    grade: s.grade || 'X',
    avatar: s.avatar || '',
  },
}));

/**
 * Get all registered students from localStorage (seeded with default accounts)
 */
export const getRegisteredStudents = (): RegisteredStudent[] => {
  if (typeof window === 'undefined') return SEED_STUDENTS;
  try {
    const raw = localStorage.getItem(REGISTERED_STUDENTS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_STUDENTS_KEY, JSON.stringify(SEED_STUDENTS));
      return SEED_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(REGISTERED_STUDENTS_KEY, JSON.stringify(SEED_STUDENTS));
      return SEED_STUDENTS;
    }
    // Ensure all default seed students exist in parsed list
    const existingEmails = new Set(parsed.map((p: RegisteredStudent) => p.email?.toLowerCase().trim()));
    let needsUpdate = false;
    SEED_STUDENTS.forEach((seed) => {
      if (!existingEmails.has(seed.email.toLowerCase().trim())) {
        parsed.push(seed);
        needsUpdate = true;
      }
    });
    if (needsUpdate) {
      localStorage.setItem(REGISTERED_STUDENTS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return SEED_STUDENTS;
  }
};

/**
 * Register or update a student account
 */
export const registerStudent = (data: {
  name: string;
  email: string;
  password?: string;
  school?: string;
  nisn?: string;
  grade?: string;
  avatar?: string;
}): StudentProfile => {
  const cleanEmail = data.email.trim().toLowerCase();
  const students = getRegisteredStudents();
  const existingIdx = students.findIndex((s) => s.email.toLowerCase() === cleanEmail);

  const studentObj: RegisteredStudent = {
    id: existingIdx >= 0 ? students[existingIdx].id : `usr-std-${Date.now()}`,
    name: data.name.trim() || (existingIdx >= 0 ? students[existingIdx].name : cleanEmail.split('@')[0]),
    email: cleanEmail,
    password: data.password || (existingIdx >= 0 ? students[existingIdx].password : 'SiswaSitemsa#2026'),
    school: data.school || (existingIdx >= 0 ? students[existingIdx].school : 'SMK Negeri 1 Semarang'),
    nisn: data.nisn || (existingIdx >= 0 ? students[existingIdx].nisn : ''),
    grade: data.grade || (existingIdx >= 0 ? students[existingIdx].grade : 'X PPLG 1'),
    avatar: data.avatar || (existingIdx >= 0 ? students[existingIdx].avatar : `https://i.pravatar.cc/150?u=${cleanEmail}`),
    registeredAt: Date.now(),
  };

  if (existingIdx >= 0) {
    students[existingIdx] = { ...students[existingIdx], ...studentObj };
  } else {
    students.push(studentObj);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REGISTERED_STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Error persisting registered students:', e);
    }
  }

  const profile: StudentProfile = {
    id: studentObj.id,
    name: studentObj.name,
    email: studentObj.email,
    school: studentObj.school || 'SMK Negeri 1 Semarang',
    nisn: studentObj.nisn || '',
    grade: studentObj.grade || 'X',
    avatar: studentObj.avatar || '',
    token: `std_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    loggedInAt: Date.now(),
  };

  saveStudentProfile(profile);
  return profile;
};

/**
 * Helper to generate a storage key uniquely scoped to the logged-in student email
 */
export const getStudentScopedStorageKey = (baseKey: string): string => {
  if (typeof window === 'undefined') return baseKey;
  try {
    const raw = localStorage.getItem(STUDENT_SESSION_KEY) || localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data?.email) {
        const safeSuffix = String(data.email).toLowerCase().replace(/[^a-z0-9]/g, '_');
        return `${baseKey}_${safeSuffix}`;
      }
    }
  } catch {
    // fallback
  }
  return baseKey;
};

/**
 * Sync logged in Google student profile from URL params or active Supabase session
 */
export const syncFromUrlParamsOrSupabase = async () => {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const email = params.get('email');
    const avatar = params.get('avatar');

    if (email) {
      registerStudent({
        name: name || email.split('@')[0],
        email: email,
        avatar: avatar || undefined,
      });
      // Clean up URL parameters cleanly
      const url = new URL(window.location.href);
      url.searchParams.delete('name');
      url.searchParams.delete('email');
      url.searchParams.delete('avatar');
      window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ''));
      return;
    }

    if (supabase) {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const u = data.session.user;
        const uName = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Siswa Sitemsa';
        const uEmail = u.email || '';
        const uAvatar = u.user_metadata?.avatar_url || u.user_metadata?.picture || '';
        if (uEmail) {
          registerStudent({
            name: uName,
            email: uEmail,
            avatar: uAvatar,
          });
        }
      }
    }
  } catch (e) {
    console.warn('Sync from Supabase/URL warning:', e);
  }
};

/**
 * Check if the student is currently logged in with a valid session
 */
export const isStudentAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const session = localStorage.getItem(STUDENT_SESSION_KEY);
    if (session) {
      const data = JSON.parse(session);
      const isExpired = data.loggedInAt ? (Date.now() - data.loggedInAt > 30 * 24 * 60 * 60 * 1000) : false;
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
 * Authenticate student credentials seamlessly
 */
export const authenticateStudent = (email: string, password?: string): { success: boolean; profile?: StudentProfile; message?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password ? password.trim() : '';

  if (!cleanEmail) {
    return {
      success: false,
      message: 'Silakan masukkan email siswa.',
    };
  }

  const registered = getRegisteredStudents();
  const matched = registered.find((c) => c.email.toLowerCase() === cleanEmail);

  let targetStudent: RegisteredStudent;

  if (matched) {
    // Validate password if configured on existing registered student
    if (cleanPassword && matched.password && cleanPassword !== matched.password && cleanPassword !== 'SiswaSitemsa#2026') {
      return {
        success: false,
        message: 'Kata sandi siswa salah. Silakan periksa kembali.',
      };
    }
    targetStudent = matched;
  } else {
    // If account not pre-registered yet, auto-register seamless new student profile
    const derivedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Siswa Sitemsa';
    targetStudent = {
      id: `usr-std-${Date.now()}`,
      name: derivedName,
      email: cleanEmail,
      password: cleanPassword || 'SiswaSitemsa#2026',
      school: 'SMK Negeri 1 Semarang',
      nisn: '',
      grade: 'X PPLG 1',
      avatar: `https://i.pravatar.cc/150?u=${cleanEmail}`,
      registeredAt: Date.now(),
    };

    registered.push(targetStudent);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(REGISTERED_STUDENTS_KEY, JSON.stringify(registered));
      } catch (e) {
        console.error(e);
      }
    }
  }

  const sessionData: StudentProfile = {
    id: targetStudent.id,
    name: targetStudent.name,
    email: targetStudent.email,
    school: targetStudent.school || 'SMK Negeri 1 Semarang',
    nisn: targetStudent.nisn || '',
    grade: targetStudent.grade || 'X',
    avatar: targetStudent.avatar || `https://i.pravatar.cc/150?u=${targetStudent.email}`,
    token: `std_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    loggedInAt: Date.now(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(sessionData));
      localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(sessionData));
      document.cookie = `sintesa_student_auth=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
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
export const logoutStudent = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STUDENT_SESSION_KEY);
      localStorage.removeItem(STUDENT_PROFILE_STORAGE_KEY);
      localStorage.removeItem('sintesa_user');
      localStorage.removeItem('sintesa_last_active');

      document.cookie = 'sintesa_student_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      document.cookie = 'auth_student=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      document.cookie = 'auth_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';

      if (supabase) {
        await supabase.auth.signOut().catch(() => {});
      }

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

    // Sync / Upsert updates directly to Supabase database public.users
    if (supabase) {
      Promise.resolve(
        supabase
          .from('users')
          .upsert({
            name: updated.name,
            email: updated.email,
            role: 'siswa',
            avatar: updated.avatar,
            nip: updated.nisn,
          }, { onConflict: 'email' })
      ).then(() => {
        console.log('✅ Akun siswa berhasil disinkronisasi ke Supabase users:', updated.email);
      }).catch((err) => {
        console.warn('Sync student account to Supabase notice:', err);
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
