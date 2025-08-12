import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: Date;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to load categories
      // const response = await supabase.from('categories').select('*');
      // if (response.data) setCategories(response.data);
      
      // Mock data for now
      setCategories([
        {
          id: '1',
          name: 'Technology',
          slug: 'technology',
          description: 'Technology related posts',
          postCount: 15,
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Lifestyle',
          slug: 'lifestyle',
          description: 'Lifestyle and personal posts',
          postCount: 8,
          createdAt: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // TODO: Update existing category
        // await supabase.from('categories').update(formData).eq('id', editingCategory.id);
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, ...formData }
            : cat
        ));
      } else {
        // TODO: Create new category
        // const response = await supabase.from('categories').insert(formData);
        const newCategory: Category = {
          id: Date.now().toString(),
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          postCount: 0,
          createdAt: new Date()
        };
        setCategories(prev => [...prev, newCategory]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        // TODO: Implement API call to delete category
        // await supabase.from('categories').delete().eq('id', categoryId);
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setFormData(prev => ({ ...prev, slug }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your blog categories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="category-slug"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Categories</h3>
        </div>
        
        {categories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first category.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FolderIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {category.description || 'No description'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-400">
                          {category.postCount} posts
                        </span>
                        <span className="text-xs text-gray-400">
                          {category.slug}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
