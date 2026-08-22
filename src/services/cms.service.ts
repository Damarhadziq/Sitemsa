import { dbStore, HeroContent } from './data-store';

export class CmsService {
  static getHeroContent(): HeroContent {
    return dbStore.heroContent;
  }

  static updateHeroContent(updates: Partial<HeroContent>): HeroContent {
    dbStore.heroContent = {
      ...dbStore.heroContent,
      ...updates,
    };
    return dbStore.heroContent;
  }
}
