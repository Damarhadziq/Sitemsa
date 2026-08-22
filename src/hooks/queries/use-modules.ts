'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesClientService, ModuleFilterParams } from '@/services/client/modules.client';
import { ModuleItem } from '@/services/data-store';
import { SUBJECTS_QUERY_KEY } from './use-subjects';

export const MODULES_QUERY_KEY = ['modules'] as const;

export function useModules(filter?: ModuleFilterParams) {
  return useQuery({
    queryKey: [...MODULES_QUERY_KEY, filter],
    queryFn: () => modulesClientService.getAll(filter),
  });
}

export function useModule(id: string) {
  return useQuery({
    queryKey: [...MODULES_QUERY_KEY, id],
    queryFn: () => modulesClientService.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ModuleItem, 'id' | 'createdAt'>) => modulesClientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ModuleItem> }) =>
      modulesClientService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...MODULES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => modulesClientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
  });
}
