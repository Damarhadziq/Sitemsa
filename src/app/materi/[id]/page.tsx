'use client';

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
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

export interface SectionItem {
  number?: string | number;
  title?: string;
  text: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface ContentSection {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: SectionItem[];
  callout?: string;
  mediaUrl?: string;
  imageCaption?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
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
  contentSections: ContentSection[];
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
    nextMaterial: { id: 9, title: "Konsep Koreografi dalam Seni Tari" },
  },
  9: {
    id: 9,
    subject: "Seni Tari",
    title: "Konsep Koreografi dalam Seni Tari",
    level: "Pemula",
    duration: "30 Menit",
    author: "Pak Ahmad Fauzi, S.Pd.",
    updatedAt: "15 Agustus 2026",
    icon: PaintBrushIcon,
    topics: ["Koreografi", "Wirama", "Wiraga", "Wirasa", "Rangsang Visual & Auditif", "Elemen Ruang Waktu Tenaga"],
    description: "Mempelajari pengertian koreografi, unsur pendukung tari (wirama, wiraga, wirasa), sumber rangsang ide, serta elemen utama ruang, waktu, dan tenaga.",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 9.1: Penataan Komposisi dan Gerak Koreografi Tari.",
    contentSections: [
      {
        id: "pengertian-koreografi",
        title: "Pengertian Koreografi",
        paragraphs: [
          "Menurut M. Jazuli koreografi diartikan sebagai pengetahuan penyusunan tari dan untuk menyebutkan hasil susunan tari. Dalam pengertian yang lebih khusus pada saat ini, erat hubungannya dengan masalah bentuk dan gaya tari. Pencipta tari atau penata tarinya disebut koreografer.",
          "Secara etimologis, koreografi berasal dari bahasa Yunani: choreia (tari/gerak berirama) dan graphia (tulisan/catatan). Jadi secara harfiah, koreografi berarti tulisan tari atau catatan gerak. Namun, dalam perkembangannya, koreografi tidak hanya sekadar mencatat gerak, melainkan proses kreatif dalam merancang, menyusun, dan mengorganisasikan gerak tubuh menjadi komposisi tari yang utuh, terstruktur, komunikatif, dan estetis.",
        ],
      },
      {
        id: "konsep-koreografi",
        title: "Konsep Koreografi",
        paragraphs: [
          "Secara sederhana, koreografi adalah proses kreatif dalam merancang, menyusun, dan mengorganisasikan gerak tubuh menjadi sebuah komposisi tari yang utuh, terstruktur, komunikatif, memiliki nilai estetis, dan makna tertentu. Koreografi juga melibatkan pengaturan ruang, waktu, tenaga, serta unsur pendukung seperti musik, tata busana, tata rias, dan properti.",
        ],
        callout: "Koreografi adalah jiwa atau fondasi dari sebuah karya tari, yang mencakup pengaturan ruang, waktu, tenaga, serta unsur pendukung seperti musik, tata busana, tata rias, dan properti.",
      },
      {
        id: "unsur-pendukung-tari",
        title: "Unsur-Unsur Pendukung Tari",
        paragraphs: [
          "1) Wirama: Keselarasan dan ketepatan gerakan tubuh penari dengan irama musik atau lagu yang mengiringinya.",
          "2) Wiraga: Gerak fisik atau keterampilan tubuh dalam menguasai serta mengeksekusi gerak-gerak tubuhnya dengan baik, tepat, dan indah.",
          "3) Wirasa: Kemampuan seorang penari dalam menghayati, mengekspresikan, dan menyampaikan perasaan, emosi, serta makna yang terkandung di balik sebuah tarian melalui gerak dan mimik wajah.",
        ],
      },
      {
        id: "sumber-ide-rangsang",
        title: "Sumber Ide atau Rangsang Koreografi",
        paragraphs: [
          "Menurut Jacqueline Smith (dalam Suharto, 1985), rangsang adalah sesuatu yang membangkitkan pikiran, semangat, atau mendorong kegiatan. Dalam seni tari, rangsang yang paling umum menjadi awal lahirnya karya tari adalah rangsang visual dan auditif.",
          "1) Rangsang Visual: Segala sesuatu yang dapat ditangkap oleh panca indra penglihatan (mata), seperti alam sekitar, benda, fenomena sosial, dan karya seni lain.",
          "2) Rangsang Auditif: Berasal dari bunyi atau musik yang didengar. Musik dengan irama lembut dapat merangsang gerakan lambat dan tenang, sedangkan musik dengan ritme cepat cenderung mendorong gerakan dinamis. Namun, koreografer juga dapat menciptakan kontras, misalnya gerakan cepat diiringi musik lambat, untuk efek artistik tertentu.",
        ],
      },
      {
        id: "elemen-utama-koreografi",
        title: "Elemen Utama Koreografi",
        paragraphs: [
          "1) Ruang (Space): Ruang berkaitan dengan area yang digunakan penari berupa ruang gerak dan juga ruang pementasan.",
          "2) Waktu (Time): Waktu berkaitan dengan durasi, tempo, dan ritme gerakan. Gerak tari dapat dilakukan dengan tempo cepat, sedang, atau lambat sesuai dengan karakter tarian yang ingin disampaikan.",
          "3) Tenaga (Energy): Tenaga berkaitan dengan intensitas dan kualitas gerak, misalnya gerakan yang kuat, lembut, tegas, atau mengalir. Penggunaan tenaga yang tepat akan menciptakan dinamika dan ekspresi dalam tarian.",
        ],
        callout: "Ruang, waktu, dan tenaga perlu diatur dengan tepat agar gerak tari memiliki dinamika, ekspresi, dan karakter yang sesuai.",
      },
    ],
    stepByStepSection: {
      title: "Step by Step Menyusun Konsep Koreografi Tari",
      description: "Tahapan menyusun konsep karya tari dari gagasan hingga peragaan panggung:",
      steps: [
        {
          stepNumber: 1,
          title: "Tentukan Tema",
          text: "Menentukan tema atau gagasan tari, misalnya alam, kehidupan sosial, atau cerita rakyat.",
        },
        {
          stepNumber: 2,
          title: "Tentukan Judul",
          text: "Menentukan judul yang tepat untuk tarian, pemilihan judul harus memiliki keterkaitan dengan tema yang dipilih.",
        },
        {
          stepNumber: 3,
          title: "Membuat Sinopsis",
          text: "Menuliskan sinopsis atau ringkasan cerita tentang tari yang akan dibuat atau dibawakan.",
        },
        {
          stepNumber: 4,
          title: "Membuat Urutan Tarian",
          text: "Membuat urutan atau alur cerita tari yang akan dibuat agar saat eksplorasi gerak sudah ada pegangan ketentuan penggambaran geraknya.",
        },
        {
          stepNumber: 5,
          title: "Menuliskan Jumlah Penari",
          text: "Menuliskan jumlah penari yang akan membawakan karya tari tersebut.",
        },
        {
          stepNumber: 6,
          title: "Tentukan Pola Lantai",
          text: "Menentukan pola lantai yang akan dibuat berdasarkan alur atau urutan gerak yang telah dibuat.",
        },
        {
          stepNumber: 7,
          title: "Menentukan Iringan Musik",
          text: "Mencari iringan musik yang akan digunakan untuk bahan presentasi kelompok.",
        },
      ],
    },
    attachment: {
      fileName: "Modul_Konsep_Koreografi_Seni_Tari.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Evaluasi Konsep Koreografi",
      description: "Uji pemahaman dasar konsep dan unsur-unsur koreografi tari.",
      internalUrl: "/kuis/9",
    },
    prevMaterial: { id: 5, title: "Manajemen Waktu & Teknik Pomodoro dalam Belajar" },
    nextMaterial: { id: 10, title: "Koreografi: Eksplorasi Gerak Dalam Seni Tari" },
  },
  10: {
    id: 10,
    subject: "Seni Tari",
    title: "Koreografi: Eksplorasi Gerak Dalam Seni Tari",
    level: "Pemula",
    duration: "35 Menit",
    author: "Pak Ahmad Fauzi, S.Pd.",
    updatedAt: "16 Agustus 2026",
    icon: PaintBrushIcon,
    topics: ["Eksplorasi Gerak", "Rangsang Kinestetik", "Transformasi Gerak", "Tempo & Level"],
    description: "Memahami prinsip eksplorasi gerak tari, berbagai sumber rangsangan (visual, audio, kinestetik, gagasan), dan teknik pengembangan gerak dasar.",
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 10.1: Proses Eksplorasi Gerak Tari Berdasarkan Rangsang Fisik dan Ruang.",
    contentSections: [
      {
        id: "pengertian-eksplorasi",
        title: "Pengertian & Pentingnya Eksplorasi Gerak",
        paragraphs: [
          "Eksplorasi gerak adalah kegiatan mencari, mencoba, mengembangkan, dan menemukan berbagai kemungkinan gerak tubuh untuk memperoleh gerak yang dapat digunakan sebagai bahan dalam membuat sebuah karya tari.",
          "Dalam dunia koreografi, eksplorasi menjadi tahap awal yang sangat vital. Siswa tidak dituntut hanya meniru gerakan yang sudah ada, melainkan diajak untuk menciptakan dan merancang gerak baru berdasarkan ide, pengalaman, lingkungan, maupun berbagai rangsangan.",
        ],
      },
      {
        id: "prinsip-utama",
        title: "Prinsip Utama",
        paragraphs: [
          "Dalam koreografi, eksplorasi bukan sekadar meniru gerak yang sudah ada, melainkan proses kreatif menciptakan dan menemukan kemungkinan gerak baru berdasarkan ide, pemikiran, atau rangsangan tertentu.",
        ],
      },
      {
        id: "tujuan-eksplorasi",
        title: "Tujuan Melakukan Eksplorasi Gerak",
        paragraphs: [
          "Melakukan eksplorasi gerak memiliki beberapa tujuan utama bagi penari maupun koreografer muda, antara lain:",
          "1) Mengembangkan kreativitas siswa dalam menciptakan gerakan tari baru.",
          "2) Melatih keberanian untuk mencoba berbagai variasi gerak.",
          "3) Menemukan gerak yang selaras dengan tema tari yang diusung.",
          "4) Mengembangkan gerak dasar/sederhana menjadi gerak yang lebih kaya dan bervariasi.",
          "5) Meningkatkan kemampuan siswa dalam menyusun gerak menjadi sebuah koreografi utuh.",
          "6) Melatih kepekaan tubuh terhadap ruang, waktu, tenaga, dan ekspresi.",
        ],
      },
      {
        id: "sumber-rangsangan",
        title: "Sumber Rangsangan atau Ide Eksplorasi",
        paragraphs: [
          "Gerakan tari dapat bersumber dan dikembangkan dari berbagai jenis rangsangan, di antaranya:",
          "1) Rangsangan Visual: Gerak terinspirasi dari objek yang dilihat, seperti gerak tumbuhan, hewan, aktivitas manusia, atau fenomena alam.",
          "2) Rangsangan Audio: Gerak dikembangkan berdasarkan suara, instrumen, atau musik yang didengar. Perubahan tempo, ritme, dan karakter musik sangat memengaruhi gerak.",
          "3) Rangsangan Kinestetik: Gerak muncul dari pengalaman fisik tubuh saat melakukan suatu gerakan tertentu, yang kemudian dikembangkan lagi menjadi bentuk gerak baru.",
          "4) Rangsangan Gagasan/Ide: Gerakan berasal dari konsep, cerita, perasaan, atau tema abstrak (misalnya tema perjuangan, persahabatan, atau kehidupan remaja).",
          "5) Rangsangan Lingkungan: Gerakan terinspirasi dari dinamika aktivitas sekitar, seperti suasana sekolah, pasar, sawah, atau fasilitas umum.",
        ],
      },
      {
        id: "unsur-eksplorasi",
        title: "Unsur-Unsur Utama yang Dieksplorasi",
        paragraphs: [
          "Dalam proses eksplorasi, siswa mengolah dan memvariasikan gerak tubuh melalui elemen-elemen dasar seni tari berikut:",
          "1) Ruang: Arah hadap, level (tinggi/sedang/rendah), pola lantai, jarak, dan posisi tubuh.",
          "2) Waktu: Tempo (cepat/lambat), ritme, durasi, dan aksentuasi.",
          "3) Tenaga: Kuat-lemah, berat-ringan, tegang-rileks.",
          "4) Tubuh: Gerak kepala, tangan, badan, kaki, serta kombinasi anggota tubuh.",
          "5) Ekspresi: Mimik wajah, gestur sikap tubuh, dan penghayatan makna.",
        ],
        callout: "Tips Penting: Kombinasi perubahan elemen ruang, waktu, dan tenaga pada satu gerak dasar dapat memberikan makna, nuansa, serta emosi panggung yang sangat berbeda.",
      },
      {
        id: "teknik-pengembangan",
        title: "Teknik Mengembangkan Gerak Dasar",
        paragraphs: [
          "Satu gerak dasar yang sederhana dapat ditransformasikan menjadi beragam variasi gerak koreografi melalui teknik berikut:",
          "1) Mengubah arah (depan, belakang, samping, diagonal)",
          "2) Mengubah level (tinggi, sedang, rendah)",
          "3) Mengubah tempo (dipercepat, diperlambat, freeze)",
          "4) Mengubah tenaga (hentakan kuat atau ayunan lembut)",
          "5) Mengubah ukuran gerak (diperluas atau diperkecil)",
          "6) Mengubah anggota tubuh (transfer gerakan dari tangan ke kaki)",
          "7) Mengulang & menggabungkan motif gerak berbeda",
        ],
      },
    ],
    stepByStepSection: {
      title: "Panduan Langkah Praktik Eksplorasi Gerak",
      description: "Berdasarkan contoh tema 'Kehidupan di Lingkungan Sekolah' dengan gerak dasar 'Berjalan':",
      steps: [
        {
          stepNumber: 1,
          title: "Eksplorasi Berdasarkan Unsur Waktu (Tempo)",
          text: "Cobalah melakukan gerak dasar berjalan dengan variasi tempo lambat (tenang, ragu, khidmat) dan tempo cepat (tergesa-gesa, bersemangat).",
        },
        {
          stepNumber: 2,
          title: "Eksplorasi Berdasarkan Unsur Ruang (Arah & Level)",
          text: "Ubah arah langkah kaki (menyamping, diagonal, memutar) dan ketinggian tubuh (level rendah dengan posisi lutut ditekuk/jongkok).",
        },
        {
          stepNumber: 3,
          title: "Eksplorasi Berdasarkan Unsur Tubuh & Tenaga",
          text: "Kombinasikan gerakan berjalan dengan dorongan tenaga kuat (tegap bertenaga) atau tenaga lembut (ayunan mengalir) serta ayunan tangan.",
        },
        {
          stepNumber: 4,
          title: "Penambahan Pose Akhir dan Ekspresi",
          text: "Lakukan gerak berjalan kemudian berhenti secara mendadak (pose) diiringi ekspresi wajah yang sesuai dengan tema.",
        },
        {
          stepNumber: 5,
          title: "Merangkai Variasi Menjadi Koreografi",
          text: "Pilih 3 hingga 5 variasi gerak berjalan yang telah dicoba, lalu hubungkan secara berurutan menjadi satu kesatuan motif gerak singkat.",
        },
      ],
    },
    attachment: {
      fileName: "Panduan_Eksplorasi_Gerak_Tari.pdf",
      fileSize: "2.5 MB",
    },
    quizSource: {
      type: "internal",
      title: "Evaluasi Eksplorasi Gerak",
      description: "Uji pemahaman tentang teknik eksplorasi dan transformasi gerak dasar tari.",
      internalUrl: "/kuis/10",
    },
    prevMaterial: { id: 9, title: "Konsep Koreografi dalam Seni Tari" },
    nextMaterial: { id: 12, title: "Koreografi: Pola Lantai dalam Penunjang Komposisi Tari" },
  },
  12: {
    id: 12,
    subject: "Seni Tari",
    title: "Koreografi: Pola Lantai dalam Penunjang Komposisi Tari",
    level: "Menengah",
    duration: "40 Menit",
    author: "Pak Ahmad Fauzi, S.Pd.",
    updatedAt: "17 Agustus 2026",
    icon: PaintBrushIcon,
    topics: ["Komposisi Tari", "Pola Lantai", "Level Vertikal", "Prinsip Unity Balance", "Jenis Panggung"],
    description: "Mempelajari unsur utama komposisi tari, pola lantai, level, arah hadap, prinsip kesatuan & keseimbangan, serta ragam panggung pertunjukan.",
    imageUrl: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 12.1: Dinamika Formasi Pola Lantai dan Tata Panggung Tari.",
    contentSections: [
      {
        id: "komposisi-tari",
        title: "Pengertian Komposisi Tari",
        paragraphs: [
          "Komposisi berasal dari kata compose yang berarti meletakkan, mengatur, dan menyusun bagian-bagian menjadi satu kesatuan yang utuh. Dalam seni tari, komposisi menjadi suatu bentuk untuk memberikan wujud estetik terhadap pertunjukan seni tari. Ruang menjadi hal penting dalam tari karena dapat dihidupkan melalui gerak dan perpindahan penari di atas panggung.",
        ],
      },
      {
        id: "unsur-utama-komposisi",
        title: "Unsur Utama Komposisi Tari",
        paragraphs: [
          "1) Pola Lantai (Floor Pattern): Garis-garis yang dilalui oleh penari dan menjadi alur visual dari sebuah tarian. Pola lantai berfungsi untuk mengisi ruang panggung, menggambarkan alur cerita, serta memberikan daya tarik kepada penonton.",
          "2) Level (Dimensi Vertikal): Tinggi rendahnya posisi tubuh penari berkaitan dengan lantai. Variasi level memberikan kesan estetis dalam pertunjukan tari. Level tinggi dapat menggambarkan kekuatan dan kegembiraan, level sedang menggambarkan ketenangan atau kesetaraan, sedangkan level rendah dapat menggambarkan kerendahan hati atau kesedihan.",
          "3) Arah Hadap (Direction): Penyesuaian arah tubuh penari ketika melakukan gerak, seperti menghadap ke depan, belakang, samping kanan, samping kiri, atau bawah. Perubahan arah hadap dapat menciptakan dinamika estetis dan membantu mengarahkan fokus penonton.",
        ],
        callout: "Pemilihan pola lantai perlu disesuaikan dengan tema dan suasana yang ingin ditampilkan dalam karya tari.",
      },
      {
        id: "prinsip-komposisi",
        title: "Prinsip-Prinsip Komposisi Tari",
        paragraphs: [
          "1) Kesatuan (Unity atau Cohesion): Prinsip komposisi tari yang menunjukkan adanya hubungan antara berbagai elemen tari (gerak, pola lantai, iringan musik, tata busana, tata cahaya) sebagai pendukung tema tari sehingga menjadi satu kesatuan karya tari yang utuh dan harmonis.",
          "2) Keseimbangan (Balance): Berkaitan dengan pengaturan visual di atas panggung, baik keseimbangan simetris (posisi penari di sisi kanan dan kiri panggung sama) maupun keseimbangan asimetris (posisi tidak sama tetapi jumlah/bentuknya tetap seimbang secara visual).",
          "3) Kontras (Contrast): Menggunakan perbedaan untuk menciptakan dinamika dan membuat pertunjukan menjadi lebih hidup melalui perbedaan kecepatan gerak, level, formasi, dan arah hadap.",
          "4) Komposisi Kelompok: Gerak yang dilakukan oleh beberapa penari dengan hubungan timbal balik (kelompok kecil 2-4 orang atau kelompok besar 5+ orang) dengan pola formasi seimbang, serempak, zig-zag, atau terpecah.",
        ],
      },
      {
        id: "panggung-pertunjukan",
        title: "Panggung & Jenis-Jenis Panggung",
        paragraphs: [
          "Panggung merupakan ruang fisik tempat penari mengekspresikan karya seni di hadapan penonton. Ragam jenis panggung meliputi:",
        ],
        items: [
          {
            number: 1,
            title: "Panggung Proscenium",
            text: "Panggung yang dibatasi oleh bingkai (frame) atau lengkungan (arch) di bagian depan. Penonton menyaksikan pertunjukan dari satu arah depan. (Contoh: Gedung Kesenian Jakarta dan Teater Besar Taman Ismail Marzuki).",
            imageUrl: "/images/tari/panggung-proscenium.png",
            imageCaption: "Panggung Proscenium: Panggung berbingkai depan di mana penonton duduk menyaksikan dari satu arah frontal.",
          },
          {
            number: 2,
            title: "Panggung Thrust",
            text: "Panggung yang menjorok ke arah penonton sehingga penonton dapat menyaksikan pertunjukan dari tiga sisi panggung (sisi kiri, kanan, dan depan), seperti pada Sendratari Ramayana.",
            imageUrl: "/images/tari/panggung-thrust.jpg",
            imageCaption: "Panggung Thrust: Panggung yang menjorok ke tengah dan dapat disaksikan penonton dari 3 sisi.",
          },
          {
            number: 3,
            title: "Panggung Arena",
            text: "Panggung yang berada di tengah-tengah dan dikelilingi penonton dari keempat sisi (360°), seperti di pendopo dan pertunjukan tari rakyat.",
            imageUrl: "/images/tari/panggung-arena.jpg",
            imageCaption: "Panggung Arena: Panggung yang dikelilingi penonton dari 4 sisi secara 360 derajat.",
          },
          {
            number: 4,
            title: "Panggung Terbuka (Open Air Stage)",
            text: "Panggung yang berada di ruang terbuka tanpa atap, memanfaatkan lingkungan alam atau bangunan di sekitarnya sebagai latar pertunjukan (Contoh: Candi Prambanan, panggung terbuka Taman Budaya, dan amphitheater).",
            imageUrl: "/images/tari/panggung-open-air.png",
            imageCaption: "Panggung Terbuka (Open Air / Amphitheater): Panggung terbuka berlatar alam atau arsitektur budaya.",
          },
        ],
      },
    ],
    stepByStepSection: {
      title: "Langkah-Langkah Praktik Komposisi Tari / Pola Lantai",
      description: "Tahapan sistematis penyusunan komposisi pola lantai kelompok tari:",
      steps: [
        { stepNumber: 1, title: "Membentuk Kelompok", text: "Peserta didik membentuk kelompok tari sesuai arahan guru." },
        { stepNumber: 2, title: "Menentukan Pola Lantai", text: "Kelompok memilih beberapa pola lantai, seperti horizontal, vertikal, diagonal, lengkung, atau zig-zag." },
        { stepNumber: 3, title: "Menentukan Level", text: "Peserta didik menentukan penggunaan level tinggi, sedang, dan rendah pada setiap formasi." },
        { stepNumber: 4, title: "Menentukan Arah Hadap", text: "Peserta didik menentukan arah hadap penari agar komposisi terlihat lebih dinamis." },
        { stepNumber: 5, title: "Menyusun Perpindahan Formasi", text: "Peserta didik menentukan urutan perpindahan dari satu pola lantai ke pola lantai berikutnya." },
        { stepNumber: 6, title: "Melakukan Latihan", text: "Kelompok mempraktikkan gerak dan perpindahan pola lantai dengan memperhatikan jarak serta posisi penari." },
        { stepNumber: 7, title: "Mengevaluasi Komposisi", text: "Peserta didik mengamati keseimbangan, kesatuan, dan kontras dalam komposisi yang telah dibuat." },
        { stepNumber: 8, title: "Menampilkan Hasil", text: "Kelompok menampilkan hasil komposisi tari di depan kelas." },
      ],
    },
    attachment: {
      fileName: "Panduan_Pola_Lantai_dan_Komposisi_Tari.pdf",
      fileSize: "2.8 MB",
    },
    quizSource: {
      type: "internal",
      title: "Evaluasi Komposisi Tari",
      description: "Uji pemahaman pola lantai dan prinsip tata panggung.",
      internalUrl: "/kuis/12",
    },
    prevMaterial: { id: 10, title: "Koreografi: Eksplorasi Gerak Dalam Seni Tari" },
    nextMaterial: { id: 13, title: "Tata Rias dalam Seni Tari" },
  },
  13: {
    id: 13,
    subject: "Seni Tari",
    title: "Tata Rias dalam Seni Tari",
    level: "Pemula",
    duration: "30 Menit",
    author: "Pak Ahmad Fauzi, S.Pd.",
    updatedAt: "18 Agustus 2026",
    icon: PaintBrushIcon,
    topics: ["Tata Rias Tari", "Rias Korektif", "Rias Karakter", "Rias Fantasi", "Aplikasi Makeup"],
    description: "Mempelajari fungsi tata rias panggung, jenis rias (korektif, karakter, fantasi), dan langkah-langkah aplikasi riasan korektif.",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 13.1: Tata Rias Wajah Penari untuk Memperjelas Watak dan Karakter Tokoh.",
    contentSections: [
      {
        id: "pengertian-tata-rias",
        title: "Pengertian Tata Rias Tari",
        paragraphs: [
          "Tata rias adalah kegiatan menata atau merias wajah penari dengan menggunakan bahan kosmetik tertentu yang disesuaikan dengan kebutuhan pertunjukan. Tata rias tidak hanya bertujuan untuk mempercantik wajah, tetapi juga membantu memperjelas karakter, watak, tokoh, dan ekspresi penari di atas panggung.",
          "Menurut Harymawan, tata rias merupakan seni menggunakan kosmetik untuk mewujudkan wajah sesuai dengan peranan yang dimainkan di atas panggung dengan mempertimbangkan kondisi pementasan, termasuk pencahayaan dan jarak penonton.",
        ],
      },
      {
        id: "fungsi-tata-rias",
        title: "Fungsi Tata Rias",
        paragraphs: [
          "1) Mendukung Tema Tari: Tata rias harus disesuaikan dengan tema karya tari (kehidupan masyarakat, kepahlawanan, percintaan, alam, cerita rakyat, kerajaan).",
          "2) Memperjelas Karakter dan Tokoh Penari: Memperkuat karakter (lembut, gagah, tegas, lucu, tua, muda, anggun) serta sifat dan kedudukan tokoh melalui bentuk alis, mata, garis wajah, dan warna riasan.",
          "3) Memperjelas Ekspresi Wajah: Membantu penonton melihat penghayatan emosi penari dari kejauhan.",
          "4) Menunjang Keindahan Penampilan: Meningkatkan nilai estetis dan keserasian antara tata rias, tata busana, gerak, musik, dan tata cahaya.",
          "5) Memperkuat Identitas Budaya: Menunjukkan identitas budaya daerah melalui ciri khas riasan tradisional.",
        ],
      },
      {
        id: "jenis-tata-rias",
        title: "Jenis-Jenis Tata Rias Tari",
        items: [
          {
            number: 1,
            title: "Tata Rias Korektif",
            text: "Bertujuan untuk memperbaiki, mempertegas, dan menonjolkan bentuk wajah penari agar terlihat lebih jelas dan menarik tanpa mengubah wajah secara drastis, dengan menekankan pada alis, mata, hidung, pipi, dan bibir.",
          },
          {
            number: 2,
            title: "Tata Rias Karakter & Fantasi",
            text: "Tata rias karakter digunakan untuk menciptakan atau memperkuat karakter watak tertentu seperti gagah, tegas, tua, keras, lembut, lucu, atau antagonis. Sedangkan tata rias fantasi menciptakan tampilan imajinatif dan unik yang terinspirasi dari alam, binatang, tumbuhan, atau tokoh mitologi.",
            imageUrl: "/images/tari/tata-rias-karakter.jpg",
            imageCaption: "Tata Rias Karakter & Fantasi: Mempertegas penjiwaan watak tokoh pementasan melalui garis wajah dan ornamen estetis.",
          },
          {
            number: 3,
            title: "Tata Rias Fantasi",
            text: "Digunakan untuk menciptakan tampilan imajinatif dan unik yang tidak selalu mengikuti bentuk wajah manusia biasa (terinspirasi dari alam, binatang, tumbuhan, atau tokoh mitologi).",
          },
        ],
        callout: "Riasan yang digunakan oleh penari perlu disesuaikan dengan konsep tari, karakter tokoh, jenis pertunjukan, tata cahaya, serta jarak antara penari dengan penonton. Dengan tata rias yang tepat, penampilan penari menjadi lebih jelas dan mendukung penyampaian karya secara keseluruhan.",
      },
    ],
    stepByStepSection: {
      title: "Step by Step Tata Rias Korektif",
      description: "Tahapan aplikasi tata rias korektif penari panggung:",
      steps: [
        { stepNumber: 1, title: "Membersihkan Wajah", text: "Bersihkan wajah terlebih dahulu dengan pembersih wajah agar bebas dari kotoran dan minyak." },
        { stepNumber: 2, title: "Menggunakan Skincare", text: "Aplikasikan toner, pelembap secara merata, dan sunscreen bila pertunjukan berlangsung di luar ruangan." },
        { stepNumber: 3, title: "Menggunakan Alas Bedak", text: "Letakkan foundation pada dahi, pipi, hidung, dan dagu, lalu ratakan menggunakan spons makeup." },
        { stepNumber: 4, title: "Melakukan Koreksi Bentuk Wajah", text: "Aplikasikan produk koreksi (shading/contour & highlight) pada bagian wajah yang ingin ditegaskan." },
        { stepNumber: 5, title: "Menggunakan Bedak", text: "Tepuk-tepukkan bedak secara merata untuk mengunci dasar riasan agar lebih rapi dan awet." },
        { stepNumber: 6, title: "Membentuk Alis", text: "Rapikan dan isi bagian alis mengikuti garis alami agar ekspresi penari lebih tegas." },
        { stepNumber: 7, title: "Merias Bagian Mata", text: "Aplikasikan eyeshadow dan eyeliner untuk mempertegas garis dan kelopak mata secara seimbang." },
        { stepNumber: 8, title: "Menggunakan Perona Pipi", text: "Aplikasikan blush on pada pipi agar wajah terlihat segar dan berdimensi di bawah lampu panggung." },
        { stepNumber: 9, title: "Memberikan Warna pada Bibir", text: "Rapikan bibir dan oleskan lipstik secara merata sesuai konsep riasan dan kostum tari." },
        { stepNumber: 10, title: "Mengecek dan Merapikan Hasil Riasan", text: "Periksa keseimbangan riasan kanan dan kiri untuk memastikan kerapian pementasan." },
      ],
    },
    attachment: {
      fileName: "Panduan_Tata_Rias_Seni_Tari.pdf",
      fileSize: "2.3 MB",
    },
    quizSource: {
      type: "internal",
      title: "Evaluasi Tata Rias Tari",
      description: "Uji pemahaman fungsi dan tahapan tata rias tari.",
      internalUrl: "/kuis/13",
    },
    prevMaterial: { id: 12, title: "Koreografi: Pola Lantai dalam Penunjang Komposisi Tari" },
    nextMaterial: { id: 14, title: "Tata Kostum dan Busana dalam Seni Tari" },
  },
  14: {
    id: 14,
    subject: "Seni Tari",
    title: "Tata Kostum dan Busana dalam Seni Tari",
    level: "Pemula",
    duration: "30 Menit",
    author: "Pak Ahmad Fauzi, S.Pd.",
    updatedAt: "19 Agustus 2026",
    icon: PaintBrushIcon,
    topics: ["Tata Busana", "Pakaian Tubuh & Kepala", "Aksesori Tari", "Sapit Urang", "Tari Merak"],
    description: "Mempelajari peranan tata busana dalam mendukung karakter tari, unsur busana, serta praktik memakai kain jarit model sapit urang.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 14.1: Kelengkapan Kostum dan Busana Tari Tradisional Nusantara.",
    contentSections: [
      {
        id: "pengertian-tata-busana",
        title: "Pengertian Tata Kostum & Busana dalam Seni Tari",
        paragraphs: [
          "Tata kostum atau tata busana dalam seni tari adalah segala sesuatu yang berkaitan dengan pakaian, perlengkapan, dan aksesori yang dikenakan oleh penari saat pertunjukan. Tata busana membantu memperjelas tema, karakter, tokoh, suasana, identitas budaya, dan nilai estetis dalam karya tari.",
        ],
      },
      {
        id: "hubungan-kostum-gerak",
        title: "Hubungan Kostum dengan Gerak Tari",
        paragraphs: [
          "Busana harus memungkinkan penari bergerak secara leluasa dan nyaman. Kostum yang terlalu berat, terlalu ketat, terlalu longgar, atau memiliki aksesori yang tidak sesuai dapat menghambat gerakan dan mengganggu keamanan pertunjukan.",
        ],
      },
      {
        id: "unsur-tata-busana",
        title: "Unsur-Unsur Tata Busana Tari",
        paragraphs: [
          "1) Pakaian Dasar: Pakaian yang digunakan sebagai lapisan dasar sebelum mengenakan kostum utama untuk kenyamanan tubuh penari.",
          "2) Pakaian Tubuh: Pakaian utama yang dikenakan pada badan penari (kebaya, rompi, kemben, baju kurung) yang disesuaikan dengan tema dan karakter tari.",
          "3) Pakaian Kepala: Perlengkapan di bagian kepala seperti mahkota, gelungan, ikat kepala, siger, atau jamang yang memperkuat karakter.",
          "4) Pakaian Kaki: Perlengkapan di bagian kaki seperti kaus kaki atau gelang kaki (binggel).",
          "5) Aksesori: Perlengkapan tambahan untuk memperindah kostum seperti kalung, gelang, anting, ikat pinggang, dan selendang (sampur).",
          "6) Properti Pelengkap: Perlengkapan yang dikenakan untuk mendukung kebutuhan pementasan.",
        ],
        callout: "Tata busana tari terdiri dari berbagai unsur yang saling melengkapi. Pemilihannya perlu disesuaikan dengan tema, karakter, gerak, dan kebutuhan pertunjukan agar kostum tidak hanya indah, tetapi juga mendukung penampilan penari.",
      },
      {
        id: "karakter-tata-busana",
        title: "Visualisasi Karakter Melalui Tata Busana",
        paragraphs: [
          "1) Tari Merak: Pada Tari Merak, tata busana dirancang dengan bentuk, warna, dan hiasan yang terinspirasi dari burung merak untuk memperkuat karakter serta mendukung visualisasi keluwesan gerak.",
          "2) Tari Tradisional Jawa: Pada tari tradisional Jawa, penggunaan kain, kebaya, jarik, sampur, serta berbagai aksesori disesuaikan dengan jenis dan karakter tari.",
        ],
        callout: "Tata busana pada tari tradisional Jawa tidak hanya berfungsi untuk memperindah penampilan penari, tetapi juga memperkuat karakter, suasana, dan identitas budaya Jawa yang terdapat dalam karya tari.",
      },
    ],
    stepByStepSection: {
      title: "Cara Menggunakan Kain Jarit Bentuk Sapit Urang",
      description: "Sapit urang merupakan cara memakai kain jarit dalam busana tari Jawa agar rapi, kuat, dan kaki dapat melangkah leluasa:",
      steps: [
        { stepNumber: 1, title: "Siapkan Kain Jarit", text: "Bentangkan kain jarit dan pastikan bagian motif serta arah kain sudah sesuai." },
        { stepNumber: 2, title: "Posisikan Kain pada Tubuh", text: "Letakkan kain melingkari tubuh dari arah belakang ke depan dengan posisi kain sejajar dan rapi." },
        { stepNumber: 3, title: "Atur Bagian Depan Kain", text: "Tarik dan rapikan bagian depan kain sehingga membentuk sapit urang (lipatan kain yang mengarah dan merapat di depan)." },
        { stepNumber: 4, title: "Buat Lipatan Kain", text: "Lipat bagian kain secara teratur dan pastikan lipatannya rapi serta tidak terlalu longgar." },
        { stepNumber: 5, title: "Kencangkan Kain", text: "Rapikan dan kuatkan ikatan pada bagian pinggang agar kain tidak mudah bergeser ketika penari bergerak." },
        { stepNumber: 6, title: "Periksa Panjang Kain", text: "Pastikan panjang kain sesuai kebutuhan tari dan tidak menghambat langkah atau gerakan kaki." },
        { stepNumber: 7, title: "Rapikan Keseluruhan", text: "Periksa kembali posisi motif, lipatan, dan bagian pinggang agar nyaman dan siap digunakan menari." },
      ],
    },
    attachment: {
      fileName: "Panduan_Tata_Kostum_Seni_Tari.pdf",
      fileSize: "2.6 MB",
    },
    quizSource: {
      type: "internal",
      title: "Evaluasi Tata Busana Tari",
      description: "Uji pemahaman tentang unsur busana dan teknik pemakaian kostum tari.",
      internalUrl: "/kuis/14",
    },
    prevMaterial: { id: 13, title: "Tata Rias dalam Seni Tari" },
    nextMaterial: { id: 15, title: "Properti dalam Seni Tari" },
  },
  15: {
    id: 15,
    subject: "Seni Tari",
    title: "Properti dalam Seni Tari",
    level: "Pemula",
    duration: "25 Menit",
    author: "Pak Ahmad Fauzi, S.Pd.",
    updatedAt: "20 Agustus 2026",
    icon: PaintBrushIcon,
    topics: ["Properti Tari", "Stimulus Gerak", "Fungsi Properti", "Eksplorasi Properti", "Topeng & Kipas"],
    description: "Memahami pemanfaatan properti sebagai pendukung dan stimulus koreografi gerak, serta ragam fungsi properti dalam karya tari.",
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 15.1: Penggunaan Properti Topeng dan Selendang dalam Eksplorasi Gerak Tari.",
    contentSections: [
      {
        id: "pengertian-properti",
        title: "Pengertian Properti Tari",
        paragraphs: [
          "Properti tari adalah segala benda atau perlengkapan yang digunakan penari dalam pertunjukan untuk mendukung tema, karakter, suasana, dan gagasan tari. Properti dapat berupa benda khusus untuk pertunjukan maupun benda sederhana yang ada di sekitar.",
          "Pemilihan properti harus disesuaikan dengan tema, konsep, karakter, dan gerak tari agar dapat mendukung koreografi secara optimal.",
        ],
        callout: "Properti tidak harus mahal atau rumit. Benda sederhana dapat menjadi properti tari apabila dimanfaatkan secara kreatif untuk mendukung penciptaan gerak.",
      },
      {
        id: "properti-pendukung-koreografi",
        title: "Properti sebagai Pendukung Koreografi",
        paragraphs: [
          "Properti tidak hanya berfungsi sebagai pelengkap atau hiasan, tetapi juga dapat menjadi stimulus untuk menciptakan dan mengembangkan gerak tari. Contohnya kain dapat digunakan untuk gerakan mengayun, menarik, memutar, mengembangkan, atau mengibaskan. Topeng dapat digunakan untuk memperkuat karakter tokoh.",
          "Hubungan properti dengan koreografi berlangsung dalam alur: Tema → Ide/Gagasan → Properti → Eksplorasi Gerak → Koreografi. Artinya, properti yang digunakan sebaiknya berasal dari kebutuhan konsep tari dan dikembangkan menjadi bagian koreografi.",
        ],
      },
      {
        id: "fungsi-properti",
        title: "Fungsi Properti Tari",
        paragraphs: [
          "1) Memperkuat Tema: Membantu memperjelas tema yang diangkat (misal tari bertema petani menggunakan caping/cangkul).",
          "2) Memperkuat Karakter: Cara memegang, membawa, atau menggerakkan properti mempertegas watak tokoh.",
          "3) Mengembangkan Gerak: Menjadi sumber inspirasi untuk menciptakan berbagai variasi gerak baru.",
          "4) Memperjelas Cerita atau Gagasan: Membantu penonton memahami pesan dan jalan cerita tarian.",
          "5) Menambah Nilai Estetis: Bentuk, warna, dan manuver properti memperkaya tampilan visual koreografi.",
          "6) Mengembangkan Kreativitas: Mendorong peserta didik menemukan kemungkinan gerak dan melatih imajinasi.",
        ],
        callout: "Properti tari bukan sekadar pelengkap pertunjukan, tetapi dapat menjadi bagian dari proses penciptaan, eksplorasi, dan pengembangan gerak dalam koreografi.",
      },
    ],
    stepByStepSection: {
      title: "Eksplorasi Gerak Menggunakan Properti",
      description: "Langkah-langkah mengeksplorasi gerak tari dengan berbagai alat/properti (topeng, kipas, gendewa, selendang):",
      steps: [
        { stepNumber: 1, title: "Tentukan Tema atau Ide Tari", text: "Tentukan gagasan pokok atau cerita yang ingin diekspresikan." },
        { stepNumber: 2, title: "Pilih Properti yang Sesuai", text: "Gunakan benda yang selaras dengan konsep dan tema tarian." },
        { stepNumber: 3, title: "Amati Bentuk dan Karakteristik Properti", text: "Perhatikan ukuran, berat, kelenturan, dan fungsi benda." },
        { stepNumber: 4, title: "Coba Berbagai Cara Menggunakan Properti", text: "Bereksplorasi dengan gerakan mengayun, menarik, memutar, membawa, atau mengibaskan properti." },
        { stepNumber: 5, title: "Kembangkan Gerakan Menjadi Beberapa Variasi", text: "Ubah tempo, level, dan arah hadap saat menggerakkan properti." },
        { stepNumber: 6, title: "Pilih Gerakan yang Paling Sesuai", text: "Seleksi gerakan yang paling kuat mencerminkan tema dan karakter tokoh." },
        { stepNumber: 7, title: "Susun Gerakan Menjadi Bagian Koreografi", text: "Rangkai motif-motif gerak properti menjadi kesatuan komposisi tari yang utuh." },
      ],
    },
    attachment: {
      fileName: "Panduan_Properti_Seni_Tari.pdf",
      fileSize: "2.2 MB",
    },
    quizSource: {
      type: "internal",
      title: "Evaluasi Properti Seni Tari",
      description: "Uji pemahaman tentang jenis dan fungsi properti tari.",
      internalUrl: "/kuis/15",
    },
    prevMaterial: { id: 14, title: "Tata Kostum dan Busana dalam Seni Tari" },
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

function SmartParagraph({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => (
          <SmartLine key={idx} line={line} />
        ))}
      </div>
    );
  }
  return <SmartLine line={text} />;
}

