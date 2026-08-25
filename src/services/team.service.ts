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
  { image: 'https://i.pravatar.cc/300?img=11', title: 'Damar Hadziq H.', subtitle: 'Developer', handle: '@damarhadziq', borderColor: '#4F46E5', division: 'Pend. Informatika' },
  { image: 'https://i.pravatar.cc/300?img=13', title: 'Mochammad Rizal D. D.', subtitle: 'Sub-Developer', handle: '@rizaldaffa', borderColor: '#3B82F6', division: 'Pend. Informatika' },
  { image: 'https://i.pravatar.cc/300?img=19', title: 'M. Sulthon Abdullah A.', subtitle: 'Sub-Developer', handle: '@sulthonazzam', borderColor: '#2563EB', division: 'Pend. Informatika' },
  { image: 'https://i.pravatar.cc/300?img=25', title: 'Lovyca Imeyra E.', subtitle: 'Sub-Developer', handle: '@lovycaimeyra', borderColor: '#10B981', division: 'Pend. Informatika' },

  // 2. BK (4 orang - Instructional Designer)
  { image: 'https://i.pravatar.cc/300?img=16', title: 'Innova Riskianugrah R.', subtitle: 'Instructional Designer', handle: '@innovariskia', borderColor: '#06B6D4', division: 'BK' },
  { image: 'https://i.pravatar.cc/300?img=18', title: 'Fateka Maulana A. K.', subtitle: 'Instructional Designer', handle: '@fatekamaulana', borderColor: '#10B981', division: 'BK' },
  { image: 'https://i.pravatar.cc/300?img=22', title: 'Erintan Tsuraya R.', subtitle: 'Instructional Designer', handle: '@erintantsuraya', borderColor: '#06B6D4', division: 'BK' },
  { image: 'https://i.pravatar.cc/300?img=30', title: 'Dinda Riestia', subtitle: 'Instructional Designer', handle: '@dindariestia', borderColor: '#8B5CF6', division: 'BK' },

  // 3. Pend. Otomotif (3 orang - Instructional Designer)
  { image: 'https://i.pravatar.cc/300?img=17', title: 'Ardyan Santoso', subtitle: 'Instructional Designer', handle: '@ardyansantoso', borderColor: '#3B82F6', division: 'Pend. Otomotif' },
  { image: 'https://i.pravatar.cc/300?img=23', title: 'Satrio', subtitle: 'Instructional Designer', handle: '@satrio', borderColor: '#4F46E5', division: 'Pend. Otomotif' },
  { image: 'https://i.pravatar.cc/300?img=27', title: 'Agam Ainun Ramadhan', subtitle: 'Instructional Designer', handle: '@agamainun', borderColor: '#8B5CF6', division: 'Pend. Otomotif' },

  // 4. Pend. Elektronika (6 orang - Instructional Designer)
  { image: 'https://i.pravatar.cc/300?img=14', title: 'Banu Mahmuda H.', subtitle: 'Instructional Designer', handle: '@banumahmuda', borderColor: '#EF4444', division: 'Pend. Elektronika' },
  { image: 'https://i.pravatar.cc/300?img=21', title: 'Anisa Susilawati', subtitle: 'Instructional Designer', handle: '@anisasusilawati', borderColor: '#8B5CF6', division: 'Pend. Elektronika' },
  { image: 'https://i.pravatar.cc/300?img=26', title: 'Nova Milyard', subtitle: 'Instructional Designer', handle: '@novamilyard', borderColor: '#EF4444', division: 'Pend. Elektronika' },
  { image: 'https://i.pravatar.cc/300?img=32', title: 'Vella Pratika I. N.', subtitle: 'Instructional Designer', handle: '@vellapratika', borderColor: '#F59E0B', division: 'Pend. Elektronika' },
  { image: 'https://i.pravatar.cc/300?img=33', title: 'Fahrul Adiyansa', subtitle: 'Instructional Designer', handle: '@fahruladiyansa', borderColor: '#8B5CF6', division: 'Pend. Elektronika' },
  { image: 'https://i.pravatar.cc/300?img=15', title: 'Tubagus Fauzan A.', subtitle: 'Instructional Designer', handle: '@tubagusfauzan', borderColor: '#06B6D4', division: 'Pend. Elektronika' },

  // 5. Pend. Olahraga (3 orang - Instructional Designer)
  { image: 'https://i.pravatar.cc/300?img=29', title: 'Brilian Anugraheni', subtitle: 'Instructional Designer', handle: '@briliananugraheni', borderColor: '#3B82F6', division: 'Pend. Olahraga' },
  { image: 'https://i.pravatar.cc/300?img=31', title: 'Ahmad Luthfi F.', subtitle: 'Instructional Designer', handle: '@ahmadluthfi', borderColor: '#F59E0B', division: 'Pend. Olahraga' },
  { image: 'https://i.pravatar.cc/300?img=34', title: 'Rinal Febriarso D. P.', subtitle: 'Instructional Designer', handle: '@rinalfebriarso', borderColor: '#06B6D4', division: 'Pend. Olahraga' },

  // 6. Pend. Seni Tari (4 orang - Instructional Designer)
  { image: 'https://i.pravatar.cc/300?img=12', title: 'Vivi Riska Wardani', subtitle: 'Instructional Designer', handle: '@viviriska', borderColor: '#10B981', division: 'Pend. Seni Tari' },
  { image: 'https://i.pravatar.cc/300?img=20', title: 'Anita Dwi Ningtyas', subtitle: 'Instructional Designer', handle: '@anitadwi', borderColor: '#EF4444', division: 'Pend. Seni Tari' },
  { image: '/images/meliana.jpg', title: 'Meliana Dwi Yanti', subtitle: 'Instructional Designer', handle: '@melianadwi', borderColor: '#10B981', division: 'Pend. Seni Tari' },
  { image: 'https://i.pravatar.cc/300?img=28', title: 'Hasnita Ivangka', subtitle: 'Instructional Designer', handle: '@hasnitaivangka', borderColor: '#06B6D4', division: 'Pend. Seni Tari' }
];

export class TeamService {
  static async getTeamMembers(): Promise<TeamMember[]> {
    if (!supabase) return FALLBACK_TEAM_MEMBERS;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase team_members fetch warning:', error.message);
        return FALLBACK_TEAM_MEMBERS;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          image: item.image || 'https://i.pravatar.cc/300',
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
}
