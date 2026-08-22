import { request } from './http';
import { QuizItem } from '../data-store';
import { QuizCreateInput } from '../quiz.service';
import { QuizSubmissionPayload, QuizResultReport } from '../grading.service';

export interface QuizFilterParams {
  subject?: string;
  teacherId?: string;
  publishedOnly?: boolean;
}

export const quizzesClientService = {
  getAll: async (filter?: QuizFilterParams): Promise<QuizItem[]> => {
    const q = new URLSearchParams();
    if (filter?.subject) q.set('subject', filter.subject);
    if (filter?.teacherId) q.set('teacherId', filter.teacherId);
    if (filter?.publishedOnly) q.set('publishedOnly', 'true');
    const qs = q.toString() ? `?${q.toString()}` : '';
    return request<QuizItem[]>(`/api/quizzes${qs}`);
  },

  getById: async (id: string, role?: string): Promise<QuizItem> => {
    const qs = role ? `?role=${encodeURIComponent(role)}` : '';
    return request<QuizItem>(`/api/quizzes/${id}${qs}`);
  },

  create: async (payload: QuizCreateInput): Promise<QuizItem> => {
    return request<QuizItem>('/api/quizzes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<QuizItem>): Promise<QuizItem> => {
    return request<QuizItem>(`/api/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/api/quizzes/${id}`, {
      method: 'DELETE',
    });
  },

  submit: async (quizId: string, payload: QuizSubmissionPayload): Promise<QuizResultReport> => {
    return request<QuizResultReport>(`/api/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
