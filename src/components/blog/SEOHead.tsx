import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'blog';
  publishedAt?: string;
  modifiedAt?: string;
  author?: {
    name: string;
    url?: string;
  };
  tags?: string[];
  section?: string;
  twitterHandle?: string;
  siteName?: string;
  siteUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  image,
  type = 'website',
  publishedAt,
  modifiedAt,
  author,
  tags = [],
  section,
  twitterHandle,
  siteName = 'My Blog',
  siteUrl = 'https://myblog.com',
  noindex = false,
  nofollow = false
}) => {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/default-og-image.jpg`;
  const fullCanonical = canonical ? (canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`) : undefined;

  // Generate structured data for articles
  const generateStructuredData = () => {
    if (type === 'article' && publishedAt) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: fullImage,
        author: author ? {
          '@type': 'Person',
          name: author.name,
          url: author.url
        } : undefined,
        publisher: {
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`
          }
        },
        datePublished: publishedAt,
        dateModified: modifiedAt || publishedAt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullCanonical || `${siteUrl}`
        },
        articleSection: section,
        keywords: tags.join(', '),
        ...(tags.length > 0 && { keywords: tags.join(', ') })
      };
    }

    // Default website structured data
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
      description: description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  };

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1');
    
    // Canonical URL
    if (fullCanonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', fullCanonical);
    }

    // Robots Meta
    if (noindex || nofollow) {
      updateMetaTag('robots', `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`);
    }

    // Open Graph Meta Tags
    updateMetaTag('og:title', title, 'og:title');
    updateMetaTag('og:description', description, 'og:description');
    updateMetaTag('og:type', type, 'og:type');
    updateMetaTag('og:url', fullCanonical || `${siteUrl}`, 'og:url');
    updateMetaTag('og:image', fullImage, 'og:image');
    updateMetaTag('og:site_name', siteName, 'og:site_name');
    updateMetaTag('og:locale', 'en_US', 'og:locale');
    
    // Article specific Open Graph tags
    if (type === 'article') {
      if (publishedAt) updateMetaTag('article:published_time', publishedAt, 'article:published_time');
      if (modifiedAt) updateMetaTag('article:modified_time', modifiedAt, 'article:modified_time');
      if (author) updateMetaTag('article:author', author.url || `${siteUrl}/author/${author.name}`, 'article:author');
      if (section) updateMetaTag('article:section', section, 'article:section');
      tags.forEach((tag) => {
        updateMetaTag(`article:tag`, tag, `article:tag`);
      });
    }

    // Twitter Card Meta Tags
    updateMetaTag('twitter:card', 'summary_large_image', 'twitter:card');
    updateMetaTag('twitter:title', title, 'twitter:title');
    updateMetaTag('twitter:description', description, 'twitter:description');
    updateMetaTag('twitter:image', fullImage, 'twitter:image');
    if (twitterHandle) updateMetaTag('twitter:site', twitterHandle, 'twitter:site');
    if (author && twitterHandle) updateMetaTag('twitter:creator', twitterHandle, 'twitter:creator');

    // Additional Meta Tags
    updateMetaTag('author', author?.name || siteName);
    if (tags.length > 0) updateMetaTag('keywords', tags.join(', '));
    
    // Article specific meta tags
    if (type === 'article' && publishedAt) {
      updateMetaTag('article:published_time', publishedAt, 'article:published_time');
    }
    if (type === 'article' && modifiedAt) {
      updateMetaTag('article:modified_time', modifiedAt, 'article:modified_time');
    }

    // Additional SEO Meta Tags
    updateMetaTag('theme-color', '#3B82F6');
    updateMetaTag('msapplication-TileColor', '#3B82F6');
    
    // Language and region
    updateMetaTag('content-language', 'en', 'http-equiv');
    updateMetaTag('language', 'en');
    updateMetaTag('geo.region', 'US');
    
    // Mobile optimization
    updateMetaTag('format-detection', 'telephone=no');
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('apple-mobile-web-app-title', siteName);
    
    // Security headers
    updateMetaTag('X-UA-Compatible', 'IE=edge', 'http-equiv');
    updateMetaTag('referrer', 'strict-origin-when-cross-origin');

    // Add structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(generateStructuredData());
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Reset title to default if needed
      document.title = siteName;
    };
  }, [title, description, canonical, image, type, publishedAt, modifiedAt, author, tags, section, twitterHandle, siteName, siteUrl, noindex, nofollow, fullTitle, fullImage, fullCanonical]);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;
