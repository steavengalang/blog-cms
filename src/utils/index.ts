export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const generateExcerpt = (content: string, maxLength: number = 150): string => {
  // Remove HTML tags for excerpt
  const plainText = content.replace(/<[^>]*>/g, '');
  return truncateText(plainText, maxLength);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getPostStatusColor = (status: string): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getCommentStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  return '📁';
};
