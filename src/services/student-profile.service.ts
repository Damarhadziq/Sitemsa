'use client';

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
}

const STUDENT_PROFILE_STORAGE_KEY = 'sintesa_student_profile_v1';

export const DEFAULT_DUMMY_STUDENT: StudentProfile = {
  id: 'std-1',
  name: 'Budi Santoso',
  email: 'budi@siswa.belajar.id',
  school: 'SMKN 1 Semarang',
  nisn: '0084920194',
  grade: 'XI PPLG 1',
  avatar: 'https://i.pravatar.cc/150?img=12',
  bio: 'Siswa SMK Negeri 1 Semarang peminat rekayasa perangkat lunak dan teknologi web interaktif.',
  phone: '081234567890',
};

export const getStudentProfile = (): StudentProfile => {
  if (typeof window === 'undefined') return DEFAULT_DUMMY_STUDENT;
  try {
    const raw = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_DUMMY_STUDENT));
      return DEFAULT_DUMMY_STUDENT;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DUMMY_STUDENT;
  }
};

export const saveStudentProfile = (profile: Partial<StudentProfile>): StudentProfile => {
  if (typeof window === 'undefined') return DEFAULT_DUMMY_STUDENT;
  const current = getStudentProfile();
  const updated: StudentProfile = {
    ...current,
    ...profile,
  };
  try {
    localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sintesa-student-profile-updated', { detail: updated }));
  } catch (e) {
    console.error(e);
  }
  return updated;
};
