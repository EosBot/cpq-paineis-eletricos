import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const SECRET = process.env.NEXTAUTH_SECRET ?? '';

interface TokenUser {
  isSuperAdmin?: boolean;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/' ||
    pathname === '/products' ||
    pathname.startsWith('/products/') ||
    pathname === '/cart' ||
    pathname === '/configure' ||
    pathname.startsWith('/configure/') ||
    pathname.startsWith('/api/v1/');

  const isAdminRoute = pathname.startsWith('/admin');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: SECRET }) as { user?: TokenUser } | null;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute && token.user?.isSuperAdmin !== true) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)'],
};
