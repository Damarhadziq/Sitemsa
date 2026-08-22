import { request } from './http';
import { UserSession } from '../auth.service';

export interface LoginPayload {
  email: string;
  password?: string;
}

export const authClientService = {
  login: async (payload: LoginPayload): Promise<UserSession> => {
    return request<UserSession>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getProfile: async (userId: string): Promise<UserSession> => {
    return request<UserSession>(`/api/auth/me?userId=${encodeURIComponent(userId)}`);
  },

  logout: async (): Promise<void> => {
    return request<void>('/api/auth/logout', {
      method: 'POST',
    });
  },
};
