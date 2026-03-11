import Link from 'next/link';
import { BookOpen, Heart, Bookmark, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'read' | 'clap' | 'bookmark' | 'comment';
  title: string;
  timestamp: string;
  postSlug: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-500">No recent activity to show.</p>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'read':
        return BookOpen;
      case 'clap':
        return Heart;
      case 'bookmark':
        return Bookmark;
      case 'comment':
        return MessageCircle;
      default:
        return BookOpen;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'read':
        return 'text-blue-600 bg-blue-50';
      case 'clap':
        return 'text-red-600 bg-red-50';
      case 'bookmark':
        return 'text-yellow-600 bg-yellow-50';
      case 'comment':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'read':
        return 'Read';
      case 'clap':
        return 'Clapped';
      case 'bookmark':
        return 'Saved';
      case 'comment':
        return 'Commented on';
      default:
        return 'Interacted with';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          const actionText = getActivityText(activity.type);

          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{actionText}</span>
                  {' '}
                  <Link
                    href={`/post/${activity.postSlug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {activity.title}
                  </Link>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Link
          href="/profile/activity"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all activity →
        </Link>
      </div>
    </div>
  );
}