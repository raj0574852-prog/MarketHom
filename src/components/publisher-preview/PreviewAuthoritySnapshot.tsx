import React from 'react';
import { PreviewMetricGauge } from './PreviewMetricGauge';
import { PreviewTooltip } from './PreviewTooltip';

export function PreviewAuthoritySnapshot() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Authority Snapshot</h2>
        <p className="text-sm text-slate-500 mt-1">SEO metrics for reibootpro.com</p>
      </div>

      <div className="p-8 bg-slate-50 border-b border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center">
          
          <div className="flex flex-col items-center justify-center">
            <PreviewMetricGauge label="Domain Rating" value={41} size="large" colorClass="text-emerald-500" />
            <div className="mt-3">
              <PreviewTooltip
                title="Domain Rating (DR)"
                value="41 / 100"
                provider="Ahrefs"
                scale="0–100"
                definition="A metric provided by Ahrefs showing the strength of a website's total backlink profile on a 0–100 logarithmic scale."
              >
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">Domain Rating</span>
              </PreviewTooltip>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <PreviewMetricGauge label="Domain Authority" value={43} size="large" />
            <div className="mt-3">
              <PreviewTooltip
                title="Domain Authority (DA)"
                value="43 / 100"
                provider="Moz"
                scale="0–100"
                definition="A search-ranking score provided by Moz on a 0–100 scale that predicts how well a website will rank on search engine result pages."
              >
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">Domain Authority</span>
              </PreviewTooltip>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <PreviewMetricGauge label="Authority Score" value={5} size="large" colorClass="text-purple-500" />
            <div className="mt-3">
              <PreviewTooltip
                title="Authority Score"
                value="5 / 100"
                provider="Semrush"
                scale="0–100"
                definition="A compound metric used to measure a domain's overall quality and SEO performance."
              >
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">Authority Score</span>
              </PreviewTooltip>
            </div>
          </div>

        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 flex justify-between">
                Domain & Page Authority
                <span className="text-blue-600">43</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                A search-ranking score provided by Moz on a 0–100 scale that predicts how well a website will rank on search engine result pages.
              </p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">Source: Moz</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 flex justify-between">
                Domain Rating
                <span className="text-emerald-600">41</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                A metric provided by Ahrefs showing the strength of a website's total backlink profile on a 0–100 logarithmic scale.
              </p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">Source: Ahrefs</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 flex justify-between">
                Spam Score
                <span className="text-purple-600">3%</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                A percentage risk measure indicating the likelihood of penalization. Lower values represent lower spam percentage.
              </p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">Source: Moz</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 flex justify-between">
                Organic Traffic
                <span className="text-slate-400">N/A</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Estimated monthly organic search traffic. This is a measurement, not a score.
              </p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">Source: Ahrefs</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
