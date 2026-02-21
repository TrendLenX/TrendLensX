import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import SEOHead from '@/components/SEO/SEOHead';
import AuthorCard from '@/components/Cards/AuthorCard';
import ShareButtons from '@/components/Social/ShareButtons';
import CommentSection from '@/components/Comments/CommentSection';
import AdBanner from '@/components/Ads/AdBanner';
import { getAllPosts, getPostBySlug } from '@/lib/mdxPosts';
import { Post } from '@/types';
import { formatDate, getCategoryColor } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { authors } from '@/data/authors';

interface PostPageProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult;
}

export default function PostPage({ post, mdxSource }: PostPageProps) {
  const author = authors.find(a => a.id === post.authorId);
  const postUrl = `${SITE_CONFIG.url}/post/${post.slug}`;

  if (!author) return null;

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        canonical={`/post/${post.slug}`}
        ogImage={post.coverImage}
        ogType="article"
      />

      <article className="py-8">
        <div className="container-custom">
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {post.category.name}
          </Link>

          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <span className={`category-badge ${getCategoryColor(post.category.slug)} mb-4`}>
                {post.category.name}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-2">
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium text-gray-900">{author.name}</span>
                </div>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readingTime}
                </span>
              </div>

              <ShareButtons url={postUrl} title={post.title} description={post.excerpt} />
            </header>

            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <AdBanner slot="post-top" className="mb-8" />

            <div className="prose prose-lg max-w-none mb-8">
              <MDXRemote {...mdxSource} />
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="border-t pt-8 mb-8">
              <h3 className="text-lg font-semibold mb-4">About the Author</h3>
              <AuthorCard author={author} />
            </div>

            <CommentSection postId={post.id} />
          </div>
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { serialize } = await import('next-mdx-remote/serialize');
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  const mdxSource = await serialize(post.content);

  return {
    props: { 
      post: JSON.parse(JSON.stringify(post)), 
      mdxSource 
    },
  };
};
