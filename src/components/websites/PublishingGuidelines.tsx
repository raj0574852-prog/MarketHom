import React from 'react';
import { WebsiteListing } from './types';

export default function PublishingGuidelines({ website }: { website: WebsiteListing }) {
  if (!website) return null;

  const hasGuidelines = 
    website.turnaround_time || 
    website.article_length || 
    website.max_dofollow_links !== undefined || 
    website.max_nofollow_links !== undefined ||
    website.link_validity ||
    website.original_content_required !== undefined ||
    website.sponsored_label !== undefined ||
    website.ai_content_policy ||
    website.link_policy ||
    website.editorial_review;

  if (!hasGuidelines) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Publishing Guidelines
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Content Requirements */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Content Requirements</h3>
          <ul className="space-y-3">
            {website.article_length && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                <div>
                  <span className="block text-sm font-semibold text-slate-700">Word Count</span>
                  <span className="block text-sm text-slate-600">{website.article_length}</span>
                </div>
              </li>
            )}
            
            {website.original_content_required !== undefined && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <div>
                  <span className="block text-sm font-semibold text-slate-700">Originality</span>
                  <span className="block text-sm text-slate-600">{website.original_content_required ? '100% Original Content Required' : 'Syndicated Content Allowed'}</span>
                </div>
              </li>
            )}
            
            {website.ai_content_policy && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <div>
                  <span className="block text-sm font-semibold text-slate-700">AI Policy</span>
                  <span className="block text-sm text-slate-600">{website.ai_content_policy}</span>
                </div>
              </li>
            )}
            
            {website.editorial_review && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <div>
                  <span className="block text-sm font-semibold text-slate-700">Editorial Review</span>
                  <span className="block text-sm text-slate-600">{website.editorial_review}</span>
                </div>
              </li>
            )}
          </ul>
        </div>
        
        {/* Link & Editorial Policy */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Link & Editorial Policy</h3>
          <ul className="space-y-3">
            {(website.max_dofollow_links !== undefined || website.max_nofollow_links !== undefined) && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <div>
                  <span className="block text-sm font-semibold text-slate-700">Allowed Links</span>
                  <span className="block text-sm text-slate-600">
                    {website.max_dofollow_links !== undefined ? `${website.max_dofollow_links} Dofollow` : ''} 
                    {website.max_dofollow_links !== undefined && website.max_nofollow_links !== undefined ? ' / ' : ''}
                    {website.max_nofollow_links !== undefined ? `${website.max_nofollow_links} Nofollow` : ''}
                  </span>
                </div>
              </li>
            )}
            
            {website.link_validity && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <span className="block text-sm font-semibold text-slate-700">Link Validity</span>
                  <span className="block text-sm text-slate-600">{website.link_validity}</span>
                </div>
              </li>
            )}
            
            {website.sponsored_label !== undefined && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                <div>
                  <span className="block text-sm font-semibold text-slate-700">Sponsored Tag</span>
                  <span className="block text-sm text-slate-600">{website.sponsored_label ? 'Article will be marked as sponsored' : 'No sponsored tag applied'}</span>
                </div>
              </li>
            )}
            
            {website.turnaround_time && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <span className="block text-sm font-semibold text-slate-700">Turnaround Time</span>
                  <span className="block text-sm text-slate-600">{website.turnaround_time}</span>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
