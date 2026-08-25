'use client';

export interface WeeklyTargetState {
  targetCount: number;
  completedCount: number;
  completedModuleIds: string[];
  lastUpdated: string;
}

const STORAGE_KEY = 'sintesa_weekly_target_v1';
const DEFAULT_TARGET = 5;

// Clean production initial state (0 completed until student actually finishes materials)
const INITIAL_STATE: WeeklyTargetState = {
  targetCount: DEFAULT_TARGET,
  completedCount: 0,
  completedModuleIds: [],
  lastUpdated: new Date().toISOString().split('T')[0],
};

/**
 * Get current weekly target progress
 */
export const getWeeklyTarget = (): {
  completed: number;
  target: number;
  percentage: number;
  isCompleted: boolean;
  message: string;
} => {
  if (typeof window === 'undefined') {
    return {
      completed: 0,
      target: 5,
      percentage: 0,
      isCompleted: false,
      message: 'Mulai langkah belajarmu minggu ini dengan 1 materi baru!',
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: WeeklyTargetState = raw ? JSON.parse(raw) : INITIAL_STATE;

    const completed = Math.max(0, data.completedCount || 0);
    const target = Math.max(1, data.targetCount || DEFAULT_TARGET);
    const percentage = Math.min(100, Math.round((completed / target) * 100));
    const isCompleted = completed >= target;

    let message = 'Sedikit lagi, pertahankan rentetan belajarmu!';
    if (completed === 0) {
      message = 'Mulai langkah belajarmu minggu ini dengan 1 materi baru!';
    } else if (isCompleted) {
      message = '🎉 Luar biasa! Target belajarmu minggu ini sudah tercapai sempurna!';
    } else if (target - completed === 1) {
      message = 'Tinggal 1 materi lagi untuk menuntaskan target mingguan!';
    } else {
      message = `${target - completed} materi lagi untuk capai target mingguanmu!`;
    }

    return {
      completed,
      target,
      percentage,
      isCompleted,
      message,
    };
  } catch (e) {
    console.error('Error getting weekly target:', e);
    return {
      completed: 3,
      target: 5,
      percentage: 60,
      isCompleted: false,
      message: 'Sedikit lagi, pertahankan rentetan belajarmu!',
    };
  }
};

/**
 * Record a completed module to dynamically increase weekly progress
 */
export const recordModuleCompletion = (moduleId: string): void => {
  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: WeeklyTargetState = raw ? JSON.parse(raw) : INITIAL_STATE;

    const ids = Array.isArray(data.completedModuleIds) ? data.completedModuleIds : [];

    if (!ids.includes(moduleId)) {
      ids.push(moduleId);
      const updated: WeeklyTargetState = {
        ...data,
        completedCount: ids.length,
        completedModuleIds: ids,
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('sintesa-weekly-target-updated', { detail: updated }));
    }
  } catch (e) {
    console.error('Error recording module completion:', e);
  }
};
