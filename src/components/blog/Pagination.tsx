import React from 'react';
import Button from '../ui/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showInfo?: boolean;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
  variant = 'default',
  showInfo = true,
  maxVisiblePages = 5
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= halfVisible + 1) {
        // Near the beginning
        for (let i = 2; i <= Math.min(maxVisiblePages - 1, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > maxVisiblePages - 1) {
          pages.push('...');
        }
      } else if (currentPage >= totalPages - halfVisible) {
        // Near the end
        if (totalPages > maxVisiblePages - 1) {
          pages.push('...');
        }
        for (let i = Math.max(2, totalPages - maxVisiblePages + 2); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = currentPage - halfVisible + 1; i <= currentPage + halfVisible - 1; i++) {
          if (i > 1 && i < totalPages) {
            pages.push(i);
          }
        }
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageInfo = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    return `Showing ${startItem}-${endItem} of ${totalItems} results`;
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2 py-1"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-gray-600">
          {currentPage} of {totalPages}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2 py-1"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        {showInfo && (
          <div className="text-sm text-gray-600">
            {getPageInfo()}
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
            className="px-2 py-1"
            title="First page"
          >
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-2 py-1"
            title="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handlePageChange(page as number)}
                  className="px-3 py-2 min-w-[40px]"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-2 py-1"
            title="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="px-2 py-1"
            title="Last page"
          >
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {showInfo && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">{getPageInfo()}</p>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-2">
        {/* First Page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage <= 1}
          className="px-3 py-2"
          title="First page"
        >
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        </Button>
        
        {/* Previous Page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-2"
          title="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        
        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400 select-none">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handlePageChange(page as number)}
                  className="px-3 py-2 min-w-[44px] h-10"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Next Page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2"
          title="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        
        {/* Last Page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2"
          title="Last page"
        >
          <ChevronDoubleRightIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Mobile-friendly page info */}
      <div className="text-center mt-4 md:hidden">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
      </div>
    </div>
  );
};
