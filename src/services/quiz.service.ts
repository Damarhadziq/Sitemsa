import { dbStore, QuizItem, QuizQuestion } from './data-store';
import { supabase } from '@/lib/supabase';
import { generateEntityId } from '@/lib/id-generator';
import { toDeterministicUUID } from '@/lib/uuid';

const STORAGE_KEY = 'sintesa_quizzes_cache_v1';

export interface QuizQuestionInput {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizCreateInput {
  id?: string;
  subject: string;
  title: string;
  duration?: string;
  passScore?: number;
  questions: QuizQuestionInput[];
  teacherId?: string;
  teacherName?: string;
  published?: boolean;
}

export class QuizService {
  private static ensureHydrated() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbStore.quizzes = parsed;
          }
        }
      } catch (e) {
        console.error('Error hydrating quizzes:', e);
      }
    }
  }

  private static persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbStore.quizzes));
      } catch (e) {
        console.error('Error persisting quizzes:', e);
      }
    }
  }

  static async fetchFromSupabase(): Promise<QuizItem[]> {
    this.ensureHydrated();
    if (!supabase) return dbStore.quizzes;

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase quizzes fetch warning:', error.message);
        return dbStore.quizzes;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const uniqueMap = new Map<string, QuizItem>();

        data.forEach((item: any) => {
          const titleKey = `${(item.subject || '').toLowerCase().trim()}_${(item.title || '').toLowerCase().trim()}`;
          if (!uniqueMap.has(titleKey)) {
            uniqueMap.set(titleKey, {
              id: String(item.id),
              subject: item.subject || 'Informatika',
              title: item.title || 'Kuis Evaluasi',
              duration: item.duration || '30 Menit',
              passScore: Number(item.pass_score) || 75,
              teacherId: item.teacher_id || 't-1',
              teacherName: item.teacher_name || 'Pengajar Sitemsa',
              questions: Array.isArray(item.questions) ? item.questions : [],
              questionCount: Array.isArray(item.questions) ? item.questions.length : Number(item.question_count) || 0,
              createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '2026-08-01',
              published: item.published !== undefined ? Boolean(item.published) : true,
            });
          }
        });

        // Merge cloud quizzes with locally saved quizzes (deduplicating by subject + title)
        const mergedMap = new Map<string, QuizItem>();
        (dbStore.quizzes || []).forEach((q) => {
          const titleKey = `${(q.subject || '').toLowerCase().trim()}_${(q.title || '').toLowerCase().trim()}`;
          mergedMap.set(titleKey, q);
        });
        Array.from(uniqueMap.values()).forEach((q) => {
          const titleKey = `${(q.subject || '').toLowerCase().trim()}_${(q.title || '').toLowerCase().trim()}`;
          mergedMap.set(titleKey, q);
        });

        const finalMerged = Array.from(mergedMap.values());
        dbStore.quizzes = finalMerged;
        this.persist();
        return finalMerged;
      }
    } catch (e) {
      console.warn('Supabase quizzes exception:', e);
    }

    return dbStore.quizzes;
  }

  static getAllQuizzes(filter?: { subject?: string; teacherId?: string; publishedOnly?: boolean }): QuizItem[] {
    this.ensureHydrated();
    let result = dbStore.quizzes;

    if (filter?.subject) {
      result = result.filter((q) => q.subject.toLowerCase() === filter.subject?.toLowerCase());
    }

    if (filter?.teacherId) {
      result = result.filter((q) => q.teacherId === filter.teacherId);
    }

    if (filter?.publishedOnly) {
      result = result.filter((q) => q.published);
    }

    return result;
  }

  static getQuizById(id: string, role?: string): QuizItem | null {
    this.ensureHydrated();
    const cleanId = String(id || '').trim().toLowerCase();
    const quiz = dbStore.quizzes.find((q) => q.id === id || toDeterministicUUID(q.id) === cleanId || String(q.id).toLowerCase() === cleanId);
    if (!quiz) return null;

    // Mask answers for student roles to prevent cheat inspection
    if (role === 'siswa') {
      return {
        ...quiz,
        questions: quiz.questions.map((q) => ({
          ...q,
          correctAnswer: -1,
          explanation: '',
        })),
      };
    }

    return quiz;
  }

  static async createQuiz(data: QuizCreateInput): Promise<QuizItem> {
    this.ensureHydrated();
    const newId = data.id || generateEntityId('quiz', data.subject, data.teacherId);
    const formattedQuestions: QuizQuestion[] = data.questions.map((q, idx) => ({
      id: q.id || generateEntityId('q', data.subject, data.teacherId),
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
    }));

    const newQuiz: QuizItem = {
      id: newId,
      subject: data.subject,
      title: data.title,
      duration: data.duration || '30 Menit',
      passScore: data.passScore ?? 75,
      teacherId: data.teacherId || 't-1',
      teacherName: data.teacherName || 'Pengajar Sitemsa',
      questions: formattedQuestions,
      questionCount: formattedQuestions.length,
      createdAt: new Date().toISOString().split('T')[0],
      published: data.published !== undefined ? data.published : true,
    };

    dbStore.quizzes.unshift(newQuiz);

    // Update subject quiz count
    const subject = dbStore.subjects.find((s) => s.name.toLowerCase() === newQuiz.subject.toLowerCase());
    if (subject) {
      subject.totalQuizzes = (subject.totalQuizzes || 0) + 1;
    }

    this.persist();

    if (supabase) {
      try {
        const { error: insErr } = await supabase.from('quizzes').upsert({
          id: newId,
          subject: newQuiz.subject,
          title: newQuiz.title,
          duration: newQuiz.duration,
          pass_score: newQuiz.passScore,
          teacher_id: newQuiz.teacherId,
          teacher_name: newQuiz.teacherName,
          questions: newQuiz.questions,
          published: newQuiz.published,
        }, { onConflict: 'id' });

        if (insErr) {
          console.warn('Supabase full quiz upsert note, trying minimal columns:', insErr.message);
          await supabase.from('quizzes').upsert({
            id: newId,
            subject: newQuiz.subject,
            title: newQuiz.title,
            teacher_id: newQuiz.teacherId,
            teacher_name: newQuiz.teacherName,
          }, { onConflict: 'id' });
        }
      } catch (e) {
        console.warn('Failed to upsert quiz to Supabase:', e);
      }
    }

    return newQuiz;
  }

  static async updateQuiz(id: string, updates: Partial<Omit<QuizItem, 'questions'>> & { questions?: QuizQuestionInput[] }): Promise<QuizItem | null> {
    this.ensureHydrated();
    const cleanId = String(id || '').trim().toLowerCase();
    const idx = dbStore.quizzes.findIndex((q) => q.id === id || toDeterministicUUID(q.id) === cleanId || String(q.id).toLowerCase() === cleanId);
    if (idx !== -1) {
      const current = dbStore.quizzes[idx];
      const newQuestions: QuizQuestion[] = updates.questions
        ? updates.questions.map((q, qIdx) => ({
            id: q.id || `q-${qIdx + 1}-${Date.now()}`,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
          }))
        : current.questions;

      dbStore.quizzes[idx] = {
        ...current,
        ...updates,
        questions: newQuestions,
        questionCount: newQuestions.length,
      };
      this.persist();
    }

    if (supabase) {
      try {
        const actualId = idx !== -1 ? dbStore.quizzes[idx].id : id;
        await supabase.from('quizzes').update({
          ...(updates.title && { title: updates.title }),
          ...(updates.subject && { subject: updates.subject }),
          ...(updates.duration && { duration: updates.duration }),
          ...(updates.passScore !== undefined && { pass_score: updates.passScore }),
          ...(updates.questions && { questions: updates.questions }),
          ...(updates.published !== undefined && { published: updates.published }),
        }).eq('id', actualId);
      } catch (e) {
        console.warn('Failed to update quiz in Supabase:', e);
      }
    }

    return dbStore.quizzes[idx] || null;
  }

  static async deleteQuiz(id: string): Promise<boolean> {
    this.ensureHydrated();
    const cleanId = String(id || '').trim().toLowerCase();
    const idx = dbStore.quizzes.findIndex((q) => q.id === id || toDeterministicUUID(q.id) === cleanId || String(q.id).toLowerCase() === cleanId);
    let deletedId = id;
    if (idx !== -1) {
      const quiz = dbStore.quizzes[idx];
      deletedId = quiz.id;
      dbStore.quizzes.splice(idx, 1);
      // Decrement subject count
      const subject = dbStore.subjects.find((s) => s.name.toLowerCase() === quiz.subject.toLowerCase());
      if (subject && subject.totalQuizzes > 0) {
        subject.totalQuizzes -= 1;
      }
      this.persist();
    }

    if (supabase) {
      try {
        await supabase.from('quizzes').delete().eq('id', deletedId);
      } catch (e) {
        console.warn('Failed to delete quiz in Supabase:', e);
      }
    }

    return idx !== -1;
  }
}
