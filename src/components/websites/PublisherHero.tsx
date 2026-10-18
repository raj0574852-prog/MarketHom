import React from 'react';
import { WebsiteListing } from './types';
import PublisherLogo from './PublisherLogo';

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
  // Universal sleek modern digital abstract network image
  return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop';
}

export function PublisherHero({ website }: { website: WebsiteListing }) {
  const isVerified = website.verification_status === 'verified' && website.last_verified_at;

  // Determine Quality Tier
  let tier = 'Standard';
  let tierColor = 'bg-slate-100 text-slate-700 border-slate-200';
  
  if (website.website_metrics) {
    let da = 0, dr = 0, traffic = 0;
    for (const m of website.website_metrics) {
      const t = m.metric_type?.toUpperCase();
      if (t === 'DA' || t === 'DOMAIN_AUTHORITY') da = Number(m.value) || 0;
      if (t === 'DR' || t === 'DOMAIN_RATING') dr = Number(m.value) || 0;
      if (t === 'SEMRUSH_TRAFFIC' || t === 'ORGANIC_TRAFFIC' || t === 'TRAFFIC') traffic = Number(m.value) || 0;
    }
    if (da >= 60 || dr >= 60 || traffic >= 50000) {
      tier = 'Elite';
      tierColor = 'bg-[hsl(39,100%,58%)]/10 text-[hsl(39,100%,58%)] border-[hsl(39,100%,58%)]/30';
    } else if (da >= 40 || dr >= 40 || traffic >= 10000) {
      tier = 'Premium';
      tierColor = 'bg-[hsl(217,91%,54%)]/10 text-[hsl(217,91%,54%)] border-[hsl(217,91%,54%)]/30';
    }
  }

  // Choose the hero background image: featured_image_url or category-matched Unsplash banner
  const heroBannerUrl = website.featured_image_url || getCategoryBannerImage(website.category_id);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200 mb-8 group">
      {/* Hero Background with High-Definition Cover Banner */}
      <div className="w-full h-[220px] md:h-[290px] bg-slate-950 relative overflow-hidden">
        {/* Background photo */}
        <img
          src={heroBannerUrl}
          alt={`${website.name || website.domain} background cover`}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.1] transition-transform duration-700 group-hover:scale-105"
        />

        {/* Ambient color gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-900/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />

        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none opacity-60" />

        {/* Top right badges */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Verified Placement
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative px-6 pb-8 md:px-10 md:pb-10 -mt-14 md:-mt-16 flex flex-col md:flex-row gap-6">
        {/* Logo Container */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-xl border-2 border-white flex items-center justify-center flex-shrink-0 overflow-hidden relative z-10 p-3 ring-4 ring-slate-900/10">
          <PublisherLogo domain={website.domain} name={website.name} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 pt-2 md:pt-16 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-md ${tierColor}`}>
              {tier}
            </span>
            {website.link_validity === 'DoFollow' && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-md">
                DoFollow
              </span>
            )}
            {website.category_id && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 rounded-md">
                {website.category_id}
              </span>
            )}
            {website.location && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 rounded-md flex items-center gap-1">
                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {website.location}
              </span>
            )}
            {isVerified && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 leading-tight tracking-tight min-w-0 break-words">
            Publish Guest Post on <span className="text-blue-600 break-words">{website.domain}</span>
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <a href={website.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {website.domain}
              <span className="text-slate-400 text-xs">↗</span>
            </a>
          </div>

          {website.short_description && (
            <p className="text-slate-600 text-[15px] md:text-base leading-relaxed max-w-3xl mt-2 min-w-0 break-words">
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
