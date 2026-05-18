import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const role = (session.user as any).role || '';
  const isAuthorOrAdmin = ['author', 'AUTHOR', 'admin', 'ADMIN'].includes(role);

  if (req.method === 'GET') {
    const authorRecord = await prisma.author.findFirst({
      where: { email: session.user.email! },
    });
    if (!authorRecord) return res.status(200).json([]);

    const posts = await prisma.post.findMany({
      where: { authorId: authorRecord.id },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
    });
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    if (!isAuthorOrAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, excerpt, content, coverImage, categorySlug, tags, featured } = req.body;

    if (!title || !excerpt || !content || !categorySlug) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let authorRecord = await prisma.author.findFirst({
      where: { email: session.user.email! },
    });

    if (!authorRecord) {
      authorRecord = await prisma.author.create({
        data: {
          name: session.user.name || 'Anonymous',
          slug: slugify(session.user.name || 'anonymous') + '-' + Date.now(),
          email: session.user.email!,
          role: role,
        },
      });
    }

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

    const baseSlug = slugify(title);
    let finalSlug = baseSlug;
    const existing = await prisma.post.findUnique({ where: { slug: baseSlug } });
    if (existing) {
      finalSlug = baseSlug + '-' + Date.now();
    }

    const readTime = estimateReadTime(content);
    const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;

    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
        publishedAt: new Date(),
        readTime,
        wordCount,
        featured: featured || false,
        authorId: authorRecord.id,
        categoryId: categoryRecord.id,
      },
      include: { category: true },
    });

    return res.status(201).json(post);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
