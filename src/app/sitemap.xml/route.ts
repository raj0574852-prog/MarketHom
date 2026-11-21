export const dynamic = 'force-dynamic';

import { CANONICAL_SITE_URL } from '@/lib/constants';

export async function GET() {
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${CANONICAL_SITE_URL}/main-sitemap/sitemap/0.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
