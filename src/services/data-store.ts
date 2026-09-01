// Centralized Seed & Runtime Data Storage for SINTESA Services

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  iconName: string;
  totalModules: number;
  totalQuizzes: number;
  isActive?: boolean;
}

export interface TeacherAccount {
  id: string;
  nip: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  assignedSubjects: string[];
  status: 'Aktif' | 'Nonaktif';
  createdAt: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  badgeText: string;
  ctaText: string;
  ctaLink: string;
  bannerImage: string;
}

export interface WebArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  isFeatured?: boolean;
}

export interface ModuleItem {
  id: string;
  subject: string;
  title: string;
  level: 'Pemula' | 'Menengah' | 'Mahir';
  duration: string;
  topics: string[];
  description: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  isAiRecommended?: boolean;
  isPublished?: boolean;
  thumbnail?: string;
  content?: string;
  blocks?: any[];
  quizSource?: {
    type: 'kuis_sitemsa' | 'link_eksternal' | 'qr_code';
    title: string;
    externalUrl?: string;
    qrImageUrl?: string;
  };
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizItem {
  id: string;
  subject: string;
  title: string;
  duration: string;
  passScore: number;
  teacherId?: string;
  teacherName?: string;
  questions: QuizQuestion[];
  questionCount?: number;
  published?: boolean;
  createdAt: string;
}

export interface StudentRecord {
  id: string;
  nisn: string;
  name: string;
  email: string;
  classGroup: string;
  avatar: string;
  lastActive: string;
  enrolledSubjects: string[];
  moduleProgress: Record<string, number>;
  accessedModules?: {
    moduleId: string;
    moduleTitle: string;
    subject: string;
    teacherId?: string;
    teacherName?: string;
    accessedAt: string;
  }[];
  quizHistory: {
    id: string;
    quizId?: string;
    teacherId?: string;
    teacherName?: string;
    subject: string;
    quizTitle: string;
    score: number;
    maxScore: number;
    date: string;
    status: 'Lulus' | 'Perlu Bimbingan';
  }[];
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'MODULE_UPDATE' | 'QUIZ_REMINDER';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

// Initial In-Memory Seed State
class BackendDataStore {
  public subjects: SubjectItem[] = [
    {
      id: 'sub-1',
      name: 'Informatika',
      code: 'INF',
      category: 'Teknologi & Kode',
      description: 'Pemrograman dasar, logika algoritma, struktur data, dan pengembangan perangkat lunak.',
      iconName: 'ComputerIcon',
      totalModules: 3,
      totalQuizzes: 3,
      isActive: true,
    },
    {
      id: 'sub-2',
      name: 'Elektronika',
      code: 'ELK',
      category: 'Teknik Rekayasa',
      description: 'Komponen pasif & aktif, dasar kelistrikan, sirkuit terpadu, dan mikrokontroler.',
      iconName: 'CpuIcon',
      totalModules: 6,
      totalQuizzes: 6,
      isActive: true,
    },
    {
      id: 'sub-3',
      name: 'Otomotif',
      code: 'OTO',
      category: 'Teknik Mekanik',
      description: 'Sistem pengisian kelistrikan, transmisi manual, termodinamika mesin, dan diagnosis kendaraan.',
      iconName: 'Car01Icon',
      totalModules: 2,
      totalQuizzes: 2,
      isActive: true,
    },
    {
      id: 'sub-4',
      name: 'Seni Tari',
      code: 'STR',
      category: 'Seni & Budaya',
      description: 'Eksplorasi gerak koreografi, tata busana panggung, tata rias, dan properti tari tradisional.',
      iconName: 'MusicNote01Icon',
      totalModules: 2,
      totalQuizzes: 2,
      isActive: true,
    },
    {
      id: 'sub-5',
      name: 'Bimbingan Konseling',
      code: 'BK',
      category: 'Pengembangan Diri',
      description: 'Kepercayaan diri, pemetaan potensi diri, prokrastinasi, dan bimbingan karir masa depan.',
      iconName: 'UserGroupIcon',
      totalModules: 7,
      totalQuizzes: 7,
      isActive: true,
    },
    {
      id: 'sub-6',
      name: 'Keolahragaan',
      code: 'PJK',
      category: 'Kesehatan & Olahraga',
      description: 'Keterampilan gerak & taktik bola basket, bola voli, kebugaran jasmani, dan sportivitas.',
      iconName: 'Dumbbell01Icon',
      totalModules: 2,
      totalQuizzes: 2,
      isActive: true,
    },
  ];

