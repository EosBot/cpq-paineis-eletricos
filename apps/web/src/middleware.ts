import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - storefront browsing doesn't require auth
  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/' ||
    pathname === '/products' ||
    pathname.startsWith('/products/') ||
    pathname === '/cart';

  const isSuperAdminRoute = pathname.startsWith('/admin');
  const isProtectedRoute = pathname.startsWith('/configure') || pathname.startsWith('/admin');

  // Check for auth token in cookie (simplified check for middleware)
  const sessionToken =
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value;

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, we'll check super admin status in the page itself
  // since we can't access the database in middleware edge runtime

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)'],
};
