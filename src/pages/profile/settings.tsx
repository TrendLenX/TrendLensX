import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import ProfileLayout from '@/components/Profile/ProfileLayout';
import ProfileSettings from '@/components/Profile/ProfileSettings';
import { User } from '@/types';

interface SettingsProps {
  user: User;
  settings: {
    emailNotifications: boolean;
    weeklyDigest: boolean;
    newFollowerAlerts: boolean;
    commentReplies: boolean;
    readingReminders: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

export default function Settings({ user, settings }: SettingsProps) {
  return (
    <ProfileLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings.</p>
        </div>

        <ProfileSettings user={user} initialSettings={settings} />
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

  // Mock data for demo purposes
  const mockUser = {
    id: 'demo-user',
    email: session.user.email,
    name: session.user.name || 'Demo User',
    image: session.user.image || '/images/authors/default.jpg',
    role: 'user',
    bio: 'Passionate reader and content enthusiast',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    joinedAt: new Date('2024-01-15').toISOString(),
  };

  const mockSettings = {
    emailNotifications: true,
    weeklyDigest: true,
    newFollowerAlerts: false,
    commentReplies: true,
    readingReminders: false,
    theme: 'system' as const,
    language: 'en',
  };

  return {
    props: {
      user: mockUser,
      settings: mockSettings,
    },
  };
};