# Sitemsa — Platform Pembelajaran Digital Vokasi

Sitemsa (Sintesa Learning Space) adalah platform pembelajaran interaktif vokasi untuk siswa, pengajar/guru, dan superadministrator yang dikembangkan oleh Tim PPL Lantip 7 SMK Negeri 1 Semarang & Universitas Negeri Semarang (UNNES).

---

## 🚀 Panduan Jalankan Proyek untuk Tim (GitHub Clone)

Untuk anggota tim yang baru saja mengklon (*clone*) repositori ini dari GitHub, ikuti langkah-langkah berikut:

### 1. Klon Repositori
```bash
git clone <URL_REPOSITORI_GITHUB>
cd SINTESA
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Salin Environment Variables
Salin file templat `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
# Pada Windows PowerShell:
# Copy-Item .env.example .env.local
```

### 4. Jalankan Server Pengembang (Local Dev)
```bash
npm run dev
```

Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🔐 Akun Akses Demo (Local Test)

| Peran | Email | Kata Sandi | Halaman Utama |
| :--- | :--- | :--- | :--- |
| **Siswa** | `siswa@sintesa.id` | *(Bebas)* | `/` |
| **Guru / Pengajar** | `budi.guru@sintesa.id` | *(Bebas)* | `/admin/guru` |
| **Superadministrator** | `admin@sintesa.id` | *(Bebas)* | `/admin/superadmin` |

---

## 🛠️ Teknologi & Fitur Utama

- **Framework**: Next.js 16 (App Router & Turbopack)
- **UI & Iconography**: React, Tailwind CSS, Lucide React, Hugeicons
- **Desain & Responsif**: Mobile-First Responsive, CSS Glassmorphism, Zero Layout Shift
- **State & Auth**: Client-side Mock State & Role Auth Context (`useAuth`)
