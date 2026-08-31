import { dbStore, ModuleItem } from './data-store';
import { supabase } from '@/lib/supabase';
import { generateEntityId } from '@/lib/id-generator';

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

      if (data && Array.isArray(data)) {
        const mapped: ModuleItem[] = data.map((item: any) => {
          let parsedBlocks = item.blocks;
          if (!parsedBlocks && item.content) {
            try {
              const p = JSON.parse(item.content);
              if (Array.isArray(p)) parsedBlocks = p;
            } catch {}
          }

          const idStr = String(item.id);

          // Only construct quizSource if it is genuinely configured
          let validQuizSource: any = undefined;
          if (
            item.quiz_source_type &&
            item.quiz_source_type !== 'NONE' &&
            (item.quiz_source_title || item.external_url || item.qr_image_url)
          ) {
            validQuizSource = {
              type: (item.quiz_source_type === 'KUIS_SITEMSA' ? 'kuis_sitemsa' : item.quiz_source_type === 'LINK_EKSTERNAL' ? 'link_eksternal' : 'qr_code') as any,
              title: item.quiz_source_title || 'Kuis Evaluasi',
              externalUrl: item.external_url || undefined,
              qrImageUrl: item.qr_image_url || undefined,
            };
          }

          return {
            id: idStr,
            subject: item.subject || 'Informatika',
            teacherId: item.teacher_id || 't2',
            teacherName: item.teacher_name || 'Guru Sitemsa',
            title: item.title || 'Modul Pembelajaran',
            level: (item.level as 'Pemula' | 'Menengah' | 'Mahir') || 'Pemula',
            duration: item.duration || '30 Menit',
            topics: Array.isArray(item.topics) ? item.topics : [],
            description: item.description || '',
            thumbnail: item.thumbnail || item.image_url || undefined,
            content: item.content || undefined,
            blocks: parsedBlocks,
            isAiRecommended: Boolean(item.is_ai_recommended),
            isPublished: item.is_published !== undefined ? Boolean(item.is_published) : true,
            quizSource: validQuizSource,
            createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '2026-08-01',
          };
        });

        // Merge cloud modules with locally saved modules so freshly created items are NEVER wiped out
        const mergedMap = new Map<string, ModuleItem>();
        // First set existing local modules
        (dbStore.modules || []).forEach((m) => mergedMap.set(m.id, m));
        // Then override/add cloud modules
        mapped.forEach((m) => mergedMap.set(m.id, m));

        const finalMerged = Array.from(mergedMap.values());
        dbStore.modules = finalMerged;
        this.persist();
        return finalMerged;
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

  static async createModule(data: Omit<ModuleItem, 'id' | 'createdAt'> & { id?: string }): Promise<ModuleItem> {
    this.ensureHydrated();
    const newId = data.id || generateEntityId('mod', data.subject, data.teacherId);
    const newModule: ModuleItem = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    };

    // Upsert into local dbStore
    const existingIdx = dbStore.modules.findIndex((m) => m.id === newId);
    if (existingIdx >= 0) {
      dbStore.modules[existingIdx] = newModule;
    } else {
      dbStore.modules.unshift(newModule);
      const subject = dbStore.subjects.find((s) => s.name.toLowerCase() === newModule.subject.toLowerCase());
      if (subject) {
        subject.totalModules = (subject.totalModules || 0) + 1;
      }
    }

    this.persist();

    if (supabase) {
      try {
        const payload: any = {
          id: newId,
          subject: data.subject,
          teacher_id: data.teacherId || 't2',
          teacher_name: data.teacherName || 'Guru Sitemsa',
          title: data.title,
          level: data.level || 'Pemula',
          duration: data.duration || '30 Menit',
          topics: data.topics || [],
          description: data.description || 'Deskripsi materi',
          is_published: data.isPublished !== undefined ? data.isPublished : true,
          is_ai_recommended: Boolean(data.isAiRecommended),
          quiz_source_type: data.quizSource?.type || null,
          quiz_source_title: data.quizSource?.title || null,
          external_url: data.quizSource?.externalUrl || null,
          qr_image_url: data.quizSource?.qrImageUrl || null,
          thumbnail: data.thumbnail || null,
          image_url: data.thumbnail || null,
          content: data.blocks ? JSON.stringify(data.blocks) : (data.content || data.description || ''),
        };

        const { error: insErr } = await supabase.from('modules').upsert(payload, { onConflict: 'id' });
        if (insErr) {
          console.warn('Supabase module upsert note:', insErr.message);
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
        const updatePayload: any = {
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
          quiz_source_type: updates.quizSource?.type || null,
          quiz_source_title: updates.quizSource?.title || null,
          external_url: updates.quizSource?.externalUrl || null,
          qr_image_url: updates.quizSource?.qrImageUrl || null,
          thumbnail: updates.thumbnail !== undefined ? updates.thumbnail : null,
          image_url: updates.thumbnail !== undefined ? updates.thumbnail : null,
        };

        if (updates.blocks) {
          updatePayload.content = JSON.stringify(updates.blocks);
        }

        await supabase.from('modules').update(updatePayload).eq('id', id);
      } catch (e) {
        console.warn('Failed to update module in Supabase:', e);
      }
    }

    return dbStore.modules[idx];
  }

  static async deleteModule(id: string, title?: string): Promise<boolean> {
    this.ensureHydrated();
    const moduleItem = dbStore.modules.find((m) => m.id === id || (title && m.title.trim().toLowerCase() === title.trim().toLowerCase()));
    if (moduleItem) {
      dbStore.modules = dbStore.modules.filter((m) => m.id !== moduleItem.id);
      // Decrement subject count
      const subject = dbStore.subjects.find((s) => s.name.toLowerCase() === moduleItem.subject.toLowerCase());
      if (subject && subject.totalModules > 0) {
        subject.totalModules -= 1;
      }
      this.persist();
    }

    if (supabase) {
      try {
        await supabase.from('modules').delete().eq('id', id);
        if (title) {
          await supabase.from('modules').delete().eq('title', title);
        }
      } catch (e) {
        console.warn('Failed to delete module in Supabase:', e);
      }
    }

    return true;
  }
}
