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

    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    // Check if user already clapped
    const existingClap = await prisma.clap.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });

    if (existingClap) {
      // User already clapped, remove clap
      await prisma.clap.delete({
        where: { id: existingClap.id },
      });

      // Decrement clap count
      await prisma.post.update({
        where: { id: postId },
        data: { clapCount: { decrement: 1 } },
      });

      res.status(200).json({ clapped: false, clapCount: existingClap.count });
    } else {
      // Add new clap
      const clap = await prisma.clap.create({
        data: {
          userId: session.user.id,
          postId,
          count: 1,
        },
      });

      // Increment clap count
      await prisma.post.update({
        where: { id: postId },
        data: { clapCount: { increment: 1 } },
      });

      res.status(201).json({ clapped: true, clapCount: clap.count });
    }
  } catch (error) {
    console.error('Clap error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}