import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rateLimit';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const CATEGORY_MAP: Record<string, { name: string; color?: string; description?: string }> = {
  news: { name: 'News', color: 'bg-red-500', description: 'Breaking news and current events' },
  finance: { name: 'Finance', color: 'bg-green-500', description: 'Financial markets and economy' },
  technology: { name: 'Technology', color: 'bg-blue-500', description: 'Tech innovations and trends' },
  education: { name: 'Education', color: 'bg-purple-500', description: 'Learning and academic resources' },
  sports: { name: 'Sports', color: 'bg-orange-500', description: 'Sports news and updates' },
  lifestyle: { name: 'Lifestyle', color: 'bg-pink-500', description: 'Health, wellness, and living' },
  jobs: { name: 'Jobs', color: 'bg-cyan-500', description: 'Career opportunities and advice' },
  scholarships: { name: 'Scholarships', color: 'bg-yellow-500', description: 'Educational funding opportunities' },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!apiRateLimit(req, res)) return;

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  const role = (session.user as any).role || '';
  const isAdmin = ['admin', 'ADMIN'].includes(role);

  if (req.method === 'GET') {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { category: true, author: true, tags: true },
    });
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(post);
  }

  if (req.method === 'PUT') {
    const authorRecord = await prisma.author.findFirst({ where: { email: session.user.email! } });
    if (!authorRecord && !isAdmin) return res.status(403).json({ error: 'Forbidden' });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Not found' });

    if (authorRecord && post.authorId !== authorRecord.id && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const {
      title,
      excerpt,
      content,
      coverImage,
      categorySlug,
      tags = [],
      featured,
      status,
      scheduledAt,
      metaTitle,
      metaDesc,
      isPremium,
    } = req.body;

    let categoryId = post.categoryId;
    if (categorySlug) {
      const catMeta: { name: string; color?: string; description?: string } =
        CATEGORY_MAP[categorySlug] || { name: categorySlug };
      const cat = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
          name: catMeta.name,
          slug: categorySlug,
          description: catMeta.description,
          color: catMeta.color,
        },
      });
      categoryId = cat.id;
    }

    const readTime = content ? estimateReadTime(content) : post.readTime;
    const wordCount = content
      ? content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
      : post.wordCount;

    // Upsert tags
    const tagRecords = await Promise.all(
      (tags as string[]).filter(Boolean).map(async (tagName: string) => {
        const tagSlug = slugify(tagName);
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
      })
    );

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(excerpt && { excerpt: excerpt.trim() }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(featured !== undefined && { featured }),
        ...(status && { status }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDesc !== undefined && { metaDesc }),
        ...(isPremium !== undefined && { isPremium }),
        categoryId,
        readTime,
        wordCount,
        ...(tags.length > 0 && {
          tags: { set: tagRecords.map(t => ({ id: t.id })) },
        }),
      },
      include: { category: true, tags: true },
    });

    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const authorRecord = await prisma.author.findFirst({ where: { email: session.user.email! } });
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Not found' });

    if (!isAdmin && (!authorRecord || post.authorId !== authorRecord.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.post.delete({ where: { id } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
