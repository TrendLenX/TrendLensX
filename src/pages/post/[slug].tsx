import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import SEOHead from '@/components/SEO/SEOHead';
import AuthorCard from '@/components/Cards/AuthorCard';
import ShareButtons from '@/components/Social/ShareButtons';
import CommentSection from '@/components/Comments/CommentSection';
import AdBanner from '@/components/Ads/AdBanner';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import ArticleClapButton from '@/components/ArticleClapButton';
import BookmarkButton from '@/components/BookmarkButton';
import EstimatedReadingTime from '@/components/EstimatedReadingTime';
import RelatedPosts from '@/components/RelatedPosts';
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/mdxPosts';
import { prisma } from '@/lib/prisma';
import { Post } from '@/types';
import { formatDate, getCategoryColor } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { authors } from '@/data/authors';
import { categories } from '@/data/mockData';

interface PostPageProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult;
  relatedPosts: Post[];
  authorName: string;
  authorImage: string;
}

export default function PostPage({ post, mdxSource, relatedPosts, authorName, authorImage }: PostPageProps) {
  const staticAuthor = authors.find(a => a.id === post.authorId);
  const displayName = authorName || staticAuthor?.name || 'Unknown Author';
  const displayImage = authorImage || staticAuthor?.image || '/images/branding/logo1.png';
  const postUrl = `${SITE_CONFIG.url}/post/${post.slug}`;

  const authorForCard = staticAuthor || {
    id: post.authorId,
    name: displayName,
    slug: post.authorId,
    role: 'Author',
    bio: '',
    image: displayImage,
    social: {},
  };

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        canonical={`/post/${post.slug}`}
        ogImage={post.coverImage}
        ogType="article"
        isPost={true}
        hashtags={[post.category.name, ...post.tags]}
        postData={{
          slug: post.slug,
          category: post.category.slug,
          tags: post.tags,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          author: displayName,
        }}
      />

      <article className="py-8">
        <ReadingProgressBar />
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
                    src={displayImage}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium text-gray-900">{displayName}</span>
                </div>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center">
                  <EstimatedReadingTime minutes={post.readTime} />
                </span>
              </div>

              <ShareButtons url={postUrl} title={post.title} description={post.excerpt} />

              <div className="flex items-center gap-4 mt-6">
                <ArticleClapButton postId={post.id} />
                <BookmarkButton postId={post.id} />
              </div>
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

            <div className="prose prose-xl max-w-none mb-8 leading-relaxed">
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
              <AuthorCard author={authorForCard as any} />
            </div>

            <RelatedPosts posts={relatedPosts} />

            <CommentSection postId={post.id} />
          </div>
        </div>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { serialize } = await import('next-mdx-remote/serialize');
  const slug = params?.slug as string;

  let post: Post | null = null;
  let authorName = '';
  let authorImage = '/images/branding/logo1.png';

  post = getPostBySlug(slug);

  if (!post) {
    const dbPost = await prisma.post.findUnique({
      where: { slug },
      include: { category: true, author: true },
    });

    if (dbPost) {
      const category = categories.find(c => c.slug === dbPost.category.slug) || {
        id: dbPost.categoryId,
        name: dbPost.category.name,
        slug: dbPost.category.slug,
        description: dbPost.category.description || '',
        color: dbPost.category.color || 'bg-gray-500',
      };

      const wordCount = dbPost.wordCount || 0;
      const readTimeNum = dbPost.readTime || Math.max(1, Math.ceil(wordCount / 200));

      post = {
        id: dbPost.id,
        title: dbPost.title,
        slug: dbPost.slug,
        excerpt: dbPost.excerpt,
        content: dbPost.content || '',
        coverImage: dbPost.coverImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
        publishedAt: dbPost.publishedAt.toISOString(),
        updatedAt: dbPost.updatedAt?.toISOString(),
        authorId: dbPost.authorId,
        category,
        tags: [],
        readTime: readTimeNum,
        readingTime: `${readTimeNum} min read`,
        wordCount,
        featured: dbPost.featured,
      } as Post;

      if (dbPost.author) {
        authorName = dbPost.author.name;
        authorImage = dbPost.author.image || '/images/branding/logo1.png';
      }
    }
  }

  if (!post) {
    return { notFound: true };
  }

  const mdxSource = await serialize(post.content || '');
  const relatedPosts = getRelatedPosts(post.id, post.tags, post.category.slug);

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      mdxSource,
      relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
      authorName,
      authorImage,
    },
  };
};
