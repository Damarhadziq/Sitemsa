import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the auth cookie
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  const isPublicPath = pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico';

  // If the user is on the login page and has an auth cookie, redirect to home
  if (pathname === '/login' && authCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If it's not a public path and the user is not authenticated, redirect to login
  if (!isPublicPath && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Ensure the middleware is only applied to relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
