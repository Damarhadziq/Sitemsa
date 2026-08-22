import { dbStore } from './data-store';

export interface QuizSubmissionPayload {
  studentId: string;
  answers: {
    questionId: string;
    selectedAnswer: number;
  }[];
}

export interface QuizResultReport {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passScore: number;
  status: 'Lulus' | 'Perlu Bimbingan';
  totalQuestions: number;
  correctAnswersCount: number;
  details: {
    questionId: string;
    questionText: string;
    options: string[];
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export class GradingService {
  static evaluateSubmission(quizId: string, payload: QuizSubmissionPayload): QuizResultReport {
    const quiz = dbStore.quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      throw new Error(`Kuis dengan ID ${quizId} tidak ditemukan.`);
    }

    let correctCount = 0;
    const details = quiz.questions.map((q) => {
      const studentAns = payload.answers.find((a) => a.questionId === q.id);
      const userSelected = studentAns !== undefined ? studentAns.selectedAnswer : -1;
      const isCorrect = userSelected === q.correctAnswer;

      if (isCorrect) {
        correctCount += 1;
      }

      return {
        questionId: q.id,
        questionText: q.text,
        options: q.options,
        userAnswer: userSelected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = quiz.questions.length || 1;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const status: 'Lulus' | 'Perlu Bimbingan' = percentage >= quiz.passScore ? 'Lulus' : 'Perlu Bimbingan';
    const attemptId = `qh-${Date.now()}`;

    // Record in Student Record
    const student = dbStore.students.find((s) => s.id === payload.studentId) || dbStore.students[0];
    if (student) {
      student.quizHistory.unshift({
        id: attemptId,
        subject: quiz.subject,
        quizTitle: quiz.title,
        score: percentage,
        maxScore: 100,
        date: new Date().toISOString().split('T')[0],
        status,
      });

      // Update module / subject progress
      const currentProgress = student.moduleProgress[quiz.subject] || 0;
      student.moduleProgress[quiz.subject] = Math.min(100, Math.max(currentProgress, percentage));
    }

    return {
      attemptId,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      studentId: payload.studentId,
      score: percentage,
      maxScore: 100,
      percentage,
      passScore: quiz.passScore,
      status,
      totalQuestions,
      correctAnswersCount: correctCount,
      details,
    };
  }
}
