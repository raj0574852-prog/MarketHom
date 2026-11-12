'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { BorderBeam } from '@/components/ui/BorderBeam';

export default function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden bg-slate-950 py-24">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/25 via-indigo-600/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="relative rounded-3xl p-10 md:p-16 bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 backdrop-blur-2xl text-center max-w-4xl mx-auto shadow-2xl shadow-black/80 overflow-hidden">
          <BorderBeam size={280} duration={14} colorFrom="#60a5fa" colorTo="#c084fc" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to Scale Your Organic Engine?</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.08]">
            Let&apos;s Build Your{' '}
            <span className="gradient-text">Unfair Search Advantage</span>
          </h2>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Claim your confidential 360° competitive audit. We will analyze your search footprint, uncover high-intent commercial gaps, and show you exactly how to outrank your competition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
            >
              <span>Get Your Free SEO Audit</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>View Transparent Plans</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free 30-Minute Consultation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Obligation or Lock-In
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Actionable Strategy in 48 Hours
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
