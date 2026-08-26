'use client';

import { getStudentProfile } from '@/services/student-profile.service';

export interface WeeklyTargetState {
  targetCount: number;
  completedCount: number;
  completedModuleIds: string[];
  lastUpdated: string;
}

const DEFAULT_TARGET = 5;

const getWeeklyStorageKey = (): string => {
  if (typeof window === 'undefined') return 'sintesa_weekly_target_v1';
  try {
    const profile = getStudentProfile();
    if (profile?.email) {
      const safeSuffix = profile.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `sintesa_weekly_target_v1_${safeSuffix}`;
    }
  } catch {
    // fallback
  }
  return 'sintesa_weekly_target_v1';
};

// Clean production initial state (0 completed until student actually finishes materials)
const INITIAL_STATE: WeeklyTargetState = {
  targetCount: DEFAULT_TARGET,
  completedCount: 0,
  completedModuleIds: [],
  lastUpdated: new Date().toISOString().split('T')[0],
};

/**
 * Get current weekly target progress for active logged in student
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
    const key = getWeeklyStorageKey();
    const raw = localStorage.getItem(key);
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
      completed: 0,
      target: 5,
      percentage: 0,
      isCompleted: false,
      message: 'Mulai langkah belajarmu minggu ini dengan 1 materi baru!',
    };
  }
};

/**
 * Check if a specific module has been marked complete by the current student
 */
export const isModuleCompletedByStudent = (moduleId: string | number): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const key = getWeeklyStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const data: WeeklyTargetState = JSON.parse(raw);
    return Array.isArray(data.completedModuleIds) && data.completedModuleIds.includes(String(moduleId));
  } catch {
    return false;
  }
};

/**
 * Record a completed module to dynamically increase weekly progress for active student
 */
export const recordModuleCompletion = (moduleId: string): void => {
  if (typeof window === 'undefined') return;

  try {
    const key = getWeeklyStorageKey();
    const raw = localStorage.getItem(key);
    const data: WeeklyTargetState = raw ? JSON.parse(raw) : INITIAL_STATE;

    const ids = Array.isArray(data.completedModuleIds) ? data.completedModuleIds : [];

    if (!ids.includes(String(moduleId))) {
      ids.push(String(moduleId));
      const updated: WeeklyTargetState = {
        ...data,
        completedCount: ids.length,
        completedModuleIds: ids,
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('sintesa-weekly-target-updated', { detail: updated }));
    }
  } catch (e) {
    console.error('Error recording module completion:', e);
  }
};
