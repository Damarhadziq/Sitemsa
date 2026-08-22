import { dbStore, NotificationItem } from './data-store';

export class NotificationService {
  static getNotifications(userId?: string): NotificationItem[] {
    if (!userId) return dbStore.notifications;
    return dbStore.notifications.filter((n) => !n.userId || n.userId === userId);
  }

  static createNotification(data: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>): NotificationItem {
    const newId = `notif-${Date.now()}`;
    const newNotification: NotificationItem = {
      id: newId,
      ...data,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    dbStore.notifications.unshift(newNotification);
    return newNotification;
  }

  static markAsRead(id: string): boolean {
    const notif = dbStore.notifications.find((n) => n.id === id);
    if (!notif) return false;
    notif.isRead = true;
    return true;
  }

  static markAllAsRead(userId?: string): void {
    dbStore.notifications.forEach((n) => {
      if (!userId || !n.userId || n.userId === userId) {
        n.isRead = true;
      }
    });
  }
}
