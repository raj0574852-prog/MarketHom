import React from 'react';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabaseClient';
import RelatedPublisherLogo from './RelatedPublisherLogo';

export default async function RelatedWebsites({ categoryId, currentId }: { categoryId: string, currentId: string }) {
  const supabase = getServiceSupabase();
  
  // Query up to 4 publishers with ID > currentId
  const { data: nextRelated } = await supabase
    .from('website_listings')
    .select('id, slug, name, domain, category_id, price, currency, logo_url, content_placement_price, content_placement_selling_price')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .gt('id', currentId)
    .order('id', { ascending: true })
    .limit(4);

  // Query up to 4 publishers with ID < currentId
  const { data: prevRelated } = await supabase
    .from('website_listings')
    .select('id, slug, name, domain, category_id, price, currency, logo_url, content_placement_price, content_placement_selling_price')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .lt('id', currentId)
    .order('id', { ascending: false })
    .limit(4);

  const nextList = nextRelated || [];
  const prevList = prevRelated || [];
  
  let related: typeof nextList = [];
  
  // Distribute equally (2 from each side) or fill from the other side if bounded
  if (nextList.length >= 2 && prevList.length >= 2) {
    related = [...nextList.slice(0, 2), ...prevList.slice(0, 2)];
  } else if (nextList.length < 2) {
    related = [...nextList, ...prevList.slice(0, 4 - nextList.length)];
  } else {
    related = [...nextList.slice(0, 4 - prevList.length), ...prevList];
  }

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-slate-200 pt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Similar in {categoryId}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map(site => (
          <Link key={site.id} href={`/websites/${site.slug}`} className="bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex overflow-hidden group hover:border-[hsl(217,91%,54%)]/50 cursor-pointer rounded-3xl flex-col">
            <div className="p-6 flex-1 flex flex-col relative w-full">
              <div className="flex items-start justify-end mb-5">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full uppercase tracking-wider truncate max-w-[50%] inline-block text-right">
                  {site.category_id}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[hsl(217,91%,54%)] transition-colors line-clamp-1">{site.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-5 w-full">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <span className="truncate">{site.domain}</span>
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-1 leading-relaxed">
                {/* Related endpoints don't have short_description loaded right now, so use fallback */}
                Premium publishing opportunity on {site.domain}. Secure high-quality backlinks.
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
                    <div className="text-xl font-bold text-[hsl(217,91%,54%)] mt-2">Buy Now</div>
                  )}
                </div>
                <div className="px-5 py-2.5 bg-white text-[hsl(217,91%,54%)] font-bold text-sm rounded-xl group-hover:bg-[hsl(217,91%,54%)] group-hover:text-white transition-colors border border-[hsl(217,91%,54%)]/20 group-hover:border-transparent shadow-sm hover:shadow-md">
                  View Details
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
