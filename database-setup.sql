-- Blog CMS Database Setup
-- Run this SQL in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seo_title VARCHAR(255),
  seo_description TEXT,
  reading_time INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_categories junction table
CREATE TABLE IF NOT EXISTS post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'author', 'viewer')),
  website TEXT,
  twitter_username VARCHAR(50),
  github_username VARCHAR(50),
  linkedin_username VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Create post_views table for analytics
CREATE TABLE IF NOT EXISTS post_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  viewer_ip INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON post_views(viewed_at);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Public posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own posts" ON posts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for tags
CREATE POLICY "Tags are viewable by everyone" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for comments
CREATE POLICY "Approved comments are viewable by everyone" ON comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own comments" ON comments
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Comment authors can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Comment authors can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for user_profiles
CREATE POLICY "User profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Subscribers can view their own subscription" ON newsletter_subscribers
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- RLS Policies for post_views
CREATE POLICY "Anyone can record post views" ON post_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Post authors can view analytics" ON post_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = post_views.post_id 
      AND posts.author_id = auth.uid()
    )
  );

-- Create functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate reading time
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- Average reading speed: 200 words per minute
  RETURN GREATEST(1, CEIL(LENGTH(content) / 1000.0 * 200 / 60));
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_post_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1 
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment view count
CREATE TRIGGER increment_post_views AFTER INSERT ON post_views
  FOR EACH ROW EXECUTE FUNCTION increment_post_view_count();

-- Insert sample data
INSERT INTO categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Technology related posts'),
  ('Lifestyle', 'lifestyle', 'Lifestyle and personal posts'),
  ('Development', 'development', 'Software development posts'),
  ('Design', 'design', 'Design and UX posts')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tags (name, slug) VALUES
  ('React', 'react'),
  ('TypeScript', 'typescript'),
  ('JavaScript', 'javascript'),
  ('CSS', 'css'),
  ('Web Development', 'web-development'),
  ('Programming', 'programming')
ON CONFLICT (slug) DO NOTHING;

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant future permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;
