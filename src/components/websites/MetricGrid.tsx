import React from 'react';

const metricInfo: Record<string, { label: string, description: string, what: string, how: string, limit: string }> = {
  'DA': { 
    label: 'Domain Authority (DA)', 
    description: 'Moz metric predicting ranking potential.',
    what: 'A score from 1-100 developed by Moz that predicts how likely a website is to rank in search engine result pages (SERPs).',
    how: 'A higher DA generally means the site has a strong backlink profile and established trust.',
    limit: 'DA is a third-party metric, not used by Google. A high DA does not guarantee rankings.'
  },
  'DR': { 
    label: 'Domain Rating (DR)', 
    description: 'Ahrefs metric for backlink profile strength.',
    what: 'A score from 0-100 developed by Ahrefs showing the strength of a website\'s backlink profile compared to others.',
    how: 'Useful for quickly gauging the raw link power and authority of the referring domain.',
    limit: 'DR only looks at links, ignoring content quality, traffic, and relevance. High DR does not mean Google trusts the site.'
  },
  'ORGANIC_TRAFFIC': { 
    label: 'Organic Traffic', 
    description: 'Estimated monthly organic search visits.',
    what: 'The estimated number of monthly visits the website receives from unpaid search engine results.',
    how: 'Shows if the site actually gets real visitors and is visible in search engines.',
    limit: 'These are third-party estimates and can sometimes vary wildly from actual Google Analytics data.'
  },
  'SEMRUSH_AUTHORITY': { 
    label: 'Semrush Authority Score', 
    description: 'Semrush metric for overall domain quality.',
    what: 'A compound metric measuring a domain\'s overall quality and SEO performance.',
    how: 'Evaluates link power, organic traffic, and spam factors into a single score.',
    limit: 'Third-party metric that Google does not use.'
  },
  'SPAM_SCORE': { 
    label: 'Spam Score', 
    description: 'Moz percentage of penalized features.',
    what: 'The percentage of sites with similar features to this site that have been penalized or banned by Google.',
    how: 'Helps identify potentially toxic or manipulative link sources.',
    limit: 'A high Spam Score means Moz flagged it, not that Google has actually penalized the website.'
  },
  'TOTAL_BACKLINKS': { 
    label: 'Total Backlinks', 
    description: 'Total number of inbound links.',
    what: 'The absolute total number of links pointing to this website from across the internet.',
    how: 'Shows the sheer scale of the website\'s link building history.',
    limit: 'Quantity does not equal quality. Many backlinks could be low-quality or spam.'
  },
  'REFERRING_DOMAINS': { 
    label: 'Referring Domains', 
    description: 'Number of unique linking websites.',
    what: 'The number of unique websites (domains) that link to this site.',
    how: 'Often a better indicator of authority than total backlinks, as it shows diverse support.',
    limit: 'Still does not account for the quality or relevance of those referring domains.'
  },
  'AHREFS_TRAFFIC': { 
    label: 'Ahrefs Traffic', 
    description: 'Ahrefs estimate of monthly traffic.',
    what: 'Ahrefs\' specific estimation of the domain\'s monthly organic search traffic.',
    how: 'A widely trusted industry standard for estimating a site\'s organic visibility.',
    limit: 'Estimates are based on keyword tracking and CTR models, not direct server logs.'
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MetricGrid({ metrics }: { metrics: any[] }) {
  
  const getMetricData = (type: string) => {
    return metrics?.find(m => m.metric_type === type) || null;
  };

  const renderCard = (type: string) => {
    const data = getMetricData(type);
    const info = metricInfo[type];
    if (!info) return null;

    const value = data && data.value !== null ? data.value : 'N/A';
    const unit = data && data.unit ? data.unit : '';

    return (
      <div key={type} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group">
        <h3 className="text-sm font-semibold text-slate-500 mb-2 flex items-center gap-1">
          {info.label}
          <div className="relative flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold cursor-help">
            ?
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
              <p className="font-bold mb-1">{info.label}</p>
              <p>{info.description}</p>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </div>
        </h3>
        <p className="text-2xl font-bold text-slate-900">
          {value}{value !== 'N/A' ? unit : ''}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">SEO Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(metricInfo).map(type => renderCard(type))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Understanding These Metrics</h2>
        <div className="space-y-6">
          {Object.entries(metricInfo).map(([type, info]) => (
            <div key={`info-${type}`} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
              <h4 className="font-bold text-slate-800 mb-2">{info.label}</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><strong className="text-slate-700">What it means:</strong> {info.what}</li>
                <li><strong className="text-slate-700">How it can help:</strong> {info.how}</li>
                <li><strong className="text-amber-700">Important limitation:</strong> {info.limit}</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
