import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { BlogPost, Category, Tag, Comment, User } from '../types';

interface BlogState {
  // Posts
  posts: BlogPost[];
  currentPost: BlogPost | null;
  postsLoading: boolean;
  postsError: string | null;
  
  // Categories and Tags
  categories: Category[];
  tags: Tag[];
  
  // Comments
  comments: Comment[];
  
  // User and Auth
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  
  // UI State
  sidebarOpen: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
}

interface BlogActions {
  // Posts
  setPosts: (posts: BlogPost[]) => void;
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, updates: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  setCurrentPost: (post: BlogPost | null) => void;
  setPostsLoading: (loading: boolean) => void;
  setPostsError: (error: string | null) => void;
  
  // Categories and Tags
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  // Comments
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  updateComment: (id: string, updates: Partial<Comment>) => void;
  deleteComment: (id: string) => void;
  
  // User and Auth
  setUser: (user: User | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setAuthLoading: (loading: boolean) => void;
  
  // UI State
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedTags: (tags: string[]) => void;
  
  // Computed
  publishedPosts: BlogPost[];
  draftPosts: BlogPost[];
  featuredPosts: BlogPost[];
}

export const useBlogStore = create<BlogState & BlogActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        posts: [],
        currentPost: null,
        postsLoading: false,
        postsError: null,
        categories: [],
        tags: [],
        comments: [],
        user: null,
        isAuthenticated: false,
        authLoading: false,
        sidebarOpen: false,
        searchQuery: '',
        selectedCategory: null,
        selectedTags: [],
        
        // Actions
        setPosts: (posts) => set({ posts }),
        addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
        updatePost: (id, updates) =>
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? { ...post, ...updates } : post
            ),
          })),
        deletePost: (id) =>
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id),
          })),
        setCurrentPost: (post) => set({ currentPost: post }),
        setPostsLoading: (loading) => set({ postsLoading: loading }),
        setPostsError: (error) => set({ postsError: error }),
        
        setCategories: (categories) => set({ categories }),
        addCategory: (category) =>
          set((state) => ({ categories: [...state.categories, category] })),
        updateCategory: (id, updates) =>
          set((state) => ({
            categories: state.categories.map((cat) =>
              cat.id === id ? { ...cat, ...updates } : cat
            ),
          })),
        deleteCategory: (id) =>
          set((state) => ({
            categories: state.categories.filter((cat) => cat.id !== id),
          })),
        
        setTags: (tags) => set({ tags }),
        addTag: (tag) =>
          set((state) => ({ tags: [...state.tags, tag] })),
        updateTag: (id, updates) =>
          set((state) => ({
            tags: state.tags.map((tag) =>
              tag.id === id ? { ...tag, ...updates } : tag
            ),
          })),
        deleteTag: (id) =>
          set((state) => ({
            tags: state.tags.filter((tag) => tag.id !== id),
          })),
        
        setComments: (comments) => set({ comments }),
        addComment: (comment) =>
          set((state) => ({ comments: [comment, ...state.comments] })),
        updateComment: (id, updates) =>
          set((state) => ({
            comments: state.comments.map((comment) =>
              comment.id === id ? { ...comment, ...updates } : comment
            ),
          })),
        deleteComment: (id) =>
          set((state) => ({
            comments: state.comments.filter((comment) => comment.id !== id),
          })),
        
        setUser: (user) => set({ user }),
        setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
        setAuthLoading: (loading) => set({ authLoading: loading }),
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        setSelectedCategory: (category) => set({ selectedCategory: category }),
        setSelectedTags: (tags) => set({ selectedTags: tags }),
        
        // Computed Properties
        get publishedPosts() {
          return get().posts.filter((post) => post.status === 'published');
        },
        get draftPosts() {
          return get().posts.filter((post) => post.status === 'draft');
        },
        get featuredPosts() {
          return get().posts.filter((post) => post.status === 'published').slice(0, 3);
        },
      }),
      {
        name: 'blog-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'blog-store',
    }
  )
);
