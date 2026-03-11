import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { postId } = req.query;
    if (!postId || typeof postId !== 'string') {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const session = await getServerSession(req, res, authOptions);
    let hasClapped = false;

    if (session?.user?.id) {
      const clap = await prisma.clap.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
      });
      hasClapped = !!clap;
    }

    // Get clap count
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { clapCount: true },
    });

    const clapCount = post?.clapCount || 0;

    res.status(200).json({
      hasClapped,
      clapCount,
    });
  } catch (error) {
    console.error('Clap status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}