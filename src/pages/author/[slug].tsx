import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '@/components/Layout/Layout';
import PostCard from '@/components/Cards/PostCard';
import { authors } from '@/data/authors';
import { getAllPosts } from '@/lib/mdxPosts';
import { Author, Post } from '@/types';
import Image from 'next/image';

interface AuthorPageProps {
  author: Author;
  posts: Post[];
}

export default function AuthorPage({ author, posts }: AuthorPageProps) {
  return (
    <Layout>
      <Head>
        <title>{author.name} - Author Profile | TrendLensX</title>
        <meta name="description" content={author.bio} />
      </Head>

      <div className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border p-8 mb-12 flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
                <Image
                  src={author.image}
                  alt={author.name}
                  width={400}
                  height={400}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
                <p className="text-primary-600 font-medium mb-4">{author.role}</p>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {author.bio}
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  {author.twitter && (
                    <a href={author.twitter} className="text-gray-400 hover:text-primary-600 transition-colors">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    </a>
                  )}
                  {author.linkedin && (
                    <a href={author.linkedin} className="text-gray-400 hover:text-primary-600 transition-colors">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-8">Articles by {author.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = authors.map((author) => ({
    params: { slug: author.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const author = authors.find((a) => a.slug === slug);

  if (!author) {
    return { notFound: true };
  }

  const posts = getAllPosts().filter((p) => p.authorId === author.id);

  return {
    props: {
      author,
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};