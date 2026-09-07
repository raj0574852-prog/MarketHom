import React from 'react';
import { WebsiteListing } from './types';

export default function WebsiteHero({ website }: { website: WebsiteListing }) {
  const verifiedDate = website.last_verified_at 
    ? new Date(website.last_verified_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8">
      <div className="space-y-4">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Publish Guest Post on {website.name}
        </h1>
        
        {/* Links and Location Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 font-medium">
          <a href={website.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
            Visit Website
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          
          {website.location && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              {website.location}
            </span>
          )}
          
          {website.language && <span>• {website.language}</span>}
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {website.category_id && (
            <span className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
              {website.category_id}
            </span>
          )}
          {website.verification_status === 'verified' && verifiedDate && (
            <span className="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Verified {verifiedDate}
            </span>
          )}
          {website.featured && (
            <span className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>
        
        {/* Description */}
        {website.short_description && (
          <p className="text-slate-600 text-lg leading-relaxed max-w-3xl pt-2">
            {website.short_description}
          </p>
        )}
      </div>
    </div>
  );
}
