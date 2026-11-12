'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, BarChart2, ShieldCheck, ArrowRight } from 'lucide-react';

const CASE_STUDIES = [
  {
    industry: 'High-Growth E-Commerce',
    company: 'StyleVault Apparel',
    challenge: 'Stagnant organic growth at 12,000 monthly visitors, bleeding margin on paid acquisition with sub-2% conversion.',
    outcome: 'Engineered programmatic category SEO and high-intent backlink cluster, scaling to 53,000+ monthly visits.',
    timeframe: '8-Month Trajectory',
    metrics: [
      { label: 'Organic Traffic', before: '12K/mo', after: '53.4K/mo', growth: '+342%' },
      { label: 'Monthly Revenue', before: '$48K', after: '$138K', growth: '+188%' },
      { label: 'Top 3 Keywords', before: '24', after: '412', growth: '+1,616%' },
    ],
    service: 'Technical SEO + Link Velocity',
  },
  {
    industry: 'B2B Enterprise SaaS',
    company: 'DataFlow Systems',
    challenge: 'Inefficient Google Ads spend with $12.40 CPL and low qualified lead activation among mid-market CTOs.',
    outcome: 'Restructured conversion funnel, implemented negative search isolation, and deployed targeted AEO entity schemas.',
    timeframe: '90-Day Sprint',
    metrics: [
      { label: 'Cost Per Lead (CPL)', before: '$12.40', after: '$3.90', growth: '-69%' },
      { label: 'Demo Quality Score', before: '34%', after: '87%', growth: '+156%' },
      { label: 'Qualified Pipeline', before: '89', after: '312/mo', growth: '+250%' },
    ],
    service: 'PPC + Conversion Optimization',
  },
  {
    industry: 'Healthcare & Specialized Practice',
    company: 'PrimeCare Clinics',
    challenge: 'Completely unranked on Google Maps across 6 metropolitan locations, losing premium patient flow to regional hospital networks.',
    outcome: 'Standardized citation graph, generated location-specific landing hubs, and secured local authority press mentions.',
    timeframe: '4-Month Campaign',
    metrics: [
      { label: 'Map Pack Placement', before: 'Unlisted', after: '#1 Across 6 Hubs', growth: 'Rank 1' },
      { label: 'Inbound Inquiries', before: '23/mo', after: '147/mo', growth: '+539%' },
      { label: 'New Patient Revenue', before: '$32K', after: '$167K/mo', growth: '+422%' },
    ],
    service: 'Local Authority + Geo SEO',
  },
];

export default function ResultsSection() {
  return (
    <section className="section-padding relative overflow-hidden bg-slate-950/80" id="results">
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Verified Client Outcomes
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Evidence Over Opinions:{' '}
              <span className="gradient-text">Real Commercial Growth</span>
            </h2>
          </div>

          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
          >
            <span>Explore All 24+ Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {CASE_STUDIES.map((study, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 bg-white/[0.02] border border-white/10 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-blue-400 tracking-wide">
                    {study.industry}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                    {study.timeframe}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {study.company}
                </h3>

                <div className="text-xs text-slate-400 leading-relaxed mb-6 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  <span className="font-semibold text-slate-300 block mb-1">Challenge:</span>
                  {study.challenge}
                </div>

                <div className="grid grid-cols-3 gap-2.5 mb-6">
                  {study.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                      <div className="text-sm md:text-base font-black text-emerald-400">
                        {m.growth}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {m.label}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono mt-1">
                        {m.before} → {m.after}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300">
                  {study.service}
                </span>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-white transition-colors"
                >
                  <span>Replicate Results</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
