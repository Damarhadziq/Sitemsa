'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  setTeacherSubjectFilter: (subject: string) => void;
  activeSubjectFilter: string;
}

const SUPERADMIN_USER: AuthUser = {
  id: 'sa-1',
  name: 'Super Administrator Sitemsa',
  email: 'admin@sitemsa.sch.id',
  role: 'superadmin',
  avatar: 'https://i.pravatar.cc/150?img=68',
};

const TEACHER_USERS: Record<string, AuthUser> = {
  'budi.guru@sitemsa.sch.id': {
    id: 't-1',
    name: 'Pak Budi Prasetyo, M.Kom.',
    email: 'budi.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19850412 201001 1 003',
    avatar: 'https://i.pravatar.cc/150?img=60',
    assignedSubjects: ['Informatika'],
  },
  'siti.guru@sitemsa.sch.id': {
    id: 't-2',
    name: 'Ibu Siti Rahmawati, S.T.',
    email: 'siti.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19900823 201502 2 005',
    avatar: 'https://i.pravatar.cc/150?img=47',
    assignedSubjects: ['Elektronika', 'Otomotif'],
  },
  'ahmad.guru@sitemsa.sch.id': {
    id: 't-3',
    name: 'Pak Ahmad Fauzi, S.Pd.',
    email: 'ahmad.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19881115 201201 1 002',
    avatar: 'https://i.pravatar.cc/150?img=11',
    assignedSubjects: ['Seni & Desain'],
  },
  'budi.guru@sintesa.id': {
    id: 't-1',
    name: 'Pak Budi Prasetyo, M.Kom.',
    email: 'budi.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19850412 201001 1 003',
    avatar: 'https://i.pravatar.cc/150?img=60',
    assignedSubjects: ['Informatika'],
  },
};

const STUDENT_USER: AuthUser = {
  id: 'std-1',
  name: 'Andi Pratama',
  email: 'siswa@sitemsa.sch.id',
  role: 'siswa',
  avatar: 'https://i.pravatar.cc/150?img=12',
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
  const saveSession = (u: AuthUser | null) => {
    setUser(u);
    if (typeof window === 'undefined') return;

    if (u) {
      const now = Date.now();
      localStorage.setItem('sintesa_user', JSON.stringify(u));
      localStorage.setItem('sintesa_last_active', now.toString());

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
      localStorage.removeItem('sintesa_user');
      localStorage.removeItem('sintesa_last_active');
      document.cookie = 'auth_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      document.cookie = 'auth_student=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      setActiveSubjectFilter('');
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check saved session & 1-week inactivity timeout
    const savedUserStr = localStorage.getItem('sintesa_user');
    const lastActiveStr = localStorage.getItem('sintesa_last_active');
    const now = Date.now();

    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr) as AuthUser;

        // Check if device has not accessed web for > 1 week (7 days)
        if (lastActiveStr) {
          const lastActiveTime = parseInt(lastActiveStr, 10);
          if (!isNaN(lastActiveTime) && now - lastActiveTime > ONE_WEEK_MS) {
            console.warn('Sesi berakhir: Perangkat tidak mengakses web selama 1 minggu.');
            saveSession(null);
            setIsLoading(false);
            return;
          }
        }

        // Active session within 1 week -> Restore user and refresh last active timestamp
        setUser(parsed);
        localStorage.setItem('sintesa_last_active', now.toString());

        if (parsed.role === 'guru' && parsed.assignedSubjects && parsed.assignedSubjects.length > 0) {
          setActiveSubjectFilter(parsed.assignedSubjects[0]);
        }
      } catch {
        saveSession(null);
      }
    } else {
      // Require explicit login via login form (NO AUTO-LOGIN BACKDOOR!)
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  // Activity listener to refresh 1-week inactivity timer when user interacts with web
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    let lastUpdate = Date.now();
    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle updates to once every 1 minute
      if (now - lastUpdate > 60000) {
        lastUpdate = now;
        localStorage.setItem('sintesa_last_active', now.toString());
      }
    };

    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [user]);

  const loginAsSuperadmin = () => {
    saveSession(SUPERADMIN_USER);
    router.push('/admin/superadmin');
  };

  const loginAsTeacher = (email = 'budi.guru@sintesa.id') => {
    const selected = TEACHER_USERS[email] || TEACHER_USERS['budi.guru@sintesa.id'];
    saveSession(selected);
    router.push('/admin/guru');
  };

  const loginAsStudent = () => {
    saveSession(STUDENT_USER);
    router.push('/');
  };

  const loginWithCredentials = (email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@sitemsa.sch.id' || cleanEmail === 'admin@sintesa.id' || cleanEmail === 'admin') {
      loginAsSuperadmin();
      return true;
    }

    if (TEACHER_USERS[cleanEmail]) {
      loginAsTeacher(cleanEmail);
      return true;
    }

    if (cleanEmail.includes('guru')) {
      loginAsTeacher('budi.guru@sitemsa.sch.id');
      return true;
    }

    if (cleanEmail.includes('siswa')) {
      loginAsStudent();
      return true;
    }

    loginAsSuperadmin();
    return true;
  };

  const logout = () => {
    const currentRole = user?.role;
    saveSession(null);

    if (currentRole === 'superadmin' || currentRole === 'guru') {
      router.push('/admin/login');
    } else {
      router.push('/login');
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
