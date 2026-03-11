import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Calendar, Filter, RotateCcw } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface HistoryItem {
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
  readAt: string;
  progress: number;
  tags: string[];
}

interface ReadingHistoryProps {
  history: HistoryItem[];
  timeFilters: string[];
}

export default function ReadingHistory({ history, timeFilters }: ReadingHistoryProps) {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All Time');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // For demo purposes, we'll show all items regardless of time filter
    return matchesSearch;
  });

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressText = (progress: number) => {
    if (progress === 100) return 'Completed';
    return `${progress}% read`;
  };

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reading history yet</h3>
        <p className="text-gray-600 mb-6">Start reading articles to build your reading history.</p>
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
              placeholder="Search reading history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Time Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {timeFilters.map(filter => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex space-x-4">
              {item.coverImage && (
                <div className="flex-shrink-0">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
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
                      href={`/post/${item.slug}`}
                      className="block"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mt-2 line-clamp-2">{item.excerpt}</p>

                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <Link
                          href={`/author/${item.author.slug}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {item.author.name}
                        </Link>
                      </div>

                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.readTime} min read
                      </div>

                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Read {formatDistanceToNow(new Date(item.readAt), { addSuffix: true })}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>{getProgressText(item.progress)}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.progress)}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      <Link
                        href={`/category/${item.category.slug}`}
                        className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full hover:bg-primary-200 transition-colors"
                      >
                        {item.category.name}
                      </Link>

                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-end space-y-2">
                    <Link
                      href={`/post/${item.slug}`}
                      className="inline-flex items-center px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Continue Reading
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search or time filter criteria.</p>
        </div>
      )}
    </div>
  );
}