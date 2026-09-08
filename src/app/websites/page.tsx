import React from 'react';
import Link from 'next/link';
import SearchFilter from '@/components/websites/SearchFilter';
import Pagination from '@/components/websites/Pagination';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO Marketplace | Premium Website Listings',
  description: 'Browse our exclusive catalog of premium websites accepting guest posts and link placements. Boost your SEO with high DA/DR websites.',
  alternates: {
    canonical: 'https://educationhom.com/websites',
  }
};

export const revalidate = 60; // Revalidate every minute

export default async function WebsitesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = getServiceSupabase();
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const country = typeof params.country === 'string' ? params.country : '';

  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  
  // Use the new View that includes metrics as columns
  let query = supabase
    .from('website_listings')
    .select('id, slug, name, domain, category_id, price, currency, logo_url, short_description, content_placement_price, content_placement_selling_price', { count: 'exact' })
    .eq('status', 'published')
    .eq('is_listed', true);

  if (q) query = query.or(`domain.ilike.%${q}%,name.ilike.%${q}%`);
  if (category) query = query.eq('category_id', category);
  if (country) query = query.eq('country', country);

  let { data: websites, error, count } = await query
    .order('featured', { ascending: false })
    .range(offset, offset + limit - 1);

  // Fallback mock data for preview if DB connection fails or view missing
  if (error || !websites) {
    websites = [
      {
        id: 'mock-1',
        slug: 'channillo.com',
        name: 'Channillo',
        domain: 'channillo.com',
        category_id: 'General',
        price: 23,
        currency: 'USD',
        logo_url: null,
        short_description: 'Premium publishing opportunity on channillo.com.',
        content_placement_price: null,
        content_placement_selling_price: null
      }
    ];
    count = 1;
  }
  
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const view = typeof params.view === 'string' && params.view === 'list' ? 'list' : 'grid';
  
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24">
      {/* Hero Section */}
      <div className="bg-[hsl(222,47%,7%)] text-white pt-36 pb-20 border-b border-slate-800 relative overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[hsl(217,91%,54%)]/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">SEO Placement <span className="text-[hsl(217,91%,54%)]">Marketplace</span></h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Discover premium, verified websites for guest posting, niche edits, and content syndication to supercharge your SEO.
          </p>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8">
        <SearchFilter />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {!websites || websites.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Listings Found</h2>
            <p className="text-slate-500">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
            {websites.map(site => (
              <div key={site.id} className={`bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex overflow-hidden group hover:border-[hsl(217,91%,54%)]/50 cursor-pointer ${view === 'grid' ? 'rounded-3xl flex-col' : 'rounded-2xl flex-col sm:flex-row items-center p-4 gap-6'}`}>
                {view === 'grid' ? (
                  // GRID VIEW
                  <div className="p-6 flex-1 flex flex-col relative w-full">
                    <div className="flex items-start justify-between mb-5">
                      {site.logo_url ? (
                        <img src={site.logo_url} alt={site.name} className="w-14 h-14 rounded-2xl object-cover bg-slate-50 border border-slate-100 shadow-sm" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-2xl border border-slate-200 shadow-inner">
                          {site.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {site.category_id}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[hsl(217,91%,54%)] transition-colors line-clamp-1">{site.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      {site.domain}
                    </div>
                    
                    <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-1 leading-relaxed">
                      {site.short_description || `Premium publishing opportunity on ${site.domain}. Secure high-quality backlinks.`}
                    </p>
                    
                    <div className="border-t border-slate-100 pt-5 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-0.5">Starting At</span>
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                          {site.currency === 'USD' ? '$' : site.currency}{site.content_placement_selling_price || site.price || '0'}
                        </div>
                      </div>
                      <Link href={`/websites/${site.slug}`} className="px-5 py-2.5 bg-white text-[hsl(217,91%,54%)] font-bold text-sm rounded-xl group-hover:bg-[hsl(217,91%,54%)] group-hover:text-white transition-colors border border-[hsl(217,91%,54%)]/20 group-hover:border-transparent shadow-sm hover:shadow-md">
                        View Details
                      </Link>
                    </div>
                  </div>
                ) : (
                  // LIST VIEW
                  <>
                    <div className="shrink-0 flex items-center justify-center">
                      {site.logo_url ? (
                        <img src={site.logo_url} alt={site.name} className="w-20 h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100 shadow-sm" />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-3xl border border-slate-200 shadow-inner">
                          {site.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[hsl(217,91%,54%)] transition-colors truncate">{site.name}</h3>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                          {site.category_id}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        {site.domain}
                      </div>
                      
                      <p className="text-sm text-slate-600 line-clamp-1 leading-relaxed hidden sm:block">
                        {site.short_description || `Premium publishing opportunity on ${site.domain}. Secure high-quality backlinks.`}
                      </p>
                    </div>
                    
                    <div className="sm:border-l border-slate-100 sm:pl-6 flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-0.5">Starting At</span>
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                          {site.currency === 'USD' ? '$' : site.currency}{site.content_placement_selling_price || site.price || '0'}
                        </div>
                      </div>
                      <Link href={`/websites/${site.slug}`} className="px-5 py-2.5 bg-white text-[hsl(217,91%,54%)] font-bold text-sm rounded-xl group-hover:bg-[hsl(217,91%,54%)] group-hover:text-white transition-colors border border-[hsl(217,91%,54%)]/20 group-hover:border-transparent shadow-sm hover:shadow-md mt-0 sm:mt-3">
                        View Details
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        {websites && websites.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} />
        )}
      </div>
    </div>
  );
}