  public teachers: TeacherAccount[] = [
    {
      id: 'sa-1',
      nip: '19980101 202401 1 001',
      name: 'Damar Hadziq H.',
      email: 'damar.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=11',
      phone: '0812-3456-7890',
      assignedSubjects: ['Informatika', 'Elektronika', 'Bimbingan Konseling', 'Seni Tari', 'Otomotif', 'Keolahragaan'],
      status: 'Aktif',
      createdAt: '2025-01-10',
    },
    {
      id: 't-oto-1',
      nip: '19980707 202401 1 007',
      name: 'Ardyan Santoso',
      email: 'ardyan.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=17',
      phone: '0812-5555-0101',
      assignedSubjects: ['Otomotif'],
      status: 'Aktif',
      createdAt: '2025-02-01',
    },
    {
      id: 't-oto-2',
      nip: '19980808 202401 1 008',
      name: 'Satrio',
      email: 'satrio.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=23',
      phone: '0812-5555-0102',
      assignedSubjects: ['Otomotif'],
      status: 'Aktif',
      createdAt: '2025-02-02',
    },
    {
      id: 't-olr-1',
      nip: '19981515 202401 2 015',
      name: 'Brilian Anugraheni',
      email: 'brilian.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=29',
      phone: '0812-5555-0103',
      assignedSubjects: ['Keolahragaan', 'Olahraga & Kesehatan'],
      status: 'Aktif',
      createdAt: '2025-02-03',
    },
    {
      id: 't-bk-1',
      nip: '19980505 202401 2 005',
      name: 'Innova Riskianugrah R.',
      email: 'innova.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=16',
      phone: '0812-5555-0104',
      assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
      status: 'Aktif',
      createdAt: '2025-02-04',
    },
    {
      id: 't-elk-5',
      nip: '19981414 202401 1 014',
      name: 'Fahrul Adiyansa',
      email: 'fahrul.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=33',
      phone: '0812-5555-0105',
      assignedSubjects: ['Elektronika'],
      status: 'Aktif',
      createdAt: '2025-02-05',
    },
    {
      id: 't-elk-2',
      nip: '19981111 202401 2 011',
      name: 'Anisa Susilawati',
      email: 'anisa.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=21',
      phone: '0812-5555-0106',
      assignedSubjects: ['Elektronika'],
      status: 'Aktif',
      createdAt: '2025-02-06',
    },
    {
      id: 't-elk-1',
      nip: '19981010 202401 1 010',
      name: 'Banu Mahmuda H.',
      email: 'banu.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=14',
      phone: '0812-5555-0107',
      assignedSubjects: ['Elektronika'],
      status: 'Aktif',
      createdAt: '2025-02-07',
    },
    {
      id: 't-elk-6',
      nip: '19981616 202401 1 016',
      name: 'Tubagus Fauzan A.',
      email: 'tubagus.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=15',
      phone: '0812-5555-0108',
      assignedSubjects: ['Elektronika'],
      status: 'Aktif',
      createdAt: '2025-02-08',
    },
    {
      id: 't-elk-4',
      nip: '19981313 202401 2 013',
      name: 'Vella Pratika I. N.',
      email: 'vella.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=32',
      phone: '0812-5555-0109',
      assignedSubjects: ['Elektronika'],
      status: 'Aktif',
      createdAt: '2025-02-09',
    },
    {
      id: 't-elk-3',
      nip: '19981212 202401 1 012',
      name: 'Nova Milyard',
      email: 'nova.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=26',
      phone: '0812-5555-0110',
      assignedSubjects: ['Elektronika'],
      status: 'Aktif',
      createdAt: '2025-02-10',
    },
    {
      id: 't-bk-4',
      nip: '19930514 201903 2 008',
      name: 'Dinda Riestia',
      email: 'dinda.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=32',
      phone: '081298765432',
      assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
      status: 'Aktif',
      createdAt: '2025-02-01',
    },
    {
      id: 't-str-1',
      nip: '19920815 201801 2 006',
      name: 'Anita Dwi Ningtyas',
      email: 'anita.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=20',
      phone: '0821-4444-8888',
      assignedSubjects: ['Seni Tari', 'Seni & Desain'],
      status: 'Aktif',
      createdAt: '2025-03-01',
    },
  ];

  public heroContent: HeroContent = {
    title: 'Platform Pembelajaran Digital Vokasi Masa Depan',
    subtitle: 'Tingkatkan kompetensi kejuruan teknik, informatika, dan desain dengan materi interaktif standar industri.',
    badgeText: '✨ Kurikulum Merdeka Vokasi 2026',
    ctaText: 'Mulai Eksplorasi Materi',
    ctaLink: '/materi',
    bannerImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  };

  public articles: WebArticle[] = [
    {
      id: 'art-1',
      title: 'Strategi Efektif Menguasai Algoritma Pemrograman untuk Pemula SMK',
      category: 'Metode Belajar',
      readTime: '4 Menit',
      author: 'Damar Hadziq H.',
      date: '18 Agu 2026',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Panduan langkah demi langkah memecah masalah komputasi kompleks menjadi logika yang terstruktur.',
      content: 'Memahami algoritma pemrograman membutuhkan latihan berpikir komputasional secara konsisten...',
      isFeatured: true,
    },
    {
      id: 'art-2',
      title: '5 Kunci Sukses Praktik Kerja Lapangan (PKL) di Industri Teknologi',
      category: 'Karir & Vokasi',
      readTime: '5 Menit',
      author: 'Ibu Siti Rahmawati, S.T.',
      date: '15 Agu 2026',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Persiapan mental, portofolio keahlian, dan etika kerja profesional sebelum memasuki dunia industri.',
      content: 'PKL adalah gerbang utama siswa SMK untuk membuktikan kompetensi teknis di lingkungan kerja nyata...',
      isFeatured: false,
    },
  ];

  public modules: ModuleItem[] = [];

  public quizzes: QuizItem[] = [];

  public students: StudentRecord[] = [];

  public notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'Modul Pembelajaran Baru Ditambahkan',
      message: 'Materi baru telah diterbitkan oleh Guru Pengampu dan siap dipelajari.',
      type: 'MODULE_UPDATE',
      linkUrl: '/materi',
      isRead: false,
      createdAt: '2026-08-25',
    },
  ];
}

export const dbStore = new BackendDataStore();
