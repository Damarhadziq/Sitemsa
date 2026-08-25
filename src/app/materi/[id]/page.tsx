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
  MusicNote01Icon,
  Dumbbell01Icon,
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
      internalUrl: "/kuis/1",
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
      internalUrl: "/kuis/9",
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
      internalUrl: "/kuis/11",
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
      internalUrl: "/kuis/12",
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
      internalUrl: "/kuis/18",
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
      internalUrl: "/kuis/19",
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
      internalUrl: "/kuis/7",
    },
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
