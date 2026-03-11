import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bookmark, Loader2 } from 'lucide-react';

interface BookmarkButtonProps {
  postId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BookmarkButton({
  postId,
  size = 'md'
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user has bookmarked
  useEffect(() => {
    if (session?.user?.id) {
      checkBookmarkStatus();
    } else {
      setIsChecking(false);
    }
  }, [session, postId]);

  const checkBookmarkStatus = async () => {
    try {
      const res = await fetch(`/api/bookmark/status?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.isBookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleBookmark = async () => {
    if (!session?.user?.id) {
      // Redirect to sign in
      return;
    }

    setIsLoading(true);
    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const res = await fetch('/api/bookmark', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (res.ok) {
        setIsBookmarked(!isBookmarked);
      } else {
        const error = await res.json();
        console.error('Bookmark error:', error.message);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`
          ${size === 'sm' ? 'p-2' : size === 'lg' ? 'p-3' : 'p-2'}
          bg-gray-100 text-gray-500 rounded-full
        `}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </button>
    );
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={isLoading}
      className={`
        ${size === 'sm' ? 'p-2' : size === 'lg' ? 'p-3' : 'p-2'}
        rounded-full transition-all duration-200
        ${isBookmarked
          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
        disabled:opacity-50
      `}
      title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark
          className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`}
        />
      )}
    </button>
  );
}