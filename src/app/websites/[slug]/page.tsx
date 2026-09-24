import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabaseClient';

// Components
import WebsiteHero from '@/components/websites/WebsiteHero';
import QuickAnswer from '@/components/websites/QuickAnswer';
import QuickOverview from '@/components/websites/QuickOverview';
import PricingCard from '@/components/websites/PricingCard';
import MetricGrid from '@/components/websites/MetricGrid';
import RelatedWebsites from '@/components/websites/RelatedWebsites';
import FAQAccordion from '@/components/websites/FAQAccordion';
import PublisherOverview from '@/components/websites/PublisherOverview';
import HowItWorks from '@/components/websites/HowItWorks';
import { generatePublisherFAQs } from '@/components/websites/faqGenerator';

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
    if (slug === 'channillo.com') {
      return {
        id: 'mock-1',
        slug: 'channillo.com',
        name: 'Channillo',
        domain: 'channillo.com',
        website_url: 'https://channillo.com',
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
        short_description: 'Premium publishing opportunity on channillo.com.',
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
import { evaluatePublisherIndexability } from '@/lib/seo/qualityGate';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const website = await getListingData(slug);
  
  if (!website) {
    return { title: 'Not Found' };
  }

  const categoryName = website.category_id || 'General';
  
  let title = website.seo_title;
  if (!title) {
    const displayName = website.name && website.name.toLowerCase() !== website.domain.toLowerCase() ? website.name : website.domain;
    title = `${displayName} Guest Post & SEO Placement | EducationHom`;
  }
  
  // 1. Genuine publisher/editorial description
  // 2. Concise data-driven fallback
  let description = website.seo_description || website.editorial_description || website.short_description;
  if (!description) {
    const parts = [];
    parts.push(`Explore publishing opportunities on ${website.domain} in the ${categoryName} category.`);
    
    // Price is intentionally omitted from the meta description here 
    // to prevent Google Search from showing the price twice (once in description, once in Rich Snippets)

    
    const features = [];
    if (website.turnaround_time) {
      features.push(`${website.turnaround_time}-day turnaround`);
    }
    if (website.max_dofollow_links) {
      features.push(`up to ${website.max_dofollow_links} dofollow links`);
    }
    if (features.length > 0) {
      parts.push(`Includes ${features.join(' and ')}.`);
    }

    if (website.accepted_niches && website.accepted_niches.length > 0) {
      const niches = website.accepted_niches.slice(0, 2).join(' and ');
      parts.push(`Accepted niches include ${niches}.`);
    }
    
    description = parts.join(' ');
  }

  // Ensure any hardcoded base prices in the description are replaced with the correct selling price
  if (description && website.price && website.content_placement_selling_price) {
    const basePriceStr = `$${website.price}`;
    const sellPriceStr = `$${website.content_placement_selling_price}`;
    description = description.split(basePriceStr).join(sellPriceStr);
  }

  // Strip pricing sentences from the meta description to avoid double-pricing in Google Search results
  // (Google already shows the price via the structured data Offer schema)
  if (description) {
    description = description.replace(/currently available starting at \$\d+(?:\.\d+)?(?: USD)?\.?/ig, '').trim();
    description = description.replace(/available starting at \$\d+(?:\.\d+)?(?: USD)?\.?/ig, '').trim();
    description = description.replace(/starting at \$\d+(?:\.\d+)?(?: USD)?\.?/ig, '').trim();
  }
  
  
  const canonical = website.canonical_url || `${CANONICAL_SITE_URL}/websites/${website.slug}`;

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
    title,
    description,
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
  const canonical = website.canonical_url || `${CANONICAL_SITE_URL}/websites/${website.slug}`;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24 pt-20">
      {/* WebPage & Breadcrumb Schema */}
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
                'name': website.seo_title || `${website.name && website.name.toLowerCase() !== website.domain.toLowerCase() ? website.name : website.domain} — Publisher Information & Content Placement`,
                'description': (() => {
                  let desc = website.seo_description || website.short_description || `Publishing opportunity on ${website.domain} in the ${website.category_id || 'General'} category.`;
                  if (website.price && website.content_placement_selling_price) {
                    desc = desc.split(`$${website.price}`).join(`$${website.content_placement_selling_price}`);
                  }
                  return desc;
                })(),
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: CANONICAL_SITE_URL,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Marketplace',
                    item: `${CANONICAL_SITE_URL}/websites`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: website.name || website.domain,
                    item: canonical,
                  },
                ],
              },
              ...(website.content_placement_selling_price ? [{
                '@type': 'Service',
                '@id': `${canonical}#service`,
                'name': `Content Placement on ${website.name || website.domain}`,
                'serviceType': 'Guest Post and Content Placement',
                'description': website.short_description || `Premium publishing opportunity on ${website.domain}. Secure high-quality backlinks.`,
                'url': canonical,
                'provider': {
                  '@type': 'Organization',
                  'name': 'EducationHom',
                  'url': CANONICAL_SITE_URL
                },
                'offers': {
                  '@type': 'Offer',
                  'url': canonical,
                  'priceCurrency': website.currency || 'USD',
                  'price': website.content_placement_selling_price,
                  'availability': 'https://schema.org/InStock'
                }
              }] : [])
            ]
          }),
        }}
      />
      {/* FAQ Schema */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq: any) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer
                }
              }))
            })
          }}
        />
      )}
      {/* Breadcrumbs (Light theme version for this page) */}
      <div className="bg-white border-b border-slate-200 py-3 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/websites" className="hover:text-blue-600 transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{website.name || website.domain}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Hero Section (Top on mobile, Top-Left on desktop) */}
          <div className="lg:col-span-2 order-1">
            <WebsiteHero website={website} />
          </div>

          {/* 2. Sidebar Column (Middle on mobile, Right on desktop) */}
          <div className="lg:col-span-1 lg:row-span-2 space-y-6 order-2 lg:sticky lg:top-24 self-start">
            <PricingCard website={website} />
            
            {/* Sidebar Benefits Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Why Choose {website.name || website.domain}?</h2>
              <ul className="space-y-3">
                {website.category_id && (
                  <li className="flex gap-3 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-[hsl(217,91%,54%)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Relevant audience in the {website.category_id} sector
                  </li>
                )}
                {website.max_dofollow_links > 0 && (
                  <li className="flex gap-3 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-[hsl(217,91%,54%)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Allows up to {website.max_dofollow_links} dofollow links
                  </li>
                )}
                {website.original_content_required && (
                  <li className="flex gap-3 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-[hsl(217,91%,54%)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Maintains high standards with original content
                  </li>
                )}
                {website.last_verified_at && (
                  <li className="flex gap-3 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-[hsl(217,91%,54%)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Manually verified by our editorial team
                  </li>
                )}
              </ul>
            </div>

            {/* Need Help Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 text-white">
              <h2 className="text-lg font-bold mb-2">Need Help?</h2>
              <p className="text-slate-400 text-sm mb-4">Not sure if this website is the right fit for your brand? Our SEO experts can help you build the perfect placement strategy.</p>
              <Link href="/contact" className="text-[hsl(217,91%,54%)] font-semibold text-sm hover:text-white transition-colors">
                Contact Strategy Team &rarr;
              </Link>
            </div>
          </div>

          {/* 3. Main Content Column (Bottom on mobile, Bottom-Left on desktop) */}
          <div className="lg:col-span-2 space-y-8 order-3">
            <QuickAnswer website={website} />
            <QuickOverview website={website} />
            
            {(website.updated_at || website.last_verified_at) && (
              <div className="text-sm text-slate-500 italic">
                Listing information last updated: {new Date(website.updated_at || website.last_verified_at!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}

            {/* Metrics are partially in Quick Overview, but MetricGrid provides deeper context/tooltips */}
            <MetricGrid metrics={website.website_metrics} linkValidity={website.link_validity} />

            {/* About Section - Uses PublisherOverview component */}
            <PublisherOverview website={website} />

            <HowItWorks />
            
            <FAQAccordion faqs={faqs} />

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800 mt-8">
              <strong className="font-bold flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                Important Note
              </strong>
              All metrics are third-party estimates and may change over time. We recommend visiting the website and reviewing the publisher&apos;s latest guidelines before submitting your content.
            </div>

            <RelatedWebsites categoryId={website.category_id} currentId={website.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
