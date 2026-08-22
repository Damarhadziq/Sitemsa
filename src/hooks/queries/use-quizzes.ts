'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizzesClientService, QuizFilterParams } from '@/services/client/quizzes.client';
import { QuizItem } from '@/services/data-store';
import { QuizCreateInput } from '@/services/quiz.service';
import { QuizSubmissionPayload } from '@/services/grading.service';
import { SUBJECTS_QUERY_KEY } from './use-subjects';
import { STUDENTS_QUERY_KEY } from './use-students';

export const QUIZZES_QUERY_KEY = ['quizzes'] as const;

export function useQuizzes(filter?: QuizFilterParams) {
  return useQuery({
    queryKey: [...QUIZZES_QUERY_KEY, filter],
    queryFn: () => quizzesClientService.getAll(filter),
  });
}

export function useQuiz(id: string, role?: string) {
  return useQuery({
    queryKey: [...QUIZZES_QUERY_KEY, id, role],
    queryFn: () => quizzesClientService.getById(id, role),
    enabled: Boolean(id),
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuizCreateInput) => quizzesClientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZZES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QuizItem> }) =>
      quizzesClientService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUIZZES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUIZZES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizzesClientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZZES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, payload }: { quizId: string; payload: QuizSubmissionPayload }) =>
      quizzesClientService.submit(quizId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZZES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
  });
}
