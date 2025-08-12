import React, { useState } from 'react';
import type { BlogPost, Comment } from '../../types';
import { formatDate, calculateReadingTime, generateExcerpt } from '../../utils';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { 
  HeartIcon, 
  BookmarkIcon, 
  ShareIcon, 
  ChatBubbleLeftIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface PostDetailProps {
  post: BlogPost;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onShare?: (post: BlogPost) => void;
  onComment?: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  className?: string;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  onLike,
  onBookmark,
  onShare,
  onComment,
  className = '',
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: generateExcerpt(post.content, 150),
        url: window.location.href,
      });
    } else {
      onShare?.(post);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onComment?.({
      postId: post.id,
      content: commentText,
      authorName: 'Anonymous', // This would come from user context
      authorEmail: '', // This would come from user context
      status: 'pending',
    });

    setCommentText('');
  };

  const readingTime = calculateReadingTime(post.content);

  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <header className="mb-8">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map(category => (
              <span
                key={category.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              size="sm"
            />
            <span className="font-medium text-gray-700">{post.author.name}</span>
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

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Action Bar */}
      <div className="border-t border-gray-200 pt-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 ${
                isLiked ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span>{post.likeCount || 0}</span>
            </Button>

            {/* Comment Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-600"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{post.comments?.length || 0}</span>
            </Button>

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`flex items-center gap-2 ${
                isBookmarked ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {isBookmarked ? (
                <BookmarkIconSolid className="h-5 w-5" />
              ) : (
                <BookmarkIcon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Share Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <ShareIcon className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Author Bio */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <Avatar
            src={post.author.avatar}
            alt={post.author.name}
            size="lg"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About {post.author.name}
            </h3>
            <p className="text-gray-600 mb-3">
              {post.author.bio || 'No bio available.'}
            </p>
            {post.author.website && (
              <a
                href={post.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Visit website →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Comments ({post.comments?.length || 0})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            <Button type="submit" disabled={!commentText.trim()}>
              Post Comment
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.authorName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
