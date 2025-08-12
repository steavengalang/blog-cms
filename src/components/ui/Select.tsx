import React, { forwardRef } from 'react';
import { classNames } from '../../utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  className = '',
  children,
  ...props
}, ref) => {
  const selectClasses = classNames(
    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white',
    !error ? 'border-gray-300' : 'border-red-300 focus:ring-red-500',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
