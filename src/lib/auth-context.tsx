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
  email: 'admin@sintesa.id',
  role: 'superadmin',
  avatar: 'https://i.pravatar.cc/150?img=68',
};

const TEACHER_USERS: Record<string, AuthUser> = {
  'budi.guru@sintesa.id': {
    id: 't-1',
    name: 'Pak Budi Prasetyo, M.Kom.',
    email: 'budi.guru@sintesa.id',
    role: 'guru',
    nip: '19850412 201001 1 003',
    avatar: 'https://i.pravatar.cc/150?img=60',
    assignedSubjects: ['Informatika'],
  },
  'siti.guru@sintesa.id': {
    id: 't-2',
    name: 'Ibu Siti Rahmawati, S.T.',
    email: 'siti.guru@sintesa.id',
    role: 'guru',
    nip: '19900823 201502 2 005',
    avatar: 'https://i.pravatar.cc/150?img=47',
    assignedSubjects: ['Elektronika', 'Otomotif'],
  },
  'ahmad.guru@sintesa.id': {
    id: 't-3',
    name: 'Pak Ahmad Fauzi, S.Pd.',
    email: 'ahmad.guru@sintesa.id',
    role: 'guru',
    nip: '19881115 201201 1 002',
    avatar: 'https://i.pravatar.cc/150?img=11',
    assignedSubjects: ['Seni & Desain'],
  },
};

const STUDENT_USER: AuthUser = {
  id: 'std-1',
  name: 'Andi Pratama',
  email: 'siswa@sintesa.id',
  role: 'siswa',
  avatar: 'https://i.pravatar.cc/150?img=12',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start initial state with null for perfect SSR and client hydration matching
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Sync session on client mount after hydration
    const savedUser = localStorage.getItem('sintesa_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as AuthUser;
        setUser(parsed);
        if (parsed.role === 'guru' && parsed.assignedSubjects && parsed.assignedSubjects.length > 0) {
          setActiveSubjectFilter(parsed.assignedSubjects[0]);
        }
      } catch {
        setUser(null);
      }
    } else if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin/superadmin')) {
        setUser(SUPERADMIN_USER);
        localStorage.setItem('sintesa_user', JSON.stringify(SUPERADMIN_USER));
      } else if (window.location.pathname.startsWith('/admin/guru')) {
        const teacher = TEACHER_USERS['budi.guru@sintesa.id'];
        setUser(teacher);
        localStorage.setItem('sintesa_user', JSON.stringify(teacher));
        if (teacher.assignedSubjects && teacher.assignedSubjects.length > 0) {
          setActiveSubjectFilter(teacher.assignedSubjects[0]);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const saveSession = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('sintesa_user', JSON.stringify(u));
      document.cookie = `auth_admin=${u.role}; path=/`;
      if (u.role === 'guru' && u.assignedSubjects && u.assignedSubjects.length > 0) {
        setActiveSubjectFilter(u.assignedSubjects[0]);
      }
    } else {
      localStorage.removeItem('sintesa_user');
      document.cookie = 'auth_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setActiveSubjectFilter('');
    }
  };

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
    if (cleanEmail === 'admin@sintesa.id' || cleanEmail === 'admin') {
      loginAsSuperadmin();
      return true;
    }

    if (TEACHER_USERS[cleanEmail]) {
      loginAsTeacher(cleanEmail);
      return true;
    }

    if (cleanEmail.includes('guru')) {
      loginAsTeacher('budi.guru@sintesa.id');
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
    const prevRole = user?.role;
    saveSession(null);
    if (prevRole === 'superadmin' || prevRole === 'guru') {
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
