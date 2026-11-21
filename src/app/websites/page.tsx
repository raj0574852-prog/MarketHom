import React from 'react';
import Link from 'next/link';
import SearchFilter from '@/components/websites/SearchFilter';
import Pagination from '@/components/websites/Pagination';
import PublisherLogo from '@/components/websites/PublisherLogo';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { queryCatalogPublishers } from '@/lib/publishers/catalogLookup';
import { Metadata } from 'next';
import { CANONICAL_SITE_URL } from '@/lib/constants';
import { ArrowRight, Globe, ShieldCheck, Sparkles, TrendingUp, Layers } from 'lucide-react';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const hasQueryParams = Object.keys(params).length > 0;

  return {
    title: 'Digital Publisher Marketplace | 29,000+ Verified Websites | MarketHom',
    description: 'Browse our exclusive catalog of verified websites accepting guest posts and permanent DoFollow placements. Boost your organic rankings with elite DA/DR publications.',
    alternates: {
      canonical: `${CANONICAL_SITE_URL}/websites`,
    },
    robots: {
      index: !hasQueryParams,
      follow: true,
    }
  };
}

export const revalidate = 60;

export default async function WebsitesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const country = typeof params.country === 'string' ? params.country : '';
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  let websites: any[] = [];
  let totalCount = 0;
  let totalPages = 1;

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );

  if (isSupabaseConfigured) {
    try {
      const supabase = getServiceSupabase();
      let query = supabase
        .from('website_listings')
        .select('id, slug, name, domain, category_id, price, currency, logo_url, short_description, content_placement_price, content_placement_selling_price, location, website_metrics(metric_type, value, unit)', { count: 'exact' })
        .eq('status', 'published')
        .eq('is_listed', true);

      if (q) query = query.or(`domain.ilike.%${q}%,name.ilike.%${q}%`);
      if (category) query = query.eq('category_id', category);
      if (country) query = query.eq('country', country);

      const { data, count, error } = await query
        .order('featured', { ascending: false })
        .range(offset, offset + limit - 1);

      if (!error && data && data.length > 0) {
        websites = data;
        totalCount = count || 0;
        totalPages = Math.ceil(totalCount / limit);
      }
    } catch {
      // Supabase failed, fall through to catalog lookup
    }
  }

  // Fallback to local 29,118 catalog dataset
  if (websites.length === 0) {
    const catalogData = await queryCatalogPublishers({
      q,
      category,
      country,
      page,
      limit
    });
    websites = catalogData.websites;
    totalCount = catalogData.total;
    totalPages = catalogData.totalPages;
  }

  const view = typeof params.view === 'string' && params.view === 'list' ? 'list' : 'grid';

  const categoryPills = [
    'Technology', 'Business', 'Finance', 'Crypto', 
    'Health', 'Travel', 'Real Estate', 'Marketing', 'Gaming'
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-28 pt-28 relative overflow-hidden">
      {/* Background ambient radial glows */}
      <div className="absolute top-10 left-1/3 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-8 pb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>29,118+ Verified Digital Publishers</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white leading-tight">
          SEO Placement{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
            Marketplace
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
          Access high-authority publications for permanent DoFollow backlinks, verified indexing SLA, and direct editorial syndication.
        </p>

        {/* Category Filter Hubs */}
        <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
          {categoryPills.map(cat => {
            const isSelected = category.toLowerCase() === cat.toLowerCase();
            return (
              <Link 
                key={cat} 
                href={`/websites?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
                  isSelected 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]' 
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-cyan-400/40 hover:text-white'
                }`}
              >
                {cat}
              </Link>
            );
          })}
          <Link 
            href="/websites"
            className="px-4 py-2 text-xs font-semibold rounded-full border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white transition-colors"
          >
            All Niches
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-4 sm:px-6 lg:px-8 relative z-20">
        <SearchFilter totalSites={totalCount} />
      </div>

      {/* Catalog Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 relative z-10" id="marketplace-results">
        {websites.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">No Matching Publishers Found</h2>
            <p className="text-slate-400 text-sm font-light">Try adjusting your search terms, country filters, or niche categories.</p>
            <Link href="/websites" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg">
              Reset Filters
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Showing {offset + 1}–{Math.min(offset + limit, totalCount)} of {totalCount.toLocaleString()} Verified Publishers</span>
              </div>
              <span className="text-slate-500">Page {page} of {totalPages}</span>
            </div>

            <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
              {websites.map(site => {
                let da = 0;
                let dr = 0;
                let traffic = 0;

                if (site.website_metrics && Array.isArray(site.website_metrics)) {
                  for (const m of site.website_metrics) {
                    const t = m.metric_type?.toUpperCase();
                    if (t === 'DA' || t === 'DOMAIN_AUTHORITY') da = Number(m.value) || 0;
                    if (t === 'DR' || t === 'DOMAIN_RATING') dr = Number(m.value) || 0;
                    if (t === 'SEMRUSH_TRAFFIC' || t === 'ORGANIC_TRAFFIC' || t === 'TRAFFIC') traffic = Number(m.value) || 0;
                  }
                }

                let tier = 'Verified Partner';
                let tierBadge = 'bg-blue-500/10 text-blue-300 border-blue-500/20';

                if (da >= 50 || dr >= 50 || traffic >= 30000) {
                  tier = 'Elite Authority';
                  tierBadge = 'bg-amber-400/10 text-amber-300 border-amber-400/30';
                } else if (da >= 30 || dr >= 30 || traffic >= 5000) {
                  tier = 'Premium Publisher';
                  tierBadge = 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30';
                }

                const price = site.content_placement_selling_price || site.price || 49;
                const currency = site.currency === 'USD' || !site.currency ? '$' : site.currency;

                return (
                  <Link 
                    key={site.id || site.slug} 
                    href={`/website/${site.slug}`}
                    className={`bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-300 flex flex-col justify-between group ${
                      view === 'list' ? 'sm:flex-row sm:items-center p-5 gap-6' : 'p-6'
                    }`}
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="w-12 h-12 bg-slate-950/80 rounded-2xl border border-white/10 flex items-center justify-center p-2.5 overflow-hidden group-hover:border-cyan-400/30 transition-colors shrink-0">
                          <PublisherLogo domain={site.domain} name={site.name} className="w-full h-full object-contain" />
                        </div>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${tierBadge}`}>
                          {tier}
                        </span>
                      </div>

                      {/* Domain and Category */}
                      <div className="mb-4">
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate" title={site.domain}>
                          {site.domain}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span>{site.category_id || 'General'}</span>
                          {site.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3 text-cyan-400" />
                                {site.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 3 Metric Pills */}
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        <div className="bg-slate-950/60 rounded-xl p-2.5 text-center border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Moz DA</span>
                          <span className="text-sm font-black text-blue-400">{da || 'Verified'}</span>
                        </div>
                        <div className="bg-slate-950/60 rounded-xl p-2.5 text-center border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Ahrefs DR</span>
                          <span className="text-sm font-black text-emerald-400">{dr || 'Verified'}</span>
                        </div>
                        <div className="bg-slate-950/60 rounded-xl p-2.5 text-center border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Traffic</span>
                          <span className="text-sm font-black text-cyan-400">
                            {traffic > 1000 ? `${(traffic / 1000).toFixed(1)}k` : (traffic > 0 ? traffic : 'Active')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & CTA */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Placement Rate</span>
                        <span className="text-lg font-black text-white">{currency}{price}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 text-xs font-bold text-slate-300 group-hover:text-white transition-all shadow-sm">
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  );
}
