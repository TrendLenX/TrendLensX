import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';

interface EngagementBreakdownProps {
  metrics: {
    totalViews: number;
    totalClaps: number;
    totalComments: number;
    totalBookmarks: number;
    avgReadTime: number;
    readCompletionRate: number;
  };
}

export default function EngagementBreakdown({ metrics }: EngagementBreakdownProps) {
  const engagementRate = metrics.totalViews > 0
    ? ((metrics.totalClaps + metrics.totalComments + metrics.totalBookmarks) / metrics.totalViews) * 100
    : 0;

  const breakdownItems = [
    {
      label: 'Claps per View',
      value: metrics.totalViews > 0 ? (metrics.totalClaps / metrics.totalViews).toFixed(2) : '0.00',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Comments per View',
      value: metrics.totalViews > 0 ? (metrics.totalComments / metrics.totalViews).toFixed(2) : '0.00',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Bookmarks per View',
      value: metrics.totalViews > 0 ? (metrics.totalBookmarks / metrics.totalViews).toFixed(2) : '0.00',
      icon: Bookmark,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Overall Engagement',
      value: `${engagementRate.toFixed(1)}%`,
      icon: Share2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Breakdown</h3>

      <div className="grid grid-cols-2 gap-4">
        {breakdownItems.map((item) => (
          <div key={item.label} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-lg ${item.bgColor} mr-3`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-sm font-medium text-gray-900">{item.label}</div>
            </div>
            <div className="text-xl font-bold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <h4 className="text-sm font-medium text-primary-900 mb-2">Reading Insights</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-primary-700">Avg. Read Time:</span>
            <span className="font-medium ml-1">{metrics.avgReadTime} min</span>
          </div>
          <div>
            <span className="text-primary-700">Completion Rate:</span>
            <span className="font-medium ml-1">{metrics.readCompletionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}