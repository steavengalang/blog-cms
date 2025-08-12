import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { BlogPost } from '../types';

export const usePosts = (filters?: any) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['post', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
      if (error) throw error;
      return data;
      },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase.from('posts').insert(post).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlogPost> }) => {
      const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', updatedPost.id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const usePublishedPosts = () => {
  return useQuery({
    queryKey: ['posts', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedPosts = () => {
  return useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3);
      if (error) throw error;
      return { data, error };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: ['posts', 'search', query],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('title', query).or(`slug.ilike.%${query}%,content.ilike.%${query}%`).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

export const usePostsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['posts', 'category', categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('category', categorySlug).eq('status', 'published').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePostsByTag = (tagSlug: string) => {
  return useQuery({
    queryKey: ['posts', 'tag', tagSlug],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('tags', tagSlug).eq('status', 'published').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!tagSlug,
    staleTime: 5 * 60 * 1000,
  });
};
