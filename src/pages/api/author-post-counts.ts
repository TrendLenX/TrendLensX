import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthorPostCounts } from '@/lib/mdxPosts';

export default function handler(req: NextApiRequest, res: NextApiResponse<Record<string, number>>) {
  // Always compute on-demand (no caching) so counts reflect the latest posts.
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const counts = getAuthorPostCounts();
  return res.status(200).json(counts);
}
