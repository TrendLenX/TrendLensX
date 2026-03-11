import { GetStaticProps } from 'next';
import Link from 'next/link';
import { TrendingUp, Clock, User } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import PostCard from '@/components/Cards/PostCard';
import { getTrendingPosts } from '@/lib/recommendPosts';
import { Post } from '@/types';

interface TrendingPageProps {
  trendingPosts: Post[];
}

export default function TrendingPage({ trendingPosts }: TrendingPageProps) {
  return (
    <>
      <SEOHead
        title="Trending Articles"
        description="Discover the most trending articles on TrendLensX"
        canonical="/trending"
      />

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Trending Now</h1>
              <p className="text-gray-600 mt-2">The most popular and trending articles</p>
            </div>
          </div>

          {trendingPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPosts.map((post, index) => (
                <div key={post.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 z-10 bg-primary-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      #{index + 1}
                    </div>
                  )}
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No trending articles at the moment.</p>
              <p className="text-gray-400 mt-2">Check back later for the latest trends.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const trendingPosts = getTrendingPosts(20);

  return {
    props: {
      trendingPosts: JSON.parse(JSON.stringify(trendingPosts)),
    },
    revalidate: 3600, // Revalidate every hour
  };
};