import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // GET — list subscribers
  if (req.method === 'GET') {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '25', 10)));
    const search = ((req.query.search as string) || '').trim();
    const statusFilter = (req.query.status as string) || '';
    const freqFilter = (req.query.frequency as string) || '';

    const where: any = {};
    if (search) where.email = { contains: search, mode: 'insensitive' };
    if (statusFilter === 'active') where.active = true;
    if (statusFilter === 'inactive') where.active = false;
    if (freqFilter) where.frequency = freqFilter;

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [subs, total, totalActive, totalInactive, thisWeek, thisMonth] = await Promise.all([
        prisma.newsletterSub.findMany({
          where,
          select: { id: true, email: true, frequency: true, active: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.newsletterSub.count({ where }),
        prisma.newsletterSub.count({ where: { active: true } }),
        prisma.newsletterSub.count({ where: { active: false } }),
        prisma.newsletterSub.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        prisma.newsletterSub.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      ]);

      return res.status(200).json({
        subs,
        total,
        page,
        pages: Math.ceil(total / limit),
        stats: { totalActive, totalInactive, thisWeek, thisMonth },
      });
    } catch (err) {
      console.error('[admin/newsletter] GET error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PATCH — activate / deactivate
  if (req.method === 'PATCH') {
    const { id, active } = req.body;
    if (!id || typeof active !== 'boolean') {
      return res.status(400).json({ message: 'id and active (boolean) are required' });
    }
    try {
      const updated = await prisma.newsletterSub.update({
        where: { id },
        data: { active },
        select: { id: true, active: true },
      });
      return res.status(200).json(updated);
    } catch (err: any) {
      if (err?.code === 'P2025') return res.status(404).json({ message: 'Subscriber not found' });
      console.error('[admin/newsletter] PATCH error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // DELETE — hard delete a subscriber record
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'id is required' });
    try {
      await prisma.newsletterSub.delete({ where: { id } });
      return res.status(200).json({ message: 'Deleted' });
    } catch (err: any) {
      if (err?.code === 'P2025') return res.status(404).json({ message: 'Subscriber not found' });
      console.error('[admin/newsletter] DELETE error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
