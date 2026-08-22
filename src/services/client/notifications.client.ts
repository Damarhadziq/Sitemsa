import { request } from './http';
import { NotificationItem } from '../data-store';

export const notificationsClientService = {
  getAll: async (userId?: string): Promise<NotificationItem[]> => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return request<NotificationItem[]>(`/api/notifications${qs}`);
  },

  create: async (payload: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>): Promise<NotificationItem> => {
    return request<NotificationItem>('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  markRead: async (id: string): Promise<void> => {
    return request<void>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },
};
