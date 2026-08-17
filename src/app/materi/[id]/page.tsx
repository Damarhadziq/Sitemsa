'use client';

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Clock01Icon,
  UserIcon,
  File01Icon,
  Download01Icon,
  Task01Icon,
  Certificate01Icon,
  ComputerIcon,
  Copy01Icon,
  Tick01Icon,
  CpuIcon,
  Car01Icon,
  PaintBrushIcon,
  UserGroupIcon,
  QrCode01Icon,
  Link01Icon,
  Cancel01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";

export type QuizSourceType = "internal" | "barcode" | "external_link";

export interface QuizSource {
  type: QuizSourceType;
  title: string;
  description: string;
  internalUrl?: string;
  qrImageUrl?: string;
  externalUrl?: string;
  externalPlatformName?: string;
}

interface StepItem {
  stepNumber: number;
  title: string;
  text: string;
  mediaUrl?: string;
}

interface MaterialDetail {
  id: number;
  subject: string;
  title: string;
  level: "Pemula" | "Menengah" | "Mahir";
  duration: string;
  author: string;
  updatedAt: string;
  icon: IconSvgElement;
  topics: string[];
  description: string;
  imageUrl: string;
  imageCaption: string;
  videoSection?: {
    title: string;
    videoUrl: string;
    caption: string;
  };
  contentSections: {
    id: string;
    title: string;
    paragraphs: string[];
    callout?: string;
    codeSnippet?: {
      language: string;
      code: string;
    };
  }[];
  stepByStepSection?: {
    title: string;
    description: string;
    steps: StepItem[];
  };
  attachment: {
    fileName: string;
    fileSize: string;
  };
  quizSource: QuizSource;
  prevMaterial?: { id: number; title: string };
  nextMaterial?: { id: number; title: string };
}

