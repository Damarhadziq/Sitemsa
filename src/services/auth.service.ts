import { dbStore, TeacherAccount } from './data-store';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'guru' | 'siswa';
  avatar?: string;
  nip?: string;
  nisn?: string;
  assignedSubjects?: string[];
}

export class AuthService {
  static login(email: string, password?: string): UserSession | null {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail) return null;

    // 1. Strict Superadmin Authentication
    const isSuperadminEmail =
      cleanEmail === 'admin@sintesa.id' ||
      cleanEmail === 'admin@sitemsa.sch.id' ||
      cleanEmail === 'superadmin@sitemsa.sch.id' ||
      cleanEmail === 'superadmin@sintesa.id';

    const isValidSuperadminPassword =
      cleanPassword === 'admin123' ||
      cleanPassword === 'admin' ||
      cleanPassword === 'SitemsaAdmin#2026' ||
      cleanPassword === 'SintesaAdmin#2026';

    if (isSuperadminEmail) {
      if (!isValidSuperadminPassword) return null;
      return {
        id: 'sa-1',
        name: 'Super Administrator Sitemsa',
        email: cleanEmail,
        role: 'superadmin',
        avatar: 'https://i.pravatar.cc/150?img=68',
      };
    }

    // 2. Strict Teacher in DB Store
    const isValidTeacherPassword =
      cleanPassword === 'admin123' ||
      cleanPassword === 'GuruSitemsa#2026' ||
      cleanPassword === 'guru123' ||
      cleanPassword === '123456';

    const teacher = dbStore.teachers.find(
      (t) => t.email.toLowerCase() === cleanEmail
    );

    if (teacher) {
      if (!isValidTeacherPassword) return null;
      return {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: 'guru',
        nip: teacher.nip,
        avatar: teacher.avatar,
        assignedSubjects: teacher.assignedSubjects,
      };
    }

    // 3. Strict Student in DB Store
    const student = dbStore.students.find((s) => s.email.toLowerCase() === cleanEmail);
    if (student) {
      const isStudentPasswordValid =
        cleanPassword === 'SiswaSitemsa#2026' ||
        cleanPassword === 'admin123' ||
        cleanPassword === '123456';

      if (!isStudentPasswordValid) return null;
      return {
        id: student.id,
        name: student.name,
        email: cleanEmail,
        role: 'siswa',
        nisn: student.nisn,
        avatar: student.avatar,
      };
    }

    return null;
  }

  static getProfileById(userId: string): UserSession | null {
    if (userId === 'sa-1') {
      return {
        id: 'sa-1',
        name: 'Super Administrator Sitemsa',
        email: 'admin@sitemsa.sch.id',
        role: 'superadmin',
        avatar: 'https://i.pravatar.cc/150?img=68',
      };
    }

    const teacher = dbStore.teachers.find((t) => t.id === userId);
    if (teacher) {
      return {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: 'guru',
        nip: teacher.nip,
        avatar: teacher.avatar,
        assignedSubjects: teacher.assignedSubjects,
      };
    }

    const student = dbStore.students.find((s) => s.id === userId);
    if (student) {
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'siswa',
        nisn: student.nisn,
        avatar: student.avatar,
      };
    }

    return null;
  }
}
