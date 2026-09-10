export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getPublishedPosts } from '@/lib/blog/posts';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { CANONICAL_SITE_URL } from '@/lib/constants';

const CHUNK_SIZE = 5000;

export async function GET(request: Request, context: any) {
  const baseUrl = CANONICAL_SITE_URL;
  const { id } = await context.params;
  
  // The route matches /main-sitemap/sitemap/0.xml, so id is "0.xml"
  const cleanId = id.replace('.xml', '');
  const chunkId = Number(cleanId);
  if (!Number.isFinite(chunkId) || chunkId < 0) {
    return new Response('Invalid sitemap chunk ID', { status: 400 });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Helper to generate url element
  const addUrl = (url: string, lastMod?: Date | string, changeFreq?: string, priority?: number) => {
    let entry = `  <url>\n    <loc>${url}</loc>\n`;
    if (lastMod) {
      const dateStr = lastMod instanceof Date ? lastMod.toISOString() : new Date(lastMod).toISOString();
      entry += `    <lastmod>${dateStr}</lastmod>\n`;
    }
    if (changeFreq) entry += `    <changefreq>${changeFreq}</changefreq>\n`;
    if (priority) entry += `    <priority>${priority.toFixed(1)}</priority>\n`;
    entry += `  </url>\n`;
    xml += entry;
  };

  // Chunk 0 gets static routes and blog posts
  if (chunkId === 0) {
    const staticRoutes = [
      '', '/about', '/contact', '/pricing', '/services',
      '/services/seo', '/services/ai-seo', '/services/ppc',
      '/services/smm', '/services/link-building', '/services/guest-posting',
      '/services/web-development', '/blog', '/case-studies', '/websites',
    ];

    for (const route of staticRoutes) {
      const changeFreq = route === '/blog' || route === '/websites' ? 'daily' : 'weekly';
      const priority = route === '' ? 1.0 : (route === '/websites' ? 0.9 : 0.8);
      addUrl(`${baseUrl}${route}`, undefined, changeFreq, priority);
    }

    try {
      const dynamicBlogPosts = await getPublishedPosts();
      for (const post of dynamicBlogPosts) {
        addUrl(`${baseUrl}/blog/${post.slug}`, post.date, 'daily', 0.9);
      }
    } catch (e) {
      console.error('Error fetching blog posts for sitemap:', e);
    }
  }

  // Fetch the specific chunk of websites
  const supabase = getServiceSupabase();
  const start = chunkId * CHUNK_SIZE;
  const end = start + CHUNK_SIZE - 1;

  const { data: websites, error } = await supabase
    .from('website_listings')
    .select('slug, updated_at, created_at, last_verified_at, last_synced_at')
    .eq('status', 'published')
    .not('slug', 'is', null)
    .order('id', { ascending: true })
    .range(start, end);

  if (error) {
    console.error('Error fetching websites for sitemap chunk:', error);
  }

  if (websites) {
    for (const site of websites) {
      const lastModDate = site.last_synced_at || site.updated_at || site.created_at || site.last_verified_at;
      addUrl(`${baseUrl}/websites/${site.slug}`, lastModDate, 'weekly', 0.8);
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
