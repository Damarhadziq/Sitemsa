import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/lengkapi-profil';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.session?.user) {
        const user = data.session.user;
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
        const email = user.email || '';
        const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

        const redirectUrl = new URL(next, origin);
        redirectUrl.searchParams.set('name', name);
        redirectUrl.searchParams.set('email', email);
        if (avatar) redirectUrl.searchParams.set('avatar', avatar);

        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}${next}`);
}
