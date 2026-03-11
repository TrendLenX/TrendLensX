import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Compass, TrendingUp, Star, Sparkles, Calendar } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import PostCard from '@/components/Cards/PostCard';
import RecommendedPosts from '@/components/Sections/RecommendedPosts';
import { getAllPosts, getFeaturedPosts } from '@/lib/mdxPosts';
import { getRecommendedPosts, getTrendingPosts } from '@/lib/recommendPosts';
import { Post } from '@/types';

interface DiscoverPageProps {
  featuredPosts: Post[];
  trendingPosts: Post[];
  recommendedPosts: Post[];
  latestPosts: Post[];
}

export default function DiscoverPage({
  featuredPosts,
  trendingPosts,
  recommendedPosts,
  latestPosts
}: DiscoverPageProps) {
  return (
    <>
      <SEOHead
        title="Discover Articles"
        description="Discover amazing articles on TrendLensX - trending, recommended, and latest content"
        canonical="/discover"
      />

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-8">
            <Compass className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Discover</h1>
              <p className="text-gray-600 mt-2">Find your next great read</p>
            </div>
          </div>

          {/* Quick navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Link
              href="/trending"
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <TrendingUp className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Trending</h3>
              <p className="text-sm text-gray-600">Hot topics right now</p>
            </Link>

            <Link
              href="/popular"
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <Star className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Popular</h3>
              <p className="text-sm text-gray-600">Most loved articles</p>
            </Link>

            <Link
              href="/search"
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <Sparkles className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Search</h3>
              <p className="text-sm text-gray-600">Find specific topics</p>
            </Link>

            <Link
              href="#latest"
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <Calendar className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Latest</h3>
              <p className="text-sm text-gray-600">Fresh content</p>
            </Link>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-primary-600" />
                Editor's Picks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Trending Posts */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                Trending Now
              </h2>
              <Link href="/trending" className="text-primary-600 hover:text-primary-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPosts.slice(0, 6).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          {/* Recommended Posts */}
          <section className="mb-12">
            <RecommendedPosts
              posts={recommendedPosts}
              title="Recommended for You"
            />
          </section>

          {/* Latest Posts */}
          <section id="latest">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary-600" />
                Latest Articles
              </h2>
              <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const featuredPosts = getFeaturedPosts(6);
  const trendingPosts = getTrendingPosts(12);
  const recommendedPosts = getRecommendedPosts({ limit: 6 });
  const latestPosts = getAllPosts().slice(0, 9);

  return {
    props: {
      featuredPosts: JSON.parse(JSON.stringify(featuredPosts)),
      trendingPosts: JSON.parse(JSON.stringify(trendingPosts)),
      recommendedPosts: JSON.parse(JSON.stringify(recommendedPosts)),
      latestPosts: JSON.parse(JSON.stringify(latestPosts)),
    },
    revalidate: 3600, // Revalidate every hour
  };
};