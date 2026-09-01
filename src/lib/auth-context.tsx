'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClientService } from '@/services/client/auth.client';
import { supabase } from '@/lib/supabase';
import {
  SessionSecurityService,
  ADMIN_INACTIVITY_LIMIT_MS,
  STUDENT_INACTIVITY_LIMIT_MS,
  INACTIVITY_LIMIT_MS,
  STORAGE_SESSION_ID_KEY,
  STORAGE_USER_KEY,
} from '@/services/session-security.service';

export type UserRole = 'superadmin' | 'guru' | 'siswa' | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  nip?: string;
  assignedSubjects?: string[]; // For teacher role
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isLoading: boolean;
  loginAsSuperadmin: () => void;
  loginAsTeacher: (email?: string) => void;
  loginAsStudent: () => void;
  loginWithCredentials: (email: string, password?: string) => boolean;
  logout: () => void;
  updateUserProfile: (data: Partial<AuthUser>) => void;
  setTeacherSubjectFilter: (subject: string) => void;
  activeSubjectFilter: string;
}

const SUPERADMIN_USER: AuthUser = {
  id: 'sa-1',
  name: 'Superadmin Sitemsa',
  email: 'admin@sitemsa.sch.id',
  role: 'superadmin',
  nip: '19850101 201001 1 001',
  avatar: '',
  assignedSubjects: ['Informatika', 'Elektronika', 'Bimbingan Konseling', 'Seni Tari', 'Otomotif', 'Keolahragaan'],
};

