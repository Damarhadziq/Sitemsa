'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsClientService } from '@/services/client/subjects.client';
import { SubjectItem } from '@/services/data-store';

export const SUBJECTS_QUERY_KEY = ['subjects'] as const;

export function useSubjects() {
  return useQuery({
    queryKey: SUBJECTS_QUERY_KEY,
    queryFn: () => subjectsClientService.getAll(),
  });
}

export function useSubject(id: string) {
  return useQuery({
    queryKey: [...SUBJECTS_QUERY_KEY, id],
    queryFn: () => subjectsClientService.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<SubjectItem, 'id' | 'totalModules' | 'totalQuizzes'>) =>
      subjectsClientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubjectItem> }) =>
      subjectsClientService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...SUBJECTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectsClientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
  });
}
