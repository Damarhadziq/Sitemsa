-- ==============================================================================
-- SITEMSA (SINTESA) - CANONICAL 24 LANTIP TEAM & SUPERADMIN SYNCHRONIZATION
-- Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor) to sync tables
-- ==============================================================================

-- 1. Ensure tables exist
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guru',
  nip TEXT,
  avatar TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  handle TEXT NOT NULL,
  division TEXT NOT NULL,
  border_color TEXT DEFAULT '#2563EB',
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Delete all non-canonical / dummy users outside the 24 Lantip + 1 Superadmin + 1 Demo Siswa
DELETE FROM public.users
WHERE email NOT IN (
  'admin@sitemsa.sch.id',
  'damar.guru@sitemsa.sch.id',
  'rizal.guru@sitemsa.sch.id',
  'sulthon.guru@sitemsa.sch.id',
  'lovyca.guru@sitemsa.sch.id',
  'innova.guru@sitemsa.sch.id',
  'fateka.guru@sitemsa.sch.id',
  'erintan.guru@sitemsa.sch.id',
  'dinda.guru@sitemsa.sch.id',
  'ardyan.guru@sitemsa.sch.id',
  'satrio.guru@sitemsa.sch.id',
  'agam.guru@sitemsa.sch.id',
  'banu.guru@sitemsa.sch.id',
  'anisa.guru@sitemsa.sch.id',
  'nova.guru@sitemsa.sch.id',
  'vella.guru@sitemsa.sch.id',
  'fahrul.guru@sitemsa.sch.id',
  'tubagus.guru@sitemsa.sch.id',
  'brilian.guru@sitemsa.sch.id',
  'luthfi.guru@sitemsa.sch.id',
  'rinal.guru@sitemsa.sch.id',
  'vivi.guru@sitemsa.sch.id',
  'anita.guru@sitemsa.sch.id',
  'meliana.guru@sitemsa.sch.id',
  'hasnita.guru@sitemsa.sch.id',
  'siswa@sitemsa.sch.id'
);

-- 3. Upsert the Exact 1 Superadmin + 24 Lantip Teachers
INSERT INTO public.users (id, email, name, role, nip, avatar) VALUES
  -- Superadmin
  ('sa-1', 'admin@sitemsa.sch.id', 'Super Administrator Sitemsa', 'superadmin', '19850101 201001 1 001', NULL),

  -- 1. Pend. Informatika
  ('t-inf-1', 'damar.guru@sitemsa.sch.id', 'Damar Hadziq H.', 'superadmin', '19980101 202401 1 001', NULL),
  ('t-inf-2', 'rizal.guru@sitemsa.sch.id', 'Mochammad Rizal D. D.', 'guru', '19980202 202401 1 002', NULL),
  ('t-inf-3', 'sulthon.guru@sitemsa.sch.id', 'M. Sulthon Abdullah A.', 'guru', '19980303 202401 1 003', NULL),
  ('t-inf-4', 'lovyca.guru@sitemsa.sch.id', 'Lovyca Imeyra E.', 'guru', '19980404 202401 2 004', NULL),

  -- 2. Bimbingan Konseling (BK)
  ('t-bk-1', 'innova.guru@sitemsa.sch.id', 'Innova Riskianugrah R.', 'guru', '19980505 202401 2 005', NULL),
  ('t-bk-2', 'fateka.guru@sitemsa.sch.id', 'Fateka Maulana A. K.', 'guru', '19980606 202401 1 006', NULL),
  ('t-bk-3', 'erintan.guru@sitemsa.sch.id', 'Erintan Tsuraya R.', 'guru', '19940822 202012 2 009', NULL),
  ('t-bk-4', 'dinda.guru@sitemsa.sch.id', 'Dinda Riestia', 'guru', '19980808 202401 2 008', NULL),

  -- 3. Pend. Otomotif
  ('t-oto-1', 'ardyan.guru@sitemsa.sch.id', 'Ardyan Santoso', 'guru', '19980909 202401 1 009', NULL),
  ('t-oto-2', 'satrio.guru@sitemsa.sch.id', 'Satrio', 'guru', '19981010 202401 1 010', NULL),
  ('t-oto-3', 'agam.guru@sitemsa.sch.id', 'Agam Ainun Ramadhan', 'guru', '19981111 202401 1 011', NULL),

  -- 4. Pend. Elektronika
  ('t-elk-1', 'banu.guru@sitemsa.sch.id', 'Banu Mahmuda H.', 'guru', '19981212 202401 1 012', NULL),
  ('t-elk-2', 'anisa.guru@sitemsa.sch.id', 'Anisa Susilawati', 'guru', '19981313 202401 2 013', NULL),
  ('t-elk-3', 'nova.guru@sitemsa.sch.id', 'Nova Milyard', 'guru', '19981414 202401 2 014', NULL),
  ('t-elk-4', 'vella.guru@sitemsa.sch.id', 'Vella Pratika I. N.', 'guru', '19981515 202401 2 015', NULL),
  ('t-elk-5', 'fahrul.guru@sitemsa.sch.id', 'Fahrul Adiyansa', 'guru', '19981616 202401 1 016', NULL),
  ('t-elk-6', 'tubagus.guru@sitemsa.sch.id', 'Tubagus Fauzan A.', 'guru', '19981717 202401 1 017', NULL),

  -- 5. Pend. Olahraga
  ('t-olr-1', 'brilian.guru@sitemsa.sch.id', 'Brilian Anugraheni', 'guru', '19981818 202401 2 018', NULL),
  ('t-olr-2', 'luthfi.guru@sitemsa.sch.id', 'Ahmad Luthfi F.', 'guru', '19981919 202401 1 019', NULL),
  ('t-olr-3', 'rinal.guru@sitemsa.sch.id', 'Rinal Febriarso D. P.', 'guru', '19982020 202401 1 020', NULL),

  -- 6. Pend. Seni Tari
  ('t-tari-1', 'vivi.guru@sitemsa.sch.id', 'Vivi Riska Wardani', 'guru', '19982121 202401 2 021', NULL),
  ('t-tari-2', 'anita.guru@sitemsa.sch.id', 'Anita Dwi Ningtyas', 'guru', '19982222 202401 2 022', NULL),
  ('t-tari-3', 'meliana.guru@sitemsa.sch.id', 'Meliana Dwi Yanti', 'guru', '19982323 202401 2 023', NULL),
  ('t-tari-4', 'hasnita.guru@sitemsa.sch.id', 'Hasnita Ivangka', 'guru', '19982424 202401 2 024', NULL),

  -- Demo Siswa
  ('std-1', 'siswa@sitemsa.sch.id', 'Andi Pratama', 'siswa', NULL, NULL)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  nip = EXCLUDED.nip,
  avatar = EXCLUDED.avatar;

