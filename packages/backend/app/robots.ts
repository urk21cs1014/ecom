import type { MetadataRoute } from 'next';

// Backend/admin app should never be crawled
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}

