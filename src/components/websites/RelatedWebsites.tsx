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
    .select('id, slug, name, domain, category_id, currency, content_placement_selling_price')
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

  // Take exactly 4
  const related = sortedSites.slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 border-t border-slate-200 pt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Similar in {categoryId}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map(site => (
          <a key={site.id} href={`/website/${site.slug}`} className="bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex overflow-hidden group hover:border-blue-500/50 cursor-pointer rounded-3xl flex-col">
            <div className="p-6 flex-1 flex flex-col relative w-full">
              <div className="flex items-start justify-end mb-5">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full uppercase tracking-wider truncate max-w-[50%] inline-block text-right">
                  {site.category_id}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{site.name || site.domain}</h3>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-5 w-full">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <span className="truncate">{site.domain}</span>
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-1 leading-relaxed">
                Premium publishing opportunity on {site.domain}. Request a guest post today.
              </p>
              
              <div className="border-t border-slate-100 pt-5 flex items-center justify-between mt-auto">
                <div>
                  {(site.content_placement_selling_price) ? (
                    <>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-0.5">Starting At</span>
                      <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {site.currency === 'USD' ? '$' : site.currency}{site.content_placement_selling_price}
                      </div>
                    </>
                  ) : (
                    <div className="text-xl font-bold text-blue-600 mt-2">View Price</div>
                  )}
                </div>
                <div className="px-4 py-2 bg-slate-50 text-blue-600 font-bold text-sm rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-100 group-hover:border-transparent">
                  View Publisher
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
