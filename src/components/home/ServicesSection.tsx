'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bot, Target, Code, Link2, Share2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

const SERVICES = [
  {
    icon: Search,
    name: 'Technical & Programmatic SEO',
    category: 'Search Engine Optimization',
    priceRange: '$1,500 – $4,500/mo',
    description: 'Data-driven site architecture, crawl optimization, and programmatic topical authority that dominates SERPs.',
    features: ['Technical Core Web Vitals audit', 'Topical map architecture', 'Continuous indexation monitoring'],
    href: '/services/seo',
  },
  {
    icon: Bot,
    name: 'AI Search Optimization (AEO / GEO)',
    category: 'AI Engine Optimization',
    priceRange: '$2,000 – $5,000/mo',
    description: 'Position your brand as the primary reference when ChatGPT, Perplexity, and Gemini generate answers.',
    features: ['LLM brand presence tracking', 'Entity relation schema architecture', 'Conversational query capture'],
    href: '/services/ai-seo',
  },
  {
    icon: Target,
    name: 'High-Intent Performance PPC',
    category: 'Paid Search & Meta',
    priceRange: '$2,000 – $6,000/mo',
    description: 'Precision bidding and conversion tracking on Google Ads and LinkedIn that scales pipeline with positive ROAS.',
    features: ['Negative keyword isolation', 'Dynamic remarketing funnels', 'Conversion API tracking'],
    href: '/services/ppc',
  },
  {
    icon: Code,
    name: 'High-Performance Web Development',
    category: 'Next.js & Modern Web',
    priceRange: '$3,500 – $12,000',
    description: 'Blazing-fast, mobile-first websites built with Next.js, React, and Tailwind designed strictly to rank and convert.',
    features: ['Sub-second page speeds', 'Built-in SEO & OpenGraph schemas', 'Responsive UX micro-interactions'],
    href: '/services/web-development',
  },
  {
    icon: Link2,
    name: 'Authority Link Building & PR',
    category: 'Off-Page SEO',
    priceRange: '$1,200 – $3,500/mo',
    description: 'Secure editorial guest placements and contextual backlinks from real, high-DR publications with organic traffic.',
    features: ['Manual editorial outreach', 'Zero PBN / pure white-hat links', 'DoFollow guaranteed indexation'],
    href: '/services/link-building',
  },
  {
    icon: Share2,
    name: 'Social Media & Brand Velocity',
    category: 'Omnichannel Growth',
    priceRange: '$1,500 – $4,000/mo',
    description: 'Build an engaged audience and capture demand across LinkedIn, X, and YouTube to amplify organic brand search volume.',
    features: ['Thought leadership content', 'Multi-channel distribution', 'Social-to-search attribution'],
    href: '/services/smm',
  },
];

export default function ServicesSection() {
  return (
    <section className="section-padding relative overflow-hidden bg-slate-950/90" id="services">
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Specialized Practice Areas
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight text-white leading-tight">
            Integrated Services Built for{' '}
            <span className="gradient-text">Compounding Organic Scale</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            We abandon one-size-fits-all packages. Every campaign is engineered specifically around your competitive niche, unit economics, and pipeline goals.
          </p>
        </div>

        {/* Services Bento Grid with Spotlight Illumination */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <SpotlightCard
                key={service.name}
                spotlightColor="rgba(59, 130, 246, 0.2)"
                className="p-8 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {service.priceRange}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest block mb-2">
                    {service.category}
                  </span>

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <span>View Methodology</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/contact"
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Get Proposal →
                  </Link>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
