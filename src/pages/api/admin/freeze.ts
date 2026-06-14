import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, frozen } = req.body;
  if (!userId || typeof frozen !== 'boolean') {
    return res.status(400).json({ message: 'userId and frozen (boolean) are required' });
  }

  const adminId = (session.user as any)?.id;
  if (userId === adminId) {
    return res.status(400).json({ message: 'You cannot freeze your own account' });
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!target) return res.status(404).json({ message: 'User not found' });
    if (target.role === 'admin') {
      return res.status(400).json({ message: 'Cannot freeze another admin' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { frozen },
      select: { id: true, frozen: true },
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error('[admin/freeze] Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
