'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsClientService } from '@/services/client/students.client';

export const STUDENTS_QUERY_KEY = ['students'] as const;

export function useStudentProgress(studentId: string) {
  return useQuery({
    queryKey: [...STUDENTS_QUERY_KEY, 'progress', studentId],
    queryFn: () => studentsClientService.getProgress(studentId),
    enabled: Boolean(studentId),
  });
}

export function useUpdateStudentProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, subject, progress }: { studentId: string; subject: string; progress: number }) =>
      studentsClientService.updateProgress(studentId, subject, progress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...STUDENTS_QUERY_KEY, 'progress', variables.studentId] });
      queryClient.invalidateQueries({ queryKey: [...STUDENTS_QUERY_KEY, 'monitoring'] });
    },
  });
}

export function useMonitoringSummary(subject?: string) {
  return useQuery({
    queryKey: [...STUDENTS_QUERY_KEY, 'monitoring', subject],
    queryFn: () => studentsClientService.getMonitoringSummary(subject),
  });
}
