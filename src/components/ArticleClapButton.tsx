import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Heart, Loader2 } from 'lucide-react';

interface ArticleClapButtonProps {
  postId: string;
  initialClapCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ArticleClapButton({
  postId,
  initialClapCount = 0,
  size = 'md'
}: ArticleClapButtonProps) {
  const { data: session } = useSession();
  const [hasClapped, setHasClapped] = useState(false);
  const [clapCount, setClapCount] = useState(initialClapCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user has clapped
  useEffect(() => {
    if (session?.user?.id) {
      checkClapStatus();
    } else {
      setIsChecking(false);
    }
  }, [session, postId]);

  const checkClapStatus = async () => {
    try {
      const res = await fetch(`/api/clap/status?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setHasClapped(data.hasClapped);
        setClapCount(data.clapCount);
      }
    } catch (error) {
      console.error('Error checking clap status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClap = async () => {
    if (!session?.user?.id) {
      // Redirect to sign in or show modal
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/clap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (res.ok) {
        const data = await res.json();
        setHasClapped(data.clapped);
        // Re-fetch count to ensure accuracy
        await checkClapStatus();
      } else {
        const error = await res.json();
        console.error('Clap error:', error.message);
      }
    } catch (error) {
      console.error('Clap error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const buttonSize = size === 'sm' ? 'p-2' : size === 'lg' ? 'p-4' : 'p-3';

  if (isChecking) {
    return (
      <button
        disabled
        className={`${buttonSize} rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50`}
      >
        <Loader2 className={`${iconSize} animate-spin`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClap}
      disabled={isLoading}
      className={`
        ${buttonSize}
        rounded-full
        ${hasClapped
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        transition-colors flex items-center gap-2 disabled:opacity-50 group
      `}
      title={hasClapped ? 'Remove clap' : 'Clap for this article'}
    >
      {isLoading ? (
        <Loader2 className={`${iconSize} animate-spin`} />
      ) : (
        <Heart
          className={`${iconSize} ${hasClapped ? 'fill-current' : ''} group-hover:scale-110 transition-transform`}
        />
      )}
      {clapCount > 0 && (
        <span className="text-sm font-medium min-w-[1rem] text-center">
          {clapCount}
        </span>
      )}
    </button>
  );
}