import React from 'react';
import { WebsiteListing } from './types';

export default function PricingCard({ website }: { website: WebsiteListing }) {
  const whatsappNumber = "918824896910";
  // Use a generic placeholder for the domain, or window.location.origin if it were client-side.
  const pageUrl = `https://educationhom.com/websites/${website.slug}`;
  const whatsappMessage = encodeURIComponent(`I want to purchase the placement on ${website.name}. Here is the link: ${pageUrl}`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 lg:p-8">
      <div className="space-y-6">
        {(website.content_placement_selling_price || website.price) ? (
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Starting At</p>
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  {website.currency === 'USD' ? '$' : website.currency}
                  {website.content_placement_selling_price || website.price}
                </span>
                {website.discount_price && (
                  <span className="text-lg text-slate-400 line-through">
                    {website.currency === 'USD' ? '$' : website.currency}{website.discount_price}
                  </span>
                )}
              </div>
              {website.link_validity && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md uppercase tracking-wider border border-emerald-200">
                  {website.link_validity} Link
                </span>
              )}
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-block text-center py-4 px-6 bg-[hsl(217,91%,54%)] hover:bg-[hsl(217,91%,45%)] text-white font-bold rounded-xl shadow-lg shadow-[hsl(217,91%,54%)]/25 transition-all active:scale-[0.98] text-lg"
          >
            Buy Now
          </a>
          
          <a 
            href={website.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors"
          >
            Visit Website
          </a>
        </div>

        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
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
