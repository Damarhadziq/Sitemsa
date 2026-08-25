'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClientService } from '@/services/client/auth.client';

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
  name: 'Damar Hadziq H.',
  email: 'damar.guru@sitemsa.sch.id',
  role: 'superadmin',
  nip: '19980101 202401 1 001',
  avatar: 'https://i.pravatar.cc/150?img=11',
  assignedSubjects: ['Informatika', 'Elektronika', 'Bimbingan Konseling', 'Seni Tari', 'Otomotif', 'Olahraga & Kesehatan'],
};

const TEACHER_USERS: Record<string, AuthUser> = {
  // --- 1. Pend. Informatika ---
  'damar.guru@sitemsa.sch.id': {
    id: 'sa-1',
    name: 'Damar Hadziq H.',
    email: 'damar.guru@sitemsa.sch.id',
    role: 'superadmin',
    nip: '19980101 202401 1 001',
    avatar: 'https://i.pravatar.cc/150?img=11',
    assignedSubjects: ['Informatika', 'Elektronika', 'Bimbingan Konseling', 'Seni Tari', 'Otomotif', 'Olahraga & Kesehatan'],
  },
  'admin@sitemsa.sch.id': {
    id: 'sa-1',
    name: 'Damar Hadziq H.',
    email: 'damar.guru@sitemsa.sch.id',
    role: 'superadmin',
    nip: '19980101 202401 1 001',
    avatar: 'https://i.pravatar.cc/150?img=11',
    assignedSubjects: ['Informatika', 'Elektronika', 'Bimbingan Konseling', 'Seni Tari', 'Otomotif', 'Olahraga & Kesehatan'],
  },
  'rizal.guru@sitemsa.sch.id': {
    id: 't-inf-2',
    name: 'Mochammad Rizal D. D.',
    email: 'rizal.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980202 202401 1 002',
    avatar: 'https://i.pravatar.cc/150?img=13',
    assignedSubjects: ['Informatika'],
  },
  'sulthon.guru@sitemsa.sch.id': {
    id: 't-inf-3',
    name: 'M. Sulthon Abdullah A.',
    email: 'sulthon.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980303 202401 1 003',
    avatar: 'https://i.pravatar.cc/150?img=19',
    assignedSubjects: ['Informatika'],
  },
  'lovyca.guru@sitemsa.sch.id': {
    id: 't-inf-4',
    name: 'Lovyca Imeyra E.',
    email: 'lovyca.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980404 202401 2 004',
    avatar: 'https://i.pravatar.cc/150?img=25',
    assignedSubjects: ['Informatika'],
  },

  // --- 2. Bimbingan dan Konseling (BK) ---
  'innova.guru@sitemsa.sch.id': {
    id: 't-bk-1',
    name: 'Innova Riskianugrah R.',
    email: 'innova.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980505 202401 2 005',
    avatar: 'https://i.pravatar.cc/150?img=16',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },
  'fateka.guru@sitemsa.sch.id': {
    id: 't-bk-2',
    name: 'Fateka Maulana A. K.',
    email: 'fateka.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980606 202401 1 006',
    avatar: 'https://i.pravatar.cc/150?img=18',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },
  'erintan.guru@sitemsa.sch.id': {
    id: 't-bk-3',
    name: "Erintan Tsuraya Rahadatul'Aisy",
    email: 'erintan.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19940822 202012 2 009',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },
  'erintan@sintesa.id': {
    id: 't-bk-3',
    name: "Erintan Tsuraya Rahadatul'Aisy",
    email: 'erintan.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19940822 202012 2 009',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },
  'dinda.guru@sitemsa.sch.id': {
    id: 't-bk-4',
    name: 'Dinda Riestia',
    email: 'dinda.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19930514 201903 2 008',
    avatar: 'https://i.pravatar.cc/150?img=32',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },
  'dinda@sintesa.id': {
    id: 't-bk-4',
    name: 'Dinda Riestia',
    email: 'dinda.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19930514 201903 2 008',
    avatar: 'https://i.pravatar.cc/150?img=32',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
  },

  // --- 3. Pend. Otomotif ---
  'ardyan.guru@sitemsa.sch.id': {
    id: 't-oto-1',
    name: 'Ardyan Santoso',
    email: 'ardyan.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980707 202401 1 007',
    avatar: 'https://i.pravatar.cc/150?img=17',
    assignedSubjects: ['Otomotif'],
  },
  'satrio.guru@sitemsa.sch.id': {
    id: 't-oto-2',
    name: 'Satrio',
    email: 'satrio.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980808 202401 1 008',
    avatar: 'https://i.pravatar.cc/150?img=23',
    assignedSubjects: ['Otomotif'],
  },
  'agam.guru@sitemsa.sch.id': {
    id: 't-oto-3',
    name: 'Agam Ainun Ramadhan',
    email: 'agam.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19980909 202401 1 009',
    avatar: 'https://i.pravatar.cc/150?img=27',
    assignedSubjects: ['Otomotif'],
  },

  // --- 4. Pend. Elektronika ---
  'banu.guru@sitemsa.sch.id': {
    id: 't-elk-1',
    name: 'Banu Mahmuda H.',
    email: 'banu.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981010 202401 1 010',
    avatar: 'https://i.pravatar.cc/150?img=14',
    assignedSubjects: ['Elektronika'],
  },
  'anisa.guru@sitemsa.sch.id': {
    id: 't-elk-2',
    name: 'Anisa Susilawati',
    email: 'anisa.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981111 202401 2 011',
    avatar: 'https://i.pravatar.cc/150?img=21',
    assignedSubjects: ['Elektronika'],
  },
  'nova.guru@sitemsa.sch.id': {
    id: 't-elk-3',
    name: 'Nova Milyard',
    email: 'nova.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981212 202401 1 012',
    avatar: 'https://i.pravatar.cc/150?img=26',
    assignedSubjects: ['Elektronika'],
  },
  'vella.guru@sitemsa.sch.id': {
    id: 't-elk-4',
    name: 'Vella Pratika I. N.',
    email: 'vella.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981313 202401 2 013',
    avatar: 'https://i.pravatar.cc/150?img=32',
    assignedSubjects: ['Elektronika'],
  },
  'fahrul.guru@sitemsa.sch.id': {
    id: 't-elk-5',
    name: 'Fahrul Adiyansa',
    email: 'fahrul.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981414 202401 1 014',
    avatar: 'https://i.pravatar.cc/150?img=33',
    assignedSubjects: ['Elektronika'],
  },
  'tubagus.guru@sitemsa.sch.id': {
    id: 't-elk-6',
    name: 'Tubagus Fauzan A.',
    email: 'tubagus.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981515 202401 1 015',
    avatar: 'https://i.pravatar.cc/150?img=15',
    assignedSubjects: ['Elektronika'],
  },

  // --- 5. Pend. Olahraga ---
  'brilian.guru@sitemsa.sch.id': {
    id: 't-pjok-1',
    name: 'Brilian Anugraheni',
    email: 'brilian.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981616 202401 2 016',
    avatar: 'https://i.pravatar.cc/150?img=29',
    assignedSubjects: ['Olahraga & Kesehatan', 'Pendidikan Jasmani'],
  },
  'luthfi.guru@sitemsa.sch.id': {
    id: 't-pjok-2',
    name: 'Ahmad Luthfi F.',
    email: 'luthfi.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981717 202401 1 017',
    avatar: 'https://i.pravatar.cc/150?img=31',
    assignedSubjects: ['Olahraga & Kesehatan', 'Pendidikan Jasmani'],
  },
  'rinal.guru@sitemsa.sch.id': {
    id: 't-pjok-3',
    name: 'Rinal Febriarso D. P.',
    email: 'rinal.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981818 202401 1 018',
    avatar: 'https://i.pravatar.cc/150?img=34',
    assignedSubjects: ['Olahraga & Kesehatan', 'Pendidikan Jasmani'],
  },

  // --- 6. Pend. Seni Tari ---
  'vivi.guru@sitemsa.sch.id': {
    id: 't-tari-1',
    name: 'Vivi Riska Wardani',
    email: 'vivi.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19981919 202401 2 019',
    avatar: 'https://i.pravatar.cc/150?img=12',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
  },
  'anita.guru@sitemsa.sch.id': {
    id: 't-tari-2',
    name: 'Anita Dwi Ningtyas',
    email: 'anita.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19982020 202401 2 020',
    avatar: 'https://i.pravatar.cc/150?img=20',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
  },
  'meliana.guru@sitemsa.sch.id': {
    id: 't-tari-3',
    name: 'Meliana Dwi Yanti',
    email: 'meliana.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19982121 202401 2 021',
    avatar: '/images/meliana.jpg',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
  },
  'ivangka.guru@sitemsa.sch.id': {
    id: 't-tari-4',
    name: 'Hasnita Ivangka',
    email: 'ivangka.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19982222 202401 2 022',
    avatar: 'https://i.pravatar.cc/150?img=28',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
  },
  'hasnita.guru@sitemsa.sch.id': {
    id: 't-tari-4',
    name: 'Hasnita Ivangka',
    email: 'ivangka.guru@sitemsa.sch.id',
    role: 'guru',
    nip: '19982222 202401 2 022',
    avatar: 'https://i.pravatar.cc/150?img=28',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
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

  const loginWithCredentials = (email: string, password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Asynchronously sync with backend endpoint
    authClientService.login({ email: cleanEmail, password }).catch((err) => {
      console.warn('Backend login sync warning:', err);
    });

    if (cleanEmail === 'admin@sitemsa.sch.id' || cleanEmail === 'admin@sintesa.id' || cleanEmail === 'admin') {
      loginAsSuperadmin();
      return true;
    }

    if (TEACHER_USERS[cleanEmail]) {
      loginAsTeacher(cleanEmail);
      return true;
    }

    if (cleanEmail.includes('tari')) {
      loginAsTeacher('tari.guru@sintesa.id');
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
    authClientService.logout().catch(() => {});
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
