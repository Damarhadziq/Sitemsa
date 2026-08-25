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
  content?: string;
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

  public modules: ModuleItem[] = [
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
      content: `Pengertian Sistem Pengisian
Sistem pengisian adalah rangkaian komponen yang berfungsi untuk mengisi daya baterai saat mesin hidup dan menyuplai listrik untuk kebutuhan komponen kelistrikan lainnya di dalam kendaraan. Ketika mesin mati, seluruh beban listrik disuplai oleh baterai. Namun saat mesin hidup, alternator mengambil alih peran sebagai sumber listrik utama sekaligus mengisi ulang arus listrik pada baterai.

Fungsi Komponen Sistem Pengisian
Sistem pengisian terdiri atas beberapa komponen vital yang bekerja secara terintegrasi:

Baterai
Berfungsi sebagai sumber arus listrik saat mesin belum hidup atau saat proses starting, serta menjadi penyimpan daya hasil pengisian alternator saat mesin beroperasi.

Kunci Kontak
Berfungsi sebagai saklar utama yang menghubungkan dan memutuskan aliran arus listrik dari baterai menuju alternator dan rangkaian indikator pengisian.

Alternator
Merupakan pembangkit tenaga listrik utama pada kendaraan. Mengubah energi mekanik putaran mesin menjadi energi listrik bolak-balik (AC) yang kemudian disearahkan menjadi arus searah (DC). Alternator tersusun atas:
• Pulley: Penghubung mekanis antara putaran poros engkol mesin dan alternator melalui tali kipas (V-belt).
• Rotor: Komponen berputar yang menghasilkan medan magnet ketika arus listrik mengalir melalui kumparannya.
• Stator: Kumparan diam yang menangkap perpotongan garis gaya medan magnet rotor untuk membangkitkan tegangan listrik induksi.
• Dioda Rectifier: Penyearah gelombang yang mengubah tegangan AC yang dihasilkan stator menjadi tegangan DC yang siap digunakan baterai dan kelistrikan mobil.
• Regulator: Pengatur tegangan yang menstabilkan voltase keluaran alternator agar selalu berada pada rentang aman (13.8V – 14.8V) meskipun putaran mesin berubah-ubah.

Lampu Indikator Pengisian (CHG)
Berfungsi memberikan informasi visual kepada pengemudi mengenai status kerja sistem pengisian. Lampu akan menyala saat kunci kontak ON (mesin mati) dan harus padam saat mesin sudah menyala normal.

Prinsip Kerja Sistem Pengisian
Prinsip dasar pengisian memanfaatkan hukum induksi elektromagnetik Faraday. Ketika rotor yang dialiri arus eksitasi berputar di dalam stator, kumparan stator memotong garis gaya magnet sehingga timbul Gaya Gerak Listrik (GGL) induksi bolak-balik. Dioda penyearah selanjutnya menyearahkan arus menjadi DC untuk mengisi baterai dan menghidupkan seluruh sensor serta aktuator mesin.

Langkah Pemahaman & Analisis Gangguan
Dalam menganalisis sistem pengisian, lakukan tahapan berikut:
1. Pengecekan Tegangan Baterai: Ukur tegangan baterai sebelum mesin dihidupkan (kondisi normal 12.4V - 12.6V).
2. Pengecekan Output Pengisian: Nyalakan mesin pada putaran idle dan putaran 2000 RPM, ukur tegangan pada kutub baterai (kondisi normal 13.8V - 14.8V).
3. Deteksi Gejala Overcharging: Jika tegangan melebihi 15V, regulator mengalami kerusakan dan dapat merusak sel baterai.
4. Deteksi Gejala Undercharging: Jika tegangan tetap di bawah 13V saat mesin hidup, periksa ketegangan tali kipas, keausan sikat arang (carbon brush), atau kerusakan dioda.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Sistem Pengisian Mobil Konvensional dan Elektronik/IC',
      },
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
      content: `Pengertian Sistem Transmisi Manual
Transmisi manual merupakan salah satu jenis sistem pemindah tenaga (power train) pada kendaraan bermotor yang berfungsi untuk mengatur perbandingan rasio putaran dan torsi antara mesin dengan roda penggerak sesuai dengan kondisi beban kendaraan dan kondisi jalan. Transmisi memungkinkan kendaraan dapat bergerak maju dengan torsi besar pada tanjakan, bergerak cepat di jalan tol, maupun bergerak mundur (reverse).

Fungsi Utama Transmisi Manual
• Meneruskan tenaga putar mesin dari kopling ke poros propeller atau diferensial.
• Mengubah torsi dan kecepatan kendaraan sesuai kebutuhan pengendaraan melalui kombinasi roda gigi.
• Memungkinkan kendaraan berjalan mundur dengan membalikkan arah putaran poros output.
• Memungkinkan posisi netral saat mesin menyala tetapi kendaraan tidak bergerak.

Komponen Utama Transmisi Manual
Input Shaft
Poros input yang menerima putaran langsung dari plat kopling mesin dan meneruskannya ke roda gigi counter (counter gear).

Counter Gear & Reverse Idler Gear
Roda gigi perantara yang berputar bersama poros input dan meneruskan putaran ke masing-masing roda gigi percepatan pada poros output.

Output Shaft
Poros keluaran transmisi yang menyalurkan putaran dengan rasio gigi yang telah dipilih menuju poros penggerak roda.

Mekanisme Synchromesh
Komponen penyinkron putaran yang menyamakan kecepatan putar antara roda gigi percepatan dengan poros output sebelum gigi terkait terkunci, sehingga perpindahan gigi dapat terjadi dengan halus tanpa timbul bunyi benturan roda gigi.

Shift Fork & Shift Linkage
Garpu pemindah dan tuas penghubung yang digerakkan oleh pengemudi melalui tuas transmisi (gear lever) untuk menggeser synchromesh hub sleeve.

Aliran Tenaga pada Berbagai Posisi Gigi
Posisi Netral: Putaran mesin hanya memutar poros input dan counter gear, roda gigi percepatan berputar bebas di atas poros output tanpa mengunci poros.
Gigi 1 (Torsi Maksimal): Hub sleeve mengunci roda gigi 1. Roda gigi kecil memutar roda gigi besar menghasilkan reduksi putaran besar dan torsi tertinggi untuk start awal.
Gigi Tertinggi (Overdrive): Perbandingan gigi menghasilkan putaran poros output lebih cepat dari poros input untuk efisiensi bahan bakar di kecepatan tinggi.
Gigi Mundur: Roda gigi perantara mundur (reverse idler gear) disisipkan di antara counter gear dan output gear untuk membalikkan arah putaran.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Sistem Transmisi Manual',
      },
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
      content: `Pendahuluan & Pemahaman Permainan
Permainan bola basket merupakan invasion game yang membutuhkan penguasaan gerak kompleks seperti melangkah, berlari, melompat, serta keterpaduan unsur fisik seperti kecepatan, kelincahan, dan daya tahan. Pemain dituntut memiliki kemampuan mengambil keputusan secara taktis dalam situasi dinamis di lapangan.

Keterampilan Teknik Dasar Bola Basket
Dribbling (Menggiring Bola)
Teknik memantulkan bola ke lantai menggunakan satu tangan secara bergantian atau berlanjut sambil bergerak. Dribble rendah digunakan untuk melindungi bola dari rebutan lawan, sedangkan dribble tinggi digunakan untuk melakukan serangan cepat.

Passing & Catching (Mengoper & Menangkap)
• Chest Pass: Operan setinggi dada untuk kecepatan dan akurasi jarak pendek-menengah.
• Bounce Pass: Operan pantulan lantai untuk melewati pemain bertahan yang memiliki postur tinggi.
• Overhead Pass: Operan dari atas kepala untuk melancarkan serangan balik atau mengumpan ke area dalam.

Shooting (Menembak ke Ring)
Upaya memasukkan bola ke keranjang lawan dengan teknik set shoot, jump shoot, atau lay-up shoot yang memadukan awalan langkah dan lonjakan mendekati papan pantul.

Pola Penyerangan (Offensive Strategy)
Penyerangan Cepat (Fast Break)
Strategi menyerang secara kilat sebelum tim lawan sempat menyusun barisan pertahanan. Mengandalkan umpan panjang terukur dan kecepatan sprint penyerang sayap.

Penyerangan Berpola (Set Play)
Penyerangan terencana menggunakan screen/pick and roll untuk membuka ruang tembak bagi penembak utama atau umpan terobosan ke area paint.

Pola Pertahanan (Defensive Strategy)
Pertahanan Satu Lawan Satu (Man-to-Man Defense)
Setiap pemain bertahan memiliki tanggung jawab mengawal ketat satu pemain lawan ke mana pun ia bergerak di area pertahanan.

Pertahanan Wilayah (Zone Defense)
Pemain bertahan menjaga daerah tertentu (formasi 2-3 atau 3-2) untuk menutup akses penetrasi ke area keranjang.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Keterampilan Gerak & Taktik Permainan Bola Basket',
      },
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
      content: `Pengertian Permainan Bola Voli
