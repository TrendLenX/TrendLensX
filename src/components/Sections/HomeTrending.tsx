import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { Clock, User, TrendingUp } from 'lucide-react';

interface HomeTrendingProps {
  posts: Post[];
}

export default function HomeTrending({ posts }: HomeTrendingProps) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 3);

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="section-heading">Trending Now</h2>
          </div>
          <Link href="/trending" className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
            View All <TrendingUp className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main trending post */}
          <div className="lg:col-span-2">
            <Link href={`/post/${mainPost.slug}`}>
              <article className="group cursor-pointer">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                  <Image
                    src={mainPost.coverImage}
                    alt={mainPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                        Trending #1
                      </span>
                      <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                        {mainPost.category.name}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-2 group-hover:text-accent-300 transition-colors">
                      {mainPost.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{mainPost.authorId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{mainPost.readingTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          </div>

          {/* Side trending posts */}
          <div className="space-y-6">
            {sidePosts.map((post, index) => (
              <Link key={post.id} href={`/post/${post.slug}`}>
                <article className="group cursor-pointer flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                        #{index + 2}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{post.authorId}</span>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}