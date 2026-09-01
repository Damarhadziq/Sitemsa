import { supabase } from '@/lib/supabase';
import { useAdminStore, StudentRecord } from '@/lib/admin-store';
import { getRegisteredStudents, isDummyStudent } from './student-profile.service';
import { ProgressService } from './progress.service';

export interface QuizAttemptRow {
  id: string;
  student_id: string;
  quiz_id: string;
  quiz_title: string;
  subject: string;
  score: number;
  max_score?: number;
  status: 'Lulus' | 'Perlu Bimbingan';
  created_at?: string;
}

export class StudentMonitoringService {
  private static cachedStudents: StudentRecord[] = [];

  /**
   * Fetch all registered students and their quiz attempts / progress from Supabase and local storage
   */
  static async fetchMonitoringData(): Promise<StudentRecord[]> {
    const allSubjects = [
      'Informatika',
      'Elektronika',
      'Otomotif',
      'Bimbingan Konseling',
      'Seni Tari',
      'Keolahragaan',
    ];

    // 1. Get base registered students from local storage
    const localRegistered = getRegisteredStudents();
    const studentMap = new Map<string, StudentRecord>();

    // Add local registered students with clean 0/empty progress initial state
    localRegistered.forEach((s) => {
      const cleanEmail = s.email.toLowerCase().trim();
      studentMap.set(cleanEmail, {
        id: s.id || `usr-std-${cleanEmail}`,
        nisn: s.nisn || '-',
        name: s.name || cleanEmail.split('@')[0],
        email: s.email,
        classGroup: s.grade || 'X PPLG 1',
        avatar: s.avatar || `https://i.pravatar.cc/150?u=${cleanEmail}`,
        lastActive: 'Aktif',
        enrolledSubjects: allSubjects,
        moduleProgress: {},
        quizHistory: [],
      });
    });

    // 2. Fetch registered students from Supabase (public.users where role = 'siswa')
    if (supabase) {
      try {
        const { data: cloudUsers, error: usersErr } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'siswa');

        if (!usersErr && cloudUsers && Array.isArray(cloudUsers)) {
          cloudUsers.forEach((u: any) => {
            const cleanEmail = (u.email || '').toLowerCase().trim();
            if (!cleanEmail) return;

            const existing = studentMap.get(cleanEmail);
            if (existing) {
              existing.name = u.name || existing.name;
              existing.avatar = u.avatar || existing.avatar;
              existing.nisn = u.nip || existing.nisn;
            } else {
              studentMap.set(cleanEmail, {
                id: u.id || `usr-std-${cleanEmail}`,
                nisn: u.nip || '-',
                name: u.name || cleanEmail.split('@')[0],
                email: u.email,
                classGroup: 'X PPLG 1',
                avatar: u.avatar || `https://i.pravatar.cc/150?u=${cleanEmail}`,
                lastActive: 'Baru saja',
                enrolledSubjects: allSubjects,
                moduleProgress: {},
                quizHistory: [],
              });
            }
          });
        }
      } catch (err) {
        console.warn('StudentMonitoringService: Supabase users fetch notice:', err);
      }
    }

    // 3. Merge local quiz progress from ProgressService
    try {
      const localProgressStudents = ProgressService.getAllStudents();
      localProgressStudents.forEach((lp) => {
        const cleanEmail = (lp.email || '').toLowerCase().trim();
        const target = studentMap.get(cleanEmail) || Array.from(studentMap.values()).find((s) => s.id === lp.id);
        if (target) {
          target.moduleProgress = { ...target.moduleProgress, ...lp.moduleProgress };
          if (lp.accessedModules && lp.accessedModules.length > 0) {
            target.accessedModules = lp.accessedModules;
          }
          if (lp.quizHistory && lp.quizHistory.length > 0) {
            const existingQIds = new Set(target.quizHistory.map((q) => q.id));
            lp.quizHistory.forEach((qh) => {
              if (!existingQIds.has(qh.id)) {
                target.quizHistory.push({
                  id: qh.id,
                  quizId: qh.quizId,
                  teacherId: qh.teacherId,
                  teacherName: qh.teacherName,
                  subject: qh.subject,
                  quizTitle: qh.quizTitle,
                  score: qh.score,
                  maxScore: qh.maxScore || 100,
                  date: qh.date || new Date().toISOString().split('T')[0],
                  status: qh.status as 'Lulus' | 'Perlu Bimbingan',
                });
                existingQIds.add(qh.id);
              }
            });
          }
        }
      });
    } catch {}

