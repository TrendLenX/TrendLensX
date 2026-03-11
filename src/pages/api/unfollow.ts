import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { authorId } = req.body;
    if (!authorId) {
      return res.status(400).json({ message: 'Author ID is required' });
    }

    // Check if following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: authorId,
        },
      },
    });

    if (!existingFollow) {
      return res.status(400).json({ message: 'Not following this author' });
    }

    // Delete follow relationship
    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    // Update author follower count
    await prisma.author.update({
      where: { id: authorId },
      data: {
        followerCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}