import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid token' });
  }

  try {
    const sub = await prisma.newsletterSub.findUnique({
      where: { unsubToken: token },
      select: { id: true, active: true },
    });

    if (!sub) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    if (!sub.active) {
      return res.status(200).json({ message: 'Already unsubscribed' });
    }

    await prisma.newsletterSub.update({
      where: { unsubToken: token },
      data: { active: false },
    });

    return res.status(200).json({ message: 'Successfully unsubscribed' });
  } catch (err) {
    console.error('[newsletter/unsubscribe-token] Error:', err);
    return res.status(500).json({ error: 'Failed to unsubscribe' });
  }
}
