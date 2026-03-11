import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';

interface FollowButtonProps {
  authorId: string;
  initialFollowerCount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

export default function FollowButton({
  authorId,
  initialFollowerCount = 0,
  size = 'md',
  variant = 'default'
}: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is following this author
  useEffect(() => {
    if (session?.user?.id) {
      checkFollowStatus();
    } else {
      setIsChecking(false);
    }
  }, [session, authorId]);

  const checkFollowStatus = async () => {
    try {
      const res = await fetch(`/api/follow/status?authorId=${authorId}`);
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        setFollowerCount(data.followerCount);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleFollow = async () => {
    if (!session?.user?.id) {
      // Redirect to sign in or show modal
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isFollowing ? '/api/unfollow' : '/api/follow';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorId }),
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
        setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
      } else {
        const error = await res.json();
        console.error('Follow error:', error.message);
      }
    } catch (error) {
      console.error('Follow error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`
          ${size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2'}
          ${variant === 'outline'
            ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'bg-primary-600 text-white hover:bg-primary-700'
          }
          rounded-full font-medium transition-colors flex items-center gap-2 disabled:opacity-50
        `}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    );
  }

  if (!session?.user?.id) {
    return (
      <button
        onClick={() => {/* Handle sign in */}}
        className={`
          ${size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2'}
          ${variant === 'outline'
            ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'bg-primary-600 text-white hover:bg-primary-700'
          }
          rounded-full font-medium transition-colors flex items-center gap-2
        `}
      >
        <UserPlus className="w-4 h-4" />
        Follow
      </button>
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`
        ${size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2'}
        ${variant === 'outline'
          ? isFollowing
            ? 'border border-red-300 text-red-700 hover:bg-red-50'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          : isFollowing
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }
        rounded-full font-medium transition-colors flex items-center gap-2 disabled:opacity-50
      `}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
      {followerCount > 0 && (
        <span className="text-xs opacity-75">
          ({followerCount})
        </span>
      )}
    </button>
  );
}