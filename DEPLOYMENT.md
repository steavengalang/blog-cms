# Blog CMS Deployment Guide

This guide will walk you through deploying your Blog CMS application to production.

## 🚀 Deployment Options

### 1. Vercel (Recommended)
Vercel provides the best experience for React applications with automatic deployments, preview deployments, and excellent performance.

### 2. Netlify
Great alternative to Vercel with similar features and good performance.

### 3. AWS Amplify
Enterprise-grade deployment with AWS integration.

### 4. Self-hosted
Deploy to your own server or VPS.

## 📋 Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Supabase project set up
- [ ] Database schema created
- [ ] All tests passing
- [ ] Build successful locally
- [ ] README updated
- [ ] License file added

## 🎯 Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Ensure your repository is public or you have Vercel Pro**

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or leave empty)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

### Step 3: Environment Variables

Set these environment variables in your Vercel project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=Blog CMS
VITE_APP_URL=https://your-project.vercel.app
```

**To set environment variables:**
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable with the appropriate value
4. Select "Production" and "Preview" environments

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## 🌐 Netlify Deployment

### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository

### Step 2: Build Settings

```bash
Build command: pnpm build
Publish directory: dist
```

### Step 3: Environment Variables

Set the same environment variables as in Vercel deployment.

### Step 4: Deploy

Click "Deploy site" and wait for completion.

## ☁️ AWS Amplify Deployment

### Step 1: Connect Repository

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect your GitHub repository

### Step 2: Build Settings

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 3: Environment Variables

Set environment variables in the Amplify Console.

## 🖥️ Self-hosted Deployment

### Option 1: VPS/Server

1. **Set up your server** (Ubuntu 20.04+ recommended)
2. **Install Node.js and pnpm**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pnpm
   ```

3. **Clone and build**
   ```bash
   git clone https://github.com/yourusername/blog-cms.git
   cd blog-cms
   pnpm install
   pnpm build
   ```

4. **Serve with Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /path/to/blog-cms/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /static/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

5. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 2: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install -g pnpm
   RUN pnpm install
   COPY . .
   RUN pnpm build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   events {
       worker_connections 1024;
   }
   
   http {
       include /etc/nginx/mime.types;
       default_type application/octet-stream;
       
       server {
           listen 80;
           root /usr/share/nginx/html;
           index index.html;
           
           location / {
               try_files $uri $uri/ /index.html;
           }
       }
   }
   ```

3. **Build and run**
   ```bash
   docker build -t blog-cms .
   docker run -p 80:80 blog-cms
   ```

## 🔧 Post-deployment Configuration

### 1. Update Supabase Settings

1. Go to your Supabase project dashboard
2. Navigate to "Settings" → "API"
3. Add your production domain to "Additional Redirect URLs"
4. Update "Site URL" to your production domain

### 2. Test Core Functionality

- [ ] User registration and login
- [ ] Post creation and editing
- [ ] Comment system
- [ ] Search functionality
- [ ] Admin panel access
- [ ] Media uploads

### 3. Performance Optimization

1. **Enable Vercel Analytics** (if using Vercel)
2. **Set up monitoring** (e.g., Sentry for error tracking)
3. **Configure CDN** for static assets
4. **Enable compression** for better performance

### 4. SEO Configuration

1. **Update robots.txt**
   ```txt
   User-agent: *
   Allow: /
   Sitemap: https://yourdomain.com/sitemap.xml
   ```

2. **Create sitemap.xml** (can be generated dynamically)
3. **Set up Google Search Console**
4. **Configure Open Graph tags**

## 📊 Monitoring and Analytics

### 1. Performance Monitoring

- **Vercel Analytics**: Built-in performance metrics
- **Google PageSpeed Insights**: Performance scoring
- **Lighthouse CI**: Automated performance testing

### 2. Error Tracking

- **Sentry**: Error monitoring and performance tracking
- **LogRocket**: Session replay and error tracking

### 3. User Analytics

- **Google Analytics**: Basic user analytics
- **Plausible**: Privacy-focused analytics
- **Fathom**: Simple, privacy-focused analytics

## 🔒 Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use different values for development and production
- Rotate API keys regularly

### 2. Content Security Policy

Add CSP headers to your deployment:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';">
```

### 3. HTTPS Only

- Force HTTPS redirects
- Use HSTS headers
- Ensure all external resources use HTTPS

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify Supabase credentials

3. **Database Connection**
   - Check Supabase project status
   - Verify RLS policies are correct
   - Test database connection locally

4. **Performance Issues**
   - Enable code splitting
   - Optimize bundle size
   - Use CDN for static assets

### Getting Help

1. Check the [README.md](README.md) for setup instructions
2. Review [database-setup.sql](database-setup.sql) for database issues
3. Open an issue on GitHub for bugs or feature requests
4. Check deployment platform documentation

## 📈 Scaling Considerations

### 1. Database Scaling

- Monitor Supabase usage limits
- Consider upgrading Supabase plan
- Implement database connection pooling

### 2. CDN and Caching

- Use Vercel's edge network
- Implement service worker for offline support
- Cache static assets aggressively

### 3. Performance Optimization

- Implement lazy loading for images
- Use React.lazy() for code splitting
- Optimize bundle size with tree shaking

## 🎉 Success!

Once deployed, your Blog CMS will be:

- ✅ **Production Ready**: Optimized for performance and security
- ✅ **Scalable**: Built to handle growth
- ✅ **Maintainable**: Clean code structure and documentation
- ✅ **Professional**: Ready for portfolio or business use

Remember to:
- Monitor performance regularly
- Keep dependencies updated
- Backup your database regularly
- Test new features in staging before production

Happy blogging! 🚀
