import React, { forwardRef } from 'react';
import { classNames } from '../../utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  const textareaClasses = classNames(
    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical',
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
      <textarea
        ref={ref}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
