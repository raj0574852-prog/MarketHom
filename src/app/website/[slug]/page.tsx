import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { lookupCatalogPublisher } from '@/lib/publishers/catalogLookup';

// Components
import { PublisherHero } from '@/components/websites/PublisherHero';
import QuickAnswer from '@/components/websites/QuickAnswer';
import QuickOverview from '@/components/websites/QuickOverview';
import { PublisherOrderSummary } from '@/components/websites/PublisherOrderSummary';
import { PublisherMetrics } from '@/components/websites/PublisherMetrics';
import { PublisherAuthoritySnapshot } from '@/components/websites/PublisherAuthoritySnapshot';
import RelatedWebsites from '@/components/websites/RelatedWebsites';
import FAQAccordion from '@/components/websites/FAQAccordion';
import PublisherOverview from '@/components/websites/PublisherOverview';
import HowItWorks from '@/components/websites/HowItWorks';
import { generatePublisherFAQs } from '@/components/websites/faqGenerator';
import { normalizePublisherMetrics } from '@/components/websites/utils/normalizeMetrics';
import type { WebsiteListing } from '@/components/websites/types';
import { CANONICAL_SITE_URL } from '@/lib/constants';
import { evaluatePublisherIndexability } from '@/lib/seo/evaluatePublisherIndexability';
import { ChevronRight, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight, Info } from 'lucide-react';

export const revalidate = 60;

async function getListingData(slug: string): Promise<WebsiteListing | null> {
  // 1. Try Supabase first if configured
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );

  if (isSupabaseConfigured) {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase
        .from('website_listings')
        .select('*, website_metrics(*), website_faqs(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
        return data;
      }
    } catch {
      // Supabase error, fall through to catalog lookup
    }
  }

  // 2. High-speed lookup in local dataset (29,000+ domains including piecesdetacheeseriba.fr)
  const catalogListing = await lookupCatalogPublisher(slug);
  if (catalogListing) {
    return catalogListing;
  }

  return null;
}

function isSafeText(text: string | null | undefined, maxLength: number): boolean {
  if (!text || text.trim().length === 0) return false;
  if (text.length > maxLength) return false;
  
  const lower = text.toLowerCase();
  if (/\$[0-9.,]+/.test(lower)) return false;
  if (/starting at/i.test(lower)) return false;
  if (/from\s*\$/i.test(lower)) return false;
  if (/\bn\/a\b/i.test(lower)) return false;

  return true;
}

function resolvePublisherMetadata(website: WebsiteListing) {
  const domain = website.domain;
  const category = (website.category_id && website.category_id !== 'General') ? website.category_id : 'General';
  
  // 1. Title Validation & Fallback
  let title = '';
  if (website.seo_title && isSafeText(website.seo_title, 80)) {
    title = website.seo_title;
  } else {
    const idealTitle = `Buy Guest Post on ${domain} | MarketHom`;
    if (idealTitle.length <= 60) {
      title = idealTitle;
    } else {
      title = `${domain} Guest Post & SEO Placement | MarketHom`;
    }
  }

  // 2. Description Validation & Fallback
  let description = '';
  if (website.seo_description && isSafeText(website.seo_description, 160)) {
    description = website.seo_description;
  } else {
    description = `Publish an authentic, permanent guest post on ${domain}. High authority in ${category} with verified DoFollow links and rapid editorial turnaround.`;
  }

  // 3. Keywords Assembly
  const keywords = [
    `${domain} guest post`,
    `buy guest post on ${domain}`,
    `${domain} backlinks`,
    `${domain} sponsored article`,
    `${category} guest posting`,
    'seo backlink marketplace',
    'permanent dofollow link'
  ];

  return { title, description, keywords };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const website = await getListingData(slug);
  
  if (!website) {
    return { title: 'Publisher Not Found | MarketHom' };
  }

  const { title, description, keywords } = resolvePublisherMetadata(website);
  const canonical = website.canonical_url || `${CANONICAL_SITE_URL}/website/${website.slug}`;

  // Evaluate indexability dynamically
  const { indexable } = evaluatePublisherIndexability(website);

  const openGraphImages = [];
  if (website.logo_url && website.logo_url.startsWith('http')) {
    openGraphImages.push({
      url: website.logo_url,
      alt: `${website.name || website.domain} logo`,
    });
  }

  return {
    title: {
      absolute: title
    },
    description,
    keywords,
    alternates: {
      canonical
    },
    robots: {
      index: indexable,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      ...(openGraphImages.length > 0 && { images: openGraphImages })
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(openGraphImages.length > 0 && { images: openGraphImages.map(img => img.url) })
    }
  };
}

