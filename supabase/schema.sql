-- SITEMSA (SINTESA) Supabase Schema & Initial Seed Data
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Create Types & Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    total_modules INT DEFAULT 0,
    total_quizzes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Teachers & Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'guru', 'siswa')),
    avatar TEXT,
    phone TEXT,
    nip TEXT UNIQUE,
    nisn TEXT UNIQUE,
    class_group TEXT,
    status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    assigned_subjects TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    subject TEXT NOT NULL,
    teacher_id TEXT,
    teacher_name TEXT NOT NULL,
    title TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Pemula', 'Menengah', 'Mahir')),
    duration TEXT NOT NULL,
    topics TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    is_ai_recommended BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    quiz_source_type TEXT DEFAULT 'KUIS_SITEMSA',
    quiz_source_title TEXT,
    external_url TEXT,
    qr_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    subject TEXT NOT NULL,
    teacher_id TEXT,
    teacher_name TEXT,
    title TEXT NOT NULL,
    duration TEXT DEFAULT '30 Menit',
    pass_score INT DEFAULT 75,
    published BOOLEAN DEFAULT true,
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Student Progress & Quiz Attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    student_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    quiz_title TEXT NOT NULL,
    subject TEXT NOT NULL,
    score INT NOT NULL,
    max_score INT DEFAULT 100,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Articles (Tips Belajar & CMS)
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    read_time TEXT NOT NULL,
    author TEXT NOT NULL,
    image TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    time TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Team Members Table (Tim Pengembang)
CREATE TABLE IF NOT EXISTS public.team_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    handle TEXT NOT NULL,
    division TEXT NOT NULL,
    border_color TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Initial Seed Data (Mata Pelajaran)
INSERT INTO public.subjects (name, code, category, description, icon_name, total_modules, total_quizzes)
VALUES 
('Informatika', 'INF', 'Teknologi Informasi & Komunikasi', 'Algoritma pemrograman, struktur data, basis data, dan pengembangan web terpadu.', 'ComputerIcon', 0, 0),
('Elektronika', 'ELK', 'Teknik & Rekayasa', 'Komponen pasif/aktif, rangkaian sirkuit analog digital, dan otomasi mikrokontroler.', 'CpuIcon', 0, 0),
('Bimbingan Konseling', 'BK', 'Pengembangan Diri & Karir', 'Konseling karir, self-management, eksplorasi potensi vokasi, dan etika dunia kerja.', 'UserGroupIcon', 6, 2),
('Seni Tari', 'STR', 'Seni & Desain Kreatif', 'Konsep koreografi, wiraga, wirama, wirasa, dan apresiasi seni tari nusantara modern.', 'MusicNote01Icon', 3, 2),
('Otomotif', 'OTO', 'Teknik Mesin & Transportasi', 'Prinsip kerja mesin 4-langkah, sistem injeksi EFI, dan pemeliharaan chasis kendaraan.', 'Car01Icon', 0, 0),
('Olahraga & Kesehatan', 'PJK', 'Kesehatan & Olahraga', 'Aktivitas kebugaran jasmani, pola hidup sehat, dan pembinaan atletik vokasi.', 'SparklesIcon', 0, 0)
ON CONFLICT (name) DO NOTHING;

-- 11. Initial Seed Data (24 Akun Resmi Tim Pengembang PPL Lantip SMKN 1 Semarang)
INSERT INTO public.users (id, email, name, role, nip, avatar, assigned_subjects)
VALUES 
-- 1. Pend. Informatika
('usr-1', 'damar.guru@sitemsa.sch.id', 'Damar Hadziq H.', 'superadmin', '19980101 202401 1 001', 'https://i.pravatar.cc/300?img=11', ARRAY['Informatika', 'Elektronika', 'Bimbingan Konseling', 'Seni Tari', 'Otomotif', 'Olahraga & Kesehatan']),
('usr-2', 'rizal.guru@sitemsa.sch.id', 'Mochammad Rizal D. D.', 'guru', '19980202 202401 1 002', 'https://i.pravatar.cc/300?img=13', ARRAY['Informatika']),
('usr-3', 'sulthon.guru@sitemsa.sch.id', 'M. Sulthon Abdullah A.', 'guru', '19980303 202401 1 003', 'https://i.pravatar.cc/300?img=19', ARRAY['Informatika']),
('usr-4', 'lovyca.guru@sitemsa.sch.id', 'Lovyca Imeyra E.', 'guru', '19980404 202401 2 004', 'https://i.pravatar.cc/300?img=25', ARRAY['Informatika']),

