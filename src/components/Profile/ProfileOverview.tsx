import { BookOpen, Heart, Bookmark, Users, Calendar, Clock } from 'lucide-react';
import { User } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface Stats {
  totalArticlesRead: number;
  totalClapsGiven: number;
  totalBookmarks: number;
  totalFollowing: number;
  readingStreak: number;
  avgReadingTime: number;
}

interface ProfileOverviewProps {
  user: User;
  stats: Stats;
}

export default function ProfileOverview({ user, stats }: ProfileOverviewProps) {
  const metrics = [
    {
      name: 'Articles Read',
      value: stats.totalArticlesRead.toLocaleString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Claps Given',
      value: stats.totalClapsGiven.toLocaleString(),
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      name: 'Saved Articles',
      value: stats.totalBookmarks.toLocaleString(),
      icon: Bookmark,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Following',
      value: stats.totalFollowing.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-6">
          <img
            src={user.image || '/images/authors/default.jpg'}
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600 mt-1">{user.bio || 'Passionate reader and content enthusiast'}</p>

            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Joined {formatDistanceToNow(new Date(user.joinedAt || Date.now()), { addSuffix: true })}
              </div>
              {user.location && (
                <div className="flex items-center">
                  <span>{user.location}</span>
                </div>
              )}
            </div>

            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block"
              >
                {user.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Streak & Avg Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reading Streak</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.readingStreak} days</p>
              <p className="text-xs text-gray-500 mt-1">Keep it up! 🔥</p>
            </div>
            <div className="p-2 rounded-lg bg-orange-50">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Reading Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgReadingTime} min</p>
              <p className="text-xs text-gray-500 mt-1">Per article</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}