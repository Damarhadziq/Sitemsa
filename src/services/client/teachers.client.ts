import { request } from './http';
import { TeacherAccount } from '../data-store';

export const teachersClientService = {
  getAll: async (): Promise<TeacherAccount[]> => {
    return request<TeacherAccount[]>('/api/teachers');
  },

  getById: async (id: string): Promise<TeacherAccount> => {
    return request<TeacherAccount>(`/api/teachers/${id}`);
  },

  create: async (payload: Omit<TeacherAccount, 'id' | 'createdAt'>): Promise<TeacherAccount> => {
    return request<TeacherAccount>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<TeacherAccount>): Promise<TeacherAccount> => {
    return request<TeacherAccount>(`/api/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/api/teachers/${id}`, {
      method: 'DELETE',
    });
  },

  assignSubjects: async (id: string, assignedSubjects: string[]): Promise<TeacherAccount> => {
    return request<TeacherAccount>(`/api/teachers/${id}/subjects`, {
      method: 'PUT',
      body: JSON.stringify({ assignedSubjects }),
    });
  },
};
