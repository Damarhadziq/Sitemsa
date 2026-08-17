import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminCookie = request.cookies.get('auth_admin');
  const studentCookie = request.cookies.get('auth');

  // Log incoming access requests (Dev Tunnels / Remote Visitors)
  // Ignore static assets & internal Next.js requests
  if (
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api') &&
    !pathname.includes('.')
  ) {
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Localhost';
    const clientIp = rawIp.split(',')[0].trim();
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
    const deviceType = isMobile ? '📱 Smartphone/Mobile' : '💻 PC/Laptop';
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour12: false });

    console.log(`🌐 [AKSES MASUK WEB] ${timestamp} | Halaman: ${pathname} | Device: ${deviceType} | IP: ${clientIp}`);
  }

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
