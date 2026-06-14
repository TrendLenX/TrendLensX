import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_ROLES = ['user', 'author', 'admin'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, role } = req.body;
  if (!userId || !role || !VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: 'userId and valid role (user|author|admin) are required' });
  }

  const adminId = (session.user as any)?.id;
  if (userId === adminId) {
    return res.status(400).json({ message: 'You cannot change your own role' });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, role: true },
    });

    return res.status(200).json(updated);
  } catch (err: any) {
    if (err?.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    console.error('[admin/role] Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
