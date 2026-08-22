import { NextRequest } from 'next/server';
import { ArticleService } from '@/services/article.service';
import { articleSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = ArticleService.getArticleById(id);
    if (!article) {
      return apiError('Artikel tidak ditemukan', 404);
    }
    return apiSuccess(article);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = articleSchema.partial().parse(body);

    const updated = ArticleService.updateArticle(id, validated);
    if (!updated) {
      return apiError('Artikel tidak ditemukan', 404);
    }

    return apiSuccess(updated, 'Artikel berhasil diperbarui');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = ArticleService.deleteArticle(id);
    if (!deleted) {
      return apiError('Artikel tidak ditemukan', 404);
    }

    return apiSuccess(null, 'Artikel berhasil dihapus');
  } catch (error) {
    return handleApiError(error);
  }
}
