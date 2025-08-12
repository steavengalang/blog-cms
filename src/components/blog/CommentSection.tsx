import React, { useState } from 'react';
import type { Comment } from '../../types';
import { formatDate } from '../../utils';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Textarea from '../ui/Textarea';
import { 
  ChatBubbleLeftIcon,
  HeartIcon,
  ChatBubbleLeftIcon as ReplyIcon,
  FlagIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  onAddComment?: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyToComment?: (commentId: string, replyText: string) => void;
  onReportComment?: (commentId: string, reason: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUserId?: string;
  className?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  postId,
  onAddComment,
  onLikeComment,
  onReplyToComment,
  onReportComment,
  onDeleteComment,
  currentUserId,
  className = '',
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReportForm, setShowReportForm] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment?.({
      postId,
      content: newComment,
      authorName: 'Anonymous', // This would come from user context
      authorEmail: '', // This would come from user context
      authorId: currentUserId,
      status: 'pending',
    });

    setNewComment('');
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyTo) return;

    onReplyToComment?.(replyTo, replyText);
    setReplyTo(null);
    setReplyText('');
  };

  const handleReportComment = (commentId: string) => {
    if (!reportReason.trim()) return;
    
    onReportComment?.(commentId, reportReason);
    setShowReportForm(null);
    setReportReason('');
  };

  const canModerateComment = (comment: Comment) => {
    return currentUserId && (
      comment.authorId === currentUserId || 
      // Add admin check here if needed
      false
    );
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Avatar
            src={comment.authorAvatar}
            alt={comment.authorName}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900">
                {comment.authorName}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
              {comment.status === 'pending' && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Pending
                </span>
              )}
            </div>
            
            <p className="text-gray-700 mb-3">{comment.content}</p>
            
            <div className="flex items-center gap-4 text-sm">
              {/* Like Button */}
              <button
                onClick={() => onLikeComment?.(comment.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
              >
                {comment.isLiked ? (
                  <HeartIconSolid className="h-4 w-4 text-red-600" />
                ) : (
                  <HeartIcon className="h-4 w-4" />
                )}
                <span>{comment.likeCount || 0}</span>
              </button>

              {/* Reply Button */}
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ReplyIcon className="h-4 w-4" />
                Reply
              </button>

              {/* Report Button */}
              <button
                onClick={() => setShowReportForm(showReportForm === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
              >
                <FlagIcon className="h-4 w-4" />
                Report
              </button>

              {/* Delete Button (for comment author or moderators) */}
              {canModerateComment(comment) && (
                <button
                  onClick={() => onDeleteComment?.(comment.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>

            {/* Reply Form */}
            {replyTo === comment.id && (
              <form onSubmit={handleSubmitReply} className="mt-4">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="mb-3"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={!replyText.trim()}>
                    Reply
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setReplyTo(null);
                      setReplyText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Report Form */}
            {showReportForm === comment.id && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Report Comment</h4>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a reason...</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="harassment">Harassment</option>
                  <option value="other">Other</option>
                </select>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleReportComment(comment.id)}
                    disabled={!reportReason}
                  >
                    Submit Report
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowReportForm(null);
                      setReportReason('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Comment Count */}
      <div className="flex items-center gap-2">
        <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <div className="card">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Add a Comment</h4>
        <form onSubmit={handleSubmitComment}>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="mb-4"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Comments are moderated and will appear after approval.
            </p>
            <Button type="submit" disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <div className="text-center py-8">
            <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
            <p className="text-gray-600">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};
