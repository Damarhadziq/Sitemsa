import { dbStore, ModuleItem } from './data-store';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'sintesa_modules_cache_v1';

export class ModuleService {
  private static ensureHydrated() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbStore.modules = parsed;
          }
        }
      } catch (e) {
        console.error('Error hydrating modules:', e);
      }
    }
  }

  private static persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbStore.modules));
      } catch (e) {
        console.error('Error persisting modules:', e);
      }
    }
  }

  static async fetchFromSupabase(): Promise<ModuleItem[]> {
    this.ensureHydrated();
    if (!supabase) return dbStore.modules;

    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase modules fetch warning:', error.message);
        return dbStore.modules;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const uniqueMap = new Map<string, ModuleItem>();

        data.forEach((item: any) => {
          const titleKey = `${(item.subject || '').toLowerCase().trim()}_${(item.title || '').toLowerCase().trim()}`;
          if (!uniqueMap.has(titleKey)) {
            uniqueMap.set(titleKey, {
              id: String(item.id),
              subject: item.subject || 'Informatika',
              teacherId: item.teacher_id || 'tch-01',
              teacherName: item.teacher_name || 'Guru Sitemsa',
              title: item.title || 'Modul Pembelajaran',
              level: (item.level as 'Pemula' | 'Menengah' | 'Mahir') || 'Pemula',
              duration: item.duration || '45 Menit',
              topics: Array.isArray(item.topics) ? item.topics : [],
              description: item.description || '',
              isAiRecommended: Boolean(item.is_ai_recommended),
              isPublished: item.is_published !== undefined ? Boolean(item.is_published) : true,
              quizSource: item.quiz_source_type ? {
                type: (item.quiz_source_type === 'KUIS_SITEMSA' ? 'kuis_sitemsa' : item.quiz_source_type === 'LINK_EKSTERNAL' ? 'link_eksternal' : 'qr_code') as any,
                title: item.quiz_source_title || 'Kuis Evaluasi',
                externalUrl: item.external_url || undefined,
                qrImageUrl: item.qr_image_url || undefined,
              } : undefined,
              createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '2026-08-01',
            });
          }
        });

        const mapped = Array.from(uniqueMap.values());
        dbStore.modules = mapped;
        this.persist();
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase modules exception:', e);
    }

    return dbStore.modules;
  }

  static getAllModules(filter?: { subject?: string; level?: string; teacherId?: string }): ModuleItem[] {
    this.ensureHydrated();
    let result = dbStore.modules;

    if (filter?.subject) {
      result = result.filter((m) => m.subject.toLowerCase() === filter.subject?.toLowerCase());
    }

    if (filter?.level) {
      result = result.filter((m) => m.level === filter.level);
    }

    if (filter?.teacherId) {
      result = result.filter((m) => m.teacherId === filter.teacherId);
    }

    return result;
  }

  static getModuleById(id: string): ModuleItem | null {
    this.ensureHydrated();
    return dbStore.modules.find((m) => m.id === id) || null;
  }

  static async createModule(data: Omit<ModuleItem, 'id' | 'createdAt'>): Promise<ModuleItem> {
    this.ensureHydrated();
    const newId = `mod-${Date.now()}`;
    const newModule: ModuleItem = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    };
    dbStore.modules.unshift(newModule);

    // Automatically update subject module count
    const subject = dbStore.subjects.find((s) => s.name.toLowerCase() === newModule.subject.toLowerCase());
    if (subject) {
      subject.totalModules = (subject.totalModules || 0) + 1;
    }

    this.persist();

    if (supabase) {
      try {
        const { error: insErr } = await supabase.from('modules').upsert({
          id: newId,
          subject: data.subject,
          teacher_id: data.teacherId || 't-olr-1',
          teacher_name: data.teacherName || 'Guru Sitemsa',
          title: data.title,
          level: data.level || 'Pemula',
          duration: data.duration || '30 Menit',
          topics: data.topics || [],
          description: data.description || '',
          is_published: data.isPublished !== undefined ? data.isPublished : true,
        }, { onConflict: 'id' });

        if (insErr) {
          console.warn('Supabase full upsert note, trying minimal columns:', insErr.message);
          const { error: minErr } = await supabase.from('modules').upsert({
            id: newId,
            subject: data.subject,
            teacher_id: data.teacherId || 't-olr-1',
            teacher_name: data.teacherName || 'Guru Sitemsa',
            title: data.title,
          }, { onConflict: 'id' });
          if (minErr) {
            console.error('Supabase minimal upsert note:', minErr.message);
          }
        }
      } catch (e) {
        console.warn('Failed to upsert module to Supabase:', e);
      }
    }

    return newModule;
  }

  static async updateModule(id: string, updates: Partial<ModuleItem>): Promise<ModuleItem | null> {
    this.ensureHydrated();
    const idx = dbStore.modules.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    dbStore.modules[idx] = { ...dbStore.modules[idx], ...updates };
    this.persist();

    if (supabase) {
      try {
        await supabase.from('modules').update({
          subject: updates.subject,
          teacher_id: updates.teacherId,
          teacher_name: updates.teacherName,
          title: updates.title,
          level: updates.level,
          duration: updates.duration,
          topics: updates.topics,
          description: updates.description,
          is_ai_recommended: updates.isAiRecommended,
          is_published: updates.isPublished,
          quiz_source_type: updates.quizSource?.type,
          quiz_source_title: updates.quizSource?.title,
          external_url: updates.quizSource?.externalUrl,
          qr_image_url: updates.quizSource?.qrImageUrl,
        }).eq('id', id);
      } catch (e) {
        console.warn('Failed to update module in Supabase:', e);
      }
    }

    return dbStore.modules[idx];
  }

  static async deleteModule(id: string): Promise<boolean> {
    this.ensureHydrated();
    const moduleItem = dbStore.modules.find((m) => m.id === id);
    if (moduleItem) {
      dbStore.modules = dbStore.modules.filter((m) => m.id !== id);
      // Decrement subject count
      const subject = dbStore.subjects.find((s) => s.name.toLowerCase() === moduleItem.subject.toLowerCase());
      if (subject && subject.totalModules > 0) {
        subject.totalModules -= 1;
      }
      this.persist();
    }

    if (supabase) {
      try {
        const { error } = await supabase.from('modules').delete().eq('id', id);
        if (error) {
          console.warn('Supabase delete module warning:', error.message);
        }
      } catch (e) {
        console.warn('Failed to delete module in Supabase:', e);
      }
    }

    return true;
  }
}