export default async function WebsiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const website = await getListingData(slug);

  if (!website) {
    notFound();
  }

  const faqs = generatePublisherFAQs(website);
  const canonical = website.canonical_url || `${CANONICAL_SITE_URL}/website/${website.slug}`;
  const publisherName = website.name && website.name.toLowerCase() !== website.domain.toLowerCase() ? website.name : website.domain;
  
  const { title: finalTitle, description: finalDescription } = resolvePublisherMetadata(website);

  return (
    <main className="bg-slate-950 min-h-screen font-sans text-slate-100 pb-28 pt-28 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': `${canonical}#webpage`,
                'url': canonical,
                'name': finalTitle,
                'description': finalDescription,
                'publisher': {
                  '@id': `${CANONICAL_SITE_URL}/#organization`
                }
              },
              {
                '@type': 'BreadcrumbList',
                '@id': `${canonical}#breadcrumb`,
                'itemListElement': [
                  {
                    '@type': 'ListItem',
                    'position': 1,
                    'name': 'Home',
                    'item': CANONICAL_SITE_URL,
                  },
                  {
                    '@type': 'ListItem',
                    'position': 2,
                    'name': 'Marketplace',
                    'item': `${CANONICAL_SITE_URL}/websites`,
                  },
                  {
                    '@type': 'ListItem',
                    'position': 3,
                    'name': publisherName,
                    'item': canonical,
                  },
                ],
              }
            ]
          }),
        }}
      />
      
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb with Glass Pill Styling */}
        <div className="mb-6 text-xs sm:text-sm font-medium text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/" className="hover:text-cyan-400 transition-colors shrink-0">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <Link href="/websites" className="hover:text-cyan-400 transition-colors shrink-0">Marketplace</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-white font-semibold min-w-0 break-all">{publisherName}</span>
        </div>

        {/* Hero Area */}
        <PublisherHero website={website} />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] gap-8 relative">
          
          {/* Left Column - Main Content */}
          <div className="flex flex-col min-w-0 w-full">
            
            <PublisherMetrics metrics={website.website_metrics} />
            
            <div className="mb-8">
              <QuickOverview website={website} />
            </div>
            
            {/* Quick Answer Snippet */}
            <QuickAnswer website={website} />
            
            <PublisherOverview website={website} />
            
            <PublisherAuthoritySnapshot metrics={website.website_metrics} domain={website.domain} />
            
            <HowItWorks />
            
            <FAQAccordion faqs={faqs} />
            
            {/* Third-Party Advisory Note */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 text-sm text-slate-300 mb-8 shadow-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-white block mb-1">
                  Algorithmic Verification Notice
                </strong>
                All metrics are audited continuously via third-party providers (Moz, Ahrefs, Semrush). We ensure each editorial placement conforms to Google Search Essentials and publisher editorial standards with 100% indexation SLA.
              </div>
            </div>

            {(website.updated_at || website.last_verified_at) && (
              <div className="text-xs text-slate-500 italic mb-8">
                Listing information last verified: {new Date(website.updated_at || website.last_verified_at!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}

            <RelatedWebsites 
              categoryId={website.category_id} 
              currentId={website.id} 
              currentPrice={website.content_placement_selling_price}
            />
          </div>

          {/* Right Column - Order Summary & Agency Assurance */}
          <div className="w-full min-w-0 order-first lg:order-last mb-8 lg:mb-0 space-y-6">
            <PublisherOrderSummary website={website} />
            
            {/* Why Choose Publisher Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl p-6 sm:p-7">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Placement Advantages
              </h2>
              <ul className="space-y-3.5">
                {website.category_id && (
                  <li className="flex gap-3 text-slate-300 text-sm font-light">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Established topical authority in the <strong className="text-white font-medium">{website.category_id}</strong> sector</span>
                  </li>
                )}
                {website.max_dofollow_links !== undefined && website.max_dofollow_links > 0 && (
                  <li className="flex gap-3 text-slate-300 text-sm font-light">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Permits up to <strong className="text-white font-medium">{website.max_dofollow_links} permanent DoFollow</strong> backlink(s)</span>
                  </li>
                )}
                <li className="flex gap-3 text-slate-300 text-sm font-light">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Permanent contextual placement with zero sponsored meta labels</span>
                </li>
                {website.last_verified_at && (
                  <li className="flex gap-3 text-slate-300 text-sm font-light">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Manually audited and approved by the MarketHom editorial committee</span>
                  </li>
                )}
              </ul>
            </div>
            
            {/* Custom Strategy Support Card */}
            <div className="bg-gradient-to-br from-blue-950/60 via-slate-900/80 to-slate-950 rounded-3xl border border-blue-500/20 shadow-xl p-6 sm:p-7 text-white">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4" />
                Dedicated Strategy Team
              </div>
              <h3 className="text-base font-bold text-white mb-2">Custom Backlink Package?</h3>
              <p className="text-slate-300 text-sm mb-5 leading-relaxed font-light">
                Need high-volume Tier-1 placements, custom anchor strategy, or unlisted elite publishers? Speak directly with our senior SEO architects.
              </p>
              <Link 
                href="/contact" 
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/15 transition-all hover:border-cyan-400/40"
              >
                <span>Consult SEO Specialist</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
