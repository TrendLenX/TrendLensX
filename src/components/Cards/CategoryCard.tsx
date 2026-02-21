import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  postCount?: number;
}

export default function CategoryCard({ category, postCount = 0 }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="card p-6 group cursor-pointer">
        <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
          <span className="text-white font-bold text-xl">{category.name[0]}</span>
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{category.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{postCount} articles</span>
          <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
