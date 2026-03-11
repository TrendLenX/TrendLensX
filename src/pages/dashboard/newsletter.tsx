import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { User } from '@/types';

const prisma = new PrismaClient();

interface NewsletterPageProps {
  user: User;
  stats: {
    totalSubscribers: number;
    activeSubscribers: number;
    recentSubscriptions: number;
  };
}

export default function NewsletterPage({ user, stats }: NewsletterPageProps) {
  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Management</h1>
          <p className="text-muted-foreground">Manage newsletter subscriptions and campaigns</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Subscribers</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalSubscribers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Active Subscribers</h3>
            <p className="text-3xl font-bold text-green-600">{stats.activeSubscribers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">This Month</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.recentSubscriptions}</p>
          </div>
        </div>

        {/* Newsletter Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Newsletter Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
              <h3 className="font-semibold">Create Newsletter</h3>
              <p className="text-sm text-gray-600">Compose and send a new newsletter</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors">
              <h3 className="font-semibold">Manage Templates</h3>
              <p className="text-sm text-gray-600">Create and edit newsletter templates</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'admin') {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    };
  }

  // Get newsletter stats
  const totalSubscribers = await prisma.newsletterSub.count();
  const activeSubscribers = await prisma.newsletterSub.count({
    where: { active: true },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSubscriptions = await prisma.newsletterSub.count({
    where: { createdAt: { gte: thirtyDaysAgo } },
  });

  return {
    props: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
      stats: {
        totalSubscribers,
        activeSubscribers,
        recentSubscriptions,
      },
    },
  };
};