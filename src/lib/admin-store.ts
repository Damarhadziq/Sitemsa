import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addUserNotification } from '@/services/notification.service';
import { generateEntityId } from '@/lib/id-generator';

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  iconName: string;
  totalModules: number;
  totalQuizzes: number;
}

export interface TeacherAccount {
  id: string;
  nip: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  assignedSubjects: string[]; // List of subject names/ids assigned by Superadmin
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

export interface DocArticleItem {
  id: string;
  category: 'Modul & Pembelajaran' | 'Kuis & Barcode' | 'Profil & Nilai';
  title: string;
  summary: string;
  screenshotUrl?: string;
  sections: {
    title: string;
    description: string;
    callout?: string;
  }[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMemberItem {
  id: string;
  title: string;
  subtitle: string;
  handle: string;
  division: string;
  image: string;
  borderColor: string;
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
  quizSource?: {
    type: 'kuis_sitemsa' | 'link_eksternal' | 'qr_code';
    title: string;
    externalUrl?: string;
    qrImageUrl?: string;
  };
  blocks?: any[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0..3
  explanation: string;
}

export interface QuizItem {
  id: string;
  moduleId?: string;
  subject: string;
  title: string;
  duration: string;
  passScore: number;
  questionCount: number;
  questions: QuizQuestion[];
  teacherId: string;
  teacherName: string;
  published: boolean;
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
  moduleProgress: Record<string, number>; // subject -> percentage
  quizHistory: {
    id: string;
    subject: string;
    quizTitle: string;
    score: number;
    maxScore: number;
    date: string;
    status: 'Lulus' | 'Perlu Bimbingan';
  }[];
}

interface AdminStoreState {
  // Data
  subjects: SubjectItem[];
  teachers: TeacherAccount[];
  heroContent: HeroContent;
  articles: WebArticle[];
  docs: DocArticleItem[];
  faqs: FaqItem[];
  teamMembers: TeamMemberItem[];
  modules: ModuleItem[];
  quizzes: QuizItem[];
  students: StudentRecord[];

  // Actions - Teachers & Subject Assignments (Superadmin)
  addTeacher: (teacher: Omit<TeacherAccount, 'id' | 'createdAt'>) => void;
  updateTeacher: (id: string, teacher: Partial<TeacherAccount>) => void;
  deleteTeacher: (id: string) => void;
  assignSubjectsToTeacher: (teacherId: string, assignedSubjects: string[]) => void;

  // Actions - Main Content (Superadmin)
  updateHeroContent: (hero: Partial<HeroContent>) => void;
  addArticle: (article: Omit<WebArticle, 'id' | 'date'>) => void;
  updateArticle: (id: string, article: Partial<WebArticle>) => void;
  deleteArticle: (id: string) => void;

  // Actions - Docs & FAQs (Superadmin)
  addDoc: (doc: Omit<DocArticleItem, 'id'>) => void;
  updateDoc: (id: string, doc: Partial<DocArticleItem>) => void;
  deleteDoc: (id: string) => void;
  addFaq: (faq: Omit<FaqItem, 'id'>) => void;
  updateFaq: (id: string, faq: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;

  // Actions - Team Members (Superadmin)
  addTeamMember: (member: Omit<TeamMemberItem, 'id'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMemberItem>) => void;
  deleteTeamMember: (id: string) => void;

  // Actions - Subjects (Superadmin)
  addSubject: (subject: Omit<SubjectItem, 'id' | 'totalModules' | 'totalQuizzes'>) => void;
  updateSubject: (id: string, subject: Partial<SubjectItem>) => void;

  // Actions - Modules (Admin Guru & Superadmin)
  addModule: (module: Omit<ModuleItem, 'id' | 'createdAt'>) => string;
  updateModule: (id: string, module: Partial<ModuleItem>) => void;
  deleteModule: (id: string) => void;

  // Actions - Quizzes (Admin Guru & Superadmin)
  addQuiz: (quiz: Omit<QuizItem, 'id' | 'createdAt'>) => string;
  updateQuiz: (id: string, quiz: Partial<QuizItem>) => void;
  deleteQuiz: (id: string) => void;

  // Actions - Students (Monitoring)
  setStudents: (students: StudentRecord[]) => void;
  addStudentScore: (studentId: string, scoreRecord: StudentRecord['quizHistory'][0]) => void;
  updateStudentProgress: (studentId: string, subject: string, progress: number) => void;
}

// Initial Mock Data
const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'sub-1',
    name: 'Informatika',
    code: 'INF',
    category: 'Teknologi & Kode',
    description: 'Pemrograman dasar, logika algoritma, struktur data, dan pengembangan perangkat lunak.',
    iconName: 'ComputerIcon',
    totalModules: 12,
    totalQuizzes: 6,
  },
  {
    id: 'sub-2',
    name: 'Elektronika',
    code: 'ELK',
    category: 'Teknik Hardware',
    description: 'Analisis sirkuit listrik, mikroprosesor Arduino, sensor IoT, dan komponen semikonduktor.',
    iconName: 'CpuIcon',
    totalModules: 10,
    totalQuizzes: 5,
  },
  {
    id: 'sub-3',
    name: 'Otomotif',
    code: 'OTM',
    category: 'Teknik Mesin',
    description: 'Mesin pembakaran dalam, sirkuit kelistrikan kendaraan, serta pemeliharaan sistem otomatisasi.',
    iconName: 'Car01Icon',
    totalModules: 8,
    totalQuizzes: 4,
  },
  {
    id: 'sub-4',
    name: 'Seni & Desain',
    code: 'SND',
    category: 'Industri Kreatif',
    description: 'Desain grafis UI/UX, ilustrasi digital, komposisi warna, serta manajemen aset visual.',
    iconName: 'MusicNote01Icon',
    totalModules: 9,
    totalQuizzes: 4,
  },
  {
    id: 'sub-5',
    name: 'Bimbingan Konseling',
    code: 'BK',
    category: 'Pengembangan Diri',
    description: 'Bimbingan karir, konsultasi akademik, pengembangan kepribadian, serta konseling siswa.',
    iconName: 'UserCheck',
    totalModules: 6,
    totalQuizzes: 3,
  },
];

const INITIAL_TEACHERS: TeacherAccount[] = [
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
    id: 't-oto-3',
    nip: '19980909 202401 1 009',
    name: 'Agam Ainun Ramadhan',
    email: 'agam.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=27',
    phone: '0812-5555-0103',
    assignedSubjects: ['Otomotif'],
    status: 'Aktif',
    createdAt: '2025-02-03',
  },
  {
    id: 't-elk-5',
    nip: '19981414 202401 1 014',
    name: 'Fahrul Adiyansa',
    email: 'fahrul.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=33',
    phone: '0812-5555-0104',
    assignedSubjects: ['Elektronika'],
    status: 'Aktif',
    createdAt: '2025-02-04',
  },
  {
    id: 't-elk-2',
    nip: '19981111 202401 2 011',
    name: 'Anisa Susilawati',
    email: 'anisa.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=21',
    phone: '0812-5555-0105',
    assignedSubjects: ['Elektronika'],
    status: 'Aktif',
    createdAt: '2025-02-05',
  },
  {
    id: 't-elk-1',
    nip: '19981010 202401 1 010',
    name: 'Banu Mahmuda H.',
    email: 'banu.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=14',
    phone: '0812-5555-0106',
    assignedSubjects: ['Elektronika'],
    status: 'Aktif',
    createdAt: '2025-02-06',
  },
  {
    id: 't-elk-6',
    nip: '19981616 202401 1 016',
    name: 'Tubagus Fauzan A.',
    email: 'tubagus.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=15',
    phone: '0812-5555-0107',
    assignedSubjects: ['Elektronika'],
    status: 'Aktif',
    createdAt: '2025-02-07',
  },
  {
    id: 't-elk-4',
    nip: '19981313 202401 2 013',
    name: 'Vella Pratika I. N.',
    email: 'vella.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=32',
    phone: '0812-5555-0108',
    assignedSubjects: ['Elektronika'],
    status: 'Aktif',
    createdAt: '2025-02-08',
  },
  {
    id: 't-elk-3',
    nip: '19981212 202401 1 012',
    name: 'Nova Milyard',
    email: 'nova.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=26',
    phone: '0812-5555-0109',
    assignedSubjects: ['Elektronika'],
    status: 'Aktif',
    createdAt: '2025-02-09',
  },
  {
    id: 't-bk-1',
    nip: '19980505 202401 2 005',
    name: 'Innova Riskianugrah R.',
    email: 'innova.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=16',
    phone: '0812-5555-0110',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
    status: 'Aktif',
    createdAt: '2025-02-10',
  },
  {
    id: 't-bk-2',
    nip: '19980606 202401 1 006',
    name: 'Fateka Maulana A. K.',
    email: 'fateka.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=18',
    phone: '0812-5555-0111',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
    status: 'Aktif',
    createdAt: '2025-02-11',
  },
  {
    id: 't-bk-3',
    nip: '19940822 202012 2 009',
    name: "Erintan Tsuraya Rahadatul'Aisy",
    email: 'erintan.guru@sitemsa.sch.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    phone: '0812-5555-0112',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
    status: 'Aktif',
    createdAt: '2025-02-12',
  },
  {
    id: 't-bk-4',
    nip: '19930514 201903 2 008',
    name: 'Dinda Riestia',
    email: 'dinda.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=32',
    phone: '0812-5555-0113',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
    status: 'Aktif',
    createdAt: '2025-02-13',
  },
  {
    id: 't-olr-1',
    nip: '19981515 202401 2 015',
    name: 'Brilian Anugraheni',
    email: 'brilian.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=29',
    phone: '0812-5555-0114',
    assignedSubjects: ['Keolahragaan', 'Olahraga & Kesehatan'],
    status: 'Aktif',
    createdAt: '2025-02-14',
  },
  {
    id: 't-olr-2',
    nip: '19981717 202401 1 017',
    name: 'Ahmad Luthfi F.',
    email: 'luthfi.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=31',
    phone: '0812-5555-0115',
    assignedSubjects: ['Keolahragaan', 'Olahraga & Kesehatan'],
    status: 'Aktif',
    createdAt: '2025-02-15',
  },
  {
    id: 't-olr-3',
    nip: '19981818 202401 1 018',
    name: 'Rinal Febriarso D. P.',
    email: 'rinal.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=34',
    phone: '0812-5555-0116',
    assignedSubjects: ['Keolahragaan', 'Olahraga & Kesehatan'],
    status: 'Aktif',
    createdAt: '2025-02-16',
  },
  {
    id: 't-inf-2',
    nip: '19980202 202401 1 002',
    name: 'Mochammad Rizal D. D.',
    email: 'rizal.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=13',
    phone: '0812-5555-0117',
    assignedSubjects: ['Informatika'],
    status: 'Aktif',
    createdAt: '2025-02-17',
  },
  {
    id: 't-inf-3',
    nip: '19980303 202401 1 003',
    name: 'M. Sulthon Abdullah A.',
    email: 'sulthon.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=19',
    phone: '0812-5555-0118',
    assignedSubjects: ['Informatika'],
    status: 'Aktif',
    createdAt: '2025-02-18',
  },
  {
    id: 't-inf-4',
    nip: '19980404 202401 2 004',
    name: 'Lovyca Imeyra E.',
    email: 'lovyca.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=25',
    phone: '0812-5555-0119',
    assignedSubjects: ['Informatika'],
    status: 'Aktif',
    createdAt: '2025-02-19',
  },
  {
    id: 't-tari-2',
    nip: '19982020 202401 2 020',
    name: 'Anita Dwi Ningtyas',
    email: 'anita.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=20',
    phone: '0812-5555-0120',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
    status: 'Aktif',
    createdAt: '2025-02-20',
  },
  {
    id: 't-tari-1',
    nip: '19981919 202401 2 019',
    name: 'Vivi Riska Wardani',
    email: 'vivi.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '0812-5555-0121',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
    status: 'Aktif',
    createdAt: '2025-02-21',
  },
  {
    id: 't-tari-3',
    nip: '19982121 202401 2 021',
    name: 'Meliana Dwi Yanti',
    email: 'meliana.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=24',
    phone: '0812-5555-0122',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
    status: 'Aktif',
    createdAt: '2025-02-22',
  },
  {
    id: 't-tari-4',
    nip: '19982222 202401 2 022',
    name: 'Hasnita Ivangka',
    email: 'ivangka.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=28',
    phone: '0812-5555-0123',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
    status: 'Aktif',
    createdAt: '2025-02-23',
  },
];

const INITIAL_HERO: HeroContent = {
  title: 'Kuasai Keahlian Baru di Setiap Langkah',
  subtitle: 'Dari logika hingga seni, pelajari semua materi favoritmu dalam satu platform yang dirancang khusus untukmu.',
  badgeText: 'Platform Pembelajaran Vokasi Modern',
  ctaText: 'Mulai Belajar Sekarang',
  ctaLink: '/materi',
  bannerImage: '/svg/wave-vector-login.svg',
};

const INITIAL_ARTICLES: WebArticle[] = [
  {
    id: 'art-1',
    title: '5 Cara Efektif Menguasai Pemrograman Komputer Tanpa Stres',
    category: 'Tips Belajar',
    readTime: '5 Menit',
    author: 'Tim Kurikulum SINTESA',
    date: '12 Agt 2026',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Langkah praktis bagi pemula untuk memahami logika coding dari konsep dasar hingga proyek nyata.',
    content: 'Belajar pemrograman membutuhkan konsistensi dan pemahaman konsep dasar. Mulailah dengan membuat program sederhana dan latihan pemecahan masalah secara bertahap.',
    isFeatured: true,
  },
  {
    id: 'art-2',
    title: 'Mengenal Komponen Elektronika Dasar untuk Pemula',
    category: 'Teknologi',
    readTime: '7 Menit',
    author: 'Pak Budi Prasetyo',
    date: '10 Agt 2026',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Panduan lengkap mengenali fungsi resistor, kapasitor, dioda, dan transistor dalam rangkaian elektronik.',
    content: 'Sirkuit elektronik bekerja dengan mengalirkan arus listrik melalui komponen-komponen utama.',
    isFeatured: false,
  },
  {
    id: 'art-3',
    title: 'Manfaat Uji Kuis Interaktif dalam Memperkuat Daya Ingat',
    category: 'Strategi Belajar',
    readTime: '4 Menit',
    author: 'Ibu Siti Rahmawati',
    date: '05 Agt 2026',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Mengapa kuis berbasis gamifikasi dapat meningkatkan retensi ingatan hingga 65% saat belajar mandiri.',
    content: 'Kuis interaktif memberikan umpan balik langsung kepada siswa sehingga proses perbaikan kesalahan dapat dilakukan seketika.',
    isFeatured: true,
  },
];

const INITIAL_MODULES: ModuleItem[] = [
  {
    id: 'mod-inf-1',
    subject: 'Informatika',
    title: 'Variabel, Tipe Data & Operasi Logika',
    level: 'Pemula',
    duration: '25 Menit',
    topics: ['Variabel', 'Tipe Data Primitif', 'Operator Logika'],
    description: 'Pelajari konsep penyimpanan data dan eksekusi operasi logika dasar dalam pemrograman.',
    teacherId: 'sa-1',
    teacherName: 'Damar Hadziq H.',
    createdAt: '2026-08-01',
    isAiRecommended: true,
  },
  {
    id: 'mod-str-1',
    subject: 'Seni Tari',
    title: 'Konsep Koreografi dalam Seni Tari',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ['Koreografi', 'Wirama', 'Wiraga', 'Wirasa'],
    description: 'Mempelajari pengertian koreografi, unsur pendukung tari (wirama, wiraga, wirasa), sumber rangsang ide, serta elemen utama ruang, waktu, dan tenaga.',
    teacherId: 't-tari-2',
    teacherName: 'Anita Dwi Ningtyas',
    createdAt: '2026-08-15',
    isAiRecommended: true,
  },
  {
    id: 'mod-ot-01',
    subject: 'Otomotif',
    title: 'Sistem Pengisian Mobil Konvensional dan Elektronik/IC',
    level: 'Menengah',
    duration: '45 Menit',
    topics: ["Pengertian Sistem Pengisian", "Komponen Alternator", "Prinsip Kerja", "Troubleshooting Pengisian"],
    description: 'Memahami fungsi, komponen utama alternator, prinsip kerja pembangkitan arus, dan langkah pemecahan masalah sistem pengisian mobil konvensional serta elektronik.',
    teacherId: 't-oto-1',
    teacherName: 'Ardyan Santoso',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-ot-02',
    subject: 'Otomotif',
    title: 'Sistem Transmisi Manual',
    level: 'Menengah',
    duration: '40 Menit',
    topics: ["Pengertian Transmisi Manual", "Komponen Transmisi", "Aliran Tenaga Gigi", "Troubleshooting Transmisi"],
    description: 'Mempelajari prinsip kerja sistem transmisi manual kendaraan, fungsi kopling dan sinkromes, serta diagnosis gangguan transmisi.',
    teacherId: 't-oto-2',
    teacherName: 'Satrio',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-pjok-01',
    subject: 'Keolahragaan',
    title: 'Keterampilan Gerak & Taktik Permainan Bola Basket',
    level: 'Pemula',
    duration: '40 Menit',
    topics: ["Pendahuluan Bola Basket", "Pola Penyerangan", "Pola Pertahanan", "Keterampilan Gerak"],
    description: 'Menguasai keterampilan teknik dasar, pola penyerangan cepat (fast break), pola pertahanan man-to-man dan zone defense pada bola basket.',
    teacherId: 't-olr-1',
    teacherName: 'Brilian Anugraheni',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-pjok-02',
    subject: 'Keolahragaan',
    title: 'Keterampilan Gerak Permainan Bola Voli',
    level: 'Pemula',
    duration: '35 Menit',
    topics: ["Pengertian Bola Voli", "Passing Bawah & Atas", "Servis Bawah & Atas", "Smash & Block"],
    description: 'Mempelajari teknik dasar passing, servis, smash tajam, dan teknik bendungan (blocking) beregu dalam permainan bola voli.',
    teacherId: 't-olr-1',
    teacherName: 'Brilian Anugraheni',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-bk-01',
    subject: 'Bimbingan Konseling',
    title: 'Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ["Hakikat Percaya Diri", "Ciri Percaya Diri", "Faktor Pembentuk", "Strategi Pengembangan Diri"],
    description: 'Memahami konsep kepercayaan diri remaja, mengenali potensi personal, mengatasi rasa rendah diri, serta strategi membangun konsep diri yang optimis.',
    teacherId: 't-bk-1',
    teacherName: 'Innova Riskianugrah R.',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-bk-1',
    subject: 'Bimbingan Konseling',
    title: 'Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ['Prokrastinasi', 'Penyebab & Dampak', 'Self-Management', 'Dukungan Kelompok'],
    description: 'Memahami pengertian prokrastinasi, penyebab dan dampaknya, serta penerapan strategi self-management dan simulasi Buaya Gigitan untuk konsisten belajar.',
    teacherId: 't-bk-4',
    teacherName: 'Dinda Riestia',
    createdAt: '2026-08-21',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-bk-2',
    subject: 'Bimbingan Konseling',
    title: 'Talent Quest: Temukan Potensimu, Kembangkan Dirimu!',
    level: 'Pemula',
    duration: '35 Menit',
    topics: ['Potensi Diri', 'Ragam Potensi', 'Strength-Based', 'Talent Quest Board'],
    description: 'Mengenal dan mengembangkan potensi diri melalui pendekatan strength-based, refleksi personal, dan simulasi permainan edukatif Talent Quest.',
    teacherId: 't-bk-4',
    teacherName: 'Dinda Riestia',
    createdAt: '2026-08-22',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-bk-3',
    subject: 'Bimbingan Konseling',
    title: 'Jati Diri Tanpa Kenakalan',
    level: 'Menengah',
    duration: '40 Menit',
    topics: ['Jati Diri Remaja', 'Bentuk Kenakalan', 'Norma Pergaulan', 'Peer Pressure', 'Mind Mapping'],
    description: 'Memahami pembentukan jati diri remaja, menyelaraskan norma pergaulan teman sebaya, mengatasi peer pressure, dan studi kasus problem-based learning.',
    teacherId: 't-bk-4',
    teacherName: 'Dinda Riestia',
    createdAt: '2026-08-23',
    isPublished: true,
  },
  {
    id: 'mod-bk-4',
    subject: 'Bimbingan Konseling',
    title: 'Membangun Konsep Diri Positif',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ['Pengertian Konsep Diri', 'Self-Image', 'Self-Esteem', 'Ideal Self', 'Faktor Pembentuk'],
    description: "Memahami konsep diri remaja, 3 komponen utama (self-image, self-esteem, ideal self), faktor lingkungan, serta aktivitas refleksi diri.",
    teacherId: 't-bk-3',
    teacherName: "Erintan Tsuraya Rahadatul'Aisy",
    createdAt: '2026-08-24',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-bk-5',
    subject: 'Bimbingan Konseling',
    title: 'Personal Branding: Membangun Citra Diri Positif',
    level: 'Pemula',
    duration: '35 Menit',
    topics: ['Personal Branding', 'Potensi Diri', 'Unsur Branding', 'Kesiapan PKL & Kerja'],
    description: "Mengenali keunikan dan potensi diri, membangun citra profesional positif, serta persiapan menghadapi PKL dan dunia kerja bagi siswa SMK.",
    teacherId: 't-bk-3',
    teacherName: "Erintan Tsuraya Rahadatul'Aisy",
    createdAt: '2026-08-24',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-bk-6',
    subject: 'Bimbingan Konseling',
    title: 'Persiapan Magang dan Etika di Dunia Kerja',
    level: 'Menengah',
    duration: '40 Menit',
    topics: ['Persiapan Magang', 'Soft Skills Vokasi', 'Etika Kerja', 'Tips Profesional'],
    description: "Panduan komprehensif persiapan administratif, keterampilan, mental, dan penampilan serta etika profesional saat magang di industri.",
    teacherId: 't-bk-3',
    teacherName: "Erintan Tsuraya Rahadatul'Aisy",
    createdAt: '2026-08-24',
    isPublished: true,
  },
  {
    id: 'mod-pte-01',
    subject: 'Elektronika',
    title: 'Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri',
    level: 'Pemula',
    duration: '35 Menit',
    topics: ["Pengertian K3LH", "Budaya Kerja 5R/5S", "Potensi Bahaya Kelistrikan", "Alat Pelindung Diri (APD)"],
    description: 'Penerapan prinsip K3LH di bengkel elektronika, pencegahan kecelakaan kerja, budaya kerja industri (Ringkas, Rapi, Resik, Rawat, Rajin), serta penggunaan APD.',
    teacherId: 't-elk-5',
    teacherName: 'Fahrul Adiyansa',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-pte-02',
    subject: 'Elektronika',
    title: 'Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik',
    level: 'Pemula',
    duration: '40 Menit',
    topics: ["Perkakas Tangan Manual", "Ragam Tang & Obeng", "Power Tools Listrik", "Prosedur K3 & Perawatan"],
    description: 'Mengenal dan mengoperasikan ragam perkakas tangan manual (tang kombinasi, rivet, cucut) dan perkakas tangan bertenaga listrik (bor, gerinda, jigsaw) secara aman.',
    teacherId: 't-elk-2',
    teacherName: 'Anisa Susilawati',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-pte-03',
    subject: 'Elektronika',
    title: 'Gambar Teknik Listrik, Elektronika, dan Instrumentasi',
    level: 'Pemula',
    duration: '45 Menit',
    topics: ["Pengertian Gamtek", "Standarisasi Gambar", "Simbol Komponen Elektronika", "Diagram Skematik & Wiring"],
    description: 'Memahami bahasa visual gambar teknik, standarisasi ISO, pembacaan simbol komponen elektronika dan instrumentasi, serta perancangan diagram skematik.',
    teacherId: 't-elk-1',
    teacherName: 'Banu Mahmuda H.',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-pte-04',
    subject: 'Elektronika',
    title: 'Alat Ukur Listrik, Elektronika, dan Instrumentasi',
    level: 'Pemula',
    duration: '40 Menit',
    topics: ["Voltmeter & Amperemeter", "Multimeter Analog & Digital", "Osiloskop", "Prosedur Pengukuran Aman"],
    description: 'Pengenalan fungsi dan cara pengoperasian alat ukur kelistrikan dan instrumentasi (Multitester, Osciloscope, Signal Generator) secara presisi.',
    teacherId: 't-elk-6',
    teacherName: 'Tubagus Fauzan A.',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-pte-05',
    subject: 'Elektronika',
    title: 'Komponen Elektronika Pasif dan Aktif',
    level: 'Pemula',
    duration: '35 Menit',
    topics: ["Resistor & Kapasitor", "Induktor", "Dioda & Transistor", "IC (Integrated Circuit)"],
    description: 'Membedah karakteristik dan prinsip kerja komponen pasif (resistor, kapasitor, induktor) dan komponen aktif (dioda, transistor, IC) dalam rangkaian elektronika.',
    teacherId: 't-elk-4',
    teacherName: 'Vella Pratika I. N.',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
  {
    id: 'mod-pte-06',
    subject: 'Elektronika',
    title: 'Dasar Kelistrikan dan Hukum-Hukum Kelistrikan',
    level: 'Pemula',
    duration: '40 Menit',
    topics: ["Arus, Tegangan & Hambatan", "Hukum Ohm", "Hukum Kirchhoff I & II", "Daya dan Energi Listrik"],
    description: 'Konsep dasar besaran listrik, aplikasi perhitungan Hukum Ohm, analisis percabangan Hukum Kirchhoff, dan efisiensi konsumsi daya listrik.',
    teacherId: 't-elk-3',
    teacherName: 'Nova Milyard',
    createdAt: '2026-08-20',
    isAiRecommended: true,
    isPublished: true,
  },
];

const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: 'qz-mod-ot-01',
    subject: 'Otomotif',
    title: 'Kuis Evaluasi: Sistem Pengisian Mobil Konvensional dan Elektronik/IC',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-oto-1',
    teacherName: 'Ardyan Santoso',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-ot-01',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Sistem Pengisian Mobil Konvensional dan Elektronik/IC?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-ot-02',
    subject: 'Otomotif',
    title: 'Kuis Evaluasi: Sistem Transmisi Manual',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-oto-2',
    teacherName: 'Satrio',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-ot-02',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Sistem Transmisi Manual?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-pjok-01',
    subject: 'Keolahragaan',
    title: 'Kuis Evaluasi: Keterampilan Gerak & Taktik Permainan Bola Basket',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-olr-1',
    teacherName: 'Brilian Anugraheni',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-pjok-01',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Keterampilan Gerak & Taktik Permainan Bola Basket?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-pjok-02',
    subject: 'Keolahragaan',
    title: 'Kuis Evaluasi: Keterampilan Gerak Permainan Bola Voli',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-olr-1',
    teacherName: 'Brilian Anugraheni',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-pjok-02',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Keterampilan Gerak Permainan Bola Voli?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-bk-01',
    subject: 'Bimbingan Konseling',
    title: 'Kuis Evaluasi: Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-bk-1',
    teacherName: 'Innova Riskianugrah R.',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-bk-01',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-pte-01',
    subject: 'Elektronika',
    title: 'Kuis Evaluasi: Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-elk-5',
    teacherName: 'Fahrul Adiyansa',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-pte-01',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-pte-02',
    subject: 'Elektronika',
    title: 'Kuis Evaluasi: Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-elk-2',
    teacherName: 'Anisa Susilawati',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-pte-02',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-pte-03',
    subject: 'Elektronika',
    title: 'Kuis Evaluasi: Gambar Teknik Listrik, Elektronika, dan Instrumentasi',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-elk-1',
    teacherName: 'Banu Mahmuda H.',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-pte-03',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Gambar Teknik Listrik, Elektronika, dan Instrumentasi?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-pte-04',
    subject: 'Elektronika',
    title: 'Kuis Evaluasi: Alat Ukur Listrik, Elektronika, dan Instrumentasi',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-elk-6',
    teacherName: 'Tubagus Fauzan A.',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-pte-04',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Alat Ukur Listrik, Elektronika, dan Instrumentasi?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-pte-05',
    subject: 'Elektronika',
    title: 'Kuis Evaluasi: Komponen Elektronika Pasif dan Aktif',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-elk-4',
    teacherName: 'Vella Pratika I. N.',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-pte-05',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Komponen Elektronika Pasif dan Aktif?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
  {
    id: 'qz-mod-pte-06',
    subject: 'Elektronika',
    title: 'Kuis Evaluasi: Dasar Kelistrikan dan Hukum-Hukum Kelistrikan',
    duration: '20 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-elk-3',
    teacherName: 'Nova Milyard',
    published: true,
    createdAt: '2026-08-22',
    questions: [
      {
        id: 'q1-mod-pte-06',
        text: 'Jelaskan konsep utama yang dipelajari pada materi Dasar Kelistrikan dan Hukum-Hukum Kelistrikan?',
        options: ['Pemahaman Dasar Konsep', 'Penerapan Praktik Lapangan', 'Analisis Troubleshooting', 'Semua Benar'],
        correctAnswer: 3,
        explanation: 'Semua aspek pemahaman, penerapan, dan analisis sangat penting dalam menguasai materi ini.',
      },
    ],
  },
];

const INITIAL_STUDENTS: StudentRecord[] = [];

const INITIAL_DOCS: DocArticleItem[] = [
  {
    id: "siswa-alur-pembelajaran",
    category: "Modul & Pembelajaran",
    title: "Alur Pembelajaran & Navigasi Modul Sitemsa",
    summary: "Panduan langkah demi langkah cara menavigasi modul materi, menonton video tutorial, dan mempraktikkan panduan kerja.",
    screenshotUrl: "/images/docs/nav_tutorial.jpg",
    sections: [
      {
        title: "Pilih Materi dari Katalog Pembelajaran",
        description: "Buka halaman Materi melalui menu utama navigasi, lalu pilih materi vokasi sesuai bidang studi milikmu (Informatika, Elektronika, Seni Tari, Otomotif, dll).",
      },
      {
        title: "Gunakan Daftar Isi Pembahasan di Sidebar",
        description: "Di sebelah kanan layar desktop atau bagian atas mobile, gunakan widget 'Daftar Isi Pembahasan' untuk melompat secara instan ke bagian sub-materi tertentu.",
      },
      {
        title: "Simak Video Tutorial & Langkah Kerja",
        description: "Tonton video simulasi interaktif yang disediakan oleh pengajar, lalu ikuti panduan langkah kerja praktik secara bertahap.",
      },
    ],
  },
  {
    id: "siswa-kuis-interaktif",
    category: "Kuis & Barcode",
    title: "Cara Mengikuti Kuis: Barcode, Link Eksternal & Internal",
    summary: "Penjelasan lengkap mengenai 3 jenis metode uji pemahaman yang disediakan pengajar di Sitemsa.",
    screenshotUrl: "/images/docs/barcode_tutorial.jpg",
    sections: [
      {
        title: "Klik Tombol 'Mulai Uji Pemahaman'",
        description: "Temukan kartu 'Uji Pemahaman' pada sidebar kanan di halaman materi, kemudian klik tombol utama berwarna biru.",
      },
      {
        title: "Memahami 3 Tipe Kuis",
        description: "Sitemsa mendukung 3 sumber kuis interaktif dari pengajar: 1. Barcode/QR Code Modal (Kahoot/Quizizz), 2. Konfirmasi Link Eksternal (Google Forms), dan 3. Kuis Sitemsa.",
      },
      {
        title: "Memindai Barcode / Membuka Link Kuis",
        description: "Gunakan kamera smartphone milikmu untuk memindai Barcode di layar, atau klik tombol 'Salin Link' / 'Buka Kuis Direct' jika ingin membukanya langsung di perangkat komputer.",
      },
    ],
  },
  {
    id: "siswa-riwayat-dan-nilai",
    category: "Profil & Nilai",
    title: "Melacak Riwayat Belajar & Rekap Nilai Kuis",
    summary: "Cara melihat daftar modul yang telah selesai dipelajari beserta statistik capaian nilai kuis.",
    sections: [
      {
        title: "Buka Halaman Profil Siswa",
        description: "Klik avatar foto profilmu di navbar bagian atas kanan, lalu pilih menu 'Profil Saya' atau klik tombol 'Riwayat & Nilai Kuis'.",
      },
      {
        title: "Pilih Tab 'Riwayat Belajar & Nilai'",
        description: "Di dalam modal profil, pindah ke tab kedua untuk melihat 3 daftar modul terakhir yang kamu pelajari dan skor kuis yang berhasil kamu capai.",
      },
    ],
  },
  {
    id: "siswa-edit-profil",
    category: "Profil & Nilai",
    title: "Cara Mengubah Foto & Informasi Profil Siswa",
    summary: "Petunjuk memperbarui data diri, foto avatar, serta kata sandi akun siswa di Sitemsa.",
    sections: [
      {
        title: "Masuk ke Jendela Modal Profil",
        description: "Klik foto avatar di navbar kanan atas lalu pilih opsi 'Profil Saya'.",
      },
      {
        title: "Unggah Foto Baru atau Perbarui Informasi",
        description: "Klik tombol ikon kamera untuk mengunggah foto avatar baru, kemudian simpan perubahan dengan mengklik tombol 'Simpan Perubahan'.",
      },
    ],
  },
  {
    id: "siswa-bantu-kendala",
    category: "Modul & Pembelajaran",
    title: "Mengatasi Kendala Koneksi & Gagal Muat Media",
    summary: "Tips cepat penanganan masalah saat gambar skema atau video tutorial mengalami lambat muat di ruang kelas.",
    sections: [
      {
        title: "Muat Ulang Halaman Materi",
        description: "Tekan tombol muat ulang di browser milikmu atau periksa apakah sambungan Wi-Fi laboratorium aktif.",
      },
      {
        title: "Manfaatkan Opsi Lampiran Dokumen",
        description: "Jika video simulasi terkendala, kamu dapat mengunduh lampiran file PDF panduan yang disediakan pengajar pada widget bagian bawah.",
      },
    ],
  },
  {
    id: "siswa-sertifikat-vokasi",
    category: "Profil & Nilai",
    title: "Panduan Pengunduhan Sertifikat & Rekap Capaian",
    summary: "Petunjuk mencetak sertifikat apresiasi setelah menyelesaikan seluruh modul bidang vokasi.",
    sections: [
      {
        title: "Penyelesaian 100% Progres Pembelajaran",
        description: "Pastikan seluruh modul dan kuis evaluasi pada satu bidang studi telah diselesaikan dengan skor tuntas.",
      },
      {
        title: "Unduh Sertifikat Digital",
        description: "Buka tab Riwayat Belajar di modal profil, lalu klik tombol 'Unduh Sertifikat' berbentuk format PDF resmi.",
      },
    ],
  },
];

const INITIAL_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Mengapa Barcode QR Code kuis tidak dapat dipindai?",
    answer: "Hal ini dapat terjadi akibat pencahayaan layar proyektor yang terlalu terang atau koneksi internet yang lambat saat memuat gambar QR Code.",
  },
  {
    id: "faq-2",
    question: "Apa solusi alternatif jika scan QR Code gagal?",
    answer: "Di bawah gambar Barcode pada modal, tersedia tombol 'Salin Link Kuis Direct'. Kamu dapat menyalin tautan tersebut dan mengkliknya langsung untuk bergabung ke kuis.",
  },
  {
    id: "faq-3",
    question: "Apakah kuis Sitemsa bisa dikerjakan di smartphone?",
    answer: "Ya, seluruh tampilan Sitemsa dan modal kuis sudah dioptimalkan penuh untuk layar hp maupun komputer tablet.",
  },
  {
    id: "faq-4",
    question: "Bagaimana cara mereset progres belajar modul?",
    answer: "Progres modul diperbarui secara otomatis ketika kamu membaca materi hingga selesai. Kamu dapat mengulang membaca modul kapan saja melalui katalog materi.",
  },
];

