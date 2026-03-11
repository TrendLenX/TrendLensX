import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import ProfileLayout from '@/components/Profile/ProfileLayout';
import SavedArticles from '@/components/Profile/SavedArticles';
import { User } from '@/types';

interface SavedProps {
  user: User;
  savedArticles: any[];
  categories: string[];
}

export default function Saved({ user, savedArticles, categories }: SavedProps) {
  return (
    <ProfileLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Articles</h1>
          <p className="text-gray-600 mt-2">Your bookmarked articles for later reading.</p>
        </div>

        <SavedArticles articles={savedArticles} categories={categories} />
      </div>
    </ProfileLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Mock data for demo purposes
  const mockUser = {
    id: 'demo-user',
    email: session.user.email,
    name: session.user.name || 'Demo User',
    image: session.user.image || '/images/authors/default.jpg',
    role: 'user',
    bio: 'Passionate reader and content enthusiast',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    joinedAt: new Date('2024-01-15').toISOString(),
  };

  const mockSavedArticles = [
    {
      id: '1',
      title: 'The Future of Artificial Intelligence in Healthcare',
      slug: 'ai-healthcare-future',
      excerpt: 'Exploring how AI is revolutionizing medical diagnostics and treatment...',
      coverImage: '/images/posts/ai-healthcare.jpg',
      author: {
        name: 'Dr. Sarah Johnson',
        slug: 'sarah-johnson',
        image: '/images/authors/sarah.jpg',
      },
      category: {
        name: 'Technology',
        slug: 'technology',
      },
      readTime: 8,
      savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      tags: ['AI', 'Healthcare', 'Innovation'],
    },
    {
      id: '2',
      title: 'Sustainable Fashion: The New Normal',
      slug: 'sustainable-fashion-normal',
      excerpt: 'How the fashion industry is embracing eco-friendly practices...',
      coverImage: '/images/posts/sustainable-fashion.jpg',
      author: {
        name: 'Emma Rodriguez',
        slug: 'emma-rodriguez',
        image: '/images/authors/emma.jpg',
      },
      category: {
        name: 'Lifestyle',
        slug: 'lifestyle',
      },
      readTime: 6,
      savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      tags: ['Fashion', 'Sustainability', 'Environment'],
    },
    {
      id: '3',
      title: 'Remote Work Revolution: 2024 Trends',
      slug: 'remote-work-2024-trends',
      excerpt: 'The latest developments in remote work culture and productivity...',
      coverImage: '/images/posts/remote-work.jpg',
      author: {
        name: 'Michael Chen',
        slug: 'michael-chen',
        image: '/images/authors/michael.jpg',
      },
      category: {
        name: 'Business',
        slug: 'business',
      },
      readTime: 10,
      savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      tags: ['Remote Work', 'Productivity', 'Business'],
    },
  ];

  const categories = ['All', 'Technology', 'Lifestyle', 'Business', 'Science', 'Politics'];

  return {
    props: {
      user: mockUser,
      savedArticles: mockSavedArticles,
      categories,
    },
  };
};