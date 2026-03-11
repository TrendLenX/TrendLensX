import { Clock } from 'lucide-react';

interface EstimatedReadingTimeProps {
  minutes: number;
  className?: string;
}

export default function EstimatedReadingTime({
  minutes,
  className = ''
}: EstimatedReadingTimeProps) {
  return (
    <div className={`flex items-center gap-1 text-sm text-gray-600 ${className}`}>
      <Clock className="w-4 h-4" />
      <span>{minutes} min read</span>
    </div>
  );
}