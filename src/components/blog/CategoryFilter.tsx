import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (categorySlug: string | null) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  className = ""
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to load categories
      // const response = await supabase
      //   .from('categories')
      //   .select('id, name, slug, postCount')
      //   .order('name');

      // Mock data for now
      setCategories([
        { id: '1', name: 'All Posts', slug: '', postCount: 25 },
        { id: '2', name: 'Technology', slug: 'technology', postCount: 12 },
        { id: '3', name: 'Programming', slug: 'programming', postCount: 8 },
        { id: '4', name: 'Lifestyle', slug: 'lifestyle', postCount: 5 }
      ]);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categorySlug: string) => {
    const slug = categorySlug === '' ? null : categorySlug;
    onCategoryChange(slug);
    setIsOpen(false);
  };

  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.slug === selectedCategory)?.name || 'All Posts'
    : 'All Posts';

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className="block truncate">{selectedCategoryName}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon 
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.slug)}
              className={`relative w-full cursor-pointer select-none py-2 pl-3 pr-9 ${
                (selectedCategory === category.slug) || (!selectedCategory && category.slug === '')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="block truncate">{category.name}</span>
              <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                (selectedCategory === category.slug) || (!selectedCategory && category.slug === '')
                  ? 'text-white'
                  : 'text-gray-400'
              }`}>
                {category.postCount > 0 && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {category.postCount}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