    // 4. Fetch live quiz attempts from Supabase (quiz_attempts)
    if (supabase) {
      try {
        const { data: cloudAttempts, error: attemptsErr } = await supabase
          .from('quiz_attempts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!attemptsErr && cloudAttempts && Array.isArray(cloudAttempts)) {
          cloudAttempts.forEach((att: any) => {
            const studentId = att.student_id;
            const target =
              Array.from(studentMap.values()).find(
                (s) => s.id === studentId || s.email.toLowerCase() === String(studentId).toLowerCase()
              );

            if (target) {
              const attemptId = att.id || `att-${target.id}-${att.quiz_id}`;
              const exists = target.quizHistory.some((q) => q.id === attemptId);
              if (!exists) {
                target.quizHistory.unshift({
                  id: attemptId,
                  subject: att.subject || 'Informatika',
                  quizTitle: att.quiz_title || 'Uji Pemahaman',
                  score: att.score ?? 80,
                  maxScore: att.max_score || 100,
                  date: att.created_at ? att.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                  status: (att.status as 'Lulus' | 'Perlu Bimbingan') || (att.score >= 75 ? 'Lulus' : 'Perlu Bimbingan'),
                });
              }

              target.lastActive = 'Baru saja';
            }
          });
        }
      } catch (err) {
        console.warn('StudentMonitoringService: Supabase quiz_attempts fetch notice:', err);
      }
    }

    const finalStudents = Array.from(studentMap.values()).filter((s) => !isDummyStudent(s));
    this.cachedStudents = finalStudents;

    // Update global store
    if (typeof window !== 'undefined') {
      useAdminStore.getState().setStudents(finalStudents);
    }

    return finalStudents;
  }

  /**
   * Subscribe to realtime database updates (Supabase Postgres Changes & Local Window Events)
   */
  static subscribeToRealtime(onUpdate?: (students: StudentRecord[]) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handleLocalEvent = () => {
      this.fetchMonitoringData().then((updated) => {
        if (onUpdate) onUpdate(updated);
      });
    };

    window.addEventListener('sintesa-student-quiz-recorded', handleLocalEvent);
    window.addEventListener('sintesa-student-progress-updated', handleLocalEvent);
    window.addEventListener('sintesa-student-profile-updated', handleLocalEvent);
    window.addEventListener('storage', handleLocalEvent);

    let supabaseChannel: any = null;
    if (supabase) {
      try {
        supabaseChannel = supabase
          .channel('realtime_student_monitoring_channel')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'quiz_attempts' },
            () => {
              handleLocalEvent();
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'users' },
            () => {
              handleLocalEvent();
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'student_module_completions' },
            () => {
              handleLocalEvent();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('StudentMonitoringService: Supabase realtime subscription notice:', err);
      }
    }

    return () => {
      window.removeEventListener('sintesa-student-quiz-recorded', handleLocalEvent);
      window.removeEventListener('sintesa-student-progress-updated', handleLocalEvent);
      window.removeEventListener('sintesa-student-profile-updated', handleLocalEvent);
      window.removeEventListener('storage', handleLocalEvent);

      if (supabase && supabaseChannel) {
        try {
          supabase.removeChannel(supabaseChannel);
        } catch {}
      }
    };
  }
}
