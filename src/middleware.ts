import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminCookie = request.cookies.get('auth_admin');
  const studentCookie = request.cookies.get('auth');

  // Handle Admin Routes (/admin/...)
  if (pathname.startsWith('/admin')) {
    // If accessing admin login page while already authenticated as admin
    if (pathname === '/admin/login') {
      if (adminCookie) {
        if (adminCookie.value === 'guru') {
          return NextResponse.redirect(new URL('/admin/guru', request.url));
        }
        return NextResponse.redirect(new URL('/admin/superadmin', request.url));
      }
      return NextResponse.next();
    }

    // Unauthenticated access to protected admin pages -> redirect to /admin/login
    if (!adminCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Handle Student Routes
  if (pathname === '/login' && studentCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
