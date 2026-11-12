'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { BorderBeam } from '@/components/ui/BorderBeam';

const PLANS = [
  {
    name: 'Foundation Tier',
    badge: 'Essential Growth',
    price: '$1,490',
    period: '/month',
    description: 'Engineered for businesses launching their search presence and seeking clean technical rankings.',
    features: [
      'Comprehensive Technical Core Web Vitals Audit',
      'Targeted Keyword Strategy (15 Commercial Terms)',
      'On-Page Schema & Entity Optimization (12 Pages)',
      '3 High-DA Editorial Guest Post Placements',
      'Continuous 24/7 Indexation Monitoring',
      'Monthly Executive Performance Review',
    ],
    cta: 'Select Foundation Tier',
    popular: false,
  },
  {
    name: 'Growth Scale',
    badge: 'Most Popular',
    price: '$2,890',
    period: '/month',
    description: 'Designed for aggressive market capture, competitive displacement, and compounding topical dominance.',
    features: [
      'Everything in Foundation Tier',
      'Topical Authority Map & Cluster Blueprint',
      'Expanded Target Keyword Matrix (40+ Queries)',
      '8 High-DA / High-Traffic Editorial Placements',
      'AI Engine Optimization (ChatGPT & Perplexity)',
      'Conversion Rate Optimization (CRO) Analysis',
      'Dedicated Senior Strategist & Direct Slack Access',
    ],
    cta: 'Accelerate With Growth',
    popular: true,
  },
  {
    name: 'Market Domination',
    badge: 'Enterprise',
    price: '$5,490',
    period: '/month',
    description: 'Full-funnel digital dominance for market leaders requiring multi-channel search and organic supremacy.',
    features: [
      'Everything in Growth Scale',
      'Unlimited High-Intent Keyword Targeting',
      '18+ Premium Tier-1 Publication Features/Mo',
      'Comprehensive Programmatic SEO Engineering',
      'Full Multi-Channel PPC Campaign Management',
      'Custom Real-Time Attribution Dashboard',
      'Bi-Weekly Executive Strategy & Roadmap Calls',
    ],
    cta: 'Deploy Domination Tier',
    popular: false,
  },
];

export default function PricingPreview() {
  return (
    <section className="section-padding relative overflow-hidden bg-slate-950" id="pricing">
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Transparent Investment Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight text-white leading-tight">
            Transparent Pricing.{' '}
            <span className="gradient-text">Compounding Returns.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            No hidden retainer traps or ambiguous billable hours. Clear deliverables, verified editorial placements, and measurable revenue attribution.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-slate-900/90 border-2 border-blue-500/60 shadow-2xl shadow-blue-900/30 scale-100 lg:-translate-y-2'
                  : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <BorderBeam size={220} duration={10} colorFrom="#60a5fa" colorTo="#c084fc" />
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                    {plan.badge}
                  </span>
                  {plan.popular && (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500 text-white shadow-md">
                      <Sparkles className="w-3 h-3" /> Agency Choice
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tight">{plan.price}</span>
                  <span className="text-sm font-medium text-slate-400">{plan.period}</span>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href="/contact"
                  className={`w-full py-4 rounded-full text-center font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Month-to-month flexibility • Cancel anytime</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
