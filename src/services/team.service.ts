import { supabase } from '@/lib/supabase';

export interface TeamMember {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  division: string;
}

export const FALLBACK_TEAM_MEMBERS: TeamMember[] = [
  // 1. Pend. Informatika (4 orang: 1 Developer, 3 Sub-Developer)
  { id: 'tm-1', image: '', title: 'Damar Hadziq H.', subtitle: 'Developer', handle: '@damarhadziq', borderColor: '#4F46E5', division: 'Pend. Informatika' },
  { id: 'tm-2', image: '', title: 'Mochammad Rizal D. D.', subtitle: 'Sub-Developer', handle: '@rizaldaffa', borderColor: '#3B82F6', division: 'Pend. Informatika' },
  { id: 'tm-3', image: '', title: 'M. Sulthon Abdullah A.', subtitle: 'Sub-Developer', handle: '@sulthonazzam', borderColor: '#2563EB', division: 'Pend. Informatika' },
  { id: 'tm-4', image: '', title: 'Lovyca Imeyra E.', subtitle: 'Sub-Developer', handle: '@lovycaimeyra', borderColor: '#10B981', division: 'Pend. Informatika' },

  // 2. BK (4 orang - Instructional Designer)
  { id: 'tm-5', image: '', title: 'Innova Riskianugrah R.', subtitle: 'Instructional Designer', handle: '@innovariskia', borderColor: '#06B6D4', division: 'BK' },
  { id: 'tm-6', image: '', title: 'Fateka Maulana A. K.', subtitle: 'Instructional Designer', handle: '@fatekamaulana', borderColor: '#10B981', division: 'BK' },
  { id: 'tm-7', image: '', title: 'Erintan Tsuraya R.', subtitle: 'Instructional Designer', handle: '@erintantsuraya', borderColor: '#06B6D4', division: 'BK' },
  { id: 'tm-8', image: '', title: 'Dinda Riestia', subtitle: 'Instructional Designer', handle: '@dindariestia', borderColor: '#8B5CF6', division: 'BK' },

  // 3. Pend. Otomotif (3 orang - Instructional Designer)
  { id: 'tm-9', image: '', title: 'Ardyan Santoso', subtitle: 'Instructional Designer', handle: '@ardyansantoso', borderColor: '#3B82F6', division: 'Pend. Otomotif' },
  { id: 'tm-10', image: '', title: 'Satrio', subtitle: 'Instructional Designer', handle: '@satrio', borderColor: '#4F46E5', division: 'Pend. Otomotif' },
  { id: 'tm-11', image: '', title: 'Agam Ainun Ramadhan', subtitle: 'Instructional Designer', handle: '@agamainun', borderColor: '#8B5CF6', division: 'Pend. Otomotif' },

  // 4. Pend. Elektronika (6 orang - Instructional Designer)
  { id: 'tm-12', image: '', title: 'Banu Mahmuda H.', subtitle: 'Instructional Designer', handle: '@banumahmuda', borderColor: '#EF4444', division: 'Pend. Elektronika' },
  { id: 'tm-13', image: '', title: 'Anisa Susilawati', subtitle: 'Instructional Designer', handle: '@anisasusilawati', borderColor: '#8B5CF6', division: 'Pend. Elektronika' },
  { id: 'tm-14', image: '', title: 'Nova Milyard', subtitle: 'Instructional Designer', handle: '@novamilyard', borderColor: '#EF4444', division: 'Pend. Elektronika' },
  { id: 'tm-15', image: '', title: 'Vella Pratika I. N.', subtitle: 'Instructional Designer', handle: '@vellapratika', borderColor: '#F59E0B', division: 'Pend. Elektronika' },
  { id: 'tm-16', image: '', title: 'Fahrul Adiyansa', subtitle: 'Instructional Designer', handle: '@fahruladiyansa', borderColor: '#8B5CF6', division: 'Pend. Elektronika' },
  { id: 'tm-17', image: '', title: 'Tubagus Fauzan A.', subtitle: 'Instructional Designer', handle: '@tubagusfauzan', borderColor: '#06B6D4', division: 'Pend. Elektronika' },

  // 5. Pend. Olahraga (3 orang - Instructional Designer)
  { id: 'tm-18', image: '', title: 'Brilian Anugraheni', subtitle: 'Instructional Designer', handle: '@briliananugraheni', borderColor: '#3B82F6', division: 'Pend. Olahraga' },
  { id: 'tm-19', image: '', title: 'Ahmad Luthfi F.', subtitle: 'Instructional Designer', handle: '@ahmadluthfi', borderColor: '#F59E0B', division: 'Pend. Olahraga' },
  { id: 'tm-20', image: '', title: 'Rinal Febriarso D. P.', subtitle: 'Instructional Designer', handle: '@rinalfebriarso', borderColor: '#06B6D4', division: 'Pend. Olahraga' },

  // 6. Pend. Seni Tari (4 orang - Instructional Designer)
  { id: 'tm-21', image: '', title: 'Vivi Riska Wardani', subtitle: 'Instructional Designer', handle: '@viviriska', borderColor: '#10B981', division: 'Pend. Seni Tari' },
  { id: 'tm-22', image: '', title: 'Anita Dwi Ningtyas', subtitle: 'Instructional Designer', handle: '@anitadwi', borderColor: '#EF4444', division: 'Pend. Seni Tari' },
  { id: 'tm-23', image: '', title: 'Meliana Dwi Yanti', subtitle: 'Instructional Designer', handle: '@melianadwi', borderColor: '#10B981', division: 'Pend. Seni Tari' },
  { id: 'tm-24', image: '', title: 'Hasnita Ivangka', subtitle: 'Instructional Designer', handle: '@hasnitaivangka', borderColor: '#06B6D4', division: 'Pend. Seni Tari' }
];

export class TeamService {
  static async getTeamMembers(): Promise<TeamMember[]> {
    if (!supabase) return FALLBACK_TEAM_MEMBERS;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn('Supabase team_members fetch warning:', error.message);
        return FALLBACK_TEAM_MEMBERS;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          image: item.image || '',
          title: item.title || item.name,
          subtitle: item.subtitle || item.role,
          handle: item.handle || '@sitemsa',
          borderColor: item.border_color || '#2563EB',
          division: item.division || 'Tim Pengembang',
        }));
      }
    } catch (e) {
      console.warn('Supabase team_members exception:', e);
    }

    return FALLBACK_TEAM_MEMBERS;
  }

  static async syncToSupabase(): Promise<void> {
    if (!supabase) return;
    try {
      const rows = FALLBACK_TEAM_MEMBERS.map((m) => ({
        id: m.id || `tm-${Date.now()}`,
        name: m.title,
        role: m.subtitle,
        handle: m.handle,
        division: m.division,
        border_color: m.borderColor,
        image: m.image || null,
      }));

      await supabase.from('team_members').upsert(rows, { onConflict: 'id' });
    } catch (e) {
      console.warn('Sync team_members exception:', e);
    }
  }
}
