import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import ProfileLayout from '@/components/Profile/ProfileLayout';
import ProgressTracker from '@/components/Profile/ProgressTracker';
import { User } from '@/types';

const prisma = new PrismaClient();

interface StatsPageProps {
  user: User;
}

export default function StatsPage({ user }: StatsPageProps) {
  return (
    <ProfileLayout user={user}>
      <ProgressTracker />
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

  return {
    props: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
    },
  };
};