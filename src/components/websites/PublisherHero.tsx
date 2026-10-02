import React from 'react';
import { WebsiteListing } from './types';
import PublisherLogo from './PublisherLogo';

export function PublisherHero({ website }: { website: WebsiteListing }) {
  const isVerified = website.verification_status === 'verified' && website.last_verified_at;

  return (
    <div className="relative w-full rounded-t-2xl overflow-hidden bg-white shadow-sm border border-slate-200 mb-8">
      {/* Hero Background - Using a premium gradient instead of an external image dependency to ensure reliability across all categories */}
      <div className="w-full h-[200px] md:h-[280px] bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black"></div>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative px-6 pb-8 md:px-10 md:pb-10 -mt-12 md:-mt-16 flex flex-col md:flex-row gap-6">
        {/* Logo Container */}
        <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative z-10 p-2">
          <PublisherLogo domain={website.domain} name={website.name} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 pt-2 md:pt-16">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {website.link_validity === 'DoFollow' && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-md">
                DoFollow
              </span>
            )}
            {website.category_id && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 rounded-md">
                {website.category_id}
              </span>
            )}
            {website.location && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 rounded-md flex items-center gap-1">
                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {website.location}
              </span>
            )}
            {isVerified && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 leading-tight tracking-tight">
            Publish Guest Post on <span className="text-blue-600">{website.domain}</span>
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <a href={website.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {website.domain}
            </a>
          </div>

          {website.short_description && (
            <p className="text-slate-600 text-[15px] md:text-base leading-relaxed max-w-3xl mt-2">
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
