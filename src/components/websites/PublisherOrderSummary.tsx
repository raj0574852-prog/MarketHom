import React from 'react';
import { WebsiteListing } from './types';
import { CANONICAL_SITE_URL } from '@/lib/constants';

export function PublisherOrderSummary({ website }: { website: WebsiteListing }) {
  const whatsappNumber = "918824896910";
  const pageUrl = `${CANONICAL_SITE_URL}/website/${website.slug}`;
  const whatsappMessage = encodeURIComponent(`I want to purchase the placement on ${website.name || website.domain}. Here is the link: ${pageUrl}`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden sticky top-6">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Order Summary</h3>
        
        {website.content_placement_selling_price ? (
          <>
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium text-slate-700">Content Placement</span>
              <span className="text-lg font-bold text-slate-900">
                {website.currency === 'USD' ? '$' : website.currency}{website.content_placement_selling_price}
              </span>
            </div>
            {website.discount_price && (
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-slate-500">Regular Price</span>
                <span className="text-sm font-medium text-slate-400 line-through">
                  {website.currency === 'USD' ? '$' : website.currency}{website.discount_price}
                </span>
              </div>
            )}
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              You provide the written article. Publisher publishes it on their site permanently.
            </p>
          </>
        ) : (
          <div className="mb-4">
            <span className="text-lg font-bold text-slate-900">Contact for Pricing</span>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Price varies. Please contact us for a quote on this publisher.
            </p>
          </div>
        )}
      </div>
      
      <div className="p-6 bg-slate-50/50">
        <div className="space-y-3 mb-6">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all duration-200 flex justify-center items-center gap-2"
          >
            Buy Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          
          <a 
            href={website.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-sm transition-all duration-200 text-sm"
          >
            Visit Website
          </a>
        </div>

        <div className="pt-5 border-t border-slate-200 grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            Save to List
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
