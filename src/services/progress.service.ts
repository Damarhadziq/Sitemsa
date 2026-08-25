import { dbStore, StudentRecord } from './data-store';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'sintesa_students_progress_data';

export class ProgressService {
  private static ensureHydrated() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbStore.students = parsed;
          }
        }
      } catch (e) {
        console.error('Error hydrating students progress:', e);
      }
    }
  }

  private static persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbStore.students));
      } catch (e) {
        console.error('Error persisting students progress:', e);
      }
    }
  }

  static getAllStudents(): StudentRecord[] {
    this.ensureHydrated();
    return dbStore.students;
  }

  static getStudentById(id: string): StudentRecord | null {
    this.ensureHydrated();
    return dbStore.students.find((s) => s.id === id) || null;
  }

  static updateProgress(studentId: string, subject: string, progress: number): StudentRecord | null {
    this.ensureHydrated();
    const student = dbStore.students.find((s) => s.id === studentId);
    if (!student) return null;

    student.moduleProgress[subject] = Math.min(100, Math.max(0, progress));
    student.lastActive = 'Baru saja';
    this.persist();
    return student;
  }

  static recordQuizAttempt(studentId: string, attempt: {
    quizId: string;
    quizTitle: string;
    subject: string;
    score: number;
    maxScore: number;
    status: 'Lulus' | 'Perlu Bimbingan';
  }) {
    this.ensureHydrated();
    const student = dbStore.students.find((s) => s.id === studentId);
    const newAttemptId = `qh-${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0];

    if (student) {
      student.quizHistory.unshift({
        id: newAttemptId,
        ...attempt,
        date: dateStr,
      });
      student.lastActive = 'Baru saja';
      this.persist();
    }

    // Direct Supabase record insert
    if (supabase) {
      supabase.from('quiz_attempts').insert({
        id: newAttemptId,
        student_id: studentId,
        quiz_id: attempt.quizId,
        quiz_title: attempt.quizTitle,
        subject: attempt.subject,
        score: attempt.score,
        max_score: attempt.maxScore || 100,
        status: attempt.status,
      }).then(({ error }) => {
        if (error) console.warn('Supabase quiz_attempts insert warning:', error.message);
      });
    }
  }

  static getMonitoringSummary(subjectFilter?: string) {
    this.ensureHydrated();
    const allStudents = dbStore.students;
    const totalStudents = allStudents.length;

    let relevantAttempts = allStudents.flatMap((s) => s.quizHistory);
    if (subjectFilter) {
      relevantAttempts = relevantAttempts.filter((qh) => qh.subject.toLowerCase() === subjectFilter.toLowerCase());
    }

    const totalQuizzesTaken = relevantAttempts.length;
    const passedCount = relevantAttempts.filter((a) => a.status === 'Lulus').length;
    const passRate = totalQuizzesTaken > 0 ? Math.round((passedCount / totalQuizzesTaken) * 100) : 0;

    const avgScore =
      totalQuizzesTaken > 0
        ? Math.round(relevantAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzesTaken)
        : 0;

    return {
      totalStudents,
      totalQuizzesTaken,
      passRate,
      averageScore: avgScore,
      students: allStudents,
    };
  }
}