const MATERIAL_DATABASE: Record<number, MaterialDetail> = {
  1: {
    id: 1,
    subject: "Informatika",
    title: "Variabel, Tipe Data & Operasi Logika",
    level: "Pemula",
    duration: "25 Menit",
    author: "Pak Joko Supriyanto, S.Kom",
    updatedAt: "14 Agustus 2026",
    icon: ComputerIcon,
    topics: ["Variabel", "Tipe Data Primitif", "Operator Logika"],
    description: "Pelajari konsep penyimpanan data dan eksekusi operasi logika dasar dalam pemrograman.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 1.1: Eksekusi Kode dan Penyimpanan Variabel dalam Memori Komputer.",
    videoSection: {
      title: "Video Simulasi: Visualisasi Variabel & Memori Komputer",
      videoUrl: "https://www.youtube.com/embed/gQ34P57bH7M",
      caption: "Video 1.1: Penjelasan visual bagaimana nilai variabel disimpan dan diubah di dalam RAM.",
    },
    contentSections: [
      {
        id: "pengantar",
        title: "Pengenalan Variabel & Memori",
        paragraphs: [
          "Dalam dunia pemrograman, variabel dapat dianalogikan sebagai sebuah wadah atau kotak berlabel di dalam memori komputer. Setiap wadah memiliki nama unik dan nilai yang disimpan di dalamnya dapat diakses maupun diubah selama program berjalan.",
          "Memahami cara kerja variabel sangat penting karena seluruh manipulasi data — mulai dari angka sederhana, teks nama pengguna, hingga kalkulasi kompleks — bergantung pada deklarasi variabel yang benar.",
        ],
        callout: "Prinsip Utama: Deklarasikan variabel dengan nama yang deskriptif dan mencerminkan isi datanya agar kode mudah dibaca oleh tim pengembangan.",
      },
      {
        id: "tipe-data",
        title: "Tipe Data Primitif Dasar",
        paragraphs: [
          "Tipe data menentukan jenis nilai yang dapat disimpan oleh sebuah variabel serta operasi apa saja yang dapat dilakukan terhadap variabel tersebut. Pada sebagian besar bahasa pemrograman modern, terdapat tipe data primitif utama:",
          "Integer (bilangan bulat seperti 10, -5), Float/Double (bilangan desimal seperti 3.14), String (kumpulan karakter teks seperti 'Sitemsa'), serta Boolean (nilai kebenaran true atau false).",
        ],
        codeSnippet: {
          language: "JavaScript / TypeScript",
          code: `// Deklarasi Variabel & Tipe Data Dasar
let namaSiswa = "Budi Pratama"; // String
let nilaiUjian = 95;             // Integer
let ipk = 3.85;                  // Float
let isLulus = true;              // Boolean

console.log(\`Siswa \${namaSiswa} memperoleh nilai \${nilaiUjian}\`);`,
        },
      },
      {
        id: "operasi-logika",
        title: "Operator Logika & Tabel Kebenaran",
        paragraphs: [
          "Operator logika digunakan untuk menghubungkan dua atau lebih ekspresi relasional sehingga menghasilkan satu nilai kebenaran Boolean. Tiga operator logika dasar yang wajib dikuasai adalah AND (&&), OR (||), dan NOT (!).",
          "Operator AND hanya bernilai true jika kedua kondisi bernilai true. Operator OR bernilai true jika minimal salah satu kondisi true, sedangkan operator NOT membalikkan nilai kebenaran.",
        ],
        callout: "Tips Ujian: Pastikan Anda selalu mengevaluasi kondisi di dalam kurung terlebih dahulu sebelum menerapkan operator NOT.",
      },
    ],
    stepByStepSection: {
      title: "Langkah Praktik: Menulis & Mengeksekusi Kode Variabel",
      description: "Ikuti 3 langkah praktis di bawah ini untuk menguji pemahaman deklarasi variabel secara mandiri:",
      steps: [
        {
          stepNumber: 1,
          title: "Langkah 1: Deklarasi Variabel & Inisialisasi Nilai",
          text: "Buka penyunting kode (IDE) Anda, lalu buat file baru bernama main.ts. Tuliskan deklarasi variabel untuk menyimpan nama, nilai ujian, dan status kelulusan.",
          mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 2,
          title: "Langkah 2: Menambahkan Pengujian Logika",
          text: "Gunakan operator logika AND (&&) untuk memverifikasi apakah skor siswa di atas 75 DAN memiliki kehadiran di atas 80%.",
          mediaUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 3,
          title: "Langkah 3: Jalankan dan Verifikasi Output",
          text: "Jalankan file kode melalui terminal dengan perintah tsc main.ts && node main.js, lalu amati hasil keluaran pada layar terminal.",
          mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    attachment: {
      fileName: "Modul_Variabel_dan_Tipe_Data_Informatika.pdf",
      fileSize: "2.4 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Latihan Sitemsa",
      description: "Kerjakan 5 soal interaktif langsung di platform Sitemsa untuk menguji pemahaman konsepmu.",
      internalUrl: "/kuis/1",
    },
    prevMaterial: { id: 5, title: "Manajemen Waktu & Teknik Pomodoro" },
    nextMaterial: { id: 2, title: "Analisis Sirkuit Seri & Paralel Resistor" },
  },
  2: {
    id: 2,
    subject: "Elektronika",
    title: "Analisis Sirkuit Seri & Paralel Resistor",
    level: "Menengah",
    duration: "35 Menit",
    author: "Pak Herman Susilo, ST",
    updatedAt: "13 Agustus 2026",
    icon: CpuIcon,
    topics: ["Hukum Ohm", "Resistor Seri", "Resistor Paralel", "Multimeter"],
    description: "Hitung dan praktikkan arus serta tegangan pada rangkaian komponen pasif elektronika.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 2.1: Skema Pengukuran Arus dan Tegangan Sirkuit Resistor pada Breadboard.",
    videoSection: {
      title: "Video Praktik: Pengukuran Resistor Seri & Paralel dengan Multimeter Digital",
      videoUrl: "https://www.youtube.com/embed/8rQy3J6Zz-g",
      caption: "Video 2.1: Demonstrasi pengukuran resistansi total dan arus listrik menggunakan multimeter digital di laboratorium.",
    },
    contentSections: [
      {
        id: "pengantar-elektronika",
        title: "Dasar Hukum Ohm & Komponen Resistor",
        paragraphs: [
          "Hukum Ohm menyatakan bahwa arus listrik (I) yang mengalir melalui sebuah penghantar sebanding dengan beda potensial atau tegangan (V) dan berbanding terbalik dengan hambatan (R). Persamaan dasarnya adalah V = I x R.",
          "Resistor adalah komponen pasif yang berfungsi membatasi arus listrik dalam sirkuit. Nilai resistansinya ditandai dengan kode gelombang warna pada fisiknya.",
        ],
        callout: "Tips Praktik: Selalu matikan sumber daya (power supply) sebelum mengukur resistansi resistor dengan multimeter agar alat ukur tidak rusak.",
      },
      {
        id: "rangkaian-seri-paralel",
        title: "Perbedaan Rangkaian Seri vs Paralel",
        paragraphs: [
          "Pada rangkaian seri, resistor disusun secara berurutan sehingga arus yang mengalir pada setiap resistor adalah sama, namun tegangannya terbagi (R_total = R1 + R2 + R3).",
          "Pada rangkaian paralel, resistor dihubungkan pada dua titik yang sama sehingga tegangannya sama, tetapi arusnya terbagi (1/R_total = 1/R1 + 1/R2 + 1/R3).",
        ],
      },
    ],
    stepByStepSection: {
      title: "Langkah Kerja Praktik: Perakitan & Pengukuran di Breadboard",
      description: "Panduan 3 langkah perakitan fisik sirkuit seri-paralel dan pengukuran dengan multimeter:",
      steps: [
        {
          stepNumber: 1,
          title: "Langkah 1: Membaca Gelang Warna & Memilih Resistor",
          text: "Siapkan 3 buah resistor (misal: 100 Ohm, 220 Ohm, dan 470 Ohm). Baca gelang warna untuk memastikan nilai resistansi sesuai toleransi.",
          mediaUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 2,
          title: "Langkah 2: Menancapkan Komponen pada Breadboard",
          text: "Tancapkan ketiga resistor secara sejajar pada baris breadboard untuk membuat sambungan paralel, atau secara sambung-menambung untuk sambungan seri.",
          mediaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 3,
          title: "Langkah 3: Pengukuran Tegangan & Catat Hasil pada Multimeter",
          text: "Hubungkan probe multimeter merah (positif) dan hitam (COM) pada ujung-ujung resistor. Atur selektor ke jarum VDC 20V dan catat hasil pembacaan tegangan.",
          mediaUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    attachment: {
      fileName: "Panduan_Praktikum_Sirkuit_Resistor_Elektronika.pdf",
      fileSize: "3.1 MB",
    },
    quizSource: {
      type: "barcode",
      title: "Kuis Pindai Barcode (Quizizz)",
      description: "Pindai Barcode / QR Code dari pengajar untuk langsung bergabung ke kuis instrumen laboratorium.",
      qrImageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://quizizz.com/join?gc=882341",
      externalUrl: "https://quizizz.com/join?gc=882341",
      externalPlatformName: "Quizizz Lab Elektronika",
    },
    prevMaterial: { id: 1, title: "Variabel, Tipe Data & Operasi Logika" },
    nextMaterial: { id: 3, title: "Prinsip Kerja & Pembongkaran Mesin 4-Langkah" },
  },
  3: {
    id: 3,
    subject: "Otomotif",
    title: "Prinsip Kerja & Pembongkaran Mesin 4-Langkah",
    level: "Menengah",
    duration: "40 Menit",
    author: "Pak Bambang Setyawan, S.Pd",
    updatedAt: "10 Agustus 2026",
    icon: Car01Icon,
    topics: ["Siklus 4-Langkah", "Cylinder Head", "Piston", "Kunci Momen"],
    description: "Pelajari siklus Hisap-Kompresi-Usaha-Buang dan prosedur standar pembongkaran mesin kendaraan.",
    imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 3.1: Komponen Internal Mesin 4-Langkah dan Alur Pergerakan Piston.",
    videoSection: {
      title: "Video Animasi 3D: Simulasi Kerja & Langkah Pembongkaran Blok Silinder",
      videoUrl: "https://www.youtube.com/embed/OGj8OneMjek",
      caption: "Video 3.1: Visualisasi 3D empat langkah kerja piston dan teknik pembukaan kepala silinder sesuai SOP bengkel.",
    },
    contentSections: [
      {
        id: "prinsip-4-langkah",
        title: "Empat Langkah Kerja Mesin (4-Stroke)",
        paragraphs: [
          "Mesin 4-langkah membutuhkan 4 kali gerakan piston (2 kali putaran poros engkol) untuk menghasilkan 1 kali tenaga. Empat langkah tersebut meliputi: Langkah Hisap (Intake), Kompresi (Compression), Usaha (Power), dan Buang (Exhaust).",
          "Pada langkah kompresi, kedua katup (masuk dan buang) tertutup rapat sehingga campuran bahan bakar dan udara dimampatkan hingga mencapai tekanan tinggi sebelum dipercikkan busi.",
        ],
        callout: "Penting: Kerapatan katup dan ring piston sangat menentukan tekanan kompresi mesin. Kompresi yang bocor menyebabkan mesin kehilangan tenaga (loss power).",
      },
    ],
    stepByStepSection: {
      title: "Langkah Kerja SOP Pembongkaran Kepala Silinder (Cylinder Head)",
      description: "Ikuti urutan keselamatan kerja pembongkaran komponen otomotif sesuai standar bengkel resmi:",
      steps: [
        {
          stepNumber: 1,
          title: "Langkah 1: Pengurasan Oli & Pelepasan Cover Mesin",
          text: "Buka baut tap oli di bagian bawah karter untuk menguras oli mesin secara bersih. Lepaskan cover body dan karburator/injector.",
          mediaUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 2,
          title: "Langkah 2: Pelepasan Baut Cylinder Head secara Silang",
          text: "Gunakan kunci soket khusus untuk mengendurkan baut kepala silinder dengan urutan menyilang (diagonal) bertahap agar kepala silinder tidak melengkung.",
          mediaUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 3,
          title: "Langkah 3: Pemeriksaan Kerataan Permukaan & Ring Piston",
          text: "Gunakan straight edge dan feeler gauge untuk mengukur kerataan permukaan cylinder head. Periksa pula celah ujung (end gap) ring piston.",
          mediaUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    attachment: {
      fileName: "SOP_Pembongkaran_Mesin_4_Langkah_Otomotif.pdf",
      fileSize: "4.5 MB",
    },
    quizSource: {
      type: "external_link",
      title: "Kuis Online Google Form",
      description: "Akses lembar ujian online pembongkaran mesin 4-langkah pada platform eksternal.",
      externalUrl: "https://forms.gle/vokasi-otomotif-mesin-4-langkah",
      externalPlatformName: "Google Forms Otomotif",
    },
    prevMaterial: { id: 2, title: "Analisis Sirkuit Seri & Paralel Resistor" },
    nextMaterial: { id: 4, title: "Wiraga, Wirama, & Wirasa dalam Tari Tradisional" },
  },
  4: {
    id: 4,
    subject: "Seni Tari",
    title: "Wiraga, Wirama, & Wirasa dalam Tari Tradisional",
    level: "Pemula",
    duration: "20 Menit",
    author: "Ibu Ni Wayan Sri, S.Sn",
    updatedAt: "08 Agustus 2026",
    icon: PaintBrushIcon,
    topics: ["Wiraga", "Wirama", "Wirasa", "Agem & Seledet"],
    description: "Pahami 3 pilar utama dalam seni tari tradisional untuk melatih raga, tempo irama, dan penjiwaan karakter.",
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 4.1: Ekspresi Wirasa dan Pose Wiraga dalam Tari Tradisional.",
    videoSection: {
      title: "Video Peragaan Praktik: Olah Gerak Raga & Penjiwaan Irama Tari",
      videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
      caption: "Video 4.1: Peragaan gerak olah tubuh (Wiraga), ketepatan tempo gamelan (Wirama), dan penjiwaan ekspresi mata (Wirasa).",
    },
    contentSections: [
      {
        id: "tiga-pilar-tari",
        title: "Konsep Dasar Wiraga, Wirama, & Wirasa",
        paragraphs: [
          "Wiraga adalah keterampilan fisik dasar penari meliputi bentuk gerakan tubuh, keluwesan, dan ketahanan raga. Wirama adalah keselarasan gerak penari dengan ritme dan tempo iringan musik gamelan.",
          "Wirasa adalah puncak penghayatan di mana penari mampu menyalurkan emosi dan karakter tarian melalui ekspresi wajah dan tatapan mata (seledet).",
        ],
        callout: "Kunci Sukses: Penari yang hebat tidak hanya hafal urutan gerakan (wiraga), tetapi mampu menyatukan detak nada irama (wirama) dengan rasa jiwa (wirasa).",
      },
    ],
    stepByStepSection: {
      title: "Langkah Praktik Olah Tubuh & Latihan Tempo Tari",
      description: "Ikuti 3 tahapan olah raga dan rasa untuk membentuk kualitas penari tradisional yang berkarakter:",
      steps: [
        {
          stepNumber: 1,
          title: "Langkah 1: Latihan Posisi Kaki & Badan (Agem Kanan/Kiri)",
          text: "Buka kedua kaki selebar bahu dengan lutut ditekuk (rendah). Angkat kedua siku sejajar dada dan tegakkan tulang belakang.",
          mediaUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 2,
          title: "Langkah 2: Menyesuaikan Tempo Gerak Tangan dengan Ketukan Gendang",
          text: "Dengarkan tempo pukulan gendang. Ayunkan jemari tangan secara bergelombang mengikuti tempo lambat, sedang, dan cepat.",
          mediaUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 3,
          title: "Langkah 3: Latihan Gerakan Mata (Seledet) & Ekspresi Wajah",
          text: "Gerakkan bola mata ke kanan atas dan kiri bawah secara tajam tanpa menundukkan kepala. Salurkan senyum dan penjiwaan sesuai watak tarian.",
          mediaUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    attachment: {
      fileName: "Panduan_Olah_Raga_dan_Rasa_Seni_Tari.pdf",
      fileSize: "1.9 MB",
    },
    quizSource: {
      type: "barcode",
      title: "Kuis Barcode Game (Kahoot)",
      description: "Pindai Barcode dari pengajar untuk bergabung ke arena kuis tari tradisional Kahoot.",
      qrImageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://kahoot.it?pin=992813",
      externalUrl: "https://kahoot.it?pin=992813",
      externalPlatformName: "Kahoot Tari Tradisional",
    },
    prevMaterial: { id: 3, title: "Prinsip Kerja & Pembongkaran Mesin 4-Langkah" },
    nextMaterial: { id: 5, title: "Manajemen Waktu & Teknik Pomodoro dalam Belajar" },
  },
  5: {
    id: 5,
    subject: "Bimbingan & Konseling",
    title: "Manajemen Waktu & Teknik Pomodoro dalam Belajar",
    level: "Pemula",
    duration: "15 Menit",
    author: "Ibu Dra. Siti Rahmawati",
    updatedAt: "05 Agustus 2026",
    icon: UserGroupIcon,
    topics: ["Manajemen Waktu", "Teknik Pomodoro", "Fokus & Rehat", "Skala Prioritas"],
    description: "Tingkatkan produktivitas belajar siswa dengan siklus interval fokus 25 menit dan rehat sejenak.",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 5.1: Penggunaan Timer Pomodoro untuk Menjaga Fokus Belajar Tanpa Kelelahan.",
    videoSection: {
      title: "Video Panduan: Strategi Manajemen Waktu & Sesi Belajar Bebas Stres",
      videoUrl: "https://www.youtube.com/embed/mNBmG24djoY",
      caption: "Video 5.1: Penjelasan ilmiah mengapa otak manusia membutuhkan rehat 5 menit tiap 25 menit belajar intensif.",
    },
    contentSections: [
      {
        id: "konsep-pomodoro",
        title: "Mengapa Teknik Pomodoro Sangat Efektif?",
        paragraphs: [
          "Teknik Pomodoro dikembangkan oleh Francesco Cirillo pada akhir 1980-an. Metode ini membagi waktu belajar menjadi blok 25 menit yang disebut 'Pomodoro', diselingi dengan istirahat singkat selama 5 menit.",
          "Metode ini mencegah kelelahan mental (burnout), melatih fokus penuh tanpa distraksi ponsel, serta meningkatkan daya ingat jangka panjang (retensi memori).",
        ],
        callout: "Aturan Emas: Selama 25 menit sesi Pomodoro berjalan, jauhkan semua pemberitahuan ponsel dan fokus 100% hanya pada 1 tugas belajar.",
      },
    ],
    stepByStepSection: {
      title: "Langkah Praktik Penerapan Sesi Belajar Pomodoro Harian",
      description: "Gunakan 3 langkah praktis ini setiap kali Anda hendak mengerjakan tugas atau belajar ujian:",
      steps: [
        {
          stepNumber: 1,
          title: "Langkah 1: Tentukan Tugas & Matikan Distraksi",
          text: "Pilih 1 topik materi yang ingin dipelajari. Aktifkan mode Jangan Ganggu (Do Not Disturb) pada ponsel Anda.",
          mediaUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 2,
          title: "Langkah 2: Atur Timer 25 Menit & Fokus Penuh",
          text: "Nyalakan pengatur waktu (timer) selama 25 menit. Pelajari materi secara intensif hingga bel timer berbunyi.",
          mediaUrl: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&w=800&q=80",
        },
        {
          stepNumber: 3,
          title: "Langkah 3: Istirahat Sejenak 5 Menit",
          text: "Begitu timer berbunyi, segera beristirahat selama 5 menit. Berdirilah, minum air putih, dan lakukan peregangan ringan sebelum memulai sesi berikutnya.",
          mediaUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    attachment: {
      fileName: "Panduan_Manajemen_Waktu_Pomodoro_Siswa.pdf",
      fileSize: "1.2 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Latihan Pomodoro Sitemsa",
      description: "Kerjakan 5 soal refleksi manajemen waktu belajar langsung di platform Sitemsa.",
      internalUrl: "/kuis/5",
    },
    prevMaterial: { id: 4, title: "Wiraga, Wirama, & Wirasa dalam Tari Tradisional" },
    nextMaterial: { id: 1, title: "Variabel, Tipe Data & Operasi Logika" },
  },
};

const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case "Pemula":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold";
    case "Menengah":
      return "bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold";
    case "Mahir":
      return "bg-purple-50 text-purple-700 border border-purple-200/60 font-semibold";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200 font-semibold";
  }
};

export default function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const materialId = parseInt(id, 10) || 1;
  const material = MATERIAL_DATABASE[materialId] || MATERIAL_DATABASE[1];
  const [activeSection, setActiveSection] = useState(material.contentSections[0]?.id || "pengantar");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeQuizModal, setActiveQuizModal] = useState<"none" | "barcode" | "link_confirm">("none");
  const [isTocOpen, setIsTocOpen] = useState(false);

  const handleStartQuizClick = (e: React.MouseEvent) => {
    const qSource = material.quizSource;
    if (qSource.type === "barcode") {
      e.preventDefault();
      setActiveQuizModal("barcode");
    } else if (qSource.type === "external_link") {
      e.preventDefault();
      setActiveQuizModal("link_confirm");
    }
  };

  useEffect(() => {
    if (activeQuizModal !== "none") {
      document.documentElement.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [activeQuizModal]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [materialId]);

  // Scroll Sync Active Section Observer
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    const observeIds = [
      ...material.contentSections.map((s) => s.id),
      ...(material.videoSection ? ["video-tutorial"] : []),
      ...(material.stepByStepSection ? ["langkah-praktik"] : []),
    ];

    observeIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading, material]);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -110;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full flex-1">
        {/* Top Header Navigation: Full Rounded Icon-Only Back Button */}
        <div className="mb-8">
          <Link
            href="/materi"
            aria-label="Kembali ke Materi"
            className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#2E2D2D] hover:text-[#0400F4] hover:bg-[#F6F5FF] hover:border-[#0400F4]/40 flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </Link>
        </div>

        {/* Skeleton Loading State */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="w-1/3 h-8 bg-gray-100 rounded-[6px]" />
            <div className="w-full h-12 bg-gray-100 rounded-[8px]" />
            <div className="w-full h-[320px] bg-gray-100 rounded-[12px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Content Area (8 Columns) */}
            <article className="lg:col-span-8 space-y-8">
              {/* Header Info */}
              <header className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#E8E7FF] text-[#0400F4] px-2.5 py-1 rounded-[4px] text-xs font-semibold">
                    {material.subject}
                  </span>
                  <span className={`px-2.5 py-1 rounded-[4px] text-xs ${getLevelBadgeClass(material.level)}`}>
                    {material.level}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#2E2D2D] leading-tight tracking-tight max-w-2xl">
                  {material.title}
                </h1>

                {/* Author & Harmonized Meta Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#737373] pt-1">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={UserIcon} size={15} className="text-[#737373]" />
                    <span className="font-medium">{material.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Calendar01Icon} size={15} className="text-[#737373]" />
                    <span className="font-medium">Diperbarui: {material.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Clock01Icon} size={15} className="text-[#737373]" />
                    <span className="font-medium">{material.duration}</span>
                  </div>
                </div>
              </header>

              {/* Main Feature Image */}
              <figure>
                <div className="relative w-full h-[280px] md:h-[380px] rounded-[12px] overflow-hidden border border-[#ECECEC] bg-[#FAFAFA]">
                  <Image
                    src={material.imageUrl}
                    alt={material.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </figure>

              {/* Video Tutorial Section (If Available for Subject) */}
              {material.videoSection && (
                <section id="video-tutorial" className="space-y-3 pt-2">
                  <h2 className="text-lg md:text-xl font-bold text-[#2E2D2D]">
                    {material.videoSection.title}
                  </h2>

                  <div className="relative w-full aspect-video rounded-[12px] overflow-hidden border border-[#ECECEC] bg-black">
                    <iframe
                      src={material.videoSection.videoUrl}
                      title={material.videoSection.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              {/* Structured Content Sections */}
              <div className="space-y-8">
                {material.contentSections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="space-y-4"
                  >
                    <h2 className="text-lg md:text-xl font-bold text-[#2E2D2D]">
                      {section.title}
                    </h2>

                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {/* Highlighted Note Callout Box */}
                    {section.callout && (
                      <div className="bg-[#F4EFFF] border-l-4 border-[#0400F4] rounded-r-[8px] p-4 text-xs md:text-sm text-[#2E2D2D] leading-relaxed font-medium">
                        {section.callout}
                      </div>
                    )}

                    {/* Code Snippet Box with Copy Button */}
                    {section.codeSnippet && (
                      <div className="bg-[#1E1E2E] rounded-[10px] p-4 space-y-3 text-white overflow-hidden">
                        <div className="flex items-center justify-between text-xs text-[#A6ADC8] border-b border-[#313244] pb-2">
                          <span className="font-mono">{section.codeSnippet.language}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(section.codeSnippet!.code)}
                            className="inline-flex items-center gap-1.5 bg-[#313244] hover:bg-[#45475A] text-white px-2.5 py-1 rounded-[6px] transition-colors text-[11px]"
                          >
                            <HugeiconsIcon icon={copiedCode ? Tick01Icon : Copy01Icon} size={13} />
                            <span>{copiedCode ? "Tersalin!" : "Salin Kode"}</span>
                          </button>
                        </div>
                        <pre className="font-mono text-xs overflow-x-auto text-[#CDD6F4] leading-relaxed">
                          <code>{section.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Interactive Step-by-Step Practice Block (Single Frame Container) */}
              {material.stepByStepSection && (
                <section id="langkah-praktik" className="space-y-4 pt-6 border-t border-[#ECECEC]">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-[#2E2D2D]">
                      {material.stepByStepSection.title}
                    </h2>
                    <p className="text-xs md:text-sm text-[#737373] leading-relaxed mt-1">
                      {material.stepByStepSection.description}
                    </p>
                  </div>

                  {/* 1 Single Frame Container Box */}
                  <div className="bg-white border border-[#ECECEC] rounded-[10px] overflow-hidden divide-y divide-[#ECECEC]">
                    {material.stepByStepSection.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-4 md:p-5 space-y-3 bg-white transition-colors hover:bg-[#F6F5FF]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 bg-[#0400F4] text-white">
                            0{step.stepNumber}
                          </span>
                          <h3 className="text-sm md:text-base font-bold text-[#2E2D2D]">
                            {step.title}
                          </h3>
                        </div>

                        <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed pl-11">
                          {step.text}
                        </p>

                        {/* Admin Guide Media / Foto Panduan tanpa caption */}
                        {step.mediaUrl && (
                          <div className="pl-11 pt-1">
                            <div className="relative w-full h-[200px] md:h-[280px] rounded-[8px] overflow-hidden border border-[#ECECEC] bg-[#FAFAFA]">
                              <Image
                                src={step.mediaUrl}
                                alt={step.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Attachment Download Block */}
              <section className="bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#F4EFFF] text-[#0400F4] flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={File01Icon} size={20} />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-[#2E2D2D]">
                      {material.attachment.fileName}
                    </p>
                    <p className="text-[11px] text-[#737373]">
                      Modul Pelengkap • {material.attachment.fileSize}
                    </p>
                  </div>
                </div>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Mengunduh file: ${material.attachment.fileName}`);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 bg-white border border-[#ECECEC] hover:bg-[#F6F5FF] hover:border-[#0400F4]/40 text-[#0400F4] px-4 py-2 rounded-[6px] text-xs font-semibold transition-all duration-200"
                >
                  <HugeiconsIcon icon={Download01Icon} size={15} />
                  <span>Unduh Modul PDF</span>
                </a>
              </section>
            </article>

            {/* Sticky Sidebar Navigation (4 Columns) */}
            <aside className="lg:col-span-4 space-y-5 sticky top-28">
              {/* Table of Contents Box (Desktop Only) */}
              <div className="hidden md:block bg-white border border-[#ECECEC] rounded-[12px] p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#ECECEC] pb-3">
                  <HugeiconsIcon icon={Task01Icon} size={18} className="text-[#2563EB]" />
                  <h3 className="text-sm font-bold text-[#2E2D2D]">Daftar Isi Pembahasan</h3>
                </div>

                {/* Table of Contents Items */}
                <nav className="space-y-1">
                  {material.videoSection && (
                    <a
                      href="#video-tutorial"
                      onClick={(e) => handleScrollToSection(e, "video-tutorial")}
                      className={`block px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                        activeSection === "video-tutorial"
                          ? "bg-[#F4EFFF] text-[#2563EB] font-semibold border-l-2 border-[#2563EB]"
                          : "text-[#737373] hover:text-[#2E2D2D] hover:bg-[#FAFAFA] border-l-2 border-transparent"
                      }`}
                    >
                      Video Tutorial Pembelajaran
                    </a>
                  )}

                  {material.contentSections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={(e) => handleScrollToSection(e, sec.id)}
                        className={`block px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[#F4EFFF] text-[#2563EB] font-semibold border-l-2 border-[#2563EB]"
                            : "text-[#737373] hover:text-[#2E2D2D] hover:bg-[#FAFAFA] border-l-2 border-transparent"
                        }`}
                      >
                        {sec.title}
                      </a>
                    );
                  })}

                  {material.stepByStepSection && (
                    <a
                      href="#langkah-praktik"
                      onClick={(e) => handleScrollToSection(e, "langkah-praktik")}
                      className={`block px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                        activeSection === "langkah-praktik"
                          ? "bg-[#F4EFFF] text-[#2563EB] font-semibold border-l-2 border-[#2563EB]"
                          : "text-[#737373] hover:text-[#2E2D2D] hover:bg-[#FAFAFA] border-l-2 border-transparent"
                      }`}
                    >
                      Langkah Kerja &amp; Panduan Praktik
                    </a>
                  )}
                </nav>
              </div>

              {/* Start Quiz Card */}
              <div className="bg-gradient-to-br from-[#FAFAFF] via-[#F4EFFF] to-[#EBE4FF] border border-[#E0D7FF] rounded-[12px] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#2563EB]/10 text-[#2563EB] px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold flex items-center gap-1">
                    {material.quizSource.type === "barcode" && (
                      <>
                        <HugeiconsIcon icon={QrCode01Icon} size={12} />
                        <span>Barcode / QR Code</span>
                      </>
                    )}
                    {material.quizSource.type === "external_link" && (
                      <>
                        <HugeiconsIcon icon={Link01Icon} size={12} />
                        <span>Link Eksternal</span>
                      </>
                    )}
                    {material.quizSource.type === "internal" && (
                      <>
                        <HugeiconsIcon icon={Certificate01Icon} size={12} />
                        <span>Kuis Sitemsa</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#2E2D2D]">
                  {material.quizSource.title}
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  {material.quizSource.description}
                </p>
                <Link
                  href={material.quizSource.internalUrl || "#"}
                  onClick={handleStartQuizClick}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white py-2.5 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                >
                  <span>Mulai Uji Pemahaman</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Floating Action Buttons: Floating Table of Contents & Back to Top (Mobile Only) */}
      <div className="fixed right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Floating Table of Contents Button (Mobile Only, Soft Smooth Shadow) */}
        <button
          type="button"
          onClick={() => setIsTocOpen(!isTocOpen)}
          aria-label="Daftar Isi Pembahasan"
          title="Daftar Isi Pembahasan"
          className={`md:hidden w-11 h-11 rounded-full bg-white border border-[#ECECEC] text-[#2563EB] hover:bg-[#F6F5FF] hover:border-[#2563EB]/50 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.06)] pointer-events-auto ${
            showBackToTop ? "fixed bottom-20 right-6" : "fixed bottom-6 right-6"
          }`}
        >
          <HugeiconsIcon icon={isTocOpen ? Cancel01Icon : Task01Icon} size={20} />
        </button>

        {/* Floating Back to Top Arrow Button */}
        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Kembali ke Atas"
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white border border-[#ECECEC] text-[#2563EB] hover:bg-[#F6F5FF] hover:border-[#2563EB]/50 flex items-center justify-center transition-all duration-200 cursor-pointer animate-in fade-in zoom-in-90 shadow-[0_6px_20px_rgba(0,0,0,0.06)] pointer-events-auto"
          >
            <HugeiconsIcon icon={ArrowUp01Icon} size={20} />
          </button>
        )}
      </div>

      {/* Floating Table of Contents Popover Sheet (Mobile Only, Soft Smooth Shadow) */}
      {isTocOpen && (
        <div
          className={`md:hidden fixed right-6 z-50 w-72 max-w-[calc(100vw-3rem)] bg-white border border-[#ECECEC] rounded-[16px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] space-y-3 animate-in fade-in zoom-in-95 duration-200 ${
            showBackToTop ? "bottom-32" : "bottom-20"
          }`}
        >
          {/* Header without border divider */}
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#2E2D2D] flex items-center gap-1.5">
              <HugeiconsIcon icon={Task01Icon} size={16} className="text-[#2563EB]" />
              <span>Daftar Isi Pembahasan</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsTocOpen(false)}
              className="w-6 h-6 rounded-full bg-gray-50 border border-[#ECECEC] text-[#737373] hover:text-[#2563EB] hover:bg-[#F6F5FF] flex items-center justify-center transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
            </button>
          </div>

          {/* Clean list without numbers */}
          <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
            {material.videoSection && (
              <button
                type="button"
                onClick={() => {
                  setIsTocOpen(false);
                  const el = document.getElementById("video-tutorial");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full text-left px-3 py-2 rounded-[8px] hover:bg-[#F6F5FF] text-xs font-medium text-[#2E2D2D] hover:text-[#2563EB] transition-colors cursor-pointer block truncate"
              >
                Video Tutorial Pembelajaran
              </button>
            )}

            {material.contentSections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setIsTocOpen(false);
                  const el = document.getElementById(sec.id);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full text-left px-3 py-2 rounded-[8px] hover:bg-[#F6F5FF] text-xs font-medium text-[#2E2D2D] hover:text-[#2563EB] transition-colors cursor-pointer block truncate"
              >
                {sec.title}
              </button>
            ))}

            {material.stepByStepSection && (
              <button
                type="button"
                onClick={() => {
                  setIsTocOpen(false);
                  const el = document.getElementById("langkah-praktik");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full text-left px-3 py-2 rounded-[8px] hover:bg-[#F6F5FF] text-xs font-medium text-[#2E2D2D] hover:text-[#2563EB] transition-colors cursor-pointer block truncate"
              >
                Langkah Kerja &amp; Panduan Praktik
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Barcode Modal (Mobile Bottom Sheet & Desktop Dialog) */}
      {activeQuizModal === "barcode" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200 overscroll-contain">
          {/* Backdrop Click Listener */}
          <div className="absolute inset-0" onClick={() => setActiveQuizModal("none")} />

          <div className="bg-white rounded-t-[20px] rounded-b-none md:rounded-[16px] max-w-md w-full p-6 space-y-4 animate-in slide-in-from-bottom duration-300 md:animate-in md:fade-in md:zoom-in-95 md:duration-200 border-t md:border border-[#ECECEC] z-10 relative">
            {/* Drag Handle Indicator for Mobile */}
            <div className="w-12 h-1.5 bg-[#D4D4D4] rounded-full mx-auto -mt-2 mb-1 md:hidden shrink-0" />

            {/* Header: Pure white seamless header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                Pindai Barcode Kuis
              </h3>
              <button
                type="button"
                onClick={() => setActiveQuizModal("none")}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Tutup Modal"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="space-y-3 text-center">
              <div className="relative w-56 h-56 mx-auto border border-[#ECECEC] rounded-[12px] p-3 bg-white flex items-center justify-center">
                {material.quizSource.qrImageUrl ? (
                  <Image
                    src={material.quizSource.qrImageUrl}
                    alt="QR Code Kuis"
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="text-xs text-[#737373]">QR Code tidak tersedia</div>
                )}
              </div>
              <p className="text-xs text-[#737373] leading-relaxed">
                Pindai Barcode / QR Code di atas menggunakan kamera ponsel Anda untuk masuk ke kuis <strong className="text-[#2E2D2D] font-semibold">{material.quizSource.externalPlatformName || "Eksternal"}</strong> dari pengajar.
              </p>
            </div>

            {/* Actions */}
            {material.quizSource.externalUrl && (
              <div className="pt-2">
                <a
                  href={material.quizSource.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setActiveQuizModal("none")}
                  className="w-full bg-[#0400F4] hover:bg-[#0300d4] active:scale-95 text-white py-2.5 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                >
                  <span>Atau Buka Tautan Langsung</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz External Link Confirmation Modal (Mobile Bottom Sheet & Desktop Dialog) */}
      {activeQuizModal === "link_confirm" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200 overscroll-contain">
          {/* Backdrop Click Listener */}
          <div className="absolute inset-0" onClick={() => setActiveQuizModal("none")} />

          <div className="bg-white rounded-t-[20px] rounded-b-none md:rounded-[16px] max-w-md w-full p-6 space-y-4 animate-in slide-in-from-bottom duration-300 md:animate-in md:fade-in md:zoom-in-95 md:duration-200 border-t md:border border-[#ECECEC] z-10 relative">
            {/* Drag Handle Indicator for Mobile */}
            <div className="w-12 h-1.5 bg-[#D4D4D4] rounded-full mx-auto -mt-2 mb-1 md:hidden shrink-0" />

            {/* Header: Pure white seamless header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                Konfirmasi Pindah Tautan Kuis
              </h3>
              <button
                type="button"
                onClick={() => setActiveQuizModal("none")}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Tutup Modal"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            {/* Content Notice */}
            <div className="space-y-3">
              <div className="bg-[#F4EFFF] border-l-4 border-[#0400F4] p-3.5 rounded-r-[8px] space-y-1">
                <p className="text-xs text-[#2E2D2D] leading-relaxed font-medium">
                  Anda akan dialihkan dari platform Sitemsa untuk membuka lembar kuis online eksternal pada <strong className="text-[#0400F4] font-bold">{material.quizSource.externalPlatformName || "Platform Eksternal"}</strong>.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#737373]">
                  Tautan Alamat Tujuan:
                </label>
                <div className="text-xs font-mono bg-[#FAFAFA] border border-[#ECECEC] rounded-[6px] p-2.5 text-[#2E2D2D] truncate">
                  {material.quizSource.externalUrl || "#"}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveQuizModal("none")}
                className="w-1/2 bg-[#FAFAFA] border border-[#ECECEC] hover:bg-[#F6F5FF] hover:border-[#0400F4]/40 text-[#737373] hover:text-[#0400F4] py-2.5 rounded-[6px] text-xs font-semibold transition-all duration-200 cursor-pointer text-center"
              >
                Batalkan
              </button>
              <a
                href={material.quizSource.externalUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveQuizModal("none")}
                className="w-1/2 bg-[#0400F4] hover:bg-[#0300d4] active:scale-95 text-white py-2.5 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer text-center"
              >
                <span>Lanjutkan ke Link</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
