'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersClientService } from '@/services/client/teachers.client';
import { TeacherAccount } from '@/services/data-store';

export const TEACHERS_QUERY_KEY = ['teachers'] as const;

export function useTeachers() {
  return useQuery({
    queryKey: TEACHERS_QUERY_KEY,
    queryFn: () => teachersClientService.getAll(),
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: [...TEACHERS_QUERY_KEY, id],
    queryFn: () => teachersClientService.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<TeacherAccount, 'id' | 'createdAt'>) => teachersClientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TeacherAccount> }) =>
      teachersClientService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TEACHERS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teachersClientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });
    },
  });
}

export function useAssignTeacherSubjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assignedSubjects }: { id: string; assignedSubjects: string[] }) =>
      teachersClientService.assignSubjects(id, assignedSubjects),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TEACHERS_QUERY_KEY, variables.id] });
    },
  });
}
