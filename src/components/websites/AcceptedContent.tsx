import React from 'react';
import { WebsiteListing } from './types';

export default function AcceptedContent({ website }: { website: WebsiteListing }) {
  const accepted = website.accepted_niches || [];
  const rejected = website.rejected_niches || [];

  if (accepted.length === 0 && rejected.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Accepted Content Niches</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {accepted.length > 0 && (
          <div>
            <h3 className="font-semibold text-green-700 flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Accepted Niches
            </h3>
            <ul className="space-y-2">
              {accepted.map((niche: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {niche}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {rejected.length > 0 && (
          <div>
            <h3 className="font-semibold text-red-700 flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              Strictly Prohibited
            </h3>
            <ul className="space-y-2">
              {rejected.map((niche: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 bg-red-50/50 px-3 py-2 rounded-lg border border-red-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  {niche}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
