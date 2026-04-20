import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => {
            res.cookies.set(name, value);
          });
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  
  if (req.nextUrl.pathname.startsWith('/dashboard/admin') && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  if (req.nextUrl.pathname.startsWith('/dashboard/author') && user.role !== 'AUTHOR' && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  if (req.nextUrl.pathname.startsWith('/dashboard/user') && user.role !== 'USER' && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};