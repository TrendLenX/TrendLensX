import Fuse from 'fuse.js';
import { Post } from '@/types';
import { getAllPosts } from './mdxPosts';

interface SearchOptions {
  query: string;
  category?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'date' | 'popularity';
  limit?: number;
}

interface SearchResult {
  posts: Post[];
  total: number;
  query: string;
  filters: {
    category?: string;
    author?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

/**
 * Advanced search utility using Fuse.js
 */
export function searchPosts(options: SearchOptions): SearchResult {
  const {
    query,
    category,
    author,
    dateFrom,
    dateTo,
    sortBy = 'relevance',
    limit = 20
  } = options;

  let allPosts = getAllPosts();

  // Apply filters
  if (category) {
    allPosts = allPosts.filter(post => post.category.slug === category);
  }

  if (author) {
    allPosts = allPosts.filter(post => post.authorId === author);
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    allPosts = allPosts.filter(post => new Date(post.publishedAt) >= fromDate);
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    allPosts = allPosts.filter(post => new Date(post.publishedAt) <= toDate);
  }

  let results: Post[] = [];

  if (query.trim()) {
    // Fuse.js search configuration
    const fuse = new Fuse(allPosts, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'excerpt', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'tags', weight: 0.1 },
        { name: 'category.name', weight: 0.1 },
        { name: 'authorId', weight: 0.05 },
      ],
      threshold: 0.3, // Lower = more strict matching
      includeScore: true,
      shouldSort: true,
    });

    const fuseResults = fuse.search(query);
    results = fuseResults.map(result => result.item);
  } else {
    // No query, return filtered results
    results = allPosts;
  }

  // Sort results
  switch (sortBy) {
    case 'date':
      results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      break;
    case 'popularity':
      // For now, sort by featured status and recency
      results.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
      break;
    case 'relevance':
    default:
      // Fuse.js already sorts by relevance
      break;
  }

  // Apply limit
  const limitedResults = results.slice(0, limit);

  return {
    posts: limitedResults,
    total: results.length,
    query,
    filters: {
      category,
      author,
      dateFrom,
      dateTo,
    },
  };
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(query: string, limit: number = 5): string[] {
  if (!query.trim()) return [];

  const allPosts = getAllPosts();

  // Extract unique words from titles and tags
  const words = new Set<string>();

  allPosts.forEach(post => {
    // Title words
    post.title.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 2) words.add(word);
    });

    // Tag words
    post.tags.forEach(tag => {
      tag.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) words.add(word);
      });
    });

    // Category name
    post.category.name.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 2) words.add(word);
    });
  });

  // Filter suggestions that start with the query
  const suggestions = Array.from(words)
    .filter(word => word.startsWith(query.toLowerCase()))
    .slice(0, limit);

  return suggestions;
}

/**
 * Get popular search terms (placeholder for future analytics)
 */
export function getPopularSearchTerms(limit: number = 10): string[] {
  // For now, return some common terms based on content
  const allPosts = getAllPosts();
  const terms = new Set<string>();

  allPosts.forEach(post => {
    // Extract common words from titles
    const titleWords = post.title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    titleWords.forEach(word => terms.add(word));
  });

  return Array.from(terms).slice(0, limit);
}