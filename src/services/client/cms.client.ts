import { request } from './http';
import { HeroContent } from '../data-store';

export const cmsClientService = {
  getHero: async (): Promise<HeroContent> => {
    return request<HeroContent>('/api/cms/hero');
  },

  updateHero: async (payload: Partial<HeroContent>): Promise<HeroContent> => {
    return request<HeroContent>('/api/cms/hero', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
