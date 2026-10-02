import React from 'react';

export function PreviewSimilarSites() {
  const similarSites = [
    { domain: "techmapz.com", category: "Technology", dr: 34, da: 18, traffic: "12K", price: "$8.00" },
    { domain: "business-tips.org", category: "Business", dr: 42, da: 31, traffic: "N/A", price: "$15.00" },
    { domain: "startupguys.net", category: "Business", dr: 51, da: 44, traffic: "8K", price: "$22.00" },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Similar Publisher Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarSites.map((site, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200 group flex flex-col h-full">
            <div className="p-5 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0 border border-blue-100">
                  {site.domain.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm truncate max-w-[160px]" title={site.domain}>{site.domain}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{site.category}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 rounded p-2 text-center border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">DR</div>
                  <div className="text-sm font-semibold text-slate-800">{site.dr}</div>
                </div>
                <div className="bg-slate-50 rounded p-2 text-center border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">DA</div>
                  <div className="text-sm font-semibold text-slate-800">{site.da}</div>
                </div>
                <div className="bg-slate-50 rounded p-2 text-center border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Traffic</div>
                  <div className="text-sm font-semibold text-slate-800">{site.traffic}</div>
                </div>
              </div>
            </div>
            
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Starting at</div>
                <div className="text-base font-bold text-slate-900">{site.price}</div>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Site
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
