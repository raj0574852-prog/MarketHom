import { MetadataRoute } from 'next';
import { CANONICAL_SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/', 
        '/admin/',
        '/*?q=*',      // Block site search URLs
        '/*?view=*',   // Block view toggle URLs
        '/*?sort=*',   // Block sorting URLs
        // We do NOT block ?page= because we still want pagination to be crawlable as a fallback
        // We do NOT block ?category= globally because it's noindex,follow and might help discover deep links if reached
      ],
    },
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
  };
}
