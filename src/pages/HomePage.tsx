import React from 'react';
import { Hero } from '../components/blog/Hero';
import { PostGrid } from '../components/blog/PostGrid';
import { NewsletterSignup } from '../components/blog/NewsletterSignup';
import { useFeaturedPosts } from '../hooks/usePosts';

const HomePage: React.FC = () => {
  const { data: featuredPosts, isLoading, error } = useFeaturedPosts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Posts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our latest articles and insights on technology, development, and more.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Failed to load featured posts. Please try again later.</p>
            </div>
          ) : featuredPosts?.data && featuredPosts.data.length > 0 ? (
            <PostGrid 
              posts={featuredPosts.data} 
              showFilters={false}
              showPagination={false}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured posts available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
