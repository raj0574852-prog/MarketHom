import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/blog/posts';
import { getServiceSupabase } from '@/lib/supabaseClient';

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
    '/websites', // Added marketplace base route
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/blog' || route === '/websites' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : (route === '/websites' ? 0.9 : 0.8),
  }));

  // Fetch dynamic blog posts from Supabase
  const dynamicBlogPosts = await getPublishedPosts();

  const blogRoutes = dynamicBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Fetch published websites
  const supabase = getServiceSupabase();
  const { data: websites } = await supabase
    .from('website_listings')
    .select('slug, updated_at')
    .eq('status', 'published');

  const websiteRoutes = (websites || []).map((site) => ({
    url: `${baseUrl}/websites/${site.slug}`,
    lastModified: new Date(site.updated_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...websiteRoutes];
}
