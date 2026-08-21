import { create } from 'zustand';

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
  correctAnswer: number; // Index 0..3
  explanation: string;
}

export interface QuizItem {
  id: string;
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
    id: 't-1',
    nip: '19850412 201001 1 003',
    name: 'Pak Budi Prasetyo, M.Kom.',
    email: 'budi.guru@sintesa.id',
    avatar: 'https://i.pravatar.cc/150?img=60',
    phone: '081234567890',
    assignedSubjects: ['Informatika'],
    status: 'Aktif',
    createdAt: '2025-01-10',
  },
  {
    id: 't-2',
    nip: '19900823 201502 2 005',
    name: 'Ibu Siti Rahmawati, S.T.',
    email: 'siti.guru@sintesa.id',
    avatar: 'https://i.pravatar.cc/150?img=47',
    phone: '081987654321',
    assignedSubjects: ['Elektronika', 'Otomotif'],
    status: 'Aktif',
    createdAt: '2025-02-01',
  },
  {
    id: 't-3',
    nip: '19881115 201201 1 002',
    name: 'Pak Ahmad Fauzi, S.Pd.',
    email: 'ahmad.guru@sintesa.id',
    avatar: 'https://i.pravatar.cc/150?img=11',
    phone: '085712345678',
    assignedSubjects: ['Seni & Desain'],
    status: 'Aktif',
    createdAt: '2025-03-12',
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
    id: 'mod-1',
    subject: 'Informatika',
    title: 'Variabel, Tipe Data & Operasi Logika',
    level: 'Pemula',
    duration: '25 Menit',
    topics: ['Variabel', 'Tipe Data Primitif', 'Operator Logika'],
    description: 'Pelajari konsep penyimpanan data dan eksekusi operasi logika dasar dalam pemrograman.',
    teacherId: 't-1',
    teacherName: 'Pak Budi Prasetyo, M.Kom.',
    createdAt: '2026-08-01',
    isAiRecommended: true,
  },
  {
    id: 'mod-2',
    subject: 'Informatika',
    title: 'Struktur Percabangan (If-Else & Switch)',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ['Kondisi If-Else', 'Nested If', 'Switch Case'],
    description: 'Kuasai pengambilan keputusan dalam kode berdasarkan kondisi logika yang dievaluasi.',
    teacherId: 't-1',
    teacherName: 'Pak Budi Prasetyo, M.Kom.',
    createdAt: '2026-08-03',
  },
  {
    id: 'mod-3',
    subject: 'Informatika',
    title: 'Perulangan & Iterasi Algoritma',
    level: 'Pemula',
    duration: '35 Menit',
    topics: ['For Loop', 'While & Do-While', 'Break & Continue'],
    description: 'Pahami teknik mengeksekusi instruksi berulang secara efisien menggunakan perulangan.',
    teacherId: 't-1',
    teacherName: 'Pak Budi Prasetyo, M.Kom.',
    createdAt: '2026-08-05',
  },
  {
    id: 'mod-4',
    subject: 'Elektronika',
    title: 'Analisis Sirkuit Seri & Paralel Resistor',
    level: 'Pemula',
    duration: '20 Menit',
    topics: ['Hukum Ohm', 'Hambatan Total', 'Pengukur Multimeter'],
    description: 'Hitung dan praktikkkan arus serta tegangan listrik pada rangkaian komponen pasif.',
    teacherId: 't-2',
    teacherName: 'Ibu Siti Rahmawati, S.T.',
    createdAt: '2026-08-02',
    isAiRecommended: true,
  },
  {
    id: 'mod-5',
    subject: 'Elektronika',
    title: 'Karakteristik Dioda & Aplikasi Transistor',
    level: 'Menengah',
    duration: '40 Menit',
    topics: ['Dioda Penyearah', 'Transistor BJT', 'Sakelar Elektronik'],
    description: 'Prinsip pemotongan arus satu arah dan penggunaan transistor sebagai penguat sinyal.',
    teacherId: 't-2',
    teacherName: 'Ibu Siti Rahmawati, S.T.',
    createdAt: '2026-08-04',
  },
];

