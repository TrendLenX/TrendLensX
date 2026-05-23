import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!apiRateLimit(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { limit = '10', category } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        status: 'published',
        ...(category ? { category: { slug: String(category) } } : {}),
      },
      orderBy: { trendingScore: 'desc' },
      take: Number(limit),
      include: {
        author: { select: { name: true, slug: true, image: true } },
        category: { select: { name: true, slug: true, color: true } },
        tags: { select: { name: true, slug: true } },
      },
    });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Trending API error:', error);
    return res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
}
