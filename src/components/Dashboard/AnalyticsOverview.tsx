import {
  Eye,
  Heart,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface Stats {
  totalPosts: number;
  totalViews: number;
  totalClaps: number;
  totalFollowers: number;
  avgReadTime: number;
  recentViews: number;
  recentClaps: number;
}

interface AnalyticsOverviewProps {
  stats: Stats;
}

type ChangeType = 'positive' | 'negative' | 'neutral';

interface MetricItem {
  name: string;
  value: string;
  icon: any;
  color: string;
  bgColor: string;
  change: number;
  changeType: ChangeType;
}

export default function AnalyticsOverview({ stats }: AnalyticsOverviewProps) {
  const metrics: MetricItem[] = [
    {
      name: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: stats.recentViews,
      changeType: 'positive' as ChangeType,
    },
    {
      name: 'Total Claps',
      value: stats.totalClaps.toLocaleString(),
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: stats.recentClaps,
      changeType: 'positive' as ChangeType,
    },
    {
      name: 'Followers',
      value: stats.totalFollowers.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: 0, // We'll calculate this later
      changeType: 'neutral' as ChangeType,
    },
    {
      name: 'Avg. Read Time',
      value: `${stats.avgReadTime} min`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 0,
      changeType: 'neutral' as ChangeType,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
          </div>

          {metric.change !== 0 && (
            <div className="flex items-center mt-4">
              {metric.changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              ) : metric.changeType === 'negative' ? (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              ) : (
                <Minus className="w-4 h-4 text-gray-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' :
                metric.changeType === 'negative' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change} this month
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}