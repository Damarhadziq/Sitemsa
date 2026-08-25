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
import { supabase } from '@/lib/supabase';

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

export const syncNotificationsFromSupabase = async (userId?: string): Promise<AppNotification[]> => {
  if (!supabase) return getStoredNotifications();

  try {
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase notifications fetch warning:', error.message);
      return getStoredNotifications();
    }

    if (data && Array.isArray(data) && data.length > 0) {
      const mapped: AppNotification[] = data.map((item: any) => ({
        id: String(item.id),
        type: item.type || 'materi',
        title: item.title,
        message: item.message,
        time: item.time || (item.created_at ? new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'),
        isRead: Boolean(item.is_read),
        linkUrl: item.link_url || undefined,
        userId: item.user_id || undefined,
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        window.dispatchEvent(new CustomEvent('sintesa-notifications-updated'));
      }
      return mapped;
    }
  } catch (e) {
    console.warn('Supabase notifications sync error:', e);
  }

  return getStoredNotifications();
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

  // Async sync to Supabase
  if (supabase) {
    supabase.from('notifications').insert({
      id: newNotif.id,
      user_id: notif.userId || null,
      type: notif.type || 'materi',
      title: notif.title,
      message: notif.message,
      time: newNotif.time,
      is_read: false,
      link_url: notif.linkUrl || null,
    }).then(({ error }) => {
      if (error) console.warn('Supabase insert notification warning:', error.message);
    });
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

  if (supabase) {
    supabase.from('notifications').update({ is_read: true }).neq('id', 'non-existent').then(() => {});
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

  if (supabase) {
    supabase.from('notifications').update({ is_read: true }).eq('id', id).then(() => {});
  }

  return updated;
};

export class NotificationService {
  static getNotifications(userId?: string): AppNotification[] {
    const list = getStoredNotifications();
    if (userId) {
      return list.filter((n) => !n.userId || n.userId === userId);
    }
    return list;
  }

  static createNotification(data: Partial<AppNotification>): AppNotification {
    return addUserNotification({
      type: data.type || 'materi',
      title: data.title || 'Pemberitahuan Baru',
      message: data.message || '',
      linkUrl: data.linkUrl,
      userId: data.userId,
    });
  }

  static markAsRead(id: string): boolean {
    markNotificationAsRead(id);
    return true;
  }

  static markAllAsRead(): boolean {
    markAllNotificationsRead();
    return true;
  }
}
