import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!apiRateLimit(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

  const role = (session.user as any).role;
  const email = session.user.email!;

  try {
    const authorRecord = await prisma.author.findFirst({ where: { email } });

    if (!authorRecord && role !== 'admin' && role !== 'ADMIN') {
      return res.status(403).json({ error: 'Author account required' });
    }

    const where = authorRecord ? { authorId: authorRecord.id } : {};

    // Aggregate stats
    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        clapCount: true,
        commentsCount: true,
        publishedAt: true,
        status: true,
        trendingScore: true,
      },
      orderBy: { views: 'desc' },
    });

    const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
    const totalClaps = posts.reduce((sum, p) => sum + p.clapCount, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.commentsCount, 0);
    const publishedPosts = posts.filter(p => p.status === 'published');
    const draftPosts = posts.filter(p => p.status === 'draft');

    const followerCount = authorRecord
      ? await prisma.follow.count({ where: { followingId: authorRecord.id } })
      : 0;

    // Daily analytics for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyAnalytics = authorRecord
      ? await prisma.postAnalytics.findMany({
          where: {
            post: { authorId: authorRecord.id },
            date: { gte: thirtyDaysAgo },
          },
          orderBy: { date: 'asc' },
          select: { date: true, views: true, readComplete: true },
        })
      : [];

    // Group by date
    const byDate: Record<string, { views: number; reads: number }> = {};
    for (const entry of dailyAnalytics) {
      const key = entry.date.toISOString().split('T')[0];
      if (!byDate[key]) byDate[key] = { views: 0, reads: 0 };
      byDate[key].views += entry.views;
      byDate[key].reads += entry.readComplete;
    }

    const chartData = Object.entries(byDate).map(([date, data]) => ({
      date,
      views: data.views,
      reads: data.reads,
    }));

    return res.status(200).json({
      summary: {
        totalPosts: posts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        totalViews,
        totalClaps,
        totalComments,
        followerCount,
      },
      topPosts: posts.slice(0, 5),
      chartData,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
