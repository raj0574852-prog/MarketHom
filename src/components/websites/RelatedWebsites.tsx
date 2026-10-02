import React from 'react';
import { getServiceSupabase } from '@/lib/supabaseClient';

export default async function RelatedWebsites({ 
  categoryId, 
  currentId,
  currentPrice 
}: { 
  categoryId: string, 
  currentId: string,
  currentPrice?: number
}) {
  const supabase = getServiceSupabase();
  
  // Fetch up to 20 publishers in the same category
  const { data: relatedData } = await supabase
    .from('website_listings')
    .select('id, slug, name, domain, category_id, currency, content_placement_selling_price, website_metrics(metric_type, value)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', currentId)
    .not('slug', 'is', null) // basic sanity check
    .not('domain', 'is', null)
    .limit(20);

  if (!relatedData || relatedData.length === 0) {
    return null;
  }

  // Remove exact duplicate domains if they somehow exist
  const uniqueDomains = new Map();
  relatedData.forEach(site => {
    if (!uniqueDomains.has(site.domain.toLowerCase())) {
      uniqueDomains.set(site.domain.toLowerCase(), site);
    }
  });

  const uniqueSites = Array.from(uniqueDomains.values());

  // Deterministic sorting based on price similarity (if available), then alphabetically
  const sortedSites = uniqueSites.sort((a, b) => {
    if (currentPrice !== undefined) {
      const priceA = a.content_placement_selling_price || 0;
      const priceB = b.content_placement_selling_price || 0;
      
      const diffA = Math.abs(priceA - currentPrice);
      const diffB = Math.abs(priceB - currentPrice);
      
      if (diffA !== diffB) {
        return diffA - diffB; // Closest price first
      }
    }
    
    // Fallback deterministic sort by domain
    return a.domain.localeCompare(b.domain);
  });

  // Take exactly 3 to match PreviewSimilarSites
  const related = sortedSites.slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 border-t border-slate-200 pt-12">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Similar Publisher Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map(site => {
          // Extract metrics safely
          const metrics = site.website_metrics || [];
          const getMetric = (type: string) => metrics.find((m: any) => m.metric_type === type)?.value ?? 'N/A';
          const da = getMetric('DA');
          const dr = getMetric('DR');
          let traffic = getMetric('ORGANIC_TRAFFIC');
          if (traffic === 'N/A') traffic = getMetric('SEMRUSH_TRAFFIC');
          if (traffic === 'N/A') traffic = getMetric('TRAFFIC');
          
          if (typeof traffic === 'number') {
            traffic = traffic > 1000 ? (traffic / 1000).toFixed(1) + 'K' : traffic.toString();
          }

          const firstLetter = (site.name || site.domain).charAt(0).toUpperCase();

          return (
            <a key={site.id} href={`/website/${site.slug}`} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200 group flex flex-col h-full">
              <div className="p-5 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0 border border-blue-100">
                    {firstLetter}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm truncate max-w-[160px]" title={site.domain}>{site.domain}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{site.category_id}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-50 rounded p-2 text-center border border-slate-100">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">DR</div>
                    <div className="text-sm font-semibold text-slate-800">{dr}</div>
                  </div>
                  <div className="bg-slate-50 rounded p-2 text-center border border-slate-100">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">DA</div>
                    <div className="text-sm font-semibold text-slate-800">{da}</div>
                  </div>
                  <div className="bg-slate-50 rounded p-2 text-center border border-slate-100">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Traffic</div>
                    <div className="text-sm font-semibold text-slate-800">{traffic}</div>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Starting at</div>
                  <div className="text-base font-bold text-slate-900">
                    {site.content_placement_selling_price ? `${site.currency === 'USD' ? '$' : site.currency}${site.content_placement_selling_price}` : 'View Price'}
                  </div>
                </div>
                <div className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Site
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
