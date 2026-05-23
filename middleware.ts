import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url));
  }

  // Check frozen accounts
  if ((token as any).error === 'AccountFrozen') {
    const response = NextResponse.redirect(new URL('/auth/signin?error=AccountSuspended', req.url));
    response.cookies.delete('next-auth.session-token');
    return response;
  }

  const role = ((token.role as string) || 'user').toLowerCase();

  // Admin-only routes
  if (req.nextUrl.pathname.startsWith('/dashboard/admin')) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Author (and admin) routes
  if (req.nextUrl.pathname.startsWith('/dashboard/author')) {
    if (role !== 'author' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
