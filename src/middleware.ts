import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminCookie = request.cookies.get('auth_admin');
  const studentCookie = request.cookies.get('sintesa_student_auth') || request.cookies.get('auth');

  // Ignore static assets, favicon, images, documents, and internal Next.js requests
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/documents') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Handle Admin Routes (/admin/...)
  if (pathname.startsWith('/admin')) {
    const isValidAdmin = adminCookie && (adminCookie.value === 'superadmin' || adminCookie.value === 'guru');

    // If accessing root admin path (/admin)
    if (pathname === '/admin') {
      if (isValidAdmin) {
        if (adminCookie.value === 'guru') {
          return NextResponse.redirect(new URL('/admin/guru', request.url));
        }
        return NextResponse.redirect(new URL('/admin/superadmin', request.url));
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If accessing admin login page (/admin/login)
    if (pathname === '/admin/login') {
      if (isValidAdmin) {
        if (adminCookie.value === 'guru') {
          return NextResponse.redirect(new URL('/admin/guru', request.url));
        }
        return NextResponse.redirect(new URL('/admin/superadmin', request.url));
      }
      return NextResponse.next();
    }

    // Unauthenticated access to protected admin pages -> redirect to /admin/login
    if (!isValidAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Teacher attempting to access superadmin routes -> redirect to /admin/guru
    if (pathname.startsWith('/admin/superadmin') && adminCookie.value === 'guru') {
      return NextResponse.redirect(new URL('/admin/guru', request.url));
    }

    return NextResponse.next();
  }

  // 2. Handle Public Auth Pages (/login, /signup, /lupa-password, /verifikasi-otp, /lengkapi-profil)
  const isAuthPage = 
    pathname === '/login' || 
    pathname === '/signup' || 
    pathname === '/register' ||
    pathname === '/lupa-password' || 
    pathname === '/verifikasi-otp' || 
    pathname === '/lengkapi-profil';

  if (isAuthPage) {
    if (studentCookie && (pathname === '/login' || pathname === '/signup' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (adminCookie && (adminCookie.value === 'superadmin' || adminCookie.value === 'guru') && pathname === '/login') {
      if (adminCookie.value === 'superadmin') {
        return NextResponse.redirect(new URL('/admin/superadmin', request.url));
      }
      return NextResponse.redirect(new URL('/admin/guru', request.url));
    }
    return NextResponse.next();
  }

  // 3. Mandatory Student Auth Gate:
  // All other public web routes (/, /materi, /tips-belajar, /dokumentasi, /team, /profil, /notifikasi, /kuis)
  // require active login. If not logged in, redirect straight to /login!
  const hasValidSession = !!studentCookie || (adminCookie && (adminCookie.value === 'superadmin' || adminCookie.value === 'guru'));

  if (!hasValidSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg, robots.txt, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|images|documents).*)',
  ],
};
