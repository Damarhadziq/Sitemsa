import { request } from './http';
import { ModuleItem } from '../data-store';

export interface ModuleFilterParams {
  subject?: string;
  level?: string;
  teacherId?: string;
}

export const modulesClientService = {
  getAll: async (filter?: ModuleFilterParams): Promise<ModuleItem[]> => {
    const q = new URLSearchParams();
    if (filter?.subject) q.set('subject', filter.subject);
    if (filter?.level) q.set('level', filter.level);
    if (filter?.teacherId) q.set('teacherId', filter.teacherId);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return request<ModuleItem[]>(`/api/modules${qs}`);
  },

  getById: async (id: string): Promise<ModuleItem> => {
    return request<ModuleItem>(`/api/modules/${id}`);
  },

  create: async (payload: Omit<ModuleItem, 'id' | 'createdAt'>): Promise<ModuleItem> => {
    return request<ModuleItem>('/api/modules', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<ModuleItem>): Promise<ModuleItem> => {
    return request<ModuleItem>(`/api/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/api/modules/${id}`, {
      method: 'DELETE',
    });
  },
};
