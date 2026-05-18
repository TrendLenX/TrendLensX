import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Twitter, Linkedin, Github, Globe } from 'lucide-react';
import { Post } from '@/types';
import { formatDate, getCategoryColor } from '@/lib/utils';
import { authors } from '@/data/authors';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const author = authors.find(a => a.id === post.authorId);
  if (!author) return null;

  const socialIcons = author.social || {
    twitter: "https://twitter.com/fake",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    website: "https://example.com"
  };

  if (featured) {
    return (
      <article className="card group">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Link href={`/post/${post.slug}`} className="block h-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </Link>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
            <span className={`category-badge ${getCategoryColor(post.category.slug)} mb-3`}>
              {post.category.name}
            </span>
            <Link href={`/post/${post.slug}`} className="pointer-events-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary-300 transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-200 mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-300 pointer-events-auto">
              <span className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{author.name}</span>
              </span>
              <span className="flex items-center space-x-2">
                {socialIcons.twitter && (
                  <a href={socialIcons.twitter} target="_blank" rel="noopener noreferrer" title="Twitter" className="text-gray-300 hover:text-white">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {socialIcons.linkedin && (
                  <a href={socialIcons.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-gray-300 hover:text-white">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {socialIcons.github && (
                  <a href={socialIcons.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="text-gray-300 hover:text-white">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {socialIcons.website && (
                  <a href={socialIcons.website} target="_blank" rel="noopener noreferrer" title="Website" className="text-gray-300 hover:text-white">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card group">
      <Link href={`/post/${post.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Link href={`/category/${post.category.slug}`}>
            <span className={`category-badge ${getCategoryColor(post.category.slug)}`}>
              {post.category.name}
            </span>
          </Link>
          <span className="text-sm text-gray-500">{formatDate(post.publishedAt)}</span>
        </div>
        <Link href={`/post/${post.slug}`}>
          <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Image
              src={author.image}
              alt={author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span>{author.name}</span>
            {socialIcons.twitter && (
              <a href={socialIcons.twitter} target="_blank" rel="noopener noreferrer" title="Twitter" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {socialIcons.linkedin && (
              <a href={socialIcons.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socialIcons.github && (
              <a href={socialIcons.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
            {socialIcons.website && (
              <a href={socialIcons.website} target="_blank" rel="noopener noreferrer" title="Website" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {post.readTime} min
          </span>
        </div>
      </div>
    </article>
  );
}
