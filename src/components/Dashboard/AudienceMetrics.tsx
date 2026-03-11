import { Users, TrendingUp, TrendingDown, Globe } from 'lucide-react';

interface AudienceMetricsProps {
  metrics: {
    totalFollowers: number;
    followerGrowth: number;
    topReferrers: any[];
  };
}

export default function AudienceMetrics({ metrics }: AudienceMetricsProps) {
  const { totalFollowers, followerGrowth } = metrics;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Metrics</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Total Followers</p>
              <p className="text-2xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            {followerGrowth >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600 mr-3" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">Follower Growth</p>
              <p className={`text-2xl font-bold ${followerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {followerGrowth >= 0 ? '+' : ''}{followerGrowth}%
              </p>
              <p className="text-xs text-gray-500">vs last month</p>
            </div>
          </div>
        </div>

        {/* Top Referrers - Placeholder for now */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <Globe className="w-5 h-5 text-gray-600 mr-3" />
            <h4 className="text-sm font-medium text-gray-900">Top Referrers</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Direct</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Google</span>
              <span className="font-medium">28%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Twitter</span>
              <span className="font-medium">15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Other</span>
              <span className="font-medium">12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}