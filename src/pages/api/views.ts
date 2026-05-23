import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!apiRateLimit(req, res)) return;

  const { postId } = req.query;
  if (!postId || typeof postId !== 'string') {
    return res.status(400).json({ error: 'postId is required' });
  }

  if (req.method === 'POST') {
    try {
      const post = await prisma.post.update({
        where: { id: postId },
        data: { views: { increment: 1 } },
        select: { views: true },
      });

      // Also record in daily analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.postAnalytics.upsert({
        where: { postId_date: { postId, date: today } },
        update: { views: { increment: 1 } },
        create: { postId, date: today, views: 1 },
      });

      // Recalculate trending score (recency + engagement weighted)
      const fullPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { views: true, clapCount: true, commentsCount: true, publishedAt: true },
      });

      if (fullPost) {
        const ageHours = (Date.now() - new Date(fullPost.publishedAt).getTime()) / 3_600_000;
        const gravity = 1.8;
        const score =
          (fullPost.views + fullPost.clapCount * 3 + fullPost.commentsCount * 5) /
          Math.pow(ageHours + 2, gravity);

        await prisma.post.update({
          where: { id: postId },
          data: { trendingScore: score },
        });
      }

      return res.status(200).json({ views: post.views });
    } catch (error) {
      // Post not found or DB error — fail silently for tracking
      return res.status(200).json({ views: 0 });
    }
  }

  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { views: true },
      });
      return res.status(200).json({ views: post?.views ?? 0 });
    } catch {
      return res.status(200).json({ views: 0 });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
