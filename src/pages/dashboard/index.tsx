import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () =>
          Object.entries(ctx.req.cookies).map(([name, value]) => ({
            name,
            value: value ?? "", // ensure always a string
          })),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => {
            ctx.res.setHeader(
              "Set-Cookie",
              `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`
            );
          });
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  
  if (user.role === 'USER') {
    return { redirect: { destination: '/dashboard/user', permanent: false } };
  }
  if (user.role === 'AUTHOR') {
    return { redirect: { destination: '/dashboard/author', permanent: false } };
  }
  if (user.role === 'ADMIN') {
    return { redirect: { destination: '/dashboard/admin', permanent: false } };
  }
  
  return { redirect: { destination: '/auth/signin', permanent: false } };
};

export default function DashboardRouter() {
  return null;
}