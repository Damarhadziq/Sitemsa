import { dbStore, StudentRecord } from './data-store';

export class ProgressService {
  static getAllStudents(): StudentRecord[] {
    return dbStore.students;
  }

  static getStudentById(id: string): StudentRecord | null {
    return dbStore.students.find((s) => s.id === id) || null;
  }

  static updateProgress(studentId: string, subject: string, progress: number): StudentRecord | null {
    const student = dbStore.students.find((s) => s.id === studentId);
    if (!student) return null;

    student.moduleProgress[subject] = Math.min(100, Math.max(0, progress));
    student.lastActive = 'Baru saja';
    return student;
  }

  static getMonitoringSummary(subjectFilter?: string) {
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
