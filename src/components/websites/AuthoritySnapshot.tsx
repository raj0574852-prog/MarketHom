import React from 'react';

export default function AuthoritySnapshot({ metrics }: { metrics?: any[] }) {
  if (!metrics || metrics.length === 0) return null;

  const getMetric = (type: string) => metrics.find(m => m.metric_type === type);

  const da = getMetric('DA');
  const dr = getMetric('DR');
  const as = getMetric('SEMRUSH_AUTHORITY');

  // If no primary authority metrics exist, don't show the snapshot section
  if (!da && !dr && !as) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Authority Snapshot
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dr && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center items-center text-center">
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{dr.value}</div>
            <div className="text-sm font-bold text-slate-700">Domain Rating</div>
            <div className="text-xs text-slate-500 mt-1">Provider: Ahrefs</div>
          </div>
        )}
        
        {da && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center items-center text-center">
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{da.value}</div>
            <div className="text-sm font-bold text-slate-700">Domain Authority</div>
            <div className="text-xs text-slate-500 mt-1">Provider: Moz</div>
          </div>
        )}
        
        {as && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center items-center text-center">
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{as.value}</div>
            <div className="text-sm font-bold text-slate-700">Authority Score</div>
            <div className="text-xs text-slate-500 mt-1">Provider: Semrush</div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-sm text-slate-500 italic bg-blue-50/50 p-4 rounded-lg border border-blue-100/50">
        <strong>Note:</strong> These metrics are comparative estimations provided by third-party SEO tools (Ahrefs, Moz, Semrush). They represent estimated domain strength and are not official Google search ranking scores.
      </div>
    </div>
  );
}
