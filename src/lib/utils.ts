import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function getCategoryColor(slug: string): string {
  const colors: Record<string, string> = {
    news: 'bg-red-100 text-red-800',
    finance: 'bg-green-100 text-green-800',
    technology: 'bg-blue-100 text-blue-800',
    education: 'bg-purple-100 text-purple-800',
    sports: 'bg-orange-100 text-orange-800',
    lifestyle: 'bg-pink-100 text-pink-800',
    jobs: 'bg-cyan-100 text-cyan-800',
    scholarships: 'bg-yellow-100 text-yellow-800',
  };
  return colors[slug] || 'bg-gray-100 text-gray-800';
}
