import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// One-time bootstrap: promotes the calling user to admin IF no admin exists yet.
// Safe to leave in — once an admin exists it becomes a no-op.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'You must be signed in' });
  }

  try {
    const adminCount = await prisma.user.count({ where: { role: 'admin' } });

    if (adminCount > 0) {
      return res.status(403).json({
        message: 'An admin already exists. Ask an existing admin to change your role.',
      });
    }

    const userId = (session.user as any)?.id;
    if (!userId) return res.status(400).json({ message: 'Cannot determine user id' });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: 'admin' },
      select: { id: true, name: true, email: true, role: true },
    });

    console.log(`[admin/setup] First admin promoted: ${updated.email}`);
    return res.status(200).json({ message: 'You are now an admin!', user: updated });
  } catch (err) {
    console.error('[admin/setup] Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