Bola voli adalah permainan beregu yang dimainkan oleh dua tim dengan masing-masing 6 pemain di lapangan. Setiap tim berusaha menjatuhkan bola di daerah permainan lawan dengan melewatkan bola di atas net serta membatasi sentuhan bola maksimal tiga kali sebelum diseberangkan.

Teknik Dasar Passing
Passing Bawah
Merupakan teknik menerima bola yang datang dari servis lawan atau serangan smash dengan menyatukan kedua lengan lurus ke depan bawah dan perkenaan bola pada bidang datar antara pergelangan tangan hingga siku.

Passing Atas
Teknik mengoper bola yang berada di atas kepala menggunakan bantalan ujung jari-jari kedua tangan yang membentuk mangkuk terbuka, sangat penting dalam menyusun umpan (set-up) sebelum melakukan smash.

Teknik Servis
Servis Bawah
Pukulan awal pembuka permainan dengan memegang bola di depan pinggang dan mengayunkan tangan pemukul dari belakang bawah.

Servis Atas
Pukulan servis dengan melambungkan bola di atas kepala kemudian memukul bola dengan telapak tangan terbuka dan pergelangan tangan yang lentur untuk menghasilkan bola menukik atau mengapung (floating serve).

Teknik Smash dan Bendungan (Block)
Smash (Spike)
Pukulan keras menukik ke bidang permainan lawan dengan lompatan vertikal maksimal untuk meraih poin.

