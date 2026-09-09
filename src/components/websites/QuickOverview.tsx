import React from 'react';
import { WebsiteListing } from './types';

export default function QuickOverview({ website }: { website: WebsiteListing }) {
  const da = website.website_metrics?.find((m: any) => m.metric_type === 'DA')?.value;
  const pa = website.website_metrics?.find((m: any) => m.metric_type === 'PA')?.value;
  const dr = website.website_metrics?.find((m: any) => m.metric_type === 'DR')?.value;
  const traffic = website.website_metrics?.find((m: any) => m.metric_type === 'ORGANIC_TRAFFIC')?.value;
  
  const categoryName = website.category_id || 'General';

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
        {website.content_placement_price && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Starting Price</span>
            <span className="text-slate-900 font-medium">${website.content_placement_price} USD</span>
          </div>
        )}
        {da && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Domain Authority (DA)</span>
            <span className="text-slate-900 font-medium">{da}</span>
          </div>
        )}
        {pa && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Page Authority (PA)</span>
            <span className="text-slate-900 font-medium">{pa}</span>
          </div>
        )}
        {dr && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Domain Rating (DR)</span>
            <span className="text-slate-900 font-medium">{dr}</span>
          </div>
        )}
        {traffic && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Organic Traffic</span>
            <span className="text-slate-900 font-medium">{traffic.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
