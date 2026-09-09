import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabaseClient';

// Components
import WebsiteHero from '@/components/websites/WebsiteHero';
import QuickOverview from '@/components/websites/QuickOverview';
import PublishingOpportunity from '@/components/websites/PublishingOpportunity';
import PricingCard from '@/components/websites/PricingCard';
import MetricGrid from '@/components/websites/MetricGrid';
import PublishingGuidelines from '@/components/websites/PublishingGuidelines';
import AcceptedContent from '@/components/websites/AcceptedContent';
import RelatedWebsites from '@/components/websites/RelatedWebsites';
import FAQAccordion from '@/components/websites/FAQAccordion';
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
  const title = website.seo_title || `Publish Guest Post on ${website.domain} | Pricing & Publishing Details`;
  
  let description = website.seo_description || website.short_description;
  if (!description) {
    description = `Publishing opportunity on ${website.domain} in the ${categoryName} category.`;
    const displayPrice = website.content_placement_selling_price || website.price;
    if (displayPrice) {
      description += ` Listing includes $${displayPrice} pricing`;
    }
    const hasMetrics = website.website_metrics && website.website_metrics.length > 0;
    if (hasMetrics) {
      description += ` and SEO metrics`;
    }
    description += `.`;
  }
  
  const canonical = website.canonical_url || `${CANONICAL_SITE_URL}/websites/${website.slug}`;

  // Evaluate indexability dynamically
  const { indexable } = evaluatePublisherIndexability(website);

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
      type: 'article', // Or 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
                '@id': canonical,
                'url': canonical,
                'name': website.seo_title || `Publish Guest Post on ${website.domain}`,
                'description': website.seo_description || website.short_description || `Publishing opportunity on ${website.domain} in the ${website.category_id || 'General'} category.`,
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
              }
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
          <span className="text-slate-900 font-medium">{website.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Hero Section (Top on mobile, Top-Left on desktop) */}
          <div className="lg:col-span-2 order-1">
            <WebsiteHero website={website} />
          </div>

          {/* 2. Sidebar Column (Middle on mobile, Right on desktop) */}
          <div className="lg:col-span-1 lg:row-span-2 space-y-6 order-2">
            <PricingCard website={website} />
            
            {/* Sidebar Benefits Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Why Choose {website.name}?</h3>
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
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-slate-400 text-sm mb-4">Not sure if this website is the right fit for your brand? Our SEO experts can help you build the perfect placement strategy.</p>
              <Link href="/contact" className="text-[hsl(217,91%,54%)] font-semibold text-sm hover:text-white transition-colors">
                Contact Strategy Team &rarr;
              </Link>
            </div>
          </div>

          {/* 3. Main Content Column (Bottom on mobile, Bottom-Left on desktop) */}
          <div className="lg:col-span-2 space-y-8 order-3">
            <QuickOverview website={website} />
            <PublishingOpportunity website={website} />
            
            {(website.updated_at || website.last_verified_at) && (
              <div className="text-sm text-slate-500 italic">
                Listing information last updated: {new Date(website.updated_at || website.last_verified_at!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}

            {/* Metrics are partially in Quick Overview, but MetricGrid provides deeper context/tooltips */}
            <MetricGrid metrics={website.website_metrics} linkValidity={website.link_validity} />

            {/* About Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About {website.name}</h2>
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                  {website.long_description || website.short_description || 'No description provided.'}
                </p>
                
                {website.editorial_description && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Editorial Focus</h3>
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{website.editorial_description}</p>
                  </div>
                )}
                
                {website.audience_description && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Target Audience</h3>
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{website.audience_description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Guidelines & Policies */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <PublishingGuidelines website={website} />
            </div>

            <AcceptedContent website={website} />
            
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
