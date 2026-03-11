import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { Clock, User, Calendar } from 'lucide-react';

interface HomeLatestProps {
  posts: Post[];
}

export default function HomeLatest({ posts }: HomeLatestProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary-600" />
            <h2 className="section-heading">Latest Stories</h2>
          </div>
          <Link href="/category/news" className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
            View All <Calendar className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <Link href={`/post/${post.slug}`}>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </Link>

              <div className="space-y-2">
                <Link href={`/category/${post.category.slug}`}>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors">
                    {post.category.name}
                  </span>
                </Link>

                <Link href={`/post/${post.slug}`}>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 pt-2">
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
      </div>
    </section>
  );
}