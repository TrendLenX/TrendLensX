import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ViewsData {
  date: string;
  views: number;
  readComplete: number;
  avgReadTime: number;
}

interface EngagementMetrics {
  totalViews: number;
  totalClaps: number;
  totalComments: number;
  totalBookmarks: number;
  avgReadTime: number;
  readCompletionRate: number;
}

interface AnalyticsChartsProps {
  viewsOverTime: ViewsData[];
  engagementMetrics: EngagementMetrics;
}

export default function AnalyticsCharts({ viewsOverTime, engagementMetrics }: AnalyticsChartsProps) {
  // Prepare data for engagement breakdown chart
  const engagementData = [
    { name: 'Views', value: engagementMetrics.totalViews, color: '#3B82F6' },
    { name: 'Claps', value: engagementMetrics.totalClaps, color: '#EF4444' },
    { name: 'Comments', value: engagementMetrics.totalComments, color: '#10B981' },
    { name: 'Bookmarks', value: engagementMetrics.totalBookmarks, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8">
      {/* Views Over Time Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={viewsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="readComplete"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{engagementMetrics.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{engagementMetrics.totalClaps.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Claps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{engagementMetrics.totalComments.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{engagementMetrics.totalBookmarks.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Bookmarks</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">{engagementMetrics.avgReadTime} min</div>
            <div className="text-sm text-gray-600">Avg. Read Time</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-indigo-600">{engagementMetrics.readCompletionRate}%</div>
            <div className="text-sm text-gray-600">Read Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}