import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addUserNotification } from '@/services/notification.service';

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
    email: 'budi.guru@sitemsa.sch.id',
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
    email: 'siti.guru@sitemsa.sch.id',
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
    email: 'ahmad.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=11',
    phone: '085712345678',
    assignedSubjects: ['Seni Tari', 'Seni & Desain'],
    status: 'Aktif',
    createdAt: '2025-03-12',
  },
  {
    id: 't-4',
    nip: '19930514 201903 2 008',
    name: 'Dinda Riestia',
    email: 'dinda.guru@sitemsa.sch.id',
    avatar: 'https://i.pravatar.cc/150?img=32',
    phone: '081298765432',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
    status: 'Aktif',
    createdAt: '2025-04-10',
  },
  {
    id: 't-5',
    nip: '19940822 202012 2 009',
    name: "Erintan Tsuraya Rahadatul'Aisy",
    email: 'erintan.guru@sitemsa.sch.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    phone: '081324567890',
    assignedSubjects: ['Bimbingan Konseling', 'Bimbingan dan Konseling'],
    status: 'Aktif',
    createdAt: '2025-05-01',
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
  {
    id: 'mod-bk-1',
    subject: 'Bimbingan Konseling',
    title: 'Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ['Prokrastinasi', 'Penyebab & Dampak', 'Self-Management', 'Dukungan Kelompok'],
    description: 'Memahami pengertian prokrastinasi, penyebab dan dampaknya, serta penerapan strategi self-management dan simulasi Buaya Gigitan untuk konsisten belajar.',
    teacherId: 't-4',
    teacherName: 'Dinda Riestia',
    createdAt: '2026-08-21',
    isAiRecommended: true,
  },
  {
    id: 'mod-bk-2',
    subject: 'Bimbingan Konseling',
    title: 'Talent Quest: Temukan Potensimu, Kembangkan Dirimu!',
    level: 'Pemula',
    duration: '35 Menit',
    topics: ['Potensi Diri', 'Ragam Potensi', 'Strength-Based', 'Talent Quest Board'],
    description: 'Mengenal dan mengembangkan potensi diri melalui pendekatan strength-based, refleksi personal, dan simulasi permainan edukatif Talent Quest.',
    teacherId: 't-4',
    teacherName: 'Dinda Riestia',
    createdAt: '2026-08-22',
    isAiRecommended: true,
  },
  {
    id: 'mod-bk-3',
    subject: 'Bimbingan Konseling',
    title: 'Jati Diri Tanpa Kenakalan',
    level: 'Menengah',
    duration: '40 Menit',
    topics: ['Jati Diri Remaja', 'Bentuk Kenakalan', 'Norma Pergaulan', 'Peer Pressure', 'Mind Mapping'],
    description: 'Memahami pembentukan jati diri remaja, menyelaraskan norma pergaulan teman sebaya, mengatasi peer pressure, dan studi kasus problem-based learning.',
    teacherId: 't-4',
    teacherName: 'Dinda Riestia',
    createdAt: '2026-08-23',
  },
  {
    id: 'mod-bk-4',
    subject: 'Bimbingan Konseling',
    title: 'Membangun Konsep Diri Positif',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ['Pengertian Konsep Diri', 'Self-Image', 'Self-Esteem', 'Ideal Self', 'Faktor Pembentuk'],
    description: "Memahami konsep diri remaja, 3 komponen utama (self-image, self-esteem, ideal self), faktor lingkungan, serta aktivitas refleksi diri.",
    teacherId: 't-5',
    teacherName: "Erintan Tsuraya Rahadatul'Aisy",
    createdAt: '2026-08-24',
    isAiRecommended: true,
  },
  {
    id: 'mod-bk-5',
    subject: 'Bimbingan Konseling',
    title: 'Personal Branding: Membangun Citra Diri Positif',
    level: 'Pemula',
    duration: '35 Menit',
    topics: ['Personal Branding', 'Potensi Diri', 'Unsur Branding', 'Kesiapan PKL & Kerja'],
    description: "Mengenali keunikan dan potensi diri, membangun citra profesional positif, serta persiapan menghadapi PKL dan dunia kerja bagi siswa SMK.",
    teacherId: 't-5',
    teacherName: "Erintan Tsuraya Rahadatul'Aisy",
    createdAt: '2026-08-24',
    isAiRecommended: true,
  },
  {
    id: 'mod-bk-6',
    subject: 'Bimbingan Konseling',
    title: 'Persiapan Magang dan Etika di Dunia Kerja',
    level: 'Menengah',
    duration: '40 Menit',
    topics: ['Persiapan Magang', 'Soft Skills Vokasi', 'Etika Kerja', 'Tips Profesional'],
    description: "Panduan komprehensif persiapan administratif, keterampilan, mental, dan penampilan serta etika profesional saat magang di industri.",
    teacherId: 't-5',
    teacherName: "Erintan Tsuraya Rahadatul'Aisy",
    createdAt: '2026-08-24',
  },
  {
    id: 'mod-tari-1',
    subject: 'Seni Tari',
    title: 'Konsep Koreografi dalam Seni Tari',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ['Koreografi', 'Wirama', 'Wiraga', 'Wirasa'],
    description: 'Mempelajari pengertian koreografi, unsur pendukung tari (wirama, wiraga, wirasa), sumber rangsang ide, serta elemen utama ruang, waktu, dan tenaga.',
    teacherId: 't-3',
    teacherName: 'Pak Ahmad Fauzi, S.Pd.',
    createdAt: '2026-08-15',
    isAiRecommended: true,
  },
  {
    id: 'mod-tari-2',
    subject: 'Seni Tari',
    title: 'Koreografi: Eksplorasi Gerak Dalam Seni Tari',
    level: 'Pemula',
    duration: '35 Menit',
    topics: ['Eksplorasi Gerak', 'Rangsang Kinestetik', 'Transformasi Gerak', 'Tempo & Level'],
    description: 'Memahami prinsip eksplorasi gerak tari, berbagai sumber rangsangan (visual, audio, kinestetik, gagasan), dan teknik pengembangan gerak dasar.',
    teacherId: 't-3',
    teacherName: 'Pak Ahmad Fauzi, S.Pd.',
    createdAt: '2026-08-16',
    isAiRecommended: true,
  },
  {
    id: 'mod-tari-3',
    subject: 'Seni Tari',
    title: 'Koreografi: Pola Lantai dalam Penunjang Komposisi Tari',
    level: 'Menengah',
    duration: '40 Menit',
    topics: ['Komposisi Tari', 'Pola Lantai', 'Level Vertikal', 'Prinsip Unity Balance'],
    description: 'Mempelajari unsur utama komposisi tari, pola lantai, level, arah hadap, prinsip kesatuan & keseimbangan, serta ragam panggung pertunjukan.',
    teacherId: 't-3',
    teacherName: 'Pak Ahmad Fauzi, S.Pd.',
    createdAt: '2026-08-17',
  },
  {
    id: 'mod-tari-4',
    subject: 'Seni Tari',
    title: 'Tata Rias dalam Seni Tari',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ['Tata Rias Tari', 'Rias Korektif', 'Rias Karakter', 'Rias Fantasi'],
    description: 'Mempelajari fungsi tata rias panggung, jenis rias (korektif, karakter, fantasi), dan langkah-langkah aplikasi riasan korektif.',
    teacherId: 't-3',
    teacherName: 'Pak Ahmad Fauzi, S.Pd.',
    createdAt: '2026-08-18',
  },
  {
    id: 'mod-tari-5',
    subject: 'Seni Tari',
    title: 'Tata Kostum dan Busana dalam Seni Tari',
    level: 'Pemula',
    duration: '30 Menit',
    topics: ['Tata Busana', 'Pakaian Tubuh & Kepala', 'Aksesori Tari', 'Sapit Urang'],
    description: 'Mempelajari peranan tata busana dalam mendukung karakter tari, unsur busana, serta praktik memakai kain jarit model sapit urang.',
    teacherId: 't-3',
    teacherName: 'Pak Ahmad Fauzi, S.Pd.',
    createdAt: '2026-08-19',
  },
  {
    id: 'mod-tari-6',
    subject: 'Seni Tari',
    title: 'Properti dalam Seni Tari',
    level: 'Pemula',
    duration: '25 Menit',
    topics: ['Properti Tari', 'Stimulus Gerak', 'Fungsi Properti', 'Eksplorasi Properti'],
    description: 'Memahami pemanfaatan properti sebagai pendukung dan stimulus koreografi gerak, serta ragam fungsi properti dalam karya tari.',
    teacherId: 't-3',
    teacherName: 'Pak Ahmad Fauzi, S.Pd.',
    createdAt: '2026-08-20',
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
    enrolledSubjects: ['Informatika', 'Elektronika', 'Seni Tari'],
    moduleProgress: {
      Informatika: 85,
      Elektronika: 60,
      'Seni Tari': 67,
    },
    quizHistory: [
      {
        id: 'qh-tari-1',
        subject: 'Seni Tari',
        quizTitle: 'Evaluasi Koreografi Tari & Pola Lantai',
        score: 85,
        maxScore: 100,
        date: '2026-08-16',
        status: 'Lulus',
      },
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
    enrolledSubjects: ['Informatika', 'Seni & Desain', 'Seni Tari'],
    moduleProgress: {
      Informatika: 100,
      'Seni & Desain': 90,
      'Seni Tari': 100,
    },
    quizHistory: [
      {
        id: 'qh-tari-2',
        subject: 'Seni Tari',
        quizTitle: 'Evaluasi Koreografi Tari & Pola Lantai',
        score: 95,
        maxScore: 100,
        date: '2026-08-15',
        status: 'Lulus',
      },
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
    enrolledSubjects: ['Seni & Desain', 'Informatika', 'Seni Tari'],
    moduleProgress: {
      'Seni & Desain': 95,
      Informatika: 70,
      'Seni Tari': 83,
    },
    quizHistory: [
      {
        id: 'qh-tari-3',
        subject: 'Seni Tari',
        quizTitle: 'Evaluasi Koreografi Tari & Pola Lantai',
        score: 88,
        maxScore: 100,
        date: '2026-08-16',
        status: 'Lulus',
      },
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
