import React from 'react';
import { WebsiteListing } from './types';

export default function QuickOverview({ website }: { website: WebsiteListing }) {
  const categoryName = website.category_id || 'General';
  const displayPrice = website.content_placement_selling_price;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {website.name && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Publisher</span>
            <span className="text-slate-900 font-medium">{website.name}</span>
          </div>
        )}
        {website.domain && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Domain</span>
            <span className="text-slate-900 font-medium">{website.domain}</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</span>
          <span className="text-slate-900 font-medium">{categoryName}</span>
        </div>
        {website.link_validity && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Link Type</span>
            <span className="text-slate-900 font-medium">{website.link_validity}</span>
          </div>
        )}
        {website.language && website.language.toLowerCase() !== 'not specified' && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Language</span>
            <span className="text-slate-900 font-medium">{website.language}</span>
          </div>
        )}
        {website.location && website.location.toLowerCase() !== 'not specified' && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</span>
            <span className="text-slate-900 font-medium">{website.location}</span>
          </div>
        )}
        {website.turnaround_time && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Turnaround Time</span>
            <span className="text-slate-900 font-medium">{website.turnaround_time} Days</span>
          </div>
        )}
        {displayPrice && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Starting Price</span>
            <span className="text-slate-900 font-medium">${displayPrice} {website.currency || 'USD'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
