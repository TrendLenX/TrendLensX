import Link from 'next/link';
import Image from 'next/image';
import { Eye, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  views: number;
  clapCount: number;
  category: {
    name: string;
    slug: string;
  };
  _count: {
    clapRecords: number;
    bookmarks: number;
    comments: number;
  };
}

interface RecentPostsProps {
  posts: Post[];
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
        <p className="text-gray-500">No posts published yet.</p>
        <Link
          href="/dashboard/write"
          className="inline-flex items-center mt-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Write your first post
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            {post.coverImage && (
              <div className="flex-shrink-0">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={80}
                  height={60}
                  className="rounded-lg object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <Link
                href={`/post/${post.slug}`}
                className="block"
              >
                <h4 className="text-sm font-medium text-gray-900 truncate hover:text-primary-600 transition-colors">
                  {post.title}
                </h4>
              </Link>

              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                {' • '}
                <Link
                  href={`/category/${post.category.slug}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {post.category.name}
                </Link>
              </p>

              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {post.views}
                </div>
                <div className="flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {post._count.clapRecords}
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {post._count.comments}
                </div>
                <div className="flex items-center">
                  <Bookmark className="w-3 h-3 mr-1" />
                  {post._count.bookmarks}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/dashboard/posts"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all posts →
        </Link>
      </div>
    </div>
  );
}