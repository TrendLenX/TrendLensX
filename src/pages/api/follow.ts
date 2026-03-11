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

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: authorId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this author' });
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: authorId,
      },
    });

    // Update author follower count
    await prisma.author.update({
      where: { id: authorId },
      data: {
        followerCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({ follow });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}