const TEACHER_USERS: Record<string, AuthUser> = {
  // --- 1. Pend. Informatika ---
  'damar.guru@sitemsa.sch.id': {
    id: 't-inf-1',
    name: 'Damar Hadziq H.',
    email: 'damar.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980101 202401 1 001',
    avatar: '',
    assignedSubjects: ['Informatika'],
  },
  'admin@sitemsa.sch.id': SUPERADMIN_USER,
  'rizal.guru@sitemsa.sch.id': {
    id: 't-inf-2',
    name: 'Mochammad Rizal D. D.',
    email: 'rizal.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980202 202401 1 002',
    avatar: '',
    assignedSubjects: ['Informatika'],
  },
  'sulthon.guru@sitemsa.sch.id': {
    id: 't-inf-3',
    name: 'M. Sulthon Abdullah A.',
    email: 'sulthon.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980303 202401 1 003',
    avatar: '',
    assignedSubjects: ['Informatika'],
  },
  'lovyca.guru@sitemsa.sch.id': {
    id: 't-inf-4',
    name: 'Lovyca Imeyra E.',
    email: 'lovyca.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980404 202401 2 004',
    avatar: '',
    assignedSubjects: ['Informatika'],
  },

  // --- 2. Bimbingan dan Konseling (BK) ---
  'innova.guru@sitemsa.sch.id': {
    id: 't-bk-1',
    name: 'Innova Riskianugrah R.',
    email: 'innova.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980505 202401 2 005',
    avatar: '',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },
  'fateka.guru@sitemsa.sch.id': {
    id: 't-bk-2',
    name: 'Fateka Maulana A. K.',
    email: 'fateka.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980606 202401 1 006',
    avatar: '',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },
  'erintan.guru@sitemsa.sch.id': {
    id: 't-bk-3',
    name: 'Erintan Tsuraya R.',
    email: 'erintan.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19940822 202012 2 009',
    avatar: '',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },
  'dinda.guru@sitemsa.sch.id': {
    id: 't-bk-4',
    name: 'Dinda Riestia',
    email: 'dinda.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980808 202401 2 008',
    avatar: '',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },

  // --- 3. Pend. Otomotif ---
  'ardyan.guru@sitemsa.sch.id': {
    id: 't-oto-1',
    name: 'Ardyan Santoso',
    email: 'ardyan.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980707 202401 1 007',
    avatar: '',
    assignedSubjects: ['Otomotif'],
  },
  'satrio.guru@sitemsa.sch.id': {
    id: 't-oto-2',
    name: 'Satrio',
    email: 'satrio.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980808 202401 1 008',
    avatar: '',
    assignedSubjects: ['Otomotif'],
  },
  'agam.guru@sitemsa.sch.id': {
    id: 't-oto-3',
    name: 'Agam Ainun Ramadhan',
    email: 'agam.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980909 202401 1 009',
    avatar: '',
    assignedSubjects: ['Otomotif'],
  },

  // --- 4. Pend. Elektronika ---
  'banu.guru@sitemsa.sch.id': {
    id: 't-elk-1',
    name: 'Banu Mahmuda H.',
    email: 'banu.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981010 202401 1 010',
    avatar: '',
    assignedSubjects: ['Elektronika'],
  },
  'anisa.guru@sitemsa.sch.id': {
    id: 't-elk-2',
    name: 'Anisa Susilawati',
    email: 'anisa.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981111 202401 2 011',
    avatar: '',
    assignedSubjects: ['Elektronika'],
  },
  'nova.guru@sitemsa.sch.id': {
    id: 't-elk-3',
    name: 'Nova Milyard',
    email: 'nova.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981212 202401 1 012',
    avatar: '',
    assignedSubjects: ['Elektronika'],
  },
  'vella.guru@sitemsa.sch.id': {
    id: 't-elk-4',
    name: 'Vella Pratika I. N.',
    email: 'vella.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981313 202401 2 013',
    avatar: '',
    assignedSubjects: ['Elektronika'],
  },
  'fahrul.guru@sitemsa.sch.id': {
    id: 't-elk-5',
    name: 'Fahrul Adiyansa',
    email: 'fahrul.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981414 202401 1 014',
    avatar: '',
    assignedSubjects: ['Elektronika'],
  },
  'tubagus.guru@sitemsa.sch.id': {
    id: 't-elk-6',
    name: 'Tubagus Fauzan A.',
    email: 'tubagus.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981515 202401 1 015',
    avatar: '',
    assignedSubjects: ['Elektronika'],
  },

  // --- 5. Pend. Olahraga ---
  'brilian.guru@sitemsa.sch.id': {
    id: 't-olr-1',
    name: 'Brilian Anugraheni',
    email: 'brilian.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981616 202401 2 016',
    avatar: '',
    assignedSubjects: ['Keolahragaan', 'Olahraga & Kesehatan', 'Pendidikan Jasmani'],
  },
  'luthfi.guru@sitemsa.sch.id': {
    id: 't-olr-2',
    name: 'Ahmad Luthfi F.',
    email: 'luthfi.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981717 202401 1 017',
    avatar: '',
    assignedSubjects: ['Keolahragaan', 'Olahraga & Kesehatan', 'Pendidikan Jasmani'],
  },
  'rinal.guru@sitemsa.sch.id': {
    id: 't-olr-3',
    name: 'Rinal Febriarso D. P.',
    email: 'rinal.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981818 202401 1 018',
    avatar: '',
    assignedSubjects: ['Keolahragaan', 'Olahraga & Kesehatan', 'Pendidikan Jasmani'],
  },

  // --- 6. Pend. Seni Tari ---
  'vivi.guru@sitemsa.sch.id': {
    id: 't-tari-1',
    name: 'Vivi Riska Wardani',
    email: 'vivi.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981919 202401 2 019',
    avatar: '',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
  },
  'anita.guru@sitemsa.sch.id': {
    id: 't-tari-2',
    name: 'Anita Dwi Ningtyas',
    email: 'anita.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19982020 202401 2 020',
    avatar: '',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
  },
  'meliana.guru@sitemsa.sch.id': {
    id: 't-tari-3',
    name: 'Meliana Dwi Yanti',
    email: 'meliana.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19982121 202401 2 021',
    avatar: '',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
  },
  'ivangka.guru@sitemsa.sch.id': {
    id: 't-tari-4',
    name: 'Hasnita Ivangka',
    email: 'ivangka.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19982222 202401 2 022',
    avatar: '',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
  },
  'hasnita.guru@sitemsa.sch.id': {
    id: 't-tari-4',
    name: 'Hasnita Ivangka',
    email: 'ivangka.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19982222 202401 2 022',
    avatar: '',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
  },
};

