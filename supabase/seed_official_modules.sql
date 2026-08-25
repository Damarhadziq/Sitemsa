-- ==========================================================
-- SEED DATA: 11 MATERI RESMI GURU & PUBLISHER SITEMSA
-- Jalankan script ini di Supabase SQL Editor (Dashboard > SQL Editor)
-- ==========================================================

-- 1. Pastikan tabel subjects sudah terisi
INSERT INTO public.subjects (name, code, category, description, icon_name, is_active, total_modules, total_quizzes)
VALUES
('Informatika', 'INF', 'Teknologi & Kode', 'Pemrograman dasar, logika algoritma, struktur data, dan pengembangan perangkat lunak.', 'ComputerIcon', true, 12, 6),
('Elektronika', 'ELK', 'Teknik Rekayasa', 'Komponen pasif & aktif, dasar kelistrikan, sirkuit terpadu, dan mikrokontroler.', 'CpuIcon', true, 12, 6),
('Otomotif', 'OTO', 'Teknik Mekanik', 'Sistem pengisian kelistrikan, transmisi manual, termodinamika mesin, dan diagnosis kendaraan.', 'Car01Icon', true, 12, 5),
('Seni Tari', 'STR', 'Seni & Budaya', 'Eksplorasi gerak koreografi, tata busana panggung, tata rias, dan properti tari tradisional.', 'MusicNote01Icon', true, 12, 4),
('Bimbingan Konseling', 'BK', 'Pengembangan Diri', 'Kepercayaan diri, pemetaan potensi diri, prokrastinasi, dan bimbingan karir masa depan.', 'UserGroupIcon', true, 8, 4),
('Keolahragaan', 'PJK', 'Kesehatan & Olahraga', 'Keterampilan gerak & taktik bola basket, bola voli, kebugaran jasmani, dan sportivitas.', 'Dumbbell01Icon', true, 8, 4)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  total_modules = EXCLUDED.total_modules;

-- 2. Tambahkan / Update Akun Guru Publisher di tabel public.users
INSERT INTO public.users (id, email, name, role, nip, phone, avatar, status, assigned_subjects)
VALUES
('sa-1', 'damar.guru@sitemsa.sch.id', 'Damar Hadziq H.', 'superadmin', '19980101 202401 1 001', '0812-3456-7890', 'https://i.pravatar.cc/150?img=11', 'Aktif', ARRAY['Informatika', 'Elektronika', 'Bimbingan Konseling', 'Seni Tari', 'Otomotif', 'Keolahragaan']),
('t-oto-1', 'ardyan.guru@sitemsa.sch.id', 'Ardyan Santoso', 'guru', '19980707 202401 1 007', '0812-5555-0101', 'https://i.pravatar.cc/150?img=17', 'Aktif', ARRAY['Otomotif']),
('t-oto-2', 'satrio.guru@sitemsa.sch.id', 'Satrio', 'guru', '19980808 202401 1 008', '0812-5555-0102', 'https://i.pravatar.cc/150?img=23', 'Aktif', ARRAY['Otomotif']),
('t-olr-1', 'brilian.guru@sitemsa.sch.id', 'Brilian Anugraheni', 'guru', '19981515 202401 2 015', '0812-5555-0103', 'https://i.pravatar.cc/150?img=29', 'Aktif', ARRAY['Keolahragaan', 'Olahraga & Kesehatan']),
('t-bk-1', 'innova.guru@sitemsa.sch.id', 'Innova Riskianugrah R.', 'guru', '19980505 202401 2 005', '0812-5555-0104', 'https://i.pravatar.cc/150?img=16', 'Aktif', ARRAY['Bimbingan Konseling', 'Bimbingan dan Konseling']),
('t-elk-5', 'fahrul.guru@sitemsa.sch.id', 'Fahrul Adiyansa', 'guru', '19981414 202401 1 014', '0812-5555-0105', 'https://i.pravatar.cc/150?img=33', 'Aktif', ARRAY['Elektronika']),
('t-elk-2', 'anisa.guru@sitemsa.sch.id', 'Anisa Susilawati', 'guru', '19981111 202401 2 011', '0812-5555-0106', 'https://i.pravatar.cc/150?img=21', 'Aktif', ARRAY['Elektronika']),
('t-elk-1', 'banu.guru@sitemsa.sch.id', 'Banu Mahmuda H.', 'guru', '19981010 202401 1 010', '0812-5555-0107', 'https://i.pravatar.cc/150?img=14', 'Aktif', ARRAY['Elektronika']),
('t-elk-6', 'tubagus.guru@sitemsa.sch.id', 'Tubagus Fauzan A.', 'guru', '19981616 202401 1 016', '0812-5555-0108', 'https://i.pravatar.cc/150?img=15', 'Aktif', ARRAY['Elektronika']),
('t-elk-4', 'vella.guru@sitemsa.sch.id', 'Vella Pratika I. N.', 'guru', '19981313 202401 2 013', '0812-5555-0109', 'https://i.pravatar.cc/150?img=32', 'Aktif', ARRAY['Elektronika']),
('t-elk-3', 'nova.guru@sitemsa.sch.id', 'Nova Milyard', 'guru', '19981212 202401 1 012', '0812-5555-0110', 'https://i.pravatar.cc/150?img=26', 'Aktif', ARRAY['Elektronika'])
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  assigned_subjects = EXCLUDED.assigned_subjects;

