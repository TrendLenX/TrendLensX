import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Star, Clock, User } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import PostCard from '@/components/Cards/PostCard';
import { getAllPosts } from '@/lib/mdxPosts';
import { Post } from '@/types';

interface PopularPageProps {
  popularPosts: Post[];
}

export default function PopularPage({ popularPosts }: PopularPageProps) {
  return (
    <>
      <SEOHead
        title="Popular Articles"
        description="Discover the most popular articles on TrendLensX"
        canonical="/popular"
      />

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Popular Articles</h1>
              <p className="text-gray-600 mt-2">The most loved and shared articles</p>
            </div>
          </div>

          {popularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No popular articles at the moment.</p>
              <p className="text-gray-400 mt-2">Check back later for popular content.</p>
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
  // For now, sort by featured status and recency as popularity proxy
  const allPosts = getAllPosts();
  const popularPosts = allPosts
    .sort((a, b) => {
      // Featured posts first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Then by recency
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 20);

  return {
    props: {
      popularPosts: JSON.parse(JSON.stringify(popularPosts)),
    },
    revalidate: 3600, // Revalidate every hour
  };
};