import { Post } from '@/types';
import { getAllPosts } from './mdxPosts';

interface RecommendationOptions {
  currentPost?: Post;
  userId?: string;
  limit?: number;
  excludeIds?: string[];
}

interface RecommendationScore {
  post: Post;
  score: number;
  reasons: string[];
}

/**
 * Calculate recommendation score for a post based on various factors
 */
function calculateRecommendationScore(
  post: Post,
  options: RecommendationOptions
): RecommendationScore {
  let score = 0;
  const reasons: string[] = [];

  const { currentPost } = options;

  // Category similarity (high weight)
  if (currentPost && post.category.slug === currentPost.category.slug) {
    score += 30;
    reasons.push('Same category');
  }

  // Tag similarity
  if (currentPost) {
    const commonTags = post.tags.filter(tag =>
      currentPost.tags.some(currentTag => currentTag === tag)
    );
    score += commonTags.length * 15;
    if (commonTags.length > 0) {
      reasons.push(`${commonTags.length} common tags`);
    }
  }

  // Popularity weight (based on featured status for now)
  if (post.featured) {
    score += 20;
    reasons.push('Featured post');
  }

  // Author diversity bonus (slight preference for different authors)
  if (currentPost && post.authorId !== currentPost.authorId) {
    score += 5;
    reasons.push('Different author');
  }

  // Recency bonus (newer posts get slight preference)
  const daysSincePublished = (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePublished < 7) {
    score += 10;
    reasons.push('Recently published');
  } else if (daysSincePublished < 30) {
    score += 5;
    reasons.push('Published this month');
  }

  // Reading time preference (medium-length articles)
  if (post.readTime >= 3 && post.readTime <= 8) {
    score += 5;
    reasons.push('Optimal reading length');
  }

  return { post, score, reasons };
}

/**
 * Get recommended posts based on intelligent scoring
 */
export function getRecommendedPosts(options: RecommendationOptions = {}): Post[] {
  const { limit = 6, excludeIds = [], currentPost } = options;

  const allPosts = getAllPosts();

  // Filter out excluded posts
  let candidates = allPosts.filter(post => !excludeIds.includes(post.id));

  // If we have a current post, exclude it
  if (currentPost) {
    candidates = candidates.filter(post => post.id !== currentPost.id);
  }

  // Calculate scores for all candidates
  const scoredPosts = candidates.map(post =>
    calculateRecommendationScore(post, options)
  );

  // Sort by score descending
  scoredPosts.sort((a, b) => b.score - a.score);

  // Return top recommendations
  return scoredPosts.slice(0, limit).map(item => item.post);
}

/**
 * Get trending posts based on recent activity (simplified for now)
 */
export function getTrendingPosts(limit: number = 6): Post[] {
  const allPosts = getAllPosts();

  // For now, use a combination of featured status, recency, and engagement proxy
  const scoredPosts = allPosts.map(post => {
    let score = 0;

    // Featured posts get high score
    if (post.featured) score += 50;

    // Recent posts
    const daysSincePublished = (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 7) score += 30;
    else if (daysSincePublished < 30) score += 15;

    // Reading time (popular length)
    if (post.readTime >= 4 && post.readTime <= 7) score += 10;

    return { post, score };
  });

  scoredPosts.sort((a, b) => b.score - a.score);

  return scoredPosts.slice(0, limit).map(item => item.post);
}

/**
 * Get personalized recommendations for a user (placeholder for future)
 */
export function getPersonalizedRecommendations(
  userId: string,
  options: Omit<RecommendationOptions, 'userId'> = {}
): Post[] {
  // For now, return general recommendations
  // In the future, this would consider user's reading history, followed authors, etc.
  return getRecommendedPosts({ ...options, userId });
}