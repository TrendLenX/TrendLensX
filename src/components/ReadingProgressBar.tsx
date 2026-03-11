import { useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  target?: Element | null;
}

export default function ReadingProgressBar({ target }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = target || document.documentElement;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = element.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [target]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}