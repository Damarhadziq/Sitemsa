import { request } from './http';
import { StudentRecord } from '../data-store';

export interface StudentProgressResponse {
  studentId: string;
  name: string;
  moduleProgress: Record<string, number>;
  quizHistory: StudentRecord['quizHistory'];
}

export interface MonitoringSummaryResponse {
  totalStudents: number;
  totalQuizzesTaken: number;
  passRate: number;
  averageScore: number;
  students: StudentRecord[];
}

export const studentsClientService = {
  getProgress: async (studentId: string): Promise<StudentProgressResponse> => {
    return request<StudentProgressResponse>(`/api/students/progress?studentId=${encodeURIComponent(studentId)}`);
  },

  updateProgress: async (studentId: string, subject: string, progress: number): Promise<StudentRecord> => {
    return request<StudentRecord>('/api/students/progress', {
      method: 'POST',
      body: JSON.stringify({ studentId, subject, progress }),
    });
  },

  getMonitoringSummary: async (subject?: string): Promise<MonitoringSummaryResponse> => {
    const qs = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    return request<MonitoringSummaryResponse>(`/api/students/monitoring${qs}`);
  },
};
