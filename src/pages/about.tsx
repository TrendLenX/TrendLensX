import Image from 'next/image';
import SEOHead from '@/components/SEO/SEOHead';
import AuthorCard from '@/components/Cards/AuthorCard';
import Newsletter from '@/components/Sections/Newsletter';
import { authors } from '@/data/authors';
import { SITE_CONFIG } from '@/lib/constants';
import { Target, Users, Zap, Globe } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { icon: Target, title: 'Accuracy', description: 'We verify every piece of information before publishing.' },
    { icon: Users, title: 'Community', description: 'Building a community of informed readers worldwide.' },
    { icon: Zap, title: 'Timeliness', description: 'Delivering breaking news and trends as they happen.' },
    { icon: Globe, title: 'Diversity', description: 'Covering topics from across the globe and all walks of life.' },
  ];

  const sortedAuthors = [...authors];

  return (
    <>
      <SEOHead
        title="About Us"
        description={`Learn about ${SITE_CONFIG.name} - your trusted source for trending topics.`}
        canonical="/about"
      />

      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About {SITE_CONFIG.name}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {SITE_CONFIG.tagline}. We are dedicated to bringing you the most relevant and 
            insightful content across multiple categories.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-heading">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At {SITE_CONFIG.name}, we believe that everyone deserves access to quality information. 
              Our mission is to provide comprehensive, accurate, and timely content that helps our 
              readers stay informed and make better decisions in their personal and professional lives.
            </p>
          </div>

          <h2 className="section-heading text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="section-heading text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {sortedAuthors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
