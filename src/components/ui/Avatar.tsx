import React from 'react';
import { classNames } from '../../utils';
import { UserIcon } from '@heroicons/react/24/outline';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  const classes = classNames(
    'inline-block rounded-full bg-gray-300 flex items-center justify-center overflow-hidden',
    sizeClasses[size],
    className
  );
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={classes}
        onError={(e) => {
          // Fallback to default avatar if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<div class="${classes}"><svg class="w-1/2 h-1/2 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>`;
          }
        }}
      />
    );
  }
  
  return (
    <div className={classes}>
      <UserIcon className="w-1/2 h-1/2 text-gray-600" />
    </div>
  );
};

export default Avatar;
