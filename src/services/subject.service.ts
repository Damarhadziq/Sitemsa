import { dbStore, SubjectItem } from './data-store';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'sintesa_subjects_cache_v1';

export class SubjectService {
  private static ensureHydrated() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbStore.subjects = parsed;
          }
        }
      } catch (e) {
        console.error('Error hydrating subjects:', e);
      }
    }
  }

  private static persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbStore.subjects));
      } catch (e) {
        console.error('Error persisting subjects:', e);
      }
    }
  }

  static async fetchFromSupabase(): Promise<SubjectItem[]> {
    this.ensureHydrated();
    if (!supabase) return this.getAllSubjects();

    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase subjects fetch warning:', error.message);
        return this.getAllSubjects();
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const mapped: SubjectItem[] = data.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          code: item.code || item.name.substring(0, 3).toUpperCase(),
          category: item.category || 'Vokasi',
          description: item.description || '',
          iconName: item.icon_name || 'BookOpen',
          isActive: item.is_active !== undefined ? Boolean(item.is_active) : true,
          totalModules: Number(item.total_modules) || 0,
          totalQuizzes: Number(item.total_quizzes) || 0,
        }));

        dbStore.subjects = mapped;
        this.persist();
        return this.getAllSubjects();
      }
    } catch (e) {
      console.warn('Supabase subjects exception:', e);
    }

    return this.getAllSubjects();
  }

  static getAllSubjects(): SubjectItem[] {
    this.ensureHydrated();
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
    this.ensureHydrated();
    const sub = dbStore.subjects.find((s) => s.id === id);
    if (!sub) return null;
    return sub;
  }

  static async createSubject(data: Omit<SubjectItem, 'id' | 'totalModules' | 'totalQuizzes'>): Promise<SubjectItem> {
    this.ensureHydrated();
    const newId = `sub-${Date.now()}`;
    const newSubject: SubjectItem = {
      id: newId,
      ...data,
      totalModules: 0,
      totalQuizzes: 0,
      isActive: true,
    };
    dbStore.subjects.unshift(newSubject);
    this.persist();

    if (supabase) {
      try {
        await supabase.from('subjects').insert({
          id: newId,
          name: data.name,
          code: data.code,
          category: data.category,
          description: data.description,
          icon_name: data.iconName,
          is_active: true,
          total_modules: 0,
          total_quizzes: 0,
        });
      } catch (e) {
        console.warn('Failed to insert subject to Supabase:', e);
      }
    }

    return newSubject;
  }

  static async updateSubject(id: string, updates: Partial<SubjectItem>): Promise<SubjectItem | null> {
    this.ensureHydrated();
    const idx = dbStore.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    dbStore.subjects[idx] = { ...dbStore.subjects[idx], ...updates };
    this.persist();

    if (supabase) {
      try {
        await supabase.from('subjects').update({
          name: updates.name,
          code: updates.code,
          category: updates.category,
          description: updates.description,
          icon_name: updates.iconName,
          is_active: updates.isActive,
        }).eq('id', id);
      } catch (e) {
        console.warn('Failed to update subject in Supabase:', e);
      }
    }

    return dbStore.subjects[idx];
  }

  static async deleteSubject(id: string): Promise<boolean> {
    this.ensureHydrated();
    const initialLen = dbStore.subjects.length;
    dbStore.subjects = dbStore.subjects.filter((s) => s.id !== id);
    this.persist();

    if (supabase) {
      try {
        await supabase.from('subjects').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete subject in Supabase:', e);
      }
    }

    return dbStore.subjects.length < initialLen;
  }
}
