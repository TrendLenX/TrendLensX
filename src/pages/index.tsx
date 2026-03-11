import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Hero from '@/components/Sections/Hero';
import Newsletter from '@/components/Sections/Newsletter';
import HomeTrending from '@/components/Sections/HomeTrending';
import HomeRecommended from '@/components/Sections/HomeRecommended';
import HomeLatest from '@/components/Sections/HomeLatest';
import PostCard from '@/components/Cards/PostCard';
import CategoryCard from '@/components/Cards/CategoryCard';
import SEOHead from '@/components/SEO/SEOHead';
import { categories } from '@/data/mockData';
import { getAllPosts, getFeaturedPosts } from '@/lib/mdxPosts';
import { getRecommendedPosts, getTrendingPosts } from '@/lib/recommendPosts';
import { SITE_CONFIG } from '@/lib/constants';
import { Post } from '@/types';

interface HomeProps {
  featuredPosts: Post[];
  trendingPosts: Post[];
  recommendedPosts: Post[];
  latestPosts: Post[];
}

export default function Home({
  featuredPosts,
  trendingPosts,
  recommendedPosts,
  latestPosts
}: HomeProps) {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadCounts() {
      try {
        const res = await fetch('/api/category-post-counts');
        if (!res.ok) return;
        const data = (await res.json()) as Record<string, number>;
        setCategoryCounts(data);
      } catch {
        // ignore network errors; counts will default to 0
      }
    }

    loadCounts();
  }, []);

  // Fallback gracefully if no featured posts exist
  const hasFeaturedPosts = featuredPosts.length > 0;

  return (
    <>
      <SEOHead
        title="Home"
        description={SITE_CONFIG.description}
        canonical="/"
        ogImage={SITE_CONFIG.logo}
        ogType="website"
      />
      
      <Hero />

      <HomeTrending posts={trendingPosts} />

      <HomeRecommended posts={recommendedPosts} />

      <HomeLatest posts={latestPosts} />

      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-heading">Editor's Picks</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <PostCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading text-center mb-12">Explore Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                postCount={categoryCounts[category.slug] ?? 0}
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
  const trendingPosts = getTrendingPosts(6);
  const recommendedPosts = getRecommendedPosts({ limit: 6 });
  const latestPosts = getAllPosts().slice(0, 8);

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
