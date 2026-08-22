'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsClientService } from '@/services/client/notifications.client';
import { NotificationItem } from '@/services/data-store';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, userId],
    queryFn: () => notificationsClientService.getAll(userId),
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) =>
      notificationsClientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsClientService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}
