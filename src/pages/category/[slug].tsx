import { GetStaticPaths, GetStaticProps } from 'next';
import SEOHead from '@/components/SEO/SEOHead';
import PostCard from '@/components/Cards/PostCard';
import Newsletter from '@/components/Sections/Newsletter';
import { categories } from '@/data/mockData';
import { getPostsByCategory } from '@/lib/mdxPosts';
import { Category, Post } from '@/types';
import { CATEGORIES } from '@/lib/constants';

interface CategoryPageProps {
  category: Category;
  posts: Post[];
}

export default function CategoryPage({ category, posts }: CategoryPageProps) {
  return (
    <>
      <SEOHead
        title={category.name}
        description={category.description}
        canonical={`/category/${category.slug}`}
      />

      <section className="py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${category.color} text-white text-sm font-medium mb-4`}>
            {category.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          <p className="text-xl text-gray-300 max-w-2xl">{category.description}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = CATEGORIES.map((category) => ({
    params: { slug: category.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { notFound: true };
  }

  const posts = getPostsByCategory(slug);

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
