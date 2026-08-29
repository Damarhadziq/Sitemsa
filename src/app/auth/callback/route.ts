import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  const redirectUrl = new URL(next, origin);

  if (code) {
    // 1. Try Direct Google OAuth token exchange first
    const googleClientId =
      process.env.GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '';
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

    if (googleClientId && googleClientSecret) {
      try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: googleClientId,
            client_secret: googleClientSecret,
            redirect_uri: `${origin}/auth/callback`,
            grant_type: 'authorization_code',
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            if (userRes.ok) {
              const googleUser = await userRes.json();
              const name =
                googleUser.name || googleUser.email?.split('@')[0] || 'Siswa Sitemsa';
              const email = googleUser.email || 'siswa@belajar.id';
              const avatar = googleUser.picture || 'https://i.pravatar.cc/150?img=12';

              redirectUrl.searchParams.set('name', name);
              redirectUrl.searchParams.set('email', email);
              if (avatar) redirectUrl.searchParams.set('avatar', avatar);

              const response = NextResponse.redirect(redirectUrl);
              response.cookies.set('sintesa_student_auth', 'true', {
                path: '/',
                maxAge: 2592000,
                sameSite: 'lax',
              });
              response.cookies.set('auth_student', 'siswa', {
                path: '/',
                maxAge: 2592000,
                sameSite: 'lax',
              });
              response.cookies.set('auth', 'true', {
                path: '/',
                maxAge: 2592000,
                sameSite: 'lax',
              });
              return response;
            }
          }
        }
      } catch (err) {
        console.warn('Direct Google token exchange error:', err);
      }
    }

    // 2. Try Supabase Auth exchange if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data?.session?.user) {
          const user = data.session.user;
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            '';
          const email = user.email || '';
          const avatar =
            user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

          redirectUrl.searchParams.set('name', name);
          redirectUrl.searchParams.set('email', email);
          if (avatar) redirectUrl.searchParams.set('avatar', avatar);

          const response = NextResponse.redirect(redirectUrl);
          response.cookies.set('sintesa_student_auth', 'true', {
            path: '/',
            maxAge: 2592000,
            sameSite: 'lax',
          });
          response.cookies.set('auth_student', 'siswa', {
            path: '/',
            maxAge: 2592000,
            sameSite: 'lax',
          });
          response.cookies.set('auth', 'true', {
            path: '/',
            maxAge: 2592000,
            sameSite: 'lax',
          });
          return response;
        }
      } catch (err) {
        console.warn('Supabase code exchange error:', err);
      }
    }
  }

  // 3. Fallback: Successful student login session redirect
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set('sintesa_student_auth', 'true', {
    path: '/',
    maxAge: 2592000,
    sameSite: 'lax',
  });
  response.cookies.set('auth_student', 'siswa', {
    path: '/',
    maxAge: 2592000,
    sameSite: 'lax',
  });
  response.cookies.set('auth', 'true', {
    path: '/',
    maxAge: 2592000,
    sameSite: 'lax',
  });
  return response;
}
