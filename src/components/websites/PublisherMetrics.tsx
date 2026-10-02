'use client';

import React from 'react';
import { PublisherMetricGauge } from './PublisherMetricGauge';
import { PublisherTooltip } from './PublisherTooltip';
import { normalizePublisherMetrics } from './utils/normalizeMetrics';
import { AnimatedCounter } from './AnimatedCounter';
import { formatCompactNumber } from './utils/formatters';

export function PublisherMetrics({ metrics }: { metrics: any[] | null | undefined }) {
  const normalized = normalizePublisherMetrics(metrics);
  
  // If we have literally no data for anything, we could return null, 
  // but to maintain UI consistency, we render N/A for missing metrics.
  // We only hide the entire block if metrics array is completely undefined (which shouldn't happen).
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 className="sr-only">Quick Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        
        {/* Metric 1: DA */}
        <AnimatedCounter value={normalized.da}>
          {(animatedDa) => (
            <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
              <PublisherMetricGauge label="DA" value={animatedDa} />
              <div className="mt-3 flex items-center justify-center">
                <PublisherTooltip
                  title="Domain Authority (DA)"
                  value={normalized.da !== null ? `${normalized.da} / 100` : 'N/A'}
                  provider="Moz"
                  scale="0–100"
                  definition="A search-ranking score provided by Moz on a 0–100 scale that predicts how well a website will rank on search engine result pages."
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">DA</span>
                </PublisherTooltip>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 2: DR */}
        <AnimatedCounter value={normalized.dr}>
          {(animatedDr) => (
            <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
              <PublisherMetricGauge label="DR" value={animatedDr} colorClass="text-emerald-500" />
              <div className="mt-3 flex items-center justify-center">
                <PublisherTooltip
                  title="Domain Rating (DR)"
                  value={normalized.dr !== null ? `${normalized.dr} / 100` : 'N/A'}
                  provider="Ahrefs"
                  scale="0–100"
                  definition="A metric provided by Ahrefs showing the strength of a website's total backlink profile on a 0–100 logarithmic scale."
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">DR</span>
                </PublisherTooltip>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 3: Authority Score */}
        <AnimatedCounter value={normalized.authorityScore}>
          {(animatedAuthScore) => (
            <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
              <PublisherMetricGauge label="Auth Score" value={animatedAuthScore} colorClass="text-purple-500" />
              <div className="mt-3 flex items-center justify-center">
                <PublisherTooltip
                  title="Authority Score"
                  value={normalized.authorityScore !== null ? `${normalized.authorityScore} / 100` : 'N/A'}
                  provider="Semrush"
                  scale="0–100"
                  definition="A compound metric used to measure a domain's overall quality and SEO performance."
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Auth Score</span>
                </PublisherTooltip>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 4: Spam Score */}
        <AnimatedCounter value={normalized.spamScore}>
          {(animatedSpamScore) => (
            <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
              <PublisherMetricGauge label="Spam Score" value={animatedSpamScore} type="percentage" colorClass="text-purple-500" />
              <div className="mt-3 flex items-center justify-center">
                <PublisherTooltip
                  title="Spam Score"
                  value={normalized.spamScore !== null ? `${normalized.spamScore}%` : 'N/A'}
                  provider="Moz"
                  definition="A percentage risk measure indicating the likelihood of penalization. Lower values represent lower spam percentage."
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Spam Score</span>
                </PublisherTooltip>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 5: Organic Traffic */}
        <AnimatedCounter value={normalized.organicTraffic}>
          {(animatedTraffic) => (
            <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-xl font-bold text-slate-900">{formatCompactNumber(animatedTraffic)}</div>
              <div className="mt-1 flex items-center justify-center">
                <PublisherTooltip
                  title="Organic Traffic"
                  value={normalized.organicTraffic !== null ? formatCompactNumber(normalized.organicTraffic) : 'N/A'}
                  provider="Ahrefs / Semrush"
                  definition="Estimated monthly organic search visits. Shows if the site actually gets real visitors and is visible in search engines."
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Traffic</span>
                </PublisherTooltip>
              </div>
            </div>
          )}
        </AnimatedCounter>


      </div>
    </div>
  );
}
