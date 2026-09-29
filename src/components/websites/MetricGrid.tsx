import React from 'react';

const metricInfo: Record<string, { label: string, description: string, provider: string }> = {
  'ORGANIC_TRAFFIC': { 
    label: 'Organic Traffic', 
    description: 'Estimated monthly organic search visits. Shows if the site actually gets real visitors and is visible in search engines.',
    provider: 'Ahrefs / Semrush'
  },
  'SPAM_SCORE': { 
    label: 'Spam Score', 
    description: 'The percentage of sites with similar features to this site that have been penalized or banned by Google.',
    provider: 'Moz'
  },
  'TOTAL_BACKLINKS': { 
    label: 'Total Backlinks', 
    description: 'The absolute total number of links pointing to this website from across the internet.',
    provider: 'Ahrefs / Moz'
  },
  'REFERRING_DOMAINS': { 
    label: 'Referring Domains', 
    description: 'The number of unique websites (domains) that link to this site. Often a better indicator of authority than total backlinks.',
    provider: 'Ahrefs / Moz'
  },
  'AHREFS_TRAFFIC': { 
    label: 'Ahrefs Traffic', 
    description: 'Ahrefs\' specific estimation of the domain\'s monthly organic search traffic.',
    provider: 'Ahrefs'
  }
};

export default function MetricGrid({ metrics, linkValidity }: { metrics?: any[], linkValidity?: string | null }) {
  if (!metrics || metrics.length === 0) return null;
  
  const getMetricData = (type: string) => {
    return metrics.find(m => m.metric_type === type) || null;
  };

  const renderCard = (type: string) => {
    const data = getMetricData(type);
    const info = metricInfo[type];
    
    // We only render it if we have data for it OR if we explicitly want to show N/A
    // But since the rule says "If a metric does not exist: omit it, or display N/A where appropriate"
    // We'll only show the card if it has a value to keep the UI clean, unless it's a critical one.
    if (!info) return null;

    const value = data && data.value !== null ? data.value : 'N/A';
    const unit = data && data.unit ? data.unit : '';

    return (
      <div key={type} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col justify-between h-full">
        <h3 className="text-sm font-semibold text-slate-500 mb-4 flex items-center justify-between">
          {info.label}
          <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-help transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className="absolute bottom-full right-0 md:left-1/2 md:-translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none">
              <p className="font-bold mb-1">{info.label}</p>
              <p className="mb-2 text-slate-300">{info.description}</p>
              <div className="absolute -bottom-1 right-2 md:left-1/2 md:-translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </div>
        </h3>
        
        <div>
          <p className="text-2xl font-bold text-slate-900 mb-1">
            {value}{value !== 'N/A' && unit ? ` ${unit}` : ''}
          </p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            By {info.provider}
          </p>
        </div>
      </div>
    );
  };

  const secondaryMetrics = Object.keys(metricInfo).filter(type => getMetricData(type));

  if (secondaryMetrics.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Publisher Metrics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryMetrics.map(type => renderCard(type))}
      </div>
    </div>
  );
}
