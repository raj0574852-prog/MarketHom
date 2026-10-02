import { getServiceSupabase } from '@/lib/supabaseClient';
import { evaluatePublisherIndexability } from '@/lib/seo/evaluatePublisherIndexability';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = getServiceSupabase();
  const start = 1000;
  const end = 1999;

  const { data: websites, error } = await supabase
    .from('website_listings')
    .select('*')
    .eq('status', 'published')
    .not('slug', 'is', null)
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    return Response.json({ error: error.message });
  }

  const results = (websites || []).map(site => {
    const evaluation = evaluatePublisherIndexability(site);
    return {
      slug: site.slug,
      is_listed: site.is_listed,
      domain: site.domain,
      sitemapEligible: evaluation.sitemapEligible,
      isTechnicallyEligible: site.status === 'published' && site.is_listed !== false && !!site.slug && !!site.domain
    };
  });

  return Response.json({
    count: websites?.length || 0,
    sample: results.slice(0, 5)
  });
}
