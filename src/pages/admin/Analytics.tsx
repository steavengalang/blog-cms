import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Select from '../../components/ui/Select';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    engagement: number;
  }>;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        pageViews: 15420,
        uniqueVisitors: 8234,
        bounceRate: 42.3,
        avgSessionDuration: 185,
        topPosts: [
          { id: '1', title: 'Getting Started with React', views: 2847, engagement: 89 },
          { id: '2', title: 'Advanced CSS Grid', views: 2156, engagement: 76 },
          { id: '3', title: 'Building APIs with Node.js', views: 1892, engagement: 67 }
        ]
      };
      
      setAnalyticsData(mockData);
      setIsLoading(false);
    };

    fetchAnalytics();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your blog's performance</p>
        </div>
        <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="w-32">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <EyeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Page Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(analyticsData.pageViews)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unique Visitors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(analyticsData.uniqueVisitors)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Bounce Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.bounceRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Session</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatDuration(analyticsData.avgSessionDuration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Posts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{post.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatNumber(post.views)} views
                  </p>
                  <p className="text-xs text-gray-500">
                    {post.engagement}% engagement
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
