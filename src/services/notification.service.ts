import { IconSvgElement } from '@hugeicons/react';
import {
  Book01Icon,
  Award01Icon,
  SparklesIcon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  Settings02Icon,
  BellIcon,
} from '@hugeicons/core-free-icons';

export type NotificationConditionType =
  | 'materi'
  | 'nilai'
  | 'selesai'
  | 'tips'
  | 'pengingat'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationConditionType | string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  linkUrl?: string;
  userId?: string;
}

const STORAGE_KEY = 'sintesa_user_notifications_v1';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'materi',
    title: 'Modul Praktik Baru Rilis',
    message: "Pak Herman Susilo menambahkan modul baru 'Analisis Sirkuit Seri & Paralel Resistor' untuk kelas X.",
    time: '10 menit lalu',
    isRead: false,
    linkUrl: '/materi/4',
  },
  {
    id: 'notif-2',
    type: 'nilai',
    title: 'Nilai Kuis Berhasil Tercatat',
    message: "Selamat! Kuis 'Variabel, Tipe Data & Logika' berhasil diselesaikan dengan skor sempurna 100/100.",
    time: '1 jam lalu',
    isRead: false,
    linkUrl: '/materi/1',
  },
  {
    id: 'notif-3',
    type: 'selesai',
    title: 'Materi Selesai Dipelajari',
    message: "Kamu telah menyelesaikan pembacaan materi 'Yuk, Lawan Rasa Malas'. Siap mengerjakan kuis evaluasi?",
    time: '2 jam lalu',
    isRead: false,
    linkUrl: '/materi/7',
  },
  {
    id: 'notif-4',
    type: 'tips',
    title: 'Tips Belajar Baru',
    message: "Artikel edukasi '5 Strategi Efektif Menguasai Logika Pemrograman' kini siap dibaca di kanal Tips Belajar.",
    time: '3 jam lalu',
    isRead: true,
    linkUrl: '/tips-belajar',
  },
  {
    id: 'notif-5',
    type: 'pengingat',
    title: 'Pengingat Asesmen Praktikum',
    message: 'Batas pengumpulan laporan evaluasi multimeter digital tersisa 2 hari lagi. Pastikan sudah diunggah.',
    time: 'Kemarin',
    isRead: true,
    linkUrl: '/materi/4',
  },
  {
    id: 'notif-6',
    type: 'system',
    title: 'Pemberitahuan Sistem Sitemsa',
    message: 'Platform pembelajaran Sitemsa v2.4 telah aktif dengan fitur sinkronisasi profil siswa dan materi interaktif.',
    time: '2 hari lalu',
    isRead: true,
    linkUrl: '/dokumentasi',
  },
];

export const getNotificationIcon = (type: string): IconSvgElement => {
  switch (type) {
    case 'materi':
      return Book01Icon;
    case 'nilai':
      return Award01Icon;
    case 'selesai':
      return CheckmarkCircle02Icon;
    case 'tips':
      return SparklesIcon;
    case 'pengingat':
      return Clock01Icon;
    case 'system':
      return Settings02Icon;
    default:
      return BellIcon;
  }
};

export const getStoredNotifications = (): AppNotification[] => {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const addUserNotification = (
  notif: Omit<AppNotification, 'id' | 'time' | 'isRead'> & { time?: string }
): AppNotification => {
  const current = getStoredNotifications();
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    type: notif.type || 'materi',
    title: notif.title,
    message: notif.message,
    time: notif.time || 'Baru saja',
    isRead: false,
    linkUrl: notif.linkUrl,
    userId: notif.userId,
  };

  const updated = [newNotif, ...current];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('sintesa-notifications-updated'));
    } catch (e) {
      console.error(e);
    }
  }
  return newNotif;
};

export const markAllNotificationsRead = (): AppNotification[] => {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, isRead: true }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sintesa-notifications-updated'));
  } catch (e) {
    console.error(e);
  }
  return updated;
};

export const markNotificationAsRead = (id: string): AppNotification[] => {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sintesa-notifications-updated'));
  } catch (e) {
    console.error(e);
  }
  return updated;
};

let serverInMemoryNotifications: AppNotification[] = [...INITIAL_NOTIFICATIONS];

export class NotificationService {
  static getNotifications(userId?: string): AppNotification[] {
    if (userId) {
      return serverInMemoryNotifications.filter((n) => !n.userId || n.userId === userId);
    }
    return serverInMemoryNotifications;
  }

  static createNotification(data: Partial<AppNotification>): AppNotification {
    const newNotif: AppNotification = {
      id: `n-${Date.now()}`,
      type: data.type || 'materi',
      title: data.title || 'Pemberitahuan Baru',
      message: data.message || '',
      time: 'Baru saja',
      isRead: false,
      linkUrl: data.linkUrl,
      userId: data.userId,
    };
    serverInMemoryNotifications.unshift(newNotif);
    return newNotif;
  }

  static markAsRead(id: string): boolean {
    const item = serverInMemoryNotifications.find((n) => n.id === id);
    if (!item) return false;
    item.isRead = true;
    return true;
  }

  static markAllAsRead(userId?: string): boolean {
    serverInMemoryNotifications = serverInMemoryNotifications.map((n) => {
      if (!userId || n.userId === userId) {
        return { ...n, isRead: true };
      }
      return n;
    });
    return true;
  }
}
