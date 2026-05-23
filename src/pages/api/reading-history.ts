import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!apiRateLimit(req, res)) return;

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = (session.user as any).id;

  if (req.method === 'GET') {
    const history = await prisma.readingHistory.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: { select: { name: true, slug: true, image: true } },
            category: { select: { name: true, slug: true, color: true } },
          },
        },
      },
      orderBy: { readAt: 'desc' },
      take: 50,
    });
    return res.status(200).json(history);
  }

  if (req.method === 'POST') {
    const { postId, progress = 0 } = req.body;
    if (!postId) return res.status(400).json({ error: 'postId required' });

    try {
      const entry = await prisma.readingHistory.upsert({
        where: { userId_postId: { userId, postId } },
        update: { readAt: new Date(), progress: Math.min(1, Math.max(0, progress)) },
        create: { userId, postId, progress: Math.min(1, Math.max(0, progress)) },
      });
      return res.status(200).json(entry);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update reading history' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
