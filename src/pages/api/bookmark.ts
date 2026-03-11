import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    if (req.method === 'POST') {
      // Add bookmark
      const existingBookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
      });

      if (existingBookmark) {
        return res.status(400).json({ message: 'Already bookmarked' });
      }

      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });

      res.status(201).json({ bookmarked: true });
    } else if (req.method === 'DELETE') {
      // Remove bookmark
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
      });

      if (!bookmark) {
        return res.status(400).json({ message: 'Not bookmarked' });
      }

      await prisma.bookmark.delete({
        where: { id: bookmark.id },
      });

      res.status(200).json({ bookmarked: false });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}