import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session?.user) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }

  const role = (session.user as any).role || 'user';

  if (role === 'user' || role === 'USER') {
    return { redirect: { destination: '/dashboard/user', permanent: false } };
  }
  if (role === 'author' || role === 'AUTHOR') {
    return { redirect: { destination: '/dashboard/author', permanent: false } };
  }
  if (role === 'admin' || role === 'ADMIN') {
    return { redirect: { destination: '/dashboard/admin', permanent: false } };
  }

  return { redirect: { destination: '/auth/signin', permanent: false } };
};

export default function DashboardRouter() {
  return null;
}
