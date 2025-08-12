import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, calculateReadingTime } from '../../utils';
import { useBlogStore } from '../../store';
import Button from '../ui/Button';
import { 
  CalendarIcon, 
  ClockIcon, 
  EyeIcon,
  FireIcon,
  TagIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { 
    categories, 
    tags, 
    posts, 
    selectedCategory, 
    selectedTags,
    setSelectedCategory, 
    setSelectedTags 
  } = useBlogStore();

  // Get recent posts
  const recentPosts = posts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - 
                       new Date(a.publishedAt || a.createdAt).getTime())
    .slice(0, 5);

  // Get popular posts (by view count)
  const popularPosts = posts
    .filter(post => post.status === 'published' && post.viewCount)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  // Get featured posts
  const featuredPosts = posts
    .filter(post => post.status === 'published' && post.isFeatured)
    .slice(0, 3);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleTagClick = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  return (
    <aside className={`space-y-8 ${className}`}>
      {/* Search */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            variant="primary"
            size="sm"
            className="absolute right-1 top-1"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FolderIcon className="h-5 w-5" />
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">
                    {posts.filter(post => 
                      post.categories.some(cat => cat.id === category.id) && 
                      post.status === 'published'
                    ).length}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {selectedCategory && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              className="w-full mt-3"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {recentPosts.map(post => (
              <article key={post.id} className="group">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="flex gap-3">
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FireIcon className="h-5 w-5" />
            Popular Posts
          </h3>
          <div className="space-y-4">
            {popularPosts.map(post => (
              <article key={post.id} className="group">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="flex gap-3">
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <EyeIcon className="h-4 w-4" />
                        <span>{post.viewCount} views</span>
                        <span>•</span>
                        <ClockIcon className="h-4 w-4" />
                        <span>{calculateReadingTime(post.content)} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Posts</h3>
          <div className="space-y-4">
            {featuredPosts.map(post => (
              <article key={post.id} className="group">
                <Link to={`/blog/${post.slug}`} className="block">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Stay Updated</h3>
        <p className="text-blue-700 text-sm mb-4">
          Get the latest posts and updates delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <Button variant="primary" size="sm" className="w-full">
            Subscribe
          </Button>
        </div>
      </div>

      {/* Social Links */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="flex-1">
            Twitter
          </Button>
          <Button variant="secondary" size="sm" className="flex-1">
            Facebook
          </Button>
          <Button variant="secondary" size="sm" className="flex-1">
            LinkedIn
          </Button>
        </div>
      </div>
    </aside>
  );
};
