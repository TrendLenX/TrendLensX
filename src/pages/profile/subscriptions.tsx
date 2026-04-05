import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileLayout from '@/components/Profile/ProfileLayout';
import UserSubscriptions from '@/components/Monetization/UserSubscriptions';
import SubscriptionPlans from '@/components/Monetization/SubscriptionPlans';
import { User } from '@/types';

interface SubscriptionsPageProps {
  user: User;
  hasActiveSubscription: boolean;
}

export default function SubscriptionsPage({ user, hasActiveSubscription }: SubscriptionsPageProps) {
  return (
    <ProfileLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">My Subscriptions</h1>
          <p className="text-muted-foreground">Manage your premium subscriptions and billing</p>
        </div>

        {hasActiveSubscription ? (
          <UserSubscriptions />
        ) : (
          <div className="space-y-8">
            <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Upgrade to Premium</h2>
              <p className="text-muted-foreground">
                Unlock exclusive content, advanced analytics, and premium features.
              </p>
            </div>
            <SubscriptionPlans />
          </div>
        )}
      </div>
    </ProfileLayout>
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

  if (!user) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Check if user has active subscription
  const activeSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId: user.id,
      status: 'active',
    },
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
      hasActiveSubscription: !!activeSubscription,
    },
  };
};