const STUDENT_USER: AuthUser = {
  id: 'std-1',
  name: 'Andi Pratama',
  email: 'siswa@sitemsa.sch.id',
  role: 'siswa',
  avatar: '',
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start initial state with null for perfect SSR and client hydration matching
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>('');
  const router = useRouter();

  // Save / Clear session helper
  const saveSession = (u: AuthUser | null, customSessionId?: string) => {
    setUser(u);
    if (typeof window === 'undefined') return;

    if (u) {
      const sessionId = customSessionId || SessionSecurityService.generateSessionId(u.id);
      SessionSecurityService.claimActiveSession(u, sessionId);
      localStorage.setItem('sintesa_user', JSON.stringify(u));

      if (u.role === 'superadmin' || u.role === 'guru') {
        document.cookie = `auth_admin=${u.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = 'auth_student=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
        document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      } else {
        document.cookie = 'auth_student=siswa; path=/; max-age=604800; SameSite=Lax';
        document.cookie = 'auth=true; path=/; max-age=604800; SameSite=Lax';
        document.cookie = 'auth_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      }

      if (u.role === 'guru' && u.assignedSubjects && u.assignedSubjects.length > 0) {
        setActiveSubjectFilter(u.assignedSubjects[0]);
      }
    } else {
      SessionSecurityService.clearSession(user);
      document.cookie = 'auth_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      document.cookie = 'auth_student=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      setActiveSubjectFilter('');
    }
  };

  const handleSecurityLogout = (reason: 'inactivity' | 'concurrent_device', targetUser?: AuthUser | null) => {
    const isCurrentlyOnAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    const activeUser = targetUser || user;
    const currentRole = activeUser?.role;
    const isTeacherOrAdmin = currentRole === 'superadmin' || currentRole === 'guru' || isCurrentlyOnAdminPage;

    // Inactivity timeout guard:
    // - Admin: 30 minutes on /admin routes
    // - Siswa: 7 days on public/main routes
    if (reason === 'inactivity') {
      const now = Date.now();
      const lastActive = SessionSecurityService.getLastActiveTimestamp();
      const limit = isTeacherOrAdmin ? ADMIN_INACTIVITY_LIMIT_MS : (7 * 24 * 60 * 60 * 1000);
      if (now - lastActive <= limit) {
        return; // Session is still within valid timeframe
      }
    }

    authClientService.logout().catch(() => {});
    saveSession(null);

    // Strict separation: Admin/Guru goes to /admin/login, Student goes to /login
    const targetUrl = isTeacherOrAdmin
      ? `/admin/login?reason=${reason}`
      : `/login?reason=${reason}`;

    if (typeof window !== 'undefined') {
      window.location.href = targetUrl;
    } else {
      router.push(targetUrl);
    }
  };

  // Initial session hydration & security validation on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedUserStr = localStorage.getItem('sintesa_user');
    const localSessionId = SessionSecurityService.getLocalSessionId();

    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr) as AuthUser;

        // Perform security validation:
        // - Admin: 30 Menit tidak aktif
        // - Siswa: 7 Hari tidak aktif
        SessionSecurityService.validateSession(parsed, localSessionId).then(({ valid, reason }) => {
          const isCurrentlyOnAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
          const isTeacherOrAdmin = parsed.role === 'superadmin' || parsed.role === 'guru' || isCurrentlyOnAdminPage;

          if (!valid && reason) {
            if (reason === 'inactivity') {
              const now = Date.now();
              const lastActive = SessionSecurityService.getLastActiveTimestamp();
              const limit = isTeacherOrAdmin ? ADMIN_INACTIVITY_LIMIT_MS : (7 * 24 * 60 * 60 * 1000);
              if (now - lastActive <= limit) {
                // Not expired according to 7-day student rule
                setUser(parsed);
                SessionSecurityService.touchActivity(parsed, false);
                if (parsed.role === 'guru' && parsed.assignedSubjects && parsed.assignedSubjects.length > 0) {
                  setActiveSubjectFilter(parsed.assignedSubjects[0]);
                }
                setIsLoading(false);
                return;
              }
            }

            console.warn(`Sesi ${parsed.role} dihentikan karena: ${reason}`);
            handleSecurityLogout(reason, parsed);
            setIsLoading(false);
            return;
          }

          setUser(parsed);
          SessionSecurityService.touchActivity(parsed, false);

          if (parsed.role === 'guru' && parsed.assignedSubjects && parsed.assignedSubjects.length > 0) {
            setActiveSubjectFilter(parsed.assignedSubjects[0]);
          }
          setIsLoading(false);

          // Background sync user avatar & profile from Supabase users table
          if (supabase && parsed.email) {
            Promise.resolve(
              supabase
                .from('users')
                .select('name, avatar, nip')
                .eq('email', parsed.email.toLowerCase().trim())
                .maybeSingle()
            )
              .then(({ data: cloudUser }: any) => {
                if (cloudUser && cloudUser.avatar && cloudUser.avatar !== parsed.avatar) {
                  setUser((prev) => (prev ? { ...prev, avatar: cloudUser.avatar, name: cloudUser.name || prev.name } : prev));
                  const currentSaved = localStorage.getItem('sintesa_user');
                  if (currentSaved) {
                    try {
                      const u = JSON.parse(currentSaved);
                      u.avatar = cloudUser.avatar;
                      if (cloudUser.name) u.name = cloudUser.name;
                      localStorage.setItem('sintesa_user', JSON.stringify(u));
                    } catch {}
                  }
                }
              })
              .catch(() => {});
          }
        });
      } catch {
        saveSession(null);
        setIsLoading(false);
      }
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // Continuous user activity listener to reset inactivity timer
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    const handleUserActivity = () => {
      SessionSecurityService.touchActivity(user, true);
    };

    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    return () => {
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [user]);

  // Periodic security validation (STRICTLY ACTIVE ONLY WHEN ON /admin ROUTES)
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    const isCurrentlyOnAdminPage = window.location.pathname.startsWith('/admin');
    if (!isCurrentlyOnAdminPage) return;

    const runValidation = async () => {
      const currentSessionId = SessionSecurityService.getLocalSessionId();
      const { valid, reason } = await SessionSecurityService.validateSession(user, currentSessionId);
      if (!valid && reason) {
        handleSecurityLogout(reason, user);
      }
    };

    const intervalId = setInterval(runValidation, 5000);

    // Run check on tab focus or visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        runValidation();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', runValidation);

    // Multi-tab storage listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_SESSION_ID_KEY) {
        if (!e.newValue) {
          saveSession(null);
        } else {
          runValidation();
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', runValidation);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const loginAsSuperadmin = () => {
    saveSession(SUPERADMIN_USER);
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/superadmin';
    } else {
      router.push('/admin/superadmin');
    }
  };

  const loginAsTeacher = (email = 'damar.guru@sitemsa.sch.id') => {
    const clean = email.replace(/\s+/g, '').toLowerCase();
    const selected = TEACHER_USERS[clean] || TEACHER_USERS['damar.guru@sitemsa.sch.id'] || Object.values(TEACHER_USERS)[0] || SUPERADMIN_USER;
    saveSession(selected);
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/guru';
    } else {
      router.push('/admin/guru');
    }
  };

  const loginAsStudent = () => {
    saveSession(STUDENT_USER);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    } else {
      router.push('/');
    }
  };

  const loginWithCredentials = (email: string, password?: string): boolean => {
    const cleanEmail = email.replace(/\s+/g, '').toLowerCase().trim();
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail) {
      return false;
    }

    // List of allowed superadmin credentials
    const isSuperadminEmail =
      cleanEmail === 'admin@sitemsa.sch.id' ||
      cleanEmail === 'admin@sintesa.id' ||
      cleanEmail === 'superadmin@sitemsa.sch.id' ||
      cleanEmail === 'superadmin@sintesa.id';

    const isValidSuperadminPassword =
      cleanPassword === 'admin123' ||
      cleanPassword === 'admin' ||
      cleanPassword === 'SitemsaAdmin#2026' ||
      cleanPassword === 'SintesaAdmin#2026';

    // 1. Strict Superadmin Authentication
    if (isSuperadminEmail) {
      if (!isValidSuperadminPassword) {
        return false;
      }

      saveSession(SUPERADMIN_USER);
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/superadmin';
      } else {
        router.push('/admin/superadmin');
      }
      return true;
    }

    // List of allowed teacher passwords
    const isValidTeacherPassword =
      cleanPassword === 'admin123' ||
      cleanPassword === 'GuruSitemsa#2026' ||
      cleanPassword === 'guru123' ||
      cleanPassword === '123456';

    // 2. Strict Pre-defined Teacher Match
    if (TEACHER_USERS[cleanEmail]) {
      if (!isValidTeacherPassword) {
        return false;
      }

      const teacher = { ...TEACHER_USERS[cleanEmail] };

      // Restore custom profile / avatar from local persistent store
      if (typeof window !== 'undefined') {
        try {
          const rawProfiles = localStorage.getItem('sintesa_custom_profiles_v1');
          if (rawProfiles) {
            const profilesMap = JSON.parse(rawProfiles);
            const custom = profilesMap[cleanEmail];
            if (custom) {
              if (custom.avatar) teacher.avatar = custom.avatar;
              if (custom.name) teacher.name = custom.name;
              if (custom.nip) teacher.nip = custom.nip;
            }
          }
        } catch {}
      }

      // Asynchronously sync latest cloud profile if available
      if (supabase) {
        Promise.resolve(
          supabase
            .from('users')
            .select('name, avatar, nip')
            .eq('email', cleanEmail)
            .maybeSingle()
        )
          .then(({ data: cloudUser }: any) => {
            if (cloudUser) {
              const currentSaved = localStorage.getItem('sintesa_user');
              if (currentSaved) {
                try {
                  const u = JSON.parse(currentSaved);
                  if (cloudUser.avatar) u.avatar = cloudUser.avatar;
                  if (cloudUser.name) u.name = cloudUser.name;
                  if (cloudUser.nip) u.nip = cloudUser.nip;
                  localStorage.setItem('sintesa_user', JSON.stringify(u));
                } catch {}
              }
            }
          })
          .catch(() => {});
      }

      saveSession(teacher);
      const targetUrl = teacher.role === 'superadmin' ? '/admin/superadmin' : '/admin/guru';
      if (typeof window !== 'undefined') {
        window.location.href = targetUrl;
      } else {
        router.push(targetUrl);
      }
      return true;
    }

    // 3. Dynamic Registered Teacher Match (from admin store if created in Superadmin Guru)
    if (typeof window !== 'undefined') {
      try {
        const storedAdminRaw = localStorage.getItem('sintesa_admin_storage_v1') || localStorage.getItem('sintesa-admin-storage');
        if (storedAdminRaw) {
          const parsed = JSON.parse(storedAdminRaw);
          const teachersList = parsed.state?.teachers || parsed.teachers || [];
          const matchedDynamicTeacher = teachersList.find((t: any) => t.email?.toLowerCase().trim() === cleanEmail);

          if (matchedDynamicTeacher && matchedDynamicTeacher.status === 'Aktif') {
            if (!isValidTeacherPassword) {
              return false;
            }

            const dynamicAuthTeacher: AuthUser = {
              id: matchedDynamicTeacher.id,
              name: matchedDynamicTeacher.name,
              email: matchedDynamicTeacher.email,
              role: 'guru',
              nip: matchedDynamicTeacher.nip,
              avatar: matchedDynamicTeacher.avatar || '',
              assignedSubjects: matchedDynamicTeacher.assignedSubjects || ['Informatika'],
            };

            saveSession(dynamicAuthTeacher);
            window.location.href = '/admin/guru';
            return true;
          }
        }
      } catch (e) {
        console.warn('Error checking dynamic teachers:', e);
      }
    }

    // 4. Strict Registered Student Match (only for valid registered students)
    if (typeof window !== 'undefined') {
      try {
        const rawRegisteredStudents = localStorage.getItem('sintesa_registered_students_v1');
        if (rawRegisteredStudents) {
          const registeredStudents = JSON.parse(rawRegisteredStudents);
          const matchedStudent = registeredStudents.find((s: any) => s.email?.toLowerCase().trim() === cleanEmail);
          if (matchedStudent) {
            const isStudentPasswordValid =
              !matchedStudent.password ||
              cleanPassword === matchedStudent.password ||
              cleanPassword === 'SiswaSitemsa#2026' ||
              cleanPassword === 'admin123';

            if (!isStudentPasswordValid) {
              return false;
            }

            loginAsStudent();
            return true;
          }
        }
      } catch (e) {
        console.warn('Error checking student credentials:', e);
      }
    }

    // 5. If credentials do not match any valid registered user, STRICTLY REJECT!
    return false;
  };

  const logout = () => {
    const currentRole = user?.role;
    authClientService.logout().catch(() => {});
    saveSession(null);

    if (currentRole === 'superadmin' || currentRole === 'guru') {
      router.push('/admin/login');
    } else {
      router.push('/login');
    }
  };

  const updateUserProfile = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated: AuthUser = { ...user, ...data };
    saveSession(updated);

    // Save to persistent profile overrides map so even after logout, re-logging in restores custom avatar
    if (typeof window !== 'undefined' && updated.email) {
      try {
        const rawProfiles = localStorage.getItem('sintesa_custom_profiles_v1');
        const profilesMap = rawProfiles ? JSON.parse(rawProfiles) : {};
        profilesMap[updated.email.toLowerCase().trim()] = {
          name: updated.name,
          avatar: updated.avatar,
          nip: updated.nip,
        };
        localStorage.setItem('sintesa_custom_profiles_v1', JSON.stringify(profilesMap));
      } catch (err) {
        console.warn('Local profile cache save error:', err);
      }
    }

    // Sync to Supabase if connected
    if (typeof window !== 'undefined' && updated.email) {
      import('@/lib/supabase').then(({ supabase }) => {
        if (supabase) {
          Promise.resolve(
            supabase
              .from('users')
              .upsert({
                name: updated.name,
                email: updated.email.toLowerCase().trim(),
                role: updated.role,
                avatar: updated.avatar,
                nip: updated.nip,
              }, { onConflict: 'email' })
          ).catch((err: any) => {
            console.warn('Sync user profile to Supabase notice:', err);
          });
        }
      });
    }
  };

  const setTeacherSubjectFilter = (subject: string) => {
    setActiveSubjectFilter(subject);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        loginAsSuperadmin,
        loginAsTeacher,
        loginAsStudent,
        loginWithCredentials,
        logout,
        updateUserProfile,
        setTeacherSubjectFilter,
        activeSubjectFilter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
