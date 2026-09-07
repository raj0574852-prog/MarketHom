import React from 'react';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabaseClient';

export default async function RelatedWebsites({ categoryId, currentId }: { categoryId: string, currentId: string }) {
  const supabase = getServiceSupabase();
  
  const { data: related, error } = await supabase
    .from('website_listings')
    .select('id, slug, name, domain, category_id, price, currency, logo_url, content_placement_price')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', currentId)
    .limit(4);

  if (error || !related || related.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-slate-200 pt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Similar in {categoryId}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map(site => (
          <Link key={site.id} href={`/websites/${site.slug}`} className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-[hsl(217,91%,54%)]">
            <div className="p-5 flex flex-col items-center text-center">
              {site.logo_url ? (
                <img src={site.logo_url} alt={site.name} className="w-16 h-16 rounded-lg object-cover bg-slate-50 mb-4 shadow-sm" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl mb-4 shadow-sm">
                  {site.name.charAt(0)}
                </div>
              )}
              <h3 className="font-bold text-slate-900 group-hover:text-[hsl(217,91%,54%)] transition-colors line-clamp-1">{site.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{site.domain}</p>
              <div className="w-full pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{site.category_id}</span>
                <span className="font-bold text-slate-900">
                  {site.currency === 'USD' ? '$' : site.currency}{site.price || site.content_placement_price || '0'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
