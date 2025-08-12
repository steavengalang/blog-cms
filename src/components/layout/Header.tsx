import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useBlogStore } from '../../store';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, isAuthenticated, user } = useBlogStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be implemented
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Blog CMS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    // Sign out functionality will be implemented
                    console.log('Signing out');
                  }}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <div className="pt-4 space-y-2">
              <Link
                to="/"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/categories"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t border-gray-200 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/admin"
                      className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        console.log('Signing out');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 text-base font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/signin"
                      className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base font-medium text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
