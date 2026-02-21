import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-20 md:py-28">
      <div className="container-custom">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-accent-400" />
            <span className="text-accent-400 font-medium">Trending Now</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Lens to{' '}
            <span className="gradient-text">Trending Topics</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {SITE_CONFIG.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/category/technology" className="btn-primary">
              Explore Articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
