import { MetadataRoute } from 'next';
import { SITE_URL, isIndexingAllowed } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const allowIndexing = isIndexingAllowed();

  if (!allowIndexing) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
