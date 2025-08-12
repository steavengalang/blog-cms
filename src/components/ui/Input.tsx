import React, { forwardRef } from 'react';
import { classNames } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  const inputClasses = classNames(
    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200',
    !error ? 'border-gray-300' : 'border-red-300 focus:ring-red-500',
    icon ? 'pl-10' : '',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {icon}
            </div>
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