function SmartLine({ line }: { line: string }) {
  const trimmed = line.trim();

  // Matches prefixes like "1)", "1.", "(1)", "a)", "a.", "•", "-", "*"
  const listMatch = trimmed.match(/^(\d+[\.\)]|\([a-zA-Z0-9]+\)|[a-zA-Z][\.\)]|[\-•\*])\s+(.*)$/i);

  if (listMatch) {
    const rawPrefix = listMatch[1];
    const rest = listMatch[2];
    const cleanBadge = rawPrefix.replace(/[\)\.\(\s]/g, "");

    // Check if rest contains bold header before colon e.g. "Wirama: ..." or "Panggung Proscenium: ..."
    const colonMatch = rest.match(/^([^:]+):\s*(.*)$/);
    if (colonMatch) {
      return (
        <div className="flex items-start gap-2.5 my-1.5 pl-0.5">
          <span className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-1.5 rounded-[6px] bg-[#E8E7FF] text-[#2563EB] text-xs font-bold shrink-0 mt-0.5 select-none shadow-2xs">
            {cleanBadge}
          </span>
          <div className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed flex-1">
            <strong className="font-bold text-[#1E1E1E]">{colonMatch[1]}: </strong>
            <span>{colonMatch[2]}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-2.5 my-1.5 pl-0.5">
        <span className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-1.5 rounded-[6px] bg-[#E8E7FF] text-[#2563EB] text-xs font-bold shrink-0 mt-0.5 select-none shadow-2xs">
          {cleanBadge}
        </span>
        <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed flex-1">
          {rest}
        </p>
      </div>
    );
  }

  // Check if standalone bold colon title without number prefix e.g. "Wirama: ..."
  const standaloneColonMatch = trimmed.match(/^([^:]+):\s*(.*)$/);
  if (standaloneColonMatch && standaloneColonMatch[1].length < 40 && !standaloneColonMatch[1].includes("http")) {
    return (
      <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
        <strong className="font-bold text-[#1E1E1E]">{standaloneColonMatch[1]}: </strong>
        <span>{standaloneColonMatch[2]}</span>
      </p>
    );
  }

  return (
    <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line">
      {trimmed}
    </p>
  );
}

export default function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");

  const materialId = parseInt(id, 10) || 1;
  const material = MATERIAL_DATABASE[materialId] || MATERIAL_DATABASE[1];
  const initialSectionId = material.videoSection ? "video-tutorial" : (material.contentSections[0]?.id || "pengantar");
  const [activeSection, setActiveSection] = useState(initialSectionId);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeQuizModal, setActiveQuizModal] = useState<"none" | "barcode" | "link_confirm">("none");
  const [isTocOpen, setIsTocOpen] = useState(false);

  // Compute smart back URL preserving category filter
  const savedFilter = typeof window !== "undefined" ? sessionStorage.getItem("sintesa_materi_filter") : null;
  const activeCategory = fromParam || savedFilter;
  const backUrl = activeCategory && activeCategory !== "Semua" ? `/materi?kategori=${encodeURIComponent(activeCategory)}` : "/materi";

  // Record material view for AI recommendation intelligence
  useEffect(() => {
    if (material) {
      try {
        const raw = localStorage.getItem("sintesa_user_views") || "[]";
        const views: { id: number; subject: string; timestamp: number }[] = JSON.parse(raw);
        const filtered = views.filter((v) => v.id !== material.id);
        filtered.unshift({ id: material.id, subject: material.subject, timestamp: Date.now() });
        localStorage.setItem("sintesa_user_views", JSON.stringify(filtered.slice(0, 30)));
      } catch (e) {
        console.error(e);
      }
    }
  }, [material]);

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
      ...(material.videoSection ? ["video-tutorial"] : []),
      ...material.contentSections.map((s) => s.id),
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
        {/* Sticky Icon-Only Back Button (Preserving active category filter) */}
        <div className="sticky top-20 z-30 mb-6 pt-1">
          <Link
            href={backUrl}
            aria-label="Kembali ke Materi"
            className="w-9 h-9 rounded-full bg-white/90 border border-[#ECECEC] text-[#2E2D2D] hover:text-[#2563EB] hover:bg-white shadow-2xs inline-flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Skeleton Loading State (Realistic 12-Col Grid, Borderless) */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
            {/* Article Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-24 h-6 bg-slate-100/80 rounded-[4px]" />
                <div className="w-20 h-6 bg-slate-100/80 rounded-[4px]" />
              </div>
              <div className="w-3/4 h-10 bg-slate-100/80 rounded-[8px]" />
              <div className="flex items-center gap-4">
                <div className="w-32 h-4 bg-slate-100/80 rounded-[4px]" />
                <div className="w-24 h-4 bg-slate-100/80 rounded-[4px]" />
              </div>
              <div className="w-full h-64 bg-slate-100/70 rounded-[14px]" />
              <div className="space-y-3">
                <div className="w-full h-4 bg-slate-100/80 rounded-[4px]" />
                <div className="w-full h-4 bg-slate-100/80 rounded-[4px]" />
                <div className="w-4/5 h-4 bg-slate-100/80 rounded-[4px]" />
              </div>
            </div>

            {/* Sidebar Column (4 Cols) */}
            <div className="hidden lg:block lg:col-span-4 space-y-4">
              <div className="bg-slate-100/70 rounded-[14px] p-6 space-y-4">
                <div className="w-36 h-5 bg-slate-200/70 rounded-[4px]" />
                <div className="space-y-2.5">
                  <div className="w-full h-4 bg-slate-200/60 rounded-[4px]" />
                  <div className="w-5/6 h-4 bg-slate-200/60 rounded-[4px]" />
                  <div className="w-4/5 h-4 bg-slate-200/60 rounded-[4px]" />
                </div>
              </div>
            </div>
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

                    {section.paragraphs && section.paragraphs.length > 0 && (
                      <div className="space-y-2.5">
                        {section.paragraphs.map((p, pIdx) => (
                          <SmartParagraph key={pIdx} text={p} />
                        ))}
                      </div>
                    )}

                    {/* Integrated Per-Point Media Block (Clean Canvas Layout, No Frame) */}
                    {section.items && section.items.length > 0 && (
                      <div className="space-y-6 my-4">
                        {section.items.map((item, i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex items-start gap-2.5 pl-0.5">
                              <span className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-1.5 rounded-[6px] bg-[#E8E7FF] text-[#2563EB] text-xs font-bold shrink-0 mt-0.5 select-none shadow-2xs">
                                {item.number ?? i + 1}
                              </span>
                              <div className="flex-1 text-xs md:text-sm text-[#4A4A4A] leading-relaxed">
                                {item.title ? (
                                  <>
                                    <strong className="font-bold text-[#1E1E1E]">{item.title}: </strong>
                                    <span>{item.text}</span>
                                  </>
                                ) : (
                                  <span>{item.text}</span>
                                )}
                              </div>
                            </div>

                            {item.imageUrl && (
                              <div className="space-y-1.5 pl-0 sm:pl-9">
                                <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-[12px] overflow-hidden border border-[#ECECEC] bg-gray-50 shadow-2xs">
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.title || item.imageCaption || "Ilustrasi Materi"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                {item.imageCaption && (
                                  <p className="text-[11px] text-[#737373] italic">
                                    {item.imageCaption}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Highlight / Callout Box (Blue sleek card without title) */}
                    {section.callout && (
                      <div className="my-3 p-4 rounded-[12px] bg-[#F6F5FF] border border-[#E8E7FF] text-[#2563EB] text-xs md:text-sm leading-relaxed flex items-start gap-3 shadow-2xs">
                        <div className="w-1.5 self-stretch bg-[#2563EB] rounded-full shrink-0" />
                        <p className="text-[#3A3985] font-medium leading-relaxed flex-1">
                          {section.callout}
                        </p>
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
