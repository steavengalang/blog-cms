import React, { useState } from 'react';
import {
  ShareIcon,
  LinkIcon,
  ChatBubbleLeftIcon as ReplyIcon
} from '@heroicons/react/24/outline';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'floating';
  showCounts?: boolean;
  platforms?: SocialPlatform[];
}

interface SocialPlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  shareUrl: string;
  getShareUrl: (data: ShareData) => string;
}

interface ShareData {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

const defaultPlatforms: SocialPlatform[] = [
  {
    name: 'Facebook',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'bg-blue-600 hover:bg-blue-700',
    shareUrl: 'https://www.facebook.com/sharer/sharer.php',
    getShareUrl: ({ url, title: _title }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'Twitter',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    color: 'bg-sky-500 hover:bg-sky-600',
    shareUrl: 'https://twitter.com/intent/tweet',
    getShareUrl: ({ url, title: _title }) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(_title)}`,
  },
  {
    name: 'LinkedIn',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: 'bg-blue-700 hover:bg-blue-800',
    shareUrl: 'https://www.linkedin.com/sharing/share-offsite',
    getShareUrl: ({ url, title: _title }) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(_title)}`,
  },
  {
    name: 'WhatsApp',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
      </svg>
    ),
    color: 'bg-green-500 hover:bg-green-600',
    shareUrl: 'https://wa.me',
    getShareUrl: ({ url, title: _title }) => 
      `https://wa.me/?text=${encodeURIComponent(`${_title} ${url}`)}`,
  },
  {
    name: 'Telegram',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    color: 'bg-blue-500 hover:bg-blue-600',
    shareUrl: 'https://t.me/share/url',
    getShareUrl: ({ url, title: _title }) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(_title)}`,
  }
];

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description,
  image,
  className = '',
  variant = 'default',
  showCounts = false,
  platforms = defaultPlatforms
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [_shareCounts, _setShareCounts] = useState<Record<string, number>>({});

  const handleShare = (platform: SocialPlatform) => {
    const shareData = { url, title, description, image };
    const shareUrl = platform.getShareUrl(shareData);
    
    // Open share dialog
    const width = 600;
    const height = 400;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      shareUrl,
      'share',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const toggleShareMenu = () => {
    setIsOpen(!isOpen);
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`p-2 rounded-full ${platform.color} text-white transition-colors`}
            title={`Share on ${platform.name}`}
          >
            <platform.icon className="w-4 h-4" />
          </button>
        ))}
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          title="Copy link"
        >
          {copied ? <ReplyIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          <button
            onClick={toggleShareMenu}
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
            title="Share"
          >
            <ShareIcon className="w-6 h-6" />
          </button>
          
          {isOpen && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Share</h3>
                <button
                  onClick={toggleShareMenu}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ReplyIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className="flex items-center w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    <platform.icon className="w-4 h-4 mr-3" />
                    {platform.name}
                  </button>
                ))}
                
                <button
                  onClick={handleCopyLink}
                  className="flex items-center w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  {copied ? <ReplyIcon className="w-4 h-4 mr-3" /> : <LinkIcon className="w-4 h-4 mr-3" />}
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Share this post</h3>
        <button
          onClick={handleCopyLink}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {copied ? <ReplyIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy link'}</span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`flex flex-col items-center p-4 rounded-lg ${platform.color} text-white transition-colors hover:scale-105`}
          >
            <platform.icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{platform.name}</span>
            {showCounts && _shareCounts[platform.name] && (
              <span className="text-xs opacity-75">{_shareCounts[platform.name]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialShare;
