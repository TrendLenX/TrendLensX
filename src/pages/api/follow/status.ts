import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { authorId } = req.query;
    if (!authorId || typeof authorId !== 'string') {
      return res.status(400).json({ message: 'Author ID is required' });
    }

    const session = await getServerSession(req, res, authOptions);
    let isFollowing = false;

    if (session?.user?.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: authorId,
          },
        },
      });
      isFollowing = !!follow;
    }

    // Get follower count
    const author = await prisma.author.findUnique({
      where: { id: authorId },
      select: { followerCount: true },
    });

    const followerCount = author?.followerCount || 0;

    res.status(200).json({
      isFollowing,
      followerCount,
    });
  } catch (error) {
    console.error('Follow status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}