-- 2. Bimbingan dan Konseling (BK)
('usr-5', 'innova.guru@sitemsa.sch.id', 'Innova Riskianugrah R.', 'guru', '19980505 202401 2 005', 'https://i.pravatar.cc/300?img=16', ARRAY['Bimbingan Konseling']),
('usr-6', 'fateka.guru@sitemsa.sch.id', 'Fateka Maulana A. K.', 'guru', '19980606 202401 1 006', 'https://i.pravatar.cc/300?img=18', ARRAY['Bimbingan Konseling']),
('usr-7', 'erintan.guru@sitemsa.sch.id', 'Erintan Tsuraya Rahadatul''Aisy', 'guru', '19940822 202012 2 009', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', ARRAY['Bimbingan Konseling']),
('usr-8', 'dinda.guru@sitemsa.sch.id', 'Dinda Riestia', 'guru', '19930514 201903 2 008', 'https://i.pravatar.cc/300?img=32', ARRAY['Bimbingan Konseling']),

-- 3. Pend. Otomotif
('usr-9', 'ardyan.guru@sitemsa.sch.id', 'Ardyan Santoso', 'guru', '19980707 202401 1 007', 'https://i.pravatar.cc/300?img=17', ARRAY['Otomotif']),
('usr-10', 'satrio.guru@sitemsa.sch.id', 'Satrio', 'guru', '19980808 202401 1 008', 'https://i.pravatar.cc/300?img=23', ARRAY['Otomotif']),
('usr-11', 'agam.guru@sitemsa.sch.id', 'Agam Ainun Ramadhan', 'guru', '19980909 202401 1 009', 'https://i.pravatar.cc/300?img=27', ARRAY['Otomotif']),

-- 4. Pend. Elektronika
('usr-12', 'banu.guru@sitemsa.sch.id', 'Banu Mahmuda H.', 'guru', '19981010 202401 1 010', 'https://i.pravatar.cc/300?img=14', ARRAY['Elektronika']),
('usr-13', 'anisa.guru@sitemsa.sch.id', 'Anisa Susilawati', 'guru', '19981111 202401 2 011', 'https://i.pravatar.cc/300?img=21', ARRAY['Elektronika']),
('usr-14', 'nova.guru@sitemsa.sch.id', 'Nova Milyard', 'guru', '19981212 202401 1 012', 'https://i.pravatar.cc/300?img=26', ARRAY['Elektronika']),
('usr-15', 'vella.guru@sitemsa.sch.id', 'Vella Pratika I. N.', 'guru', '19981313 202401 2 013', 'https://i.pravatar.cc/300?img=32', ARRAY['Elektronika']),
('usr-16', 'fahrul.guru@sitemsa.sch.id', 'Fahrul Adiyansa', 'guru', '19981414 202401 1 014', 'https://i.pravatar.cc/300?img=33', ARRAY['Elektronika']),
('usr-17', 'tubagus.guru@sitemsa.sch.id', 'Tubagus Fauzan A.', 'guru', '19981515 202401 1 015', 'https://i.pravatar.cc/300?img=15', ARRAY['Elektronika']),

-- 5. Pend. Olahraga
('usr-18', 'brilian.guru@sitemsa.sch.id', 'Brilian Anugraheni', 'guru', '19981616 202401 2 016', 'https://i.pravatar.cc/300?img=29', ARRAY['Olahraga & Kesehatan']),
('usr-19', 'luthfi.guru@sitemsa.sch.id', 'Ahmad Luthfi F.', 'guru', '19981717 202401 1 017', 'https://i.pravatar.cc/300?img=31', ARRAY['Olahraga & Kesehatan']),
('usr-20', 'rinal.guru@sitemsa.sch.id', 'Rinal Febriarso D. P.', 'guru', '19981818 202401 1 018', 'https://i.pravatar.cc/300?img=34', ARRAY['Olahraga & Kesehatan']),

-- 6. Pend. Seni Tari
('usr-21', 'vivi.guru@sitemsa.sch.id', 'Vivi Riska Wardani', 'guru', '19981919 202401 2 019', 'https://i.pravatar.cc/300?img=12', ARRAY['Seni Tari']),
('usr-22', 'anita.guru@sitemsa.sch.id', 'Anita Dwi Ningtyas', 'guru', '19982020 202401 2 020', 'https://i.pravatar.cc/300?img=20', ARRAY['Seni Tari']),
('usr-23', 'meliana.guru@sitemsa.sch.id', 'Meliana Dwi Yanti', 'guru', '19982121 202401 2 021', '/images/meliana.jpg', ARRAY['Seni Tari']),
('usr-24', 'ivangka.guru@sitemsa.sch.id', 'Hasnita Ivangka', 'guru', '19982222 202401 2 022', 'https://i.pravatar.cc/300?img=28', ARRAY['Seni Tari']),

-- 7. Akun Pengguna Siswa
('usr-student-1', 'siswa@belajar.id', 'Budi Santoso', 'siswa', '0071234567', 'https://i.pravatar.cc/300?img=12', ARRAY[]::TEXT[])
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    nip = EXCLUDED.nip,
    avatar = EXCLUDED.avatar;

-- 12. Initial Seed Data (Learning Modules BK & Seni Tari)
INSERT INTO public.modules (id, subject, teacher_id, teacher_name, title, level, duration, topics, description, is_ai_recommended, is_published)
VALUES 
-- BK Dinda Riestia
('mod-bk-1', 'Bimbingan Konseling', 'usr-8', 'Dinda Riestia', 'Yuk, Lawan Rasa Malas: Self-Management untuk Konsisten Belajar!', 'Pemula', '30 Menit', ARRAY['Prokrastinasi', 'Penyebab & Dampak', 'Self-Management', 'Dukungan Kelompok'], 'Memahami pengertian prokrastinasi, penyebab dan dampaknya, serta penerapan strategi self-management dan simulasi Buaya Gigitan untuk konsisten belajar.', true, true),
('mod-bk-2', 'Bimbingan Konseling', 'usr-8', 'Dinda Riestia', 'Talent Quest: Temukan Potensimu, Kembangkan Dirimu!', 'Pemula', '35 Menit', ARRAY['Potensi Diri', 'Ragam Potensi', 'Strength-Based', 'Talent Quest Board'], 'Mengenal dan mengembangkan potensi diri melalui pendekatan strength-based, refleksi personal, dan simulasi permainan edukatif Talent Quest.', true, true),
('mod-bk-3', 'Bimbingan Konseling', 'usr-8', 'Dinda Riestia', 'Jati Diri Tanpa Kenakalan', 'Menengah', '40 Menit', ARRAY['Jati Diri Remaja', 'Bentuk Kenakalan', 'Norma Pergaulan', 'Peer Pressure', 'Mind Mapping'], 'Memahami pembentukan jati diri remaja, menyelaraskan norma pergaulan teman sebaya, dan mengatasi peer pressure.', false, true),

-- BK Erintan Tsuraya
('mod-bk-4', 'Bimbingan Konseling', 'usr-7', 'Erintan Tsuraya Rahadatul''Aisy', 'Membangun Konsep Diri Positif', 'Pemula', '30 Menit', ARRAY['Pengertian Konsep Diri', 'Self-Image', 'Self-Esteem', 'Ideal Self', 'Faktor Pembentuk'], 'Memahami konsep diri remaja, 3 komponen utama (self-image, self-esteem, ideal self), faktor lingkungan, serta aktivitas refleksi diri.', true, true),
('mod-bk-5', 'Bimbingan Konseling', 'usr-7', 'Erintan Tsuraya Rahadatul''Aisy', 'Personal Branding: Membangun Citra Diri Positif', 'Pemula', '35 Menit', ARRAY['Personal Branding', 'Potensi Diri', 'Unsur Branding', 'Kesiapan PKL & Kerja'], 'Mengenali keunikan dan potensi diri, membangun citra profesional positif, serta persiapan menghadapi PKL dan dunia kerja bagi siswa SMK.', true, true),
('mod-bk-6', 'Bimbingan Konseling', 'usr-7', 'Erintan Tsuraya Rahadatul''Aisy', 'Persiapan Magang dan Etika di Dunia Kerja', 'Menengah', '40 Menit', ARRAY['Persiapan Magang', 'Soft Skills Vokasi', 'Etika Kerja', 'Tips Profesional'], 'Panduan komprehensif persiapan administratif, keterampilan, mental, dan penampilan serta etika profesional saat magang di industri.', false, true),

-- Seni Tari
('mod-tari-1', 'Seni Tari', 'usr-21', 'Vivi Riska Wardani', 'Konsep Koreografi dalam Seni Tari', 'Pemula', '30 Menit', ARRAY['Koreografi', 'Wirama', 'Wiraga', 'Wirasa'], 'Mempelajari pengertian koreografi, unsur pendukung tari (wirama, wiraga, wirasa), sumber rangsang ide, serta elemen utama ruang, waktu, dan tenaga.', true, true),
('mod-tari-2', 'Seni Tari', 'usr-21', 'Vivi Riska Wardani', 'Koreografi: Eksplorasi Gerak Dalam Seni Tari', 'Pemula', '35 Menit', ARRAY['Eksplorasi Gerak', 'Rangsang Kinestetik', 'Transformasi Gerak', 'Tempo & Level'], 'Memahami prinsip eksplorasi gerak tari, berbagai sumber rangsangan (visual, audio, kinestetik, gagasan), dan teknik pengembangan gerak dasar.', true, true),
('mod-tari-3', 'Seni Tari', 'usr-21', 'Vivi Riska Wardani', 'Koreografi: Komposisi Gerak Tari', 'Menengah', '40 Menit', ARRAY['Struktur Koreografi', 'Desain Pola Lantai', 'Dinamika Musik & Irama', 'Keselarasan Kostum'], 'Mempelajari penyusunan komposisi gerak tari terstruktur, perancangan pola lantai simetris/asimetris, dan keselarasan wiraga-wirama-wirasa.', false, true)
ON CONFLICT (id) DO NOTHING;

-- 13. Initial Seed Data (Articles)
INSERT INTO public.articles (id, title, category, read_time, author, image, excerpt, content, is_featured)
VALUES 
('art-1', 'Strategi Efektif Menguasai Pembelajaran Vokasi Berbasis Proyek', 'Metode Belajar', '4 Menit', 'Tim Kurikulum Sitemsa', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', 'Panduan langkah demi langkah memecah materi kejuruan kompleks menjadi tahapan belajar yang terstruktur.', 'Memahami kompetensi kejuruan membutuhkan latihan praktik dan refleksi secara konsisten...', true),
('art-2', '5 Kunci Sukses Praktik Kerja Lapangan (PKL) di Industri Mitra', 'Karir & Vokasi', '5 Menit', 'Tim Humas & Industri', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', 'Persiapan mental, portofolio keahlian, dan etika kerja profesional sebelum memasuki dunia industri.', 'PKL adalah gerbang utama siswa SMK untuk membuktikan kompetensi teknis di lingkungan kerja nyata...', false)
ON CONFLICT (id) DO NOTHING;

-- 14. Initial Seed Data (24 Team Members PPL Lantip SMK Negeri 1 Semarang)
INSERT INTO public.team_members (id, title, subtitle, handle, division, border_color, image)
VALUES 
('tm-1', 'Damar Hadziq H.', 'Developer', '@damarhadziq', 'Pend. Informatika', '#4F46E5', 'https://i.pravatar.cc/300?img=11'),
('tm-2', 'Mochammad Rizal D. D.', 'Sub-Developer', '@rizaldaffa', 'Pend. Informatika', '#3B82F6', 'https://i.pravatar.cc/300?img=13'),
('tm-3', 'M. Sulthon Abdullah A.', 'Sub-Developer', '@sulthonazzam', 'Pend. Informatika', '#2563EB', 'https://i.pravatar.cc/300?img=19'),
('tm-4', 'Lovyca Imeyra E.', 'Sub-Developer', '@lovycaimeyra', 'Pend. Informatika', '#10B981', 'https://i.pravatar.cc/300?img=25'),
('tm-5', 'Innova Riskianugrah R.', 'Instructional Designer', '@innovariskia', 'BK', '#06B6D4', 'https://i.pravatar.cc/300?img=16'),
('tm-6', 'Fateka Maulana A. K.', 'Instructional Designer', '@fatekamaulana', 'BK', '#10B981', 'https://i.pravatar.cc/300?img=18'),
('tm-7', 'Erintan Tsuraya R.', 'Instructional Designer', '@erintantsuraya', 'BK', '#06B6D4', 'https://i.pravatar.cc/300?img=22'),
('tm-8', 'Dinda Riestia', 'Instructional Designer', '@dindariestia', 'BK', '#8B5CF6', 'https://i.pravatar.cc/300?img=30'),
('tm-9', 'Ardyan Santoso', 'Instructional Designer', '@ardyansantoso', 'Pend. Otomotif', '#3B82F6', 'https://i.pravatar.cc/300?img=17'),
('tm-10', 'Satrio', 'Instructional Designer', '@satrio', 'Pend. Otomotif', '#4F46E5', 'https://i.pravatar.cc/300?img=23'),
('tm-11', 'Agam Ainun Ramadhan', 'Instructional Designer', '@agamainun', 'Pend. Otomotif', '#8B5CF6', 'https://i.pravatar.cc/300?img=27'),
('tm-12', 'Banu Mahmuda H.', 'Instructional Designer', '@banumahmuda', 'Pend. Elektronika', '#EF4444', 'https://i.pravatar.cc/300?img=14'),
('tm-13', 'Anisa Susilawati', 'Instructional Designer', '@anisasusilawati', 'Pend. Elektronika', '#8B5CF6', 'https://i.pravatar.cc/300?img=21'),
('tm-14', 'Nova Milyard', 'Instructional Designer', '@novamilyard', 'Pend. Elektronika', '#EF4444', 'https://i.pravatar.cc/300?img=26'),
('tm-15', 'Vella Pratika I. N.', 'Instructional Designer', '@vellapratika', 'Pend. Elektronika', '#F59E0B', 'https://i.pravatar.cc/300?img=32'),
('tm-16', 'Fahrul Adiyansa', 'Instructional Designer', '@fahruladiyansa', 'Pend. Elektronika', '#8B5CF6', 'https://i.pravatar.cc/300?img=33'),
('tm-17', 'Tubagus Fauzan A.', 'Instructional Designer', '@tubagusfauzan', 'Pend. Elektronika', '#06B6D4', 'https://i.pravatar.cc/300?img=15'),
('tm-18', 'Brilian Anugraheni', 'Instructional Designer', '@briliananugraheni', 'Pend. Olahraga', '#3B82F6', 'https://i.pravatar.cc/300?img=29'),
('tm-19', 'Ahmad Luthfi F.', 'Instructional Designer', '@ahmadluthfi', 'Pend. Olahraga', '#F59E0B', 'https://i.pravatar.cc/300?img=31'),
('tm-20', 'Rinal Febriarso D. P.', 'Instructional Designer', '@rinalfebriarso', 'Pend. Olahraga', '#06B6D4', 'https://i.pravatar.cc/300?img=34'),
('tm-21', 'Vivi Riska Wardani', 'Instructional Designer', '@viviriska', 'Pend. Seni Tari', '#10B981', 'https://i.pravatar.cc/300?img=12'),
('tm-22', 'Anita Dwi Ningtyas', 'Instructional Designer', '@anitadwi', 'Pend. Seni Tari', '#EF4444', 'https://i.pravatar.cc/300?img=20'),
('tm-23', 'Meliana Dwi Yanti', 'Instructional Designer', '@melianadwi', 'Pend. Seni Tari', '#10B981', '/images/meliana.jpg'),
('tm-24', 'Hasnita Ivangka', 'Instructional Designer', '@hasnitaivangka', 'Pend. Seni Tari', '#06B6D4', 'https://i.pravatar.cc/300?img=28')
ON CONFLICT (id) DO NOTHING;

-- 15. Enable Row Level Security (RLS) & Allow public read
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on subjects" ON public.subjects;
CREATE POLICY "Allow public read on subjects" ON public.subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on modules" ON public.modules;
CREATE POLICY "Allow public read on modules" ON public.modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on quizzes" ON public.quizzes;
CREATE POLICY "Allow public read on quizzes" ON public.quizzes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on articles" ON public.articles;
CREATE POLICY "Allow public read on articles" ON public.articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on users" ON public.users;
CREATE POLICY "Allow public read on users" ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write on users" ON public.users;
CREATE POLICY "Allow public write on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on notifications" ON public.notifications;
CREATE POLICY "Allow public read on notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on team_members" ON public.team_members;
CREATE POLICY "Allow public read on team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Allow public read on quiz_attempts" ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);
