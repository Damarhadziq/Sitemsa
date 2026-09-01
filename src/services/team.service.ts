import { supabase } from '@/lib/supabase';

export interface TeamMember {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  division: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

export const FALLBACK_TEAM_MEMBERS: TeamMember[] = [
  // 1. Pend. Informatika (4 orang: 1 Developer, 3 Sub-Developer)
  { id: 'tm-1', image: '', title: 'Damar Hadziq H.', subtitle: 'Developer', handle: '@damarhadziq', borderColor: '#4F46E5', division: 'Pend. Informatika', email: 'damar.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/damarhadziq', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-2', image: '', title: 'Mochammad Rizal D. D.', subtitle: 'Sub-Developer', handle: '@rizaldaffa', borderColor: '#3B82F6', division: 'Pend. Informatika', email: 'rizal.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/rizaldaffa', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-3', image: '', title: 'M. Sulthon Abdullah A.', subtitle: 'Sub-Developer', handle: '@sulthonazzam', borderColor: '#2563EB', division: 'Pend. Informatika', email: 'sulthon.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/sulthonazzam', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-4', image: '', title: 'Lovyca Imeyra E.', subtitle: 'Sub-Developer', handle: '@lovycaimeyra', borderColor: '#10B981', division: 'Pend. Informatika', email: 'lovyca.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/lovycaimeyra', linkedinUrl: 'https://linkedin.com' },

  // 2. BK (4 orang - Instructional Designer)
  { id: 'tm-5', image: '', title: 'Innova Riskianugrah R.', subtitle: 'Instructional Designer', handle: '@innovariskia', borderColor: '#06B6D4', division: 'BK', email: 'innova.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/innovariskia', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-6', image: '', title: 'Fateka Maulana A. K.', subtitle: 'Instructional Designer', handle: '@fatekamaulana', borderColor: '#10B981', division: 'BK', email: 'fateka.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/fatekamaulana', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-7', image: '', title: 'Erintan Tsuraya R.', subtitle: 'Instructional Designer', handle: '@erintantsuraya', borderColor: '#06B6D4', division: 'BK', email: 'erintan.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/erintantsuraya', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-8', image: '', title: 'Dinda Riestia', subtitle: 'Instructional Designer', handle: '@dindariestia', borderColor: '#8B5CF6', division: 'BK', email: 'dinda.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/dindariestia', linkedinUrl: 'https://linkedin.com' },

  // 3. Pend. Otomotif (3 orang - Instructional Designer)
  { id: 'tm-9', image: '', title: 'Ardyan Santoso', subtitle: 'Instructional Designer', handle: '@ardyansantoso', borderColor: '#3B82F6', division: 'Pend. Otomotif', email: 'ardyan.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/ardyansantoso', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-10', image: '', title: 'Satrio', subtitle: 'Instructional Designer', handle: '@satrio', borderColor: '#4F46E5', division: 'Pend. Otomotif', email: 'satrio.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/satrio', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-11', image: '', title: 'Agam Ainun Ramadhan', subtitle: 'Instructional Designer', handle: '@agamainun', borderColor: '#8B5CF6', division: 'Pend. Otomotif', email: 'agam.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/agamainun', linkedinUrl: 'https://linkedin.com' },

  // 4. Pend. Elektronika (6 orang - Instructional Designer)
  { id: 'tm-12', image: '', title: 'Banu Mahmuda H.', subtitle: 'Instructional Designer', handle: '@banumahmuda', borderColor: '#EF4444', division: 'Pend. Elektronika', email: 'banu.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/banumahmuda', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-13', image: '', title: 'Anisa Susilawati', subtitle: 'Instructional Designer', handle: '@anisasusilawati', borderColor: '#8B5CF6', division: 'Pend. Elektronika', email: 'anisa.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/anisasusilawati', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-14', image: '', title: 'Nova Milyard', subtitle: 'Instructional Designer', handle: '@novamilyard', borderColor: '#EF4444', division: 'Pend. Elektronika', email: 'nova.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/novamilyard', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-15', image: '', title: 'Vella Pratika I. N.', subtitle: 'Instructional Designer', handle: '@vellapratika', borderColor: '#F59E0B', division: 'Pend. Elektronika', email: 'vella.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/vellapratika', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-16', image: '', title: 'Fahrul Adiyansa', subtitle: 'Instructional Designer', handle: '@fahruladiyansa', borderColor: '#8B5CF6', division: 'Pend. Elektronika', email: 'fahrul.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/fahruladiyansa', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-17', image: '', title: 'Tubagus Fauzan A.', subtitle: 'Instructional Designer', handle: '@tubagusfauzan', borderColor: '#06B6D4', division: 'Pend. Elektronika', email: 'tubagus.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/tubagusfauzan', linkedinUrl: 'https://linkedin.com' },

  // 5. Pend. Olahraga (3 orang - Instructional Designer)
  { id: 'tm-18', image: '', title: 'Brilian Anugraheni', subtitle: 'Instructional Designer', handle: '@briliananugraheni', borderColor: '#3B82F6', division: 'Pend. Olahraga', email: 'brilian.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/briliananugraheni', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-19', image: '', title: 'Ahmad Luthfi F.', subtitle: 'Instructional Designer', handle: '@ahmadluthfi', borderColor: '#F59E0B', division: 'Pend. Olahraga', email: 'luthfi.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/ahmadluthfi', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-20', image: '', title: 'Rinal Febriarso D. P.', subtitle: 'Instructional Designer', handle: '@rinalfebriarso', borderColor: '#06B6D4', division: 'Pend. Olahraga', email: 'rinal.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/rinalfebriarso', linkedinUrl: 'https://linkedin.com' },

  // 6. Pend. Seni Tari (4 orang - Instructional Designer)
  { id: 'tm-21', image: '', title: 'Vivi Riska Wardani', subtitle: 'Instructional Designer', handle: '@viviriska', borderColor: '#10B981', division: 'Pend. Seni Tari', email: 'vivi.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/viviriska', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-22', image: '', title: 'Anita Dwi Ningtyas', subtitle: 'Instructional Designer', handle: '@anitadwi', borderColor: '#EF4444', division: 'Pend. Seni Tari', email: 'anita.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/anitadwi', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-23', image: '', title: 'Meliana Dwi Yanti', subtitle: 'Instructional Designer', handle: '@melianadwi', borderColor: '#10B981', division: 'Pend. Seni Tari', email: 'meliana.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/melianadwi', linkedinUrl: 'https://linkedin.com' },
  { id: 'tm-24', image: '', title: 'Hasnita Ivangka', subtitle: 'Instructional Designer', handle: '@hasnitaivangka', borderColor: '#06B6D4', division: 'Pend. Seni Tari', email: 'hasnita.guru@sitemsa.sch.id', instagramUrl: 'https://instagram.com/hasnitaivangka', linkedinUrl: 'https://linkedin.com' }
];

export class TeamService {
  static async getTeamMembers(): Promise<TeamMember[]> {
    if (!supabase) return FALLBACK_TEAM_MEMBERS;

    try {
      // 1. Fetch team members
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('id', { ascending: true });

      // 2. Fetch user avatars from public.users to keep team photos synced with account avatars
      const { data: usersData } = await supabase
        .from('users')
        .select('name, email, avatar');

      const userAvatarMap = new Map<string, string>();
      if (usersData && Array.isArray(usersData)) {
        usersData.forEach((u: any) => {
          if (u.avatar) {
            if (u.name) userAvatarMap.set(u.name.toLowerCase().trim(), u.avatar);
            if (u.email) userAvatarMap.set(u.email.toLowerCase().trim(), u.avatar);
          }
        });
      }

      if (error) {
        console.warn('Supabase team_members fetch warning:', error.message);
        return FALLBACK_TEAM_MEMBERS;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => {
          const title = item.title || item.name || '';
          const email = item.email || '';
          const syncedAvatar =
            item.image ||
            userAvatarMap.get(title.toLowerCase().trim()) ||
            userAvatarMap.get(email.toLowerCase().trim()) ||
            '';

          return {
            id: String(item.id),
            image: syncedAvatar,
            title: title,
            subtitle: item.subtitle || item.role || 'Instructional Designer',
            handle: item.handle || '@sitemsa',
            borderColor: item.border_color || '#2563EB',
            division: item.division || 'Tim Pengembang',
            instagramUrl: item.instagram_url || (item.handle ? `https://instagram.com/${item.handle.replace('@', '')}` : 'https://instagram.com'),
            linkedinUrl: item.linkedin_url || 'https://linkedin.com',
            email: email,
          };
        });
      }
    } catch (e) {
      console.warn('Supabase team_members exception:', e);
    }

    return FALLBACK_TEAM_MEMBERS;
  }

  static async saveTeamMember(member: TeamMember): Promise<boolean> {
    if (!supabase || !member.id) return false;
    try {
      const payload: any = {
        id: member.id,
        title: member.title,
        subtitle: member.subtitle,
        handle: member.handle,
        division: member.division,
        border_color: member.borderColor,
        image: member.image || '',
        instagram_url: member.instagramUrl || '',
        linkedin_url: member.linkedinUrl || '',
      };

      const { error } = await supabase.from('team_members').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Save team member error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Save team member exception:', e);
      return false;
    }
  }

  static async deleteTeamMember(id: string): Promise<boolean> {
    if (!supabase || !id) return false;
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) {
        console.warn('Delete team member error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Delete team member exception:', e);
      return false;
    }
  }

  static async syncToSupabase(): Promise<void> {
    if (!supabase) return;
    try {
      const rows = FALLBACK_TEAM_MEMBERS.map((m) => ({
        id: m.id || `tm-${Date.now()}`,
        title: m.title,
        subtitle: m.subtitle,
        handle: m.handle,
        division: m.division,
        border_color: m.borderColor,
        image: m.image || '',
        instagram_url: m.instagramUrl || '',
        linkedin_url: m.linkedinUrl || '',
      }));

      await supabase.from('team_members').upsert(rows, { onConflict: 'id' });
    } catch (e) {
      console.warn('Sync team_members exception:', e);
    }
  }
}
