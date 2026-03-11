import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Tag, X, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  author: {
    name: string;
    slug: string;
    image?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  readTime: number;
  savedAt: string;
  tags: string[];
}

interface SavedArticlesProps {
  articles: Article[];
  categories: string[];
}

export default function SavedArticles({ articles, categories }: SavedArticlesProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category.name === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleRemoveBookmark = (articleId: string) => {
    // In a real app, this would call an API to remove the bookmark
    console.log('Remove bookmark:', articleId);
  };

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved articles yet</h3>
        <p className="text-gray-600 mb-6">Start saving articles you want to read later by clicking the bookmark icon.</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Discover Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search saved articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex space-x-4">
              {article.coverImage && (
                <div className="flex-shrink-0">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    width={120}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/post/${article.slug}`}
                      className="block"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mt-2 line-clamp-2">{article.excerpt}</p>

                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <Link
                          href={`/author/${article.author.slug}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {article.author.name}
                        </Link>
                      </div>

                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime} min read
                      </div>

                      <span>Saved {formatDistanceToNow(new Date(article.savedAt), { addSuffix: true })}</span>
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      <Link
                        href={`/category/${article.category.slug}`}
                        className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full hover:bg-primary-200 transition-colors"
                      >
                        {article.category.name}
                      </Link>

                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveBookmark(article.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}