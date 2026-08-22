import { dbStore, TeacherAccount } from './data-store';

export class TeacherService {
  static getAllTeachers(): TeacherAccount[] {
    return dbStore.teachers;
  }

  static getTeacherById(id: string): TeacherAccount | null {
    return dbStore.teachers.find((t) => t.id === id) || null;
  }

  static createTeacher(data: Omit<TeacherAccount, 'id' | 'createdAt'>): TeacherAccount {
    const newId = `t-${Date.now()}`;
    const newTeacher: TeacherAccount = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
    };
    dbStore.teachers.unshift(newTeacher);
    return newTeacher;
  }

  static updateTeacher(id: string, updates: Partial<TeacherAccount>): TeacherAccount | null {
    const idx = dbStore.teachers.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    dbStore.teachers[idx] = { ...dbStore.teachers[idx], ...updates };
    return dbStore.teachers[idx];
  }

  static deleteTeacher(id: string): boolean {
    const initialLen = dbStore.teachers.length;
    dbStore.teachers = dbStore.teachers.filter((t) => t.id !== id);
    return dbStore.teachers.length < initialLen;
  }

  static assignSubjects(teacherId: string, assignedSubjects: string[]): TeacherAccount | null {
    const teacher = dbStore.teachers.find((t) => t.id === teacherId);
    if (!teacher) return null;
    teacher.assignedSubjects = assignedSubjects;
    return teacher;
  }
}
