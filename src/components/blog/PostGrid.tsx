import React, { useState, useEffect, useMemo } from 'react';
import type { BlogPost } from '../../types';
import PostCard from './PostCard';
import Button from '../ui/Button';
import Select from '../ui/Select';
import SearchInput from '../ui/SearchInput';
import { useBlogStore } from '../../store';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PostGridProps {
  posts: BlogPost[];
  showFilters?: boolean;
  showPagination?: boolean;
  postsPerPage?: number;
  className?: string;
}

export const PostGrid: React.FC<PostGridProps> = ({
  posts,
  showFilters = true,
  showPagination = true,
  postsPerPage = 12,
  className = '',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'popularity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { searchQuery } = useBlogStore();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTags, sortBy, sortOrder, searchQuery]);

  // Filter posts based on selected category and tags
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post =>
        post.categories.some(cat => cat.slug === selectedCategory)
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.every(tagSlug =>
          post.tags.some(tag => tag.slug === tagSlug)
        )
      );
    }

    return filtered;
  }, [posts, selectedCategory, selectedTags, searchQuery]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.publishedAt || b.createdAt).getTime() - 
                     new Date(a.publishedAt || a.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'popularity':
          comparison = (b.viewCount || 0) - (a.viewCount || 0);
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });
    
    return sorted;
  }, [filteredPosts, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = useMemo(() => 
    sortedPosts.slice(startIndex, startIndex + postsPerPage), 
    [sortedPosts, startIndex, postsPerPage]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug || '');
  };

  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags(prev => 
      prev.includes(tagSlug)
        ? prev.filter(tag => tag !== tagSlug)
        : [...prev, tagSlug]
    );
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-');
    setSortBy(field as 'date' | 'title' | 'popularity');
    setSortOrder(order as 'asc' | 'desc');
  };

  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filters */}
      {showFilters && (
        <div className="mb-8 space-y-4">
          {/* Search and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={(value) => useBlogStore.getState().setSearchQuery(value)}
                placeholder="Search posts..."
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="min-w-[140px]"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="popularity-desc">Most Popular</option>
                <option value="popularity-asc">Least Popular</option>
              </Select>
            </div>
          </div>

          {/* Category and Tag Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {/* TODO: Load categories from API */}
                <option value="technology">Technology</option>
                <option value="programming">Programming</option>
                <option value="lifestyle">Lifestyle</option>
              </Select>
            </div>

            {/* Tag Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {/* TODO: Load tags from API */}
                {['react', 'typescript', 'javascript', 'web-development'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(selectedCategory || selectedTags.length > 0) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {selectedCategory && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  #{tag}
                </span>
              ))}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedTags([]);
                }}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-600 mt-6">
        Showing {startIndex + 1}-{Math.min(startIndex + postsPerPage, sortedPosts.length)} of {sortedPosts.length} posts
        {filteredPosts.length !== posts.length && ` (filtered from ${posts.length} total)`}
      </div>
    </div>
  );
};
