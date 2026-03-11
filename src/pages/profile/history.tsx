import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import ProfileLayout from '@/components/Profile/ProfileLayout';
import ReadingHistory from '@/components/Profile/ReadingHistory';
import { User } from '@/types';

interface HistoryProps {
  user: User;
  readingHistory: any[];
  timeFilters: string[];
}

export default function History({ user, readingHistory, timeFilters }: HistoryProps) {
  return (
    <ProfileLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reading History</h1>
          <p className="text-gray-600 mt-2">Articles you've read and your reading progress.</p>
        </div>

        <ReadingHistory history={readingHistory} timeFilters={timeFilters} />
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

  const mockReadingHistory = [
    {
      id: '1',
      title: 'The Future of Artificial Intelligence in Healthcare',
      slug: 'ai-healthcare-future',
      excerpt: 'Exploring how AI is revolutionizing medical diagnostics...',
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
      readAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      progress: 100, // Fully read
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
      readAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      progress: 75, // 75% read
      tags: ['Fashion', 'Sustainability', 'Environment'],
    },
    {
      id: '3',
      title: 'Remote Work Revolution: 2024 Trends',
      slug: 'remote-work-2024-trends',
      excerpt: 'The latest developments in remote work culture...',
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
      readAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      progress: 100,
      tags: ['Remote Work', 'Productivity', 'Business'],
    },
    {
      id: '4',
      title: 'Quantum Computing Breakthroughs',
      slug: 'quantum-computing-breakthroughs',
      excerpt: 'Recent advances in quantum technology...',
      coverImage: '/images/posts/quantum.jpg',
      author: {
        name: 'Dr. Alex Kumar',
        slug: 'alex-kumar',
        image: '/images/authors/alex.jpg',
      },
      category: {
        name: 'Science',
        slug: 'science',
      },
      readTime: 12,
      readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      progress: 60,
      tags: ['Quantum', 'Science', 'Technology'],
    },
  ];

  const timeFilters = ['All Time', 'Today', 'This Week', 'This Month', 'Last 3 Months'];

  return {
    props: {
      user: mockUser,
      readingHistory: mockReadingHistory,
      timeFilters,
    },
  };
};