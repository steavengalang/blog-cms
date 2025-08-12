import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../constants';
import type { BlogPost } from '../../types';
import { formatDate, calculateReadingTime, generateExcerpt } from '../../utils';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { 
  CalendarIcon, 
  ClockIcon, 
  EyeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface HeroProps {
  post?: BlogPost;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ post, className = '' }) => {
  if (!post) {
    return (
      <section className={`bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to {APP_CONFIG.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {APP_CONFIG.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/blog">Read Our Blog</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const excerpt = generateExcerpt(post.content, 200);

  return (
    <section className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Background Image */}
      {post.featuredImage && (
        <div className="absolute inset-0">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16 min-h-[500px] md:min-h-[600px] flex flex-col justify-end">
        <div className="max-w-3xl">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map(category => (
                <span
                  key={category.id}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed max-w-2xl">
            {excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm mb-8">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar
                src={post.author.avatar}
                alt={post.author.name}
                size="sm"
                className="border-2 border-white/30"
              />
              <span className="font-medium">{post.author.name}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>

            {/* Views */}
            {post.viewCount !== undefined && (
              <div className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4" />
                <span>{post.viewCount} views</span>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="flex flex-wrap gap-4">
            <Link to={`/blog/${post.slug}`}>
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 border-0"
              >
                Read More
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            >
              Share Article
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 right-8 hidden lg:block">
        <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full border border-white/20" />
      </div>
      
      <div className="absolute bottom-8 left-8 hidden lg:block">
        <div className="w-24 h-24 bg-white/5 backdrop-blur-sm rounded-full border border-white/10" />
      </div>
    </section>
  );
};

// Alternative Hero without a specific post (for homepage)
export const HomeHero: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 ${className}`}>
      <div className="absolute inset-0">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
      </div>

      <div className="relative z-10 p-8 md:p-12 lg:p-16 min-h-[500px] md:min-h-[600px] flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to Our Blog
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            Discover insightful articles, expert insights, and engaging content that will inspire, educate, and entertain you.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/blog">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 border-0"
              >
                Explore Articles
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            >
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
