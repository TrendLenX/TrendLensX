import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import ProfileLayout from '@/components/Profile/ProfileLayout';
import ProfileOverview from '@/components/Profile/ProfileOverview';
import RecentActivity from '@/components/Profile/RecentActivity';
import ReadingStats from '@/components/Profile/ReadingStats';
import { User } from '@/types';

interface ProfileProps {
  user: User;
  stats: {
    totalArticlesRead: number;
    totalClapsGiven: number;
    totalBookmarks: number;
    totalFollowing: number;
    readingStreak: number;
    avgReadingTime: number;
  };
  recentActivity: any[];
  readingStats: any[];
}

export default function Profile({ user, stats, recentActivity, readingStats }: ProfileProps) {
  return (
    <ProfileLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}! Here's your reading activity overview.</p>
        </div>

        <ProfileOverview user={user} stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity activities={recentActivity} />
          <ReadingStats stats={readingStats} />
        </div>
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

  const mockStats = {
    totalArticlesRead: 47,
    totalClapsGiven: 156,
    totalBookmarks: 23,
    totalFollowing: 12,
    readingStreak: 7,
    avgReadingTime: 5.2,
  };

  const mockRecentActivity = [
    {
      id: '1',
      type: 'read',
      title: 'The Future of AI in Healthcare',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      postSlug: 'ai-healthcare-future',
    },
    {
      id: '2',
      type: 'clap',
      title: 'Sustainable Fashion Revolution',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      postSlug: 'sustainable-fashion-revolution',
    },
    {
      id: '3',
      type: 'bookmark',
      title: 'Remote Work Trends 2024',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      postSlug: 'remote-work-trends-2024',
    },
  ];

  const mockReadingStats = [
    { day: 'Mon', articles: 3, minutes: 15 },
    { day: 'Tue', articles: 5, minutes: 25 },
    { day: 'Wed', articles: 2, minutes: 10 },
    { day: 'Thu', articles: 4, minutes: 20 },
    { day: 'Fri', articles: 6, minutes: 30 },
    { day: 'Sat', articles: 8, minutes: 40 },
    { day: 'Sun', articles: 7, minutes: 35 },
  ];

  return {
    props: {
      user: mockUser,
      stats: mockStats,
      recentActivity: mockRecentActivity,
      readingStats: mockReadingStats,
    },
  };
};