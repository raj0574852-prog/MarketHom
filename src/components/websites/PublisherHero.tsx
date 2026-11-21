import React from 'react';
import { WebsiteListing } from './types';
import PublisherLogo from './PublisherLogo';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { ExternalLink, ShieldCheck, Globe, Clock, Sparkles } from 'lucide-react';

function getCategoryBannerImage(category?: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('tech') || cat.includes('software') || cat.includes('saas') || cat.includes('app') || cat.includes('ai')) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop';
  }
  if (cat.includes('finance') || cat.includes('business') || cat.includes('crypto') || cat.includes('money') || cat.includes('invest')) {
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop';
  }
  if (cat.includes('marketing') || cat.includes('seo') || cat.includes('media') || cat.includes('digital') || cat.includes('agency')) {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop';
  }
  if (cat.includes('health') || cat.includes('fitness') || cat.includes('medical') || cat.includes('wellness') || cat.includes('diet')) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop';
  }
  if (cat.includes('education') || cat.includes('learn') || cat.includes('school') || cat.includes('college') || cat.includes('academic')) {
    return 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop';
  }
  if (cat.includes('travel') || cat.includes('hotel') || cat.includes('tourism') || cat.includes('vacation')) {
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop';
  }
  if (cat.includes('real estate') || cat.includes('home') || cat.includes('property') || cat.includes('construction')) {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop';
  }
  if (cat.includes('sport') || cat.includes('game') || cat.includes('gaming') || cat.includes('football')) {
    return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600&auto=format&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop';
}

export function PublisherHero({ website }: { website: WebsiteListing }) {
  const isVerified = website.verification_status === 'verified' || !!website.last_verified_at;

  // Determine Quality Tier
  let tier = 'Verified Partner';
  let tierBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  
  if (website.website_metrics) {
    let da = 0, dr = 0, traffic = 0;
    for (const m of website.website_metrics) {
      const t = m.metric_type?.toUpperCase();
      if (t === 'DA' || t === 'DOMAIN_AUTHORITY') da = Number(m.value) || 0;
      if (t === 'DR' || t === 'DOMAIN_RATING') dr = Number(m.value) || 0;
      if (t === 'SEMRUSH_TRAFFIC' || t === 'ORGANIC_TRAFFIC' || t === 'TRAFFIC') traffic = Number(m.value) || 0;
    }
    if (da >= 50 || dr >= 50 || traffic >= 30000) {
      tier = 'Elite Authority';
      tierBadge = 'bg-amber-400/10 text-amber-300 border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.15)]';
    } else if (da >= 30 || dr >= 30 || traffic >= 5000) {
      tier = 'Premium Publisher';
      tierBadge = 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]';
    }
  }

  const heroBannerUrl = website.featured_image_url || getCategoryBannerImage(website.category_id);
  const price = website.content_placement_selling_price || website.price || 49;
  const currency = website.currency === 'USD' || !website.currency ? '$' : website.currency;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl mb-8 group">
      <BorderBeam size={300} duration={12} delay={0} colorFrom="#38bdf8" colorTo="#6366f1" />
      
      {/* Hero Cover Banner */}
      <div className="w-full h-[220px] md:h-[280px] bg-slate-950 relative overflow-hidden">
        <img
          src={heroBannerUrl}
          alt={`${website.name || website.domain} cover`}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.2] transition-transform duration-700 group-hover:scale-105"
        />

        {/* Ambient Dark Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950/90" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

        {/* Top Floating Status Pills */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10 flex-wrap">
          <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            100% Indexation Guaranteed
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-slate-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {website.turnaround_time ? `${website.turnaround_time}d Delivery` : 'Fast Delivery'}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="relative px-6 pb-8 md:px-10 md:pb-10 -mt-16 md:-mt-18 flex flex-col md:flex-row gap-6 z-10">
        {/* Publisher Logo Avatar */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-900/90 rounded-2xl shadow-2xl border-2 border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden relative p-3 backdrop-blur-md ring-4 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition-all">
          <PublisherLogo domain={website.domain} name={website.name} className="w-full h-full object-contain" />
        </div>

        {/* Header Info */}
        <div className="flex-1 pt-2 md:pt-14 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider border rounded-full ${tierBadge}`}>
              {tier}
            </span>

            <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              DoFollow Link
            </span>

            {website.category_id && (
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-300 bg-white/5 border border-white/10 rounded-full">
                {website.category_id}
              </span>
            )}

            {website.location && (
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-300 bg-white/5 border border-white/10 rounded-full flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-cyan-400" />
                {website.location}
              </span>
            )}

            {isVerified && (
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                MarketHom Verified
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2 leading-tight tracking-tight min-w-0 break-words">
            Publish Guest Post on{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              {website.domain}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <a
              href={website.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/40"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {website.domain}
            </a>

            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <span className="text-slate-500">Starting from</span>
              <span className="text-lg font-bold text-white tracking-tight">
                {currency}{price}
              </span>
            </div>
          </div>

          {website.short_description && (
            <p className="text-slate-300 text-[15px] md:text-base leading-relaxed max-w-3xl mt-2 min-w-0 break-words font-light">
              {website.price && website.content_placement_selling_price
                ? website.short_description.split(`$${website.price}`).join(`$${website.content_placement_selling_price}`)
                : website.short_description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
