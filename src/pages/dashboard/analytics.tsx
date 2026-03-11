import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import AnalyticsCharts from '@/components/Dashboard/AnalyticsCharts';
import TopPosts from '@/components/Dashboard/TopPosts';
import AudienceMetrics from '@/components/Dashboard/AudienceMetrics';
import EngagementBreakdown from '@/components/Dashboard/EngagementBreakdown';
import { Author } from '@/types';

interface AnalyticsProps {
  author: Author;
  analytics: {
    viewsOverTime: any[];
    topPosts: any[];
    engagementMetrics: {
      totalViews: number;
      totalClaps: number;
      totalComments: number;
      totalBookmarks: number;
      avgReadTime: number;
      readCompletionRate: number;
    };
    audienceMetrics: {
      totalFollowers: number;
      followerGrowth: number;
      topReferrers: any[];
    };
  };
}

export default function Analytics({ author, analytics }: AnalyticsProps) {
  return (
    <DashboardLayout author={author}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Detailed insights into your content performance and audience.</p>
        </div>

        <AnalyticsCharts
          viewsOverTime={analytics.viewsOverTime}
          engagementMetrics={analytics.engagementMetrics}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TopPosts posts={analytics.topPosts} />
          <div className="space-y-6">
            <AudienceMetrics metrics={analytics.audienceMetrics} />
            <EngagementBreakdown metrics={analytics.engagementMetrics} />
          </div>
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

    // Mock data for demo purposes
    const mockAuthor = {
      id: 'demo-author',
      name: 'Demo Author',
      slug: 'demo-author',
      role: 'Author',
      bio: 'Demo author for TrendLensX',
      image: '/images/authors/default.jpg',
      email: session.user.email,
    };

    const mockAnalytics = {
      viewsOverTime: [
        { date: '2024-01-01', views: 120, readComplete: 95, avgReadTime: 4.2 },
        { date: '2024-01-02', views: 150, readComplete: 120, avgReadTime: 3.8 },
        { date: '2024-01-03', views: 180, readComplete: 140, avgReadTime: 4.1 },
        // Add more mock data...
      ],
      topPosts: [
        {
          id: '1',
          title: 'Sample Article 1',
          slug: 'sample-article-1',
          coverImage: '/images/posts/sample.jpg',
          views: 450,
          engagement: 125,
          _count: { clapRecords: 23, bookmarks: 5, comments: 3 },
        },
      ],
      engagementMetrics: {
        totalViews: 1250,
        totalClaps: 89,
        totalComments: 15,
        totalBookmarks: 12,
        avgReadTime: 4,
        readCompletionRate: 78,
      },
      audienceMetrics: {
        totalFollowers: 42,
        followerGrowth: 15.5,
        topReferrers: [],
      },
    };

    return {
      props: {
        author: mockAuthor,
        analytics: mockAnalytics,
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
        analytics: {
          viewsOverTime: [],
          topPosts: [],
          engagementMetrics: {
            totalViews: 0,
            totalClaps: 0,
            totalComments: 0,
            totalBookmarks: 0,
            avgReadTime: 0,
            readCompletionRate: 0,
          },
          audienceMetrics: {
            totalFollowers: 0,
            followerGrowth: 0,
            topReferrers: [],
          },
        },
      },
    };
  }
};