import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPosts } from '@/lib/mdxPosts';

export default function handler(req: NextApiRequest, res: NextApiResponse<Record<string, number>>) {
  // Always compute on-demand so it reflects the latest posts in content.
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const counts: Record<string, number> = {};
  getAllPosts().forEach((post) => {
    const slug = post.category?.slug;
    if (!slug) return;
    counts[slug] = (counts[slug] || 0) + 1;
  });

  return res.status(200).json(counts);
}
