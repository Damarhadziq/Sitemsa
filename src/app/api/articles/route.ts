import { NextRequest } from 'next/server';
import { ArticleService } from '@/services/article.service';
import { articleSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const featuredOnly = searchParams.get('featuredOnly') === 'true';

    const articles = ArticleService.getAllArticles({ category, featuredOnly });
    return apiSuccess(articles);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = articleSchema.parse(body);

    const newArticle = ArticleService.createArticle(validated);
    return apiSuccess(newArticle, 'Artikel tips belajar berhasil diterbitkan', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
