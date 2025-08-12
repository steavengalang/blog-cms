import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../types';
import { formatDate, calculateReadingTime, generateExcerpt } from '../../utils';

interface PostCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'default' }) => {
  const excerpt = generateExcerpt(post.content, variant === 'compact' ? 100 : 150);

  if (variant === 'featured') {
    return (
      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {post.featuredImage && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.id}
                    className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>{calculateReadingTime(post.content)} min read</span>
            {post.author && (
              <>
                <span className="mx-2">•</span>
                <span>By {post.author.name}</span>
              </>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
            <Link to={`/post/${post.slug}`} className="hover:text-blue-600 transition-colors">
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
            <Link
              to={`/post/${post.slug}`}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              Read More →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start space-x-4">
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              <span className="mx-1">•</span>
              <span>{calculateReadingTime(post.content)} min</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              <Link to={`/post/${post.slug}`} className="hover:text-blue-600 transition-colors">
                {post.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{excerpt}</p>
          </div>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <div className="flex flex-wrap gap-1">
              {post.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span className="mx-2">•</span>
          <span>{calculateReadingTime(post.content)} min read</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link to={`/post/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post.author?.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm text-gray-600">{post.author?.name}</span>
          </div>
          <Link
            to={`/post/${post.slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
