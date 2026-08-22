import { z } from 'zod';

// Auth Validation
export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(4, 'Kata sandi minimal 4 karakter').optional(),
});

// Subject Validation
export const subjectSchema = z.object({
  name: z.string().min(2, 'Nama mata pelajaran minimal 2 karakter'),
  code: z.string().min(2, 'Kode mapel minimal 2 karakter').max(10),
  category: z.string().min(2, 'Kategori wajib diisi'),
  description: z.string().min(5, 'Deskripsi wajib diisi'),
  iconName: z.string().default('BookOpen01Icon'),
  isActive: z.boolean().optional().default(true),
});

// Teacher Account Validation
export const teacherSchema = z.object({
  name: z.string().min(3, 'Nama guru minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  nip: z.string().min(5, 'NIP minimal 5 karakter'),
  phone: z.string().min(8, 'Nomor telepon minimal 8 digit').optional().default('-'),
  avatar: z.string().url().optional().default('https://i.pravatar.cc/150?img=60'),
  assignedSubjects: z.array(z.string()).default([]),
  status: z.enum(['Aktif', 'Nonaktif']).default('Aktif'),
});

export const assignSubjectsSchema = z.object({
  assignedSubjects: z.array(z.string()),
});

// Module Validation
export const moduleSchema = z.object({
  subject: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  title: z.string().min(3, 'Judul modul minimal 3 karakter'),
  level: z.enum(['Pemula', 'Menengah', 'Mahir']).default('Pemula'),
  duration: z.string().default('45 Menit'),
  topics: z.array(z.string()).default([]),
  description: z.string().min(5, 'Deskripsi modul wajib diisi'),
  teacherId: z.string().optional().default('t-1'),
  teacherName: z.string().optional().default('Pengajar Sitemsa'),
  isAiRecommended: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  quizSource: z
    .object({
      type: z.enum(['kuis_sitemsa', 'link_eksternal', 'qr_code']),
      title: z.string(),
      externalUrl: z.string().url().optional(),
      qrImageUrl: z.string().optional(),
    })
    .optional(),
});

// Quiz & Question Validation
export const quizQuestionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(3, 'Pertanyaan kuis wajib diisi'),
  options: z.array(z.string()).min(2, 'Minimal 2 opsi jawaban').max(5),
  correctAnswer: z.number().int().min(0).max(4),
  explanation: z.string().default(''),
});

export const quizSchema = z.object({
  subject: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  title: z.string().min(3, 'Judul kuis minimal 3 karakter'),
  duration: z.string().default('30 Menit'),
  passScore: z.number().min(0).max(100).default(75),
  questions: z.array(quizQuestionSchema).min(1, 'Minimal ada 1 pertanyaan kuis'),
  teacherId: z.string().optional().default('t-1'),
  teacherName: z.string().optional().default('Pengajar Sitemsa'),
  published: z.boolean().optional().default(true),
});

export const quizSubmitSchema = z.object({
  studentId: z.string().min(1, 'ID Siswa wajib ada'),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedAnswer: z.number().int().min(0).max(4),
    })
  ),
});

// Article / Tips Belajar Validation
export const articleSchema = z.object({
  title: z.string().min(5, 'Judul artikel minimal 5 karakter'),
  category: z.string().min(2, 'Kategori artikel wajib diisi'),
  readTime: z.string().default('3 Menit'),
  author: z.string().default('Tim Kurikulum Sitemsa'),
  image: z.string().url('URL gambar sampul tidak valid'),
  excerpt: z.string().min(10, 'Ringkasan artikel minimal 10 karakter'),
  content: z.string().min(20, 'Konten artikel minimal 20 karakter'),
  isFeatured: z.boolean().optional().default(false),
});

// Hero CMS Content Validation
export const heroCmsSchema = z.object({
  title: z.string().min(5, 'Judul hero banner minimal 5 karakter'),
  subtitle: z.string().min(5, 'Subjudul hero minimal 5 karakter'),
  badgeText: z.string().min(2, 'Teks badge minimal 2 karakter'),
  ctaText: z.string().min(2, 'Teks tombol CTA minimal 2 karakter'),
  ctaLink: z.string().default('/materi'),
  bannerImage: z.string().url().or(z.string().startsWith('/')),
});

// Student Progress Validation
export const studentProgressSchema = z.object({
  studentId: z.string().min(1),
  subject: z.string().min(1),
  progress: z.number().min(0).max(100),
});

// Notification Validation
export const notificationSchema = z.object({
  userId: z.string().optional(),
  title: z.string().min(3),
  message: z.string().min(3),
  type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'MODULE_UPDATE', 'QUIZ_REMINDER']).default('INFO'),
  linkUrl: z.string().optional(),
});
