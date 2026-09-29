import React from 'react';
import { WebsiteListing } from './types';
import PublisherLogo from './PublisherLogo';

export default function WebsiteHero({ website }: { website: WebsiteListing }) {
  const isVerified = website.verification_status === 'verified' && website.last_verified_at;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-shrink-0">
          <PublisherLogo domain={website.domain} name={website.name} className="w-24 h-24 lg:w-32 lg:h-32" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {website.category_id && (
              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md">{website.category_id}</span>
            )}
            {isVerified && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-blue-100">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </span>
            )}
            {website.featured && (
              <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md border border-amber-100">Featured</span>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Publish Guest Post on {website.domain}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
            <a href={website.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100/50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              {website.domain}
              <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            
            {website.location && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {website.location}
              </span>
            )}
            
            {website.language && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                {website.language}
              </span>
            )}
          </div>
          
          {website.short_description && (
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mt-4">
              {website.price && website.content_placement_selling_price
                ? website.short_description.split(`$${website.price}`).join(`$${website.content_placement_selling_price}`)
                : website.short_description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
