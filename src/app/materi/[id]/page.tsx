'use client';

import { useState, useEffect, use, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sprout, Zap, Trophy } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAdminStore } from "@/lib/admin-store";
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
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { recordModuleCompletion } from "@/services/weekly-target.service";
import { addUserNotification } from "@/services/notification.service";

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
  text?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface ContentSection {
  id: string;
  title: string;
  elements?: any[];
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
  7: {
    id: 7,
    subject: "Bimbingan Konseling",
    title: "Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!",
    level: "Pemula",
    duration: "30 Menit",
    author: "Dinda Riestia",
    updatedAt: "21 Agustus 2026",
    icon: UserGroupIcon,
    topics: ["Prokrastinasi", "Penyebab & Dampak", "Self-Management", "Dukungan Kelompok"],
    description: "Memahami pengertian prokrastinasi, penyebab dan dampaknya, serta penerapan strategi self-management dan simulasi Buaya Gigitan untuk konsisten belajar.",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 7.1: Pengelolaan Diri (Self-Management) dan Konsistensi Belajar Remaja.",
    contentSections: [
      {
        id: "pengertian-prokrastinasi",
        title: "Pengertian Prokrastinasi (Kebiasaan Menunda)",
        paragraphs: [
          "Prokrastinasi adalah kecenderungan menunda-nunda untuk memulai atau menyelesaikan suatu tugas, meskipun individu menyadari bahwa penundaan tersebut dapat menimbulkan konsekuensi yang kurang baik bagi dirinya. Prokrastinasi bukan sekadar malas, melainkan pola perilaku yang seringkali berkaitan dengan kesulitan mengelola waktu, prioritas, dan dorongan diri sendiri.",
        ],
        callout: "Prokrastinasi bukan sekadar malas, melainkan pola perilaku yang seringkali berkaitan dengan kesulitan mengelola waktu, prioritas, dan dorongan diri sendiri.",
      },
      {
        id: "penyebab-umum-prokrastinasi",
        title: "Penyebab Umum Prokrastinasi",
        paragraphs: [
          "Beberapa penyebab umum mengapa seseorang melakukan prokrastinasi antara lain:\n1. Kesulitan memulai karena tugas terasa berat atau membosankan.\n2. Mudah teralihkan oleh distraksi (gawai, media sosial, obrolan, dll).\n3. Belum terbiasa menyusun prioritas saat banyak tugas menumpuk.\n4. Merasa masih ada banyak waktu sehingga menunda hingga mendekati tenggat.\n5. Kurangnya dukungan atau pengingat dari lingkungan sekitar.",
        ],
      },
      {
        id: "dampak-prokrastinasi",
        title: "Dampak Prokrastinasi",
        paragraphs: [
          "Menunda pekerjaan menimbulkan dampak nyata terhadap performa akademik dan psikologis:\n1. Kualitas hasil pekerjaan menurun karena dikerjakan terburu-buru.\n2. Menimbulkan stres dan tekanan menjelang tenggat waktu.\n3. Menurunkan kepercayaan orang lain (guru, teman kelompok) terhadap komitmen kita.\n4. Jika berulang, dapat menjadi kebiasaan yang menghambat performa belajar dan bekerja di masa depan.",
        ],
      },
      {
        id: "konsep-manfaat-self-management",
        title: "Konsep dan Manfaat Self-Management",
        paragraphs: [
          "Self-management (manajemen diri) adalah kemampuan mengatur pikiran, perasaan, dan perilaku diri sendiri secara sadar untuk mencapai tujuan yang diinginkan, termasuk dalam hal disiplin belajar. Dengan self-management yang baik, seseorang lebih mampu menahan dorongan untuk menunda, menyusun prioritas, dan tetap konsisten menjalankan rencana yang telah dibuat.",
        ],
        callout: "Dengan self-management yang baik, seseorang lebih mampu menahan dorongan untuk menunda, menyusun prioritas, dan tetap konsisten menjalankan rencana yang telah dibuat.",
      },
      {
        id: "strategi-mengatasi-distraksi",
        title: "Strategi Mengatasi Distraksi dan Menyusun Prioritas",
        paragraphs: [
          "a. Kenali distraksi utamamu, sadari hal-hal yang paling sering mengalihkan perhatian.\nb. Batasi akses ke distraksi, misalnya menjauhkan gawai saat mengerjakan tugas penting.\nc. Susun prioritas, kerjakan tugas dengan tenggat terdekat atau tingkat kesulitan tertinggi lebih dulu.\nd. Pecah tugas besar jadi langkah kecil, supaya tidak terasa berat untuk dimulai.\ne. Beri jeda dan reward, istirahat sejenak dan hargai diri sendiri setelah menyelesaikan bagian tugas.",
        ],
      },
      {
        id: "pentingnya-dukungan-kelompok",
        title: "Pentingnya Dukungan Kelompok",
        paragraphs: [
          "Diskusi dan dukungan dari teman sebaya dapat membantu seseorang lebih terbuka mengenali kebiasaan menundanya, saling mengingatkan, serta saling menguatkan komitmen untuk berubah. Suasana kelompok yang suportif dan tidak menghakimi membuat peserta didik lebih nyaman berbagi pengalaman personal terkait kebiasaan belajarnya.",
        ],
      },
    ],
    stepByStepSection: {
      title: "Step by Step Bimbingan Kelompok: Praktik Buaya Gigitan",
      description: "Tahapan alur bimbingan kelompok dan refleksi pemecahan masalah prokrastinasi:",
      steps: [
        {
          stepNumber: 1,
          title: "Memahami Orientasi Masalah (C2)",
          text: "Peserta didik menyimak penjelasan Guru BK tentang pengertian prokrastinasi dan kaitannya dengan manajemen diri (self-management), serta memperhatikan contoh cara bermain Buaya Gigitan dan mekanisme amplop pertanyaan yang diperagakan Guru BK.",
        },
        {
          stepNumber: 2,
          title: "Mengaplikasi Permainan Buaya Gigitan (C3)",
          text: "Kelompok duduk melingkar mengelilingi mainan Buaya Gigitan yang diletakkan di tengah. Peserta didik menekan salah satu gigi buaya secara bergiliran searah jarum jam.",
        },
        {
          stepNumber: 3,
          title: "Mekanisme Amplop Pertanyaan (C4)",
          text: "Jika tekanan seorang peserta didik menyebabkan mulut buaya menutup (“tergigit”), peserta didik tersebut wajib mengambil 1 amplop dari tumpukan amplop pertanyaan dan menjawabnya di hadapan kelompok.",
        },
        {
          stepNumber: 4,
          title: "Feedback & Solusi Teman Sebaya (C6)",
          text: "Setelah peserta didik selesai menjawab, seluruh anggota kelompok lain wajib secara bergiliran: (a) memberikan feedback/tanggapan atas jawaban yang disampaikan, (b) menceritakan pengalaman serupa yang pernah mereka alami terkait situasi yang sama, dan (c) memberikan saran atau cara untuk keluar dari situasi tersebut kepada anggota yang menjawab.",
        },
        {
          stepNumber: 5,
          title: "Pencatatan LKPD & Rotasi Giliran",
          text: "Peserta didik yang menjawab maupun yang memberi tanggapan mencatat poin-poin penting dari sesi tersebut ke dalam LKPD pada baris giliran yang sesuai. Guru BK mereset mainan Buaya Gigitan dan permainan berlanjut hingga seluruh anggota kelompok mendapat giliran menjawab minimal 1 kali.",
        },
        {
          stepNumber: 6,
          title: "Fasilitasi & Pemerataan Diskusi",
          text: "Jika hingga separuh waktu diskusi berjalan masih ada anggota yang belum pernah “tergigit”, Guru BK mengarahkan giliran khusus agar anggota tersebut tetap mendapat kesempatan mengambil amplop dan menjawab, memastikan tiap sesi tanya-jawab dan feedback berlangsung mendalam namun tetap suportif dan tidak menghakimi.",
        },
        {
          stepNumber: 7,
          title: "Kartu Komitmenku & Penguatan (A4, P3)",
          text: "Peserta didik mengisi bagian “Kartu Komitmenku” pada LKPD: menuliskan 1 kebiasaan yang ingin diubah dan 1 langkah pertama yang akan dilakukan minggu ini dengan mempertimbangkan saran-saran yang diterima, membacakan secara sukarela, serta menerima penguatan komitmen dari Guru BK.",
        },
      ],
    },
    attachment: {
      fileName: "RPL_Bimbingan_Kelompok_Self_Management.pdf",
      fileSize: "1.8 MB",
    },
    quizSource: {
      type: "internal",
      title: "Evaluasi Bimbingan Konseling",
      description: "Uji pemahaman materi self-management dan strategi mengatasi prokrastinasi.",
      internalUrl: "/kuis/7",
    },
    prevMaterial: { id: 6, title: "Pemrograman Dasar Arduino & Sensor" },
    nextMaterial: { id: 8, title: "Talent Quest: Temukan Potensimu, Kembangkan Dirimu!" },
  },

  8: {
    id: 8,
    subject: "Bimbingan Konseling",
    title: "Talent Quest: Temukan Potensimu, Kembangkan Dirimu!",
    level: "Pemula",
    duration: "35 Menit",
    author: "Dinda Riestia",
    updatedAt: "22 Agustus 2026",
    icon: UserGroupIcon,
    topics: ["Potensi Diri", "Ragam Potensi", "Strength-Based", "Talent Quest Board"],
    description: "Mengenal dan mengembangkan potensi diri melalui pendekatan strength-based, refleksi personal, dan simulasi permainan edukatif Talent Quest.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 8.1: Eksplorasi Potensi Diri dan Pendekatan Strength-Based Peserta Didik.",
    contentSections: [
      {
        id: "pengertian-potensi-diri",
        title: "Pengertian Potensi Diri",
        paragraphs: [
          "Potensi diri adalah kemampuan, kekuatan, minat, dan karakter positif yang dimiliki seseorang, baik yang sudah terlihat maupun yang masih perlu ditemukan dan dikembangkan. Setiap individu memiliki potensi yang berbeda sehingga tidak perlu membandingkan kelebihan diri dengan orang lain.",
          "Dalam pendekatan strength-based, individu diarahkan untuk mengenali dan menggunakan kekuatan yang dimilikinya sebagai modal untuk berkembang. Penelitian menunjukkan bahwa penggunaan kekuatan personal berkaitan dengan meningkatnya self-esteem, vitalitas, dan pengalaman positif (Govindji & Linley, 2011).",
        ],
        callout: "Dalam pendekatan strength-based, individu diarahkan untuk mengenali dan menggunakan kekuatan yang dimilikinya sebagai modal untuk berkembang.",
      },
      {
        id: "ragam-potensi-diri",
        title: "Ragam Potensi Diri",
        paragraphs: [
          "Potensi dapat muncul dalam berbagai bidang kehidupan, antara lain:\n• Akademik/Belajar: memahami materi, berpikir kritis, memecahkan masalah, dan belajar hal baru.\n• Sosial/Emosional: berkomunikasi, bekerja sama, memahami orang lain, dan mengelola emosi.\n• Kreatif/Fisik: membuat karya, menghasilkan ide, menggunakan keterampilan praktik, olahraga, atau aktivitas fisik lainnya.",
        ],
      },
      {
        id: "pentingnya-mengenali-potensi-diri",
        title: "Pentingnya Mengenali Potensi Diri",
        paragraphs: [
          "Mengenali potensi membantu peserta didik:\n1. Meningkatkan kesadaran dan kepercayaan diri;\n2. Mengurangi kebiasaan membandingkan diri secara negatif dengan orang lain;\n3. Mengetahui kemampuan yang dapat dikembangkan; dan\n4. Membantu menentukan arah pengembangan diri serta masa depan.",
        ],
      },
      {
        id: "cara-mengenali-mengembangkan-potensi",
        title: "Cara Mengenali dan Mengembangkan Potensi",
        paragraphs: [
          "Potensi dapat ditemukan melalui:\n• Refleksi: mengingat pengalaman atau kegiatan yang pernah dilakukan dengan baik.\n• Feedback: meminta pendapat positif dari teman, guru, atau orang terdekat.\n• Eksplorasi: mencoba kegiatan baru untuk menemukan minat dan kemampuan.\n• Latihan: mengembangkan kemampuan secara konsisten.\n• Tindak lanjut: menentukan satu langkah kecil untuk menggunakan dan mengembangkan potensi tersebut.",
        ],
        callout: 'Ingat: "Belum menemukan kelebihanmu bukan berarti kamu tidak punya potensi. Bisa jadi kamu belum cukup banyak mencoba."',
      },
    ],
    stepByStepSection: {
      title: "Step by Step Bimbingan Klasikal: Permainan Talent Quest",
      description: "Alur simulasi permainan kelompok Talent Quest untuk mengenali potensi diri:",
      steps: [
        {
          stepNumber: 1,
          title: "Orientasi & Pembagian Kelompok",
          text: "Peserta didik memperhatikan penjelasan Guru BK terkait topik potensi diri dan aturan permainan Talent Quest. Peserta didik dibagi ke dalam kelompok kecil (4–5 orang), tiap kelompok memilih 1 warna token dan menentukan urutan giliran anggota (nomor 1, 2, 3, dst).",
        },
        {
          stepNumber: 2,
          title: "Giliran Bermain & Melempar Dadu",
          text: "Kelompok bermain secara bergiliran (kelompok 1, kelompok 2, dst): 1 wakil kelompok sesuai urutan maju ke depan, melempar dadu, dan menjalankan token kelompoknya di papan sesuai jumlah mata dadu.",
        },
        {
          stepNumber: 3,
          title: "Pengambilan Kartu Refleksi Sesuai Warna",
          text: "Wakil kelompok melihat warna kotak yang didarati, lalu mengambil 1 kartu dari tumpukan yang sesuai warna tersebut (Abu-abu/Kuning/Hijau/Merah), kecuali kotak Diamond yang tidak memerlukan pengambilan kartu apa pun.",
        },
        {
          stepNumber: 4,
          title: "Menjawab Pertanyaan Reflektif (Abu-abu, Kuning, Hijau)",
          text: "Jika kartu berwarna Abu-abu, Kuning, atau Hijau: wakil kelompok membacakan pertanyaan reflektif ke kelompoknya dan menjawabnya secara individu di Lembar Jawaban Pribadi (anggota lain boleh menambahkan masukan positif, namun yang menjawab & menulis tetap si wakil).",
        },
        {
          stepNumber: 5,
          title: "Tantangan Kelompok / Dare (Merah)",
          text: "Jika kartu berwarna Merah: seluruh kelompok bersama-sama melaksanakan tantangan kelompok (dare) yang tertulis di kartu, dipimpin oleh wakil yang mengambil kartu tersebut.",
        },
        {
          stepNumber: 6,
          title: "Aturan Kotak Khusus (Diamond, Tangga, & Ular)",
          text: "Jika mendarat di kotak Diamond: peserta didik tidak mendapat pertanyaan/tantangan apa pun, token tetap di tempat, dan giliran langsung berpindah. Jika kotak memiliki tanda tangga atau ular: peserta didik tetap menjawab/melaksanakan kartu sesuai warna kotak terlebih dahulu, baru setelah itu token naik (tangga) atau turun (ular) ke kotak tujuan.",
        },
        {
          stepNumber: 7,
          title: "Rotasi Ronde & Pengumuman Pemenang",
          text: "Pada ronde berikutnya, giliran maju berpindah ke anggota bernomor urut selanjutnya. Permainan berhenti setelah jumlah ronde yang disepakati habis; Guru BK mengumumkan kelompok dengan token terjauh sebagai pemenang disertai apresiasi.",
        },
        {
          stepNumber: 8,
          title: "Lembar Refleksi Akhir & Penguatan",
          text: "Peserta didik mengisi Lembar Refleksi Akhir secara individu: menuliskan potensi diri (dari domain apa pun) yang paling ia banggakan dari hasil bermain, serta 1 rencana sederhana untuk mengembangkannya. Guru BK mengarahkan peserta didik mengaitkan hasil permainan dengan pemahaman baru tentang potensi dirinya secara menyeluruh.",
        },
      ],
    },
    attachment: {
      fileName: "Materi_Klasikal_Talent_Quest_BK.pdf",
      fileSize: "2.3 MB",
    },
    quizSource: {
      type: "internal",
      title: "Evaluasi Potensi Diri",
      description: "Kuis refleksi pemahaman potensi dan arah pengembangan diri.",
      internalUrl: "/kuis/8",
    },
    prevMaterial: { id: 7, title: "Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!" },
    nextMaterial: { id: 16, title: "Jati Diri Tanpa Kenakalan" },
  },

  16: {
    id: 16,
    subject: "Bimbingan Konseling",
    title: "Jati Diri Tanpa Kenakalan",
    level: "Menengah",
    duration: "40 Menit",
    author: "Dinda Riestia",
    updatedAt: "23 Agustus 2026",
    icon: UserGroupIcon,
    topics: ["Jati Diri Remaja", "Bentuk Kenakalan", "Norma Pergaulan", "Peer Pressure", "Mind Mapping"],
    description: "Memahami pembentukan jati diri remaja, menyelaraskan norma pergaulan teman sebaya, mengatasi peer pressure, dan studi kasus problem-based learning.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 16.1: Menjaga Jati Diri Positif dan Solidaritas Sehat dalam Pergaulan Remaja.",
    contentSections: [
      {
        id: "pengertian-jati-diri",
        title: "Pengertian Jati Diri",
        paragraphs: [
          "Jati diri adalah keseluruhan ciri khas, nilai, dan prinsip yang dipegang seseorang sehingga membedakannya dari orang lain, sekaligus menjadi pedoman dalam bersikap dan bertindak. Pada masa remaja, pencarian jati diri berlangsung sangat intens, salah satunya melalui interaksi dan pergaulan dengan teman sebaya.",
          "Remaja yang memiliki jati diri kuat akan lebih mampu bertahan pada nilai-nilai yang diyakininya meskipun mendapat tekanan dari lingkungan pergaulan.",
        ],
        callout: "Remaja yang memiliki jati diri kuat akan lebih mampu bertahan pada nilai-nilai yang diyakininya meskipun mendapat tekanan dari lingkungan pergaulan.",
      },
      {
        id: "pengertian-bentuk-kenakalan",
        title: "Pengertian dan Bentuk-Bentuk Kenakalan Remaja",
        paragraphs: [
          "Kenakalan remaja adalah perilaku menyimpang yang dilakukan remaja dan melanggar norma sosial, norma sekolah, maupun norma hukum, seringkali dipicu oleh tekanan untuk diterima dalam kelompok pergaulan.",
          "Bentuk-bentuk kenakalan remaja yang umum dijumpai antara lain:\n• Membolos atau menyontek secara masif karena ikut-ikutan teman.\n• Mengucilkan atau merundung (bullying) teman yang dianggap berbeda.\n• Terlibat tawuran atau perkelahian kelompok.\n• Merokok, konsumsi minuman keras, atau zat terlarang karena ajakan kelompok.\n• Melanggar tata tertib sekolah demi solidaritas semu dengan kelompok pergaulan.",
        ],
      },
      {
        id: "norma-pergaulan-teman-sebaya",
        title: "Norma-Norma Pergaulan Teman Sebaya",
        paragraphs: [
          "Norma pergaulan adalah aturan tidak tertulis yang mengatur bagaimana seseorang seharusnya bersikap dalam suatu kelompok pertemanan. Norma ini dapat berbeda-beda antarkelompok, tergantung latar belakang budaya, ekonomi, kebiasaan, maupun nilai yang dipegang tiap anggota.",
          "Perbedaan norma inilah yang sering menjadi sumber gesekan ketika seseorang bergaul dengan teman-teman dari latar belakang yang beragam.",
        ],
      },
      {
        id: "menyelaraskan-norma-diri",
        title: "Menyelaraskan Norma Diri dengan Norma Pergaulan yang Beragam",
        paragraphs: [
          "• Kenali norma dan nilai yang kamu pegang sebagai bagian dari jati dirimu.\n• Kenali dan pahami norma yang dianut lingkungan pergaulan, meskipun berbeda dari norma pribadi.\n• Pilah mana perbedaan yang bisa ditoleransi dan mana yang bertentangan dengan nilai/prinsip diri.\n• Komunikasikan batasanmu secara jujur dan tegas, tanpa harus memutus hubungan pertemanan.\n• Cari titik temu, seperti kesamaan minat atau tujuan, untuk membangun kepercayaan dan solidaritas yang sehat.",
        ],
      },
      {
        id: "menyikapi-peer-pressure",
        title: "Menyikapi Tekanan Teman Sebaya (Peer Pressure) Tanpa Kehilangan Jati Diri",
        paragraphs: [
          "• Sadari bahwa menolak ajakan yang merugikan bukan berarti tidak setia kawan.\n• Latih keberanian mengatakan “tidak” dengan cara yang tetap menghargai teman.\n• Cari dukungan dari teman atau orang dewasa yang memiliki nilai sejalan denganmu.\n• Ingat kembali tujuan dan cita-citamu setiap kali mendapat tekanan untuk melakukan hal yang bertentangan dengan nilai dirimu.\n• Bangun pertemanan yang saling menguatkan, bukan yang membuatmu harus mengorbankan jati diri demi diterima.",
        ],
        callout: "Bangun pertemanan yang saling menguatkan, bukan yang membuatmu harus mengorbankan jati diri demi diterima.",
      },
    ],
    stepByStepSection: {
      title: "Step by Step Bimbingan: Problem Based Learning & Mind Mapping",
      description: "Alur studi kasus dan perumusan pemecahan masalah kenakalan remaja:",
      steps: [
        {
          stepNumber: 1,
          title: "Memahami Orientasi Masalah (C2)",
          text: "Guru BK menayangkan/membagikan lembar studi kasus mengenai fenomena pergaulan teman sebaya yang mengarah pada kenakalan remaja. Peserta didik menyimak dan mengidentifikasi masalah utama, norma yang dilanggar, serta latar belakang perbedaan yang memicu konflik dalam kasus tersebut.",
        },
        {
          stepNumber: 2,
          title: "Organisasi Belajar & Pembagian Kelompok (C4, P3)",
          text: "Peserta didik dibagi ke dalam kelompok kecil (4–5 orang). Tiap kelompok mendiskusikan studi kasus: mengidentifikasi norma yang dilanggar tokoh, latar belakang perbedaan yang memicu tekanan dari teman sebaya, serta dampaknya terhadap jati diri tokoh dalam kasus.",
        },
        {
          stepNumber: 3,
          title: "Perumusan Solusi Alternatif",
          text: "Tiap kelompok merumuskan alternatif solusi/cara menyelaraskan norma pergaulan yang beragam tanpa harus terjerumus pada kenakalan, berdasarkan hasil diskusi kelompok.",
        },
        {
          stepNumber: 4,
          title: "Penuangan ke Dalam Mind Map",
          text: "Tiap kelompok menuangkan hasil identifikasi masalah, analisis, dan solusi ke dalam Mind Map pada kertas plano/HVS yang telah disediakan, menggunakan LKPD sebagai panduan cabang utama, namun bebas menambahkan cabang, gambar, simbol, atau warna sesuai kreativitas kelompok.",
        },
        {
          stepNumber: 5,
          title: "Bimbingan & Scaffolding Guru BK",
          text: "Guru BK berkeliling membimbing dan memberi scaffolding pada tiap kelompok selama proses diskusi maupun saat menyusun mind map.",
        },
        {
          stepNumber: 6,
          title: "Presentasi & Evaluasi Pemecahan Masalah (A4, P3)",
          text: "Tiap kelompok mempresentasikan mind map yang telah dibuat secara singkat di depan kelas. Kelompok lain diberi kesempatan menanggapi, bertanya, atau menambahkan pendapat setelah presentasi.",
        },
        {
          stepNumber: 7,
          title: "Penguatan Konsep & Refleksi Individu",
          text: "Guru BK memberikan penguatan dan meluruskan konsep pada tiap hasil presentasi kelompok. Peserta didik merefleksikan secara individu norma pergaulan sehat apa yang akan mereka terapkan mulai sekarang, dituliskan pada bagian refleksi di LKPD.",
        },
      ],
    },
    attachment: {
      fileName: "RPL_Klasikal_Jati_Diri_Tanpa_Kenakalan.pdf",
      fileSize: "2.0 MB",
    },
    quizSource: {
      type: "internal",
      title: "Evaluasi Jati Diri Remaja",
      description: "Uji pemahaman menghadapi peer pressure dan menjaga prinsip diri.",
      internalUrl: "/kuis/16",
    },
    prevMaterial: { id: 8, title: "Talent Quest: Temukan Potensimu, Kembangkan Dirimu!" },
    nextMaterial: { id: 17, title: "Membangun Konsep Diri Positif" },
  },

  17: {
    id: 17,
    subject: "Bimbingan Konseling",
    title: "Membangun Konsep Diri Positif",
    level: "Pemula",
    duration: "30 Menit",
    author: "Erintan Tsuraya Rahadatul'Aisy",
    updatedAt: "24 Agustus 2026",
    icon: UserGroupIcon,
    topics: ["Pengertian Konsep Diri", "Self-Image", "Self-Esteem", "Ideal Self", "Faktor Pembentuk"],
    description: "Memahami konsep diri remaja, 3 komponen utama (self-image, self-esteem, ideal self), faktor lingkungan, serta aktivitas refleksi diri telapak tangan.",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 17.1: Pembentukan Konsep Diri Positif dan Eksplorasi Kepribadian Remaja.",
    contentSections: [
      {
        id: "pengertian-konsep-diri",
        title: "Pengertian Konsep Diri",
        paragraphs: [
          "Konsep diri adalah cara seseorang memandang, memahami, dan menilai dirinya sendiri. Konsep diri terbentuk dari pengalaman, interaksi sosial, serta bagaimana seseorang menafsirkan berbagai pengalaman tersebut. Hapsari et al. (2023) menjelaskan bahwa konsep diri merupakan persepsi seseorang terhadap dirinya yang terbentuk melalui pengalaman dan interpretasi terhadap lingkungan. Konsep diri juga dapat menjadi sumber motivasi dan membantu seseorang mengorganisasi pengalaman hidupnya.",
          "Pada masa remaja, konsep diri menjadi semakin penting karena individu mengalami berbagai perubahan fisik, sosial, emosional, dan akademik. Crone et al. (2022) menjelaskan bahwa perkembangan konsep diri pada masa remaja mengalami perubahan yang berkaitan dengan evaluasi diri, pengambilan perspektif, dan perbandingan sosial. Perubahan tersebut dapat menjadi tantangan sekaligus kesempatan untuk mengembangkan pemahaman diri yang lebih positif.",
        ],
        callout: "Konsep diri merupakan persepsi seseorang terhadap dirinya yang terbentuk melalui pengalaman dan interpretasi terhadap lingkungan, sekaligus menjadi sumber motivasi hidup.",
      },
      {
        id: "komponen-konsep-diri",
        title: "Komponen Konsep Diri",
        paragraphs: [
          "Dalam materi ini, konsep diri terdiri dari tiga komponen utama:",
          "a. Self-Image (Gambaran Diri)\nSelf-image adalah bagaimana seseorang memandang atau menggambarkan dirinya sendiri, termasuk pandangan terhadap karakteristik, kemampuan, penampilan, serta berbagai aspek yang dianggap melekat pada dirinya. McMullen (2020) menjelaskan bahwa self-image berkaitan dengan bagaimana individu melihat dirinya dan terdiri atas berbagai sikap, pendapat, serta ideal mengenai diri.\nHal ini dapat mencakup:\n• bagaimana seseorang melihat kondisi fisiknya;\n• kemampuan yang dimiliki;\n• sifat dan kepribadian;\n• kemampuan berinteraksi dengan orang lain;\n• peran yang dimiliki di keluarga, sekolah, maupun lingkungan sosial.\nContoh: \"Saya orang yang cukup ramah, tetapi saya masih gugup ketika berbicara di depan banyak orang.\"",
          "b. Self-Esteem (Harga Diri)\nSelf-esteem adalah penilaian atau perasaan seseorang terhadap nilai dan keberhargaan dirinya. Jadi, jika self-image lebih berkaitan dengan bagaimana seseorang melihat dirinya, self-esteem berkaitan dengan bagaimana seseorang menilai dan menghargai dirinya berdasarkan gambaran tersebut. Calhoun (1977) membedakan self-esteem dari self-concept dengan menjelaskan self-esteem sebagai kepuasan individu terhadap konsep dirinya. Morin (2017) juga menempatkan self-esteem sebagai bagian dari self-views, yaitu aspek yang berkaitan dengan isi pandangan dan perasaan seseorang mengenai dirinya.\nContoh self-esteem yang sehat:\n• berani mencoba meskipun belum yakin hasilnya sempurna;\n• mampu menerima kritik;\n• tidak langsung menganggap kegagalan sebagai bukti bahwa dirinya tidak mampu;\n• menghargai usaha yang telah dilakukan.\nReview sistematis Hapsari et al. (2023) juga menunjukkan bahwa konsep diri merupakan konstruk yang multidimensional sehingga perlu dipahami secara menyeluruh.",
          "c. Ideal Self (Diri Ideal)\nIdeal self adalah gambaran mengenai diri yang diinginkan atau ingin dicapai seseorang di masa depan. Ideal self berisi harapan, aspirasi, karakteristik, atau kualitas yang ingin dimiliki individu. Dalam kajian mengenai ideal self, Boyatzis dan kolega menjelaskan ideal self sebagai gambaran tentang versi diri masa depan yang paling diinginkan, yang berkaitan dengan nilai, tujuan, harapan, dan aspirasi seseorang. Sementara itu, Endo (1987) mendefinisikan ideal self sebagai struktur kognitif yang memuat representasi mengenai keadaan diri yang diinginkan dan tidak diinginkan.\nContohnya:\n• ingin menjadi lebih percaya diri;\n• ingin menjadi siswa yang disiplin;\n• ingin mampu berbicara di depan umum;\n• ingin memiliki hubungan sosial yang lebih baik;\n• ingin mengembangkan kemampuan tertentu.\nIdeal self dapat menjadi arah untuk berkembang. Namun, tujuan tersebut sebaiknya realistis dan dilakukan secara bertahap.\nContoh:\nKondisi sekarang: \"Saya masih takut presentasi.\"\nDiri ideal: \"Saya ingin mampu melakukan presentasi dengan percaya diri.\"\nLangkah: \"Saya akan berlatih berbicara selama 5–10 menit sebelum presentasi.\"",
        ],
        callout: "Ideal self dapat menjadi arah untuk berkembang secara realistis dan bertahap dari kondisi sekarang menuju versi diri terbaik.",
      },
      {
        id: "faktor-mempengaruhi-konsep-diri",
        title: "Faktor yang Mempengaruhi Konsep Diri",
        paragraphs: [
          "Konsep diri tidak terbentuk hanya dari dalam diri individu. Lingkungan sosial juga memiliki peran penting:",
          "a. Keluarga: Keluarga menjadi tempat pertama seseorang belajar mengenal dirinya. Dukungan, perhatian, penerimaan, dan cara keluarga memberikan kritik dapat membentuk cara seseorang memandang dan menghargai dirinya.\n\nb. Teman Sebaya: Teman sebaya berpengaruh besar pada masa remaja. Dukungan dan penerimaan teman dapat meningkatkan kepercayaan diri, sedangkan penolakan atau ejekan dapat membuat seseorang merasa kurang percaya diri.\n\nc. Guru dan Lingkungan Sekolah: Guru dan lingkungan sekolah membantu siswa mengenali kemampuan, potensi, dan perannya sebagai seorang siswa. Lingkungan sekolah yang aman dan mendukung dapat membantu siswa memiliki pandangan positif terhadap dirinya.\n\nd. Pengalaman Hidup: Berbagai pengalaman, baik keberhasilan maupun kegagalan, dapat membentuk konsep diri. Keberhasilan dapat meningkatkan kepercayaan diri, sedangkan kegagalan dapat menjadi pembelajaran untuk berkembang.\n\ne. Media Sosial: Media sosial dapat memengaruhi cara remaja melihat dan menilai dirinya. Penggunaan yang positif dapat menjadi sumber inspirasi, tetapi terlalu sering membandingkan diri dengan orang lain dapat membuat seseorang merasa kurang percaya diri.",
        ],
      },
    ],
    stepByStepSection: {
      title: "Aktivitas Refleksi & Diskusi Konsep Diri Positif",
      description: "Langkah-langkah refleksi individu metode telapak tangan dan diskusi kelompok:",
      steps: [
        {
          stepNumber: 1,
          title: "Jiplak Telapak Tangan pada Kertas",
          text: "Jiplak telapak tanganmu pada selembar kertas terpisah sebagai media pemetaan konsep diri.",
        },
        {
          stepNumber: 2,
          title: "Isi Jari Jempol (Kelebihan & Kebanggaan)",
          text: "Tuliskan kelebihan atau hal yang paling kamu banggakan dari dalam dirimu.",
        },
        {
          stepNumber: 3,
          title: "Isi Jari Telunjuk (Cita-cita & Tujuan)",
          text: "Tuliskan cita-cita atau tujuan utama yang ingin dan harus kamu capai di masa depan.",
        },
        {
          stepNumber: 4,
          title: "Isi Jari Tengah (Kekurangan yang Ingin Diubah)",
          text: "Tuliskan kekurangan atau kebiasaan kurang baik yang ingin kamu hilangkan secara bertahap.",
        },
        {
          stepNumber: 5,
          title: "Isi Jari Manis (Rasa Syukur)",
          text: "Tuliskan hal-hal berharga apa saja yang paling kamu syukuri dalam perjalanan hidupmu.",
        },
        {
          stepNumber: 6,
          title: "Isi Jari Kelingking (Kebiasaan Kecil Positif)",
          text: "Tuliskan kebiasaan kecil positif yang sering dan konsisten kamu lakukan sehari-hari.",
        },
        {
          stepNumber: 7,
          title: "Diskusi Kelompok Suportif (5-6 Orang)",
          text: "Bentuk kelompok kecil dan diskusikan: (1) momen ketika kamu merasa percaya diri, (2) cara bangkit saat kurang percaya diri, dan (3) satu langkah konkret minggu ini untuk lebih menghargai dirimu.",
        },
      ],
    },
    attachment: {
      fileName: "Materi_Membangun_Konsep_Diri_Positif.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Refleksi Konsep Diri",
      description: "Uji pemahaman dan asesmen konsep diri positif peserta didik.",
      internalUrl: "/kuis/17",
    },
    prevMaterial: { id: 16, title: "Jati Diri Tanpa Kenakalan" },
    nextMaterial: { id: 18, title: "Personal Branding: Membangun Citra Diri Positif" },
  },

  18: {
    id: 18,
    subject: "Bimbingan Konseling",
    title: "Personal Branding: Membangun Citra Diri Positif",
    level: "Pemula",
    duration: "35 Menit",
    author: "Erintan Tsuraya Rahadatul'Aisy",
    updatedAt: "24 Agustus 2026",
    icon: UserGroupIcon,
    topics: ["Personal Branding", "Potensi Diri", "Unsur Branding", "Kesiapan PKL & Kerja"],
    description: "Mengenali keunikan dan potensi diri, membangun citra profesional positif, serta persiapan menghadapi PKL dan dunia kerja bagi siswa SMK.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 18.1: Membangun Identitas Profesional dan Citra Diri Positif Siswa SMK.",
    contentSections: [
      {
        id: "pengertian-personal-branding",
        title: "Pengertian Personal Branding",
        paragraphs: [
          "Personal branding adalah proses seseorang dalam mengenali, mengembangkan, dan menunjukkan kemampuan, karakter, nilai, serta keunikan dirinya sehingga terbentuk kesan tertentu dari orang lain. Personal branding berkaitan dengan bagaimana seseorang mengomunikasikan kompetensi dan karakter dirinya untuk membangun identitas profesional (Kushal & Nargundkar, 2021).",
          "Personal branding tidak hanya berkaitan dengan bagaimana seseorang terlihat, tetapi juga bagaimana ia bersikap, berkomunikasi, bekerja, dan menunjukkan kemampuan secara konsisten. Pengembangan personal branding dapat membantu peserta didik memahami kekuatan dirinya dan menghubungkannya dengan kebutuhan dunia kerja (Alonso-García et al., 2018). Bagi siswa SMK, personal branding penting karena dapat membantu mempersiapkan diri menghadapi PKL, wawancara kerja, dunia kerja, maupun pengembangan karier. Personal branding yang baik dibangun berdasarkan potensi dan karakter diri yang sebenarnya, bukan dengan berpura-pura menjadi orang lain (Kushal & Nargundkar, 2021).",
        ],
        callout: "Personal branding yang baik dibangun berdasarkan potensi dan karakter diri yang sebenarnya secara autentik, bukan dengan berpura-pura menjadi orang lain.",
      },
      {
        id: "tujuan-personal-branding",
        title: "Tujuan Personal Branding",
        paragraphs: [
          "Personal branding bertujuan untuk:\n1. Membantu seseorang mengenali potensi dan keunikan dirinya.\n2. Meningkatkan kepercayaan diri.\n3. Membantu seseorang menunjukkan kemampuan secara positif.\n4. Membangun kesan positif di lingkungan sekolah maupun kerja.\n5. Meningkatkan kemampuan berkomunikasi dan berinteraksi.\n6. Mendukung kesiapan menghadapi PKL dan dunia kerja.\n7. Membantu menentukan arah pengembangan diri dan karier.",
          "Pengembangan personal branding dalam pembelajaran dapat membantu peserta didik melakukan refleksi terhadap kemampuan dirinya, memahami kekuatan yang dimiliki, serta belajar mengkomunikasikan kompetensi kepada lingkungan profesional (Kushal & Nargundkar, 2021).",
        ],
      },
      {
        id: "mengenali-potensi-diri",
        title: "Mengenali Potensi Diri",
        paragraphs: [
          "Potensi diri adalah kemampuan, kekuatan, minat, atau bakat yang dimiliki seseorang dan masih dapat dikembangkan melalui proses belajar dan pengalaman. Mengenali potensi diri merupakan bagian penting dalam membangun personal branding karena seseorang perlu mengetahui kemampuan, kelebihan, dan karakteristik dirinya sebelum menentukan hal yang ingin ditonjolkan (Building Your Brand, 2016).",
          "Jenis-Jenis Potensi Diri:\n• Potensi intelektual: Kemampuan memahami informasi, berpikir kritis, memecahkan masalah, dan mengambil keputusan.\n• Potensi kreativitas: Kemampuan menghasilkan ide, karya, atau cara baru dalam menyelesaikan sesuatu.\n• Potensi komunikasi: Kemampuan menyampaikan pendapat dan informasi serta membangun hubungan dengan orang lain.\n• Potensi kepemimpinan: Kemampuan mengarahkan, mengorganisasi, mengambil keputusan, dan bertanggung jawab terhadap kelompok.\n• Potensi sosial: Kemampuan bekerja sama, berempati, menghargai orang lain, dan beradaptasi dengan lingkungan.\n• Potensi keterampilan: Kemampuan melakukan pekerjaan tertentu, seperti desain, pemrograman, editing, administrasi, teknik, tata boga, dan keterampilan sesuai bidang keahlian.",
        ],
      },
      {
        id: "cara-mengenali-potensi-diri",
        title: "Cara Mengenali Potensi Diri",
        paragraphs: [
          "Untuk mengenali potensi diri, peserta didik dapat melakukan beberapa hal berikut:\n1. Mengenali hal yang disukai: Perhatikan kegiatan yang membuat diri merasa tertarik dan bersemangat.\n2. Mengidentifikasi kemampuan: Tuliskan hal-hal yang dapat dilakukan dengan baik.\n3. Mengingat pengalaman keberhasilan: Perhatikan kegiatan atau tugas yang pernah berhasil dilakukan.\n4. Meminta umpan balik: Tanyakan kepada guru, teman, atau keluarga mengenai kelebihan yang mereka lihat.\n5. Mencoba berbagai kegiatan: Pengalaman baru dapat membantu menemukan kemampuan yang sebelumnya belum diketahui.\n6. Mengevaluasi diri: Tentukan kemampuan yang sudah dimiliki dan kemampuan yang masih perlu dikembangkan.",
        ],
      },
      {
        id: "unsur-personal-branding",
        title: "Unsur-Unsur Personal Branding",
        paragraphs: [
          "Personal branding dapat dibangun melalui beberapa unsur berikut:\n1. Kemampuan: Kemampuan menjadi salah satu dasar dalam menunjukkan keunikan diri. Kompetensi yang dimiliki perlu dikembangkan dan dikomunikasikan agar dapat diketahui oleh orang lain (Kushal & Nargundkar, 2021).\n2. Karakter: Karakter seperti jujur, disiplin, bertanggung jawab, dan dapat dipercaya akan mempengaruhi kesan orang lain terhadap diri seseorang.\n3. Komunikasi: Cara berbicara, mendengarkan, menyampaikan pendapat, dan berinteraksi menjadi bagian penting dalam membangun personal branding. Kemampuan mengkomunikasikan keterampilan juga menjadi bagian dari kesiapan menghadapi dunia kerja (Kushal & Nargundkar, 2021).\n4. Penampilan yang Sesuai: Penampilan yang bersih, rapi, dan sesuai dengan situasi dapat menunjukkan kesiapan dan profesionalitas.\n5. Sikap: Sikap sopan, menghargai orang lain, terbuka terhadap masukan, dan mampu bekerja sama dapat membantu membentuk kesan positif.\n6. Konsistensi: Personal branding tidak terbentuk hanya dalam satu kesempatan. Kesan terhadap seseorang dibangun melalui kemampuan, karakter, dan perilaku yang ditunjukkan secara konsisten (Alonso-García et al., 2018).",
        ],
        callout: "Kesan terhadap seseorang dibangun melalui kemampuan, karakter, komunikasi, dan perilaku yang ditunjukkan secara konsisten.",
      },
      {
        id: "cara-membangun-personal-branding-positif",
        title: "Cara Membangun Personal Branding Positif untuk Siswa SMK",
        paragraphs: [
          "1. Kenali diri sendiri: Ketahui minat, kemampuan, kelebihan, kekurangan, dan nilai yang dimiliki.\n2. Tentukan keunggulan yang ingin dikembangkan: Pilih kemampuan yang sesuai dengan minat dan bidang keahlian.\n3. Terus belajar dan berlatih: Potensi tidak akan berkembang tanpa latihan dan pengalaman.\n4. Tunjukkan kemampuan melalui tindakan: Ikuti kegiatan, proyek, organisasi, PKL, atau aktivitas lain yang dapat menjadi pengalaman.\n5. Bangun komunikasi yang baik: Berbicara dengan jelas, sopan, percaya diri, dan menghargai lawan bicara.\n6. Bangun sikap profesional: Biasakan disiplin, tepat waktu, bertanggung jawab, jujur, dan mampu bekerja sama.\n7. Terima kritik dan evaluasi diri: Evaluasi diri membantu individu mengetahui kekuatan dan aspek yang masih perlu dikembangkan.\n8. Konsisten: Pertahankan perilaku positif dalam berbagai situasi karena personal branding dibangun melalui proses yang berkelanjutan.",
        ],
      },
    ],
    stepByStepSection: {
      title: "Panduan Analisis Kasus Personal Branding",
      description: "Langkah analisis studi kasus persiapan PKL dan dunia industri:",
      steps: [
        {
          stepNumber: 1,
          title: "Identifikasi Potensi & Bakat Utama",
          text: "Identifikasi keahlian teknis dan minat khusus yang kamu kuasai (misal: desain grafis, coding, editing, otomotif).",
        },
        {
          stepNumber: 2,
          title: "Dokumentasikan Portofolio Karya",
          text: "Kumpulkan hasil tugas dan proyek nyata terbaik yang pernah dibuat ke dalam portofolio digital/fisik.",
        },
        {
          stepNumber: 3,
          title: "Latih Komunikasi Artikulatif",
          text: "Latih cara menjelaskan hasil karya dan proses pengerjaannya dengan bahasa yang sopan, runtut, dan percaya diri.",
        },
        {
          stepNumber: 4,
          title: "Kembangkan Sikap Profesional",
          text: "Terapkan disiplin waktu, etika berkomunikasi dengan pembimbing, serta keterbukaan menerima umpan balik.",
        },
      ],
    },
    attachment: {
      fileName: "Materi_Personal_Branding_SMK.pdf",
      fileSize: "2.4 MB",
    },
    quizSource: {
      type: "internal",
      title: "Studi Kasus Personal Branding",
      description: "Analisis situasi Dimas dan uji pemahaman personal branding vokasi.",
      internalUrl: "/kuis/18",
    },
    prevMaterial: { id: 17, title: "Membangun Konsep Diri Positif" },
    nextMaterial: { id: 19, title: "Persiapan Magang dan Etika di Dunia Kerja" },
  },

  19: {
    id: 19,
    subject: "Bimbingan Konseling",
    title: "Persiapan Magang dan Etika di Dunia Kerja",
    level: "Menengah",
    duration: "40 Menit",
    author: "Erintan Tsuraya Rahadatul'Aisy",
    updatedAt: "24 Agustus 2026",
    icon: UserGroupIcon,
    topics: ["Persiapan Magang", "Soft Skills Vokasi", "Etika Kerja", "Tips Profesional"],
    description: "Panduan komprehensif persiapan administratif, keterampilan, mental, dan penampilan serta etika profesional saat magang di industri.",
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 19.1: Kesiapan Siswa SMK Mengikuti Magang dan Penerapan Etika Profesional Industri.",
    contentSections: [
      {
        id: "pengertian-magang-dunia-kerja",
        title: "Pengertian Magang dan Dunia Kerja",
        paragraphs: [
          "Magang merupakan kegiatan pembelajaran yang memberikan kesempatan kepada peserta didik untuk memperoleh pengalaman secara langsung di lingkungan kerja. Melalui magang, peserta didik dapat menerapkan pengetahuan dan keterampilan yang telah dipelajari di sekolah sekaligus mengenal budaya, aturan, dan tuntutan dunia kerja.",
          "Memasuki dunia kerja tidak hanya membutuhkan kemampuan teknis sesuai bidang keahlian, tetapi juga membutuhkan sikap profesional, kemampuan berkomunikasi, tanggung jawab, kedisiplinan, dan kemampuan bekerja sama. Penelitian Brodsky et al. (2024) menunjukkan bahwa pengalaman magang dapat menjadi ruang pembelajaran informal yang membantu peserta memperoleh pengalaman kerja, keterampilan, dan jaringan profesional.",
        ],
        callout: "Magang adalah jembatan emas penerapan kompetensi kejuruan sekaligus pembentukan sikap profesional dan etika kerja nyata.",
      },
      {
        id: "persiapan-sebelum-magang",
        title: "Persiapan Sebelum Magang atau Bekerja",
        paragraphs: [
          "Persiapan sebelum memasuki dunia kerja tidak hanya berkaitan dengan kemampuan teknis, tetapi juga kesiapan diri, kemampuan beradaptasi, dan keterampilan interpersonal. Penelitian pada mahasiswa magang menunjukkan bahwa pengalaman magang dapat berkontribusi terhadap pengembangan self-regulation, self-awareness, dan self-direction (Downs et al., 2024).",
          "Hal-hal yang perlu dipersiapkan antara lain:\n1. Persiapan Administrasi:\n• Menyiapkan dokumen yang diperlukan.\n• Mengetahui lokasi dan jadwal magang.\n• Memahami aturan yang berlaku di tempat magang.\n• Menyiapkan perlengkapan yang dibutuhkan.\n\n2. Persiapan Pengetahuan dan Keterampilan:\n• Memahami kompetensi dasar sesuai jurusan.\n• Mempelajari tugas yang kemungkinan akan diberikan.\n• Menguasai penggunaan alat atau teknologi yang berkaitan dengan pekerjaan.\n• Meningkatkan kemampuan komunikasi dan kerja sama.\n\n3. Persiapan Mental:\n• Memiliki kemauan untuk belajar.\n• Berani bertanya ketika belum memahami tugas.\n• Mampu menerima kritik dan saran.\n• Bersedia beradaptasi dengan lingkungan baru.\n• Tidak mudah menyerah ketika menghadapi kesulitan.\n\n4. Persiapan Penampilan:\n• Berpakaian sesuai ketentuan tempat kerja.\n• Menjaga kebersihan dan kerapian diri.\n• Menggunakan atribut atau perlengkapan kerja sesuai kebutuhan.",
        ],
      },
      {
        id: "soft-skills-dunia-kerja",
        title: "Soft Skills yang Dibutuhkan di Dunia Kerja",
        paragraphs: [
          "Selain hard skills, peserta didik perlu mengembangkan soft skills, yaitu kemampuan yang berkaitan dengan sikap dan cara berinteraksi dengan orang lain:\n1. Komunikasi: mampu menyampaikan informasi dengan jelas dan sopan.\n2. Kerja sama: mampu bekerja bersama orang lain untuk mencapai tujuan.\n3. Manajemen waktu: mampu mengatur waktu dan menyelesaikan tugas sesuai batas waktu.\n4. Problem solving: mampu mencari solusi ketika menghadapi masalah.\n5. Adaptasi: mampu menyesuaikan diri dengan lingkungan dan situasi baru.\n6. Tanggung jawab: mampu menyelesaikan tugas dan menerima konsekuensi dari tindakan.\n7. Inisiatif: memiliki kemauan untuk bertindak dan belajar tanpa selalu menunggu perintah.",
        ],
      },
      {
        id: "etika-dunia-kerja",
        title: "Etika di Dunia Kerja",
        paragraphs: [
          "Etika kerja adalah nilai dan aturan mengenai perilaku yang baik dan tepat ketika berada di lingkungan kerja agar tercipta lingkungan yang profesional, nyaman, dan saling menghargai:\n1. Disiplin: Datang tepat waktu, mengikuti jadwal, dan mematuhi peraturan yang berlaku.\n2. Bertanggung jawab: Menyelesaikan tugas dengan sungguh-sungguh dan tidak mengabaikan pekerjaan.\n3. Sopan dan menghargai orang lain: Menggunakan bahasa yang baik serta menghormati pembimbing, atasan, rekan kerja, dan pihak lainnya.\n4. Jujur: Menyampaikan informasi sesuai keadaan dan tidak mengambil sesuatu yang bukan haknya.\n5. Mau belajar dan menerima kritik: Tidak malu bertanya ketika belum memahami pekerjaan serta menerima masukan sebagai bagian dari proses belajar.\n6. Menjaga komunikasi: Menyampaikan informasi dengan jelas dan memberi tahu pembimbing apabila mengalami kendala.\n7. Menjaga kerahasiaan: Tidak menyebarkan informasi atau dokumen perusahaan yang bersifat rahasia.\n8. Menjaga fasilitas: Menggunakan peralatan kerja dengan baik dan bertanggung jawab.",
        ],
        callout: "Integritas, disiplin waktu, dan kerahasiaan perusahaan merupakan pilar utama etika profesional di dunia industri.",
      },
      {
        id: "perilaku-dihindari",
        title: "Perilaku yang Sebaiknya Dihindari",
        paragraphs: [
          "Beberapa perilaku yang dapat memberikan kesan kurang profesional antara lain:\n1. Datang terlambat tanpa alasan yang jelas.\n2. Bermain HP ketika sedang bekerja tanpa izin.\n3. Mengabaikan instruksi pembimbing.\n4. Menunda-nunda pekerjaan.\n5. Berbicara tidak sopan kepada orang lain.\n6. Menyalahkan orang lain ketika melakukan kesalahan.\n7. Menyebarkan informasi internal perusahaan.\n8. Menggunakan fasilitas tempat kerja secara sembarangan.\n9. Tidak menjaga kebersihan dan kerapian.\n10. Menolak kritik atau masukan.",
        ],
      },
      {
        id: "tips-peserta-magang-profesional",
        title: "Tips Menjadi Peserta Magang yang Profesional",
        paragraphs: [
          "• Sebelum bekerja:\nDatang tepat waktu (10–15 menit lebih awal). Pastikan perlengkapan sudah siap. Ketahui tugas yang harus dilakukan.\n\n• Saat bekerja:\nDengarkan instruksi dengan seksama. Bertanya jika belum memahami tugas. Kerjakan tugas dengan teliti. Jaga komunikasi dan sopan santun. Gunakan HP sesuai aturan perusahaan.\n\n• Setelah bekerja:\nPeriksa kembali hasil pekerjaan. Rapikan peralatan dan tempat kerja. Evaluasi hal yang sudah dipelajari. Catat hal yang masih perlu diperbaiki.",
        ],
      },
    ],
    stepByStepSection: {
      title: "Checklist Kesiapan Magang Harian Siswa SMK",
      description: "Panduan alur harian menjadi peserta magang yang disiplin dan profesional:",
      steps: [
        {
          stepNumber: 1,
          title: "Persiapan Keberangkatan (H-30 Menit)",
          text: "Pastikan seragam/pakaian rapi sesuai SOP industri, kartu identitas, buku jurnal magang, dan alat kerja telah siap.",
        },
        {
          stepNumber: 2,
          title: "Tiba Tepat Waktu (10–15 Menit Lebih Awal)",
          text: "Hadir sebelum jam kerja dimulai, lakukan presensi, dan sapa pembimbing lapangan serta rekan kerja dengan sopan.",
        },
        {
          stepNumber: 3,
          title: "Briefing & Penerimaan Instruksi Kerja",
          text: "Simak arahan tugas harian dengan fokus. Catat poin-poin penting dan jangan ragu bertanya jika ada bagian teknis yang belum dipahami.",
        },
        {
          stepNumber: 4,
          title: "Eksekusi Pekerjaan dengan Teliti & Tanggung Jawab",
          text: "Kerjakan tugas sesuai standar keselamatan dan mutu perusahaan. Jauhkan penggunaan gawai pribadi selama jam operasional.",
        },
        {
          stepNumber: 5,
          title: "Pemeriksaan Akhir & Perapian Area Kerja",
          text: "Cek kembali hasil pekerjaan, bersihkan dan kembalikan peralatan kerja ke tempat semula, serta lakukan evaluasi mandiri.",
        },
      ],
    },
    attachment: {
      fileName: "Panduan_Etika_dan_Persiapan_Magang_SMK.pdf",
      fileSize: "2.6 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Mitos & Fakta Dunia Kerja",
      description: "Uji pemahaman 20 butir mitos vs fakta seputar dunia magang dan etika kerja.",
      internalUrl: "/kuis/19",
    },
    prevMaterial: { id: 18, title: "Personal Branding: Membangun Citra Diri Positif" },
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
    topics: ["Koreografi", "Wirama", "Wiraga", "Wirasa"],
    description: "Mempelajari pengertian koreografi, unsur pendukung tari (wirama, wiraga, wirasa), sumber rangsang ide, serta elemen utama ruang, waktu, dan tenaga.",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 9.1: Penataan Komposisi dan Gerak Koreografi Tari.",
    contentSections: [
      {
        id: "apa-itu-koreografi",
        title: "Apa Itu Koreografi?",
        paragraphs: [
          "Menurut M.Jazuli koreografi diartikan sebagai pengetahuan penyusunan tari dan untuk menyebutkan hasil susunan tari. Dalam pengertian yang lebih khusus pada saat ini, erat hubungannya dengan masalah bentuk dan gaya tari. Pencipta tari atau penata tarinya disebut koreografer.",
          "Secara etimologis, koreografi berasal dari bahasa Yunani: choreia (tari/gerak berirama) dan graphia (tulisan/catatan). Jadi secara harfiah, koreografi berarti tulisan tari atau catatan gerak. Namun, dalam perkembangannya, koreografi tidak hanya sekadar mencatat gerak, melainkan proses kreatif dalam merancang, menyusun, dan mengorganisasikan gerak tubuh menjadi komposisi tari yang utuh, terstruktur, komunikatif, dan estetis.",
        ],
      },
      {
        id: "apa-itu-konsep-koreografi",
        title: "Apa Itu Konsep Koreografi?",
        paragraphs: [
          "Secara sederhana, koreografi adalah proses kreatif dalam merancang, menyusun, dan mengorganisasikan gerak tubuh menjadi sebuah komposisi tari yang utuh, terstruktur, komunikatif, memiliki nilai estetis, dan makna tertentu. Koreografi juga melibatkan pengaturan ruang, waktu, tenaga, serta unsur pendukung seperti musik, tata busana, tata rias, dan properti.",
        ],
        callout: "Koreografi adalah jiwa atau fondasi dari sebuah karya tari, yang mencakup pengaturan ruang, waktu, tenaga, serta unsur pendukung seperti musik, tata busana, tata rias, dan properti.",
      },
      {
        id: "unsur-unsur-pendukung-tari",
        title: "Unsur-Unsur Pendukung Tari",
        paragraphs: [
          "1. Wirama\nadalah keselarasan dan ketepatan gerakan tubuh penari dengan irama musik atau lagu yang mengiringinya",
          "2. Wiraga\nadalah gerak fisik atau keterampilan tubuh dalam menguasai serta mengeksekusi gerak-gerak tubuhnya dengan baik , tepat, dan indah.",
          "3. Wirasa\nadalah kemampuan seorang penari dalam menghayati, mengekspresikan, dan menyampaikan perasaan, emosi, serta makna yang terkandung di balik sebuah tarian melalui gerak dan mimik wajah.",
        ],
      },
      {
        id: "sumber-ide-rangsang",
        title: "Sumber Ide atau Rangsang Koreografi",
        paragraphs: [
          "Menurut Jacqueline Smith (dalam Suharto, 1985), rangsang adalah sesuatu yang membangkitkan pikiran, semangat, atau mendorong kegiatan. Dalam seni tari, rangsang yang paling umum menjadi awal lahirnya karya tari adalah rangsang visual dan auditif.",
          "1. Rangsang Visual\nRangsang visual adalah segala sesuatu yang dapat ditangkap oleh panca indra penglihatan (mata), seperti alam sekitar, benda, fenomena social, dan karya seni lain.",
          "2. Rangsang Auditif\nRangsang auditif berasal dari bunyi atau musik yang didengar. Musik dengan irama lembut dapat merangsang gerakan lambat dan tenang, sedangkan musik dengan ritme cepat cenderung mendorong gerakan dinamis. Namun, koreografer juga dapat menciptakan kontras, misalnya gerakan cepat diiringi musik lambat, untuk efek artistik tertentu.",
        ],
      },
      {
        id: "elemen-utama-koreografi",
        title: "Elemen Utama Koreografi",
        paragraphs: [
          "1. Ruang (Space) – ruang berkaitan dengan area yang digunakan penari berupa ruang gerak dan juga ruang pementasan.",
          "2. Waktu (Time) – Waktu berkaitan dengan durasi, tempo, dan ritme gerakan. Gerak tari dapat dilakukan dengan tempo cepat, sedang, atau lambat sesuai dengan karakter tarian yang ingin disampaikan.",
          "3. Tenaga (Energy) – Tenaga berkaitan dengan intensitas dan kualitas gerak, misalnya gerakan yang kuat, lembut, tegas, atau mengalir. Penggunaan tenaga yang tepat akan menciptakan dinamika dan ekspresi dalam tarian",
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
          text: "Menuliskan synopsis atau ringkasan cerita tentang tari yang akan dibuat atau dibawakan.",
        },
        {
          stepNumber: 4,
          title: "Membuat Urutan Tarian",
          text: "Membuat urutan atau alur cerita tari yang akan dibuat, hal ini dilakukan supaya Ketika eksplorasi gerak sudah ada pegangan untuk ketentuan penggambaran geraknya.",
        },
        {
          stepNumber: 5,
          title: "Menuliskan Jumlah Penari",
          text: "Menuliskan jumlah penari yang akan membawakan karya tari tersebut.",
        },
        {
          stepNumber: 6,
          title: "Tentukan Pola Lantai",
          text: "Menentukan pola lantai yang akan dibuat, serta dibuat berdasarkan banyaknya alur atau urutan gerak yang telah dibuat.",
        },
        {
          stepNumber: 7,
          title: "Menentukan Iringan Musik",
          text: "Mencari iringan music yang akan digunakan untuk bahan presentasi kelompok.",
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
          "1. Mengembangkan kreativitas siswa dalam menciptakan gerakan tari baru.",
          "2. Melatih keberanian untuk mencoba berbagai variasi dan kemungkinan gerak.",
          "3. Menemukan gerak yang selaras dan sesuai dengan tema tari yang diusung.",
          "4. Mengembangkan gerak dasar/sederhana menjadi gerak yang lebih kaya dan bervariasi.",
          "5. Meningkatkan kemampuan siswa dalam menyusun gerak menjadi sebuah koreografi utuh.",
          "6. Melatih kepekaan tubuh terhadap ruang, waktu, tenaga, dan ekspresi.",
        ],
      },
      {
        id: "sumber-rangsangan",
        title: "Sumber Rangsangan atau Ide Eksplorasi",
        paragraphs: [
          "Gerakan tari dapat bersumber dan dikembangkan dari berbagai jenis rangsangan, di antaranya:",
          "1. Rangsangan Visual: Gerak terinspirasi dari objek yang dilihat, seperti gerak tumbuhan, hewan, aktivitas manusia, atau fenomena alam.",
          "2. Rangsangan Audio: Gerak dikembangkan berdasarkan suara, instrumen, atau musik yang didengar. Perubahan tempo, ritme, dan karakter musik sangat memengaruhi gerak.",
          "3. Rangsangan Kinestetik: Gerak muncul dari pengalaman fisik tubuh saat melakukan suatu gerakan tertentu, yang kemudian dikembangkan lagi menjadi bentuk gerak baru.",
          "4. Rangsangan Gagasan/Ide: Gerakan berasal dari konsep, cerita, perasaan, atau tema abstrak (misalnya: tema perjuangan, persahabatan, atau kehidupan remaja).",
          "5. Rangsangan Lingkungan: Gerakan terinspirasi dari dinamika aktivitas sekitar, seperti suasana sekolah, pasar, sawah, atau fasilitas umum.",
        ],
      },
      {
        id: "unsur-eksplorasi",
        title: "Unsur-Unsur Utama yang Dieksplorasi",
        paragraphs: [
          "Dalam proses eksplorasi, siswa mengolah dan memvariasikan gerak tubuh melalui elemen-elemen dasar seni tari berikut:",
          "1. Ruang: Arah hadap, level (tinggi/sedang/rendah), pola lantai, jarak, dan posisi tubuh",
          "2. Waktu: Tempo (cepat/lambat), ritme, durasi, dan aksentuasi",
          "3. Tenaga: Kuat-lemah, berat-ringan, tegang-rileks",
          "4. Tubuh: Gerak kepala, tangan, badan, kaki, serta kombinasi anggota tubuh",
          "5. Ekspresi: Mimik wajah, gestur sikap tubuh, dan penghayatan makna",
        ],
        callout: "Tips Penting: Kombinasi perubahan elemen ruang, waktu, dan tenaga pada satu gerak dasar dapat memberikan makna, nuansa, serta emosi panggung yang sangat berbeda.",
      },
      {
        id: "teknik-pengembangan",
        title: "Teknik Mengembangkan Gerak Dasar",
        paragraphs: [
          "Satu gerak dasar yang sederhana dapat ditransformasikan menjadi beragam variasi gerak koreografi melalui teknik berikut:",
          "1. Mengubah arah: Ke depan, belakang, samping kanan/kiri, atau diagonal.",
          "2. Mengubah level: Level tinggi (melompat/jinjit), sedang (berdiri/membungkuk), rendah (duduk/jongkok).",
          "3. Mengubah tempo: Dipercepat, diperlambat, atau dihentikan sejenak (freeze)",
          "4. Mengubah tenaga: Gerak dilakukan dengan hentakan kuat atau ayunan lembut.",
          "5. Mengubah ukuran gerak: Gerakan diperluas (jangkauan lebar) atau diperkecil.",
          "6. Mengubah anggota tubuh: Mentransfer gerakan dari tangan ke kaki atau kombinasi keduanya.",
          "7. Mengulang & Menggabungkan: Repetisi gerakan dengan modifikasi atau menggabungkan dua motif gerak berbeda",
        ],
      },
    ],
    stepByStepSection: {
      title: "Panduan Langkah Praktik Eksplorasi Gerak",
      description: "Berikut adalah Panduan Langkah Praktik Eksplorasi Gerak berdasarkan contoh tema \"Kehidupan di Lingkungan Sekolah\" dengan gerak dasar \"Berjalan\":",
      steps: [
        {
          stepNumber: 1,
          title: "Langkah 1: Eksplorasi Berdasarkan Unsur Waktu (Tempo)",
          text: "Cobalah melakukan gerak dasar berjalan dengan variasi tempo lambat dan tempo cepat.\n• Berjalan Tempo Lambat: Melangkah perlahan untuk menggambarkan kesan tenang, ragu, atau khidmat.\n• Berjalan Tempo Cepat: Melangkah tergesa-gesa/setengah berlari untuk menggambarkan kesan terburu-buru atau bersemangat.",
        },
        {
          stepNumber: 2,
          title: "Langkah 2: Eksplorasi Berdasarkan Unsur Ruang (Arah & Level)",
          text: "Ubah arah langkah kaki dan ketinggian tubuh (level) saat berjalan.\n• Arah Samping & Diagonal: Berjalan menyamping ke kanan/kiri atau mengambil garis diagonal.\n• Level Rendah: Berjalan dengan posisi lutut ditekuk/jongkok.\n• Perubahan Arah/Berputar: Berjalan lalu memutar badan ke arah belakang.",
        },
        {
          stepNumber: 3,
          title: "Langkah 3: Eksplorasi Berdasarkan Unsur Tubuh & Tenaga",
          text: "Kombinasikan gerakan berjalan dengan dorongan tenaga dan gerakan anggota tubuh lain.\n• Kombinasi Tubuh: Berjalan sambil mengayunkan atau mengangkat tangan ke atas.\n• Tenaga Kuat: Berjalan dengan pijakan dan posisi tubuh tegap terikat (bertenaga).\n• Tenaga Lembut: Berjalan dengan ayunan tubuh yang rileks dan mengalir.",
        },
        {
          stepNumber: 4,
          title: "Langkah 4: Penambahan Pose Akhir dan Ekspresi",
          text: "Lakukan gerak berjalan kemudian berhenti secara mendadak (pose) diiringi ekspresi wajah yang sesuai dengan tema.",
        },
        {
          stepNumber: 5,
          title: "Langkah 5: Merangkai Variasi Menjadi Koreografi",
          text: "Pilih 3 hingga 5 variasi gerak berjalan yang telah dicoba di atas, lalu hubungkan gerak tersebut secara berurutan menjadi satu kesatuan motif gerak/koreografi singkat.",
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
    topics: ["Komposisi Tari", "Pola Lantai", "Level Vertikal", "Prinsip Unity Balance"],
    description: "Mempelajari unsur utama komposisi tari, pola lantai, level, arah hadap, prinsip kesatuan & keseimbangan, serta ragam panggung pertunjukan.",
    imageUrl: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 12.1: Dinamika Formasi Pola Lantai dan Tata Panggung Tari.",
    contentSections: [
      {
        id: "apa-itu-komposisi-tari",
        title: "Apa itu Komposisi Tari?",
        paragraphs: [
          "Komposisi berasal dari kata comose yang berarti meletakkan, mengatur, dan menyusun bagian-bagian menjadi satu kesatuan yang utuh. Dalam seni tari, komposisi menjadi suatu bentuk untuk memberikan wujud estetik terhadap pertunjukan seni tari. Ruang menjadi hal penting dalam tari karena dapat dihidupkan melalui gerak dan perpindahan penari di atas panggung.",
        ],
      },
      {
        id: "unsur-utama-komposisi",
        title: "Unsur Utama Komposisi Tari",
        paragraphs: [
          "1. Pola Lantai (Floor Pattern)\nPola lantai merupakan garis-garis yang dilalui oleh penari dan menjadi alur visual dari sebuah tarian. Pola lantai berfungsi untuk mengisi ruang panggung, menggambarkan alur cerita, serta memberikan daya tarik kepada penonton.",
          "2. Level (Dimensi Vertikal)\nLevel merupakan tinggi rendahnya posisi tubuh penari berkaitan dengan lantai. Variasi level memberikan kesan estetis dalam pertunjukan tari. Level tinggi dapat menggambarkan kekuatan dan kegembiraan, level sedang menggambarkan ketenangan atau kesetaraan, sedangkan level rendah dapat menggambarkan kerendahan hati atau kesedihan.",
          "3. Arah Hadap (Direction)\nArah hadap adalah penyesuaian arah tubuh penari ketika melakukan gerak, seperti menghadap ke depan, belakang, samping kanan, samping kiri, atau bawah. Perubahan arah hadap dapat menciptakan dinamika estetis dan membantu mengarahkan fokus penonton.",
        ],
      },
      {
        id: "jenis-pola-lantai-dan-maknanya",
        title: "Jenis Pola Lantai dan Maknanya",
        items: [
          {
            imageUrl: "/images/tari/pola-lantai-makna.png",
          },
        ],
        callout: "Pemilihan pola lantai perlu disesuaikan dengan tema dan suasana yang ingin ditampilkan dalam karya tari.",
      },
      {
        id: "prinsip-prinsip-komposisi-tari",
        title: "Prinsip-Prinsip Komposisi Tari",
        paragraphs: [
          "Dalam koreografi, terdapat ide gerak yang utuh dan memiliki nilai estetik yang disusun melalui komposisi tari. Komposisi berfungsi untuk mengatur berbagai elemen tari sebagai pelengkap di atas panggung. Dalam koreografi, elemen-elemen tersebut menjadi penting dan disusun berdasarkan prinsip-prinsip fundamental yang diterapkan oleh penari.",
          "1. Kesatuan (Unity atau Cohesion)\nKesatuan merupakan prinsip komposisi tari yang menunjukkan adanya hubungan antara berbagai elemen tari, seperti gerak, pola lantai, iringan musik, tata busana, dan tata cahaya sebagai pendukung tema tari.\nSetiap gerak yang awalnya terpisah kemudian disusun dan dihubungkan sehingga menjadi sebuah karya tari yang utuh dan harmonis. Penonton tidak melihat pertunjukan sebagai bagian-bagian yang terpisah, tetapi sebagai satu kesatuan pertunjukan yang memiliki keterkaitan dan menjaga integritas artistik karya tari.",
          "2. Keseimbangan (Balance)\nberkaitan dengan pengaturan visual di atas panggung. Seorang koreografer perlu memperhatikan ruang dan posisi penari, terutama keseimbangan antara sisi kanan dan kiri panggung.\n• Keseimbangan simetris, yaitu posisi penari di sisi kanan dan kiri panggung dibuat sama atau seimbang.\n• Keseimbangan asimetris, yaitu posisi penari di sisi kanan dan kiri tidak sama, tetapi jumlah atau bentuknya tetap seimbang secara visual.",
          "3. Kontras (Contrast)\nKontras (Contrast) merupakan prinsip komposisi tari yang menggunakan perbedaan untuk menciptakan dinamika dan membuat pertunjukan menjadi lebih hidup. Kontras dapat ditampilkan melalui perbedaan kecepatan gerak, level, formasi, dan arah hadap.",
          "4. Komposisi kelompok\nmerupakan gerak yang dilakukan oleh beberapa penari dengan penari satu dengan yang lain memiliki hubungan secara timbal balik. Jumlah penari dapat dibedakan dengan kelompok kecil dengan jumlah dua, tiga, empat dan kelompok besar minimal bejumlah lima. Isi atau pola lantai yang digunakan dapat dibuat dengan seimbang serampak zig zag atau terpecah-pecah.",
        ],
        items: [
          {
            imageUrl: "/images/tari/komposisi-kelompok.png",
          },
        ],
      },
      {
        id: "panggung",
        title: "Panggung & Jenis-Jenis Panggung",
        paragraphs: [
          "Panggung merupakan ruang fisik tempat penari mengekspresikan karya seni di hadapan penonton. Jenis panggung dapat memengaruhi koreografi, tata ruang gerak, hubungan penari dengan penonton, serta kesan estetis pertunjukan.",
          "Jenis-jenis panggung:",
        ],
        items: [
          {
            text: "1. Panggung Proscenium\nPanggung proscenium adalah panggung yang dibatasi oleh bingkai (frame) atau lengkungan (arch) di bagian depan. Penonton menyaksikan pertunjukan dari satu arah, yaitu dari depan, sehingga pertunjukan terlihat seperti berada di dalam sebuah bingkai gambar.\nContoh: Gedung Kesenian Jakarta dan Teater Besar Taman Ismail Marzuki.",
            imageUrl: "/images/tari/panggung-proscenium.png",
          },
          {
            text: "2. Panggung Thrust\nPanggung thrust adalah panggung yang menjorok ke arah penonton, sehingga penonton dapat menyaksikan pertunjukan dari tiga sisi panggung, yaitu sisi kiri, kanan, dan depan.\nPanggung jenis ini dapat ditemukan pada beberapa festival tari tradisional, seperti pertunjukan Sendratari Ramayana.",
            imageUrl: "/images/tari/panggung-thrust.jpg",
          },
          {
            text: "3. Panggung arena\nPanggung arena adalah panggung yang berada di tengah-tengah dan dikelilingi penonton dari keempat sisi (360°). Pada panggung ini, tidak terdapat satu sisi depan yang dominan sehingga penari perlu memperhatikan gerakan dan posisi tubuh dari berbagai arah.\nContoh: pertunjukan tari di pendopo, arena pertunjukan rakyat, dan beberapa karya tari kontemporer eksperimental.",
            imageUrl: "/images/tari/panggung-arena.jpg",
          },
          {
            text: "4. Panggung Terbuka (Open Air Stage)\nPanggung terbuka (Open Air Stage) adalah panggung yang berada di ruang terbuka tanpa atap, biasanya memanfaatkan lingkungan alam atau bangunan di sekitarnya sebagai latar pertunjukan.\nPanggung ini dapat digunakan untuk pertunjukan tari dengan jumlah penonton yang besar, seperti Sendratari Ramayana di Candi Prambanan, panggung terbuka Taman Budaya, dan amphitheater",
            imageUrl: "/images/tari/panggung-open-air.png",
          },
        ],
      },
    ],
    stepByStepSection: {
      title: "Langkah-langkah Praktik Komposisi Tari/Pola Lantai",
      description: "Tahapan sistematis penyusunan komposisi pola lantai kelompok tari:",
      steps: [
        { stepNumber: 1, title: "Membentuk kelompok", text: "Peserta didik membentuk kelompok sesuai arahan guru." },
        { stepNumber: 2, title: "Menentukan pola lantai", text: "Kelompok memilih beberapa pola lantai, seperti horizontal, vertikal, diagonal, lengkung, atau zig-zag." },
        { stepNumber: 3, title: "Menentukan level", text: "Peserta didik menentukan penggunaan level tinggi, sedang, dan rendah pada setiap formasi." },
        { stepNumber: 4, title: "Menentukan arah hadap", text: "Peserta didik menentukan arah hadap penari agar komposisi terlihat lebih dinamis." },
        { stepNumber: 5, title: "Menyusun perpindahan formasi", text: "Peserta didik menentukan urutan perpindahan dari satu pola lantai ke pola lantai berikutnya." },
        { stepNumber: 6, title: "Melakukan latihan", text: "Kelompok mempraktikkan gerak dan perpindahan pola lantai dengan memperhatikan jarak serta posisi setiap penari." },
        { stepNumber: 7, title: "Mengevaluasi komposisi", text: "Peserta didik mengamati keseimbangan, kesatuan, dan kontras dalam komposisi yang telah dibuat." },
        { stepNumber: 8, title: "Menampilkan hasil", text: "Kelompok menampilkan hasil komposisi tari di depan kelas." },
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
    topics: ["Tata Rias Tari", "Rias Korektif", "Rias Karakter", "Rias Fantasi"],
    description: "Mempelajari fungsi tata rias panggung, jenis rias (korektif, karakter, fantasi), dan langkah-langkah aplikasi riasan korektif.",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 13.1: Tata Rias Wajah Penari untuk Memperjelas Watak dan Karakter Tokoh.",
    contentSections: [
      {
        id: "apa-itu-tata-rias-tari",
        title: "Apa itu Tata Rias Tari?",
        paragraphs: [
          "Tata rias adalah kegiatan menata atau merias wajah penari dengan menggunakan bahan kosmetik tertentu yang disesuaikan dengan kebutuhan pertunjukan. Tata rias tidak hanya bertujuan untuk mempercantik wajah, tetapi juga membantu memperjelas karakter, watak, tokoh, dan ekspresi penari di atas panggung.",
          "Menurut Harymawan, tata rias merupakan seni menggunakan kosmetik untuk mewujudkan wajah sesuai dengan peranan yang dimainkan di atas panggung. Tata rias juga perlu mempertimbangkan kondisi pementasan, termsuk pencahayaan dan jarak penonton.",
        ],
      },
      {
        id: "fungsi-tata-rias",
        title: "Fungsi Tata Rias",
        elements: [
          {
            type: "image",
            imageUrl: "/images/tari/tata-rias-karakter.jpg",
          },
          {
            type: "paragraph",
            text: "1. Mendukung Tema Tari\nTata rias harus disesuaikan dengan tema yang diangkat dalam karya tari. Tema tari dapat berupa kehidupan masyarakat, kepahlawanan, percintaan, alam, cerita rakyat, kehidupan kerajaan, maupun tema-tema lainnya.\nSumber: Doc. Ujian koreografi Unnes 2026\nTarian diatas salah satu contoh fungsi tata rias sebagai pendukung tema tarian.",
          },
          {
            type: "paragraph",
            text: "2. Memperjelas Karakter dan Tokoh Penari\nTata rias berfungsi untuk memperkuat karakter dan memperjelas tokoh yang dibawakan oleh penari. Karakter dapat berupa lembut, gagah, tegas, lucu, tua, muda, atau anggun, sedangkan tokoh dapat dibedakan berdasarkan sifat, usia, kedudukan, dan perannya dalam cerita. Perbedaan tersebut dapat ditampilkan melalui bentuk alis, mata, garis wajah, dan warna riasan.",
          },
          {
            type: "paragraph",
            text: "3. Memperjelas Ekspresi Wajah\nEkspresi wajah merupakan salah satu bagian penting dalam penyajian tari, terutama pada tari yang menekankan penghayatan dan karakter",
          },
          {
            type: "paragraph",
            text: "4. Menunjang Keindahan Penampilan\nTata rias juga berfungsi untuk meningkatkan nilai estetis atau keindahan penampilan penari. Keindahan tersebut bukan hanya berkaitan dengan wajah penari, tetapi juga dengan keserasian antara tata rias, tata busana, gerak, musik, tata cahaya, dan konsep tari.",
          },
          {
            type: "paragraph",
            text: "5. Memperkuat Identitas Budaya\nPada tari tradisional, tata rias dapat menjadi salah satu bagian yang menunjukkan identitas budaya suatu daerah. Bentuk rias, penggunaan warna, hiasan kepala, serta aksesori tertentu dapat memiliki ciri khas yang membedakan suatu tari dengan tari dari daerah lainnya.",
          },
        ],
      },
      {
        id: "jenis-jenis-tata-rias-tari",
        title: "Jenis-Jenis Tata Rias Tari",
        paragraphs: [
          "1. Tata Rias Korektif\nTata rias korektif merupakan tata rias yang bertujuan untuk memperbaiki, mempertegas, dan menonjolkan bentuk wajah sehingga penampilan penari terlihat lebih jelas dan menarik. Riasan ini pada dasarnya tidak mengubah wajah penari secara drastis, tetapi lebih menekankan pada bagian-bagian tertentu seperti alis, mata, hidung, pipi, dan bibir",
          "2. Tata Rias Karakter\nTata rias karakter adalah tata rias yang digunakan untuk menciptakan atau memperkuat karakter tertentu yang dibawakan oleh penari. Riasan ini dapat membuat wajah penari terlihat memiliki sifat atau watak tertentu, seperti gagah, tegas, tua, keras, lembut, lucu, atau memiliki karakter antagonis.",
          "3. Tata Rias Fantasi\nTata rias fantasi merupakan tata rias yang digunakan untuk menciptakan tampilan yang bersifat imajinatif, unik, dan tidak selalu mengikuti bentuk wajah manusia dalam kehidupan sehari-hari. Riasan ini memberikan kebebasan kepada penata rias untuk mengembangkan bentuk, warna, dan ornamen sesuai dengan konsep pertunjukan.\nTata rias fantasi biasanya menggunakan kombinasi warna dan bentuk yang lebih berani. Riasan dapat disesuaikan dengan tema yang berkaitan dengan dunia imajinasi, alam, binatang, tumbuhan, atau tokoh-tokoh tertentu.",
        ],
        callout: "Riasan yang digunakan oleh penari perlu disesuaikan dengan konsep tari, karakter tokoh, jenis pertunjukan, tata cahaya, serta jarak antara penari dengan penonton. Dengan tata rias yang tepat, penampilan penari menjadi lebih jelas dan mendukung penyampaian karya secara keseluruhan.",
      },
    ],
    stepByStepSection: {
      title: "Step by Step Tata Rias Korektif",
      description: "Tahapan aplikasi tata rias korektif penari panggung:",
      steps: [
        {
          stepNumber: 1,
          title: "Membersihkan Wajah",
          text: "Bersihkan wajah terlebih dahulu agar wajah bebas dari kotoran dan minyak.\nCara aplikasi:\n1) Tuangkan atau gunakan pembersih wajah secukupnya.\n2) Usapkan secara lembut ke seluruh wajah.\n3) Bersihkan menggunakan kapas atau bilas sesuai jenis produknya.",
        },
        {
          stepNumber: 2,
          title: "Menggunakan Skincare",
          text: "Skincare digunakan untuk mempersiapkan kondisi kulit sebelum menggunakan makeup.\nCara aplikasi:\n1) Aplikasikan toner secara merata pada wajah.\n2) Gunakan pelembap secukupnya, lalu ratakan dengan lembut.\n3) Pada riasan untuk pertunjukan di luar ruangan, gunakan sunscreen sesuai petunjuk produk.\n4) Tunggu hingga produk meresap sebelum melanjutkan ke makeup.",
        },
        {
          stepNumber: 3,
          title: "Menggunakan Alas Bedak",
          text: "Foundation digunakan untuk meratakan warna kulit dan menjadi dasar riasan.\nCara aplikasi:\n1) Ambil foundation secukupnya.\n2) Letakkan pada beberapa bagian wajah seperti dahi, pipi, hidung, dan dagu.\n3) Ratakan menggunakan spons atau alat aplikasi makeup hingga merata.",
        },
        {
          stepNumber: 4,
          title: "Melakukan Koreksi Bentuk Wajah",
          text: "Koreksi dilakukan untuk membantu mempertegas atau menyempurnakan bentuk wajah.\nCara aplikasi:\n1) Aplikasikan produk koreksi pada bagian wajah yang ingin ditegaskan.\n2) Ratakan secara perlahan agar tidak terlihat belang.\n3) Sesuaikan dengan bentuk wajah dan kebutuhan riasan.",
        },
        {
          stepNumber: 5,
          title: "Menggunakan Bedak",
          text: "Bedak berfungsi membantu mengunci dasar riasan agar lebih rapi.\nCara aplikasi:\n1) Ambil bedak menggunakan spons atau kuas.\n2) Tepuk-tepukkan secara perlahan pada wajah.\n3) Pastikan seluruh bagian wajah tertutup secara merata.",
        },
        {
          stepNumber: 6,
          title: "Membentuk Alis",
          text: "Alis diperjelas agar ekspresi wajah penari lebih terlihat.\nCara aplikasi:\n1) Rapikan bentuk alis.\n2) Isi bagian alis yang terlihat kurang tebal menggunakan produk alis.\n3) Bentuk mengikuti garis alis secara alami.",
        },
        {
          stepNumber: 7,
          title: "Merias Bagian Mata",
          text: "Riasan mata membantu memperjelas mata dan ekspresi penari di atas panggung.\nCara aplikasi:\n1) Aplikasikan eyeshadow sesuai konsep riasan.\n2) Gunakan eyeliner untuk mempertegas garis mata.\n3) Pastikan riasan kanan dan kiri terlihat seimbang.",
        },
        {
          stepNumber: 8,
          title: "Menggunakan Perona Pipi",
          text: "Perona pipi memberikan kesan segar sekaligus membantu mempertegas bentuk wajah.\nCara aplikasi:\n1) Ambil perona pipi menggunakan kuas.\n2) Aplikasikan pada bagian pipi secara perlahan.\n3) Ratakan agar warna terlihat menyatu dengan riasan.",
        },
        {
          stepNumber: 9,
          title: "Memberikan Warna pada Bibir",
          text: "Lipstik digunakan untuk memperjelas bentuk dan warna bibir.\nCara aplikasi:\n1) Rapikan bagian bibir terlebih dahulu.\n2) Aplikasikan lipstik secara merata.\n3) Sesuaikan warna dengan konsep tari dan kostum.",
        },
        {
          stepNumber: 10,
          title: "Mengecek dan Merapikan Hasil Riasan",
          text: "Tahap terakhir dilakukan untuk memastikan seluruh riasan sudah sesuai.\nCara aplikasi:\n1) Periksa keseimbangan riasan kanan dan kiri.\n2) Rapikan bagian yang kurang rata.\n3) Pastikan riasan terlihat rapi, jelas, dan sesuai dengan kebutuhan pertunjukan.",
        },
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
    topics: ["Tata Busana", "Pakaian Tubuh & Kepala", "Aksesori Tari", "Sapit Urang"],
    description: "Mempelajari peranan tata busana dalam mendukung karakter tari, unsur busana, serta praktik memakai kain jarit model sapit urang.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 14.1: Kelengkapan Kostum dan Busana Tari Tradisional Nusantara.",
    contentSections: [
      {
        id: "apa-itu-tata-kostum-busana",
        title: "Apa Itu Tata Kostum/Busana dalam Seni Tari?",
        paragraphs: [
          "Tata kostum atau tata busana dalam seni tari adalah segala sesuatu yang berkaitan dengan pakaian, perlengkapan, dan aksesori yang dikenakan oleh penari saat pertunjukan. Tata busana membantu memperjelas tema, karakter, tokoh, suasana, identitas budaya, dan nilai estetis dalam karya tari.",
        ],
      },
      {
        id: "hubungan-kostum-dengan-gerak-tari",
        title: "Hubungan Kostum dengan Gerak Tari",
        paragraphs: [
          "Busana harus memungkinkan penari bergerak secara leluasa dan nyaman. Kostum yang terlalu berat, terlalu ketat, terlalu longgar, atau memiliki aksesori yang tidak sesuai dapat menghambat gerakan dan mengganggu keamanan pertunjukan.",
        ],
      },
      {
        id: "unsur-unsur-tata-busana-tari",
        title: "Unsur-Unsur Tata Busana Tari",
        paragraphs: [
          "1. Pakaian Dasar\nPakaian yang digunakan sebagai lapisan dasar sebelum mengenakan kostum utama. Pakaian ini membantu menyiapkan tubuh sebelum menggunakan busana tari.",
          "2. Pakaian Tubuh\nMerupakan pakaian utama yang dikenakan pada tubuh penari dan menjadi bagian utama dari kostum tari. Bentuk dan warnanya disesuaikan dengan tema serta karakter tari.",
          "3. Pakaian Kepala\nMerupakan perlengkapan yang dikenakan pada bagian kepala, seperti mahkota, gelungan, ikat kepala, siger, atau hiasan kepala lainnya. Pakaian kepala dapat membantu memperkuat karakter dan identitas tari.",
          "4. Pakaian Kaki\nMerupakan perlengkapan yang digunakan pada bagian kaki, seperti kaus kaki, gelang kaki, atau perlengkapan lainnya yang mendukung penampilan penari.",
          "5. Aksesori\nMerupakan perlengkapan tambahan yang digunakan untuk memperindah dan melengkapi kostum, seperti kalung, gelang, anting, ikat pinggang, dan selendang.",
          "6. Properti Pelengkap\nMerupakan perlengkapan yang dikenakan atau digunakan penari untuk mendukung karakter dan kebutuhan pertunjukan, sehingga penampilan tari menjadi lebih sesuai dengan tema dan konsepnya.",
        ],
        callout: "Tata busana tari terdiri dari berbagai unsur yang saling melengkapi. Pemilihannya perlu disesuaikan dengan tema, karakter, gerak, dan kebutuhan pertunjukan agar kostum tidak hanya indah, tetapi juga mendukung penampilan penari.",
      },
      {
        id: "visualisasi-karakter-tata-busana",
        title: "Visualisasi Karakter Melalui Tata Busana",
        paragraphs: [
          "Sumber: Doc. Ujian koreografi Unnes 2026",
          "Pada Tari Merak, tata busana dirancang dengan bentuk, warna, dan hiasan yang terinspirasi dari burung merak. Penggunaan kostum tersebut membantu memperkuat karakter burung merak yang menjadi sumber inspirasi tari sekaligus mendukung visualisasi gerak, terutama pada gerakan yang menggambarkan keindahan dan keluwesan burung merak.",
        ],
        items: [
          {
            imageUrl: "/images/tari/tata-busana-merak.png",
          },
        ],
        callout: "pada tari tradisional Jawa, penggunaan kain, kebaya, jarik, sampur, serta berbagai aksesori disesuaikan dengan jenis dan karakter tari. Tata busana tersebut tidak hanya berfungsi untuk memperindah penampilan penari, tetapi juga memperkuat karakter, suasana, dan identitas budaya Jawa yang terdapat dalam karya tari.",
      },
    ],
    stepByStepSection: {
      title: "Cara Menggunakan Kain Jarit Bentuk Sapit Urang",
      description: "Sapit urang merupakan salah satu cara memakai kain jarit dalam busana tari Jawa. Bentuk kain dibuat rapi dan kuat pada bagian depan, sehingga mendukung penampilan penari serta tetap memungkinkan gerak kaki dengan leluasa. Langkah-langkah:",
      steps: [
        { stepNumber: 1, title: "Siapkan kain jarit", text: "Bentangkan kain jarit dan pastikan bagian motif serta arah kain sudah sesuai." },
        { stepNumber: 2, title: "Posisikan kain pada tubuh", text: "Letakkan kain melingkari tubuh dari arah belakang ke depan dengan posisi kain sejajar dan rapi." },
        { stepNumber: 3, title: "Atur bagian depan kain", text: "Tarik dan rapikan bagian depan kain sehingga membentuk sapit urang, yaitu lipatan atau bentuk kain yang mengarah dan merapat di bagian depan." },
        { stepNumber: 4, title: "Buat lipatan kain", text: "Lipat bagian kain secara teratur dan pastikan lipatannya rapi serta tidak terlalu longgar." },
        { stepNumber: 5, title: "Kencangkan kain", text: "Rapikan dan kuatkan ikatan pada bagian pinggang agar kain tidak mudah bergeser ketika penari bergerak." },
        { stepNumber: 6, title: "Periksa panjang kain", text: "Pastikan panjang kain sesuai dengan kebutuhan tari dan tidak menghambat langkah atau gerakan kaki." },
        { stepNumber: 7, title: "Rapikan keseluruhan", text: "Periksa kembali posisi motif, lipatan, dan bagian pinggang agar rapi, nyaman, dan siap digunakan untuk menari." },
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
    topics: ["Properti Tari", "Stimulus Gerak", "Fungsi Properti", "Eksplorasi Properti"],
    description: "Memahami pemanfaatan properti sebagai pendukung dan stimulus koreografi gerak, serta ragam fungsi properti dalam karya tari.",
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ilustrasi 15.1: Penggunaan Properti Topeng dan Selendang dalam Eksplorasi Gerak Tari.",
    contentSections: [
      {
        id: "apa-itu-properti-tari",
        title: "Apa itu Property Tari?",
        paragraphs: [
          "Properti tari adalah segala benda atau perlengkapan yang digunakan penari dalam pertunjukan untuk mendukung tema, karakter, suasana, dan gagasan tari. Properti dapat berupa benda khusus untuk pertunjukan maupun benda sederhana yang ada di sekitar.",
          "Pemilihan properti tidak boleh sembarangan. Properti harus disesuaikan dengan tema, konsep, karakter, dan gerak tari agar dapat mendukung koreografi.",
        ],
        callout: "Properti tidak harus mahal atau rumit. Benda sederhana dapat menjadi properti tari apabila dimanfaatkan secara kreatif untuk mendukung penciptaan gerak.",
      },
      {
        id: "properti-sebagai-pendukung-koreografi",
        title: "Properti sebagai Pendukung Koreografi",
        paragraphs: [
          "Properti tidak hanya berfungsi sebagai pelengkap atau hiasan, tetapi juga dapat menjadi stimulus untuk menciptakan dan mengembangkan gerak tari.",
          "Contohnya, kain dapat digunakan dengan berbagai gerakan seperti mengayun, menarik, memutar, mengembangkan, atau mengibaskan. Topeng dapat digunakan untuk memperkuat karakter atau tokoh, sedangkan kain dapat membantu membangun suasana dan visualisasi tema.",
          "Sumber: Doc. Ujian koreografi Unnes 2026",
        ],
        items: [
          {
            imageUrl: "/images/tari/properti-tari.png",
          },
        ],
      },
      {
        id: "hubungan-properti-dengan-koreografi",
        title: "Hubungan Properti dengan Koreografi",
        paragraphs: [
          "Tema → Ide/Gagasan → Properti → Eksplorasi Gerak → Koreografi",
          "Artinya, properti yang digunakan sebaiknya berasal dari kebutuhan konsep tari dan kemudian dikembangkan menjadi bagian dari koreografi.",
        ],
      },
      {
        id: "fungsi-properti-tari",
        title: "Fungsi Properti Tari",
        paragraphs: [
          "1. Memperkuat Tema\nProperti membantu memperjelas tema yang diangkat. Misalnya, tari bertema kehidupan petani dapat menggunakan benda yang berkaitan dengan aktivitas pertanian.",
          "2. Memperkuat Karakter\nCara penari memegang, membawa, atau menggerakkan properti dapat membantu menunjukkan karakter yang dibawakan.",
          "3. Mengembangkan Gerak\nProperti dapat menjadi sumber inspirasi untuk menciptakan berbagai variasi gerak.",
          "4. Memperjelas Cerita atau Gagasan\nProperti membantu penonton memahami cerita, aktivitas, atau gagasan yang disampaikan melalui tari.",
          "5. Menambah Nilai Estetis\nBentuk, warna, ukuran, dan gerakan properti dapat memperkaya tampilan visual koreografi.",
          "6. Mengembangkan Kreativitas\nPenggunaan properti mendorong peserta didik untuk menemukan berbagai kemungkinan gerak dan melatih imajinasi serta kreativitas.",
        ],
        callout: "Properti tari bukan sekadar pelengkap pertunjukan, tetapi dapat menjadi bagian dari proses penciptaan, eksplorasi, dan pengembangan gerak dalam koreografi.",
      },
    ],
    stepByStepSection: {
      title: "Eksplorasi Gerak Menggunakan Properti",
      description: "Langkah-langkah eksplorasi gerak menggunakan properti:",
      steps: [
        { stepNumber: 1, title: "Tentukan Tema atau Ide Tari", text: "Tentukan tema atau ide tari." },
        { stepNumber: 2, title: "Pilih Properti yang Sesuai", text: "Pilih properti yang sesuai dengan tema." },
        { stepNumber: 3, title: "Amati Bentuk dan Karakteristik Properti", text: "Amati bentuk, ukuran, dan karakteristik properti." },
        { stepNumber: 4, title: "Coba Berbagai Cara Menggunakan Properti", text: "Coba berbagai cara menggunakan properti, seperti mengayun, menarik, memutar, membawa, atau mengibaskan." },
        { stepNumber: 5, title: "Kembangkan Gerakan Menjadi Beberapa Variasi", text: "Kembangkan gerakan menjadi beberapa variasi." },
        { stepNumber: 6, title: "Pilih Gerakan yang Paling Sesuai", text: "Pilih gerakan yang paling sesuai dengan tema dan karakter." },
        { stepNumber: 7, title: "Susun Gerakan Menjadi Bagian Koreografi", text: "Susun gerakan menjadi bagian dari koreografi." },
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

export { MATERIAL_DATABASE };

export function getMaterialDetailForModule(moduleTitleOrId: string | number): MaterialDetail | undefined {
  const idMap: Record<string, number> = {
    'mod-tari-1': 9,
    'mod-tari-2': 10,
    'mod-tari-3': 12,
    'mod-tari-4': 13,
    'mod-tari-5': 14,
    'mod-tari-6': 15,
    'mod-bk-1': 7,
    'mod-bk-2': 8,
    'mod-bk-3': 16,
    'mod-bk-4': 17,
    'mod-bk-5': 18,
    'mod-bk-6': 19,
    'mod-1': 1,
    'mod-2': 2,
    'mod-3': 3,
    'mod-4': 4,
    'mod-5': 7,
    'mod-6': 6,
    'mod-7': 7,
    'mod-8': 8,
    'mod-oto-1': 20,
    'mod-oto-2': 21,
    'mod-or-1': 22,
    'mod-or-2': 23,
  };

  const keyStr = String(moduleTitleOrId).toLowerCase().trim();

  if (typeof moduleTitleOrId === 'number' || (!isNaN(Number(moduleTitleOrId)) && MATERIAL_DATABASE[Number(moduleTitleOrId)])) {
    return MATERIAL_DATABASE[Number(moduleTitleOrId)];
  } else if (idMap[keyStr]) {
    return MATERIAL_DATABASE[idMap[keyStr]];
  } else {
    return Object.values(MATERIAL_DATABASE).find(
      (m) =>
        m.title.toLowerCase().trim() === keyStr ||
        keyStr.includes(m.title.toLowerCase().trim()) ||
        m.title.toLowerCase().trim().includes(keyStr)
    );
  }
}

export function getMaterialBlocksForModule(moduleTitleOrId: string | number): any[] {
  const material = getMaterialDetailForModule(moduleTitleOrId);

  if (!material) return [];

  const generatedBlocks: any[] = [];
  let blockCounter = 1;

  // 1. Convert content sections with multi-element paragraphs and images support
  if (material.contentSections && material.contentSections.length > 0) {
    material.contentSections.forEach((section) => {
      const elements: any[] = [];
      let elCounter = 1;

      if (section.elements && section.elements.length > 0) {
        section.elements.forEach((el) => {
          elements.push({
            id: `el-${Date.now()}-${elCounter++}`,
            type: el.type,
            text: el.text || '',
            imageUrl: el.imageUrl || '',
            imageCaption: el.imageCaption || '',
          });
        });
      } else {
        // Add paragraphs if present
        if (section.paragraphs && section.paragraphs.length > 0) {
          section.paragraphs.forEach((p) => {
            if (p && p.trim()) {
              elements.push({
                id: `el-${Date.now()}-${elCounter++}`,
                type: 'paragraph',
                text: p,
              });
            }
          });
        }

        // Add items (text and/or image) if present
        if (section.items && section.items.length > 0) {
          section.items.forEach((item) => {
            if (item.imageUrl) {
              elements.push({
                id: `el-${Date.now()}-${elCounter++}`,
                type: 'image',
                imageUrl: item.imageUrl,
                imageCaption: '',
              });
            }
            if (item.text && item.text.trim()) {
              elements.push({
                id: `el-${Date.now()}-${elCounter++}`,
                type: 'paragraph',
                text: item.text,
              });
            }
          });
        }
      }

      // If both were empty, add 1 default paragraph
      if (elements.length === 0) {
        elements.push({
          id: `el-${Date.now()}-${elCounter++}`,
          type: 'paragraph',
          text: '',
        });
      }

      const firstImage = elements.find((el) => el.type === 'image')?.imageUrl;
      const allTexts = elements.filter((el) => el.type === 'paragraph').map((el) => el.text).join('\n\n');

      generatedBlocks.push({
        id: `blk-${blockCounter++}`,
        type: 'text',
        sectionTitle: section.title,
        textValue: allTexts,
        elements: elements,
        calloutText: section.callout,
        alignment: 'left',
        mediaUrl: firstImage,
      });

      if (section.codeSnippet && section.codeSnippet.code) {
        generatedBlocks.push({
          id: `blk-${blockCounter++}`,
          type: 'code',
          codeSnippet: section.codeSnippet,
        });
      }
    });
  }

  // 2. Convert Video section if present
  if (material.videoSection && material.videoSection.videoUrl) {
    generatedBlocks.push({
      id: `blk-${blockCounter++}`,
      type: 'video',
      sectionTitle: material.videoSection.title,
      mediaUrl: material.videoSection.videoUrl,
      imageCaption: material.videoSection.caption,
    });
  }

  // 3. Convert Step by step section
  if (material.stepByStepSection && material.stepByStepSection.steps?.length > 0) {
    generatedBlocks.push({
      id: `blk-${blockCounter++}`,
      type: 'steps',
      stepSectionTitle: material.stepByStepSection.title,
      stepSectionSubtitle: material.stepByStepSection.description,
      steps: material.stepByStepSection.steps.map((s) => ({
        title: s.title,
        desc: s.text,
      })),
    });
  }

  // 4. Convert Attachment if present
  if (material.attachment) {
    generatedBlocks.push({
      id: `blk-${blockCounter++}`,
      type: 'attachment',
      attachments: [
        {
          id: 'att-init-1',
          fileName: material.attachment.fileName,
          fileSize: material.attachment.fileSize,
          fileUrl: '#',
        },
      ],
    });
  }

  return generatedBlocks;
}

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
      <div className="space-y-1.5">
        {lines.map((line, idx) => (
          <p key={idx} className="text-xs md:text-sm font-medium text-[#4A4A4A] leading-relaxed text-justify">
            {line}
          </p>
        ))}
      </div>
    );
  }
  return (
    <p className="text-xs md:text-sm font-medium text-[#4A4A4A] leading-relaxed whitespace-pre-line text-justify">
      {text}
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

  const { modules } = useAdminStore();

  const baseMaterial = useMemo(() => {
    return getMaterialDetailForModule(id) || MATERIAL_DATABASE[parseInt(id, 10) || 1] || MATERIAL_DATABASE[1];
  }, [id]);

  // Construct dynamic live material merging admin store changes
  const material = useMemo(() => {
    const storeMod = modules.find(
      (m) =>
        m.id === id ||
        String(m.id) === String(baseMaterial.id) ||
        m.title.toLowerCase().trim() === baseMaterial.title.toLowerCase().trim()
    );

    if (!storeMod) return baseMaterial;

    // If storeMod has blocks, build contentSections, stepByStepSection, videoSection, attachment
    if (storeMod.blocks && storeMod.blocks.length > 0) {
      const dynamicSections: ContentSection[] = [];
      let dynamicStepByStep: any = undefined;
      let dynamicVideo: any = undefined;
      let dynamicAttachment: any = baseMaterial.attachment;

      storeMod.blocks.forEach((block: any, bIdx: number) => {
        if (block.type === 'text') {
          const items: any[] = [];
          const paragraphs: string[] = [];

          if (block.elements && block.elements.length > 0) {
            block.elements.forEach((el: any) => {
              if (el.type === 'paragraph' && el.text) {
                paragraphs.push(el.text);
              } else if (el.type === 'image' && el.imageUrl) {
                items.push({ imageUrl: el.imageUrl, text: el.imageCaption || '' });
              }
            });
          } else {
            if (block.textValue) paragraphs.push(block.textValue);
            if (block.mediaUrl) items.push({ imageUrl: block.mediaUrl, text: '' });
          }

          dynamicSections.push({
            id: `sec-${bIdx + 1}`,
            title: block.sectionTitle || 'Heading',
            elements: block.elements && block.elements.length > 0 ? block.elements : undefined,
            paragraphs: paragraphs,
            items: items.length > 0 ? items : undefined,
            callout: block.calloutText || undefined,
          });
        } else if (block.type === 'code' && block.codeSnippet) {
          dynamicSections.push({
            id: `sec-code-${bIdx + 1}`,
            title: '',
            paragraphs: [],
            codeSnippet: block.codeSnippet,
          });
        } else if (block.type === 'image' && block.mediaUrl) {
          dynamicSections.push({
            id: `sec-img-${bIdx + 1}`,
            title: block.imageCaption || 'Ilustrasi Materi',
            paragraphs: [],
            items: [{ imageUrl: block.mediaUrl, text: '' }],
          });
        } else if (block.type === 'video' && block.mediaUrl) {
          dynamicVideo = {
            title: block.sectionTitle || 'Video Simulasi & Pembelajaran',
            videoUrl: block.mediaUrl,
            caption: block.imageCaption || '',
          };
        } else if (block.type === 'steps' && block.steps && block.steps.length > 0) {
          dynamicStepByStep = {
            title: block.stepSectionTitle || 'Langkah-langkah Praktik',
            description: block.stepSectionSubtitle || 'Panduan praktikum terstruktur:',
            steps: block.steps.map((s: any, sIdx: number) => ({
              stepNumber: sIdx + 1,
              title: s.title,
              text: s.desc,
            })),
          };
        } else if (block.type === 'attachment' && block.attachments && block.attachments.length > 0) {
          dynamicAttachment = {
            fileName: block.attachments[0].fileName,
            fileSize: block.attachments[0].fileSize,
          };
        }
      });

      return {
        ...baseMaterial,
        title: storeMod.title || baseMaterial.title,
        description: storeMod.description || baseMaterial.description,
        level: (storeMod.level as any) || baseMaterial.level,
        duration: storeMod.duration || baseMaterial.duration,
        topics: storeMod.topics || baseMaterial.topics,
        imageUrl: storeMod.thumbnail || baseMaterial.imageUrl,
        contentSections: dynamicSections.length > 0 ? dynamicSections : baseMaterial.contentSections,
        stepByStepSection: dynamicStepByStep || baseMaterial.stepByStepSection,
        videoSection: dynamicVideo || baseMaterial.videoSection,
        attachment: dynamicAttachment,
      };
    }

    return {
      ...baseMaterial,
      title: storeMod.title || baseMaterial.title,
      description: storeMod.description || baseMaterial.description,
      level: (storeMod.level as any) || baseMaterial.level,
      duration: storeMod.duration || baseMaterial.duration,
      topics: storeMod.topics || baseMaterial.topics,
      imageUrl: storeMod.thumbnail || baseMaterial.imageUrl,
    };
  }, [baseMaterial, modules, id]);

  const initialSectionId = material.videoSection ? "video-tutorial" : (material.contentSections[0]?.id || "pengantar");
  const [activeSection, setActiveSection] = useState(initialSectionId);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeQuizModal, setActiveQuizModal] = useState<"none" | "barcode" | "link_confirm">("none");
  const [isTocOpen, setIsTocOpen] = useState(false);

  // Compute smart back URL preserving category filter
  const backUrl = fromParam && fromParam !== "Semua" ? `/materi?kategori=${encodeURIComponent(fromParam)}` : "/materi";

  // Scroll to top immediately when opening material
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

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

  const [isMarkedDone, setIsMarkedDone] = useState(false);

  const handleMarkComplete = () => {
    if (isMarkedDone || !material) return;
    setIsMarkedDone(true);
    recordModuleCompletion(String(material.id));
    addUserNotification({
      type: 'materi',
      title: 'Materi Selesai Dipelajari',
      message: `Selamat! Kamu telah menyelesaikan materi "${material.title}". Target mingguanmu bertambah.`,
      linkUrl: `/materi/${material.id}`,
    });
  };

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
                  {material.level === "Pemula" && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-[4px] text-xs font-semibold">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pemula</span>
                    </span>
                  )}
                  {material.level === "Menengah" && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-1 rounded-[4px] text-xs font-semibold">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Menengah</span>
                    </span>
                  )}
                  {material.level !== "Pemula" && material.level !== "Menengah" && (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/80 px-2.5 py-1 rounded-[4px] text-xs font-semibold">
                      <Trophy className="w-3.5 h-3.5 text-purple-600" />
                      <span>{material.level || "Mahir"}</span>
                    </span>
                  )}
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

              {/* Main Feature Image / Hero Thumbnail (16:9 Aspect Ratio) */}
              <figure>
                <div className="relative w-full aspect-video rounded-[12px] overflow-hidden border border-[#ECECEC] bg-[#FAFAFA]">
                  {/* eslint-disable-next-next/no-img-element */}
                  <img
                    src={material.imageUrl}
                    alt={material.title}
                    className="w-full h-full object-cover"
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
                    {section.title && (
                      <h2 className="text-lg md:text-xl font-bold text-[#2E2D2D]">
                        {section.title}
                      </h2>
                    )}

                    {/* Render Elements in Exact Ordered Sequence if available */}
                    {section.elements && section.elements.length > 0 ? (
                      <div className="space-y-4">
                        {section.elements.map((el: any, elIdx: number) => {
                          if (el.type === 'image' && el.imageUrl) {
                            return (
                              <div key={elIdx} className="my-3 w-full">
                                <div className="overflow-hidden rounded-[12px] border border-[#ECECEC] bg-slate-50 w-full aspect-video">
                                  {/* eslint-disable-next-next/no-img-element */}
                                  <img
                                    src={el.imageUrl}
                                    alt="Ilustrasi Materi"
                                    className="w-full h-full object-cover rounded-[12px]"
                                  />
                                </div>
                              </div>
                            );
                          }
                          if (el.type === 'paragraph' && el.text) {
                            return (
                              <SmartParagraph key={elIdx} text={el.text} />
                            );
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <>
                        {section.paragraphs && section.paragraphs.length > 0 && (
                          <div className="space-y-2.5">
                            {section.paragraphs.map((p, pIdx) => (
                              <SmartParagraph key={pIdx} text={p} />
                            ))}
                          </div>
                        )}

                        {/* Integrated Per-Point Media Block (Clean Direct Text Layout, Natural Image Resolution, No Captions) */}
                        {section.items && section.items.length > 0 && (
                          <div className="space-y-4 my-3">
                            {section.items.map((item, i) => (
                              <div key={i} className="space-y-2.5">
                                {item.imageUrl && (
                                  <div className="my-3 w-full">
                                    <div className="overflow-hidden rounded-[12px] border border-[#ECECEC] bg-slate-50 w-full aspect-video">
                                      {/* eslint-disable-next-next/no-img-element */}
                                      <img
                                        src={item.imageUrl}
                                        alt="Ilustrasi Materi"
                                        className="w-full h-full object-cover rounded-[12px]"
                                      />
                                    </div>
                                  </div>
                                )}

                                {item.text && (
                                  <p className="text-xs md:text-sm font-medium text-[#4A4A4A] leading-relaxed text-justify">
                                    {item.text}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Highlight / Callout Box (Blue sleek card without title) */}
                    {section.callout && (
                      <div className="my-3 p-4 rounded-[12px] bg-[#F6F5FF] border border-[#E8E7FF] text-[#2563EB] text-xs md:text-sm leading-relaxed flex items-start gap-3 shadow-2xs">
                        <div className="w-1.5 self-stretch bg-[#2563EB] rounded-full shrink-0" />
                        <p className="text-[#3A3985] font-medium leading-relaxed flex-1 text-justify">
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
                    <p className="text-xs md:text-sm font-medium text-[#737373] leading-relaxed mt-1 text-justify">
                      {material.stepByStepSection.description}
                    </p>
                  </div>

                  {/* 1 Single Frame Container Box */}
                  <div className="bg-white border border-[#ECECEC] rounded-[10px] overflow-hidden divide-y divide-[#ECECEC]">
                    {material.stepByStepSection.steps.map((step: any) => (
                      <div
                        key={step.stepNumber}
                        className="p-4 md:p-5 space-y-3 bg-white transition-colors hover:bg-[#F6F5FF]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 bg-[#0400F4] text-white">
                            {String(step.stepNumber).padStart(2, '0')}
                          </span>
                          <h3 className="text-sm md:text-base font-bold text-[#2E2D2D]">
                            {step.title}
                          </h3>
                        </div>

                        <p className="text-xs md:text-sm font-medium text-[#4A4A4A] leading-relaxed pl-11 text-justify">
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
              <section className="bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-[8px] bg-[#F4EFFF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={File01Icon} size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      title={material.attachment.fileName}
                      className="text-xs md:text-sm font-semibold text-[#2E2D2D] truncate"
                    >
                      {material.attachment.fileName.replace(/_/g, " ")}
                    </p>
                    <p className="text-[11px] text-[#737373] truncate">
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
                  className="inline-flex items-center justify-center gap-1.5 bg-white border border-[#ECECEC] hover:bg-[#F6F5FF] hover:border-[#2563EB]/40 text-[#2563EB] px-4 py-2.5 sm:py-2 rounded-[6px] text-xs font-semibold transition-all duration-200 shrink-0 w-full sm:w-auto"
                >
                  <HugeiconsIcon icon={Download01Icon} size={15} />
                  <span>Unduh Modul PDF</span>
                </a>
              </section>

              {/* Mark Completed Section */}
              <section className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-blue-100 rounded-[12px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-[#2E2D2D]">
                      {isMarkedDone ? "Materi Selesai Dipelajari" : "Sudah Selesai Mempelajari Materi Ini?"}
                    </h3>
                    <p className="text-[11px] text-[#737373]">
                      {isMarkedDone
                        ? "Progres belajarmu telah tercatat pada Target Mingguan."
                        : "Tandai untuk mencatat progres belajarmu ke Target Mingguan."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={isMarkedDone}
                  className={`px-4 py-2.5 sm:py-2 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shrink-0 w-full sm:w-auto ${
                    isMarkedDone
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                      : "bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white cursor-pointer shadow-xs"
                  }`}
                >
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={15} />
                  <span>{isMarkedDone ? "Sudah Selesai ✓" : "Tandai Selesai"}</span>
                </button>
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
          <div className="flex items-center">
            <h4 className="text-xs font-bold text-[#2E2D2D] flex items-center gap-1.5">
              <HugeiconsIcon icon={Task01Icon} size={16} className="text-[#2563EB]" />
              <span>Daftar Isi Pembahasan</span>
            </h4>
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
    </div>
  );
}
