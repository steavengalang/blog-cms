import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../types';
import { formatDate, calculateReadingTime } from '../../utils';
import Button from '../ui/Button';
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
  maxPosts?: number;
  className?: string;
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPost,
  allPosts,
  maxPosts = 3,
  className = ''
}) => {
  const relatedPosts = useMemo(() => {
    // Filter out the current post and unpublished posts
    const availablePosts = allPosts.filter(post => 
      post.id !== currentPost.id && post.status === 'published'
    );

    if (availablePosts.length === 0) return [];

    // Calculate similarity scores based on multiple factors
    const postsWithScores = availablePosts.map(post => {
      let score = 0;

      // Category similarity (highest weight)
      const commonCategories = currentPost.categories.filter(currentCat =>
        post.categories.some(postCat => postCat.id === currentCat.id)
      );
      score += commonCategories.length * 10;

      // Tag similarity (medium weight)
      const commonTags = currentPost.tags.filter(currentTag =>
        post.tags.some(postTag => postTag.id === currentTag.id)
      );
      score += commonTags.length * 5;

      // Author similarity (medium weight)
      if (post.author.id === currentPost.author.id) {
        score += 8;
      }

      // Content length similarity (low weight)
      const currentLength = currentPost.content.length;
      const postLength = post.content.length;
      const lengthDiff = Math.abs(currentLength - postLength);
      const maxLength = Math.max(currentLength, postLength);
      if (maxLength > 0) {
        score += Math.max(0, 5 - (lengthDiff / maxLength) * 5);
      }

      // Recency bonus (low weight)
      const daysSincePublished = (Date.now() - new Date(post.publishedAt || post.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePublished <= 7) score += 2;
      else if (daysSincePublished <= 30) score += 1;

      // Popularity bonus (low weight)
      if (post.viewCount && post.viewCount > 100) score += 1;

      // Featured posts get bonus
      if (post.isFeatured) score += 2;

      return { post, score };
    });

    // Sort by score (highest first) and take top posts
    return postsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPosts)
      .map(item => item.post);
  }, [currentPost, allPosts, maxPosts]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className={`bg-gray-50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Related Posts</h3>
        <Button variant="outline" size="sm" asChild>
          <Link to="/blog">View All Posts</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {post.featuredImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-center text-xs text-gray-500 mb-2 space-x-3">
                <span className="flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {calculateReadingTime(post.content)} min
                </span>
                {post.viewCount > 0 && (
                  <span className="flex items-center">
                    <EyeIcon className="h-3 w-3 mr-1" />
                    {post.viewCount}
                  </span>
                )}
              </div>

              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                <Link to={`/post/${post.slug}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h4>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {post.categories.slice(0, 1).map(category => (
                    <span
                      key={category.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
                
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/post/${post.slug}`} className="text-blue-600 hover:text-blue-700">
                    Read More
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
