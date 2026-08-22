import { dbStore, QuizItem, QuizQuestion } from './data-store';

export interface QuizQuestionInput {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizCreateInput {
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
  static getAllQuizzes(filter?: { subject?: string; teacherId?: string; publishedOnly?: boolean }): QuizItem[] {
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
    const quiz = dbStore.quizzes.find((q) => q.id === id);
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

  static createQuiz(data: QuizCreateInput): QuizItem {
    const newId = `quiz-${Date.now()}`;
    const formattedQuestions: QuizQuestion[] = data.questions.map((q, idx) => ({
      id: q.id || `q-${idx + 1}-${Date.now()}`,
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

    return newQuiz;
  }

  static updateQuiz(id: string, updates: Partial<Omit<QuizItem, 'questions'>> & { questions?: QuizQuestionInput[] }): QuizItem | null {
    const idx = dbStore.quizzes.findIndex((q) => q.id === id);
    if (idx === -1) return null;

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

    return dbStore.quizzes[idx];
  }

  static deleteQuiz(id: string): boolean {
    const quiz = dbStore.quizzes.find((q) => q.id === id);
    if (!quiz) return false;

    const initialLen = dbStore.quizzes.length;
    dbStore.quizzes = dbStore.quizzes.filter((q) => q.id !== id);

    // Decrement subject count
    const subject = dbStore.subjects.find((s) => s.name.toLowerCase() === quiz.subject.toLowerCase());
    if (subject && subject.totalQuizzes > 0) {
      subject.totalQuizzes -= 1;
    }

    return dbStore.quizzes.length < initialLen;
  }
}
