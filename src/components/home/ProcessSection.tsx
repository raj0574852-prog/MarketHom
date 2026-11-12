'use client';

import React from 'react';
import { SearchCheck, Layers, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

const PHASES = [
  {
    phase: 'Phase 01',
    timeframe: 'Week 1',
    title: 'Forensic Audit & Entity Analysis',
    description: 'We reverse-engineer your competitive SERP footprint, isolate technical crawl debt, and identify high-converting commercial gaps.',
    deliverables: ['Full Technical SEO & Core Web Vitals audit', 'Competitor keyword & backlink forensics', 'Commercial intent keyword matrix'],
    icon: SearchCheck,
  },
  {
    phase: 'Phase 02',
    timeframe: 'Week 2',
    title: 'Topical Authority Blueprint',
    description: 'We construct an entity-driven content architecture and programmatic clustering plan designed to capture topical supremacy across Google & AI search.',
    deliverables: ['Topical cluster map & URL structure', 'Conversion funnel landing page wireframes', 'Editorial backlink acquisition calendar'],
    icon: Layers,
  },
  {
    phase: 'Phase 03',
    timeframe: 'Weeks 3 – 8',
    title: 'High-Velocity Execution',
    description: 'Our senior specialists execute on-page schema, publish optimized thought-leadership content, and secure authoritative tier-1 editorial placements.',
    deliverables: ['Guaranteed high-DA editorial guest posts', 'On-page technical schema & AEO injections', 'Conversion rate optimization iterations'],
    icon: Zap,
  },
  {
    phase: 'Phase 04',
    timeframe: 'Ongoing',
    title: 'Revenue Attribution & Scaling',
    description: 'We track every dollar generated through transparent attribution models, compounding your domain equity and scaling winning campaigns.',
    deliverables: ['Live 24/7 client performance dashboard', 'Pipeline revenue & conversion attribution', 'Proactive algorithm resilience updates'],
    icon: TrendingUp,
  },
];

export default function ProcessSection() {
  return (
    <section className="section-padding relative overflow-hidden bg-slate-950" id="process">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Systematic Growth Framework
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight text-white leading-tight">
            How We Engineer{' '}
            <span className="gradient-text">Unfair Market Advantage</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Predictable, compounding growth doesn’t happen by chance. Our 4-phase institutional framework guarantees transparency, momentum, and undeniable ROI.
          </p>
        </div>

        {/* Roadmap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {PHASES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.phase}
                className="relative rounded-3xl p-7 bg-white/[0.02] border border-white/10 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.phase}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {item.timeframe}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/5 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Key Deliverables</div>
                  {item.deliverables.map((del) => (
                    <div key={del} className="flex items-start gap-2 text-[11px] text-slate-300 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
