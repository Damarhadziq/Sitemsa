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
    void password;
    const cleanEmail = email.trim().toLowerCase();

    // Check Superadmin
    if (cleanEmail === 'admin@sintesa.id' || cleanEmail === 'admin@sitemsa.sch.id') {
      return {
        id: 'sa-1',
        name: 'Super Administrator Sitemsa',
        email: cleanEmail,
        role: 'superadmin',
        avatar: 'https://i.pravatar.cc/150?img=68',
      };
    }

    // Check Teacher in DB Store
    const teacher = dbStore.teachers.find(
      (t) =>
        t.email.toLowerCase() === cleanEmail ||
        cleanEmail.startsWith('budi.guru') ||
        cleanEmail.startsWith('siti.guru') ||
        cleanEmail.startsWith('ahmad.guru') ||
        cleanEmail.startsWith('tari.guru') ||
        cleanEmail.includes('tari')
    );

    if (teacher || cleanEmail.includes('guru') || cleanEmail.includes('tari')) {
      const activeTeacher: TeacherAccount = teacher || dbStore.teachers.find((t) => t.id === 't-5') || dbStore.teachers[0];
      return {
        id: activeTeacher.id,
        name: activeTeacher.name,
        email: activeTeacher.email,
        role: 'guru',
        nip: activeTeacher.nip,
        avatar: activeTeacher.avatar,
        assignedSubjects: activeTeacher.assignedSubjects,
      };
    }

    // Check Student in DB Store
    const student = dbStore.students.find((s) => s.email.toLowerCase() === cleanEmail) || dbStore.students[0];
    return {
      id: student.id,
      name: student.name,
      email: cleanEmail,
      role: 'siswa',
      nisn: student.nisn,
      avatar: student.avatar,
    };
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
