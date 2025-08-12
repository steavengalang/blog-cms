# Blog CMS - Professional Content Management System

A modern, full-featured blog and content management system built with React, TypeScript, and Supabase.

## ✨ Features

### 🎯 Core Features
- **Rich Text Editor**: Quill.js integration with custom toolbar
- **User Authentication**: Secure login/signup with Supabase Auth
- **Role-based Access**: Admin, Editor, and Viewer roles
- **Post Management**: Create, edit, publish, and schedule posts
- **Category & Tag System**: Organize content efficiently
- **Media Library**: Upload and manage images/files
- **Comment System**: Threaded comments with moderation
- **SEO Optimization**: Meta tags, Open Graph, structured data

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional interface with Headless UI
- **Search & Filtering**: Advanced search with category/tag filters
- **Newsletter Signup**: Email subscription system
- **Social Sharing**: Share posts on social media platforms
- **Analytics Dashboard**: Track performance and engagement

### 🚀 Technical Features
- **TypeScript**: Full type safety and better development experience
- **State Management**: Zustand for client state, React Query for server state
- **Performance**: Code splitting, lazy loading, and optimization
- **Security**: Input validation, XSS protection, secure authentication
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand + React Query
- **Rich Text Editor**: Quill.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/blog-cms.git
cd blog-cms
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=Blog CMS
VITE_APP_URL=https://your-blog-cms.vercel.app
```

### 4. Supabase Setup
1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Get your project credentials:
   - Go to your project dashboard
   - Navigate to **Settings** → **API**
   - Copy the **Project URL** (this is your `VITE_SUPABASE_URL`)
   - Copy the **anon public** key (this is your `VITE_SUPABASE_ANON_KEY`)
3. Run the following SQL to create the database schema:

```sql
-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id),
  seo_title VARCHAR(255),
  seo_description TEXT,
  reading_time INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id),
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post categories junction table
CREATE TABLE post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Post tags junction table
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
```

### 5. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Build
```bash
pnpm build
pnpm preview
```

## 📱 Usage

### For Readers
- Browse posts by category or tag
- Search for specific content
- Leave comments on posts
- Subscribe to newsletter
- Share posts on social media

### For Authors/Editors
- Sign in to admin panel
- Create and edit posts
- Upload media files
- Manage categories and tags
- Moderate comments

### For Administrators
- Manage user roles and permissions
- View analytics and performance metrics
- Configure site settings
- Backup and restore data

## 🏗️ Project Structure

```
blog-cms/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components (Button, Input, etc.)
│   │   ├── layout/         # Layout components (Header, Footer, etc.)
│   │   ├── blog/           # Blog-specific components
│   │   └── admin/          # Admin panel components
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   └── public/         # Public pages
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand state management
│   ├── services/           # API services (Supabase)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── constants/          # App constants
├── public/                 # Static assets
├── docs/                   # Documentation
└── tests/                  # Test files
```

## 🔧 Configuration

### Customization
- Update `src/constants/index.ts` for app configuration
- Modify `tailwind.config.js` for styling customization
- Edit `src/components/layout/Header.tsx` for navigation changes

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_APP_NAME`: Application name
- `VITE_APP_URL`: Application URL for SEO

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📊 Performance

- **Lighthouse Score**: 90+ on all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading Speed**: < 2 seconds on average
- **SEO**: Fully optimized for search engines

## 🔒 Security

- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure authentication with Supabase
- Role-based access control
- Environment variable protection

## 🚨 Troubleshooting

### Common Issues

#### "Missing Supabase environment variables" Error
- Ensure you have created a `.env` file in the root directory
- Verify that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Check that the environment variables are prefixed with `VITE_`
- Restart your development server after adding environment variables

#### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
- Check TypeScript errors: `pnpm type-check`
- Verify all dependencies are installed: `pnpm install`

#### Runtime Errors
- Check browser console for detailed error messages
- Verify Supabase project is active and accessible
- Ensure database schema is properly set up

### Getting Help
- Check the [docs/](docs/) directory for detailed guides
- Review [GitHub Issues](https://github.com/yourusername/blog-cms/issues) for similar problems
- Open a new issue with detailed error information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/blog-cms/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/blog-cms/discussions)

---

Built with ❤️ using modern web technologies
