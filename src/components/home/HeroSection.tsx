'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, Sparkles, ShieldCheck, Zap, Activity, Globe } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import { BorderBeam } from '@/components/ui/BorderBeam';

const PARTNERS = [
  'Google Premier Partner',
  'Meta Business Partner',
  'HubSpot Certified',
  'Semrush Agency Partner',
  'Ahrefs Authority Network',
  'Forbes Agency Council',
  'Moz Top Rated',
  'Shopify Plus Partner',
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'seo' | 'aeo' | 'revenue'>('seo');

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-[hsl(222,47%,7%)] pt-28 pb-16">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-ambient-glow" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Awwwards-style Luminous Badge */}
          <div className="inline-flex items-center gap-2 mb-8 animate-fade-in-up">
            <div className="awwwards-glow-pill group cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
                AI Search & Growth Engine
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                EducationHom 2026
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.04] text-white">
            Dominate Search.
            <br />
            <span className="gradient-text">Engineered for Revenue.</span>
          </h1>

          {/* Concise, Grounded Subheading */}
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            We partner with ambitious brands to command top rankings, capture qualified intent, and build compounding organic traffic across Google, ChatGPT, and Perplexity.
          </p>

          {/* High-Converting CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/contact"
              title="Claim Your Free SEO Audit"
              className="relative group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
            >
              <BorderBeam size={120} duration={8} colorFrom="#60a5fa" colorTo="#c084fc" />
              <span>Claim Free Growth Audit</span>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/case-studies"
              title="Explore Client Case Studies"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-md"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Explore Case Studies</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold ml-1">
                +450% Avg ROI
              </span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% White-Hat Methodologies
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <TrendingUp className="w-4 h-4 text-blue-400" /> Transparent Performance Tracking
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" /> Zero Long-Term Lock-in Contracts
            </span>
          </div>
        </div>

        {/* 3D Tilt Interactive Growth Dashboard Preview */}
        <div className="max-w-4xl mx-auto">
          <TiltCard maxTilt={5}>
            <div className="awwwards-card p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-black/80">
              <BorderBeam size={250} duration={14} colorFrom="#38bdf8" colorTo="#818cf8" />

              {/* Dashboard Top bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">educationhom.analytics / live-metrics</span>
                </div>

                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeTab === 'seo' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Google SEO
                  </button>
                  <button
                    onClick={() => setActiveTab('aeo')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeTab === 'aeo' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Engine (AEO)
                  </button>
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeTab === 'revenue' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pipeline Value
                  </button>
                </div>
              </div>

              {/* Live Metric Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="text-xs text-slate-400 font-medium mb-1">
                    {activeTab === 'seo' ? 'Monthly Organic Traffic' : activeTab === 'aeo' ? 'AI Answer Mentions' : 'Attributed Revenue'}
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    {activeTab === 'seo' ? '1,420,890+' : activeTab === 'aeo' ? '84.2%' : '$4.28M+'}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 mt-2">
                    <TrendingUp className="w-3.5 h-3.5" /> +284% YoY Growth
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="text-xs text-slate-400 font-medium mb-1">Top 3 Search Placements</div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    {activeTab === 'seo' ? '14,250' : activeTab === 'aeo' ? 'Top Brand Rec' : '312 Key Queries'}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-400 mt-2">
                    <Activity className="w-3.5 h-3.5" /> Verified High Commercial Intent
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="text-xs text-slate-400 font-medium mb-1">Average ROAS / Multiple</div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    {activeTab === 'seo' ? '14.8x' : activeTab === 'aeo' ? '9.6x' : '11.2x'}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 mt-2">
                    <Sparkles className="w-3.5 h-3.5" /> Compounding Organic Equity
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Infinite Moving Authority Marquee */}
        <div className="mt-20 overflow-hidden relative">
          <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[hsl(222,47%,7%)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[hsl(222,47%,7%)] to-transparent z-10 pointer-events-none" />

          <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
            {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                <span className="text-xs font-bold tracking-widest uppercase">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
