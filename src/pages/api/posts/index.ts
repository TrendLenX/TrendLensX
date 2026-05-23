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

  const role = (session.user as any).role || '';
  const isAuthorOrAdmin = ['author', 'AUTHOR', 'admin', 'ADMIN'].includes(role);

  // GET /api/posts — return author's posts
  if (req.method === 'GET') {
    const authorRecord = await prisma.author.findFirst({
      where: { email: session.user.email! },
    });
    if (!authorRecord) return res.status(200).json([]);

    const { status } = req.query;
    const posts = await prisma.post.findMany({
      where: {
        authorId: authorRecord.id,
        ...(status ? { status: String(status) } : {}),
      },
      include: { category: true, tags: true },
      orderBy: { publishedAt: 'desc' },
    });
    return res.status(200).json(posts);
  }

  // POST /api/posts — create new post
  if (req.method === 'POST') {
    if (!isAuthorOrAdmin) return res.status(403).json({ error: 'Forbidden' });

    const {
      title,
      excerpt,
      content,
      coverImage,
      categorySlug,
      tags = [],
      featured = false,
      status = 'published',
      scheduledAt,
      metaTitle,
      metaDesc,
      isPremium = false,
    } = req.body;

    if (!title?.trim() || !excerpt?.trim() || !content?.trim() || !categorySlug) {
      return res.status(400).json({ error: 'title, excerpt, content, and category are required' });
    }

    // Upsert author record
    let authorRecord = await prisma.author.findFirst({
      where: { email: session.user.email! },
    });

    if (!authorRecord) {
      const nameSlug = slugify(session.user.name || 'author');
      authorRecord = await prisma.author.create({
        data: {
          name: session.user.name || 'Author',
          slug: `${nameSlug}-${Date.now()}`,
          email: session.user.email!,
          role,
          image: session.user.image || undefined,
        },
      });
    }

    // Upsert category
    const catMeta: { name: string; color?: string; description?: string } =
      CATEGORY_MAP[categorySlug] || { name: categorySlug };
    const categoryRecord = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: {
        name: catMeta.name,
        slug: categorySlug,
        description: catMeta.description,
        color: catMeta.color,
      },
    });

    // Unique slug
    const baseSlug = slugify(title);
    const existing = await prisma.post.findUnique({ where: { slug: baseSlug } });
    const finalSlug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    const readTime = estimateReadTime(content);
    const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;

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

    const publishedAt = status === 'scheduled' && scheduledAt
      ? new Date(scheduledAt)
      : new Date();

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
        publishedAt,
        readTime,
        wordCount,
        featured,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt,
        isPremium,
        authorId: authorRecord.id,
        categoryId: categoryRecord.id,
        tags: { connect: tagRecords.map(t => ({ id: t.id })) },
      },
      include: { category: true, tags: true },
    });

    return res.status(201).json(post);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
