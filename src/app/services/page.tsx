'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';
import { getServices, SiteService } from '@/lib/resourcesStore';

const defaultServiceList = [
  {
    id: 'seo',
    name: 'Search Engine Optimization',
    category: 'SEO',
    priceRange: '$1,500 - $4,500/mo',
    description: 'Dominate organic search results with data-driven strategies that build long-term authority and drive qualified traffic.',
  },
  {
    id: 'ai-seo',
    name: 'AI-Powered SEO',
    category: 'SEO',
    priceRange: '$2,000 - $5,000/mo',
    description: 'Harness the power of artificial intelligence to scale content production and gain a competitive edge in modern search.',
  },
  {
    id: 'ppc',
    name: 'PPC Advertising',
    category: 'PPC',
    priceRange: '$2,000 - $6,000/mo',
    description: 'Laser-targeted paid campaigns across Google, Meta, and LinkedIn designed to maximize ROI and lower acquisition costs.',
  },
  {
    id: 'web-development',
    name: 'Web Development',
    category: 'Web Dev',
    priceRange: '$3,500 - $12,000',
    description: 'Fast, secure, and conversion-optimized websites built on Next.js and React. Sites that look great and rank even better.',
  },
  {
    id: 'link-building',
    name: 'Link Building',
    category: 'Link Building',
    priceRange: '$1,200 - $3,500/mo',
    description: 'Build a powerful backlink profile with white-hat outreach and digital PR. High-authority links that move the needle.',
  },
  {
    id: 'smm',
    name: 'Social Media Marketing',
    category: 'Social',
    priceRange: '$1,500 - $4,000/mo',
    description: 'Strategic social media management that builds community, increases brand awareness, and drives meaningful engagement.',
  }
];

export default function ServicesPage() {
  const [servicesList, setServicesList] = useState<SiteService[]>([]);

  useEffect(() => {
    const customServices = getServices();
    // Merge custom admin services with standard list
    const combined = [...customServices];
    defaultServiceList.forEach(def => {
      if (!combined.some(c => c.name.toLowerCase() === def.name.toLowerCase())) {
        combined.push({
          id: def.id,
          name: def.name,
          category: def.category,
          status: 'Active',
          priceRange: def.priceRange,
          description: def.description
        });
      }
    });
    setServicesList(combined);
  }, []);

  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services' }]} />
          <div className="max-w-3xl">
            <span className="badge mb-4">Our Services</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Solutions for <span className="gradient-text">Growth.</span>
            </h1>
            <p className="text-[hsl(215,20%,65%)] text-xl leading-relaxed">
              We provide a comprehensive suite of digital marketing services designed to work together to scale your business and dominate your market.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((s) => (
              <div key={s.id} className="glass-card p-8 group hover:border-[hsl(217,91%,54%)]/40 transition-all flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">🚀</span>
                  <span className="px-3 py-1 rounded-full bg-[hsl(217,91%,54%)]/15 text-[hsl(217,91%,70%)] text-xs font-bold font-mono">
                    {s.priceRange}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-[hsl(217,91%,75%)] transition-colors">{s.name}</h2>
                <p className="text-[hsl(215,20%,60%)] text-sm leading-relaxed mb-6 flex-1">{s.description}</p>
                
                <div className="pt-4 border-t border-[hsl(215,25%,22%)]/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-[hsl(217,91%,70%)] uppercase tracking-wider">{s.category}</span>
                  <Link href="/contact" className="btn-outline px-4 py-2 text-xs">
                    Get Free Strategy →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