const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: 'qz-1',
    subject: 'Informatika',
    title: 'Evaluasi Logika & Pemrograman Dasar',
    duration: '15 Menit',
    passScore: 75,
    questionCount: 3,
    teacherId: 't-1',
    teacherName: 'Pak Budi Prasetyo, M.Kom.',
    published: true,
    createdAt: '2026-08-02',
    questions: [
      {
        id: 'q-1',
        text: 'Tipe data mana yang digunakan untuk menyimpan nilai kebenaran (True/False)?',
        options: ['Integer', 'String', 'Boolean', 'Float'],
        correctAnswer: 2,
        explanation: 'Boolean hanya memiliki 2 nilai yaitu true (benar) atau false (salah).',
      },
      {
        id: 'q-2',
        text: 'Manakah operator yang digunakan untuk mengecek kesamaan nilai dan tipe data dalam JavaScript?',
        options: ['==', '=', '===', '!='],
        correctAnswer: 2,
        explanation: 'Operator === mengecek kesamaan nilai sekaligus tipe datanya (strict equality).',
      },
      {
        id: 'q-3',
        text: 'Instruksi perulangan yang pasti mengeksekusi blok minimal satu kali adalah...',
        options: ['For Loop', 'Do-While Loop', 'While Loop', 'ForEach'],
        correctAnswer: 1,
        explanation: 'Do-while mengevaluasi kondisi di akhir blok, sehingga blok dijalankan minimal 1 kali.',
      },
    ],
  },
  {
    id: 'qz-2',
    subject: 'Elektronika',
    title: 'Kuis Sirkuit Listrik & Hukum Ohm',
    duration: '20 Menit',
    passScore: 70,
    questionCount: 2,
    teacherId: 't-2',
    teacherName: 'Ibu Siti Rahmawati, S.T.',
    published: true,
    createdAt: '2026-08-04',
    questions: [
      {
        id: 'q-4',
        text: 'Berdasarkan Hukum Ohm, hubungan antara Tegangan (V), Arus (I), dan Hambatan (R) adalah...',
        options: ['V = I / R', 'V = I * R', 'I = V * R', 'R = V * I'],
        correctAnswer: 1,
        explanation: 'Hukum Ohm menyatakan bahwa Tegangan (V) sama dengan Arus (I) dikali Hambatan (R).',
      },
      {
        id: 'q-5',
        text: 'Komponen elektronik yang berfungsi menyimpan muatan listrik sementara adalah...',
        options: ['Resistor', 'Kapasitor', 'Induktor', 'Dioda'],
        correctAnswer: 1,
        explanation: 'Kapasitor menyimpan energi listrik dalam bentuk medan elektrostatik.',
      },
    ],
  },
];

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'std-1',
    nisn: '0061234567',
    name: 'Andi Pratama',
    email: 'andi.pratama@siswa.sintesa.id',
    classGroup: 'XI RPL 1',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastActive: '2026-08-15 14:20',
    enrolledSubjects: ['Informatika', 'Elektronika'],
    moduleProgress: {
      Informatika: 85,
      Elektronika: 60,
    },
    quizHistory: [
      {
        id: 'qh-1',
        subject: 'Informatika',
        quizTitle: 'Evaluasi Logika & Pemrograman Dasar',
        score: 90,
        maxScore: 100,
        date: '2026-08-14',
        status: 'Lulus',
      },
      {
        id: 'qh-2',
        subject: 'Elektronika',
        quizTitle: 'Kuis Sirkuit Listrik & Hukum Ohm',
        score: 75,
        maxScore: 100,
        date: '2026-08-12',
        status: 'Lulus',
      },
    ],
  },
  {
    id: 'std-2',
    nisn: '0069876543',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@siswa.sintesa.id',
    classGroup: 'XI RPL 2',
    avatar: 'https://i.pravatar.cc/150?img=32',
    lastActive: '2026-08-15 11:45',
    enrolledSubjects: ['Informatika', 'Seni & Desain'],
    moduleProgress: {
      Informatika: 100,
      'Seni & Desain': 90,
    },
    quizHistory: [
      {
        id: 'qh-3',
        subject: 'Informatika',
        quizTitle: 'Evaluasi Logika & Pemrograman Dasar',
        score: 95,
        maxScore: 100,
        date: '2026-08-13',
        status: 'Lulus',
      },
    ],
  },
  {
    id: 'std-3',
    nisn: '0065544332',
    name: 'Rian Hidayat',
    email: 'rian.hidayat@siswa.sintesa.id',
    classGroup: 'XI TAV 1',
    avatar: 'https://i.pravatar.cc/150?img=15',
    lastActive: '2026-08-14 16:30',
    enrolledSubjects: ['Elektronika', 'Otomotif'],
    moduleProgress: {
      Elektronika: 40,
      Otomotif: 50,
    },
    quizHistory: [
      {
        id: 'qh-4',
        subject: 'Elektronika',
        quizTitle: 'Kuis Sirkuit Listrik & Hukum Ohm',
        score: 60,
        maxScore: 100,
        date: '2026-08-10',
        status: 'Perlu Bimbingan',
      },
    ],
  },
  {
    id: 'std-4',
    nisn: '0061122334',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@siswa.sintesa.id',
    classGroup: 'XI DKV 2',
    avatar: 'https://i.pravatar.cc/150?img=25',
    lastActive: '2026-08-15 09:10',
    enrolledSubjects: ['Seni & Desain', 'Informatika'],
    moduleProgress: {
      'Seni & Desain': 95,
      Informatika: 70,
    },
    quizHistory: [
      {
        id: 'qh-5',
        subject: 'Informatika',
        quizTitle: 'Evaluasi Logika & Pemrograman Dasar',
        score: 85,
        maxScore: 100,
        date: '2026-08-11',
        status: 'Lulus',
      },
    ],
  },
  {
    id: 'std-5',
    nisn: '0064433221',
    name: 'Bagus Setiawan',
    email: 'bagus@siswa.sintesa.id',
    classGroup: 'XI RPL 1',
    avatar: 'https://i.pravatar.cc/150?img=53',
    lastActive: '2026-08-16 10:15',
    enrolledSubjects: ['Informatika'],
    moduleProgress: { Informatika: 100 },
    quizHistory: [
      { id: 'qh-6', subject: 'Informatika', quizTitle: 'Evaluasi Logika & Pemrograman Dasar', score: 92, maxScore: 100, date: '2026-08-15', status: 'Lulus' }
    ],
  },
  {
    id: 'std-6',
    nisn: '0065566778',
    name: 'Fadhil Rahman',
    email: 'fadhil@siswa.sintesa.id',
    classGroup: 'XI RPL 1',
    avatar: 'https://i.pravatar.cc/150?img=68',
    lastActive: '2026-08-16 11:30',
    enrolledSubjects: ['Informatika'],
    moduleProgress: { Informatika: 66 },
    quizHistory: [
      { id: 'qh-7', subject: 'Informatika', quizTitle: 'Evaluasi Logika & Pemrograman Dasar', score: 78, maxScore: 100, date: '2026-08-14', status: 'Lulus' }
    ],
  },
  {
    id: 'std-7',
    nisn: '0067788990',
    name: 'Gita Gutawa',
    email: 'gita@siswa.sintesa.id',
    classGroup: 'XI RPL 2',
    avatar: 'https://i.pravatar.cc/150?img=47',
    lastActive: '2026-08-16 08:20',
    enrolledSubjects: ['Informatika'],
    moduleProgress: { Informatika: 100 },
    quizHistory: [
      { id: 'qh-8', subject: 'Informatika', quizTitle: 'Evaluasi Logika & Pemrograman Dasar', score: 98, maxScore: 100, date: '2026-08-15', status: 'Lulus' }
    ],
  },
  {
    id: 'std-8',
    nisn: '0068899001',
    name: 'Hafiz Ahmad',
    email: 'hafiz@siswa.sintesa.id',
    classGroup: 'XI DKV 1',
    avatar: 'https://i.pravatar.cc/150?img=11',
    lastActive: '2026-08-15 17:00',
    enrolledSubjects: ['Informatika'],
    moduleProgress: { Informatika: 33 },
    quizHistory: [
      { id: 'qh-9', subject: 'Informatika', quizTitle: 'Evaluasi Logika & Pemrograman Dasar', score: 65, maxScore: 100, date: '2026-08-10', status: 'Perlu Bimbingan' }
    ],
  },
  {
    id: 'std-9',
    nisn: '0069900112',
    name: 'Indah Permata',
    email: 'indah@siswa.sintesa.id',
    classGroup: 'XI RPL 2',
    avatar: 'https://i.pravatar.cc/150?img=44',
    lastActive: '2026-08-16 13:40',
    enrolledSubjects: ['Informatika'],
    moduleProgress: { Informatika: 100 },
    quizHistory: [
      { id: 'qh-10', subject: 'Informatika', quizTitle: 'Evaluasi Logika & Pemrograman Dasar', score: 88, maxScore: 100, date: '2026-08-14', status: 'Lulus' }
    ],
  },
  {
    id: 'std-10',
    nisn: '0060011223',
    name: 'Joko Widodo',
    email: 'joko@siswa.sintesa.id',
    classGroup: 'XI RPL 1',
    avatar: 'https://i.pravatar.cc/150?img=59',
    lastActive: '2026-08-16 14:10',
    enrolledSubjects: ['Informatika'],
    moduleProgress: { Informatika: 100 },
    quizHistory: [
      { id: 'qh-11', subject: 'Informatika', quizTitle: 'Evaluasi Logika & Pemrograman Dasar', score: 90, maxScore: 100, date: '2026-08-15', status: 'Lulus' }
    ],
  },
  {
    id: 'std-11',
    nisn: '0061122335',
    name: 'Kirana Larasati',
    email: 'kirana@siswa.sintesa.id',
    classGroup: 'XI DKV 2',
    avatar: 'https://i.pravatar.cc/150?img=49',
    lastActive: '2026-08-16 15:00',
    enrolledSubjects: ['Informatika'],
    moduleProgress: { Informatika: 66 },
    quizHistory: [
      { id: 'qh-12', subject: 'Informatika', quizTitle: 'Evaluasi Logika & Pemrograman Dasar', score: 80, maxScore: 100, date: '2026-08-14', status: 'Lulus' }
    ],
  },
  {
    id: 'std-12',
    nisn: '0062233446',
    name: 'Lukman Hakim',
    email: 'lukman@siswa.sintesa.id',
    classGroup: 'XI RPL 2',
    avatar: 'https://i.pravatar.cc/150?img=33',
    lastActive: '2026-08-16 16:20',
    enrolledSubjects: ['Informatika'],
    moduleProgress: { Informatika: 100 },
    quizHistory: [
      { id: 'qh-13', subject: 'Informatika', quizTitle: 'Evaluasi Logika & Pemrograman Dasar', score: 96, maxScore: 100, date: '2026-08-15', status: 'Lulus' }
    ],
  },
];

