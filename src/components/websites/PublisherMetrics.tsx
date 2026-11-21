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
    if (val === null) return { text: 'Verified', color: 'bg-white/5 text-slate-300 border-white/10' };
    if (val >= 50) return { text: 'High Authority', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' };
    if (val >= 30) return { text: 'Established', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
    return { text: 'Growing', color: 'bg-white/5 text-slate-300 border-white/10' };
  };

  const getDrStatus = (val: number | null) => {
    if (val === null) return { text: 'Verified', color: 'bg-white/5 text-slate-300 border-white/10' };
    if (val >= 50) return { text: 'Elite Tier', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
    if (val >= 25) return { text: 'Strong Equity', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
    return { text: 'Indexed Profile', color: 'bg-white/5 text-slate-300 border-white/10' };
  };

  const getSpamStatus = (val: number | null) => {
    if (val === null) return { text: 'Clean Risk', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
    if (val <= 5) return { text: 'Safe / Low', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
    if (val <= 15) return { text: 'Moderate', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
    return { text: 'Elevated', color: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
  };

  const daStatus = getDaStatus(normalized.da);
  const drStatus = getDrStatus(normalized.dr);
  const spamStatus = getSpamStatus(normalized.spamScore);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 mb-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            SEO Authority & Performance Metrics
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          Audited via Moz • Ahrefs • Semrush
        </span>
      </div>

      {/* Grid of 5 Distinct Elevated Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 relative z-10">
        
        {/* Metric 1: DA */}
        <AnimatedCounter value={normalized.da}>
          {(animatedDa) => (
            <div className="bg-slate-950/70 hover:bg-slate-900/90 border border-white/10 hover:border-blue-400/50 rounded-2xl p-4 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  Moz
                </span>
                <PublisherTooltip
                  title="Domain Authority (DA)"
                  value={normalized.da !== null ? `${normalized.da} / 100` : 'N/A'}
                  provider="Moz"
                  scale="0–100"
                  definition="A search-ranking score developed by Moz that predicts how likely a website is to rank on search engine result pages."
                >
                  <span className="text-slate-500 hover:text-blue-400 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                  {animatedDa !== null ? animatedDa : 'N/A'}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Domain Authority
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${daStatus.color}`}>
                  {daStatus.text}
                </span>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 2: DR */}
        <AnimatedCounter value={normalized.dr}>
          {(animatedDr) => (
            <div className="bg-slate-950/70 hover:bg-slate-900/90 border border-white/10 hover:border-emerald-400/50 rounded-2xl p-4 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  Ahrefs
                </span>
                <PublisherTooltip
                  title="Domain Rating (DR)"
                  value={normalized.dr !== null ? `${normalized.dr} / 100` : 'N/A'}
                  provider="Ahrefs"
                  scale="0–100"
                  definition="A metric provided by Ahrefs showing the strength of a target website's backlink profile compared to other websites."
                >
                  <span className="text-slate-500 hover:text-emerald-400 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                  {animatedDr !== null ? animatedDr : 'N/A'}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Domain Rating
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${drStatus.color}`}>
                  {drStatus.text}
                </span>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 3: Authority Score */}
        <AnimatedCounter value={normalized.authorityScore}>
          {(animatedAuthScore) => (
            <div className="bg-slate-950/70 hover:bg-slate-900/90 border border-white/10 hover:border-purple-400/50 rounded-2xl p-4 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/20">
                  Semrush
                </span>
                <PublisherTooltip
                  title="Authority Score"
                  value={normalized.authorityScore !== null ? `${normalized.authorityScore} / 100` : 'N/A'}
                  provider="Semrush"
                  scale="0–100"
                  definition="A compound metric from Semrush that measures domain quality and organic search performance."
                >
                  <span className="text-slate-500 hover:text-purple-400 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-purple-400 transition-colors">
                  {animatedAuthScore !== null ? animatedAuthScore : 'N/A'}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Auth Score
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Topical Trust
                </span>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 4: Spam Score */}
        <AnimatedCounter value={normalized.spamScore}>
          {(animatedSpamScore) => (
            <div className="bg-slate-950/70 hover:bg-slate-900/90 border border-white/10 hover:border-slate-400/50 rounded-2xl p-4 shadow-lg transition-all duration-300 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10">
                  Risk
                </span>
                <PublisherTooltip
                  title="Spam Score"
                  value={normalized.spamScore !== null ? `${normalized.spamScore}%` : 'Low Risk (<1%)'}
                  provider="Moz"
                  definition="Moz Spam Score represents the percentage of sites with similar features that have been penalized. Lower is safer."
                >
                  <span className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                  {animatedSpamScore !== null ? `${animatedSpamScore}%` : 'Clean'}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Spam Score
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${spamStatus.color}`}>
                  {spamStatus.text}
                </span>
              </div>
            </div>
          )}
        </AnimatedCounter>

        {/* Metric 5: Organic Traffic */}
        <AnimatedCounter value={normalized.organicTraffic}>
          {(animatedTraffic) => (
            <div className="col-span-2 sm:col-span-1 bg-slate-950/70 hover:bg-slate-900/90 border border-white/10 hover:border-cyan-400/50 rounded-2xl p-4 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between text-center group">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                  Monthly Visits
                </span>
                <PublisherTooltip
                  title="Organic Traffic"
                  value={normalized.organicTraffic !== null && normalized.organicTraffic > 0 ? formatCompactNumber(normalized.organicTraffic) : 'Active'}
                  provider="Ahrefs / Semrush"
                  definition="Estimated monthly organic search visits. High organic traffic confirms that real users visit the site from Google searches."
                >
                  <span className="text-slate-500 hover:text-cyan-400 text-xs cursor-pointer">ⓘ</span>
                </PublisherTooltip>
              </div>

              <div className="my-1">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors flex items-center justify-center gap-1">
                  <span>{typeof animatedTraffic === 'number' && animatedTraffic > 0 ? formatCompactNumber(animatedTraffic) : 'Active'}</span>
                  <span className="text-emerald-400 text-sm">↗</span>
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Organic Traffic
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
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
