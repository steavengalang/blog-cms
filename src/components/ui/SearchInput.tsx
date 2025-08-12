import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '../../utils';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
  debounceMs?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  className = '',
  debounceMs = 300,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (onSearch && value) {
      timeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, onSearch, debounceMs]);

  const handleClear = () => {
    onChange('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={classNames('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={classNames(
          'block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200',
          isFocused ? 'ring-1 ring-blue-500 border-blue-500' : ''
        )}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
