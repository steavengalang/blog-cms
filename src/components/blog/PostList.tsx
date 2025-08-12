import React, { useState, useEffect, useMemo } from 'react';
import PostCard from './PostCard';
import type { BlogPost } from '../../types';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface PostListProps {
  posts: BlogPost[];
  title?: string;
  showFilters?: boolean;
  className?: string;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  title,
  showFilters = true,
  className = ''
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'readingTime' | 'popularity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Sort posts
  const sortedPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.publishedAt || b.createdAt).getTime() - 
                     new Date(a.publishedAt || a.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'readingTime':
          comparison = (b.readingTime || 0) - (a.readingTime || 0);
          break;
        case 'popularity':
          comparison = (b.viewCount || 0) - (a.viewCount || 0);
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });
    
    return sorted;
  }, [posts, sortBy, sortOrder]);

  // Filter posts by category if selected
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return sortedPosts;
    return sortedPosts.filter(post => 
      post.categories.some(cat => cat.id === selectedCategory)
    );
  }, [sortedPosts, selectedCategory]);

  // Get unique categories from posts
  const categories = useMemo(() => {
    const categoryMap = new Map();
    posts.forEach(post => {
      post.categories.forEach(category => {
        if (!categoryMap.has(category.id)) {
          categoryMap.set(category.id, category);
        }
      });
    });
    return Array.from(categoryMap.values());
  }, [posts]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, sortOrder]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as typeof sortBy);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
        <p className="text-gray-600">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {title && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="card space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="min-w-[200px]">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                  <option value="readingTime">Reading Time</option>
                  <option value="popularity">Popularity</option>
                </Select>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory || sortBy !== 'date' || sortOrder !== 'desc') && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => {
                  setSelectedCategory('');
                  setSortBy('date');
                  setSortOrder('desc');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {paginatedPosts.map(post => (
          <PostCard key={post.id} post={post} variant="compact" />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronUpIcon className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
