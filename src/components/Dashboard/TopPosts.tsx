import Link from 'next/link';
import Image from 'next/image';
import { Eye, Heart, MessageCircle, Bookmark, TrendingUp } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  views: number;
  engagement: number;
  _count: {
    clapRecords: number;
    bookmarks: number;
    comments: number;
  };
}

interface TopPostsProps {
  posts: Post[];
}

export default function TopPosts({ posts }: TopPostsProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
        <p className="text-gray-500">No posts to display yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>

      <div className="space-y-4">
        {posts.slice(0, 5).map((post, index) => (
          <div key={post.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`/post/${post.slug}`}
                className="block"
              >
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                  {post.title}
                </h4>
              </Link>

              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {post.views.toLocaleString()}
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

              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600 font-medium">
                  {post.engagement} engagement points
                </span>
              </div>
            </div>

            {post.coverImage && (
              <div className="flex-shrink-0">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={60}
                  height={40}
                  className="rounded object-cover"
                />
              </div>
            )}
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