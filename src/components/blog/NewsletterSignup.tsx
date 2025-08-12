import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubscribe?: (email: string) => Promise<void>;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = '',
  variant = 'default',
  title = 'Stay Updated',
  description = 'Get the latest posts and updates delivered to your inbox.',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  onSubscribe
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError('');
    
    if (value && !validateEmail(value)) {
      setIsValidEmail(false);
    } else {
      setIsValidEmail(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsValidEmail(false);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        // Default behavior - simulate subscription
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (variant === 'hero') {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white ${className}`}>
        <div className="text-center max-w-md mx-auto">
          <EnvelopeIcon className="mx-auto h-12 w-12 mb-4 text-white/80" />
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-blue-100 mb-6">{description}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="w-full bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40"
                disabled={isSubmitting || isSuccess}
              />
              {!isValidEmail && email && (
                <ExclamationTriangleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-300" />
              )}
            </div>
            
            {error && (
              <p className="text-yellow-200 text-sm">{error}</p>
            )}
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-white text-blue-600 hover:bg-gray-100 border-0"
              disabled={isSubmitting || isSuccess || !email.trim() || !isValidEmail}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Subscribing...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Subscribed!
                </>
              ) : (
                buttonText
              )}
            </Button>
          </form>
          
          <p className="text-xs text-blue-200 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <EnvelopeIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              size={16}
              className="w-32"
              disabled={isSubmitting || isSuccess}
            />
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || isSuccess || !email.trim() || !isValidEmail}
            >
              {isSubmitting ? '...' : isSuccess ? '✓' : buttonText}
            </Button>
          </form>
        </div>
        
        {error && (
          <p className="text-red-600 text-xs mt-2">{error}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="text-center mb-6">
        <EnvelopeIcon className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className={`w-full ${!isValidEmail && email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            disabled={isSubmitting || isSuccess}
          />
          {!isValidEmail && email && (
            <ExclamationTriangleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <ExclamationTriangleIcon className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting || isSuccess || !email.trim() || !isValidEmail}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Subscribing...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Successfully Subscribed!
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          By subscribing, you agree to our{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
            Privacy Policy
          </a>
          {' '}and{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-700 underline">
            Terms of Service
          </a>
        </p>
      </div>

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              Welcome to our newsletter! Check your email for a confirmation.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
