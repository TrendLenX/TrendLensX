import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [total, admins, authors, frozen, unverified] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { role: 'author' } }),
      prisma.user.count({ where: { frozen: true } }),
      prisma.user.count({ where: { emailVerified: null, password: { not: null } } }),
    ]);

    // Daily signups for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Bucket by day
    const dayMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      dayMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const u of recentUsers) {
      const key = u.createdAt.toISOString().slice(0, 10);
      if (key in dayMap) dayMap[key]++;
    }
    const dailySignups = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

    // Weekly signups: last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const thisWeek = recentUsers.filter((u) => u.createdAt >= sevenDaysAgo).length;

    return res.status(200).json({
      total,
      admins,
      authors,
      frozen,
      unverified,
      thisWeek,
      dailySignups,
    });
  } catch (err) {
    console.error('[admin/stats] Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
