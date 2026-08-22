'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsClientService } from '@/services/client/cms.client';
import { HeroContent } from '@/services/data-store';

export const CMS_QUERY_KEY = ['cms', 'hero'] as const;

export function useHeroContent() {
  return useQuery({
    queryKey: CMS_QUERY_KEY,
    queryFn: () => cmsClientService.getHero(),
  });
}

export function useUpdateHeroContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<HeroContent>) => cmsClientService.updateHero(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEY });
    },
  });
}