Bendungan (Block)
Upaya membendung bola smash lawan di dekat net dengan melompat dan menjulurkan kedua tangan ke atas melintasi bibir net agar bola memantul kembali ke lapangan lawan.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Keterampilan Gerak Permainan Bola Voli',
      },
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
      content: `Hakikat Kepercayaan Diri
Percaya diri adalah keyakinan terhadap kemampuan dan penilaian diri sendiri dalam menjalankan tugas, mengambil keputusan, serta menghadapi lingkungan dan tantangan baru. Rasa percaya diri bukanlah sifat bawaan mutlak, melainkan sikap mental yang dapat dilatih dan ditumbuhkan melalui pengalaman positif dan refleksi diri yang sehat.

Ciri-Ciri Individu yang Memiliki Kepercayaan Diri Sehat
• Bersikap optimis dan memandang kegagalan sebagai peluang belajar, bukan akhir dari kemampuan diri.
• Berani mengemukakan pendapat dan ide dengan santun tanpa merasa takut dihakimi secara berlebihan.
• Mampu menerima kelebihan dan keterbatasan diri secara objektif tanpa terjebak dalam rasa minder (inferiority complex).
• Memiliki kemandirian dalam mengambil keputusan penting tanpa selalu bergantung pada persetujuan orang lain.

Faktor-Faktor yang Membentuk Kepercayaan Diri
Konsep Diri Positif
Cara pandang seseorang terhadap dirinya sendiri. Seseorang yang memandang dirinya berharga akan memiliki fondasi keyakinan yang kokoh.

Pengalaman dan Pencapaian
Keberhasilan kecil yang diraih secara bertahap memberikan bukti nyata bahwa usaha yang dilakukan membuahkan hasil.

Dukungan Lingkungan Sosial
Penerimaan yang suportif dari keluarga, guru, dan teman sebaya memperkuat rasa aman dalam mengekspresikan bakat dan minat.

Strategi Menumbuhkan Kepercayaan Diri
1. Kenali Potensi dan Keunikan Diri: Setiap siswa memiliki kecerdasan dan talenta yang berbeda, baik di bidang akademis, teknologi, seni, maupun kepemimpinan.
2. Ubah Dialog Batin Negatif (Self-Talk): Gantikan kalimat 'Saya pasti gagal' menjadi 'Saya akan berusaha semaksimal mungkin dan belajar dari prosesnya'.
3. Berani Melangkah Keluar dari Zona Nyaman: Ambil peran aktif dalam diskusi kelas, presentasi proyek kelompok, atau kegiatan organisasi sekolah.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri',
      },
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
      content: `Pengertian K3LH dan Budaya Kerja Industri
Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) merupakan upaya terpadu untuk menciptakan lingkungan kerja yang aman, sehat, nyaman, dan meminimalkan risiko kecelakaan maupun gangguan kesehatan akibat pekerjaan. Dalam bidang teknik elektronika, penerapan K3LH sangat krusial karena aktivitas praktikum berhubungan langsung dengan tegangan listrik, komponen rapuh, solder panas, bahan kimia pelarut PCB, serta instrumen presisi.

