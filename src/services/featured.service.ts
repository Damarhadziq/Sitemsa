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
    id: 7,
    moduleId: 'mod-bk-1',
    subject: 'Bimbingan Konseling',
    title: 'Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!',
    linkUrl: '/materi/7',
    indicatorType: 'social_proof',
    metadata: {
      completedCount: 142,
      avatarIds: [12, 15, 23],
      socialCopy: '142 siswa baru saja menyelesaikan ini.',
    },
  },
  {
    id: 8,
    moduleId: 'mod-bk-2',
    subject: 'Bimbingan Konseling',
    title: 'Talent Quest: Temukan Potensimu, Kembangkan Dirimu!',
    linkUrl: '/materi/8',
    indicatorType: 'rating_duration',
    metadata: {
      rating: 4.9,
      readTime: '35 Menit baca.',
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
      teacherName: 'Ibu Vivi Riska Wardani',
      recommendationNote: 'Rekomendasi Guru Pengampu',
    },
  },
  {
    id: 17,
    moduleId: 'mod-bk-4',
    subject: 'Bimbingan Konseling',
    title: 'Membangun Konsep Diri Positif',
    linkUrl: '/materi/17',
    indicatorType: 'trending',
    metadata: {
      trendingText: 'Sedang tren di kelas 11',
      targetGrade: 'Kelas 11',
    },
  },
  {
    id: 10,
    moduleId: 'mod-tari-2',
    subject: 'Seni Tari',
    title: 'Koreografi: Eksplorasi Gerak Dalam Seni Tari',
    linkUrl: '/materi/10',
    indicatorType: 'quiz_certified',
    metadata: {
      quizScoreAvg: 96,
      quizQuestionsCount: 10,
      quizCopy: 'Tersedia Kuis Interaktif • Skor Rata-rata 96%',
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
