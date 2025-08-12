import React from 'react';
import { useParams } from 'react-router-dom';
import { usePostBySlug } from '../hooks/usePosts';
import { PostDetail } from '../components/blog/PostDetail';
import { CommentSection } from '../components/blog/CommentSection';
import { RelatedPosts } from '../components/blog/RelatedPosts';
import SEOHead from '../components/blog/SEOHead';

const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePostBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600">
              The post you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        image={post.featuredImage}
        type="article"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PostDetail post={post} />
          
          {/* Comments Section */}
          <div className="mt-16">
            <CommentSection
              postId={post.id}
              comments={post.comments || []}
              currentUserId={undefined} // Will come from auth context
              onAddComment={(comment) => {
                // Handle adding comment
                console.log('Adding comment:', comment);
              }}
              onLikeComment={(commentId: string) => {
                // Handle liking comment
                console.log('Liking comment:', commentId);
              }}
              onReplyToComment={(commentId: string, reply: string) => {
                // Handle replying to comment
                console.log('Replying to comment:', commentId, reply);
              }}
              onReportComment={(commentId: string, reason: string) => {
                // Handle reporting comment
                console.log('Reporting comment:', commentId, reason);
              }}
              onDeleteComment={(commentId: string) => {
                // Handle deleting comment
                console.log('Deleting comment:', commentId);
              }}
            />
          </div>
          
          {/* Related Posts */}
          <div className="mt-16">
            <RelatedPosts 
              currentPost={post} 
              allPosts={[]} // TODO: Load related posts from API
              className="mt-12"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;
