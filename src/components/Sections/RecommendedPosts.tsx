import Link from 'next/link';
import { Post } from '@/types';
import { Clock, User } from 'lucide-react';
import Image from 'next/image';

interface RecommendedPostsProps {
  posts: Post[];
  title?: string;
  showReasons?: boolean;
}

export default function RecommendedPosts({
  posts,
  title = "Recommended for you",
  showReasons = false
}: RecommendedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <Link href={`/post/${post.slug}`}>
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </Link>
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/post/${post.slug}`}>
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                  {post.title}
                </h4>
              </Link>

              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readingTime}</span>
                </div>

                <Link
                  href={`/author/${post.authorId}`}
                  className="flex items-center gap-1 hover:text-primary-600"
                >
                  <User className="w-3 h-3" />
                  <span>{post.authorId}</span>
                </Link>

                <Link
                  href={`/category/${post.category.slug}`}
                  className="px-2 py-1 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-700"
                >
                  {post.category.name}
                </Link>
              </div>

              {showReasons && (
                <div className="mt-2">
                  <span className="text-xs text-primary-600 font-medium">
                    Recommended because: Similar category
                  </span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {posts.length >= 6 && (
        <div className="mt-4 text-center">
          <Link
            href="/discover"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View more recommendations →
          </Link>
        </div>
      )}
    </section>
  );
}