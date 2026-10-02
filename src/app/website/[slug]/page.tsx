import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabaseClient';

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

export const revalidate = 60;

async function getListingData(slug: string) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('website_listings')
    .select('*, website_metrics(*), website_faqs(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    if (slug === 'channillo.com' || slug === 'reibootpro.com' || slug === 'corvetteguruforum.com' || slug === 'my10000dollars.com') {
      const name = slug.split('.')[0].charAt(0).toUpperCase() + slug.split('.')[0].slice(1);
      return {
        id: 'mock-1',
        slug: slug,
        name: name,
        domain: slug,
        website_url: `https://${slug}`,
        category_id: 'General',
        price: 23,
        currency: 'USD',
        location: 'Worldwide',
        language: 'English',
        link_validity: 'Permanent',
        max_dofollow_links: 1,
        publication_type: 'Guest Post / Sponsored',
        accepted_niches: ['General Niches', 'Adult / Dating', 'Casino / CBD / Crypto'],
        last_verified_at: new Date().toISOString(),
        status: 'published',
        short_description: `Premium publishing opportunity on ${slug}.`,
        website_metrics: [
          { metric_type: 'DA', value: 41 },
          { metric_type: 'PA', value: 41 },
          { metric_type: 'DR', value: 41 },
          { metric_type: 'SEMRUSH_AUTHORITY', value: 14 },
          { metric_type: 'SPAM_SCORE', value: 58, unit: '%' }
        ]
      };
    }
    return null;
  }
  return data;
}

import { CANONICAL_SITE_URL } from '@/lib/constants';
import { evaluatePublisherIndexability } from '@/lib/seo/evaluatePublisherIndexability';

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

function resolvePublisherMetadata(website: any) {
  const domain = website.domain;
  const category = (website.category_id && website.category_id !== 'General') ? website.category_id : 'General';
  
  // 1. Title Validation & Fallback
  let title = '';
  if (isSafeText(website.seo_title, 80)) {
    title = website.seo_title;
  } else {
    const idealTitle = `Buy Guest Post on ${domain} | EducationHom`;
    if (idealTitle.length <= 60) {
      title = idealTitle;
    } else {
      title = `${domain} Guest Post & SEO Placement | EducationHom`;
    }
  }

  // 2. Description Validation & Fallback
  let description = '';
  if (isSafeText(website.seo_description, 250)) {
    description = website.seo_description;
  } else {
    let metricsStr = '';
    const metrics = website.website_metrics || website.metrics || {};
    const da = metrics.da || metrics.domain_authority;
    const dr = metrics.dr || metrics.domain_rating;
    const traffic = metrics.traffic || metrics.semrush_traffic || metrics.organic_traffic;
    
    const parts = [];
    if (da && String(da).toLowerCase() !== 'n/a' && Number(da) > 0) parts.push(`DA ${da}`);
    if (dr && String(dr).toLowerCase() !== 'n/a' && Number(dr) > 0) parts.push(`DR ${dr}`);
    if (traffic && String(traffic).toLowerCase() !== 'n/a' && traffic !== '0') parts.push(`organic traffic ${traffic}`);
    
    if (parts.length > 0) {
      metricsStr = ` ${parts.join(', ')}.`;
    }
    
    if (metricsStr) {
      description = `Publish a guest post on ${domain}. Category: ${category}.${metricsStr} Explore placement details on EducationHom.`;
    } else {
      description = `Publish a guest post on ${domain}. Category: ${category}. Explore publishing guidelines, link options, and SEO placement details on EducationHom.`;
    }
  }

  // 3. Keywords Generation (Deduplicated)
  const baseKeywords = ['guest post', domain, 'content placement', 'SEO placement'];
  if (category && category !== 'General') {
    baseKeywords.push(category.toLowerCase());
  }
  if (website.accepted_niches && Array.isArray(website.accepted_niches)) {
    website.accepted_niches.forEach((n: string) => {
      if (n !== 'General Niches' && n !== category) {
        baseKeywords.push(n.toLowerCase());
      }
    });
  }
  const keywords = Array.from(new Set(baseKeywords));

  return { title, description, keywords };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const website = await getListingData(slug);
  
  if (!website) {
    return { title: 'Not Found' };
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
    keywords: keywords.join(', '),
    alternates: {
      canonical
    },
    robots: {
      index: indexable,
      follow: true, // Always follow to allow crawling other links even if this page is noindex
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
  
  const normalizedMetrics = normalizePublisherMetrics(website.website_metrics);

  return (
    <main className="bg-[#F7F8FC] min-h-screen font-sans text-slate-800 pb-24 pt-20">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': `${CANONICAL_SITE_URL}/#organization`,
                'name': 'EducationHom',
                'url': CANONICAL_SITE_URL,
                'logo': `${CANONICAL_SITE_URL}/logo.png`
              },
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
      {/* FAQ Schema removed as requested */}
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-4 text-sm font-medium text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/websites" className="hover:text-blue-600 transition-colors">Marketplace</Link>
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-900 font-bold">{publisherName}</span>
        </div>

        {/* Hero Area */}
        <PublisherHero website={website} />

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* Left Column - Main Content (~68%) */}
          <div className="w-full lg:w-[68%] flex flex-col min-w-0">
            
            <PublisherMetrics metrics={website.website_metrics} />
            
            <QuickOverview website={website} />
            
            {/* SEO Semantics preserved here */}
            <div className="mb-8">
              <QuickAnswer website={website} />
            </div>
            
            <PublisherOverview website={website} />
            
            <PublisherAuthoritySnapshot metrics={website.website_metrics} domain={website.domain} />
            
            <HowItWorks />
            
            <FAQAccordion faqs={faqs} />
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800 mb-8 shadow-sm">
              <strong className="font-bold flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                Important Note
              </strong>
              All metrics are third-party estimates and may change over time. We recommend visiting the website and reviewing the publisher&apos;s latest guidelines before submitting your content.
            </div>

            {(website.updated_at || website.last_verified_at) && (
              <div className="text-xs text-slate-400 italic mb-8">
                Listing information last updated: {new Date(website.updated_at || website.last_verified_at!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}

            <RelatedWebsites 
              categoryId={website.category_id} 
              currentId={website.id} 
              currentPrice={website.content_placement_selling_price}
            />
          </div>

          {/* Right Column - Order Summary (~32%) */}
          <div className="w-full lg:w-[32%] shrink-0 order-first lg:order-last mb-8 lg:mb-0">
            <PublisherOrderSummary website={website} />
            
            {/* Extra Sidebar Benefits */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Why Choose {publisherName}?</h2>
              <ul className="space-y-3">
                {website.category_id && (
                  <li className="flex gap-3 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Relevant audience in the {website.category_id} sector
                  </li>
                )}
                {website.max_dofollow_links > 0 && (
                  <li className="flex gap-3 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Allows up to {website.max_dofollow_links} dofollow links
                  </li>
                )}
                {website.original_content_required && (
                  <li className="flex gap-3 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Maintains high standards with original content
                  </li>
                )}
                {website.last_verified_at && (
                  <li className="flex gap-3 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Manually verified by our editorial team
                  </li>
                )}
              </ul>
            </div>
            
            {/* Need Help Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 text-white mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Need Help?</h2>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">Not sure if this website is the right fit for your brand? Our SEO experts can help you build the perfect placement strategy.</p>
              <Link href="/contact" className="text-blue-400 font-bold text-sm hover:text-white transition-colors flex items-center gap-2">
                Contact Strategy Team
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
