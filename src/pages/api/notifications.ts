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
    const { limit = '20', unreadOnly = 'false' } = req.query;
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
        ...(unreadOnly === 'true' ? { read: false } : {}),
      },
      include: {
        sender: { select: { name: true, image: true } },
        post: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    const unreadCount = await prisma.notification.count({
      where: { recipientId: userId, read: false },
    });

    return res.status(200).json({ notifications, unreadCount });
  }

  if (req.method === 'PATCH') {
    // Mark notifications as read
    const { ids } = req.body;

    if (ids === 'all') {
      await prisma.notification.updateMany({
        where: { recipientId: userId, read: false },
        data: { read: true },
      });
    } else if (Array.isArray(ids)) {
      await prisma.notification.updateMany({
        where: { id: { in: ids }, recipientId: userId },
        data: { read: true },
      });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
