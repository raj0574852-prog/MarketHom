export const dynamic = 'force-dynamic';

import { getServiceSupabase } from '@/lib/supabaseClient';
import { CANONICAL_SITE_URL } from '@/lib/constants';

const CHUNK_SIZE = 5000;

export async function GET() {
  const supabase = getServiceSupabase();
  
  const { count, error } = await supabase
    .from('website_listings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .not('slug', 'is', null);

  if (error || count === null) {
    console.error('Error fetching sitemap chunks for index:', error);
    // Fallback to a single chunk if error
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${CANONICAL_SITE_URL}/main-sitemap/sitemap/0.xml</loc>\n  </sitemap>\n</sitemapindex>`,
      { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=0, must-revalidate' } }
    );
  }

  const totalChunks = Math.ceil(count / CHUNK_SIZE) || 1;
  
  let sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  for (let i = 0; i < totalChunks; i++) {
    sitemapIndexXml += `  <sitemap>\n    <loc>${CANONICAL_SITE_URL}/main-sitemap/sitemap/${i}.xml</loc>\n  </sitemap>\n`;
  }
  
  sitemapIndexXml += `</sitemapindex>`;

  return new Response(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
