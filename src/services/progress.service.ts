import { dbStore, StudentRecord } from './data-store';
import { supabase } from '@/lib/supabase';
import { isDummyStudent } from './student-profile.service';

const STORAGE_KEY = 'sintesa_students_progress_data';

export class ProgressService {
  private static ensureHydrated() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleaned = parsed.filter((s: any) => !isDummyStudent(s));
            dbStore.students = cleaned;
            if (cleaned.length !== parsed.length) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
            }
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
    return dbStore.students.find((s) => s.id === id || s.email === id) || null;
  }

  static getOrCreateStudent(studentId: string, studentName?: string, studentEmail?: string, avatar?: string): StudentRecord {
    this.ensureHydrated();
    let student = dbStore.students.find((s) => s.id === studentId || s.email === studentId || (studentEmail && s.email === studentEmail));
    if (!student) {
      const newStudent: StudentRecord = {
        id: studentId,
        nisn: '-',
        name: studentName || 'Siswa Sitemsa',
        email: studentEmail || studentId,
        classGroup: 'X PPLG 1',
        avatar: avatar || `https://i.pravatar.cc/150?u=${studentId}`,
        lastActive: 'Baru saja',
        enrolledSubjects: ['Informatika', 'Elektronika', 'Otomotif', 'Bimbingan Konseling', 'Seni Tari', 'Keolahragaan'],
        moduleProgress: {},
        quizHistory: [],
      };
      dbStore.students.unshift(newStudent);
      this.persist();
      return newStudent;
    }
    return student;
  }

  static updateProgress(studentId: string, subject: string, progress: number, studentName?: string, studentEmail?: string): StudentRecord {
    this.ensureHydrated();
    const student = this.getOrCreateStudent(studentId, studentName, studentEmail);

    student.moduleProgress[subject] = Math.min(100, Math.max(0, progress));
    student.lastActive = 'Baru saja';
    this.persist();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sintesa-student-progress-updated', { detail: { studentId, subject, progress } }));
    }

    return student;
  }

  static recordQuizAttempt(studentId: string, attempt: {
    quizId: string;
    quizTitle: string;
    subject: string;
    score: number;
    maxScore: number;
    status: 'Lulus' | 'Perlu Bimbingan';
  }, studentName?: string, studentEmail?: string) {
    this.ensureHydrated();
    const student = this.getOrCreateStudent(studentId, studentName, studentEmail);
    const newAttemptId = `qh-${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0];

    student.quizHistory.unshift({
      id: newAttemptId,
      ...attempt,
      date: dateStr,
    });
    student.lastActive = 'Baru saja';
    this.persist();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sintesa-student-quiz-recorded', { detail: { studentId, ...attempt } }));
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
