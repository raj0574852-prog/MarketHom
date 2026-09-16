import React from 'react';
import { WebsiteListing } from './types';

export default function PublishingOpportunity({ website }: { website: WebsiteListing }) {
  const rows = [];
  
  if (website.publication_type) {
    rows.push({ label: 'Placement type', value: website.publication_type });
  }
  
  if (website.link_validity) {
    rows.push({ label: 'Link policy', value: website.link_validity });
  }
  
  if (website.max_dofollow_links) {
    rows.push({ label: 'Maximum DoFollow links', value: website.max_dofollow_links });
  }
  
  if (website.turnaround_time) {
    rows.push({ label: 'Turnaround time', value: website.turnaround_time });
  }

  if (rows.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Publishing Opportunity</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-4 font-semibold text-slate-700 bg-slate-50 w-1/3 rounded-tl-lg">Attribute</th>
              <th className="py-3 px-4 font-semibold text-slate-700 bg-slate-50 rounded-tr-lg">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                <td className="py-3 px-4 text-slate-600 font-medium">{row.label}</td>
                <td className="py-3 px-4 text-slate-900">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
