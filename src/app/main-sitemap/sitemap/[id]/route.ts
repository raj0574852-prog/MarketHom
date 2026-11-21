export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getPublishedPosts } from '@/lib/blog/posts';
import { CANONICAL_SITE_URL } from '@/lib/constants';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const baseUrl = CANONICAL_SITE_URL;
  const { id } = await context.params;
  
  // The route matches /main-sitemap/sitemap/0.xml, so id is "0.xml"
  const cleanId = id.replace('.xml', '');
  const chunkId = Number(cleanId);
  if (!Number.isFinite(chunkId) || chunkId !== 0) {
    return new Response('Not Found', { status: 404 });
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

  // Static agency routes (Marketplace /websites permanently decommissioned & excluded)
  const staticRoutes = [
    '', '/about', '/contact', '/pricing', '/services',
    '/services/seo', '/services/ai-seo', '/services/ppc',
    '/services/smm', '/services/link-building', '/services/guest-posting',
    '/services/web-development', '/blog', '/case-studies',
    '/resources', '/resources/privacy-policy', '/resources/terms-of-service',
    '/resources/refund-policy', '/resources/cookie-policy',
  ];

  for (const route of staticRoutes) {
    const changeFreq = route === '/blog' ? 'daily' : 'weekly';
    const priority = route === '' ? 1.0 : (route === '/blog' ? 0.9 : 0.8);
    addUrl(`${baseUrl}${route}`, new Date().toISOString(), changeFreq, priority);
  }

  try {
    const dynamicBlogPosts = await getPublishedPosts();
    for (const post of dynamicBlogPosts) {
      addUrl(`${baseUrl}/blog/${post.slug}`, post.date, 'daily', 0.9);
    }
  } catch (e) {
    console.error('Error fetching blog posts for sitemap:', e);
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
