import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/credentials';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname === '/login';
  const isSuperAdminRoute = pathname.startsWith('/admin');

  if (isPublicRoute) {
    if (session) {
      return NextResponse.redirect(new URL('/configure', request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isSuperAdminRoute && !session?.user?.isSuperAdmin) {
    return NextResponse.redirect(new URL('/configure', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)'],
};
