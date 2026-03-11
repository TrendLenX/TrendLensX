import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import PostCard from '@/components/Cards/PostCard';
import { categories } from '@/data/mockData';
import { authors } from '@/data/authors';
import { Post } from '@/types';

interface SearchFilters {
  category?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'relevance' | 'date' | 'popularity';
}

interface SearchResult {
  posts: Post[];
  total: number;
  query: string;
  filters: SearchFilters;
}

interface SearchFilters {
  category?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'relevance' | 'date' | 'popularity';
}

export default function SearchPage() {
  const router = useRouter();
  const { q, category, author, dateFrom, dateTo, sortBy } = router.query;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    author: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'relevance',
  });

  useEffect(() => {
    if (q && typeof q === 'string') {
      setQuery(q);
      performSearch(q, {
        category: typeof category === 'string' ? category : undefined,
        author: typeof author === 'string' ? author : undefined,
        dateFrom: typeof dateFrom === 'string' ? dateFrom : undefined,
        dateTo: typeof dateTo === 'string' ? dateTo : undefined,
        sortBy: (typeof sortBy === 'string' && ['relevance', 'date', 'popularity'].includes(sortBy))
          ? sortBy as 'relevance' | 'date' | 'popularity'
          : 'relevance',
      });
    }
  }, [q, category, author, dateFrom, dateTo, sortBy]);

  useEffect(() => {
    if (query.length > 1) {
      // For now, disable suggestions to avoid client-side search
      // getSearchSuggestions could be moved to API if needed
      setSuggestions([]);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const performSearch = async (searchQuery: string, searchFilters: SearchFilters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (searchFilters.category) params.set('category', searchFilters.category);
      if (searchFilters.author) params.set('author', searchFilters.author);
      if (searchFilters.dateFrom) params.set('dateFrom', searchFilters.dateFrom);
      if (searchFilters.dateTo) params.set('dateTo', searchFilters.dateTo);
      if (searchFilters.sortBy !== 'relevance') params.set('sortBy', searchFilters.sortBy);

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data: SearchResult = await res.json();
        setResults(data.posts);
        setTotalResults(data.total);
        setFilters(searchFilters);
      } else {
        console.error('Search failed');
        setResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set('q', query);
      if (filters.category) params.set('category', filters.category);
      if (filters.author) params.set('author', filters.author);
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      if (filters.sortBy !== 'relevance') params.set('sortBy', filters.sortBy);

      router.push(`/search?${params.toString()}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    // Don't perform search here, let user submit
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      author: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'relevance',
    });
  };

  return (
    <>
      <SEOHead
        title="Search"
        description="Search articles on TrendLensX"
        canonical="/search"
        noIndex
      />

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Search Articles</h1>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for topics, keywords, or categories..."
                className="w-full px-6 py-4 pl-14 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-2"
              >
                Search
              </button>
            </div>

            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-w-4xl">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Filters toggle */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(filters.category || filters.author || filters.dateFrom || filters.dateTo) && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <select
                    value={filters.author}
                    onChange={(e) => updateFilter('author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Authors</option>
                    {authors.map((auth) => (
                      <option key={auth.id} value={auth.id}>
                        {auth.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => updateFilter('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => updateFilter('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {q && (
            <div className="mb-8 text-center">
              {isLoading ? (
                <p className="text-gray-600">Searching...</p>
              ) : (
                <p className="text-gray-600">
                  {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{q}&quot;
                  {totalResults > results.length && ` (showing ${results.length})`}
                </p>
              )}
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : q && !isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your search.</p>
              <p className="text-gray-400 mt-2">Try different keywords or adjust your filters.</p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
