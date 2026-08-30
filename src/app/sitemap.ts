import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/blog/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.educationhom.com';
  
  const staticRoutes = [
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
    changeFrequency: route === '/blog' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch dynamic blog posts from Supabase
  const dynamicBlogPosts = await getPublishedPosts();

  const blogRoutes = dynamicBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...blogRoutes];
}
