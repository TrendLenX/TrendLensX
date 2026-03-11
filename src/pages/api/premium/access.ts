import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { postId } = req.query;

    if (!postId || typeof postId !== 'string') {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Check if content is premium
    const premiumContent = await prisma.premiumContent.findUnique({
      where: { postId },
    });

    if (!premiumContent?.isPremium) {
      return res.status(200).json({
        isPremium: false,
        hasAccess: true,
        previewText: null,
      });
    }

    // Check user access
    const session = await getServerSession(req, res, authOptions);
    let hasAccess = false;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          subscriptions: {
            where: { status: 'active' },
            include: { plan: true },
          },
        },
      });

      // Check if user has active premium subscription
      hasAccess = user?.subscriptions?.some(sub =>
        sub.status === 'active' && sub.plan.name.toLowerCase().includes('premium')
      ) || false;
    }

    return res.status(200).json({
      isPremium: true,
      hasAccess,
      previewText: premiumContent.previewText,
    });
  } catch (error) {
    console.error('Error checking premium access:', error);
    return res.status(500).json({ error: 'Failed to check access' });
  }
}