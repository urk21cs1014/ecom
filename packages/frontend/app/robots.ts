import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://continentalpipes.com'; // Fallback for dev

  if (isProduction) {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api/*'],
        },
      ],
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  } else {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }
}

