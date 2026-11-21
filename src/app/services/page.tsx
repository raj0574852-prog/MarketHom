'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';
import { getServices, SiteService } from '@/lib/resourcesStore';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Code2, 
  Link2, 
  Share2, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const serviceIcons: Record<string, React.ReactNode> = {
  'seo': <Search className="w-6 h-6 text-blue-400" />,
  'ai-seo': <Sparkles className="w-6 h-6 text-cyan-400" />,
  'ppc': <TrendingUp className="w-6 h-6 text-emerald-400" />,
  'web-development': <Code2 className="w-6 h-6 text-indigo-400" />,
  'link-building': <Link2 className="w-6 h-6 text-purple-400" />,
  'smm': <Share2 className="w-6 h-6 text-rose-400" />,
  'guest-posting': <FileText className="w-6 h-6 text-amber-400" />
};

const defaultServiceList = [
  {
    id: 'seo',
    name: 'Search Engine Optimization',
    category: 'SEO & Authority',
    priceRange: '$1,500 - $4,500/mo',
    description: 'Dominate high-intent organic search queries with data-driven technical, structural, and semantic authority strategies that compound revenue.',
    highlights: ['Algorithmic Audit', 'Entity Optimization', 'Keyword Clustering']
  },
  {
    id: 'ai-seo',
    name: 'AI-Powered Generative SEO',
    category: 'Next-Gen SEO',
    priceRange: '$2,000 - $5,000/mo',
    description: 'Engineer brand presence across AI search surfaces (ChatGPT, Perplexity, Google SGE) with vector semantic indexing and entity training.',
    highlights: ['GEO Optimization', 'Knowledge Graph Graphing', 'AI Citation Seeding']
  },
  {
    id: 'guest-posting',
    name: 'Editorial Guest Posting',
    category: 'Digital PR & Links',
    priceRange: '$500 - $2,500/mo',
    description: 'Permanent contextual placements on audited publications with verified organic traffic, clean anchor text hygiene, and 100% indexing SLA.',
    highlights: ['29k+ Publisher Inventory', 'Permanent DoFollow', 'Zero Sponsored Tags']
  },
  {
    id: 'link-building',
    name: 'High-Authority Link Equity',
    category: 'Off-Page SEO',
    priceRange: '$1,200 - $3,500/mo',
    description: 'White-hat digital PR outreach securing Tier-1 editorial backlinks from major news publications, university domains, and industry leaders.',
    highlights: ['DR 50-90+ Publications', 'Competitor Gap Closure', 'Manual Outreach']
  },
  {
    id: 'ppc',
    name: 'Precision PPC Advertising',
    category: 'Paid Acquisition',
    priceRange: '$2,000 - $6,000/mo',
    description: 'High-velocity paid search and social campaigns across Google Ads, Meta, and LinkedIn calibrated for lowest CAC and maximum pipeline ROI.',
    highlights: ['Target ROAS Bidding', 'Conversion Tracking API', 'A/B Creative Sprints']
  },
  {
    id: 'web-development',
    name: 'Next.js Digital Platforms',
    category: 'Engineering & UI',
    priceRange: '$3,500 - $12,000',
    description: 'Bespoke high-performance digital experiences built on Next.js 16, React, and Tailwind CSS. Ultra-fast core web vitals that convert visitors.',
    highlights: ['Sub-Second Load Times', 'Awwwards Design System', 'Schema Microdata']
  },
  {
    id: 'smm',
    name: 'Social Media Authority',
    category: 'Brand Strategy',
    priceRange: '$1,500 - $4,000/mo',
    description: 'Executive ghostwriting, organic distribution, and community cultivation across LinkedIn, X, and YouTube to build lasting founder brand equity.',
    highlights: ['Thought Leadership', 'Audience Building', 'Content Engine']
  }
];

export default function ServicesPage() {
  const [servicesList, setServicesList] = useState<any[]>([]);

  useEffect(() => {
    const customServices = getServices();
    const combined = [...customServices];
    defaultServiceList.forEach(def => {
      if (!combined.some(c => c.name.toLowerCase() === def.name.toLowerCase())) {
        combined.push({
          id: def.id,
          name: def.name,
          category: def.category,
          status: 'Active',
          priceRange: def.priceRange,
          description: def.description,
          highlights: def.highlights
        });
      }
    });
    const timer = setTimeout(() => {
      setServicesList(combined);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Hero Header */}
      <section className="pt-36 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Full-Spectrum Commercial Growth</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
              Engineering{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                Market Dominance.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
              We orchestrate precision search engine positioning, elite editorial link placements, and high-converting modern web applications designed to deliver scalable revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {servicesList.map((s) => {
              const icon = serviceIcons[s.id] || <Sparkles className="w-6 h-6 text-cyan-400" />;
              return (
                <div 
                  key={s.id} 
                  className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-7 sm:p-8 hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(56,189,248,0.2)] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon & Price Pill */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/30 transition-colors">
                        {icon}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-semibold font-mono">
                        {s.priceRange}
                      </span>
                    </div>

                    {/* Name & Category */}
                    <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
                      {s.category}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                      {s.name}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                      {s.description}
                    </p>

                    {/* Highlight bullets */}
                    {s.highlights && (
                      <ul className="space-y-2 mb-6 pt-4 border-t border-white/5">
                        {s.highlights.map((h: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <Link 
                      href={`/services/${s.id}`} 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-cyan-300 transition-colors"
                    >
                      <span>Explore Capability</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {(s.id === 'guest-posting' || s.id === 'link-building') && (
                      <Link 
                        href="/contact" 
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                      >
                        Order Outreach →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
