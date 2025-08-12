import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import {
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  postTitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  createdAt: string;
}

const CommentModeration: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockComments: Comment[] = [
        {
          id: '1',
          content: 'Great article! This really helped me understand the concept better.',
          author: {
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          postTitle: 'Getting Started with React',
          status: 'pending',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          content: 'I have a question about the third section. Could you clarify?',
          author: {
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          postTitle: 'Advanced CSS Grid',
          status: 'approved',
          createdAt: '2024-01-14T16:45:00Z'
        }
      ];
      
      setComments(mockComments);
      setIsLoading(false);
    };

    fetchComments();
  }, []);

  const handleStatusChange = async (commentId: string, newStatus: Comment['status']) => {
    try {
      setComments(prev => prev.map(comment =>
        comment.id === commentId ? { ...comment, status: newStatus } : comment
      ));
    } catch (error) {
      console.error('Error updating comment status:', error);
    }
  };

  const getStatusColor = (status: Comment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'spam':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-32 rounded"></div>
        ))}
      </div>
    );
  }

  const filteredComments = statusFilter === 'all' 
    ? comments 
    : comments.filter(comment => comment.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comment Moderation</h1>
          <p className="text-gray-600 mt-1">Manage and moderate blog comments</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="spam">Spam</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-start space-x-4">
              <Avatar
                src={comment.author.avatar}
                alt={comment.author.name}
                size="md"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {comment.author.email}
                    </span>
                  </div>
                  
                  <Badge className={getStatusColor(comment.status)}>
                    {comment.status}
                  </Badge>
                </div>

                <div className="mb-3">
                  <p className="text-gray-900">{comment.content}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>On: {comment.postTitle}</span>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  {comment.status === 'pending' && (
                    <>
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handleStatusChange(comment.id, 'approved')}
                      >
                        <CheckIcon className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => handleStatusChange(comment.id, 'rejected')}
                      >
                        <XMarkIcon className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={() => handleStatusChange(comment.id, 'rejected')}
                  >
                    <TrashIcon className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No comments found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentModeration;
