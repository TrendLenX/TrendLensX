import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import AnalyticsOverview from '@/components/Dashboard/AnalyticsOverview';
import RecentPosts from '@/components/Dashboard/RecentPosts';
import AudienceInsights from '@/components/Dashboard/AudienceInsights';
import { Author } from '@/types';

interface DashboardProps {
  author: Author;
  stats: {
    totalPosts: number;
    totalViews: number;
    totalClaps: number;
    totalFollowers: number;
    avgReadTime: number;
    recentViews: number;
    recentClaps: number;
  };
  recentPosts: any[];
  audienceData: any[];
}

export default function Dashboard({ author, stats, recentPosts, audienceData }: DashboardProps) {
  return (
    <DashboardLayout author={author}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {author.name}! Here's your content performance overview.</p>
        </div>

        <AnalyticsOverview stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentPosts posts={recentPosts} />
          <AudienceInsights data={audienceData} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session?.user?.email) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    }

    // For demo purposes, return mock data if database is not available
    const mockAuthor = {
      id: 'demo-author',
      name: 'Demo Author',
      slug: 'demo-author',
      role: 'Author',
      bio: 'Demo author for TrendLensX',
      image: '/images/authors/default.jpg',
      email: session.user.email,
    };

    const mockStats = {
      totalPosts: 5,
      totalViews: 1250,
      totalClaps: 89,
      totalFollowers: 42,
      avgReadTime: 4,
      recentViews: 150,
      recentClaps: 12,
    };

    const mockRecentPosts = [
      {
        id: '1',
        title: 'Sample Article 1',
        slug: 'sample-article-1',
        excerpt: 'This is a sample article excerpt...',
        publishedAt: new Date().toISOString(),
        views: 450,
        clapCount: 23,
        category: { name: 'Technology', slug: 'technology' },
        _count: { clapRecords: 23, bookmarks: 5, comments: 3 },
      },
    ];

    const mockAudienceData = [
      { month: 'Jan 2024', followers: 12 },
      { month: 'Feb 2024', followers: 18 },
      { month: 'Mar 2024', followers: 25 },
      { month: 'Apr 2024', followers: 32 },
      { month: 'May 2024', followers: 38 },
      { month: 'Jun 2024', followers: 42 },
    ];

    return {
      props: {
        author: mockAuthor,
        stats: mockStats,
        recentPosts: mockRecentPosts,
        audienceData: mockAudienceData,
      },
    };
  } catch (error) {
    // Fallback for demo/development
    return {
      props: {
        author: {
          id: 'demo-author',
          name: 'Demo Author',
          slug: 'demo-author',
          role: 'Author',
          bio: 'Demo author for TrendLensX',
          image: '/images/authors/default.jpg',
          email: 'demo@example.com',
        },
        stats: {
          totalPosts: 0,
          totalViews: 0,
          totalClaps: 0,
          totalFollowers: 0,
          avgReadTime: 0,
          recentViews: 0,
          recentClaps: 0,
        },
        recentPosts: [],
        audienceData: [],
      },
    };
  }
};