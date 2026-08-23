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
  moduleProgress: Record<string, number>;
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
      totalModules: 12,
      totalQuizzes: 6,
      isActive: true,
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
      isActive: true,
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
      isActive: true,
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
      isActive: true,
    },
    {
      id: 'sub-5',
      name: 'Bimbingan Konseling',
      code: 'BK',
      category: 'Pengembangan Diri',
      description: 'Bimbingan karir, konsultasi akademik, pengembangan kepribadian, serta konseling siswa.',
      iconName: 'UserGroupIcon',
      totalModules: 5,
      totalQuizzes: 2,
      isActive: true,
    },
  ];

  public teachers: TeacherAccount[] = [
    {
      id: 't-1',
      nip: '19850412 201001 1 003',
      name: 'Pak Budi Prasetyo, M.Kom.',
      email: 'budi.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=60',
      phone: '0812-3456-7890',
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
      phone: '0813-9876-5432',
      assignedSubjects: ['Elektronika', 'Otomotif'],
      status: 'Aktif',
      createdAt: '2025-01-12',
    },
    {
      id: 't-3',
      nip: '19881115 201201 1 002',
      name: 'Pak Ahmad Fauzi, S.Pd.',
      email: 'ahmad.guru@sitemsa.sch.id',
      avatar: 'https://i.pravatar.cc/150?img=11',
      phone: '0815-5555-1234',
      assignedSubjects: ['Seni Tari', 'Seni & Desain'],
      status: 'Aktif',
      createdAt: '2025-01-15',
    },
    {
      id: 't-5',
      nip: '19920815 201801 2 006',
      name: 'Ibu Ni Wayan Sri, S.Sn.',
      email: 'tari.guru@sintesa.id',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      phone: '0821-4444-8888',
      assignedSubjects: ['Seni Tari', 'Seni & Desain'],
      status: 'Aktif',
      createdAt: '2025-03-01',
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
      createdAt: '2025-02-01',
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
      author: 'Pak Budi Prasetyo, M.Kom.',
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

  public modules: ModuleItem[] = [
    {
      id: 'mod-1',
      subject: 'Informatika',
      title: 'Dasar Pemrograman Web Modern (HTML5, CSS3, & Tailwind)',
      level: 'Pemula',
      duration: '45 Menit',
      topics: ['HTML Semantik', 'Flexbox & CSS Grid', 'Styling Utility-First', 'Responsive Design'],
      description: 'Mempelajari fondasi arsitektur web modern serta tata letak responsif untuk berbagai perangkat.',
      teacherId: 't-1',
      teacherName: 'Pak Budi Prasetyo, M.Kom.',
      createdAt: '2026-08-10',
      isAiRecommended: true,
      isPublished: true,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Evaluasi Pemrograman Web Dasar',
      },
    },
    {
      id: 'mod-2',
      subject: 'Informatika',
      title: 'Logika Algoritma & Struktur Data Tingkat Dasar',
      level: 'Pemula',
      duration: '60 Menit',
      topics: ['Variabel & Tipe Data', 'Percabangan If-Else', 'Perulangan Loop', 'Array 1 Dimensi'],
      description: 'Dasar pemecahan masalah algoritma komputasi menggunakan pseudocode dan implementasi kode terstruktur.',
      teacherId: 't-1',
      teacherName: 'Pak Budi Prasetyo, M.Kom.',
      createdAt: '2026-08-12',
      isAiRecommended: true,
      isPublished: true,
    },
    {
      id: 'mod-3',
      subject: 'Elektronika',
      title: 'Pengenalan Sensor IoT & Mikrokontroler Arduino',
      level: 'Menengah',
      duration: '50 Menit',
      topics: ['Sensor Suhu DHT11', 'Analog to Digital Conversion', 'GPIO Pins', 'Serial Monitor'],
      description: 'Praktik integrasi sensor analog dan digital dengan mikrokontroler untuk sistem automasi ruangan.',
      teacherId: 't-2',
      teacherName: 'Ibu Siti Rahmawati, S.T.',
      createdAt: '2026-08-14',
      isAiRecommended: false,
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
      teacherId: 't-4',
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
      teacherId: 't-4',
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
      teacherId: 't-4',
      teacherName: 'Dinda Riestia',
      createdAt: '2026-08-23',
      isAiRecommended: false,
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
      teacherId: 't-5',
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
      teacherId: 't-5',
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
      teacherId: 't-5',
      teacherName: "Erintan Tsuraya Rahadatul'Aisy",
      createdAt: '2026-08-24',
      isAiRecommended: false,
      isPublished: true,
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
      isPublished: true,
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
      isPublished: true,
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
      isAiRecommended: false,
      isPublished: true,
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
      isAiRecommended: false,
      isPublished: true,
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
      isAiRecommended: false,
      isPublished: true,
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
      isAiRecommended: false,
      isPublished: true,
    },
  ];

  public quizzes: QuizItem[] = [
    {
      id: 'quiz-1',
      subject: 'Informatika',
      title: 'Kuis Evaluasi: Dasar HTML & CSS Vokasi',
      duration: '20 Menit',
      passScore: 75,
      questionCount: 4,
      teacherId: 't-1',
      teacherName: 'Pak Budi Prasetyo, M.Kom.',
      published: true,
      createdAt: '2026-08-11',
      questions: [
        {
          id: 'q1',
          text: 'Elemen HTML5 manakah yang paling tepat digunakan untuk membungkus konten artikel mandiri?',
          options: ['<div>', '<article>', '<section>', '<aside>'],
          correctAnswer: 1,
          explanation: '<article> adalah tag semantik HTML5 khusus untuk konten yang berdiri sendiri dan dapat didistribusikan ulang.',
        },
        {
          id: 'q2',
          text: 'Properti CSS apa yang digunakan untuk mengatur perataan elemen sepanjang main-axis dalam flexbox?',
          options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
          correctAnswer: 1,
          explanation: 'justify-content mendistribusikan ruang antar child item di sepanjang sumbu utama (main axis).',
        },
        {
          id: 'q3',
          text: 'Dalam Tailwind CSS, utility class apa yang digunakan untuk menambahkan display: flex?',
          options: ['display-flex', 'd-flex', 'flex', 'inline-flex'],
          correctAnswer: 2,
          explanation: 'Utility "flex" menerapkan display: flex secara langsung.',
        },
        {
          id: 'q4',
          text: 'Manakah atribut HTML yang wajib diisi untuk meningkatkan aksesibilitas (A11y) pada tag <img>?',
          options: ['title', 'alt', 'src', 'caption'],
          correctAnswer: 1,
          explanation: 'Atribut alt menyediakan teks alternatif untuk screen reader bagi pengguna disabilitas visual.',
        },
      ],
    },
  ];

  public students: StudentRecord[] = [
    {
      id: 'std-1',
      nisn: '0061234567',
      name: 'Andi Pratama',
      email: 'siswa@sitemsa.sch.id',
      classGroup: 'XII RPL 1',
      avatar: 'https://i.pravatar.cc/150?img=12',
      lastActive: '10 Menit yang lalu',
      enrolledSubjects: ['Informatika', 'Elektronika'],
      moduleProgress: {
        Informatika: 85,
        Elektronika: 60,
        Otomotif: 20,
      },
      quizHistory: [
        {
          id: 'qh-1',
          subject: 'Informatika',
          quizTitle: 'Kuis Evaluasi: Dasar HTML & CSS Vokasi',
          score: 100,
          maxScore: 100,
          date: '2026-08-20',
          status: 'Lulus',
        },
      ],
    },
    {
      id: 'std-2',
      nisn: '0067654321',
      name: 'Bella Safitri',
      email: 'bella@sitemsa.sch.id',
      classGroup: 'XII RPL 1',
      avatar: 'https://i.pravatar.cc/150?img=24',
      lastActive: '1 Jam yang lalu',
      enrolledSubjects: ['Informatika', 'Seni & Desain'],
      moduleProgress: {
        Informatika: 40,
        'Seni & Desain': 90,
      },
      quizHistory: [
        {
          id: 'qh-2',
          subject: 'Informatika',
          quizTitle: 'Kuis Evaluasi: Dasar HTML & CSS Vokasi',
          score: 50,
          maxScore: 100,
          date: '2026-08-19',
          status: 'Perlu Bimbingan',
        },
      ],
    },
  ];

  public notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'Modul Baru Tersedia: Pengenalan Sensor IoT',
      message: 'Materi baru pada mata pelajaran Elektronika telah diterbitkan oleh Ibu Siti Rahmawati, S.T.',
      type: 'MODULE_UPDATE',
      linkUrl: '/materi',
      isRead: false,
      createdAt: '2026-08-21T09:00:00Z',
    },
    {
      id: 'notif-2',
      title: 'Selamat! Kuis Informatika Diselesaikan',
      message: 'Kamu mendapatkan nilai sempurna 100/100 pada Kuis Evaluasi Dasar HTML & CSS.',
      type: 'SUCCESS',
      linkUrl: '/kuis/quiz-1',
      isRead: true,
      createdAt: '2026-08-20T14:30:00Z',
    },
  ];
}

// Global Singleton instance
const globalForStore = globalThis as unknown as { backendDataStore: BackendDataStore };

export const dbStore = globalForStore.backendDataStore || new BackendDataStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.backendDataStore = dbStore;
}