-- 4. Delete & Populate public.team_members
DELETE FROM public.team_members;

INSERT INTO public.team_members (id, name, role, handle, division, border_color, image) VALUES
  ('tm-1', 'Damar Hadziq H.', 'Developer', '@damarhadziq', 'Pend. Informatika', '#4F46E5', NULL),
  ('tm-2', 'Mochammad Rizal D. D.', 'Sub-Developer', '@rizaldaffa', 'Pend. Informatika', '#3B82F6', NULL),
  ('tm-3', 'M. Sulthon Abdullah A.', 'Sub-Developer', '@sulthonazzam', 'Pend. Informatika', '#2563EB', NULL),
  ('tm-4', 'Lovyca Imeyra E.', 'Sub-Developer', '@lovycaimeyra', 'Pend. Informatika', '#10B981', NULL),
  ('tm-5', 'Innova Riskianugrah R.', 'Instructional Designer', '@innovariskia', 'BK', '#06B6D4', NULL),
  ('tm-6', 'Fateka Maulana A. K.', 'Instructional Designer', '@fatekamaulana', 'BK', '#10B981', NULL),
  ('tm-7', 'Erintan Tsuraya R.', 'Instructional Designer', '@erintantsuraya', 'BK', '#06B6D4', NULL),
  ('tm-8', 'Dinda Riestia', 'Instructional Designer', '@dindariestia', 'BK', '#8B5CF6', NULL),
  ('tm-9', 'Ardyan Santoso', 'Instructional Designer', '@ardyansantoso', 'Pend. Otomotif', '#3B82F6', NULL),
  ('tm-10', 'Satrio', 'Instructional Designer', '@satrio', 'Pend. Otomotif', '#4F46E5', NULL),
  ('tm-11', 'Agam Ainun Ramadhan', 'Instructional Designer', '@agamainun', 'Pend. Otomotif', '#8B5CF6', NULL),
  ('tm-12', 'Banu Mahmuda H.', 'Instructional Designer', '@banumahmuda', 'Pend. Elektronika', '#EF4444', NULL),
  ('tm-13', 'Anisa Susilawati', 'Instructional Designer', '@anisasusilawati', 'Pend. Elektronika', '#8B5CF6', NULL),
  ('tm-14', 'Nova Milyard', 'Instructional Designer', '@novamilyard', 'Pend. Elektronika', '#EF4444', NULL),
  ('tm-15', 'Vella Pratika I. N.', 'Instructional Designer', '@vellapratika', 'Pend. Elektronika', '#F59E0B', NULL),
  ('tm-16', 'Fahrul Adiyansa', 'Instructional Designer', '@fahruladiyansa', 'Pend. Elektronika', '#8B5CF6', NULL),
  ('tm-17', 'Tubagus Fauzan A.', 'Instructional Designer', '@tubagusfauzan', 'Pend. Elektronika', '#06B6D4', NULL),
  ('tm-18', 'Brilian Anugraheni', 'Instructional Designer', '@briliananugraheni', 'Pend. Olahraga', '#3B82F6', NULL),
  ('tm-19', 'Ahmad Luthfi F.', 'Instructional Designer', '@ahmadluthfi', 'Pend. Olahraga', '#F59E0B', NULL),
  ('tm-20', 'Rinal Febriarso D. P.', 'Instructional Designer', '@rinalfebriarso', 'Pend. Olahraga', '#06B6D4', NULL),
  ('tm-21', 'Vivi Riska Wardani', 'Instructional Designer', '@viviriska', 'Pend. Seni Tari', '#10B981', NULL),
  ('tm-22', 'Anita Dwi Ningtyas', 'Instructional Designer', '@anitadwi', 'Pend. Seni Tari', '#EF4444', NULL),
  ('tm-23', 'Meliana Dwi Yanti', 'Instructional Designer', '@melianadwi', 'Pend. Seni Tari', '#10B981', NULL),
  ('tm-24', 'Hasnita Ivangka', 'Instructional Designer', '@hasnitaivangka', 'Pend. Seni Tari', '#06B6D4', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  handle = EXCLUDED.handle,
  division = EXCLUDED.division,
  border_color = EXCLUDED.border_color,
  image = EXCLUDED.image;
