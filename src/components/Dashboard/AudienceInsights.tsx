import { Users, TrendingUp, Calendar } from 'lucide-react';

interface AudienceData {
  month: string;
  followers: number;
}

interface AudienceInsightsProps {
  data: AudienceData[];
}

export default function AudienceInsights({ data }: AudienceInsightsProps) {
  const totalFollowers = data.reduce((sum, item) => sum + item.followers, 0);
  const recentGrowth = data.slice(-3).reduce((sum, item) => sum + item.followers, 0);
  const previousGrowth = data.slice(-6, -3).reduce((sum, item) => sum + item.followers, 0);
  const growthRate = previousGrowth > 0 ? ((recentGrowth - previousGrowth) / previousGrowth) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Growth</h3>

      <div className="space-y-4">
        {/* Total Followers */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Total Followers</p>
              <p className="text-2xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className={`w-5 h-5 mr-3 ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <p className="text-sm font-medium text-gray-900">Growth Rate</p>
              <p className={`text-2xl font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Last 12 Months
          </h4>
          <div className="space-y-2">
            {data.slice(-6).map((item, index) => (
              <div key={item.month} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.month}</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((item.followers / Math.max(...data.map(d => d.followers))) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <span className="text-gray-900 font-medium w-8 text-right">
                    {item.followers}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a
          href="/dashboard/audience"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View detailed analytics →
        </a>
      </div>
    </div>
  );
}