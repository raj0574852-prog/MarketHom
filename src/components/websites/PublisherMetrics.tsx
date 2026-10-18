'use client';

import React from 'react';
import type { MetricItem } from './types';
import { PublisherTooltip } from './PublisherTooltip';
import { normalizePublisherMetrics } from './utils/normalizeMetrics';
import { AnimatedCounter } from './AnimatedCounter';
import { formatCompactNumber } from './utils/formatters';

export function PublisherMetrics({ metrics }: { metrics: MetricItem[] | null | undefined }) {
  const normalized = normalizePublisherMetrics(metrics);

  const getDaStatus = (val: number | null) => {
    if (val === null) return { text: 'Verified', color: 'bg-slate-100 text-slate-600' };
    if (val >= 50) return { text: 'High Authority', color: 'bg-blue-100 text-blue-700' };
    if (val >= 30) return { text: 'Established', color: 'bg-blue-50 text-blue-600' };
    return { text: 'Growing', color: 'bg-slate-100 text-slate-600' };
  };

  const getDrStatus = (val: number | null) => {
    if (val === null) return { text: 'Verified', color: 'bg-slate-100 text-slate-600' };
    if (val >= 50) return { text: 'Elite Tier', color: 'bg-emerald-100 text-emerald-700' };
    if (val >= 25) return { text: 'Strong Link Equity', color: 'bg-emerald-50 text-emerald-600' };
    return { text: 'Indexed Profile', color: 'bg-slate-100 text-slate-600' };
  };

  const getSpamStatus = (val: number | null) => {
    if (val === null) return { text: 'Clean Risk', color: 'bg-emerald-50 text-emerald-600' };
    if (val <= 5) return { text: 'Low / Safe', color: 'bg-emerald-100 text-emerald-700' };
    if (val <= 15) return { text: 'Moderate', color: 'bg-amber-50 text-amber-600' };
    return { text: 'Elevated', color: 'bg-red-50 text-red-600' };
  };

  const daStatus = getDaStatus(normalized.da);
  const drStatus = getDrStatus(normalized.dr);
  const spamStatus = getSpamStatus(normalized.spamScore);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            SEO Authority & Performance Metrics
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          Audited via Moz • Ahrefs • Semrush
        </span>
      </div>

      {/* Grid of 5 Distinct Elevated Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: DA */}
        <AnimatedCounter value={normalized.da}>
          {(animatedDa) => (
            <div className="bg-gradient-to-b from-blue-50/40 to-white hover:from-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100/70 text-blue-700">
                  Moz
                </span>
                <PublisherTooltip
                  title="Domain Authority (DA)"
                  value={normalized.da !== null ? `${normalized.da} / 100` : 'N/A'}
                  provider="Moz"
                  scale="0–100"
                  definition="A search-ranking score developed by Moz that predicts how likely a website is to rank on search engine result pages."
                >
                  <span className="text-slate-400 hover:text-blue-600 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  {animatedDa !== null ? animatedDa : 'N/A'}
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                  Domain Authority
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${daStatus.color}`}>
                  {daStatus.text}
                </span>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 2: DR */}
        <AnimatedCounter value={normalized.dr}>
          {(animatedDr) => (
            <div className="bg-gradient-to-b from-emerald-50/40 to-white hover:from-emerald-50/80 border border-slate-200 hover:border-emerald-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100/70 text-emerald-700">
                  Ahrefs
                </span>
                <PublisherTooltip
                  title="Domain Rating (DR)"
                  value={normalized.dr !== null ? `${normalized.dr} / 100` : 'N/A'}
                  provider="Ahrefs"
                  scale="0–100"
                  definition="A metric provided by Ahrefs showing the strength of a target website's backlink profile compared to the other websites in their database on a 100-point scale."
                >
                  <span className="text-slate-400 hover:text-emerald-600 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">
                  {animatedDr !== null ? animatedDr : 'N/A'}
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                  Domain Rating
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${drStatus.color}`}>
                  {drStatus.text}
                </span>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 3: Authority Score */}
        <AnimatedCounter value={normalized.authorityScore}>
          {(animatedAuthScore) => (
            <div className="bg-gradient-to-b from-purple-50/40 to-white hover:from-purple-50/80 border border-slate-200 hover:border-purple-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100/70 text-purple-700">
                  Semrush
                </span>
                <PublisherTooltip
                  title="Authority Score"
                  value={normalized.authorityScore !== null ? `${normalized.authorityScore} / 100` : 'N/A'}
                  provider="Semrush"
                  scale="0–100"
                  definition="A compound metric from Semrush that measures domain quality and organic search performance."
                >
                  <span className="text-slate-400 hover:text-purple-600 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors">
                  {animatedAuthScore !== null ? animatedAuthScore : 'N/A'}
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                  Auth Score
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
                  Topical Trust
                </span>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 4: Spam Score */}
        <AnimatedCounter value={normalized.spamScore}>
          {(animatedSpamScore) => (
            <div className="bg-gradient-to-b from-slate-50/40 to-white hover:from-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  Risk
                </span>
                <PublisherTooltip
                  title="Spam Score"
                  value={normalized.spamScore !== null ? `${normalized.spamScore}%` : 'Low Risk (<1%)'}
                  provider="Moz"
                  definition="Moz Spam Score represents the percentage of sites with similar features that have been penalized or banned by Google. Lower is safer."
                >
                  <span className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">
                  {animatedSpamScore !== null ? `${animatedSpamScore}%` : 'Clean'}
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                  Spam Score
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${spamStatus.color}`}>
                  {spamStatus.text}
                </span>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 5: Organic Traffic */}
        <AnimatedCounter value={normalized.organicTraffic}>
          {(animatedTraffic) => (
            <div className="col-span-2 sm:col-span-1 bg-gradient-to-b from-cyan-50/40 to-white hover:from-cyan-50/80 border border-slate-200 hover:border-cyan-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-100/70 text-cyan-800">
                  Monthly Visits
                </span>
                <PublisherTooltip
                  title="Organic Traffic"
                  value={normalized.organicTraffic !== null && normalized.organicTraffic > 0 ? formatCompactNumber(normalized.organicTraffic) : 'Verified'}
                  provider="Ahrefs / Semrush"
                  definition="Estimated monthly organic search visits. High organic traffic confirms that real users visit the site from Google searches."
                >
                  <span className="text-slate-400 hover:text-cyan-600 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight group-hover:text-cyan-600 transition-colors flex items-center justify-center gap-1">
                  <span>{typeof animatedTraffic === 'number' && animatedTraffic > 0 ? formatCompactNumber(animatedTraffic) : 'Active'}</span>
                  <span className="text-emerald-500 text-sm">↗</span>
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                  Organic Traffic
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700">
                  Google Ranked
                </span>
              </div>
            </div>
          )}
        </AnimatedCounter>

      </div>
    </div>
  );
}
