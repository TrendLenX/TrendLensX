import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { Clock, User } from 'lucide-react';

interface RelatedPostsProps {
  posts: Post[];
  title?: string;
}

export default function RelatedPosts({
  posts,
  title = "Related Articles"
}: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="space-y-4">
        {posts.slice(0, 3).map((post) => (
          <article key={post.id} className="flex gap-3 group">
            <Link href={`/post/${post.slug}`} className="flex-shrink-0">
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="64px"
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/post/${post.slug}`}>
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h4>
              </Link>

              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{post.authorId}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length > 3 && (
        <div className="mt-4 text-center">
          <Link
            href="/discover"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View more articles →
          </Link>
        </div>
      )}
    </section>
  );
}