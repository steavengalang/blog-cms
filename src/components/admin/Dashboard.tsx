import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
  totalComments: number;
  pendingComments: number;
  totalViews: number;
  monthlyViews: number;
}

interface RecentPost {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'archived';
  publishedAt?: Date;
  views: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalUsers: 0,
    totalComments: 0,
    pendingComments: 0,
    totalViews: 0,
    monthlyViews: 0
  });
  
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API calls to load dashboard data
      // const postsResponse = await supabase.from('posts').select('*');
      // const usersResponse = await supabase.from('users').select('*');
      // const commentsResponse = await supabase.from('comments').select('*');
      
      // Mock data for now
      setStats({
        totalPosts: 25,
        publishedPosts: 18,
        draftPosts: 7,
        totalUsers: 12,
        totalComments: 45,
        pendingComments: 3,
        totalViews: 1247,
        monthlyViews: 156
      });
      
      setRecentPosts([
        {
          id: '1',
          title: 'Getting Started with React',
          status: 'published',
          publishedAt: new Date('2024-01-15'),
          views: 89
        },
        {
          id: '2',
          title: 'Advanced TypeScript Patterns',
          status: 'draft',
          views: 0
        },
        {
          id: '3',
          title: 'Building Scalable APIs',
          status: 'published',
          publishedAt: new Date('2024-01-12'),
          views: 156
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your blog.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Posts */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-green-600">{stats.publishedPosts} published</span>
              <span className="mx-2">•</span>
              <span className="text-yellow-600">{stats.draftPosts} drafts</span>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Total Comments */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Comments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalComments}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-orange-600">{stats.pendingComments} pending</span>
            </div>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">{stats.monthlyViews} this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/posts/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <PlusIcon className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Create Post</h4>
              <p className="text-sm text-gray-500">Write a new blog post</p>
            </div>
          </Link>
          
          <Link
            to="/admin/categories"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <PencilIcon className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Manage Categories</h4>
              <p className="text-sm text-gray-500">Organize your content</p>
            </div>
          </Link>
          
          <Link
            to="/admin/comments"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-500 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Moderate Comments</h4>
              <p className="text-sm text-gray-500">Review user feedback</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Posts</h3>
            <Link
              to="/admin/posts"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all posts →
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentPosts.map((post) => (
            <div key={post.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="hover:text-blue-600"
                      >
                        {post.title}
                      </Link>
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : post.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status}
                      </span>
                      {post.publishedAt && (
                        <span className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {post.publishedAt.toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center text-xs text-gray-500">
                        <EyeIcon className="h-3 w-3 mr-1" />
                        {post.views} views
                      </span>
                    </div>
                  </div>
                </div>
                
                <Link
                  to={`/admin/posts/${post.id}/edit`}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
