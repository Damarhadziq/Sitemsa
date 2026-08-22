import { request } from './http';
import { SubjectItem } from '../data-store';

export const subjectsClientService = {
  getAll: async (): Promise<SubjectItem[]> => {
    return request<SubjectItem[]>('/api/subjects');
  },

  getById: async (id: string): Promise<SubjectItem> => {
    return request<SubjectItem>(`/api/subjects/${id}`);
  },

  create: async (payload: Omit<SubjectItem, 'id' | 'totalModules' | 'totalQuizzes'>): Promise<SubjectItem> => {
    return request<SubjectItem>('/api/subjects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<SubjectItem>): Promise<SubjectItem> => {
    return request<SubjectItem>(`/api/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/api/subjects/${id}`, {
      method: 'DELETE',
    });
  },
};
