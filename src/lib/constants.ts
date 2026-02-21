export const SITE_CONFIG = {
  name: 'TrendLensX',
  tagline: 'Your Lens to Trending Topics',
  description: 'Discover the latest trends in News, Finance, Technology, Education, Sports, Lifestyle, Jobs, and Scholarships.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://trendlensx.com',
  logo: '/images/branding/logo1.png',
  favicon: '/favicon.ico',
  ogImage: '/images/branding/logo1.png',
  social: {
    twitter: 'https://twitter.com/trendlensx',
    facebook: 'https://facebook.com/trendlensx',
    linkedin: 'https://linkedin.com/company/trendlensx',
    instagram: 'https://instagram.com/trendlensx',
  },
  contact: {
    email: 'hello@trendlensx.com',
    phone: '+1 (555) 123-4567',
    address: '123 Trend Street, Innovation City, IC 12345',
  },
};

export const CATEGORIES = [
  { id: '1', name: 'News', slug: 'news', description: 'Breaking news and current events', color: 'bg-red-500' },
  { id: '2', name: 'Finance', slug: 'finance', description: 'Financial markets and economy', color: 'bg-green-500' },
  { id: '3', name: 'Technology', slug: 'technology', description: 'Tech innovations and trends', color: 'bg-blue-500' },
  { id: '4', name: 'Education', slug: 'education', description: 'Learning and academic resources', color: 'bg-purple-500' },
  { id: '5', name: 'Sports', slug: 'sports', description: 'Sports news and updates', color: 'bg-orange-500' },
  { id: '6', name: 'Lifestyle', slug: 'lifestyle', description: 'Health, wellness, and living', color: 'bg-pink-500' },
  { id: '7', name: 'Jobs', slug: 'jobs', description: 'Career opportunities and advice', color: 'bg-cyan-500' },
  { id: '8', name: 'Scholarships', slug: 'scholarships', description: 'Educational funding opportunities', color: 'bg-yellow-500' },
];

export const NAVIGATION = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/category/news' },
    { name: 'Finance', href: '/category/finance' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Education', href: '/category/education' },
    { name: 'More', href: '#', submenu: [
      { name: 'Sports', href: '/category/sports' },
      { name: 'Lifestyle', href: '/category/lifestyle' },
      { name: 'Jobs', href: '/category/jobs' },
      { name: 'Scholarships', href: '/category/scholarships' },
    ]},
  ],
  footer: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};
