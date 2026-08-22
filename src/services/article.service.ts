import { dbStore, WebArticle } from './data-store';

export class ArticleService {
  static getAllArticles(filter?: { category?: string; featuredOnly?: boolean }): WebArticle[] {
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
    return dbStore.articles.find((a) => a.id === id) || null;
  }

  static createArticle(data: Omit<WebArticle, 'id' | 'date'>): WebArticle {
    const newId = `art-${Date.now()}`;
    const newArticle: WebArticle = {
      id: newId,
      ...data,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    dbStore.articles.unshift(newArticle);
    return newArticle;
  }

  static updateArticle(id: string, updates: Partial<WebArticle>): WebArticle | null {
    const idx = dbStore.articles.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    dbStore.articles[idx] = { ...dbStore.articles[idx], ...updates };
    return dbStore.articles[idx];
  }

  static deleteArticle(id: string): boolean {
    const initialLen = dbStore.articles.length;
    dbStore.articles = dbStore.articles.filter((a) => a.id !== id);
    return dbStore.articles.length < initialLen;
  }
}
