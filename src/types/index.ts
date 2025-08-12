export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  categories: Category[];
  tags: Tag[];
  author: Author;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  readingTime: number;
  viewCount: number;
  likeCount?: number;
  comments?: Comment[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  createdAt: Date;
  website?: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  authorId?: string;
  authorAvatar?: string;
  content: string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];
  isLiked?: boolean;
  likeCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
}

export type UserRole = 'admin' | 'editor' | 'viewer';
export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  query?: string;
  categories?: string[];
  tags?: string[];
  status?: string;
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
