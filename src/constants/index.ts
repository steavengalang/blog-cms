export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Blog CMS',
  description: 'Professional Blog and Content Management System',
  version: '1.0.0',
  author: 'Your Name',
  url: import.meta.env.VITE_APP_URL || 'https://your-blog-cms.vercel.app',
};

export const API_ENDPOINTS = {
  posts: '/api/posts',
  categories: '/api/categories',
  tags: '/api/tags',
  comments: '/api/comments',
  users: '/api/users',
  auth: '/api/auth',
  upload: '/api/upload',
};

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export const COMMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const SEO = {
  DEFAULT_TITLE: 'Blog CMS - Professional Content Management',
  DEFAULT_DESCRIPTION: 'A modern blog and content management system built with React and TypeScript',
  DEFAULT_KEYWORDS: 'blog, cms, content management, react, typescript',
  DEFAULT_AUTHOR: 'Blog CMS Team',
  DEFAULT_IMAGE: '/og-image.jpg',
} as const;

export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;
