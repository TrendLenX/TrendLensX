import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;

  if (req.method === 'GET') {
    const post = await prisma.post.findUnique({
      where: { id: id as string },
      include: { category: true, author: true },
    });
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(post);
  }

  if (req.method === 'PUT') {
    const authorRecord = await prisma.author.findFirst({ where: { email: session.user.email! } });
    if (!authorRecord) return res.status(403).json({ error: 'Forbidden' });

    const post = await prisma.post.findUnique({ where: { id: id as string } });
    if (!post) return res.status(404).json({ error: 'Not found' });

    const role = (session.user as any).role || '';
    const isAdmin = ['admin', 'ADMIN'].includes(role);
    if (post.authorId !== authorRecord.id && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, excerpt, content, coverImage, categorySlug, tags, featured } = req.body;

    let categoryId = post.categoryId;
    if (categorySlug) {
      const categoryMap: Record<string, { name: string; color?: string; description?: string }> = {
        news: { name: 'News', color: 'bg-red-500', description: 'Breaking news and current events' },
        finance: { name: 'Finance', color: 'bg-green-500', description: 'Financial markets and economy' },
        technology: { name: 'Technology', color: 'bg-blue-500', description: 'Tech innovations and trends' },
        education: { name: 'Education', color: 'bg-purple-500', description: 'Learning and academic resources' },
        sports: { name: 'Sports', color: 'bg-orange-500', description: 'Sports news and updates' },
        lifestyle: { name: 'Lifestyle', color: 'bg-pink-500', description: 'Health, wellness, and living' },
        jobs: { name: 'Jobs', color: 'bg-cyan-500', description: 'Career opportunities and advice' },
        scholarships: { name: 'Scholarships', color: 'bg-yellow-500', description: 'Educational funding opportunities' },
      };
      const catMeta = categoryMap[categorySlug] || { name: categorySlug };
      const cat = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: { name: catMeta.name, slug: categorySlug, description: catMeta.description, color: catMeta.color },
      });
      categoryId = cat.id;
    }

    const readTime = content ? estimateReadTime(content) : post.readTime;
    const wordCount = content
      ? content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
      : post.wordCount;

    const updated = await prisma.post.update({
      where: { id: id as string },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(featured !== undefined && { featured }),
        categoryId,
        readTime,
        wordCount,
      },
      include: { category: true },
    });

    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const authorRecord = await prisma.author.findFirst({ where: { email: session.user.email! } });
    if (!authorRecord) return res.status(403).json({ error: 'Forbidden' });

    const post = await prisma.post.findUnique({ where: { id: id as string } });
    if (!post) return res.status(404).json({ error: 'Not found' });

    const role = (session.user as any).role || '';
    const isAdmin = ['admin', 'ADMIN'].includes(role);
    if (post.authorId !== authorRecord.id && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.post.delete({ where: { id: id as string } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
