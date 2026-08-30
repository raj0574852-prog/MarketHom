import { MetadataRoute } from 'next';
import { INITIAL_POSTS, BlogPost } from '@/lib/blogStore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://educationhom.com';
  
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

  // Fetch dynamic blog posts from server memory / API
  let dynamicBlogPosts: BlogPost[] = INITIAL_POSTS;

  try {
    const globalForBlog = globalThis as unknown as { serverPosts: BlogPost[] | undefined };
    if (globalForBlog.serverPosts && Array.isArray(globalForBlog.serverPosts)) {
      dynamicBlogPosts = globalForBlog.serverPosts;
    }
  } catch (e) {}

  const blogRoutes = dynamicBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...blogRoutes];
}
