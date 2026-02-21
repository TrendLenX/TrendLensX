import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, Author, Category } from '@/types';
import { authors } from '@/data/authors';
import { categories } from '@/data/mockData';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

interface PostFrontMatter {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author?: string;
  authorId?: string;
  date: string;
  featuredImage?: string;
  tags?: string[];
  featured?: boolean;
}

function resolveAuthorId(authorId?: string, authorName?: string): string {
  if (authorId) {
    const author = authors.find(a => a.id === authorId);
    if (author) return author.id;
  }

  if (authorName) {
    const found = authors.find((a) => a.name.toLowerCase() === authorName.toLowerCase());
    if (found) return found.id;
  }

  return 'maruf-quadri';
}

function getCategoryBySlug(slug: string): Category {
  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    throw new Error(`Category not found: ${slug}`);
  }
  return category;
}

function getMDXFiles(): string[] {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'));
}

function parseMDXFile(filename: string): { data: PostFrontMatter; content: string } {
  const filepath = path.join(postsDirectory, filename);
  const source = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(source);
  return { data: data as PostFrontMatter, content };
}

function extractTextFromMDX(mdx: string): string {
  let s = mdx;
  s = s.replace(/```[\s\S]*?```/g, ' ');
  s = s.replace(/`[^`]*`/g, ' ');
  s = s.replace(/<[^>]*>/g, ' ');
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  s = s.replace(/[#>*-]{1,3}/g, ' ');
  s = s.replace(/[\*\_\~\=\<\{\}\[\]\(\)\+\.,]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

export function getAllPosts(): Post[] {
  const mdxFiles = getMDXFiles();
  const posts = mdxFiles
    .map((file) => {
      const { data, content } = parseMDXFile(file);
      const authorId = resolveAuthorId(data.authorId, data.author);
      const category = getCategoryBySlug(data.category);
      const cleaned = extractTextFromMDX(content);
      const wordCount = cleaned ? cleaned.split(/\s+/).filter(Boolean).length : 0;
      const readTimeNum = Math.max(1, Math.ceil(wordCount / 200));
      const readingTime = `${readTimeNum} min read`;
      const readTime = readTimeNum;
      
      return {
        id: data.slug,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: content,
        coverImage: data.featuredImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
        publishedAt: new Date(data.date).toISOString(),
        authorId,
        category,
        tags: data.tags || [],
        readTime,
        readingTime,
        wordCount,
        featured: data.featured || false,
      } as Post;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const mdxFiles = getMDXFiles();
  const filename = mdxFiles.find((f) => f.includes(slug));

  if (!filename) {
    return null;
  }

  const { data, content } = parseMDXFile(filename);
  const authorId = resolveAuthorId(data.authorId, data.author);
  const category = getCategoryBySlug(data.category);
  const cleaned = extractTextFromMDX(content);
  const wordCount = cleaned ? cleaned.split(/\s+/).filter(Boolean).length : 0;
  const readTimeNum = Math.max(1, Math.ceil(wordCount / 200));
  const readingTime = `${readTimeNum} min read`;
  const readTime = readTimeNum;

  return {
    id: data.slug,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: content,
    coverImage: data.featuredImage || 'https://images.unsplash.com/photo-1461896834934-ffe607ba8211?w=800&h=400&fit=crop',
    publishedAt: new Date(data.date).toISOString(),
    authorId,
    category,
    tags: data.tags || [],
    readTime,
    readingTime,
    wordCount,
    featured: data.featured || false,
  } as Post;
}

export function getFeaturedPosts(limit: number = 4): Post[] {
  return getAllPosts()
    .filter((post) => post.featured)
    .slice(0, limit);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter((post) => post.category.slug === categorySlug);
}
