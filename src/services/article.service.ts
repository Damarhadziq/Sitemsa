import { dbStore, WebArticle } from './data-store';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'sintesa_articles_cache_v1';

export const INITIAL_10_ARTICLES: WebArticle[] = [
  {
    id: 'art-1',
    title: '5 Strategi Efektif Menguasai Logika Pemrograman',
    category: 'Informatika',
    readTime: '5 Menit',
    author: 'Tim Informatika',
    date: '2026-08-20',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Pelajari pendekatan bertahap untuk mengasah logika komputasi, menyusun algoritma, dan memecahkan masalah pemrograman dengan mudah.',
    content: `Pahami Alur Berpikir Komputasional
Sebelum langsung menulis kode program di editor, biasakan menyusun algoritma sederhana dengan pseudocode atau diagram alur di kertas catatan. Pendekatan ini membantu memvisualisasikan struktur logika secara jernih tanpa terdistraksi syntax error.

Pecah Masalah Kompleks Menjadi Bagian Kecil (Dekomposisi)
Jangan mencoba menyelesaikan seluruh masalah sekaligus. Pecah program menjadi fungsi-fungsi kecil yang berfokus pada satu tugas spesifik. Metode ini memudahkan proses pengujian dan pelacakan bug saat kode berjalan.

Manfaatkan Metode Rubber Duck Debugging
Saat menemukan error yang membingungkan, jelaskan baris demi baris logika kodenya secara lisan atau tuliskan kembali kalimat penjelasannya. Cara ini terbukti ampuh menemukan logika yang terlewat.

Gunakan Latihan Praktik Terukur
Praktik langsung jauh lebih efektif dibandingkan sekadar membaca teori. Kerjakan soal-soal latihan kecil di setiap akhir modul materi Sitemsa untuk memperkuat insting pemrograman.`,
    isFeatured: true,
  },
  {
    id: 'art-2',
    title: 'Teknik Pomodoro: Solusi Fokus Tanpa Cepat Lelah',
    category: 'Bimbingan Konseling',
    readTime: '4 Menit',
    author: 'Bimbingan Konseling',
    date: '2026-08-20',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Cara praktis mengatur sesi belajar 25 menit dengan istirahat teratur untuk menjaga konsentrasi puncak dan mencegah kejenuhan mental.',
    content: `Konsep Dasar Interval Pomodoro
Bagi waktu belajarmu menjadi interval 25 menit fokus penuh tanpa distraksi gadget, dilanjutkan dengan istirahat singkat selama 5 menit. Siklus ini membantu otak menjaga kebugaran kognitif secara konsisten.

Pentingnya Sesi Istirahat Panjang
Setelah menyelesaikan 4 siklus Pomodoro (total 100 menit waktu belajar), luangkan waktu istirahat panjang selama 15-30 menit untuk menyegarkan pikiran dan mengonsolidasi daya ingat.

Hindari Multitasking Saat Sesi Belajar
Fokuslah pada satu topik atau satu soal kuis saja dalam setiap interval Pomodoro. Berpindah-pindah tugas secara mendadak dapat menurunkan efisiensi memori hingga 40%.`,
    isFeatured: true,
  },
  {
    id: 'art-3',
    title: 'Mengenal Dasar Rangkaian Listrik & Komponen Pasif',
    category: 'Elektronika',
    readTime: '6 Menit',
    author: 'Tim Elektronika',
    date: '2026-08-21',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Panduan komprehensif untuk memahami prinsip kerja resistor, kapasitor, dan induktor dalam sirkuit elektronika vokasi.',
    content: `Peran Utama Resistor dalam Pembatasan Arus
Resistor berfungsi membatasi besarnya arus listrik yang mengalir dalam sirkuit. Pelajari kode warna resistor untuk membaca nilai resistansi secara cepat dan akurat.

Penyimpanan Energi Sementara pada Kapasitor
Kapasitor bertindak sebagai penyimpan muatan energi listrik sementara dan penyaring gelombang frekuensi. Pahami perbedaan antara kapasitor polar dan non-polar untuk keamanan perakitan.

Penerapan Hukum Ohm pada Praktik Bengkel
Kuasai hubungan antara tegangan (V), arus (I), dan hambatan (R) melalui rumus dasar V = I × R. Rumus ini merupakan pondasi utama dalam merancang maupun menganalisis masalah sirkuit listrik.`,
    isFeatured: false,
  },
  {
    id: 'art-4',
    title: 'Metode Active Recall & Spaced Repetition untuk Teori Vokasi',
    category: 'Strategi Belajar',
    readTime: '5 Menit',
    author: 'Tim Kurikulum',
    date: '2026-08-21',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Teknik belajar berbasis bukti ilmiah untuk memperkuat daya ingat jangka panjang menghadapi ujian teori dan praktikum.',
    content: `Tinggalkan Cara Membaca Ulang Pasif
Membaca ulang catatan berkali-kali memberikan ilusi mastery. Sebaliknya, uji ingatanmu dengan menutup catatan dan mencoba menjelaskan kembali konsep utama secara lisan.

Jadwalkan Pengulangan Berkala (Spaced Repetition)
Ulangi materi yang dipelajari dengan interval waktu yang bertahap: H+1 setelah materi disampaikan, H+3, H+7, dan H+14. Pola ini mencegah meluruhnya kurva ingatan.`,
    isFeatured: false,
  },
  {
    id: 'art-5',
    title: 'Menjaga Kebugaran Fisik & Stamina Saat Ujian Praktik Bengkel',
    category: 'Keolahragaan',
    readTime: '4 Menit',
    author: 'Tim Keolahragaan',
    date: '2026-08-22',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Pengaturan gizi, hidrasi, dan postur ergonomi agar stamina tetap prima saat menempuh asesmen praktik laboratorium yang panjang.',
    content: `Pentingnya Hidrasi Tubuh Secara Teratur
Kekurangan cairan tubuh sebesar 2% saja dapat menurunkan tingkat konsentrasi dan respon motorik hingga 20%. Pastikan konsumsi air putih minimal 2 liter setiap hari.

Pola Istirahat Cukup Sebelum Hari H
Hindari sistem skenario belajar semalam suntuk (SKS). Tidur berkualitas selama 7-8 jam sebelum ujian sangat krusial agar koordinasi mata dan tangan saat praktik bengkel tetap presisi.`,
    isFeatured: false,
  },
  {
    id: 'art-6',
    title: 'Panduan Membaca Skema Elektronika & Wiring Diagram',
    category: 'Elektronika',
    readTime: '7 Menit',
    author: 'Tim Elektronika',
    date: '2026-08-22',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Langkah-langkah sistematis menerjemahkan gambar diagram simbolis menjadi tata letak komponen nyata di breadboard atau PCB.',
    content: `Kenali Simbol Standardisasi Internasional
Pelajari simbol-simbol standar ISO/IEEE untuk komponen elektronik seperti transistor, dioda, sakelar, dan ground.

Telusuri Jalur Daya & Ground Terlebih Dahulu
Saat merakit di breadboard, sambungkan bus tegangan utama (VCC/GND) terlebih dahulu sebelum memasang jalur sinyal antar-komponen.`,
    isFeatured: false,
  },
  {
    id: 'art-7',
    title: 'Manajemen Catatan Digital: Menata Kode & Dokumentasi Proyek',
    category: 'Informatika',
    readTime: '5 Menit',
    author: 'Tim Informatika',
    date: '2026-08-23',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Tips mengorganisir snippet kode, jurnal laboratorium, dan repositori proyek agar rapi dan mudah diakses kapan saja.',
    content: `Gunakan Penamaan File & Commit yang Konsisten
Beri nama file project dan commit git dengan format yang jelas dan mendeskripsikan perubahan secara singkat.

Dokumentasikan Langkah Troubleshooting
Setiap kali berhasil menyelesaikan bug yang rumit, catat penyebab dan solusinya pada jurnal digital milikmu agar tidak perlu mencari dari awal jika masalah serupa terulang.`,
    isFeatured: false,
  },
  {
    id: 'art-8',
    title: 'Panduan Membaca Wiring Diagram Kelistrikan Mobil',
    category: 'Otomotif',
    readTime: '6 Menit',
    author: 'Tim Otomotif',
    date: '2026-08-23',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Langkah sistematis membaca jalur arus utama, relay, fuse box, dan kode warna kabel pada sistem kelistrikan otomotif modern.',
    content: `Pahami Kode Warna Kabel dan Simbol Standar
Setiap produsen otomotif menggunakan kode warna standar (seperti B = Black/Ground, W = White, R = Red). Menguasai kode ini mempercepat pelacakan sumber arus tanpa salah potong kabel.

Uji Tegangan dengan Multimeter dan Test Lamp
Gunakan test lamp untuk verifikasi cepat adanya arus dan multimeter digital untuk mengukur drop tegangan pada sambungan konektor.`,
    isFeatured: false,
  },
  {
    id: 'art-9',
    title: 'Teknik Olah Tubuh & Pemanasan Penari Tradisional',
    category: 'Seni Tari',
    readTime: '5 Menit',
    author: 'Tim Seni Tari',
    date: '2026-08-24',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Latihan kelenturan sendi, penguatan otot inti, dan pernapasan ritmis untuk mendukung postur menari yang anggun dan bebas cedera.',
    content: `Latihan Peregangan Dinamis Sendi dan Tulang Belakang
Lakukan peregangan leher, bahu, pergelangan tangan, dan pinggul selama 10-15 menit sebelum mulai menari agar gerak wiraga mengalir luwes.

Pernapasan Diafragma untuk Stabilitas Gerak
Kuasai pernapasan diafragma agar tidak terengah-engah saat membawakan tarian bertempo cepat dan dinamis.`,
    isFeatured: false,
  },
  {
    id: 'art-10',
    title: 'Mengatasi Demam Panggung & Membangun Rasa Percaya Diri',
    category: 'Bimbingan Konseling',
    readTime: '4 Menit',
    author: 'Bimbingan Konseling',
    date: '2026-08-24',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Teknik pernapasan diafragma 4-7-8 dan afirmasi positif untuk mengendalikan kecemasan sebelum presentasi atau ujian praktik.',
    content: `Metode Relaksasi Pernapasan 4-7-8
Tarik napas melalui hidung selama 4 detik, tahan selama 7 detik, dan hembuskan perlahan lewat mulut selama 8 detik. Lakukan 3-4 siklus untuk menurunkan detak jantung yang berdebar kencang.

Fokus pada Nilai Manfaat yang Disampaikan
Alihkan fokus dari rasa takut dinilai orang lain menjadi semangat membagikan hasil karya dan proses belajarmu yang terbaik.`,
    isFeatured: true,
  },
];

