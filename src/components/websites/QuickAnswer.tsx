import React from 'react';
import { WebsiteListing } from './types';

export default function QuickAnswer({ website }: { website: WebsiteListing }) {
  if (!website) return null;

  const { domain, name, category_id, content_placement_selling_price } = website;
  const displayName = name || domain;
  const displayCategory = category_id && category_id !== 'General' ? category_id : 'various topics';

  // Constructing a factual, AEO-friendly quick answer
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8">
      <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-[hsl(217,91%,54%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Quick Answer
      </h2>
      <div className="text-slate-700 leading-relaxed text-base">
        <strong>{displayName}</strong> is a publishing platform covering {displayCategory}. 
        Its primary domain is {domain}.
        {content_placement_selling_price ? (
          <> Content placements and guest posts on {domain} are currently available starting at ${content_placement_selling_price} USD.</>
        ) : null}
      </div>
    </div>
  );
}
