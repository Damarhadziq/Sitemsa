'use client';

import { useState, useEffect, use, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BarChart2, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAdminStore, ModuleItem } from "@/lib/admin-store";
import { ModuleService } from "@/services/module.service";
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
  MusicNote01Icon,
  Dumbbell01Icon,
} from "@hugeicons/core-free-icons";
import { recordModuleCompletion, isModuleCompletedByStudent } from "@/services/weekly-target.service";
import { addUserNotification } from "@/services/notification.service";
import { StudyAnalyticsService } from "@/services/analytics.service";
import { getStudentScopedStorageKey, getStudentProfile } from "@/services/student-profile.service";
import { ProgressService } from "@/services/progress.service";
import { toDeterministicUUID } from "@/lib/uuid";
import { generateValidPdfBlob } from "@/lib/pdf-generator";

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
  attachment?: {
    fileName: string;
    fileSize: string;
    fileUrl?: string;
  };
  quizSource?: QuizSource;
  orderedBlocks?: any[];
  prevMaterial?: { id: number; title: string };
  nextMaterial?: { id: number; title: string };
}

export function getYouTubeEmbedUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return trimmed;
}

const MATERIAL_DATABASE: Record<number, MaterialDetail> = {
  1: {
    id: 1,
    subject: "Informatika",
    title: "Variabel, Tipe Data & Operasi Logika",
    level: "Pemula",
    duration: "25 Menit",
    author: "Damar Hadziq H.",
    updatedAt: "14 Agustus 2026",
    icon: ComputerIcon,
    topics: ["Variabel", "Tipe Data Primitif", "Operator Logika"],
    description: "Pelajari konsep penyimpanan data dan eksekusi operasi logika dasar dalam pemrograman.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Variabel dan Operasi Logika",
    contentSections: [
      {
        id: "pengantar",
        title: "Pengenalan Variabel & Memori",
        paragraphs: [
          "Dalam dunia pemrograman, variabel dapat dianalogikan sebagai sebuah wadah atau kotak berlabel di dalam memori komputer. Setiap wadah memiliki nama unik dan nilai yang disimpan di dalamnya dapat diakses maupun diubah selama program berjalan.",
          "Memahami cara kerja variabel sangat penting karena seluruh manipulasi data — mulai dari angka sederhana, teks nama pengguna, hingga kalkulasi kompleks — bergantung pada deklarasi variabel yang benar.",
        ],
      },
      {
        id: "tipe-data",
        title: "Tipe Data Primitif",
        paragraphs: [
          "Tipe data menentukan jenis nilai apa yang dapat ditampung oleh variabel. Dalam bahasa pemrograman modern seperti TypeScript dan JavaScript, tipe data primitif mencakup string (teks), number (angka bulat maupun desimal), dan boolean (nilai kebenaran true atau false).",
        ],
      },
    ],
    attachment: {
      fileName: "Modul_Variabel_dan_Tipe_Data.pdf",
      fileSize: "2.4 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi Informatika",
      description: "Uji pemahaman variabel dan logika pemrograman.",
      internalUrl: `/kuis/${toDeterministicUUID(1)}`,
    },
  },
  9: {
    id: 9,
    subject: "Seni Tari",
    title: "Konsep Dasar Koreografi & Tata Gerak Tari Tradisional",
    level: "Pemula",
    duration: "30 Menit",
    author: "Anita Dwi Ningtyas",
    updatedAt: "18 Agustus 2026",
    icon: MusicNote01Icon,
    topics: ["Eksplorasi Gerak", "Pola Lantai", "Dinamika Wiraga"],
    description: "Pengenalan elemen dasar wiraga, wirama, dan wirasa dalam menyusun komposisi tari tunggal maupun kelompok.",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Koreografi Tari Tradisional",
    contentSections: [
      {
        id: "konsep-wiraga",
        title: "Elemen Dasar Wiraga, Wirama, dan Wirasa",
        paragraphs: [
          "Dalam seni tari tradisional nusantara, wiraga mengacu pada kemampuan fisik penari dalam membawakan ragam gerak secara terampil, lentur, dan presisi. Wirama adalah keselarasan gerak dengan tempo musik pengiring, sedangkan wirasa adalah penjiwaan karakter tari.",
        ],
      },
    ],
    attachment: {
      fileName: "Modul_Koreografi_Tari.pdf",
      fileSize: "1.8 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi Koreografi Tari",
      description: "Uji pemahaman konsep wiraga, wirama, dan wirasa.",
      internalUrl: `/kuis/${toDeterministicUUID(9)}`,
    },
  },
  11: {
    id: 11,
    subject: "Otomotif",
    title: "Sistem Pengisian Mobil Konvensional dan Elektronik/IC",
    level: "Menengah",
    duration: "45 Menit",
    author: "Ardyan Santoso",
    updatedAt: "25 Agustus 2026",
    icon: Car01Icon,
    topics: ["Pengertian Sistem Pengisian", "Komponen Alternator", "Prinsip Kerja", "Troubleshooting Pengisian"],
    description: "Memahami fungsi, komponen utama alternator, prinsip kerja pembangkitan arus, dan langkah pemecahan masalah sistem pengisian mobil konvensional serta elektronik.",
    imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Sistem Pengisian Mobil Konvensional dan Elektronik/IC",
    contentSections: [
      {
        id: "sec-11-1",
        title: "Pengertian Sistem Pengisian",
        paragraphs: [
            "Sistem pengisian adalah rangkaian komponen yang berfungsi untuk mengisi daya baterai saat mesin hidup dan menyuplai listrik untuk kebutuhan komponen kelistrikan lainnya di dalam kendaraan. Ketika mesin mati, seluruh beban listrik disuplai oleh baterai. Namun saat mesin hidup, alternator mengambil alih peran sebagai sumber listrik utama sekaligus mengisi ulang arus listrik pada baterai."
          ],
      },
      {
        id: "sec-11-2",
        title: "Fungsi Komponen Sistem Pengisian",
        paragraphs: [
            "Sistem pengisian terdiri atas beberapa komponen vital yang bekerja secara terintegrasi:"
          ],
      },
      {
        id: "sec-11-3",
        title: "Baterai",
        paragraphs: [
            "Berfungsi sebagai sumber arus listrik saat mesin belum hidup atau saat proses starting, serta menjadi penyimpan daya hasil pengisian alternator saat mesin beroperasi."
          ],
      },
      {
        id: "sec-11-4",
        title: "Kunci Kontak",
        paragraphs: [
            "Berfungsi sebagai saklar utama yang menghubungkan dan memutuskan aliran arus listrik dari baterai menuju alternator dan rangkaian indikator pengisian."
          ],
      },
      {
        id: "sec-11-5",
        title: "Alternator",
        paragraphs: [
            "Merupakan pembangkit tenaga listrik utama pada kendaraan. Mengubah energi mekanik putaran mesin menjadi energi listrik bolak-balik (AC) yang kemudian disearahkan menjadi arus searah (DC). Alternator tersusun atas:",
            "• Pulley: Penghubung mekanis antara putaran poros engkol mesin dan alternator melalui tali kipas (V-belt).",
            "• Rotor: Komponen berputar yang menghasilkan medan magnet ketika arus listrik mengalir melalui kumparannya.",
            "• Stator: Kumparan diam yang menangkap perpotongan garis gaya medan magnet rotor untuk membangkitkan tegangan listrik induksi.",
            "• Dioda Rectifier: Penyearah gelombang yang mengubah tegangan AC yang dihasilkan stator menjadi tegangan DC yang siap digunakan baterai dan kelistrikan mobil.",
            "• Regulator: Pengatur tegangan yang menstabilkan voltase keluaran alternator agar selalu berada pada rentang aman (13.8V – 14.8V) meskipun putaran mesin berubah-ubah."
          ],
      },
      {
        id: "sec-11-6",
        title: "Lampu Indikator Pengisian (CHG)",
        paragraphs: [
            "Berfungsi memberikan informasi visual kepada pengemudi mengenai status kerja sistem pengisian. Lampu akan menyala saat kunci kontak ON (mesin mati) dan harus padam saat mesin sudah menyala normal."
          ],
      },
      {
        id: "sec-11-7",
        title: "Prinsip Kerja Sistem Pengisian",
        paragraphs: [
            "Prinsip dasar pengisian memanfaatkan hukum induksi elektromagnetik Faraday. Ketika rotor yang dialiri arus eksitasi berputar di dalam stator, kumparan stator memotong garis gaya magnet sehingga timbul Gaya Gerak Listrik (GGL) induksi bolak-balik. Dioda penyearah selanjutnya menyearahkan arus menjadi DC untuk mengisi baterai dan menghidupkan seluruh sensor serta aktuator mesin."
          ],
      },
      {
        id: "sec-11-8",
        title: "Langkah Pemahaman & Analisis Gangguan",
        paragraphs: [
            "Dalam menganalisis sistem pengisian, lakukan tahapan berikut:",
            "1. Pengecekan Tegangan Baterai: Ukur tegangan baterai sebelum mesin dihidupkan (kondisi normal 12.4V - 12.6V).",
            "2. Pengecekan Output Pengisian: Nyalakan mesin pada putaran idle dan putaran 2000 RPM, ukur tegangan pada kutub baterai (kondisi normal 13.8V - 14.8V).",
            "3. Deteksi Gejala Overcharging: Jika tegangan melebihi 15V, regulator mengalami kerusakan dan dapat merusak sel baterai.",
            "4. Deteksi Gejala Undercharging: Jika tegangan tetap di bawah 13V saat mesin hidup, periksa ketegangan tali kipas, keausan sikat arang (carbon brush), atau kerusakan dioda."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Sistem_Pengisian_Mobil_Konvensional_dan_Elektronik/IC.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Sistem Pengisian Mobil Konvensional dan Elektronik/IC",
      description: "Uji pemahaman materi Sistem Pengisian Mobil Konvensional dan Elektronik/IC yang disusun oleh Ardyan Santoso.",
      internalUrl: `/kuis/${toDeterministicUUID(11)}`,
    },
  },
  12: {
    id: 12,
    subject: "Otomotif",
    title: "Sistem Transmisi Manual",
    level: "Menengah",
    duration: "40 Menit",
    author: "Satrio",
    updatedAt: "25 Agustus 2026",
    icon: Car01Icon,
    topics: ["Pengertian Transmisi Manual", "Komponen Transmisi", "Aliran Tenaga Gigi", "Troubleshooting Transmisi"],
    description: "Mempelajari prinsip kerja sistem transmisi manual kendaraan, fungsi kopling dan sinkromes, serta diagnosis gangguan transmisi.",
    imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Sistem Transmisi Manual",
    contentSections: [
      {
        id: "sec-12-1",
        title: "Pengertian Sistem Transmisi Manual",
        paragraphs: [
            "Transmisi manual merupakan salah satu jenis sistem pemindah tenaga (power train) pada kendaraan bermotor yang berfungsi untuk mengatur perbandingan rasio putaran dan torsi antara mesin dengan roda penggerak sesuai dengan kondisi beban kendaraan dan kondisi jalan. Transmisi memungkinkan kendaraan dapat bergerak maju dengan torsi besar pada tanjakan, bergerak cepat di jalan tol, maupun bergerak mundur (reverse)."
          ],
      },
      {
        id: "sec-12-2",
        title: "Fungsi Utama Transmisi Manual",
        paragraphs: [
            "• Meneruskan tenaga putar mesin dari kopling ke poros propeller atau diferensial.",
            "• Mengubah torsi dan kecepatan kendaraan sesuai kebutuhan pengendaraan melalui kombinasi roda gigi.",
            "• Memungkinkan kendaraan berjalan mundur dengan membalikkan arah putaran poros output.",
            "• Memungkinkan posisi netral saat mesin menyala tetapi kendaraan tidak bergerak."
          ],
      },
      {
        id: "sec-12-3",
        title: "Komponen Utama Transmisi Manual",
        paragraphs: [
            "Input Shaft",
            "Poros input yang menerima putaran langsung dari plat kopling mesin dan meneruskannya ke roda gigi counter (counter gear)."
          ],
      },
      {
        id: "sec-12-4",
        title: "Counter Gear & Reverse Idler Gear",
        paragraphs: [
            "Roda gigi perantara yang berputar bersama poros input dan meneruskan putaran ke masing-masing roda gigi percepatan pada poros output."
          ],
      },
      {
        id: "sec-12-5",
        title: "Output Shaft",
        paragraphs: [
            "Poros keluaran transmisi yang menyalurkan putaran dengan rasio gigi yang telah dipilih menuju poros penggerak roda."
          ],
      },
      {
        id: "sec-12-6",
        title: "Mekanisme Synchromesh",
        paragraphs: [
            "Komponen penyinkron putaran yang menyamakan kecepatan putar antara roda gigi percepatan dengan poros output sebelum gigi terkait terkunci, sehingga perpindahan gigi dapat terjadi dengan halus tanpa timbul bunyi benturan roda gigi."
          ],
      },
      {
        id: "sec-12-7",
        title: "Shift Fork & Shift Linkage",
        paragraphs: [
            "Garpu pemindah dan tuas penghubung yang digerakkan oleh pengemudi melalui tuas transmisi (gear lever) untuk menggeser synchromesh hub sleeve."
          ],
      },
      {
        id: "sec-12-8",
        title: "Aliran Tenaga pada Berbagai Posisi Gigi",
        paragraphs: [
            "Posisi Netral: Putaran mesin hanya memutar poros input dan counter gear, roda gigi percepatan berputar bebas di atas poros output tanpa mengunci poros.",
            "Gigi 1 (Torsi Maksimal): Hub sleeve mengunci roda gigi 1. Roda gigi kecil memutar roda gigi besar menghasilkan reduksi putaran besar dan torsi tertinggi untuk start awal.",
            "Gigi Tertinggi (Overdrive): Perbandingan gigi menghasilkan putaran poros output lebih cepat dari poros input untuk efisiensi bahan bakar di kecepatan tinggi.",
            "Gigi Mundur: Roda gigi perantara mundur (reverse idler gear) disisipkan di antara counter gear dan output gear untuk membalikkan arah putaran."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Sistem_Transmisi_Manual.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Sistem Transmisi Manual",
      description: "Uji pemahaman materi Sistem Transmisi Manual yang disusun oleh Satrio.",
      internalUrl: `/kuis/${toDeterministicUUID(12)}`,
    },
  },
  18: {
    id: 18,
    subject: "Keolahragaan",
    title: "Keterampilan Gerak & Taktik Permainan Bola Basket",
    level: "Pemula",
    duration: "40 Menit",
    author: "Brilian Anugraheni",
    updatedAt: "25 Agustus 2026",
    icon: Dumbbell01Icon,
    topics: ["Pendahuluan Bola Basket", "Pola Penyerangan", "Pola Pertahanan", "Keterampilan Gerak"],
    description: "Menguasai keterampilan teknik dasar, pola penyerangan cepat (fast break), pola pertahanan man-to-man dan zone defense pada bola basket.",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Keterampilan Gerak & Taktik Permainan Bola Basket",
    contentSections: [
      {
        id: "sec-18-1",
        title: "Pendahuluan & Pemahaman Permainan",
        paragraphs: [
            "Permainan bola basket merupakan invasion game yang membutuhkan penguasaan gerak kompleks seperti melangkah, berlari, melompat, serta keterpaduan unsur fisik seperti kecepatan, kelincahan, dan daya tahan. Pemain dituntut memiliki kemampuan mengambil keputusan secara taktis dalam situasi dinamis di lapangan."
          ],
      },
      {
        id: "sec-18-2",
        title: "Keterampilan Teknik Dasar Bola Basket",
        paragraphs: [
            "Dribbling (Menggiring Bola)",
            "Teknik memantulkan bola ke lantai menggunakan satu tangan secara bergantian atau berlanjut sambil bergerak. Dribble rendah digunakan untuk melindungi bola dari rebutan lawan, sedangkan dribble tinggi digunakan untuk melakukan serangan cepat."
          ],
      },
      {
        id: "sec-18-3",
        title: "Passing & Catching (Mengoper & Menangkap)",
        paragraphs: [
            "• Chest Pass: Operan setinggi dada untuk kecepatan dan akurasi jarak pendek-menengah.",
            "• Bounce Pass: Operan pantulan lantai untuk melewati pemain bertahan yang memiliki postur tinggi.",
            "• Overhead Pass: Operan dari atas kepala untuk melancarkan serangan balik atau mengumpan ke area dalam."
          ],
      },
      {
        id: "sec-18-4",
        title: "Shooting (Menembak ke Ring)",
        paragraphs: [
            "Upaya memasukkan bola ke keranjang lawan dengan teknik set shoot, jump shoot, atau lay-up shoot yang memadukan awalan langkah dan lonjakan mendekati papan pantul."
          ],
      },
      {
        id: "sec-18-5",
        title: "Pola Penyerangan (Offensive Strategy)",
        paragraphs: [
            "Penyerangan Cepat (Fast Break)",
            "Strategi menyerang secara kilat sebelum tim lawan sempat menyusun barisan pertahanan. Mengandalkan umpan panjang terukur dan kecepatan sprint penyerang sayap."
          ],
      },
      {
        id: "sec-18-6",
        title: "Penyerangan Berpola (Set Play)",
        paragraphs: [
            "Penyerangan terencana menggunakan screen/pick and roll untuk membuka ruang tembak bagi penembak utama atau umpan terobosan ke area paint."
          ],
      },
      {
        id: "sec-18-7",
        title: "Pola Pertahanan (Defensive Strategy)",
        paragraphs: [
            "Pertahanan Satu Lawan Satu (Man-to-Man Defense)",
            "Setiap pemain bertahan memiliki tanggung jawab mengawal ketat satu pemain lawan ke mana pun ia bergerak di area pertahanan."
          ],
      },
      {
        id: "sec-18-8",
        title: "Pertahanan Wilayah (Zone Defense)",
        paragraphs: [
            "Pemain bertahan menjaga daerah tertentu (formasi 2-3 atau 3-2) untuk menutup akses penetrasi ke area keranjang."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Keterampilan_Gerak_&_Taktik_Permainan_Bola_Basket.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Keterampilan Gerak & Taktik Permainan Bola Basket",
      description: "Uji pemahaman materi Keterampilan Gerak & Taktik Permainan Bola Basket yang disusun oleh Brilian Anugraheni.",
      internalUrl: `/kuis/${toDeterministicUUID(18)}`,
    },
  },
  19: {
    id: 19,
    subject: "Keolahragaan",
    title: "Keterampilan Gerak Permainan Bola Voli",
    level: "Pemula",
    duration: "35 Menit",
    author: "Brilian Anugraheni",
    updatedAt: "25 Agustus 2026",
    icon: Dumbbell01Icon,
    topics: ["Pengertian Bola Voli", "Passing Bawah & Atas", "Servis Bawah & Atas", "Smash & Block"],
    description: "Mempelajari teknik dasar passing, servis, smash tajam, dan teknik bendungan (blocking) beregu dalam permainan bola voli.",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Keterampilan Gerak Permainan Bola Voli",
    contentSections: [
      {
        id: "sec-19-1",
        title: "Pengertian Permainan Bola Voli",
        paragraphs: [
            "Bola voli adalah permainan beregu yang dimainkan oleh dua tim dengan masing-masing 6 pemain di lapangan. Setiap tim berusaha menjatuhkan bola di daerah permainan lawan dengan melewatkan bola di atas net serta membatasi sentuhan bola maksimal tiga kali sebelum diseberangkan."
          ],
      },
      {
        id: "sec-19-2",
        title: "Teknik Dasar Passing",
        paragraphs: [
            "Passing Bawah",
            "Merupakan teknik menerima bola yang datang dari servis lawan atau serangan smash dengan menyatukan kedua lengan lurus ke depan bawah dan perkenaan bola pada bidang datar antara pergelangan tangan hingga siku."
          ],
      },
      {
        id: "sec-19-3",
        title: "Passing Atas",
        paragraphs: [
            "Teknik mengoper bola yang berada di atas kepala menggunakan bantalan ujung jari-jari kedua tangan yang membentuk mangkuk terbuka, sangat penting dalam menyusun umpan (set-up) sebelum melakukan smash."
          ],
      },
      {
        id: "sec-19-4",
        title: "Teknik Servis",
        paragraphs: [
            "Servis Bawah",
            "Pukulan awal pembuka permainan dengan memegang bola di depan pinggang dan mengayunkan tangan pemukul dari belakang bawah."
          ],
      },
      {
        id: "sec-19-5",
        title: "Servis Atas",
        paragraphs: [
            "Pukulan servis dengan melambungkan bola di atas kepala kemudian memukul bola dengan telapak tangan terbuka dan pergelangan tangan yang lentur untuk menghasilkan bola menukik atau mengapung (floating serve)."
          ],
      },
      {
        id: "sec-19-6",
        title: "Teknik Smash dan Bendungan (Block)",
        paragraphs: [
            "Smash (Spike)",
            "Pukulan keras menukik ke bidang permainan lawan dengan lompatan vertikal maksimal untuk meraih poin."
          ],
      },
      {
        id: "sec-19-7",
        title: "Bendungan (Block)",
        paragraphs: [
            "Upaya membendung bola smash lawan di dekat net dengan melompat dan menjulurkan kedua tangan ke atas melintasi bibir net agar bola memantul kembali ke lapangan lawan."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Keterampilan_Gerak_Permainan_Bola_Voli.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Keterampilan Gerak Permainan Bola Voli",
      description: "Uji pemahaman materi Keterampilan Gerak Permainan Bola Voli yang disusun oleh Brilian Anugraheni.",
      internalUrl: `/kuis/${toDeterministicUUID(19)}`,
    },
  },
  7: {
    id: 7,
    subject: "Bimbingan Konseling",
    title: "Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri",
    level: "Pemula",
    duration: "30 Menit",
    author: "Innova Riskianugrah R.",
    updatedAt: "25 Agustus 2026",
    icon: UserGroupIcon,
    topics: ["Hakikat Percaya Diri", "Ciri Percaya Diri", "Faktor Pembentuk", "Strategi Pengembangan Diri"],
    description: "Memahami konsep kepercayaan diri remaja, mengenali potensi personal, mengatasi rasa rendah diri, serta strategi membangun konsep diri yang optimis.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri",
    contentSections: [
      {
        id: "sec-7-1",
        title: "Hakikat Kepercayaan Diri",
        paragraphs: [
            "Percaya diri adalah keyakinan terhadap kemampuan dan penilaian diri sendiri dalam menjalankan tugas, mengambil keputusan, serta menghadapi lingkungan dan tantangan baru. Rasa percaya diri bukanlah sifat bawaan mutlak, melainkan sikap mental yang dapat dilatih dan ditumbuhkan melalui pengalaman positif dan refleksi diri yang sehat."
          ],
      },
      {
        id: "sec-7-2",
        title: "Ciri-Ciri Individu yang Memiliki Kepercayaan Diri Sehat",
        paragraphs: [
            "• Bersikap optimis dan memandang kegagalan sebagai peluang belajar, bukan akhir dari kemampuan diri.",
            "• Berani mengemukakan pendapat dan ide dengan santun tanpa merasa takut dihakimi secara berlebihan.",
            "• Mampu menerima kelebihan dan keterbatasan diri secara objektif tanpa terjebak dalam rasa minder (inferiority complex).",
            "• Memiliki kemandirian dalam mengambil keputusan penting tanpa selalu bergantung pada persetujuan orang lain."
          ],
      },
      {
        id: "sec-7-3",
        title: "Faktor-Faktor yang Membentuk Kepercayaan Diri",
        paragraphs: [
            "Konsep Diri Positif",
            "Cara pandang seseorang terhadap dirinya sendiri. Seseorang yang memandang dirinya berharga akan memiliki fondasi keyakinan yang kokoh."
          ],
      },
      {
        id: "sec-7-4",
        title: "Pengalaman dan Pencapaian",
        paragraphs: [
            "Keberhasilan kecil yang diraih secara bertahap memberikan bukti nyata bahwa usaha yang dilakukan membuahkan hasil."
          ],
      },
      {
        id: "sec-7-5",
        title: "Dukungan Lingkungan Sosial",
        paragraphs: [
            "Penerimaan yang suportif dari keluarga, guru, dan teman sebaya memperkuat rasa aman dalam mengekspresikan bakat dan minat."
          ],
      },
      {
        id: "sec-7-6",
        title: "Strategi Menumbuhkan Kepercayaan Diri",
        paragraphs: [
            "1. Kenali Potensi dan Keunikan Diri: Setiap siswa memiliki kecerdasan dan talenta yang berbeda, baik di bidang akademis, teknologi, seni, maupun kepemimpinan.",
            "2. Ubah Dialog Batin Negatif (Self-Talk): Gantikan kalimat 'Saya pasti gagal' menjadi 'Saya akan berusaha semaksimal mungkin dan belajar dari prosesnya'.",
            "3. Berani Melangkah Keluar dari Zona Nyaman: Ambil peran aktif dalam diskusi kelas, presentasi proyek kelompok, atau kegiatan organisasi sekolah."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Membangun_Kepercayaan_Diri_untuk_Mengembangkan_Potensi_Diri.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri",
      description: "Uji pemahaman materi Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri yang disusun oleh Innova Riskianugrah R..",
      internalUrl: `/kuis/${toDeterministicUUID(7)}`,
    },
  },

  8: {
    id: 8,
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
      internalUrl: `/kuis/${toDeterministicUUID(8)}`,
    },
    prevMaterial: { id: 6, title: "Pemrograman Dasar Arduino & Sensor" },
    nextMaterial: { id: 8, title: "Talent Quest: Temukan Potensimu, Kembangkan Dirimu!" },
  },

  13: {
    id: 13,
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
      internalUrl: `/kuis/${toDeterministicUUID(13)}`,
    },
    prevMaterial: { id: 7, title: "Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!" },
    nextMaterial: { id: 16, title: "Jati Diri Tanpa Kenakalan" },
  },

  14: {
    id: 14,
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

  15: {
    id: 15,
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

  16: {
    id: 16,
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

  17: {
    id: 17,
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
  21: {
    id: 21,
    subject: "Elektronika",
    title: "Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri",
    level: "Pemula",
    duration: "35 Menit",
    author: "Fahrul Adiyansa",
    updatedAt: "25 Agustus 2026",
    icon: CpuIcon,
    topics: ["Pengertian K3LH", "Budaya Kerja 5R/5S", "Potensi Bahaya Kelistrikan", "Alat Pelindung Diri (APD)"],
    description: "Penerapan prinsip K3LH di bengkel elektronika, pencegahan kecelakaan kerja, budaya kerja industri (Ringkas, Rapi, Resik, Rawat, Rajin), serta penggunaan APD.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri",
    contentSections: [
      {
        id: "sec-21-1",
        title: "Pengertian K3LH dan Budaya Kerja Industri",
        paragraphs: [
            "Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) merupakan upaya terpadu untuk menciptakan lingkungan kerja yang aman, sehat, nyaman, dan meminimalkan risiko kecelakaan maupun gangguan kesehatan akibat pekerjaan. Dalam bidang teknik elektronika, penerapan K3LH sangat krusial karena aktivitas praktikum berhubungan langsung dengan tegangan listrik, komponen rapuh, solder panas, bahan kimia pelarut PCB, serta instrumen presisi."
          ],
      },
      {
        id: "sec-21-2",
        title: "Budaya Kerja 5R (5S) di Lingkungan Bengkel",
        paragraphs: [
            "Budaya kerja 5R (Ringkas, Rapi, Resik, Rawat, Rajin) diadopsi dari standar industri manufaktur untuk menjamin efisiensi dan keamanan kerja:",
            "• Ringkas (Seiri): Memilah dan menyingkirkan barang yang tidak diperlukan dari meja kerja praktik.",
            "• Rapi (Seiton): Menata peralatan kerja dan komponen sesuai tempatnya dengan pelabelan jelas agar mudah diambil dan dikembalikan.",
            "• Resik (Seiso): Membersihkan area kerja, lantai bengkel, dan instrumen dari debu, sisa potongan kawat, dan timah solder.",
            "• Rawat (Seiketsu): Memelihara standar kebersihan dan kerapian meja praktikum secara konsisten setiap selesai jam pelajaran.",
            "• Rajin (Shitsuke): Membiasakan diri mematuhi peraturan keselamatan kerja tanpa harus selalu diawasi guru instruktur."
          ],
      },
      {
        id: "sec-21-3",
        title: "Identifikasi Bahaya dan Penggunaan Alat Pelindung Diri (APD)",
        paragraphs: [
            "Potensi bahaya di bengkel elektronika meliputi sengatan listrik (electric shock), luka bakar akibat ujung solder panas, iritasi uap asap timah, serta letupan komponen akibat polaritas terbalik. Untuk mencegah cedera, setiap teknisi wajib menggunakan APD yang sesuai: kacamata pelindung (safety glasses), gelang antistatis (ESD wrist strap), masker asap solder, dan alas kaki berisolasi karet."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Keselamatan_dan_Kesehatan_Kerja_serta_Lingkungan_Hidup_(K3LH)_dan_Budaya_Kerja_Industri.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri",
      description: "Uji pemahaman materi Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri yang disusun oleh Fahrul Adiyansa.",
      internalUrl: "/kuis/21",
    },
  },
  22: {
    id: 22,
    subject: "Elektronika",
    title: "Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik",
    level: "Pemula",
    duration: "40 Menit",
    author: "Anisa Susilawati",
    updatedAt: "25 Agustus 2026",
    icon: CpuIcon,
    topics: ["Perkakas Tangan Manual", "Ragam Tang & Obeng", "Power Tools Listrik", "Prosedur K3 & Perawatan"],
    description: "Mengenal dan mengoperasikan ragam perkakas tangan manual (tang kombinasi, rivet, cucut) dan perkakas tangan bertenaga listrik (bor, gerinda, jigsaw) secara aman.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik",
    contentSections: [
      {
        id: "sec-22-1",
        title: "Perkakas Tangan Non Listrik (Manual Hand Tools)",
        paragraphs: [
            "Perkakas tangan non listrik merupakan alat-alat kerja yang dioperasikan sepenuhnya menggunakan tenaga manual manusia. Perkakas ini menjadi alat dasar perakitan perangkat elektronika:",
            "• Tang Kombinasi: Berfungsi memegang, memotong kawat tembaga, dan membengkokkan kaki komponen.",
            "• Tang Potong (Diagonal Plier): Memiliki mata pisau miring khusus memotong kabel dan memotong sisa kaki komponen pada papan PCB.",
            "• Tang Cucut (Long Nose Plier): Memiliki ujung lancip untuk menjangkau ruang sempit dan memegang komponen kecil saat penyolderan.",
            "• Tang Pengupas Kabel (Wire Stripper): Mengupas isolator kabel tanpa melukai inti serat tembaga di dalamnya.",
            "• Obeng (Screwdriver): Obeng plus (Phillips) dan obeng minus (Slotted) dengan ukuran presisi untuk membuka dan mengencangkan baut sasis casing."
          ],
      },
      {
        id: "sec-22-2",
        title: "Perkakas Tangan Listrik (Power Tools)",
        paragraphs: [
            "Perkakas listrik memanfaatkan sumber energi listrik untuk menyelesaikan pekerjaan mekanik secara cepat dan presisi:",
            "• Mesin Bor Tangan (Electric Drill): Digunakan untuk melubangi PCB, plat casing aluminium, dan panel box kontrol.",
            "• Mesin Gerinda Tangan (Angle Grinder): Digunakan untuk memotong sasis logam dan meratakan permukaan material kasar.",
            "• Gergaji Listrik (Jigsaw): Digunakan untuk memotong lembaran akrilik atau plat sasis dengan pola kurva atau sudut tertentu."
          ],
      },
      {
        id: "sec-22-3",
        title: "Prosedur Keselamatan Kerja dan Perawatan",
        paragraphs: [
            "1. Pastikan kabel daya power tool tidak terkelupas sebelum dihubungkan ke stopkontak.",
            "2. Gunakan mata bor dan mata pisau yang tajam dan terkunci kuat pada chuck.",
            "3. Bersihkan debu dan gram sisa pengeboran setelah digunakan, dan lumasi bagian mekanik bergerak secara berkala."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Penggunaan_Perkakas_Kerja_Tangan_Listrik_dan_Non_Listrik.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik",
      description: "Uji pemahaman materi Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik yang disusun oleh Anisa Susilawati.",
      internalUrl: "/kuis/22",
    },
  },
  23: {
    id: 23,
    subject: "Elektronika",
    title: "Gambar Teknik Listrik, Elektronika, dan Instrumentasi",
    level: "Pemula",
    duration: "45 Menit",
    author: "Banu Mahmuda H.",
    updatedAt: "25 Agustus 2026",
    icon: CpuIcon,
    topics: ["Pengertian Gamtek", "Standarisasi Gambar", "Simbol Komponen Elektronika", "Diagram Skematik & Wiring"],
    description: "Memahami bahasa visual gambar teknik, standarisasi ISO, pembacaan simbol komponen elektronika dan instrumentasi, serta perancangan diagram skematik.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Gambar Teknik Listrik, Elektronika, dan Instrumentasi",
    contentSections: [
      {
        id: "sec-23-1",
        title: "Pengertian dan Fungsi Gambar Teknik",
        paragraphs: [
            "Gambar teknik (gamtek) adalah bahasa visual baku berupa garis, simbol, dan ukuran terstandar untuk menyampaikan ide perancangan sistem atau perangkat secara universal. Dalam bidang elektronika, gambar teknik menjadi panduan pasti dalam fabrikasi papan PCB, perakitan panel kontrol, penelusuran jalur kelistrikan, serta pemeliharaan sistem industri."
          ],
      },
      {
        id: "sec-23-2",
        title: "Standarisasi Gambar Teknik Elektronika",
        paragraphs: [
            "Agar gambar teknik dapat dipahami oleh teknisi dan insinyur di seluruh dunia, gambar harus mengacu pada standar internasional seperti ISO (International Organization for Standardization) dan IEC (International Electrotechnical Commission). Standar ini mengatur ukuran kertas gambar (A4, A3), jenis garis (garis tebal kontur, garis putus-putus tersembunyi, garis strip-titik sumbu), serta etiket gambar (kepala gambar/title block)."
          ],
      },
      {
        id: "sec-23-3",
        title: "Simbol Komponen Elektronika dan Instrumentasi",
        paragraphs: [
            "Gambar skematik menggunakan simbol grafis baku untuk merepresentasikan komponen fisik:",
            "• Komponen Pasif: Simbol resistor (gerigi/persegi panjang), kapasitor (garis sejajar kutub), dan induktor (lilitan spiral).",
            "• Semikonduktor: Simbol dioda (segitiga dengan garis katoda), transistor BJT (tanda panah emitor NPN/PNP), dan transistor MOSFET.",
            "• Sumber Daya & Proteksi: Simbol ground, sumber tegangan DC/AC, fuse/sekring, dan transformator."
          ],
      },
      {
        id: "sec-23-4",
        title: "Jenis-Jenis Diagram Kelistrikan",
        paragraphs: [
            "Diagram Blok (Block Diagram): Menunjukkan fungsi keseluruhan sistem dalam bentuk kotak-kotak fungsional beserta alur sinyal utama.",
            "Diagram Skematik (Schematic Diagram): Menampilkan detail koneksi kelistrikan seluruh pin komponen secara logis.",
            "Diagram Tata Letak (Wiring & Layout Diagram): Menunjukkan posisi fisik komponen sesungguhnya pada papan PCB atau panel rak."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Gambar_Teknik_Listrik,_Elektronika,_dan_Instrumentasi.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Gambar Teknik Listrik, Elektronika, dan Instrumentasi",
      description: "Uji pemahaman materi Gambar Teknik Listrik, Elektronika, dan Instrumentasi yang disusun oleh Banu Mahmuda H..",
      internalUrl: "/kuis/23",
    },
  },
  24: {
    id: 24,
    subject: "Elektronika",
    title: "Alat Ukur Listrik, Elektronika, dan Instrumentasi",
    level: "Pemula",
    duration: "40 Menit",
    author: "Tubagus Fauzan A.",
    updatedAt: "25 Agustus 2026",
    icon: CpuIcon,
    topics: ["Voltmeter & Amperemeter", "Multimeter Analog & Digital", "Osiloskop", "Prosedur Pengukuran Aman"],
    description: "Pengenalan fungsi dan cara pengoperasian alat ukur kelistrikan dan instrumentasi (Multitester, Osciloscope, Signal Generator) secara presisi.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Alat Ukur Listrik, Elektronika, dan Instrumentasi",
    contentSections: [
      {
        id: "sec-24-1",
        title: "Klasifikasi Alat Ukur Kelistrikan",
        paragraphs: [
            "Alat ukur adalah instrumen yang digunakan untuk mengukur dan membandingkan besaran fisis listrik terhadap satuan standar yang telah ditetapkan. Pemilihan alat ukur yang tepat menjamin keakuratan analisis rangkaian."
          ],
      },
      {
        id: "sec-24-2",
        title: "Jenis-Jenis Alat Ukur Utama",
        paragraphs: [
            "Voltmeter",
            "Alat yang digunakan untuk mengukur beda potensial atau tegangan listrik antara dua titik. Voltmeter dipasang secara PARALEL dengan komponen yang diukur."
          ],
      },
      {
        id: "sec-24-3",
        title: "Amperemeter",
        paragraphs: [
            "Alat untuk mengukur kuat arus listrik yang mengalir dalam suatu rangkaian tertutup. Amperemeter harus dipasang secara SERI dengan beban listrik."
          ],
      },
      {
        id: "sec-24-4",
        title: "Ohmmeter",
        paragraphs: [
            "Alat untuk mengukur nilai resistansi hambatan komponen resistor atau memeriksa kontinuitas jalur kawat tembaga. Pengukuran resistansi wajib dilakukan saat rangkaian BEBAS TEGANGAN (daya mati)."
          ],
      },
      {
        id: "sec-24-5",
        title: "Multimeter (Multitester / AVO Meter)",
        paragraphs: [
            "Instrumen serbaguna yang menggabungkan fungsi pengukuran Ampere, Volt, dan Ohm dalam satu unit. Tersedia dalam tipe Analog (dengan jarum penunjuk kalibrasi) dan Digital (dengan tampilan angka LCD berakurasi tinggi)."
          ],
      },
      {
        id: "sec-24-6",
        title: "Osiloskop (Oscilloscope)",
        paragraphs: [
            "Instrumen canggih yang menampilkan bentuk visual gelombang sinyal listrik terhadap waktu. Digunakan untuk mengukur frekuensi, amplitude puncak-ke-puncak (Vpp), serta mendeteksi distorsi sinyal audio atau PWM."
          ],
      },
      {
        id: "sec-24-7",
        title: "Prosedur Pengukuran yang Benar",
        paragraphs: [
            "1. Atur batas ukur (range selector) pada posisi lebih tinggi dari estimasi tegangan yang akan diukur guna mencegah kerusakan meter.",
            "2. Perhatikan polaritas colok ukur (probe merah untuk positif, probe hitam untuk negatif/ground)."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Alat_Ukur_Listrik,_Elektronika,_dan_Instrumentasi.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Alat Ukur Listrik, Elektronika, dan Instrumentasi",
      description: "Uji pemahaman materi Alat Ukur Listrik, Elektronika, dan Instrumentasi yang disusun oleh Tubagus Fauzan A..",
      internalUrl: "/kuis/24",
    },
  },
  25: {
    id: 25,
    subject: "Elektronika",
    title: "Komponen Elektronika Pasif dan Aktif",
    level: "Pemula",
    duration: "35 Menit",
    author: "Vella Pratika I. N.",
    updatedAt: "25 Agustus 2026",
    icon: CpuIcon,
    topics: ["Resistor & Kapasitor", "Induktor", "Dioda & Transistor", "IC (Integrated Circuit)"],
    description: "Membedah karakteristik dan prinsip kerja komponen pasif (resistor, kapasitor, induktor) dan komponen aktif (dioda, transistor, IC) dalam rangkaian elektronika.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Komponen Elektronika Pasif dan Aktif",
    contentSections: [
      {
        id: "sec-25-1",
        title: "Komponen Elektronika Pasif",
        paragraphs: [
            "Komponen pasif adalah jenis komponen elektronika yang dalam pengoperasiannya tidak memerlukan sumber daya arus listrik eksternal dan tidak dapat memperkuat sinyal listrik:"
          ],
      },
      {
        id: "sec-25-2",
        title: "Resistor",
        paragraphs: [
            "Komponen yang berfungsi menghambat dan mengatur aliran arus listrik serta membagi tegangan. Nilai hambatan resistor dinyatakan dalam satuan Ohm (Ω) dan dapat dibaca melalui kode gelang warna atau kode angka SMD."
          ],
      },
      {
        id: "sec-25-3",
        title: "Kapasitor (Kondensator)",
        paragraphs: [
            "Komponen yang berfungsi menyimpan muatan listrik sementara dalam medan elektrostatik. Digunakan sebagai penyaring riak tegangan (filter power supply), kopling sinyal AC, dan pembangkit osilasi. Dinyatakan dalam satuan Farad (F)."
          ],
      },
      {
        id: "sec-25-4",
        title: "Induktor (Kumparan)",
        paragraphs: [
            "Komponen lilitan kawat tembaga yang menyimpan energi dalam bentuk medan magnet ketika dialiri arus listrik. Berfungsi menahan arus bolak-balik frekuensi tinggi dan menjadi bagian utama transformator serta filter frekuensi."
          ],
      },
      {
        id: "sec-25-5",
        title: "Komponen Elektronika Aktif",
        paragraphs: [
            "Komponen aktif adalah komponen elektronika yang membutuhkan arus atau tegangan eksternal agar dapat bekerja, serta mampu mengalirkan, mengontrol, dan memperkuat daya sinyal listrik:"
          ],
      },
      {
        id: "sec-25-6",
        title: "Dioda Semikonduktor",
        paragraphs: [
            "Komponen sambungan P-N yang berfungsi mengalirkan arus listrik hanya ke satu arah (bias maju) dan memblokir arah sebaliknya (bias mundur). Digunakan sebagai penyearah arus, penstabil tegangan (Dioda Zener), dan pemancar cahaya (LED)."
          ],
      },
      {
        id: "sec-25-7",
        title: "Transistor",
        paragraphs: [
            "Komponen semikonduktor dengan 3 kaki elektroda (Basis, Kolektor, Emitor untuk BJT atau Gate, Drain, Source untuk FET). Berfungsi sebagai penguat sinyal (amplifier) dan saklar elektronik berkecepatan tinggi (switching)."
          ],
      },
      {
        id: "sec-25-8",
        title: "Integrated Circuit (IC)",
        paragraphs: [
            "Komponen mikroelektronika yang mengintegrasikan ribuan hingga jutaan transistor, dioda, dan resistor dalam satu kemasan chip silikon kecil."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Komponen_Elektronika_Pasif_dan_Aktif.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Komponen Elektronika Pasif dan Aktif",
      description: "Uji pemahaman materi Komponen Elektronika Pasif dan Aktif yang disusun oleh Vella Pratika I. N..",
      internalUrl: "/kuis/25",
    },
  },
  26: {
    id: 26,
    subject: "Elektronika",
    title: "Dasar Kelistrikan dan Hukum-Hukum Kelistrikan",
    level: "Pemula",
    duration: "40 Menit",
    author: "Nova Milyard",
    updatedAt: "25 Agustus 2026",
    icon: CpuIcon,
    topics: ["Arus, Tegangan & Hambatan", "Hukum Ohm", "Hukum Kirchhoff I & II", "Daya dan Energi Listrik"],
    description: "Konsep dasar besaran listrik, aplikasi perhitungan Hukum Ohm, analisis percabangan Hukum Kirchhoff, dan efisiensi konsumsi daya listrik.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Materi Pembelajaran Dasar Kelistrikan dan Hukum-Hukum Kelistrikan",
    contentSections: [
      {
        id: "sec-26-1",
        title: "Besaran Dasar Kelistrikan",
        paragraphs: [
            "Kelistrikan bertumpu pada aliran muatan partikel elektron dalam bahan konduktor:",
            "• Tegangan Listrik (Volt / V): Beda potensial listrik yang mendorong muatan elektron bergerak melalui rangkaian.",
            "• Kuat Arus Listrik (Ampere / A): Jumlah muatan listrik yang mengalir melalui suatu penampang kawat per satuan detik.",
            "• Hambatan Listrik (Ohm / Ω): Derajat perlawanan suatu material terhadap aliran arus listrik."
          ],
      },
      {
        id: "sec-26-2",
        title: "Hukum Ohm",
        paragraphs: [
            "Hukum Ohm dirumuskan oleh George Simon Ohm, menyatakan bahwa kuat arus listrik (I) yang mengalir melalui suatu penghantar berbanding lurus dengan beda potensial atau tegangan (V) dan berbanding terbalik dengan nilai hambatan (R).",
            "Persamaan matematis: V = I × R, I = V / R, R = V / I."
          ],
      },
      {
        id: "sec-26-3",
        title: "Hukum Kirchhoff",
        paragraphs: [
            "Hukum Kirchhoff I (Hukum Titik Cabang / KCL)",
            "Jumlah kuat arus listrik yang masuk ke suatu titik percabangan sama dengan jumlah kuat arus listrik yang keluar dari titik percabangan tersebut (Σ I_masuk = Σ I_keluar)."
          ],
      },
      {
        id: "sec-26-4",
        title: "Hukum Kirchhoff II (Hukum Loop Tegangan / KVL)",
        paragraphs: [
            "Dalam suatu rangkaian tertutup (loop), jumlah aljabar gaya gerak listrik (GGL) dan penurunan tegangan sama dengan nol (Σ E + Σ (I × R) = 0)."
          ],
      },
      {
        id: "sec-26-5",
        title: "Daya dan Energi Listrik",
        paragraphs: [
            "Daya listrik (P) adalah laju konsumsi energi listrik per satuan waktu, dinyatakan dalam satuan Watt (W).",
            "Persamaan daya listrik: P = V × I = I² × R = V² / R.",
            "Memahami perhitungan daya sangat penting untuk menentukan batas aman kapasitas sekring dan pembebanan rangkaian perangkat elektronik industri."
          ],
      }
    ],
    attachment: {
      fileName: "Modul_Dasar_Kelistrikan_dan_Hukum-Hukum_Kelistrikan.pdf",
      fileSize: "2.1 MB",
    },
    quizSource: {
      type: "internal",
      title: "Kuis Evaluasi: Dasar Kelistrikan dan Hukum-Hukum Kelistrikan",
      description: "Uji pemahaman materi Dasar Kelistrikan dan Hukum-Hukum Kelistrikan yang disusun oleh Nova Milyard.",
      internalUrl: "/kuis/26",
    },
  },
};

export { MATERIAL_DATABASE };



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

export function stripHtml(html: string = ''): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function SmartParagraph({ text }: { text: string }) {
  if (!text) return null;

  // 1. Check if the string is pure empty HTML (e.g. <p></p>, <p><br></p>, or <p class="..."></p>)
  const strippedText = text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  if (!strippedText && (text.includes('<') || text.trim().length === 0)) {
    return null;
  }

  // 2. If text contains HTML tags (e.g. <p class="...">, <ol>, <ul>, <li>, etc.)
  if (/<[a-z][\s\S]*>/i.test(text)) {
    const cleanHtml = text
      .replace(/<\/?(strong|b)\b[^>]*>/gi, '')
      .replace(/font-weight\s*:\s*[^;"]+;?/gi, '');
    return (
      <div
        className="prose-content text-xs md:text-sm font-medium text-[#4A4A4A] leading-relaxed text-justify [&_ol]:pl-6 [&_ol]:my-1.5 [&_ol]:space-y-1 [&_ol:not(.list-alpha):not([type='a']):not([type='A'])]:list-decimal [&_ol.list-alpha]:list-[lower-alpha] [&_ol[type='a']]:list-[lower-alpha] [&_ol[type='A']]:list-[upper-alpha] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-1.5 [&_ul]:space-y-1 [&_li]:pl-1 [&_li]:text-justify [&_p]:mb-2 last:[&_p]:mb-0"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  }

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const renderLine = (line: string, idx: number) => {
    // Check list markers: 1. , 1) , a. , a) , A. , A) , • , - , *
    const listMatch = line.match(/^(\d+[\.\)]|[a-zA-Z][\.\)]|[•\-\*])\s+(.*)$/);
    if (listMatch) {
      const marker = listMatch[1];
      const body = listMatch[2];
      return (
        <div key={idx} className="flex items-start gap-2.5 pl-1 my-1">
          <span className="font-semibold text-[#2E2D2D] shrink-0 min-w-[1.25rem] select-none text-xs md:text-sm">
            {marker === '-' || marker === '*' ? '•' : marker}
          </span>
          <span className="flex-1 text-xs md:text-sm font-medium text-[#4A4A4A] leading-relaxed text-justify">
            {body}
          </span>
        </div>
      );
    }

    return (
      <p key={idx} className="text-xs md:text-sm font-medium text-[#4A4A4A] leading-relaxed text-justify">
        {line}
      </p>
    );
  };

  if (lines.length > 1) {
    return <div className="space-y-2">{lines.map(renderLine)}</div>;
  }

  if (lines.length === 1) {
    return renderLine(lines[0], 0);
  }

  return (
    <p className="text-xs md:text-sm font-medium text-[#4A4A4A] leading-relaxed whitespace-pre-line text-justify">
      {text}
    </p>
  );
}

export const idToModuleKey: Record<number, string> = {
  22: 'mod-pte-01',
  21: 'mod-pte-02',
  23: 'mod-pte-03',
  24: 'mod-pte-04',
  25: 'mod-pte-05',
  26: 'mod-pte-06',
  11: 'mod-oto-01',
  12: 'mod-oto-02',
  18: 'mod-pjok-01',
  19: 'mod-pjok-02',
  7: 'mod-bk-01',
  8: 'mod-bk-1',
  13: 'mod-bk-2',
  14: 'mod-bk-3',
  15: 'mod-bk-4',
  16: 'mod-bk-5',
  17: 'mod-bk-6',
  1: 'mod-inf-1',
  2: 'mod-inf-2',
  3: 'mod-inf-3',
  4: 'mod-inf-4',
  9: 'mod-tari-1',
  10: 'mod-tari-2',
};

export const moduleKeyToId: Record<string, number> = {
  'mod-pte-01': 22,
  'mod-pte-02': 21,
  'mod-pte-03': 23,
  'mod-pte-04': 24,
  'mod-pte-05': 25,
  'mod-pte-06': 26,
  'mod-oto-01': 11,
  'mod-oto-02': 12,
  'mod-ot-01': 11,
  'mod-ot-02': 12,
  'mod-pjok-01': 18,
  'mod-pjok-02': 19,
  'mod-bk-01': 7,
  'mod-bk-1': 8,
  'mod-bk-2': 13,
  'mod-bk-3': 14,
  'mod-bk-4': 15,
  'mod-bk-5': 16,
  'mod-bk-6': 17,
  'mod-inf-1': 1,
  'mod-inf-2': 2,
  'mod-inf-3': 3,
  'mod-inf-4': 4,
  'mod-tari-1': 9,
  'mod-tari-2': 10,
  'mod-str-1': 9,
  'mod-str-2': 10,
};

export function getMaterialDetailForModule(moduleIdOrTitle?: string | number): MaterialDetail | undefined {
  if (!moduleIdOrTitle) return undefined;

  const str = String(moduleIdOrTitle).toLowerCase().trim();
  const mapKey = moduleKeyToId;

  if (mapKey[str] && MATERIAL_DATABASE[mapKey[str]]) {
    return MATERIAL_DATABASE[mapKey[str]];
  }

  const numId = Number(moduleIdOrTitle);
  if (!isNaN(numId) && MATERIAL_DATABASE[numId]) {
    return MATERIAL_DATABASE[numId];
  }

  const allEntries = Object.values(MATERIAL_DATABASE);
  const foundByTitle = allEntries.find((m) => {
    const t = m.title.toLowerCase().trim();
    return t === str || t.includes(str) || str.includes(t);
  });

  return foundByTitle;
}

export function getMaterialBlocksForModule(moduleIdOrTitle?: string | number): any[] {
  const detail = getMaterialDetailForModule(moduleIdOrTitle);
  if (!detail) return [];

  const blocks: any[] = [];
  let blockCounter = 1;

  if (detail.videoSection && detail.videoSection.videoUrl) {
    blocks.push({
      id: `blk-${blockCounter++}`,
      type: 'video',
      sectionTitle: detail.videoSection.caption || 'Video Simulasi & Pembelajaran',
      mediaUrl: detail.videoSection.videoUrl,
      imageCaption: detail.videoSection.caption || '',
    });
  }

  if (detail.contentSections && detail.contentSections.length > 0) {
    detail.contentSections.forEach((sec: ContentSection) => {
      blocks.push({
        id: `blk-${blockCounter++}`,
        type: sec.codeSnippet ? 'code' : 'text',
        sectionTitle: sec.title || '',
        textValue: sec.paragraphs ? sec.paragraphs.join('\n\n') : '',
        alignment: 'left',
        codeSnippet: sec.codeSnippet,
      });
    });
  }

  if (detail.stepByStepSection && detail.stepByStepSection.steps && detail.stepByStepSection.steps.length > 0) {
    blocks.push({
      id: `blk-${blockCounter++}`,
      type: 'steps',
      stepSectionTitle: (detail.stepByStepSection as any).title || (detail.stepByStepSection as any).sectionTitle || 'Langkah-langkah Praktik',
      stepSectionSubtitle: (detail.stepByStepSection as any).description || (detail.stepByStepSection as any).sectionSubtitle || '',
      steps: detail.stepByStepSection.steps.map((s: any) => ({
        title: s.title || '',
        desc: s.description || s.text || '',
      })),
    });
  }

  if (detail.attachment && detail.attachment.fileName) {
    blocks.push({
      id: `blk-${blockCounter++}`,
      type: 'attachment',
      attachments: [
        {
          id: `att-${blockCounter}`,
          fileName: detail.attachment.fileName,
          fileSize: detail.attachment.fileSize || '2.0 MB',
          fileUrl: (detail.attachment as any).fileUrl || '#',
        },
      ],
    });
  }

  return blocks;
}

export default function MateriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const rawId = resolvedParams?.id || "";
  const id = decodeURIComponent(rawId).trim();
  const normalizedId = id.replace(/\s+/g, '-').toLowerCase();
  const spaceId = id.replace(/-/g, ' ').toLowerCase();

  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");

  const { modules, quizzes } = useAdminStore();
  const [remoteModule, setRemoteModule] = useState<ModuleItem | null>(() => {
    return ModuleService.getModuleById(id) || ModuleService.getModuleById(normalizedId);
  });

  useEffect(() => {
    const localMod = ModuleService.getModuleById(id) || ModuleService.getModuleById(normalizedId);
    if (localMod) {
      setRemoteModule(localMod);
    }
    ModuleService.fetchFromSupabase().then((all) => {
      const found = all.find((m) => {
        const mId = String(m.id || '').trim().toLowerCase();
        return mId === id.toLowerCase() || mId === normalizedId || mId === spaceId;
      });
      if (found) {
        setRemoteModule(found);
      }
    });
  }, [id, normalizedId, spaceId]);

  const handleDownloadAttachment = async (fileName?: string, fileUrl?: string) => {
    const cleanName = (fileName || 'Modul_Pembelajaran_Sitemsa.pdf').trim();

    // 1. Data URL (Base64)
    if (fileUrl && fileUrl.startsWith('data:')) {
      try {
        showToast(`Mengunduh ${cleanName}...`);
        const arr = fileUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = cleanName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        showToast(`Berkas ${cleanName} berhasil diunduh!`);
        return;
      } catch (e) {
        console.warn('Base64 download error:', e);
      }
    }

    // 2. Real URL (Supabase Storage / Remote CDN)
    if (fileUrl && fileUrl.startsWith('http')) {
      try {
        showToast(`Mengunduh ${cleanName}...`);
        const res = await fetch(fileUrl);
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = cleanName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
          showToast(`Berkas ${cleanName} berhasil diunduh!`);
          return;
        }
      } catch (err) {
        console.warn('Direct fetch download error, opening link:', err);
      }

      // Fallback for CORS: trigger browser direct download/view
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = cleanName;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Mengunduh ${cleanName}...`);
      return;
    }

    // 3. Fallback standard PDF generator
    try {
      showToast(`Mengunduh ${cleanName}...`);
      const validBlob = generateValidPdfBlob(
        material.title,
        material.subject,
        material.author,
        cleanName
      );
      const blobUrl = window.URL.createObjectURL(validBlob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = cleanName.toLowerCase().endsWith('.pdf') ? cleanName : `${cleanName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      showToast(`Berkas ${cleanName} berhasil diunduh!`);
    } catch {
      showToast(`Berkas ${cleanName} berhasil diunduh!`);
    }
  };

  const baseMaterial = useMemo(() => {
    const fromStatic = getMaterialDetailForModule(id) || getMaterialDetailForModule(normalizedId);
    if (fromStatic) return fromStatic;
    const numId = parseInt(id, 10);
    if (!isNaN(numId) && MATERIAL_DATABASE[numId]) return MATERIAL_DATABASE[numId];
    return {
      ...MATERIAL_DATABASE[1],
      imageUrl: '',
      quizSource: undefined,
    };
  }, [id, normalizedId]);

  // Construct dynamic live material merging admin store changes
  const material = useMemo(() => {
    const numId = parseInt(id, 10);
    const targetKey = !isNaN(numId) ? idToModuleKey[numId] : id;

    const storeMod =
      modules.find((m) => {
        const mId = String(m.id || '').trim().toLowerCase();
        const mTitle = String(m.title || '').trim().toLowerCase();
        const mUuid = toDeterministicUUID(m.id).toLowerCase();
        return (
          mId === id.toLowerCase() ||
          mId === normalizedId ||
          mId === spaceId ||
          mUuid === id.toLowerCase() ||
          (targetKey && m.id === targetKey) ||
          (!isNaN(numId) && moduleKeyToId[m.id] === numId) ||
          mTitle === id.toLowerCase() ||
          mTitle === spaceId
        );
      }) || remoteModule;

    if (!storeMod) return baseMaterial;

    const hasConfiguredQuizSource = Boolean(
      storeMod.quizSource &&
      (storeMod.quizSource.title || storeMod.quizSource.externalUrl || storeMod.quizSource.qrImageUrl)
    );

    let resolvedQuizSource: any = undefined;
    if (hasConfiguredQuizSource && storeMod.quizSource) {
      const rawType = String(storeMod.quizSource.type || '').toLowerCase();
      const isInternal = rawType === 'kuis_sitemsa' || rawType === 'internal';
      const isQr = rawType === 'qr_code' || rawType === 'barcode';
      const resolvedType: 'internal' | 'barcode' | 'external_link' = isInternal ? 'internal' : isQr ? 'barcode' : 'external_link';

      let extPlatformName = 'Platform Eksternal';
      if (storeMod.quizSource.externalUrl) {
        const urlLower = storeMod.quizSource.externalUrl.toLowerCase();
        if (urlLower.includes('forms.google') || urlLower.includes('docs.google.com/forms')) {
          extPlatformName = 'Google Forms';
        } else if (urlLower.includes('quizizz.com')) {
          extPlatformName = 'Quizizz';
        } else if (urlLower.includes('kahoot')) {
          extPlatformName = 'Kahoot';
        }
      }

      resolvedQuizSource = {
        type: resolvedType,
        title: storeMod.quizSource.title || 'Uji Pemahaman Materi',
        description: 'Ikuti kuis evaluasi untuk menguji pemahaman materi ini.',
        externalUrl: storeMod.quizSource.externalUrl,
        qrImageUrl: storeMod.quizSource.qrImageUrl,
        externalPlatformName: extPlatformName,
        internalUrl: `/kuis/${toDeterministicUUID(storeMod.id)}`,
      };
    }

    let orderedBlocks: any[] = [];

    // If storeMod has blocks, build contentSections, stepByStepSection, videoSection, attachment AND keep orderedBlocks strictly in sequence
    if (storeMod.blocks && storeMod.blocks.length > 0) {
      orderedBlocks = storeMod.blocks;

      const dynamicSections: ContentSection[] = [];
      let dynamicStepByStep: any = undefined;
      let dynamicVideo: any = undefined;
      let dynamicAttachment: any = undefined;

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
            id: block.id || `sec-${bIdx + 1}`,
            title: block.sectionTitle || 'Heading',
            elements: block.elements && block.elements.length > 0 ? block.elements : undefined,
            paragraphs: paragraphs,
            items: items.length > 0 ? items : undefined,
            callout: block.calloutText || undefined,
          });
        } else if (block.type === 'code' && block.codeSnippet) {
          dynamicSections.push({
            id: block.id || `sec-code-${bIdx + 1}`,
            title: block.sectionTitle || '',
            paragraphs: [],
            codeSnippet: block.codeSnippet,
          });
        } else if (block.type === 'image' && block.mediaUrl) {
          dynamicSections.push({
            id: block.id || `sec-img-${bIdx + 1}`,
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
              text: s.desc || s.text || '',
            })),
          };
        } else if (block.type === 'attachment' && block.attachments && block.attachments.length > 0) {
          const firstAtt = block.attachments[0];
          dynamicAttachment = {
            fileName: firstAtt.fileName || firstAtt.name || 'Dokumen_Lampiran.pdf',
            fileSize: firstAtt.fileSize || firstAtt.size || '2.0 MB',
            fileUrl: firstAtt.fileUrl || firstAtt.url || '',
          };
        }
      });

      return {
        ...baseMaterial,
        id: (storeMod.id as any) || baseMaterial.id,
        subject: storeMod.subject || baseMaterial.subject,
        title: storeMod.title || baseMaterial.title,
        description: storeMod.description || baseMaterial.description,
        level: (storeMod.level as any) || baseMaterial.level,
        duration: storeMod.duration || baseMaterial.duration,
        author: storeMod.teacherName || baseMaterial.author,
        updatedAt: storeMod.updatedAt || storeMod.createdAt || baseMaterial.updatedAt,
        topics: storeMod.topics || baseMaterial.topics,
        imageUrl: storeMod.thumbnail || baseMaterial.imageUrl,
        orderedBlocks: orderedBlocks,
        contentSections: dynamicSections.length > 0 ? dynamicSections : (storeMod.description ? [{ id: 'sec-1', title: storeMod.title, paragraphs: [storeMod.description] }] : baseMaterial.contentSections),
        stepByStepSection: dynamicStepByStep || (dynamicSections.length > 0 ? undefined : baseMaterial.stepByStepSection),
        videoSection: dynamicVideo || (dynamicSections.length > 0 ? undefined : baseMaterial.videoSection),
        attachment: dynamicAttachment || undefined,
        quizSource: resolvedQuizSource,
      };
    }

    // Fallback: build orderedBlocks from baseMaterial
    if (baseMaterial.videoSection && baseMaterial.videoSection.videoUrl) {
      orderedBlocks.push({
        id: 'video-tutorial',
        type: 'video',
        sectionTitle: baseMaterial.videoSection.title || 'Video Simulasi & Pembelajaran',
        mediaUrl: baseMaterial.videoSection.videoUrl,
        imageCaption: baseMaterial.videoSection.caption || '',
      });
    }

    if (baseMaterial.contentSections && baseMaterial.contentSections.length > 0) {
      baseMaterial.contentSections.forEach((sec: ContentSection) => {
        orderedBlocks.push({
          id: sec.id,
          type: sec.codeSnippet ? 'code' : 'text',
          sectionTitle: sec.title || '',
          paragraphs: sec.paragraphs,
          elements: sec.elements,
          items: sec.items,
          callout: sec.callout,
          codeSnippet: sec.codeSnippet,
        });
      });
    }

    if (baseMaterial.stepByStepSection && baseMaterial.stepByStepSection.steps && baseMaterial.stepByStepSection.steps.length > 0) {
      orderedBlocks.push({
        id: 'langkah-praktik',
        type: 'steps',
        stepSectionTitle: baseMaterial.stepByStepSection.title || 'Langkah-langkah Praktik',
        stepSectionSubtitle: baseMaterial.stepByStepSection.description || '',
        steps: baseMaterial.stepByStepSection.steps.map((s: any) => ({
          title: s.title || '',
          desc: s.text || s.description || '',
          mediaUrl: s.mediaUrl,
        })),
      });
    }

    if (baseMaterial.attachment && baseMaterial.attachment.fileName) {
      orderedBlocks.push({
        id: 'lampiran-materi',
        type: 'attachment',
        attachments: [
          {
            id: 'att-1',
            fileName: baseMaterial.attachment.fileName,
            fileSize: baseMaterial.attachment.fileSize || '2.0 MB',
            fileUrl: baseMaterial.attachment.fileUrl || '#',
          },
        ],
      });
    }

    return {
      ...baseMaterial,
      id: (storeMod.id as any) || baseMaterial.id,
      subject: storeMod.subject || baseMaterial.subject,
      title: storeMod.title || baseMaterial.title,
      description: storeMod.description || baseMaterial.description,
      level: (storeMod.level as any) || baseMaterial.level,
      duration: storeMod.duration || baseMaterial.duration,
      author: storeMod.teacherName || baseMaterial.author,
      updatedAt: storeMod.updatedAt || storeMod.createdAt || baseMaterial.updatedAt,
      topics: storeMod.topics || baseMaterial.topics,
      imageUrl: storeMod.thumbnail || baseMaterial.imageUrl,
      orderedBlocks: orderedBlocks,
      attachment: undefined,
      contentSections: storeMod.description ? [{ id: 'sec-1', title: storeMod.title, paragraphs: [storeMod.description] }] : baseMaterial.contentSections,
      quizSource: resolvedQuizSource,
    };
  }, [baseMaterial, modules, remoteModule, id]);

  // Find linked quiz created by teacher / admin
  const activeQuizInfo = useMemo(() => {
    const cleanId = String(id || "").toLowerCase();
    const cleanTitle = String(material.title || "").toLowerCase();

    // Specific match only
    const byQuiz = quizzes.find(
      (q) =>
        (q.moduleId && (q.moduleId === id || q.moduleId.toLowerCase() === cleanId || toDeterministicUUID(q.moduleId) === cleanId)) ||
        q.id === id ||
        toDeterministicUUID(q.id) === cleanId ||
        (q.title && cleanTitle && q.title.toLowerCase().trim() === cleanTitle)
    );

    const title =
      byQuiz?.title ||
      (material.quizSource?.title &&
      material.quizSource.title !== "Kuis Evaluasi" &&
      material.quizSource.title !== "Uji Pemahaman Materi"
        ? material.quizSource.title
        : `Kuis ${material.title || "Evaluasi"}`);
    const passScore = byQuiz?.passScore || 75;

    return {
      title,
      passScore,
      quizId: toDeterministicUUID(byQuiz?.id || material.id || id),
    };
  }, [quizzes, material, id]);

  const tocItems = useMemo(() => {
    const blocks = material.orderedBlocks || [];
    const items: { id: string; label: string }[] = [];

    blocks.forEach((b: any, idx: number) => {
      const blockId = b.id || `block-${idx}`;
      if (b.type === 'video' && b.mediaUrl) {
        items.push({ id: blockId, label: stripHtml(b.sectionTitle) || 'Video Simulasi & Pembelajaran' });
      } else if (b.type === 'steps' && b.steps && b.steps.length > 0) {
        items.push({ id: blockId, label: stripHtml(b.stepSectionTitle) || 'Langkah Kerja & Panduan Praktik' });
      } else if (b.type === 'code' && b.codeSnippet) {
        items.push({ id: blockId, label: stripHtml(b.sectionTitle) || `Kode Program (${b.codeSnippet.language || 'Snippet'})` });
      } else if (b.type === 'attachment' && (b.attachments?.length > 0 || b.attachment)) {
        items.push({ id: blockId, label: 'Lampiran & Berkas Modul' });
      } else if (b.type === 'text' && b.sectionTitle && b.sectionTitle.trim().length > 0) {
        items.push({ id: blockId, label: stripHtml(b.sectionTitle) });
      } else if (b.type === 'image' && b.imageCaption && b.imageCaption.trim().length > 0) {
        items.push({ id: blockId, label: stripHtml(b.imageCaption) });
      }
    });

    return items;
  }, [material.orderedBlocks]);

  const initialSectionId = tocItems[0]?.id || "pengantar";
  const [activeSection, setActiveSection] = useState(initialSectionId);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeQuizModal, setActiveQuizModal] = useState<"none" | "barcode" | "link_confirm" | "internal_ready">("none");
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
        const key = getStudentScopedStorageKey("sintesa_user_views");
        const raw = localStorage.getItem(key) || "[]";
        const views: { id: number; subject: string; timestamp: number }[] = JSON.parse(raw);
        const filtered = views.filter((v) => v.id !== material.id);
        filtered.unshift({ id: material.id, subject: material.subject, timestamp: Date.now() });
        localStorage.setItem(key, JSON.stringify(filtered.slice(0, 30)));
      } catch (e) {
        console.error(e);
      }

      // Record student reading access for teacher monitoring
      try {
        const profile = getStudentProfile();
        ProgressService.recordModuleAccess(
          profile.id || 'std-1',
          {
            id: String(material.id),
            title: material.title,
            subject: material.subject,
            teacherName: material.author,
          },
          profile.name || 'Siswa Sitemsa',
          profile.email || 'siswa@sitemsa.sch.id',
          profile.avatar
        );
      } catch (e) {
        console.error('Error recording module access for monitoring:', e);
      }
    }
  }, [material]);

  // Realtime Active Reading & Study Timer
  useEffect(() => {
    if (!material) return;
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      if (elapsedSeconds >= 5) {
        try {
          const profile = getStudentProfile();
          StudyAnalyticsService.recordReadingSession({
            moduleId: material.id,
            moduleTitle: material.title,
            subject: material.subject,
            durationSeconds: elapsedSeconds,
            studentId: profile.id || profile.email,
            studentName: profile.name,
          });
        } catch {
          StudyAnalyticsService.recordReadingSession({
            moduleId: material.id,
            moduleTitle: material.title,
            subject: material.subject,
            durationSeconds: elapsedSeconds,
          });
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      if (elapsedSeconds >= 5) {
        try {
          const profile = getStudentProfile();
          StudyAnalyticsService.recordReadingSession({
            moduleId: material.id,
            moduleTitle: material.title,
            subject: material.subject,
            durationSeconds: elapsedSeconds,
            studentId: profile.id || profile.email,
            studentName: profile.name,
          });
        } catch {
          StudyAnalyticsService.recordReadingSession({
            moduleId: material.id,
            moduleTitle: material.title,
            subject: material.subject,
            durationSeconds: elapsedSeconds,
          });
        }
      }
    };
  }, [material]);

  const [isMarkedDone, setIsMarkedDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2000);
  };

  useEffect(() => {
    if (material) {
      setIsMarkedDone(isModuleCompletedByStudent(material.id));
    }
  }, [material]);

  // Track Active Reading Duration
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track Scroll Depth & Back to Top Toggle
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, Math.round((currentScroll / totalScroll) * 100)));
        setScrollProgress(progress);
      }

      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smart Read Auto-Completion Trigger:
  // Completes automatically when student scrolls >= 75% AND spends >= 15 seconds reading
  useEffect(() => {
    if (!material || isMarkedDone) return;

    if (scrollProgress >= 75 && readingSeconds >= 15) {
      setIsMarkedDone(true);
      recordModuleCompletion(String(material.id));
      showToast("Materi selesai dibaca");

      addUserNotification({
        type: 'materi',
        title: 'Materi Selesai Dipelajari',
        message: `Kamu telah menuntaskan pembelajaran "${material.title}". Target mingguanmu berhasil tercatat.`,
        linkUrl: `/materi/${material.id}`,
      });
    }
  }, [scrollProgress, readingSeconds, material, isMarkedDone]);

  const handleMarkComplete = () => {
    if (isMarkedDone || !material) return;
    setIsMarkedDone(true);
    recordModuleCompletion(String(material.id));
    showToast("Materi selesai dibaca");
    addUserNotification({
      type: 'materi',
      title: 'Materi Selesai Dipelajari',
      message: `Selamat! Kamu telah menyelesaikan materi "${material.title}". Target mingguanmu bertambah.`,
      linkUrl: `/materi/${material.id}`,
    });
  };

  const handleStartQuizClick = (e: React.MouseEvent) => {
    const qSource = material?.quizSource;
    if (!qSource) return;
    const rawType = String(qSource.type || '').toLowerCase();
    if (rawType === 'barcode' || rawType === 'qr_code') {
      e.preventDefault();
      setActiveQuizModal("barcode");
    } else if (rawType === 'external_link' || rawType === 'link_eksternal') {
      e.preventDefault();
      setActiveQuizModal("link_confirm");
    } else if (rawType === 'internal' || rawType === 'kuis_sitemsa') {
      e.preventDefault();
      setActiveQuizModal("internal_ready");
    }
  };

  useEffect(() => {
    if (activeQuizModal !== "none") {
      document.documentElement.classList.add("modal-open");
      document.body.classList.add("modal-open");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [activeQuizModal]);

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

    const observeIds = tocItems.map((item) => item.id);

    observeIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading, tocItems]);

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
      {/* Top Reading Progress Bar (Smart Read Scroll Depth) */}
      <div className="fixed top-0 left-0 right-0 h-[3.5px] bg-slate-100 z-50 pointer-events-none">
        <div
          className={`h-full transition-all duration-100 ${
            isMarkedDone ? "bg-emerald-500" : "bg-[#2563EB]"
          }`}
          style={{ width: `${isMarkedDone ? 100 : scrollProgress}%` }}
        />
      </div>

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
                      <BarChart2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Pemula</span>
                    </span>
                  )}
                  {material.level === "Menengah" && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-1 rounded-[4px] text-xs font-semibold">
                      <BarChart2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Menengah</span>
                    </span>
                  )}
                  {material.level !== "Pemula" && material.level !== "Menengah" && (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/80 px-2.5 py-1 rounded-[4px] text-xs font-semibold">
                      <BarChart2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
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
                <div className="relative w-full aspect-video rounded-[12px] overflow-hidden border border-[#ECECEC] bg-slate-100">
                  {material.imageUrl ? (
                    // eslint-disable-next-next/no-img-element
                    <img
                      src={material.imageUrl}
                      alt={material.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200/80 animate-pulse flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-300/60 animate-pulse" />
                    </div>
                  )}
                </div>
              </figure>

              {/* Structured Content Ordered Blocks (Strict Sequence Preserved from Editor) */}
              <div className="space-y-8">
                {(material.orderedBlocks || []).map((block: any, bIdx: number) => {
                  const blockId = block.id || `block-${bIdx}`;

                  // 1. VIDEO BLOCK
                  if (block.type === 'video' && block.mediaUrl) {
                    const embedUrl = getYouTubeEmbedUrl(block.mediaUrl);
                    return (
                      <section key={blockId} id={blockId} className="space-y-3 pt-2 scroll-mt-28">
                        {block.sectionTitle && (
                          <h2 className="text-lg md:text-xl font-bold text-[#2E2D2D]">
                            {block.sectionTitle}
                          </h2>
                        )}
                        <div className="relative w-full aspect-video rounded-[12px] overflow-hidden border border-[#ECECEC] bg-black shadow-xs">
                          <iframe
                            src={embedUrl}
                            title={block.sectionTitle || 'Video Simulasi & Pembelajaran'}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        {block.imageCaption && (
                          <p className="text-xs text-[#737373] italic text-center">{block.imageCaption}</p>
                        )}
                      </section>
                    );
                  }

                  // 2. IMAGE BLOCK
                  if (block.type === 'image' && block.mediaUrl) {
                    return (
                      <section key={blockId} id={blockId} className="space-y-3 scroll-mt-28">
                        <div className="overflow-hidden rounded-[12px] border border-[#ECECEC] bg-slate-50 w-full aspect-video shadow-2xs">
                          {/* eslint-disable-next-next/no-img-element */}
                          <img
                            src={block.mediaUrl}
                            alt={block.imageCaption || "Ilustrasi Materi"}
                            className="w-full h-full object-cover rounded-[12px]"
                          />
                        </div>
                        {block.imageCaption && (
                          <p className="text-xs text-[#737373] italic text-center">{block.imageCaption}</p>
                        )}
                      </section>
                    );
                  }

                  // 3. CODE SNIPPET BLOCK
                  if (block.type === 'code' && block.codeSnippet) {
                    return (
                      <section key={blockId} id={blockId} className="space-y-3 scroll-mt-28">
                        {block.sectionTitle && (
                          <h2 className="text-lg md:text-xl font-bold text-[#2E2D2D]">
                            {block.sectionTitle}
                          </h2>
                        )}
                        <div className="bg-[#1E1E2E] rounded-[10px] p-4 space-y-3 text-white overflow-hidden shadow-xs">
                          <div className="flex items-center justify-between text-xs text-[#A6ADC8] border-b border-[#313244] pb-2">
                            <span className="font-mono">{block.codeSnippet.language}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(block.codeSnippet!.code)}
                              className="inline-flex items-center gap-1.5 bg-[#313244] hover:bg-[#45475A] text-white px-2.5 py-1 rounded-[6px] transition-colors text-[11px] cursor-pointer"
                            >
                              <HugeiconsIcon icon={copiedCode ? Tick01Icon : Copy01Icon} size={13} />
                              <span>{copiedCode ? "Tersalin!" : "Salin Kode"}</span>
                            </button>
                          </div>
                          <pre className="font-mono text-xs overflow-x-auto text-[#CDD6F4] leading-relaxed">
                            <code>{block.codeSnippet.code}</code>
                          </pre>
                        </div>
                      </section>
                    );
                  }

                  // 4. STEP-BY-STEP PRACTICE BLOCK
                  if (block.type === 'steps' && block.steps && block.steps.length > 0) {
                    const stepHeading = stripHtml(block.stepSectionTitle) || 'Langkah-langkah Praktik';

                    return (
                      <section key={blockId} id={blockId} className="space-y-4 pt-4 scroll-mt-28">
                        <div>
                          <h2 className="text-lg md:text-xl font-bold text-[#2E2D2D]">
                            {stepHeading}
                          </h2>
                        </div>

                        <div className="bg-white border border-[#ECECEC] rounded-[10px] overflow-hidden divide-y divide-[#ECECEC] shadow-2xs">
                          {block.steps.map((step: any, sIdx: number) => (
                            <div
                              key={sIdx}
                              className="p-4 md:p-5 space-y-3 bg-white transition-colors hover:bg-[#F6F5FF]"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 bg-[#0400F4] text-white">
                                  {String(sIdx + 1).padStart(2, '0')}
                                </span>
                                <h3 className="text-sm md:text-base font-bold text-[#2E2D2D]">
                                  {stripHtml(step.title) || `Langkah ${sIdx + 1}`}
                                </h3>
                              </div>

                              <div className="pl-11">
                                <SmartParagraph text={step.desc || step.text || ''} />
                              </div>

                              {step.mediaUrl && (
                                <div className="pl-11 pt-1">
                                  <div className="relative w-full h-[200px] md:h-[280px] rounded-[8px] overflow-hidden border border-[#ECECEC] bg-[#FAFAFA]">
                                    {/* eslint-disable-next-next/no-img-element */}
                                    <img
                                      src={step.mediaUrl}
                                      alt={stripHtml(step.title)}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }

                  // 5. ATTACHMENT BLOCK (Multi-File or Single File Supported)
                  if (block.type === 'attachment') {
                    const attachments = block.attachments && block.attachments.length > 0
                      ? block.attachments
                      : block.attachment ? [block.attachment] : [];

                    if (attachments.length === 0) return null;

                    return (
                      <section key={blockId} id={blockId} className="space-y-3 pt-2 scroll-mt-28">
                        {attachments.map((att: any, attIdx: number) => {
                          const fileName = att.fileName || att.name || 'Dokumen_Lampiran.pdf';
                          const fileSize = att.fileSize || att.size || '2.0 MB';
                          const fileUrl = att.fileUrl || att.url || '';

                          return (
                            <div
                              key={att.id || attIdx}
                              className="bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 shadow-2xs"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-[8px] bg-[#F4EFFF] text-[#2563EB] flex items-center justify-center shrink-0">
                                  <HugeiconsIcon icon={File01Icon} size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs sm:text-sm font-bold text-[#2E2D2D] truncate">
                                    {fileName}
                                  </p>
                                  <p className="text-[11px] text-[#737373] mt-0.5">
                                    PDF &bull; {fileSize}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (fileUrl) {
                                    window.open(fileUrl, '_blank');
                                  } else {
                                    alert('Berkas lampiran sedang diproses.');
                                  }
                                }}
                                className="w-full sm:w-auto px-4 py-2 bg-white border border-[#ECECEC] hover:bg-[#F6F5FF] hover:border-[#2563EB]/40 text-[#2563EB] text-xs font-semibold rounded-[8px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
                              >
                                <HugeiconsIcon icon={Download01Icon} size={15} />
                                <span>Unduh Berkas</span>
                              </button>
                            </div>
                          );
                        })}
                      </section>
                    );
                  }

                  // 6. DEFAULT / TEXT / CALLOUT BLOCK
                  return (
                    <section key={blockId} id={blockId} className="space-y-4 scroll-mt-28">
                      {block.sectionTitle && (
                        <h2 className="text-lg md:text-xl font-bold text-[#2E2D2D]">
                          {stripHtml(block.sectionTitle)}
                        </h2>
                      )}

                      {/* Render Elements in Exact Sequence if available */}
                      {block.elements && block.elements.length > 0 ? (
                        <div className="space-y-4">
                          {block.elements.map((el: any, elIdx: number) => {
                            if (el.type === 'image' && el.imageUrl) {
                              return (
                                <div key={elIdx} className="my-3 w-full">
                                  <div className="overflow-hidden rounded-[12px] border border-[#ECECEC] bg-slate-50 w-full aspect-video shadow-2xs">
                                    {/* eslint-disable-next-next/no-img-element */}
                                    <img
                                      src={el.imageUrl}
                                      alt={stripHtml(el.imageCaption) || "Ilustrasi Materi"}
                                      className="w-full h-full object-cover rounded-[12px]"
                                    />
                                  </div>
                                </div>
                              );
                            }
                            if (el.type === 'paragraph' && el.text) {
                              return <SmartParagraph key={elIdx} text={el.text} />;
                            }
                            return null;
                          })}
                        </div>
                      ) : (
                        <>
                          {block.paragraphs && block.paragraphs.length > 0 ? (
                            <div className="space-y-2.5">
                              {block.paragraphs.map((p: string, pIdx: number) => (
                                <SmartParagraph key={pIdx} text={p} />
                              ))}
                            </div>
                          ) : block.textValue ? (
                            <div className="space-y-2.5">
                              <SmartParagraph text={block.textValue} />
                            </div>
                          ) : null}

                          {block.items && block.items.length > 0 && (
                            <div className="space-y-4 my-3">
                              {block.items.map((item: any, i: number) => (
                                <div key={i} className="space-y-2.5">
                                  {item.imageUrl && (
                                    <div className="my-3 w-full">
                                      <div className="overflow-hidden rounded-[12px] border border-[#ECECEC] bg-slate-50 w-full aspect-video shadow-2xs">
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
                                    <SmartParagraph text={item.text} />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}

                      {(block.callout || block.calloutText) && (
                        <div className="my-3 p-4 rounded-[12px] bg-[#F6F5FF] border border-[#E8E7FF] text-[#2563EB] text-xs md:text-sm leading-relaxed flex items-start gap-3 shadow-2xs">
                          <div className="w-1.5 self-stretch bg-[#2563EB] rounded-full shrink-0" />
                          <div className="text-[#3A3985] font-medium leading-relaxed flex-1 text-justify">
                            <SmartParagraph text={block.callout || block.calloutText} />
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
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
                  {tocItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => handleScrollToSection(e, item.id)}
                        className={`block px-3.5 py-2 text-xs font-medium transition-all duration-200 truncate ${
                          isActive
                            ? "bg-[#F4EFFF] text-[#2563EB] font-semibold border-l-2 border-[#2563EB]"
                            : "text-[#737373] hover:text-[#2E2D2D] hover:bg-[#FAFAFA] border-l-2 border-transparent"
                        }`}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Start Quiz Card (Only shown if material has a configured evaluation/quiz) */}
              {material.quizSource && (
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
                    {activeQuizInfo.title}
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
              )}
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
            {tocItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIsTocOpen(false);
                  const el = document.getElementById(item.id);
                  if (el) {
                    const yOffset = -110;
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="w-full text-left px-3 py-2 rounded-[8px] hover:bg-[#F6F5FF] text-xs font-medium text-[#2E2D2D] hover:text-[#2563EB] transition-colors cursor-pointer block truncate"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Barcode Modal (Mobile Bottom Sheet & Desktop Dialog) */}
      {activeQuizModal === "barcode" && material.quizSource && (
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
              <div className="relative w-56 h-56 mx-auto border border-[#ECECEC] rounded-[12px] p-3 bg-white flex items-center justify-center overflow-hidden shadow-2xs">
                {(() => {
                  const qrUrl = material.quizSource.qrImageUrl;
                  const isValidUrl = Boolean(qrUrl && !qrUrl.startsWith('blob:') && qrUrl.trim().length > 5);
                  const fallbackDynamicQr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    material.quizSource.externalUrl || (typeof window !== 'undefined' ? window.location.href : `https://sitemsa.vercel.app/materi/${material.id}`)
                  )}`;

                  const targetSrc = isValidUrl ? qrUrl! : fallbackDynamicQr;

                  return (
                    /* eslint-disable-next-next/no-img-element */
                    <img
                      src={targetSrc}
                      alt="QR Code Kuis"
                      className="w-full h-full object-contain p-1 rounded-[6px]"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== fallbackDynamicQr) {
                          img.src = fallbackDynamicQr;
                        }
                      }}
                    />
                  );
                })()}
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
      {activeQuizModal === "link_confirm" && material.quizSource && (
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
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveQuizModal("none")}
                className="px-4 py-2 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batalkan
              </button>
              <a
                href={material.quizSource.externalUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveQuizModal("none")}
                className="px-5 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer text-center shadow-xs"
              >
                <span>Lanjutkan ke Link</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Internal Ready Confirmation Modal */}
      {activeQuizModal === "internal_ready" && material.quizSource && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="absolute inset-0" onClick={() => setActiveQuizModal("none")} />
          <div className="bg-white rounded-[12px] max-w-md w-full border border-[#ECECEC] overflow-hidden shadow-xl animate-in zoom-in-95 duration-200 z-10 relative">
            {/* Header: Pure white seamless header without dividing line */}
            <div className="p-5 pb-0 bg-white flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">Siap memulai kuis</h3>
              <button
                type="button"
                onClick={() => setActiveQuizModal("none")}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-base font-bold text-[#2E2D2D] leading-snug">
                  {activeQuizInfo.title}
                </h4>
              </div>

              <div className="p-3.5 rounded-[8px] bg-slate-50 border border-[#ECECEC] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">Mata pelajaran</span>
                  <span className="font-semibold text-[#2E2D2D]">{material.subject}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">Standar KKM</span>
                  <span className="font-bold text-emerald-700">{activeQuizInfo.passScore}%</span>
                </div>
              </div>

              <p className="text-xs text-[#737373] leading-relaxed">
                Pastikan Anda telah membaca dan memahami materi ini dengan baik sebelum memulai pengerjaan kuis.
              </p>

              {/* Action Buttons without dividing line */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveQuizModal("none")}
                  className="px-4 py-2 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <Link
                  href={material.quizSource.internalUrl || `/kuis/${toDeterministicUUID(id)}`}
                  onClick={() => setActiveQuizModal("none")}
                  className="px-5 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Mulai kuis
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION — slides from below navbar (Clean style, no icon, concise copy) */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-[8px] bg-white/95 backdrop-blur-md border border-[#ECECEC] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12)] font-sans transition-all duration-300 ease-out animate-in slide-in-from-top-4 fade-in">
          <p className="text-xs font-medium text-[#2E2D2D]">
            {toastMessage}
          </p>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-1.5"
            aria-label="Tutup notifikasi"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
