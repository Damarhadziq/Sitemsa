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

export const FEATURED_CARDS_DATA: FeaturedModuleCard[] = [
  {
    id: 1,
    moduleId: 'mod-info-1',
    subject: 'Informatika',
    title: 'Variabel, Tipe Data & Operasi Logika',
    linkUrl: '/materi/1',
    indicatorType: 'social_proof',
    metadata: {
      completedCount: 125,
      avatarIds: [12, 15, 23],
      socialCopy: '125 siswa baru saja menyelesaikan ini.',
    },
  },
  {
    id: 7,
    moduleId: 'mod-bk-1',
    subject: 'Bimbingan Konseling',
    title: 'Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!',
    linkUrl: '/materi/7',
    indicatorType: 'rating_duration',
    metadata: {
      rating: 4.9,
      readTime: '10 Menit baca.',
    },
  },
  {
    id: 4,
    moduleId: 'mod-el-1',
    subject: 'Elektronika',
    title: 'Analisis Sirkuit Seri & Paralel Resistor',
    linkUrl: '/materi/4',
    indicatorType: 'trending',
    metadata: {
      trendingText: 'Sedang tren di kelas 10',
      targetGrade: 'Kelas 10',
    },
  },
  {
    id: 8,
    moduleId: 'mod-bk-2',
    subject: 'Bimbingan Konseling',
    title: 'Talent Quest: Temukan Potensimu, Kembangkan Dirimu!',
    linkUrl: '/materi/8',
    indicatorType: 'quiz_certified',
    metadata: {
      quizScoreAvg: 95,
      quizQuestionsCount: 10,
      quizCopy: 'Tersedia Kuis Interaktif • Skor Rata-rata 95%',
    },
  },
  {
    id: 9,
    moduleId: 'mod-tari-1',
    subject: 'Seni Tari',
    title: 'Konsep Koreografi dalam Seni Tari',
    linkUrl: '/materi/9',
    indicatorType: 'teacher_pick',
    metadata: {
      teacherName: 'Ibu Ni Wayan Sri, S.Sn.',
      recommendationNote: 'Rekomendasi Guru Pengampu',
    },
  },
];

const STORAGE_KEY = 'sintesa_featured_condition_filter';

export const getFeaturedModules = (filter?: string): FeaturedModuleCard[] => {
  if (typeof window === 'undefined') return FEATURED_CARDS_DATA.slice(0, 3);
  try {
    // Dynamic contextual resolution: can prioritize by user view history if available
    const rawViews = localStorage.getItem('sintesa_user_views');
    if (rawViews) {
      const views: { id: number; subject: string; timestamp: number }[] = JSON.parse(rawViews);
      if (views.length > 0) {
        const topSubject = views[0].subject;
        const matching = FEATURED_CARDS_DATA.filter((c) => c.subject === topSubject);
        const others = FEATURED_CARDS_DATA.filter((c) => c.subject !== topSubject);
        return [...matching, ...others].slice(0, 3);
      }
    }
  } catch {
    // Fallback
  }
  return FEATURED_CARDS_DATA.slice(0, 3);
};
