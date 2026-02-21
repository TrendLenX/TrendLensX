import { GetStaticProps } from 'next';
import Hero from '@/components/Sections/Hero';
import Newsletter from '@/components/Sections/Newsletter';
import PostCard from '@/components/Cards/PostCard';
import CategoryCard from '@/components/Cards/CategoryCard';
import SEOHead from '@/components/SEO/SEOHead';
import { categories, getPostsByCategory } from '@/data/mockData';
import { getAllPosts, getFeaturedPosts } from '@/lib/mdxPosts';
import { SITE_CONFIG } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/types';

interface HomeProps {
  featuredPosts: Post[];
  latestPosts: Post[];
}

export default function Home({ featuredPosts, latestPosts }: HomeProps) {
  
  // Fallback gracefully if no featured posts exist
  const hasFeaturedPosts = featuredPosts.length > 0;

  return (
    <>
      <SEOHead
        title="Home"
        description={SITE_CONFIG.description}
        canonical="/"
      />
      
      <Hero />

      {hasFeaturedPosts && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-heading">Featured Stories</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <PostCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-heading">Latest Articles</h2>
            <Link href="/category/news" className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading text-center mb-12">Explore Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                postCount={getPostsByCategory(category.slug).length}
              />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const featuredPosts = getFeaturedPosts(4);
  const latestPosts = getAllPosts().slice(0, 6);

  return {
    props: {
      featuredPosts: JSON.parse(JSON.stringify(featuredPosts)),
      latestPosts: JSON.parse(JSON.stringify(latestPosts)),
    },
    revalidate: 3600, // Revalidate every hour
  };
};
