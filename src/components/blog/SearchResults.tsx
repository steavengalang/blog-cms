import React, { useState, useMemo } from 'react';
import type { BlogPost } from '../../types';
import { calculateReadingTime } from '../../utils';
import Button from '../ui/Button';
import PostCard from './PostCard';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CalendarIcon,
  FireIcon,
  Bars3Icon as ViewListIcon,
  Squares2X2Icon as ViewGridIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface SearchResultsProps {
  posts: BlogPost[];
  searchQuery: string;
  onSearch?: (query: string) => void;
  className?: string;
}

type SortOption = 'relevance' | 'date' | 'views' | 'readingTime';
type ViewMode = 'grid' | 'list';

export const SearchResults: React.FC<SearchResultsProps> = ({
  posts,
  searchQuery,
  onSearch,
  className = ''
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    tags: [] as string[],
    dateRange: '',
    readingTime: '',
    author: ''
  });

  // Get unique categories and tags for filters
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(post => {
      post.categories.forEach(cat => cats.add(cat.name));
    });
    return Array.from(cats);
  }, [posts]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag.name));
    });
    return Array.from(tagSet);
  }, [posts]);

  const authors = useMemo(() => {
    const authorSet = new Set<string>();
    posts.forEach(post => {
      authorSet.add(post.author.name);
    });
    return Array.from(authorSet);
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      // Category filter
      if (filters.categories.length > 0) {
        const postCategories = post.categories.map(cat => cat.name);
        if (!filters.categories.some(cat => postCategories.includes(cat))) {
          return false;
        }
      }

      // Tag filter
      if (filters.tags.length > 0) {
        const postTags = post.tags.map(tag => tag.name);
        if (!filters.tags.some(tag => postTags.includes(tag))) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange) {
        const postDate = new Date(post.publishedAt || post.createdAt);
        const now = new Date();
        const daysAgo = filters.dateRange === 'today' ? 1 :
                       filters.dateRange === 'week' ? 7 :
                       filters.dateRange === 'month' ? 30 : 0;
        
        if (daysAgo > 0) {
          const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
          if (postDate < cutoffDate) return false;
        }
      }

      // Reading time filter
      if (filters.readingTime) {
        const readingTime = calculateReadingTime(post.content);
        const maxTime = filters.readingTime === 'quick' ? 5 :
                       filters.readingTime === 'medium' ? 15 : 999;
        if (readingTime > maxTime) return false;
      }

      // Author filter
      if (filters.author && post.author.name !== filters.author) {
        return false;
      }

      return true;
    });

    // Sort posts
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => 
          new Date(b.publishedAt || b.createdAt).getTime() - 
          new Date(a.publishedAt || a.createdAt).getTime()
        );
        break;
      case 'views':
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'readingTime':
        filtered.sort((a, b) => 
          calculateReadingTime(a.content) - calculateReadingTime(b.content)
        );
        break;
      case 'relevance':
      default:
        // Relevance is already handled by the search query
        break;
    }

    return filtered;
  }, [posts, filters, sortBy]);

  const handleFilterChange = (filterType: keyof typeof filters, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      tags: [],
      dateRange: '',
      readingTime: '',
      author: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results
            </h1>
            <p className="text-gray-600">
              {filteredAndSortedPosts.length} results for "{searchQuery}"
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ViewGridIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ViewListIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Filters Toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              Filters
            </h3>
            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('categories', [...filters.categories, category]);
                        } else {
                          handleFilterChange('categories', filters.categories.filter(c => c !== category));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tags.map(tag => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('tags', [...filters.tags, tag]);
                        } else {
                          handleFilterChange('tags', filters.tags.filter(t => t !== tag));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any time</option>
                <option value="today">Today</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
              </select>
            </div>

            {/* Reading Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Time
              </label>
              <select
                value={filters.readingTime}
                onChange={(e) => handleFilterChange('readingTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any length</option>
                <option value="quick">Quick read (≤5 min)</option>
                <option value="medium">Medium (≤15 min)</option>
                <option value="long">Long read (&gt;15 min)</option>
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <select
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any author</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            {[
              { value: 'relevance', label: 'Relevance', icon: MagnifyingGlassIcon },
              { value: 'date', label: 'Date', icon: CalendarIcon },
              { value: 'views', label: 'Views', icon: EyeIcon },
              { value: 'readingTime', label: 'Reading Time', icon: FireIcon }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === option.value
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Showing {filteredAndSortedPosts.length} of {posts.length} results
        </div>
      </div>

      {/* Results */}
      {filteredAndSortedPosts.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredAndSortedPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              variant={viewMode === 'grid' ? 'default' : 'compact'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
