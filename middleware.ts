import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  const role = (token.role as string) || 'user';

  if (req.nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'ADMIN' && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/dashboard/author') && role !== 'AUTHOR' && role !== 'author' && role !== 'ADMIN' && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/dashboard/user') && role !== 'USER' && role !== 'user' && role !== 'ADMIN' && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
