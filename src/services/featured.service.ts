'use client';

export type FeaturedIndicatorType =
  | 'social_proof'
  | 'rating_duration'
  | 'trending'
  | 'quiz_certified'
  | 'teacher_pick';

export interface FeaturedModuleCard {
  id: number;
  moduleId: string;
  subject: string;
  title: string;
  linkUrl: string;
  indicatorType: FeaturedIndicatorType;
  metadata: {
    // For social_proof
    completedCount?: number;
    avatarIds?: number[];
    socialCopy?: string;
    // For rating_duration
    rating?: number;
    readTime?: string;
    // For trending
    trendingText?: string;
    targetGrade?: string;
    // For quiz_certified
    quizScoreAvg?: number;
    quizQuestionsCount?: number;
    quizCopy?: string;
    // For teacher_pick
    teacherName?: string;
    recommendationNote?: string;
  };
}

import { dbStore, ModuleItem } from './data-store';
import { ModuleService } from './module.service';
import { getStudentScopedStorageKey } from '@/services/student-profile.service';

export const FEATURED_CARDS_DATA: FeaturedModuleCard[] = [
  {
    id: 1,
    moduleId: 'mod-1',
    subject: 'Informatika',
    title: 'Pengenalan Algoritma & Logika Pemrograman',
    linkUrl: '/materi/1?from=Informatika',
    indicatorType: 'social_proof',
    metadata: {
      completedCount: 142,
      avatarIds: [12, 15, 23],
      socialCopy: '142 siswa baru saja menyelesaikan ini.',
    },
  },
  {
    id: 7,
    moduleId: 'mod-bk-1',
    subject: 'Bimbingan Konseling',
    title: 'Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!',
    linkUrl: '/materi/7?from=Bimbingan%20Konseling',
    indicatorType: 'rating_duration',
    metadata: {
      rating: 4.9,
      readTime: '30 Menit baca.',
    },
  },
  {
    id: 9,
    moduleId: 'mod-tari-1',
    subject: 'Seni Tari',
    title: 'Konsep Koreografi dalam Seni Tari',
    linkUrl: '/materi/9?from=Seni%20Tari',
    indicatorType: 'teacher_pick',
    metadata: {
      teacherName: 'Guru Sitemsa',
      recommendationNote: 'Rekomendasi Guru Pengampu',
    },
  },
];

export function mapModuleToFeaturedCard(mod: ModuleItem, index: number): FeaturedModuleCard {
  const indicatorTypes: FeaturedIndicatorType[] = [
    'teacher_pick',
    'social_proof',
    'rating_duration',
    'quiz_certified',
    'trending',
  ];

  let indicatorType: FeaturedIndicatorType = indicatorTypes[index % indicatorTypes.length];
  if (mod.isAiRecommended) {
    indicatorType = 'teacher_pick';
  } else if (mod.quizSource?.title) {
    indicatorType = 'quiz_certified';
  }

  const numericId = parseInt(String(mod.id).replace(/\D/g, ''), 10) || (index + 1);

  return {
    id: numericId,
    moduleId: String(mod.id),
    subject: mod.subject || 'Informatika',
    title: mod.title || 'Modul Pembelajaran',
    linkUrl: `/materi/${mod.id}?from=${encodeURIComponent(mod.subject || 'Informatika')}`,
    indicatorType,
    metadata: {
      completedCount: 100 + ((index * 19) % 75),
      avatarIds: [12, 15, 23],
      socialCopy: `${100 + ((index * 19) % 75)} siswa baru saja menyelesaikan ini.`,
      rating: 4.8 + ((index % 3) * 0.1),
      readTime: mod.duration || '30 Menit baca.',
      trendingText: `Sedang tren di bidang ${mod.subject}`,
      targetGrade: 'Kelas 10',
      quizScoreAvg: 95,
      quizCopy: `Tersedia Kuis • ${mod.quizSource?.title || 'Uji Pemahaman'}`,
      teacherName: mod.teacherName || 'Guru Pengampu',
      recommendationNote: 'Rekomendasi Guru Pengampu',
    },
  };
}

export const getFeaturedModules = (customModules?: ModuleItem[]): FeaturedModuleCard[] => {
  const allModules: ModuleItem[] = customModules || ModuleService.getAllModules() || dbStore.modules || [];
  const published = allModules.filter((m) => m.isPublished !== false);

  if (published.length === 0) {
    return FEATURED_CARDS_DATA.slice(0, 3);
  }

  // Prioritize AI recommended modules, then user's recent subject view
  let userTopSubject = '';
  if (typeof window !== 'undefined') {
    try {
      const key = getStudentScopedStorageKey('sintesa_user_views');
      const rawViews = localStorage.getItem(key);
      if (rawViews) {
        const views = JSON.parse(rawViews);
        if (Array.isArray(views) && views.length > 0) {
          userTopSubject = views[0].subject;
        }
      }
    } catch {}
  }

  const sorted = [...published].sort((a, b) => {
    if (a.isAiRecommended && !b.isAiRecommended) return -1;
    if (!a.isAiRecommended && b.isAiRecommended) return 1;
    if (userTopSubject && a.subject === userTopSubject && b.subject !== userTopSubject) return -1;
    if (userTopSubject && a.subject !== userTopSubject && b.subject === userTopSubject) return 1;
    return 0;
  });

  const cards = sorted.map((mod, idx) => mapModuleToFeaturedCard(mod, idx));

  if (cards.length >= 3) {
    return cards.slice(0, 3);
  }

  // If fewer than 3, pad with base fallback cards so there are always at least 3 cards
  const needed = 3 - cards.length;
  const fallbacks = FEATURED_CARDS_DATA.filter((f) => !cards.some((c) => c.title === f.title)).slice(0, needed);
  return [...cards, ...fallbacks].slice(0, 3);
};
