import React from 'react';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { getRelatedPublishersFromCatalog } from '@/lib/publishers/catalogLookup';
import { ArrowRight, Sparkles } from 'lucide-react';

export default async function RelatedWebsites({ 
  categoryId, 
  currentId,
  currentPrice 
}: { 
  categoryId: string, 
  currentId: string,
  currentPrice?: number
}) {
  let uniqueSites: any[] = [];
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );

  if (isSupabaseConfigured) {
    try {
      const supabase = getServiceSupabase();
      const { data: relatedData } = await supabase
        .from('website_listings')
        .select('id, slug, name, domain, category_id, currency, content_placement_selling_price, website_metrics(metric_type, value)')
        .eq('status', 'published')
        .eq('category_id', categoryId)
        .neq('id', currentId)
        .not('slug', 'is', null)
        .not('domain', 'is', null)
        .limit(10);

      if (relatedData && relatedData.length > 0) {
        const uniqueDomains = new Map();
        relatedData.forEach(site => {
          if (!uniqueDomains.has(site.domain.toLowerCase())) {
            uniqueDomains.set(site.domain.toLowerCase(), site);
          }
        });
        uniqueSites = Array.from(uniqueDomains.values());
      }
    } catch {
      // Supabase optional fallback
    }
  }

  // If Supabase returned fewer than 3, fallback to local catalog
  if (uniqueSites.length < 3) {
    const excludeDomain = currentId.replace('cat-', '').replace('syn-', '');
    const catalogFallback = await getRelatedPublishersFromCatalog(categoryId, excludeDomain, 3);
    for (const item of catalogFallback) {
      if (!uniqueSites.some(s => s.domain === item.domain)) {
        uniqueSites.push(item);
      }
      if (uniqueSites.length >= 3) break;
    }
  }

  const related = uniqueSites.slice(0, 3);
  if (related.length === 0) return null;

  return (
    <div className="mt-14 border-t border-white/10 pt-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Alternative Publisher Placements</h2>
        </div>
        <Link href="/websites" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
          Explore All Publishers
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {related.map(site => {
          const metrics = site.website_metrics || [];
          const getMetric = (type: string) => metrics.find((m: { metric_type: string; value: string | number }) => m.metric_type === type)?.value ?? 'N/A';
          const da = getMetric('DA');
          const dr = getMetric('DR');
          let traffic = getMetric('ORGANIC_TRAFFIC');
          if (traffic === 'N/A') traffic = getMetric('SEMRUSH_TRAFFIC');
          if (traffic === 'N/A') traffic = getMetric('TRAFFIC');
          
          if (typeof traffic === 'number') {
            traffic = traffic > 1000 ? (traffic / 1000).toFixed(1) + 'K' : traffic.toString();
          }

          const firstLetter = (site.name || site.domain).charAt(0).toUpperCase();
          const price = site.content_placement_selling_price || site.price || 49;
          const currency = site.currency === 'USD' || !site.currency ? '$' : site.currency;

          return (
            <Link 
              key={site.id || site.slug} 
              href={`/website/${site.slug}`} 
              className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-base shrink-0">
                    {firstLetter}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate group-hover:text-cyan-300 transition-colors" title={site.domain}>
                      {site.domain}
                    </h3>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                      {site.category_id || 'General'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-950/60 rounded-xl p-2 text-center border border-white/5">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">DR</div>
                    <div className="text-sm font-bold text-emerald-400">{dr}</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-2 text-center border border-white/5">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">DA</div>
                    <div className="text-sm font-bold text-blue-400">{da}</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-2 text-center border border-white/5">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Visits</div>
                    <div className="text-sm font-bold text-cyan-400">{traffic}</div>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-3.5 bg-slate-950/40 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Fixed Rate</div>
                  <div className="text-base font-extrabold text-white">
                    {currency}{price}
                  </div>
                </div>
                <div className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
