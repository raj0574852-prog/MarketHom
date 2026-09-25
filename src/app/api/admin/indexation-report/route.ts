import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { evaluatePublisherIndexability } from '@/lib/seo/evaluatePublisherIndexability';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Simple auth for the diagnostic script
  const url = new URL(request.url);
  if (url.searchParams.get('token') !== 'diagnostic-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const limit = 1000;
  let offset = 0;
  let allWebsites: any[] = [];
  
  while (true) {
    const { data, error } = await supabase
      .from('website_listings')
      .select('*')
      .range(offset, offset + limit - 1);
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      break;
    }
    
    allWebsites = allWebsites.concat(data);
    offset += limit;
    
    if (data.length < limit) break; // Reached the end
  }

  const stats = {
    total: allWebsites.length,
    classification: {
      INDEX: 0,
      IMPROVE: 0,
      NOINDEX: 0,
      EXCLUDE: 0
    },
    missing: {
      description: 0,
      specific_category: 0,
      niches: 0,
      placement_info: 0,
      pricing: 0,
      metrics: 0,
      slug: 0
    },
    scores: {} as Record<string, number>
  };

  const results = allWebsites.map(site => {
    const res = evaluatePublisherIndexability(site);
    
    stats.classification[res.classification]++;
    
    res.missingSignals.forEach(signal => {
      if (stats.missing[signal as keyof typeof stats.missing] !== undefined) {
        stats.missing[signal as keyof typeof stats.missing]++;
      }
    });

    const scoreBucket = Math.floor(res.score / 10) * 10;
    stats.scores[scoreBucket] = (stats.scores[scoreBucket] || 0) + 1;

    return {
      slug: site.slug,
      domain: site.domain,
      score: res.score,
      classification: res.classification
    };
  });

  return NextResponse.json({ stats, sample: results.slice(0, 100) });
}
