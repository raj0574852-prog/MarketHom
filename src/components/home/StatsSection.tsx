import React from 'react';
import { Award, Zap, TrendingUp, ShieldCheck, Clock, BarChart3 } from 'lucide-react';

const STATS = [
  {
    icon: Award,
    value: '48,000+',
    label: 'Verified Publishers',
    description: 'Direct editorial inventory',
    badge: '100% Real Domains',
  },
  {
    icon: TrendingUp,
    value: '1.4M+',
    label: 'Organic Traffic Scaled',
    description: 'Across client portfolio',
    badge: '+284% Avg Growth',
  },
  {
    icon: ShieldCheck,
    value: '99.4%',
    label: 'Indexation Guarantee',
    description: 'Clean search discoverability',
    badge: 'Zero PBN Network',
  },
  {
    icon: BarChart3,
    value: '14.8x',
    label: 'Average Pipeline ROAS',
    description: 'Measured organic revenue',
    badge: 'Verified Attribution',
  },
  {
    icon: Clock,
    value: '< 24h',
    label: 'Publication Turnaround',
    description: 'Rapid editorial placement',
    badge: 'Express Review',
  },
  {
    icon: Zap,
    value: '100%',
    label: 'White-Hat Execution',
    description: 'Algorithm update resilient',
    badge: 'Google Compliant',
  },
];

export default function StatsSection() {
  return (
    <section className="relative bg-slate-950 border-y border-white/10 overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {stat.badge}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                  {stat.value}
                </div>

                <div className="text-xs font-bold text-slate-200 mb-0.5">
                  {stat.label}
                </div>

                <div className="text-[11px] text-slate-400 leading-snug">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