export const useAdminStore = create<AdminStoreState>((set) => ({
  subjects: INITIAL_SUBJECTS,
  teachers: INITIAL_TEACHERS,
  heroContent: INITIAL_HERO,
  articles: INITIAL_ARTICLES,
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

  // Website Content Actions
  updateHeroContent: (newHero) =>
    set((state) => ({
      heroContent: { ...state.heroContent, ...newHero },
    })),

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
    const newId = `mod-${Date.now()}`;
    set((state) => ({
      modules: [
        {
          ...moduleData,
          id: newId,
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...state.modules,
      ],
    }));
    return newId;
  },

  updateModule: (id, updatedFields) =>
    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? { ...m, ...updatedFields } : m)),
    })),

  deleteModule: (id) =>
    set((state) => ({
      modules: state.modules.filter((m) => m.id !== id),
    })),

  // Quiz Actions
  addQuiz: (quizData) => {
    const newId = `qz-${Date.now()}`;
    set((state) => ({
      quizzes: [
        {
          ...quizData,
          id: newId,
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...state.quizzes,
      ],
    }));
    return newId;
  },

  updateQuiz: (id, updatedFields) =>
    set((state) => ({
      quizzes: state.quizzes.map((q) => (q.id === id ? { ...q, ...updatedFields } : q)),
    })),

  deleteQuiz: (id) =>
    set((state) => ({
      quizzes: state.quizzes.filter((q) => q.id !== id),
    })),

  // Student Actions
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
}));
