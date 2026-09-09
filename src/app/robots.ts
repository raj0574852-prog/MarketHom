import { MetadataRoute } from 'next';
import { CANONICAL_SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'],
    },
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
  };
}
