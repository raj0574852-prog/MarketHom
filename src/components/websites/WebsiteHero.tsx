import React from 'react';
import { WebsiteListing } from './types';

export default function WebsiteHero({ website }: { website: WebsiteListing }) {
  const verifiedDate = website.last_verified_at 
    ? new Date(website.last_verified_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {website.logo_url ? (
          <img src={website.logo_url} alt={`${website.name} logo`} className="w-24 h-24 rounded-xl border border-slate-100 object-cover shadow-sm bg-white" />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl shadow-sm">
            {website.name.charAt(0)}
          </div>
        )}
        
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{website.category_id}</span>
            {website.verification_status === 'verified' && verifiedDate && (
              <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified {verifiedDate}
              </span>
            )}
            {website.featured && (
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md">Featured</span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Publish Guest Post on {website.domain}
          </h1>
          
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href={website.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                {website.domain}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              {website.location && <span>• {website.location}</span>}
              {website.language && <span>• {website.language}</span>}
            </div>
            
            {website.link_validity && (
              <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                {website.link_validity} Link Included
              </div>
            )}
          </div>
          
          {website.short_description && (
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mt-2">
              {website.short_description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
