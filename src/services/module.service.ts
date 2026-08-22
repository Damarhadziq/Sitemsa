import { dbStore, ModuleItem } from './data-store';

export class ModuleService {
  static getAllModules(filter?: { subject?: string; level?: string; teacherId?: string }): ModuleItem[] {
    let result = dbStore.modules;

    if (filter?.subject) {
      result = result.filter((m) => m.subject.toLowerCase() === filter.subject?.toLowerCase());
    }

    if (filter?.level) {
      result = result.filter((m) => m.level === filter.level);
    }

    if (filter?.teacherId) {
      result = result.filter((m) => m.teacherId === filter.teacherId);
    }

    return result;
  }

  static getModuleById(id: string): ModuleItem | null {
    return dbStore.modules.find((m) => m.id === id) || null;
  }

  static createModule(data: Omit<ModuleItem, 'id' | 'createdAt'>): ModuleItem {
    const newId = `mod-${Date.now()}`;
    const newModule: ModuleItem = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    };
    dbStore.modules.unshift(newModule);

    // Automatically update subject module count
    const subject = dbStore.subjects.find((s) => s.name.toLowerCase() === newModule.subject.toLowerCase());
    if (subject) {
      subject.totalModules = (subject.totalModules || 0) + 1;
    }

    return newModule;
  }

  static updateModule(id: string, updates: Partial<ModuleItem>): ModuleItem | null {
    const idx = dbStore.modules.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    dbStore.modules[idx] = { ...dbStore.modules[idx], ...updates };
    return dbStore.modules[idx];
  }

  static deleteModule(id: string): boolean {
    const moduleItem = dbStore.modules.find((m) => m.id === id);
    if (!moduleItem) return false;

    const initialLen = dbStore.modules.length;
    dbStore.modules = dbStore.modules.filter((m) => m.id !== id);

    // Decrement subject count
    const subject = dbStore.subjects.find((s) => s.name.toLowerCase() === moduleItem.subject.toLowerCase());
    if (subject && subject.totalModules > 0) {
      subject.totalModules -= 1;
    }

    return dbStore.modules.length < initialLen;
  }
}
