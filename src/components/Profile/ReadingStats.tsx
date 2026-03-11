import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface ReadingStat {
  day: string;
  articles: number;
  minutes: number;
}

interface ReadingStatsProps {
  stats: ReadingStat[];
}

export default function ReadingStats({ stats }: ReadingStatsProps) {
  const totalArticles = stats.reduce((sum, stat) => sum + stat.articles, 0);
  const totalMinutes = stats.reduce((sum, stat) => sum + stat.minutes, 0);
  const avgArticlesPerDay = Math.round(totalArticles / stats.length);
  const avgMinutesPerDay = Math.round(totalMinutes / stats.length);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Stats</h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{avgArticlesPerDay}</div>
          <div className="text-sm text-blue-700">Articles/day</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{avgMinutesPerDay}</div>
          <div className="text-sm text-green-700">Minutes/day</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">This Week</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: '#374151', fontWeight: '500' }}
              />
              <Bar
                dataKey="articles"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="articles"
              />
              <Bar
                dataKey="minutes"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                name="minutes"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Totals */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-gray-900">{totalArticles}</div>
          <div className="text-gray-600">Articles this week</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900">{totalMinutes}</div>
          <div className="text-gray-600">Minutes this week</div>
        </div>
      </div>
    </div>
  );
}