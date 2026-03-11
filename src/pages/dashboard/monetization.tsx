import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import SubscriptionPlans from '@/components/Monetization/SubscriptionPlans';
import { User } from '@/types';

const prisma = new PrismaClient();

interface MonetizationPageProps {
  user: User;
  stats: {
    totalRevenue: number;
    activeSubscriptions: number;
    totalSubscribers: number;
    monthlyRevenue: number;
  };
}

export default function MonetizationPage({ user, stats }: MonetizationPageProps) {
  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Monetization Dashboard</h1>
          <p className="text-muted-foreground">Manage subscriptions, payments, and revenue</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${stats.totalRevenue}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Active Subscriptions</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.activeSubscriptions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Subscribers</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalSubscribers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
            <p className="text-3xl font-bold text-orange-600">${stats.monthlyRevenue}</p>
          </div>
        </div>

        {/* Subscription Plans Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
          <SubscriptionPlans />
        </div>

        {/* Monetization Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monetization Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
              <h3 className="font-semibold">Payment Settings</h3>
              <p className="text-sm text-gray-600">Configure Stripe, PayPal, etc.</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors">
              <h3 className="font-semibold">Premium Content</h3>
              <p className="text-sm text-gray-600">Mark articles as premium</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors">
              <h3 className="font-semibold">Revenue Reports</h3>
              <p className="text-sm text-gray-600">View detailed analytics</p>
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

  // Get monetization stats
  const totalRevenue = await prisma.payment.aggregate({
    where: { status: 'completed' },
    _sum: { amount: true },
  });

  const activeSubscriptions = await prisma.userSubscription.count({
    where: { status: 'active' },
  });

  const totalSubscribers = await prisma.userSubscription.count();

  // Monthly revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const monthlyRevenue = await prisma.payment.aggregate({
    where: {
      status: 'completed',
      createdAt: { gte: thirtyDaysAgo },
    },
    _sum: { amount: true },
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
        totalRevenue: totalRevenue._sum.amount || 0,
        activeSubscriptions,
        totalSubscribers,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
      },
    },
  };
};