const INITIAL_TEAM_MEMBERS: TeamMemberItem[] = [
  { id: "tm-1", image: "https://i.pravatar.cc/300?img=11", title: "Damar Hadziq H.", subtitle: "Developer", handle: "@damarhadziq", borderColor: "#4F46E5", division: "Pend. Informatika" },
  { id: "tm-2", image: "https://i.pravatar.cc/300?img=13", title: "Mochammad Rizal D. D.", subtitle: "Sub-Developer", handle: "@rizaldaffa", borderColor: "#3B82F6", division: "Pend. Informatika" },
  { id: "tm-3", image: "https://i.pravatar.cc/300?img=19", title: "M. Sulthon Abdullah A.", subtitle: "Sub-Developer", handle: "@sulthonazzam", borderColor: "#2563EB", division: "Pend. Informatika" },
  { id: "tm-4", image: "https://i.pravatar.cc/300?img=25", title: "Lovyca Imeyra E.", subtitle: "Sub-Developer", handle: "@lovycaimeyra", borderColor: "#10B981", division: "Pend. Informatika" },
  { id: "tm-5", image: "https://i.pravatar.cc/300?img=16", title: "Innova Riskianugrah R.", subtitle: "Instructional Designer", handle: "@innovariskia", borderColor: "#06B6D4", division: "BK" },
  { id: "tm-6", image: "https://i.pravatar.cc/300?img=18", title: "Fateka Maulana A. K.", subtitle: "Instructional Designer", handle: "@fatekamaulana", borderColor: "#10B981", division: "BK" },
  { id: "tm-7", image: "https://i.pravatar.cc/300?img=22", title: "Erintan Tsuraya R.", subtitle: "Instructional Designer", handle: "@erintantsuraya", borderColor: "#06B6D4", division: "BK" },
  { id: "tm-8", image: "https://i.pravatar.cc/300?img=30", title: "Dinda Riestia", subtitle: "Instructional Designer", handle: "@dindariestia", borderColor: "#8B5CF6", division: "BK" },
  { id: "tm-9", image: "https://i.pravatar.cc/300?img=17", title: "Ardyan Santoso", subtitle: "Instructional Designer", handle: "@ardyansantoso", borderColor: "#3B82F6", division: "Pend. Otomotif" },
  { id: "tm-10", image: "https://i.pravatar.cc/300?img=23", title: "Satrio", subtitle: "Instructional Designer", handle: "@satrio", borderColor: "#4F46E5", division: "Pend. Otomotif" },
  { id: "tm-11", image: "https://i.pravatar.cc/300?img=27", title: "Agam Ainun Ramadhan", subtitle: "Instructional Designer", handle: "@agamainun", borderColor: "#8B5CF6", division: "Pend. Otomotif" },
  { id: "tm-12", image: "https://i.pravatar.cc/300?img=14", title: "Banu Mahmuda H.", subtitle: "Instructional Designer", handle: "@banumahmuda", borderColor: "#EF4444", division: "Pend. Elektronika" },
  { id: "tm-13", image: "https://i.pravatar.cc/300?img=21", title: "Anisa Susilawati", subtitle: "Instructional Designer", handle: "@anisasusilawati", borderColor: "#8B5CF6", division: "Pend. Elektronika" },
  { id: "tm-14", image: "https://i.pravatar.cc/300?img=26", title: "Nova Milyard", subtitle: "Instructional Designer", handle: "@novamilyard", borderColor: "#EF4444", division: "Pend. Elektronika" },
  { id: "tm-15", image: "https://i.pravatar.cc/300?img=32", title: "Vella Pratika I. N.", subtitle: "Instructional Designer", handle: "@vellapratika", borderColor: "#F59E0B", division: "Pend. Elektronika" },
  { id: "tm-16", image: "https://i.pravatar.cc/300?img=33", title: "Fahrul Adiyansa", subtitle: "Instructional Designer", handle: "@fahruladiyansa", borderColor: "#8B5CF6", division: "Pend. Elektronika" },
  { id: "tm-17", image: "https://i.pravatar.cc/300?img=15", title: "Tubagus Fauzan A.", subtitle: "Instructional Designer", handle: "@tubagusfauzan", borderColor: "#06B6D4", division: "Pend. Elektronika" },
  { id: "tm-18", image: "https://i.pravatar.cc/300?img=29", title: "Brilian Anugraheni", subtitle: "Instructional Designer", handle: "@briliananugraheni", borderColor: "#3B82F6", division: "Pend. Olahraga" },
  { id: "tm-19", image: "https://i.pravatar.cc/300?img=31", title: "Ahmad Luthfi F.", subtitle: "Instructional Designer", handle: "@ahmadluthfi", borderColor: "#F59E0B", division: "Pend. Olahraga" },
  { id: "tm-20", image: "https://i.pravatar.cc/300?img=34", title: "Rinal Febriarso D. P.", subtitle: "Instructional Designer", handle: "@rinalfebriarso", borderColor: "#06B6D4", division: "Pend. Olahraga" },
  { id: "tm-21", image: "https://i.pravatar.cc/300?img=12", title: "Vivi Riska Wardani", subtitle: "Instructional Designer", handle: "@viviriska", borderColor: "#10B981", division: "Pend. Seni Tari" },
  { id: "tm-22", image: "https://i.pravatar.cc/300?img=20", title: "Anita Dwi Ningtyas", subtitle: "Instructional Designer", handle: "@anitadwi", borderColor: "#EF4444", division: "Pend. Seni Tari" },
  { id: "tm-23", image: "/images/meliana.jpg", title: "Meliana Dwi Yanti", subtitle: "Instructional Designer", handle: "@melianadwi", borderColor: "#10B981", division: "Pend. Seni Tari" },
  { id: "tm-24", image: "https://i.pravatar.cc/300?img=28", title: "Hasnita Ivangka", subtitle: "Instructional Designer", handle: "@hasnitaivangka", borderColor: "#06B6D4", division: "Pend. Seni Tari" }
];

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set) => ({
      subjects: INITIAL_SUBJECTS,
      teachers: INITIAL_TEACHERS,
      heroContent: INITIAL_HERO,
      articles: INITIAL_ARTICLES,
      docs: INITIAL_DOCS,
      faqs: INITIAL_FAQS,
      teamMembers: INITIAL_TEAM_MEMBERS,
      modules: INITIAL_MODULES,
      quizzes: INITIAL_QUIZZES,
      students: INITIAL_STUDENTS,

      // Teacher actions
      addTeacher: (teacherData) =>
        set((state) => ({
          teachers: [
            ...state.teachers,
            {
              ...teacherData,
              id: `t-${Date.now()}`,
              createdAt: new Date().toISOString().split('T')[0],
            },
          ],
        })),

      updateTeacher: (id, updatedFields) =>
        set((state) => ({
          teachers: state.teachers.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
        })),

      deleteTeacher: (id) =>
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
        })),

      assignSubjectsToTeacher: (teacherId, assignedSubjects) =>
        set((state) => ({
          teachers: state.teachers.map((t) => (t.id === teacherId ? { ...t, assignedSubjects } : t)),
        })),

      // Website Content Actions - Hero
      updateHeroContent: (newHero) =>
        set((state) => ({
          heroContent: { ...state.heroContent, ...newHero },
        })),

      // Website Content Actions - Articles
      addArticle: (articleData) =>
        set((state) => ({
          articles: [
            {
              ...articleData,
              id: `art-${Date.now()}`,
              date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            },
            ...state.articles,
          ],
        })),

      updateArticle: (id, updatedFields) =>
        set((state) => ({
          articles: state.articles.map((a) => (a.id === id ? { ...a, ...updatedFields } : a)),
        })),

      deleteArticle: (id) =>
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id),
        })),

      // Website Content Actions - Documentation & Guides
      addDoc: (docData) =>
        set((state) => ({
          docs: [
            {
              ...docData,
              id: `doc-${Date.now()}`,
            },
            ...state.docs,
          ],
        })),

      updateDoc: (id, updatedFields) =>
        set((state) => ({
          docs: state.docs.map((d) => (d.id === id ? { ...d, ...updatedFields } : d)),
        })),

      deleteDoc: (id) =>
        set((state) => ({
          docs: state.docs.filter((d) => d.id !== id),
        })),

      // Website Content Actions - FAQs
      addFaq: (faqData) =>
        set((state) => ({
          faqs: [
            ...state.faqs,
            {
              ...faqData,
              id: `faq-${Date.now()}`,
            },
          ],
        })),

      updateFaq: (id, updatedFields) =>
        set((state) => ({
          faqs: state.faqs.map((f) => (f.id === id ? { ...f, ...updatedFields } : f)),
        })),

      deleteFaq: (id) =>
        set((state) => ({
          faqs: state.faqs.filter((f) => f.id !== id),
        })),

      // Website Content Actions - Team Members
      addTeamMember: (memberData) =>
        set((state) => ({
          teamMembers: [
            ...state.teamMembers,
            {
              ...memberData,
              id: `tm-${Date.now()}`,
            },
          ],
        })),

      updateTeamMember: (id, updatedFields) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((m) => (m.id === id ? { ...m, ...updatedFields } : m)),
        })),

      deleteTeamMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id),
        })),

      // Subject Actions
      addSubject: (subjectData) =>
        set((state) => ({
          subjects: [
            ...state.subjects,
            {
              ...subjectData,
              id: `sub-${Date.now()}`,
              totalModules: 0,
              totalQuizzes: 0,
            },
          ],
        })),

      updateSubject: (id, updatedFields) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...updatedFields } : s)),
        })),

      // Module Actions
      addModule: (moduleData) => {
        const newId = (moduleData as any).id || generateEntityId('mod', moduleData.subject, moduleData.teacherId);
        set((state) => ({
          modules: [
            {
              ...moduleData,
              id: newId,
              createdAt: new Date().toISOString().split('T')[0],
            },
            ...state.modules,
          ],
          subjects: state.subjects.map((s) =>
            s.name.toLowerCase() === moduleData.subject.toLowerCase()
              ? { ...s, totalModules: (s.totalModules || 0) + 1 }
              : s
          ),
        }));

        try {
          addUserNotification({
            type: 'materi',
            title: 'Modul Praktik Baru Rilis',
            message: `${moduleData.teacherName || 'Pengajar'} menambahkan modul baru '${moduleData.title}' di bidang ${moduleData.subject}.`,
            linkUrl: `/materi`,
          });
        } catch {}

        return newId;
      },

      updateModule: (id, updatedFields) =>
        set((state) => ({
          modules: state.modules.map((m) => (m.id === id ? { ...m, ...updatedFields } : m)),
        })),

      deleteModule: (id) =>
        set((state) => {
          const mod = state.modules.find((m) => m.id === id);
          return {
            modules: state.modules.filter((m) => m.id !== id),
            subjects: mod
              ? state.subjects.map((s) =>
                  s.name.toLowerCase() === mod.subject.toLowerCase() && s.totalModules > 0
                    ? { ...s, totalModules: s.totalModules - 1 }
                    : s
                )
              : state.subjects,
          };
        }),

      // Quiz Actions
      addQuiz: (quizData) => {
        const newId = (quizData as any).id || generateEntityId('quiz', quizData.subject, quizData.teacherId);
        set((state) => ({
          quizzes: [
            {
              ...quizData,
              id: newId,
              createdAt: new Date().toISOString().split('T')[0],
            },
            ...state.quizzes,
          ],
          subjects: state.subjects.map((s) =>
            s.name.toLowerCase() === quizData.subject.toLowerCase()
              ? { ...s, totalQuizzes: (s.totalQuizzes || 0) + 1 }
              : s
          ),
        }));

        try {
          addUserNotification({
            type: 'pengingat',
            title: 'Kuis Evaluasi Baru Tersedia',
            message: `Kuis baru '${quizData.title}' untuk mata pelajaran ${quizData.subject} kini telah dibuka.`,
            linkUrl: `/materi`,
          });
        } catch {}

        return newId;
      },

      updateQuiz: (id, updatedFields) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) => (q.id === id ? { ...q, ...updatedFields } : q)),
        })),

      deleteQuiz: (id) =>
        set((state) => {
          const qz = state.quizzes.find((q) => q.id === id);
          return {
            quizzes: state.quizzes.filter((q) => q.id !== id),
            subjects: qz
              ? state.subjects.map((s) =>
                  s.name.toLowerCase() === qz.subject.toLowerCase() && s.totalQuizzes > 0
                    ? { ...s, totalQuizzes: s.totalQuizzes - 1 }
                    : s
                )
              : state.subjects,
          };
        }),

      // Student Actions
      setStudents: (students) => set({ students }),

      addStudentScore: (studentId, scoreRecord) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  quizHistory: [scoreRecord, ...s.quizHistory],
                }
              : s
          ),
        })),

      updateStudentProgress: (studentId, subject, progress) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  moduleProgress: {
                    ...s.moduleProgress,
                    [subject]: progress,
                  },
                }
              : s
          ),
        })),
    }),
    {
      name: 'sintesa_admin_storage_v6',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
