import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/blog/posts';
import { getServiceSupabase } from '@/lib/supabaseClient';

import { CANONICAL_SITE_URL } from '@/lib/constants';
import { evaluatePublisherIndexability } from '@/lib/seo/qualityGate';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = CANONICAL_SITE_URL;
  
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
    changeFrequency: route === '/blog' || route === '/websites' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : (route === '/websites' ? 0.9 : 0.8),
  }));

  // Fetch dynamic blog posts from Supabase
  const dynamicBlogPosts = await getPublishedPosts();

  const blogRoutes = dynamicBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    ...(post.date ? { lastModified: new Date(post.date) } : {}),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Fetch published websites
  const supabase = getServiceSupabase();
  const { data: websites } = await supabase
    .from('website_listings')
    .select('*, website_metrics(*)')
    .eq('status', 'published');

  const websiteRoutes = (websites || [])
    .filter((site) => evaluatePublisherIndexability(site).indexable)
    .map((site) => {
      const lastModDate = site.last_synced_at || site.updated_at || site.created_at;
      return {
        url: `${baseUrl}/websites/${site.slug}`,
        ...(lastModDate ? { lastModified: new Date(lastModDate) } : {}),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });

  return [...staticRoutes, ...blogRoutes, ...websiteRoutes];
}