Budaya Kerja 5R (5S) di Lingkungan Bengkel
Budaya kerja 5R (Ringkas, Rapi, Resik, Rawat, Rajin) diadopsi dari standar industri manufaktur untuk menjamin efisiensi dan keamanan kerja:
• Ringkas (Seiri): Memilah dan menyingkirkan barang yang tidak diperlukan dari meja kerja praktik.
• Rapi (Seiton): Menata peralatan kerja dan komponen sesuai tempatnya dengan pelabelan jelas agar mudah diambil dan dikembalikan.
• Resik (Seiso): Membersihkan area kerja, lantai bengkel, dan instrumen dari debu, sisa potongan kawat, dan timah solder.
• Rawat (Seiketsu): Memelihara standar kebersihan dan kerapian meja praktikum secara konsisten setiap selesai jam pelajaran.
• Rajin (Shitsuke): Membiasakan diri mematuhi peraturan keselamatan kerja tanpa harus selalu diawasi guru instruktur.

Identifikasi Bahaya dan Penggunaan Alat Pelindung Diri (APD)
Potensi bahaya di bengkel elektronika meliputi sengatan listrik (electric shock), luka bakar akibat ujung solder panas, iritasi uap asap timah, serta letupan komponen akibat polaritas terbalik. Untuk mencegah cedera, setiap teknisi wajib menggunakan APD yang sesuai: kacamata pelindung (safety glasses), gelang antistatis (ESD wrist strap), masker asap solder, dan alas kaki berisolasi karet.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri',
      },
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
      content: `Perkakas Tangan Non Listrik (Manual Hand Tools)
Perkakas tangan non listrik merupakan alat-alat kerja yang dioperasikan sepenuhnya menggunakan tenaga manual manusia. Perkakas ini menjadi alat dasar perakitan perangkat elektronika:
• Tang Kombinasi: Berfungsi memegang, memotong kawat tembaga, dan membengkokkan kaki komponen.
• Tang Potong (Diagonal Plier): Memiliki mata pisau miring khusus memotong kabel dan memotong sisa kaki komponen pada papan PCB.
• Tang Cucut (Long Nose Plier): Memiliki ujung lancip untuk menjangkau ruang sempit dan memegang komponen kecil saat penyolderan.
• Tang Pengupas Kabel (Wire Stripper): Mengupas isolator kabel tanpa melukai inti serat tembaga di dalamnya.
• Obeng (Screwdriver): Obeng plus (Phillips) dan obeng minus (Slotted) dengan ukuran presisi untuk membuka dan mengencangkan baut sasis casing.

Perkakas Tangan Listrik (Power Tools)
Perkakas listrik memanfaatkan sumber energi listrik untuk menyelesaikan pekerjaan mekanik secara cepat dan presisi:
• Mesin Bor Tangan (Electric Drill): Digunakan untuk melubangi PCB, plat casing aluminium, dan panel box kontrol.
• Mesin Gerinda Tangan (Angle Grinder): Digunakan untuk memotong sasis logam dan meratakan permukaan material kasar.
• Gergaji Listrik (Jigsaw): Digunakan untuk memotong lembaran akrilik atau plat sasis dengan pola kurva atau sudut tertentu.

Prosedur Keselamatan Kerja dan Perawatan
1. Pastikan kabel daya power tool tidak terkelupas sebelum dihubungkan ke stopkontak.
2. Gunakan mata bor dan mata pisau yang tajam dan terkunci kuat pada chuck.
3. Bersihkan debu dan gram sisa pengeboran setelah digunakan, dan lumasi bagian mekanik bergerak secara berkala.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik',
      },
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
      content: `Pengertian dan Fungsi Gambar Teknik
