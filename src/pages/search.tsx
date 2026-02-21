import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search as SearchIcon } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import PostCard from '@/components/Cards/PostCard';
import { searchPosts } from '@/data/mockData';
import { Post } from '@/types';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);

  useEffect(() => {
    if (q && typeof q === 'string') {
      setQuery(q);
      setResults(searchPosts(q));
    }
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
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
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
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
          </form>

          {q && (
            <div className="mb-8">
              <p className="text-gray-600 text-center">
                {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{q}&quot;
              </p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : q ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your search.</p>
              <p className="text-gray-400 mt-2">Try different keywords or browse our categories.</p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
