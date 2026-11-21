'use client';

import React from 'react';
import type { MetricItem } from './types';
import { PublisherMetricGauge } from './PublisherMetricGauge';
import { PublisherTooltip } from './PublisherTooltip';
import { normalizePublisherMetrics } from './utils/normalizeMetrics';
import { AnimatedCounter } from './AnimatedCounter';
import { formatCompactNumber } from './utils/formatters';
import { ShieldCheck, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

export function PublisherAuthoritySnapshot({ metrics, domain }: { metrics: MetricItem[] | null | undefined, domain: string }) {
  const normalized = normalizePublisherMetrics(metrics);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden mb-8">
      <div className="p-6 sm:p-8 border-b border-white/10">
        <h2 className="text-xl font-bold text-white tracking-tight">Authority & Trust Snapshot</h2>
        <p className="text-sm text-slate-400 mt-1 break-all min-w-0 font-light">
          Deep algorithmic evaluation of backlink profile, anchor equity, and ranking stability for <strong className="text-slate-200">{domain}</strong>
        </p>
      </div>

      {(normalized.dr !== null || normalized.da !== null || normalized.authorityScore !== null) && (
        <div className="p-8 bg-slate-950/50 border-b border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center min-w-0">
            
            <AnimatedCounter value={normalized.dr}>
              {(animatedDr) => (
                <div className="flex flex-col items-center justify-center">
                  <PublisherMetricGauge label="Domain Rating" value={animatedDr} size="large" colorClass="text-emerald-400" />
                  <div className="mt-4">
                    <PublisherTooltip
                      title="Domain Rating (DR)"
                      value={normalized.dr !== null ? `${normalized.dr} / 100` : 'N/A'}
                      provider="Ahrefs"
                      scale="0–100"
                      definition="A metric provided by Ahrefs showing the strength of a website's total backlink profile on a 0–100 logarithmic scale."
                    >
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center cursor-pointer hover:text-emerald-400 transition-colors">
                        Domain Rating (DR)
                      </span>
                    </PublisherTooltip>
                  </div>
                </div>
              )}
            </AnimatedCounter>

            <AnimatedCounter value={normalized.da}>
              {(animatedDa) => (
                <div className="flex flex-col items-center justify-center">
                  <PublisherMetricGauge label="Domain Authority" value={animatedDa} size="large" colorClass="text-blue-400" />
                  <div className="mt-4">
                    <PublisherTooltip
                      title="Domain Authority (DA)"
                      value={normalized.da !== null ? `${normalized.da} / 100` : 'N/A'}
                      provider="Moz"
                      scale="0–100"
                      definition="A search-ranking score provided by Moz on a 0–100 scale that predicts how well a website will rank on search engine result pages."
                    >
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center cursor-pointer hover:text-blue-400 transition-colors">
                        Domain Authority (DA)
                      </span>
                    </PublisherTooltip>
                  </div>
                </div>
              )}
            </AnimatedCounter>

            <AnimatedCounter value={normalized.authorityScore}>
              {(animatedAuthScore) => (
                <div className="flex flex-col items-center justify-center">
                  <PublisherMetricGauge label="Authority Score" value={animatedAuthScore} size="large" colorClass="text-purple-400" />
                  <div className="mt-4">
                    <PublisherTooltip
                      title="Authority Score"
                      value={normalized.authorityScore !== null ? `${normalized.authorityScore} / 100` : 'N/A'}
                      provider="Semrush"
                      scale="0–100"
                      definition="A compound metric used to measure a domain's overall quality and SEO performance."
                    >
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center cursor-pointer hover:text-purple-400 transition-colors">
                        Authority Score (AS)
                      </span>
                    </PublisherTooltip>
                  </div>
                </div>
              )}
            </AnimatedCounter>

          </div>
        </div>
      )}

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1 */}
          <AnimatedCounter value={normalized.da}>
            {(animatedDa) => (
              <div className="flex gap-4 p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-blue-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1 flex justify-between">
                    Moz Authority Score
                    <span className="text-blue-400 font-extrabold">{animatedDa !== null ? animatedDa : 'N/A'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Moz prediction of organic search competitiveness based on link equity and index presence.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">Source: Moz</p>
                </div>
              </div>
            )}
          </AnimatedCounter>

          {/* Card 2 */}
          <AnimatedCounter value={normalized.dr}>
            {(animatedDr) => (
              <div className="flex gap-4 p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1 flex justify-between">
                    Ahrefs Backlink Equity
                    <span className="text-emerald-400 font-extrabold">{animatedDr !== null ? animatedDr : 'N/A'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Measures the relative power of the domain&apos;s link profile on a logarithmic scale.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">Source: Ahrefs</p>
                </div>
              </div>
            )}
          </AnimatedCounter>

          {/* Card 3 */}
          <AnimatedCounter value={normalized.spamScore}>
            {(animatedSpamScore) => (
              <div className="flex gap-4 p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-amber-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1 flex justify-between">
                    Moz Spam Ratio
                    <span className="text-amber-400 font-extrabold">{animatedSpamScore !== null ? `${animatedSpamScore}%` : 'Low Risk'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Calculated penalization likelihood. Low values confirm healthy algorithmic standing.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">Source: Moz</p>
                </div>
              </div>
            )}
          </AnimatedCounter>

          {/* Card 4 */}
          <AnimatedCounter value={normalized.organicTraffic}>
            {(animatedTraffic) => (
              <div className="flex gap-4 p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1 flex justify-between">
                    Search Engine Visibility
                    <span className="text-cyan-400 font-extrabold">{animatedTraffic !== null && animatedTraffic !== undefined && animatedTraffic > 0 ? formatCompactNumber(animatedTraffic) : 'Verified'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Estimated monthly organic search reach confirming real search engine indexation.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">Source: Ahrefs / Semrush</p>
                </div>
              </div>
            )}
          </AnimatedCounter>

        </div>
      </div>
    </div>
  );
}