Gambar teknik (gamtek) adalah bahasa visual baku berupa garis, simbol, dan ukuran terstandar untuk menyampaikan ide perancangan sistem atau perangkat secara universal. Dalam bidang elektronika, gambar teknik menjadi panduan pasti dalam fabrikasi papan PCB, perakitan panel kontrol, penelusuran jalur kelistrikan, serta pemeliharaan sistem industri.

Standarisasi Gambar Teknik Elektronika
Agar gambar teknik dapat dipahami oleh teknisi dan insinyur di seluruh dunia, gambar harus mengacu pada standar internasional seperti ISO (International Organization for Standardization) dan IEC (International Electrotechnical Commission). Standar ini mengatur ukuran kertas gambar (A4, A3), jenis garis (garis tebal kontur, garis putus-putus tersembunyi, garis strip-titik sumbu), serta etiket gambar (kepala gambar/title block).

Simbol Komponen Elektronika dan Instrumentasi
Gambar skematik menggunakan simbol grafis baku untuk merepresentasikan komponen fisik:
• Komponen Pasif: Simbol resistor (gerigi/persegi panjang), kapasitor (garis sejajar kutub), dan induktor (lilitan spiral).
• Semikonduktor: Simbol dioda (segitiga dengan garis katoda), transistor BJT (tanda panah emitor NPN/PNP), dan transistor MOSFET.
• Sumber Daya & Proteksi: Simbol ground, sumber tegangan DC/AC, fuse/sekring, dan transformator.

