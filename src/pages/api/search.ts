import { NextApiRequest, NextApiResponse } from 'next';
import { searchPosts } from '@/lib/search';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      q,
      category,
      author,
      dateFrom,
      dateTo,
      sortBy = 'relevance',
      limit = 20
    } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const results = searchPosts({
      query: q,
      category: typeof category === 'string' ? category : undefined,
      author: typeof author === 'string' ? author : undefined,
      dateFrom: typeof dateFrom === 'string' ? dateFrom : undefined,
      dateTo: typeof dateTo === 'string' ? dateTo : undefined,
      sortBy: (typeof sortBy === 'string' && ['relevance', 'date', 'popularity'].includes(sortBy))
        ? sortBy as 'relevance' | 'date' | 'popularity'
        : 'relevance',
      limit: typeof limit === 'string' ? parseInt(limit, 10) : 20,
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}