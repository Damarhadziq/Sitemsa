import { dbStore, SubjectItem } from './data-store';

export class SubjectService {
  static getAllSubjects(): SubjectItem[] {
    return dbStore.subjects.map((sub) => {
      const moduleCount = dbStore.modules.filter((m) => m.subject.toLowerCase() === sub.name.toLowerCase()).length;
      const quizCount = dbStore.quizzes.filter((q) => q.subject.toLowerCase() === sub.name.toLowerCase()).length;
      return {
        ...sub,
        totalModules: moduleCount > 0 ? moduleCount : sub.totalModules,
        totalQuizzes: quizCount > 0 ? quizCount : sub.totalQuizzes,
      };
    });
  }

  static getSubjectById(id: string): SubjectItem | null {
    const sub = dbStore.subjects.find((s) => s.id === id);
    if (!sub) return null;
    return sub;
  }

  static createSubject(data: Omit<SubjectItem, 'id' | 'totalModules' | 'totalQuizzes'>): SubjectItem {
    const newId = `sub-${Date.now()}`;
    const newSubject: SubjectItem = {
      id: newId,
      ...data,
      totalModules: 0,
      totalQuizzes: 0,
      isActive: true,
    };
    dbStore.subjects.unshift(newSubject);
    return newSubject;
  }

  static updateSubject(id: string, updates: Partial<SubjectItem>): SubjectItem | null {
    const idx = dbStore.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    dbStore.subjects[idx] = { ...dbStore.subjects[idx], ...updates };
    return dbStore.subjects[idx];
  }

  static deleteSubject(id: string): boolean {
    const initialLen = dbStore.subjects.length;
    dbStore.subjects = dbStore.subjects.filter((s) => s.id !== id);
    return dbStore.subjects.length < initialLen;
  }
}
