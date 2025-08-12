import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface Post {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  categoryId: string;
  tags: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: Date;
}

interface Category {
  id: string;
  name: string;
}

const PostEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [categories, _setCategories] = useState<Category[]>([]);
  
  const [post, setPost] = useState<Post>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    status: 'draft',
    categoryId: '',
    tags: [],
    featuredImage: '',
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
    loadCategories();
  }, [id]);

  const loadPost = async (_postId: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to load post
      // const response = await supabase.from('posts').select('*').eq('id', postId).single();
      // if (response.data) setPost(response.data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // TODO: Implement API call to load categories
      // const response = await supabase.from('categories').select('*');
      // if (response.data) setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleInputChange = (field: keyof Post, value: any) => {
    setPost(prev => ({ ...prev, [field]: value }));
  };

  const handleTagInput = (value: string) => {
    if (value.includes(',')) {
      const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setPost(prev => ({ ...prev, tags: newTags }));
    }
  };

  const handleSave = async (_status: 'draft' | 'published') => {
    setIsSaving(true);
    try {
      if (id) {
        // Update existing post
        // await supabase.from('posts').update(_postData).eq('id', id);
      } else {
        // Create new post
        // await supabase.from('posts').insert(_postData);
      }
      
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setPost(prev => ({ ...prev, slug }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/posts')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Posts
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Update your blog post' : 'Write a new blog post'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showPreview ? (
              <>
                <EyeSlashIcon className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <EyeIcon className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </button>
          
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50"
          >
            {isSaving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter post title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={post.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your post content here..."
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={post.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Brief summary of your post..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Post Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={post.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={post.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={post.tags.join(', ')}
                  onChange={(e) => handleTagInput(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={post.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="post-url-slug"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={generateSlug}
                    className="px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={post.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="SEO optimized title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  value={post.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="Meta description for search engines"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <div className="prose max-w-none">
            <h1>{post.title || 'Post Title'}</h1>
            {post.excerpt && (
              <p className="text-gray-600 italic">{post.excerpt}</p>
            )}
            <div dangerouslySetInnerHTML={{ __html: post.content || '<p>Post content will appear here...</p>' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEditor;
