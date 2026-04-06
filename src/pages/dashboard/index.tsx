import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import AnalyticsOverview from '@/components/Dashboard/AnalyticsOverview';
import RecentPosts from '@/components/Dashboard/RecentPosts';
import AudienceInsights from '@/components/Dashboard/AudienceInsights';
import { prisma } from '@/lib/prisma';
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
          <p className="text-gray-600 mt-2">
            Welcome back, {author.name}! Here's your content performance overview.
          </p>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return ctx.req.cookies[name];
        },
        set(name: string, value: string, options: any) {
          ctx.res.setHeader(
            'Set-Cookie',
            `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`
          );
        },
        remove(name: string, options: any) {
          ctx.res.setHeader(
            'Set-Cookie',
            `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Fetch the user profile from Prisma
  const author = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: {
        orderBy: { publishedAt: 'desc' },
        take: 5,
      },
      followers: true,
      clapRecords: true,
    },
  });

  if (!author) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Calculate stats
  const stats = {
    totalPosts: author.posts.length,
    totalViews: author.posts.reduce((sum, post) => sum + (post.views || 0), 0),
    totalClaps: author.clapRecords.length,
    totalFollowers: author.followers.length,
    avgReadTime:
      author.posts.length > 0
        ? Math.round(
            author.posts.reduce((sum, post) => sum + (post.readTime || 0), 0) /
              author.posts.length
          )
        : 0,
    recentViews: author.posts.slice(0, 5).reduce((sum, post) => sum + (post.views || 0), 0),
    recentClaps: author.posts.slice(0, 5).reduce((sum, post) => sum + (post.clapCount || 0), 0),
  };

  // Audience data example: group followers by month
  const audienceData = await prisma.follower.groupBy({
    by: ['createdAt'],
    _count: { id: true },
  });

  const formattedAudienceData = audienceData.map((entry) => ({
    month: new Date(entry.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }),
    followers: entry._count.id,
  }));

  return {
    props: {
      author,
      stats,
      recentPosts: author.posts,
      audienceData: formattedAudienceData,
    },
  };
};