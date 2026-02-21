import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Twitter, Linkedin, Github, Globe } from 'lucide-react';
import { Post } from '@/types';
import { formatDate, getCategoryColor } from '@/lib/utils';
import { authors } from '@/data/authors';

interface PostCardProps {
  post: Post;
  featured ? : boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const author = authors.find(a => a.id === post.authorId);
  if (!author) return null;
  
  const SocialIcon = ({
    href,
    children,
    label
  }: { href: string;children: React.ReactNode;label: string }) => (
    <a
      href={href}
      className="relative text-gray-400 hover:text-primary-600 transition-colors group"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {label}
      </span>
    </a>
  );
  
  const socialIcons = author.social || {
    twitter: "https://twitter.com/fake",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    website: "https://example.com"
  };
  
  if (featured) {
    return (
      <article className="card group">
        <Link href={`/post/${post.slug}`}>
          <div className="relative h-64 md:h-80 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className={`category-badge ${getCategoryColor(post.category.slug)} mb-3`}>
                {post.category.name}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary-300 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-200 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{author.name}</span>
                  {socialIcons.twitter && <SocialIcon href={socialIcons.twitter} label="Twitter"><Twitter className="w-4 h-4" /></SocialIcon>}
                  {socialIcons.linkedin && <SocialIcon href={socialIcons.linkedin} label="LinkedIn"><Linkedin className="w-4 h-4" /></SocialIcon>}
                  {socialIcons.github && <SocialIcon href={socialIcons.github} label="GitHub"><Github className="w-4 h-4" /></SocialIcon>}
                  {socialIcons.website && <SocialIcon href={socialIcons.website} label="Website"><Globe className="w-4 h-4" /></SocialIcon>}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </Link>
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
            {socialIcons.twitter && <SocialIcon href={socialIcons.twitter} label="Twitter"><Twitter className="w-4 h-4" /></SocialIcon>}
            {socialIcons.linkedin && <SocialIcon href={socialIcons.linkedin} label="LinkedIn"><Linkedin className="w-4 h-4" /></SocialIcon>}
            {socialIcons.github && <SocialIcon href={socialIcons.github} label="GitHub"><Github className="w-4 h-4" /></SocialIcon>}
            {socialIcons.website && <SocialIcon href={socialIcons.website} label="Website"><Globe className="w-4 h-4" /></SocialIcon>}
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