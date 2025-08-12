import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useBlogStore } from './store';
import { authApi } from './services/supabase';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import PostDetailPage from './pages/PostDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

// Admin Pages
import Dashboard from './components/admin/Dashboard';
import PostEditor from './components/admin/PostEditor';
import CategoryManager from './components/admin/CategoryManager';
import CommentModeration from './components/admin/CommentModeration';
import MediaUpload from './components/admin/MediaUpload';
import SettingsPanel from './components/admin/SettingsPanel';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useBlogStore();
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { setIsAuthenticated, setUser, setAuthLoading } = useBlogStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { session } = await authApi.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url,
            role: session.user.user_metadata?.role || 'viewer',
            status: 'active',
            createdAt: new Date(session.user.created_at),
          });
        }
        setAuthLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const setupAuthListener = async () => {
      const { data: { subscription } } = await authApi.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            setIsAuthenticated(true);
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              avatar: session.user.user_metadata?.avatar_url,
              role: session.user.user_metadata?.role || 'viewer',
              status: 'active',
              createdAt: new Date(session.user.created_at),
            });
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            setUser(null);
          }
          setAuthLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    };

    setupAuthListener();
  }, [setIsAuthenticated, setUser, setAuthLoading]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
      <Route path="/post/:slug" element={<Layout><PostDetailPage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="/signin" element={<Layout><SignInPage /></Layout>} />
      <Route path="/signup" element={<Layout><SignUpPage /></Layout>} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <PostEditor />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/new"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <PostEditor />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <PostEditor />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CategoryManager />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/comments"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CommentModeration />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/media"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <MediaUpload />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SettingsPanel />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