Jenis-Jenis Diagram Kelistrikan
Diagram Blok (Block Diagram): Menunjukkan fungsi keseluruhan sistem dalam bentuk kotak-kotak fungsional beserta alur sinyal utama.
Diagram Skematik (Schematic Diagram): Menampilkan detail koneksi kelistrikan seluruh pin komponen secara logis.
Diagram Tata Letak (Wiring & Layout Diagram): Menunjukkan posisi fisik komponen sesungguhnya pada papan PCB atau panel rak.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Gambar Teknik Listrik, Elektronika, dan Instrumentasi',
      },
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
      content: `Klasifikasi Alat Ukur Kelistrikan
Alat ukur adalah instrumen yang digunakan untuk mengukur dan membandingkan besaran fisis listrik terhadap satuan standar yang telah ditetapkan. Pemilihan alat ukur yang tepat menjamin keakuratan analisis rangkaian.

Jenis-Jenis Alat Ukur Utama
Voltmeter
Alat yang digunakan untuk mengukur beda potensial atau tegangan listrik antara dua titik. Voltmeter dipasang secara PARALEL dengan komponen yang diukur.

Amperemeter
Alat untuk mengukur kuat arus listrik yang mengalir dalam suatu rangkaian tertutup. Amperemeter harus dipasang secara SERI dengan beban listrik.

Ohmmeter
Alat untuk mengukur nilai resistansi hambatan komponen resistor atau memeriksa kontinuitas jalur kawat tembaga. Pengukuran resistansi wajib dilakukan saat rangkaian BEBAS TEGANGAN (daya mati).

Multimeter (Multitester / AVO Meter)
Instrumen serbaguna yang menggabungkan fungsi pengukuran Ampere, Volt, dan Ohm dalam satu unit. Tersedia dalam tipe Analog (dengan jarum penunjuk kalibrasi) dan Digital (dengan tampilan angka LCD berakurasi tinggi).

Osiloskop (Oscilloscope)
Instrumen canggih yang menampilkan bentuk visual gelombang sinyal listrik terhadap waktu. Digunakan untuk mengukur frekuensi, amplitude puncak-ke-puncak (Vpp), serta mendeteksi distorsi sinyal audio atau PWM.

Prosedur Pengukuran yang Benar
1. Atur batas ukur (range selector) pada posisi lebih tinggi dari estimasi tegangan yang akan diukur guna mencegah kerusakan meter.
2. Perhatikan polaritas colok ukur (probe merah untuk positif, probe hitam untuk negatif/ground).`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Alat Ukur Listrik, Elektronika, dan Instrumentasi',
      },
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
      content: `Komponen Elektronika Pasif
Komponen pasif adalah jenis komponen elektronika yang dalam pengoperasiannya tidak memerlukan sumber daya arus listrik eksternal dan tidak dapat memperkuat sinyal listrik:

Resistor
Komponen yang berfungsi menghambat dan mengatur aliran arus listrik serta membagi tegangan. Nilai hambatan resistor dinyatakan dalam satuan Ohm (Ω) dan dapat dibaca melalui kode gelang warna atau kode angka SMD.

Kapasitor (Kondensator)
Komponen yang berfungsi menyimpan muatan listrik sementara dalam medan elektrostatik. Digunakan sebagai penyaring riak tegangan (filter power supply), kopling sinyal AC, dan pembangkit osilasi. Dinyatakan dalam satuan Farad (F).

Induktor (Kumparan)
Komponen lilitan kawat tembaga yang menyimpan energi dalam bentuk medan magnet ketika dialiri arus listrik. Berfungsi menahan arus bolak-balik frekuensi tinggi dan menjadi bagian utama transformator serta filter frekuensi.

Komponen Elektronika Aktif
Komponen aktif adalah komponen elektronika yang membutuhkan arus atau tegangan eksternal agar dapat bekerja, serta mampu mengalirkan, mengontrol, dan memperkuat daya sinyal listrik:

Dioda Semikonduktor
Komponen sambungan P-N yang berfungsi mengalirkan arus listrik hanya ke satu arah (bias maju) dan memblokir arah sebaliknya (bias mundur). Digunakan sebagai penyearah arus, penstabil tegangan (Dioda Zener), dan pemancar cahaya (LED).

Transistor
Komponen semikonduktor dengan 3 kaki elektroda (Basis, Kolektor, Emitor untuk BJT atau Gate, Drain, Source untuk FET). Berfungsi sebagai penguat sinyal (amplifier) dan saklar elektronik berkecepatan tinggi (switching).

Integrated Circuit (IC)
Komponen mikroelektronika yang mengintegrasikan ribuan hingga jutaan transistor, dioda, dan resistor dalam satu kemasan chip silikon kecil.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Komponen Elektronika Pasif dan Aktif',
      },
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
      content: `Besaran Dasar Kelistrikan
Kelistrikan bertumpu pada aliran muatan partikel elektron dalam bahan konduktor:
• Tegangan Listrik (Volt / V): Beda potensial listrik yang mendorong muatan elektron bergerak melalui rangkaian.
• Kuat Arus Listrik (Ampere / A): Jumlah muatan listrik yang mengalir melalui suatu penampang kawat per satuan detik.
• Hambatan Listrik (Ohm / Ω): Derajat perlawanan suatu material terhadap aliran arus listrik.

Hukum Ohm
Hukum Ohm dirumuskan oleh George Simon Ohm, menyatakan bahwa kuat arus listrik (I) yang mengalir melalui suatu penghantar berbanding lurus dengan beda potensial atau tegangan (V) dan berbanding terbalik dengan nilai hambatan (R).
Persamaan matematis: V = I × R, I = V / R, R = V / I.

