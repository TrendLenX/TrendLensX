import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Github, Globe } from 'lucide-react';
import { Author } from '@/types/author';

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const socialIcons = author.social || {
    twitter: '',
    linkedin: '',
    github: '',
    website: ''
  };

  const SocialIcon = ({
    href,
    children,
    label
  }: {
    href: string;
    children: React.ReactNode;
    label: string;
  }) => (
    <a
      href={href}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      title={label}
    >
      {children}
    </a>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <Link href={`/author/${author.slug}`}>
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={author.image}
            alt={author.name}
            fill
            className="object-cover rounded-full"
          />
        </div>
      </Link>
      <div className="flex-1 text-center sm:text-left">
        <Link href={`/author/${author.slug}`}>
          <h4 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
            {author.name}
          </h4>
        </Link>
        <p className="text-primary-600 font-semibold text-sm mb-2">{author.role}</p>
        {typeof author.postCount === 'number' && (
          <p className="text-gray-500 text-sm mb-2">{author.postCount} articles</p>
        )}
        <p className="text-gray-600 text-sm mb-4">{author.bio}</p>
        <div className="flex justify-center sm:justify-start gap-2">
          {socialIcons.twitter && (
            <SocialIcon href={socialIcons.twitter} label="Twitter">
              <Twitter className="w-5 h-5" />
            </SocialIcon>
          )}
          {socialIcons.linkedin && (
            <SocialIcon href={socialIcons.linkedin} label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </SocialIcon>
          )}
          {socialIcons.github && (
            <SocialIcon href={socialIcons.github} label="GitHub">
              <Github className="w-5 h-5" />
            </SocialIcon>
          )}
          {socialIcons.website && (
            <SocialIcon href={socialIcons.website} label="Website">
              <Globe className="w-5 h-5" />
            </SocialIcon>
          )}
        </div>
      </div>
    </div>
  );
}