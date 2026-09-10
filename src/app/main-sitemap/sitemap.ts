import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/blog/posts';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { CANONICAL_SITE_URL } from '@/lib/constants';

const CHUNK_SIZE = 5000;

export const dynamic = 'force-dynamic';

export async function generateSitemaps() {
  const supabase = getServiceSupabase();
  
  // Use exact count to determine chunks since sitemap index generation happens at build/revalidate time
  // and we must guarantee complete coverage of all eligible URLs.
  const { count, error } = await supabase
    .from('website_listings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .not('slug', 'is', null);

  if (error || count === null) {
    console.error('Error fetching sitemap chunks:', error);
    return [{ id: 0 }];
  }

  const totalChunks = Math.ceil(count / CHUNK_SIZE);
  return Array.from({ length: totalChunks || 1 }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number | string }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = CANONICAL_SITE_URL;
  
  const chunkId = Number(id);
  if (!Number.isFinite(chunkId) || chunkId < 0) {
    return [];
  }

  // Chunk 0 gets static routes and blog posts
  const routes: MetadataRoute.Sitemap = [];
  
  if (chunkId === 0) {
    const staticRoutes = [
      '', '/about', '/contact', '/pricing', '/services',
      '/services/seo', '/services/ai-seo', '/services/ppc',
      '/services/smm', '/services/link-building', '/services/guest-posting',
      '/services/web-development', '/blog', '/case-studies', '/websites',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: route === '/blog' || route === '/websites' ? ('daily' as const) : ('weekly' as const),
      priority: route === '' ? 1.0 : (route === '/websites' ? 0.9 : 0.8),
    }));
    routes.push(...staticRoutes);

    const dynamicBlogPosts = await getPublishedPosts();
    const blogRoutes = dynamicBlogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      ...(post.date ? { lastModified: new Date(post.date) } : {}),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
    routes.push(...blogRoutes);
  }

  // Fetch the specific chunk of websites
  const supabase = getServiceSupabase();
  const start = chunkId * CHUNK_SIZE;
  const end = start + CHUNK_SIZE - 1;

  const { data: websites } = await supabase
    .from('website_listings')
    .select('slug, updated_at, created_at, last_verified_at, last_synced_at')
    .eq('status', 'published')
    .not('slug', 'is', null)
    .order('id', { ascending: true })
    .range(start, end);

  if (websites) {
    const websiteRoutes = websites.map((site) => {
      const lastModDate = site.last_synced_at || site.updated_at || site.created_at || site.last_verified_at;
      return {
        url: `${baseUrl}/websites/${site.slug}`,
        ...(lastModDate ? { lastModified: new Date(lastModDate) } : {}),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });
    routes.push(...websiteRoutes);
  }

  return routes;
}
