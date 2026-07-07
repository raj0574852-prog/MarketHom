import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://markethom.agency';
  
  const routes = [
    '',
    '/about',
    '/contact',
    '/pricing',
    '/services',
    '/services/seo',
    '/services/ai-seo',
    '/services/ppc',
    '/services/smm',
    '/services/link-building',
    '/services/guest-posting',
    '/services/web-development',
    '/blog',
    '/case-studies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
