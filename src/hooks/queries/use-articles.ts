'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesClientService, ArticleFilterParams } from '@/services/client/articles.client';
import { WebArticle } from '@/services/data-store';

export const ARTICLES_QUERY_KEY = ['articles'] as const;

export function useArticles(filter?: ArticleFilterParams) {
  return useQuery({
    queryKey: [...ARTICLES_QUERY_KEY, filter],
    queryFn: () => articlesClientService.getAll(filter),
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: [...ARTICLES_QUERY_KEY, id],
    queryFn: () => articlesClientService.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<WebArticle, 'id' | 'date'>) => articlesClientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WebArticle> }) =>
      articlesClientService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ARTICLES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articlesClientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
    },
  });
}