Hukum Kirchhoff
Hukum Kirchhoff I (Hukum Titik Cabang / KCL)
Jumlah kuat arus listrik yang masuk ke suatu titik percabangan sama dengan jumlah kuat arus listrik yang keluar dari titik percabangan tersebut (Σ I_masuk = Σ I_keluar).

Hukum Kirchhoff II (Hukum Loop Tegangan / KVL)
Dalam suatu rangkaian tertutup (loop), jumlah aljabar gaya gerak listrik (GGL) dan penurunan tegangan sama dengan nol (Σ E + Σ (I × R) = 0).

Daya dan Energi Listrik
Daya listrik (P) adalah laju konsumsi energi listrik per satuan waktu, dinyatakan dalam satuan Watt (W).
Persamaan daya listrik: P = V × I = I² × R = V² / R.
Memahami perhitungan daya sangat penting untuk menentukan batas aman kapasitas sekring dan pembebanan rangkaian perangkat elektronik industri.`,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Dasar Kelistrikan dan Hukum-Hukum Kelistrikan',
      },
    },
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
      createdAt: '2026-08-14',
      isAiRecommended: true,
      isPublished: true,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Latihan Variabel & Logika',
      },
    },
    {
      id: 'mod-str-1',
      subject: 'Seni Tari',
      title: 'Konsep Dasar Koreografi & Tata Gerak Tari Tradisional',
      level: 'Pemula',
      duration: '30 Menit',
      topics: ['Eksplorasi Gerak', 'Pola Lantai', 'Dinamika Wiraga'],
      description: 'Pengenalan elemen dasar wiraga, wirama, dan wirasa dalam menyusun komposisi tari tunggal maupun kelompok.',
      teacherId: 't-str-1',
      teacherName: 'Anita Dwi Ningtyas',
      createdAt: '2026-08-18',
      isAiRecommended: true,
      isPublished: true,
      quizSource: {
        type: 'kuis_sitemsa',
        title: 'Kuis Evaluasi Koreografi Tari',
      },
    },
  ];

  public quizzes: QuizItem[] = [
    {
      id: 'quiz-active',
      subject: 'Informatika',
      title: 'Kuis Evaluasi Informatika Dasar',
      duration: '30 Menit',
      passScore: 75,
      teacherId: 'sa-1',
      teacherName: 'Damar Hadziq H.',
      published: true,
      createdAt: '2026-08-14',
      questions: [
        {
          id: 'q1',
          text: 'Struktur data hirarkis non-linear yang terdiri dari nodes dan edges disebut...',
          options: ['Array', 'Tree', 'Queue', 'Stack'],
          correctAnswer: 1,
          explanation: 'Tree adalah struktur data hierarkis yang terdiri dari simpul akar (root) dan simpul anak (children).',
        },
      ],
    },
  ];

  public students: StudentRecord[] = [
  {
    id: 'std-1',
    nisn: '0061234567',
    name: 'Budi Santoso',
    email: 'siswa@belajar.id',
    classGroup: 'XI PPLG 1',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastActive: 'Belum aktif',
    enrolledSubjects: ['Informatika', 'Elektronika', 'Otomotif', 'Keolahragaan', 'Bimbingan Konseling', 'Seni Tari'],
    moduleProgress: {},
    quizHistory: [],
  },
  {
    id: 'std-2',
    nisn: '0069876543',
    name: 'Muhammad Rizky Pratama',
    email: 'rizky.pratama@smkn1semarang.sch.id',
    classGroup: 'XI TO 1',
    avatar: 'https://i.pravatar.cc/150?img=33',
    lastActive: 'Belum aktif',
    enrolledSubjects: ['Otomotif', 'Elektronika', 'Informatika'],
    moduleProgress: {},
    quizHistory: [],
  },
  {
    id: 'std-3',
    nisn: '0065544332',
    name: 'Siti Rahmawati',
    email: 'siti.rahmawati@smkn1semarang.sch.id',
    classGroup: 'XI TE 1',
    avatar: 'https://i.pravatar.cc/150?img=25',
    lastActive: 'Belum aktif',
    enrolledSubjects: ['Elektronika', 'Informatika', 'Keolahragaan'],
    moduleProgress: {},
    quizHistory: [],
  },
];;

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
