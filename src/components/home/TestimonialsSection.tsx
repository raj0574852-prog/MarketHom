'use client';

import React from 'react';
import { Star, Quote, CheckCircle2, TrendingUp } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    title: 'CEO & Founder',
    company: 'StyleVault Apparel',
    rating: 5,
    quote: 'EducationHom completely shifted our growth trajectory. Over 8 months, our organic traffic surged from 12,000 to over 53,000 monthly visitors. Their team operates with institutional rigor and relentless precision.',
    metric: '+342% Organic Traffic',
    tag: 'E-Commerce Growth',
  },
  {
    name: 'James Rodriguez',
    title: 'Head of Growth',
    company: 'DataFlow Systems',
    rating: 5,
    quote: 'Their search & PPC infrastructure cut our cost-per-lead by 69% while tripling the qualification rate of enterprise prospects. If you are serious about predictable pipeline, EducationHom is the gold standard.',
    metric: '-69% Acquisition Cost',
    tag: 'B2B Enterprise SaaS',
  },
  {
    name: 'Dr. Amanda Chen',
    title: 'Managing Director',
    company: 'PrimeCare Clinics',
    rating: 5,
    quote: 'We were losing patients daily to competitors before EducationHom audited and overhauled our local search graph. Within 4 months, we secured #1 positions across all metropolitan branches with a 422% increase in bookings.',
    metric: '#1 Map Placement (6 Hubs)',
    tag: 'Healthcare Network',
  },
  {
    name: 'Marcus Thompson',
    title: 'VP of Marketing',
    company: 'TechBridge Cloud',
    rating: 5,
    quote: 'Their AI SEO and entity optimization gave us an immediate edge in AI search engines. We are now quoted as the primary authority in ChatGPT and Perplexity across 40+ key software decision queries.',
    metric: '40+ AI Citations',
    tag: 'AI & Cloud Infrastructure',
  },
  {
    name: 'Lisa Park',
    title: 'Co-Founder',
    company: 'Verde Organics',
    rating: 5,
    quote: 'From brand positioning to continuous tier-1 editorial placements, EducationHom has driven a 215% annual revenue increase strictly through organic channels. Total transparency, zero fluff.',
    metric: '+215% Organic Revenue',
    tag: 'Consumer Direct',
  },
  {
    name: 'David Kim',
    title: 'Chief Technology Officer',
    company: 'CloudSync Solutions',
    rating: 5,
    quote: 'Their white-hat link acquisition and technical Core Web Vitals remediation propelled our domain rating from 18 to 54 in under 9 months. We routinely outrank legacy competitors on the hardest terms.',
    metric: 'DR 18 → 54 in 9mo',
    tag: 'Developer Tools',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding relative overflow-hidden bg-slate-950/90" id="testimonials">
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Client Validation
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight text-white leading-tight">
            Trusted by Leaders Who{' '}
            <span className="gradient-text">Demand Real Growth</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Read direct feedback from enterprise executives, startup founders, and marketing directors scaling their revenue with EducationHom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 bg-white/[0.02] border border-white/10 hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {t.metric}
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {t.title}, <span className="text-slate-300 font-medium">{t.company}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
