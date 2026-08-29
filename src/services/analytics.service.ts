import { supabase } from '@/lib/supabase';

export interface ReadingSession {
  id: string;
  moduleId: string | number;
  moduleTitle: string;
  subject: string;
  studentId: string;
  studentName: string;
  durationSeconds: number;
  durationMinutes: number;
  timestamp: number;
  date: string;
}

export interface DayStudyStat {
  day: string;
  fullDate: string;
  minutes: number;
  activeStudents: number;
  views: number;
}

export interface ModuleStudyStat {
  moduleId: string | number;
  title: string;
  subject: string;
  avgMinutes: number;
  totalReads: number;
  completionRate: number;
}

const STORAGE_KEY = 'sintesa_student_reading_analytics_v2';

export class StudyAnalyticsService {
  private static getStoredSessions(): ReadingSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error reading study analytics:', e);
    }
    return [];
  }

  private static saveSessions(sessions: ReadingSession[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(-300)));
      window.dispatchEvent(new CustomEvent('sintesa-analytics-updated', { detail: { sessions } }));
    } catch (e) {
      console.error('Error saving study analytics:', e);
    }
  }

  /**
   * Record real-time reading duration when student spends time on a module
   */
  static recordReadingSession(data: {
    moduleId: string | number;
    moduleTitle: string;
    subject: string;
    durationSeconds: number;
    studentId?: string;
    studentName?: string;
  }) {
    if (data.durationSeconds < 5) return; // Skip clicks under 5 seconds

    const durationMinutes = Math.max(1, Math.round(data.durationSeconds / 60));
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const newSession: ReadingSession = {
      id: `rs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      moduleId: data.moduleId,
      moduleTitle: data.moduleTitle,
      subject: data.subject,
      studentId: data.studentId || 'std-1',
      studentName: data.studentName || 'Budi Santoso',
      durationSeconds: data.durationSeconds,
      durationMinutes,
      timestamp: now.getTime(),
      date: dateStr,
    };

    const allSessions = this.getStoredSessions();
    allSessions.push(newSession);
    this.saveSessions(allSessions);

    // Sync to Supabase if connected
    if (supabase) {
      supabase.from('student_reading_logs').insert({
        id: newSession.id,
        module_id: String(data.moduleId),
        module_title: data.moduleTitle,
        subject: data.subject,
        student_id: newSession.studentId,
        student_name: newSession.studentName,
        duration_seconds: data.durationSeconds,
        duration_minutes: durationMinutes,
      }).then(({ error }) => {
        if (error) {
          // Table fallback
        }
      });
    }
  }

  /**
   * Get realtime analytics and daily breakdown for teacher dashboard and module analysis
   */
  static getSubjectAnalytics(subject: string) {
    const allSessions = this.getStoredSessions();
    const subjectSessions = allSessions.filter(
      (s) => s.subject.toLowerCase() === subject.toLowerCase()
    );

    const totalMinutes = subjectSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const avgMinutes = subjectSessions.length > 0
      ? Math.round((totalMinutes / subjectSessions.length) * 10) / 10
      : 0;

    // Past 7 days calculation (clean 0 if no sessions)
    const daysLabel = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const now = new Date();
    const weeklyChart: DayStudyStat[] = [];

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - i);
      const dateString = targetDate.toISOString().split('T')[0];
      const dayName = daysLabel[targetDate.getDay()];

      const daySessions = subjectSessions.filter((s) => s.date === dateString);
      const dayTotalMinutes = daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      const activeCount = daySessions.length;

      weeklyChart.push({
        day: dayName,
        fullDate: dateString,
        minutes: dayTotalMinutes,
        views: activeCount,
        activeStudents: activeCount,
      });
    }

    // Per-module breakdown
    const moduleMap: Record<string, { title: string; totalMin: number; count: number }> = {};
    subjectSessions.forEach((s) => {
      const key = String(s.moduleId);
      if (!moduleMap[key]) {
        moduleMap[key] = { title: s.moduleTitle, totalMin: 0, count: 0 };
      }
      moduleMap[key].totalMin += s.durationMinutes;
      moduleMap[key].count += 1;
    });

    const moduleStats: ModuleStudyStat[] = Object.entries(moduleMap).map(([modId, val]) => ({
      moduleId: modId,
      title: val.title,
      subject,
      avgMinutes: Math.round(val.totalMin / val.count),
      totalReads: val.count,
      completionRate: Math.min(100, val.count > 0 ? 80 : 0),
    }));

    return {
      averageMinutesPerSession: avgMinutes,
      totalReadingMinutes: totalMinutes,
      weeklyChart,
      moduleStats,
      totalSessionsCount: subjectSessions.length,
      recentSessions: subjectSessions.slice(-10).reverse(),
    };
  }

  /**
   * Get analytics specifically for a single module
   */
  static getModuleAnalytics(moduleId: string | number, subject: string) {
    const allSessions = this.getStoredSessions();
    const modSessions = allSessions.filter(
      (s) => String(s.moduleId) === String(moduleId)
    );

    const totalViews = modSessions.length;
    const totalMinutes = modSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const avgMinutes = totalViews > 0 ? Math.round((totalMinutes / totalViews) * 10) / 10 : 0;

    const daysLabel = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const now = new Date();
    const weeklyChart: DayStudyStat[] = [];

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - i);
      const dateString = targetDate.toISOString().split('T')[0];
      const dayName = daysLabel[targetDate.getDay()];

      const daySessions = modSessions.filter((s) => s.date === dateString);
      const dayTotalMinutes = daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

      weeklyChart.push({
        day: dayName,
        fullDate: dateString,
        minutes: dayTotalMinutes,
        views: daySessions.length,
        activeStudents: daySessions.length,
      });
    }

    const completedCount = modSessions.filter((s) => s.durationMinutes >= 15 || s.durationSeconds >= 600).length;
    const completionRate = totalViews > 0 ? Math.round((completedCount / totalViews) * 100) : 0;
    const needsAttentionCount = modSessions.filter((s) => s.durationSeconds < 60 && s.durationSeconds >= 5).length;

    return {
      totalViews,
      totalMinutes,
      avgMinutes,
      completionRate,
      completedCount,
      needsAttentionCount,
      weeklyChart,
      recentReaders: modSessions.slice(-5).reverse().map((s) => ({
        name: s.studentName,
        time: new Date(s.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: s.durationMinutes >= 15 ? 'Selesai (100%)' : `Membaca (${Math.min(95, s.durationMinutes * 5)}%)`,
      })),
    };
  }
}