-- 3. Insert 11 Materi Lengkap Guru ke tabel public.modules
DELETE FROM public.modules WHERE id IN ('mod-ot-01', 'mod-ot-02', 'mod-pjok-01', 'mod-pjok-02', 'mod-bk-01', 'mod-pte-01', 'mod-pte-02', 'mod-pte-03', 'mod-pte-04', 'mod-pte-05', 'mod-pte-06');

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-ot-01',
    'Otomotif',
    't-oto-1',
    'Ardyan Santoso',
    'Sistem Pengisian Mobil Konvensional dan Elektronik/IC',
    'Menengah',
    '45 Menit',
    ARRAY['Pengertian Sistem Pengisian', 'Komponen Alternator', 'Prinsip Kerja', 'Troubleshooting Pengisian'],
    'Memahami fungsi, komponen utama alternator, prinsip kerja pembangkitan arus, dan langkah pemecahan masalah sistem pengisian mobil konvensional serta elektronik.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Sistem Pengisian Mobil Konvensional dan Elektronik/IC'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-ot-02',
    'Otomotif',
    't-oto-2',
    'Satrio',
    'Sistem Transmisi Manual',
    'Menengah',
    '40 Menit',
    ARRAY['Pengertian Transmisi Manual', 'Komponen Transmisi', 'Aliran Tenaga Gigi', 'Troubleshooting Transmisi'],
    'Mempelajari prinsip kerja sistem transmisi manual kendaraan, fungsi kopling dan sinkromes, serta diagnosis gangguan transmisi.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Sistem Transmisi Manual'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-pjok-01',
    'Keolahragaan',
    't-olr-1',
    'Brilian Anugraheni',
    'Keterampilan Gerak & Taktik Permainan Bola Basket',
    'Pemula',
    '40 Menit',
    ARRAY['Pendahuluan Bola Basket', 'Pola Penyerangan', 'Pola Pertahanan', 'Keterampilan Gerak'],
    'Menguasai keterampilan teknik dasar, pola penyerangan cepat (fast break), pola pertahanan man-to-man dan zone defense pada bola basket.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Keterampilan Gerak & Taktik Permainan Bola Basket'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-pjok-02',
    'Keolahragaan',
    't-olr-1',
    'Brilian Anugraheni',
    'Keterampilan Gerak Permainan Bola Voli',
    'Pemula',
    '35 Menit',
    ARRAY['Pengertian Bola Voli', 'Passing Bawah & Atas', 'Servis Bawah & Atas', 'Smash & Block'],
    'Mempelajari teknik dasar passing, servis, smash tajam, dan teknik bendungan (blocking) beregu dalam permainan bola voli.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Keterampilan Gerak Permainan Bola Voli'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-bk-01',
    'Bimbingan Konseling',
    't-bk-1',
    'Innova Riskianugrah R.',
    'Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri',
    'Pemula',
    '30 Menit',
    ARRAY['Hakikat Percaya Diri', 'Ciri Percaya Diri', 'Faktor Pembentuk', 'Strategi Pengembangan Diri'],
    'Memahami konsep kepercayaan diri remaja, mengenali potensi personal, mengatasi rasa rendah diri, serta strategi membangun konsep diri yang optimis.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Membangun Kepercayaan Diri untuk Mengembangkan Potensi Diri'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-pte-01',
    'Elektronika',
    't-elk-5',
    'Fahrul Adiyansa',
    'Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri',
    'Pemula',
    '35 Menit',
    ARRAY['Pengertian K3LH', 'Budaya Kerja 5R/5S', 'Potensi Bahaya Kelistrikan', 'Alat Pelindung Diri (APD)'],
    'Penerapan prinsip K3LH di bengkel elektronika, pencegahan kecelakaan kerja, budaya kerja industri (Ringkas, Rapi, Resik, Rawat, Rajin), serta penggunaan APD.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) dan Budaya Kerja Industri'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-pte-02',
    'Elektronika',
    't-elk-2',
    'Anisa Susilawati',
    'Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik',
    'Pemula',
    '40 Menit',
    ARRAY['Perkakas Tangan Manual', 'Ragam Tang & Obeng', 'Power Tools Listrik', 'Prosedur K3 & Perawatan'],
    'Mengenal dan mengoperasikan ragam perkakas tangan manual (tang kombinasi, rivet, cucut) dan perkakas tangan bertenaga listrik (bor, gerinda, jigsaw) secara aman.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Penggunaan Perkakas Kerja Tangan Listrik dan Non Listrik'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-pte-03',
    'Elektronika',
    't-elk-1',
    'Banu Mahmuda H.',
    'Gambar Teknik Listrik, Elektronika, dan Instrumentasi',
    'Pemula',
    '45 Menit',
    ARRAY['Pengertian Gamtek', 'Standarisasi Gambar', 'Simbol Komponen Elektronika', 'Diagram Skematik & Wiring'],
    'Memahami bahasa visual gambar teknik, standarisasi ISO, pembacaan simbol komponen elektronika dan instrumentasi, serta perancangan diagram skematik.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Gambar Teknik Listrik, Elektronika, dan Instrumentasi'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-pte-04',
    'Elektronika',
    't-elk-6',
    'Tubagus Fauzan A.',
    'Alat Ukur Listrik, Elektronika, dan Instrumentasi',
    'Pemula',
    '40 Menit',
    ARRAY['Voltmeter & Amperemeter', 'Multimeter Analog & Digital', 'Osiloskop', 'Prosedur Pengukuran Aman'],
    'Pengenalan fungsi dan cara pengoperasian alat ukur kelistrikan dan instrumentasi (Multitester, Osciloscope, Signal Generator) secara presisi.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Alat Ukur Listrik, Elektronika, dan Instrumentasi'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-pte-05',
    'Elektronika',
    't-elk-4',
    'Vella Pratika I. N.',
    'Komponen Elektronika Pasif dan Aktif',
    'Pemula',
    '35 Menit',
    ARRAY['Resistor & Kapasitor', 'Induktor', 'Dioda & Transistor', 'IC (Integrated Circuit)'],
    'Membedah karakteristik dan prinsip kerja komponen pasif (resistor, kapasitor, induktor) dan komponen aktif (dioda, transistor, IC) dalam rangkaian elektronika.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Komponen Elektronika Pasif dan Aktif'
);

INSERT INTO public.modules (
    id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published, quiz_source_type, quiz_source_title
) VALUES (
    'mod-pte-06',
    'Elektronika',
    't-elk-3',
    'Nova Milyard',
    'Dasar Kelistrikan dan Hukum-Hukum Kelistrikan',
    'Pemula',
    '40 Menit',
    ARRAY['Arus, Tegangan & Hambatan', 'Hukum Ohm', 'Hukum Kirchhoff I & II', 'Daya dan Energi Listrik'],
    'Konsep dasar besaran listrik, aplikasi perhitungan Hukum Ohm, analisis percabangan Hukum Kirchhoff, dan efisiensi konsumsi daya listrik.',
    true,
    true,
    'KUIS_SITEMSA',
    'Kuis Evaluasi Dasar Kelistrikan dan Hukum-Hukum Kelistrikan'
);
