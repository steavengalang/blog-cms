import React, { useState } from 'react';
import { EnvelopeIcon, CheckIcon } from '@heroicons/react/24/outline';

interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({
  title = "Subscribe to our newsletter",
  description = "Get the latest posts and updates delivered to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  className = ""
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setError('');

    try {
      // TODO: Implement newsletter subscription API call
      // const response = await supabase
      //   .from('newsletter_subscribers')
      //   .insert({ email: email.trim() });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  if (isSubscribed) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <CheckIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-green-900 mb-2">
          Successfully subscribed!
        </h3>
        <p className="text-green-700">
          Thank you for subscribing to our newsletter. You'll receive updates about new posts and content.
        </p>
        <button
          onClick={() => setIsSubscribed(false)}
          className="mt-4 text-sm text-green-600 hover:text-green-700 underline"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <EnvelopeIcon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={placeholder}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              disabled={isSubscribing}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubscribing || !email.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubscribing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Subscribing...
            </div>
          ) : (
            buttonText
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default Newsletter;
