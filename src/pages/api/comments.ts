import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!apiRateLimit(req, res)) return;

  const { postId } = req.query;
  if (!postId || typeof postId !== 'string') {
    return res.status(400).json({ error: 'postId is required' });
  }

  if (req.method === 'GET') {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null, approved: true },
      include: {
        user: { select: { id: true, name: true, image: true } },
        replies: {
          where: { approved: true },
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(comments);
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) return res.status(401).json({ error: 'Sign in to comment' });

    const userId = (session.user as any).id;
    const { content, parentId } = req.body;

    if (!content?.trim() || content.trim().length < 3) {
      return res.status(400).json({ error: 'Comment must be at least 3 characters' });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({ error: 'Comment cannot exceed 2000 characters' });
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          content: content.trim(),
          userId,
          postId,
          parentId: parentId || null,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });

      // Update comment count on post
      await prisma.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      });

      // Create notification for post author
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { author: { select: { email: true } } },
      });

      if (post?.author?.email) {
        const postAuthor = await prisma.user.findUnique({
          where: { email: post.author.email },
          select: { id: true },
        });

        if (postAuthor && postAuthor.id !== userId) {
          await prisma.notification.create({
            data: {
              recipientId: postAuthor.id,
              senderId: userId,
              type: parentId ? 'reply' : 'new_comment',
              title: parentId ? 'New reply on your post' : 'New comment on your post',
              message: content.trim().substring(0, 100),
              postId,
            },
          });
        }
      }

      return res.status(201).json(comment);
    } catch (error) {
      console.error('Comment error:', error);
      return res.status(500).json({ error: 'Failed to post comment' });
    }
  }

  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    const { commentId } = req.body;

    if (!commentId) return res.status(400).json({ error: 'commentId required' });

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const canDelete = comment.userId === userId || role === 'admin' || role === 'ADMIN';
    if (!canDelete) return res.status(403).json({ error: 'Forbidden' });

    await prisma.comment.delete({ where: { id: commentId } });
    await prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { decrement: 1 } },
    });

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
