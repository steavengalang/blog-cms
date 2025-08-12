import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search posts...",
  className = ""
}) => {
  const [query, setQuery] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Update internal state when prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue); // Call parent's onChange
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
        setShowResults(true);
      }, 500);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Button
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          size="sm"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {showResults && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <p className="text-sm text-gray-600">
              Search results for "{query}"
            </p>
            {/* Search results would be rendered here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
