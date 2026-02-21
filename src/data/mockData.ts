import { Post, Category } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'News', slug: 'news', description: 'Breaking news and current events', color: 'bg-red-500' },
  { id: '2', name: 'Finance', slug: 'finance', description: 'Financial markets and economy', color: 'bg-green-500' },
  { id: '3', name: 'Technology', slug: 'technology', description: 'Tech innovations and trends', color: 'bg-blue-500' },
  { id: '4', name: 'Education', slug: 'education', description: 'Learning and academic resources', color: 'bg-purple-500' },
  { id: '5', name: 'Sports', slug: 'sports', description: 'Sports news and updates', color: 'bg-orange-500' },
  { id: '6', name: 'Lifestyle', slug: 'lifestyle', description: 'Health, wellness, and living', color: 'bg-pink-500' },
  { id: '7', name: 'Jobs', slug: 'jobs', description: 'Career opportunities and advice', color: 'bg-cyan-500' },
  { id: '8', name: 'Scholarships', slug: 'scholarships', description: 'Educational funding opportunities', color: 'bg-yellow-500' },
];

const getCategory = (slug: string): Category => {
  return categories.find(c => c.slug === slug) || categories[0];
};

export const posts: Post[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in 2024 and Beyond',
    slug: 'future-of-artificial-intelligence-2024',
    excerpt: 'Explore how AI is transforming industries and what to expect in the coming years.',
    content: `<p>Artificial Intelligence continues to revolutionize how we live and work. From healthcare diagnostics to autonomous vehicles, AI's impact is undeniable.</p>
    <h2>Key Trends in AI</h2>
    <p>The landscape of AI is evolving rapidly with several key trends emerging:</p>
    <ul>
      <li>Generative AI and Large Language Models</li>
      <li>AI in Healthcare and Drug Discovery</li>
      <li>Autonomous Systems and Robotics</li>
      <li>Edge AI and IoT Integration</li>
    </ul>
    <p>As we look ahead, the integration of AI into everyday applications will only accelerate, bringing both opportunities and challenges that society must address.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    publishedAt: '2024-01-15T10:00:00Z',
    authorId: 'sarah-johnson',
    category: getCategory('technology'),
    tags: ['AI', 'Technology', 'Innovation', 'Future'],
    readTime: 5,
    featured: true,
  },
  {
    id: '2',
    title: 'Global Markets Show Strong Recovery Signs',
    slug: 'global-markets-recovery-2024',
    excerpt: 'Financial analysts predict continued growth as economies stabilize worldwide.',
    content: `<p>Global financial markets are showing promising signs of recovery after a volatile period. Analysts are cautiously optimistic about the year ahead.</p>
    <h2>Market Highlights</h2>
    <p>Several key indicators point to sustained growth:</p>
    <ul>
      <li>Strong employment numbers across major economies</li>
      <li>Inflation rates stabilizing</li>
      <li>Consumer spending on the rise</li>
    </ul>`,
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    publishedAt: '2024-01-14T09:00:00Z',
    authorId: 'michael-chen',
    category: getCategory('finance'),
    tags: ['Finance', 'Markets', 'Economy', 'Investment'],
    readTime: 4,
    featured: true,
  },
  {
    id: '3',
    title: 'Top 10 Scholarships for International Students in 2024',
    slug: 'top-scholarships-international-students-2024',
    excerpt: 'Comprehensive guide to the best fully-funded scholarship opportunities worldwide.',
    content: `<p>Finding the right scholarship can open doors to world-class education. Here are the top opportunities for international students.</p>
    <h2>Featured Scholarships</h2>
    <ol>
      <li>Fulbright Foreign Student Program</li>
      <li>Chevening Scholarships</li>
      <li>DAAD Scholarships</li>
      <li>Erasmus Mundus Joint Master Degrees</li>
      <li>Australia Awards Scholarships</li>
    </ol>`,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
    publishedAt: '2024-01-13T11:00:00Z',
    authorId: 'emily-rodriguez',
    category: getCategory('scholarships'),
    tags: ['Scholarships', 'Education', 'Study Abroad', 'Funding'],
    readTime: 7,
    featured: false,
  },
  {
    id: '4',
    title: 'Remote Work Opportunities: Tech Jobs Hiring Now',
    slug: 'remote-work-tech-jobs-2024',
    excerpt: 'Discover the hottest remote tech positions and how to land your dream job.',
    content: `<p>The remote work revolution continues to create exciting opportunities in tech. Companies worldwide are seeking talented professionals.</p>
    <h2>In-Demand Roles</h2>
    <ul>
      <li>Full Stack Developers</li>
      <li>Data Scientists</li>
      <li>Cloud Engineers</li>
      <li>Product Managers</li>
      <li>UX/UI Designers</li>
    </ul>`,
    coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop',
    publishedAt: '2024-01-12T14:00:00Z',
    authorId: 'sarah-johnson',
    category: getCategory('jobs'),
    tags: ['Jobs', 'Remote Work', 'Tech', 'Career'],
    readTime: 5,
    featured: false,
  },
  {
    id: '5',
    title: 'Breaking: Major Climate Summit Reaches Historic Agreement',
    slug: 'climate-summit-historic-agreement',
    excerpt: 'World leaders commit to ambitious emissions targets in landmark deal.',
    content: `<p>In a historic development, world leaders have reached a groundbreaking agreement on climate action. The deal sets ambitious targets for reducing carbon emissions.</p>
    <h2>Key Commitments</h2>
    <ul>
      <li>50% reduction in emissions by 2030</li>
      <li>Net-zero targets by 2050</li>
      <li>$100 billion climate fund for developing nations</li>
    </ul>`,
    coverImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&h=400&fit=crop',
    publishedAt: '2024-01-11T08:00:00Z',
    authorId: 'michael-chen',
    category: getCategory('news'),
    tags: ['News', 'Climate', 'Environment', 'Politics'],
    readTime: 4,
    featured: true,
  },
  {
    id: '6',
    title: 'Championship Finals: What to Expect This Weekend',
    slug: 'championship-finals-preview',
    excerpt: 'Preview of the biggest matchups and predictions for the finals.',
    content: `<p>The championship finals are here, and sports fans are in for an exciting weekend. Here's everything you need to know about the upcoming matches.</p>
    <h2>Key Matchups</h2>
    <p>The competition promises intense action with top athletes competing for glory.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
    publishedAt: '2024-01-10T16:00:00Z',
    authorId: 'emily-rodriguez',
    category: getCategory('sports'),
    tags: ['Sports', 'Championship', 'Finals', 'Competition'],
    readTime: 3,
    featured: false,
  },
];

export function getPostsByCategory(slug: string): Post[] {
  return posts.filter(post => post.category.slug === slug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug);
}

export function getFeaturedPosts(): Post[] {
  return posts.filter(post => post.featured);
}

export function searchPosts(query: string): Post[] {
  const lowercaseQuery = query.toLowerCase();
  return posts.filter(post =>
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}