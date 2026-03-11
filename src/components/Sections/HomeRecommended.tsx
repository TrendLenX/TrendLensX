import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { Clock, User, Sparkles } from 'lucide-react';

interface HomeRecommendedProps {
  posts: Post[];
}

export default function HomeRecommended({ posts }: HomeRecommendedProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h2 className="section-heading">Recommended for You</h2>
          </div>
          <Link href="/discover" className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
            View All <Sparkles className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <Link href={`/post/${post.slug}`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                      Recommended
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/category/${post.category.slug}`}>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-2 hover:bg-primary-100 hover:text-primary-700 transition-colors">
                    {post.category.name}
                  </span>
                </Link>

                <Link href={`/post/${post.slug}`}>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors mb-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}