export class ArticleService {
  private static ensureHydrated() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbStore.articles = parsed;
            return;
          }
        }
      } catch (e) {
        console.error('Error hydrating articles:', e);
      }
    }
    if (!dbStore.articles || dbStore.articles.length === 0) {
      dbStore.articles = [...INITIAL_10_ARTICLES];
    }
  }

  private static persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbStore.articles));
      } catch (e) {
        console.error('Error persisting articles:', e);
      }
    }
  }

  static async fetchFromSupabase(): Promise<WebArticle[]> {
    this.ensureHydrated();
    if (!supabase) return dbStore.articles;

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase articles fetch warning:', error.message);
        return dbStore.articles;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const mapped: WebArticle[] = data.map((item: any) => ({
          id: String(item.id),
          title: item.title || 'Tips Belajar',
          category: item.category || 'Tips Belajar',
          readTime: item.read_time || '5 Menit',
          author: item.author || 'Tim Sitemsa',
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Hari ini',
          image: item.image || '/images/hero-banner.png',
          excerpt: item.excerpt || item.title,
          content: item.content || item.excerpt,
          isFeatured: Boolean(item.is_featured),
        }));

        // If Supabase has fewer than 10 articles, merge with standard 10 articles and seed Supabase
        if (mapped.length < 10) {
          const existingTitles = new Set(mapped.map((m) => m.title.toLowerCase().trim()));
          const missing = INITIAL_10_ARTICLES.filter((a) => !existingTitles.has(a.title.toLowerCase().trim()));

          if (missing.length > 0) {
            // Seed missing articles to Supabase
            for (const item of missing) {
              try {
                await supabase.from('articles').upsert({
                  id: item.id,
                  title: item.title,
                  category: item.category,
                  read_time: item.readTime,
                  author: item.author,
                  image: item.image,
                  excerpt: item.excerpt,
                  content: item.content,
                  is_featured: item.isFeatured || false,
                }, { onConflict: 'id' });
              } catch {}
            }

            const merged = [...mapped, ...missing];
            dbStore.articles = merged;
            this.persist();
            return merged;
          }
        }

        dbStore.articles = mapped;
        this.persist();
        return mapped;
      } else {
        // Supabase is completely empty, seed all 10 articles
        for (const item of INITIAL_10_ARTICLES) {
          try {
            await supabase.from('articles').upsert({
              id: item.id,
              title: item.title,
              category: item.category,
              read_time: item.readTime,
              author: item.author,
              image: item.image,
              excerpt: item.excerpt,
              content: item.content,
              is_featured: item.isFeatured || false,
            }, { onConflict: 'id' });
          } catch {}
        }

        dbStore.articles = INITIAL_10_ARTICLES;
        this.persist();
        return INITIAL_10_ARTICLES;
      }
    } catch (e) {
      console.warn('Supabase articles exception:', e);
    }

    return dbStore.articles;
  }

  static getAllArticles(filter?: { category?: string; featuredOnly?: boolean }): WebArticle[] {
    this.ensureHydrated();
    let result = dbStore.articles;

    if (filter?.category) {
      result = result.filter((a) => a.category.toLowerCase() === filter.category?.toLowerCase());
    }

    if (filter?.featuredOnly) {
      result = result.filter((a) => a.isFeatured);
    }

    return result;
  }

  static getArticleById(id: string): WebArticle | null {
    this.ensureHydrated();
    return dbStore.articles.find((a) => String(a.id) === String(id)) || null;
  }

  static async createArticle(data: Omit<WebArticle, 'id' | 'date'> & { id?: string }): Promise<WebArticle> {
    this.ensureHydrated();
    const newId = data.id || `art-${Date.now()}`;
    const newArticle: WebArticle = {
      id: newId,
      ...data,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    dbStore.articles.unshift(newArticle);
    this.persist();

    if (supabase) {
      try {
        await supabase.from('articles').upsert({
          id: newId,
          title: data.title,
          category: data.category,
          read_time: data.readTime,
          author: data.author,
          image: data.image,
          excerpt: data.excerpt,
          content: data.content,
          is_featured: data.isFeatured || false,
        }, { onConflict: 'id' });
      } catch (e) {
        console.warn('Failed to insert article to Supabase:', e);
      }
    }

    return newArticle;
  }

  static async updateArticle(id: string, updates: Partial<WebArticle>): Promise<WebArticle | null> {
    this.ensureHydrated();
    const idx = dbStore.articles.findIndex((a) => String(a.id) === String(id));
    if (idx === -1) return null;

    dbStore.articles[idx] = { ...dbStore.articles[idx], ...updates };
    this.persist();

    if (supabase) {
      try {
        await supabase.from('articles').update({
          title: updates.title,
          category: updates.category,
          read_time: updates.readTime,
          author: updates.author,
          image: updates.image,
          excerpt: updates.excerpt,
          content: updates.content,
          is_featured: updates.isFeatured,
        }).eq('id', id);
      } catch (e) {
        console.warn('Failed to update article in Supabase:', e);
      }
    }

    return dbStore.articles[idx];
  }

  static async deleteArticle(id: string, title?: string): Promise<boolean> {
    this.ensureHydrated();
    const initialLen = dbStore.articles.length;
    dbStore.articles = dbStore.articles.filter((a) => String(a.id) !== String(id) && (title ? a.title.toLowerCase() !== title.toLowerCase() : true));
    this.persist();

    if (supabase) {
      try {
        await supabase.from('articles').delete().eq('id', id);
        if (title) {
          await supabase.from('articles').delete().ilike('title', title);
        }
      } catch (e) {
        console.warn('Failed to delete article in Supabase:', e);
      }
    }

    return dbStore.articles.length < initialLen;
  }
}
