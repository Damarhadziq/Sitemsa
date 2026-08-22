import { request } from './http';
import { WebArticle } from '../data-store';

export interface ArticleFilterParams {
  category?: string;
  featuredOnly?: boolean;
}

export const articlesClientService = {
  getAll: async (filter?: ArticleFilterParams): Promise<WebArticle[]> => {
    const q = new URLSearchParams();
    if (filter?.category) q.set('category', filter.category);
    if (filter?.featuredOnly) q.set('featuredOnly', 'true');
    const qs = q.toString() ? `?${q.toString()}` : '';
    return request<WebArticle[]>(`/api/articles${qs}`);
  },

  getById: async (id: string): Promise<WebArticle> => {
    return request<WebArticle>(`/api/articles/${id}`);
  },

  create: async (payload: Omit<WebArticle, 'id' | 'date'>): Promise<WebArticle> => {
    return request<WebArticle>('/api/articles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<WebArticle>): Promise<WebArticle> => {
    return request<WebArticle>(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/api/articles/${id}`, {
      method: 'DELETE',
    });
  },
};
