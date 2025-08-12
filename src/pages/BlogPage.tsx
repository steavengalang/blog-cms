import React, { useState } from 'react';
import { useBlogStore } from '../store';
import { usePublishedPosts } from '../hooks/usePosts';
import { PostGrid } from '../components/blog/PostGrid';
import SearchBar from '../components/blog/SearchBar';
import CategoryFilter from '../components/blog/CategoryFilter';
import { NewsletterSignup } from '../components/blog/NewsletterSignup';

const BlogPage: React.FC = () => {
  const { searchQuery, selectedCategory } = useBlogStore();
  const [_currentPage, _setCurrentPage] = useState(1);
  const { data: postsData, isLoading, error } = usePublishedPosts();

  const handleSearch = (query: string) => {
    useBlogStore.getState().setSearchQuery(query);
  };

  const handleCategoryChange = (category: string | null) => {
    useBlogStore.getState().setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading posts: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const posts = postsData || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover insights, tutorials, and stories from our team
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search posts..."
              />
            </div>
            <div className="sm:w-64">
              <CategoryFilter
                selectedCategory={selectedCategory || undefined}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PostGrid posts={posts} />
      </div>

      {/* Newsletter */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
