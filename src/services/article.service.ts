import { dbStore, WebArticle } from './data-store';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'sintesa_articles_cache_v1';

export class ArticleService {
  private static ensureHydrated() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbStore.articles = parsed;
          }
        }
      } catch (e) {
        console.error('Error hydrating articles:', e);
      }
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

        dbStore.articles = mapped;
        this.persist();
        return mapped;
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
    return dbStore.articles.find((a) => a.id === id) || null;
  }

  static async createArticle(data: Omit<WebArticle, 'id' | 'date'>): Promise<WebArticle> {
    this.ensureHydrated();
    const newId = `art-${Date.now()}`;
    const newArticle: WebArticle = {
      id: newId,
      ...data,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    dbStore.articles.unshift(newArticle);
    this.persist();

    if (supabase) {
      try {
        await supabase.from('articles').insert({
          id: newId,
          title: data.title,
          category: data.category,
          read_time: data.readTime,
          author: data.author,
          image: data.image,
          excerpt: data.excerpt,
          content: data.content,
          is_featured: data.isFeatured || false,
        });
      } catch (e) {
        console.warn('Failed to insert article to Supabase:', e);
      }
    }

    return newArticle;
  }

  static async updateArticle(id: string, updates: Partial<WebArticle>): Promise<WebArticle | null> {
    this.ensureHydrated();
    const idx = dbStore.articles.findIndex((a) => a.id === id);
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

  static async deleteArticle(id: string): Promise<boolean> {
    this.ensureHydrated();
    const initialLen = dbStore.articles.length;
    dbStore.articles = dbStore.articles.filter((a) => a.id !== id);
    this.persist();

    if (supabase) {
      try {
        await supabase.from('articles').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete article in Supabase:', e);
      }
    }

    return dbStore.articles.length < initialLen;
  }
}
