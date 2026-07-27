'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getServices, SiteService } from '@/lib/resourcesStore';

const defaultServices = [
  {
    icon: '🔍',
    name: 'SEO Services',
    category: 'SEO',
    priceRange: '$1,500 - $4,500/mo',
    description: 'Dominate organic search results with our data-driven SEO strategies. Technical audits to content optimization.',
  },
  {
    icon: '🤖',
    name: 'AI SEO',
    category: 'SEO',
    priceRange: '$2,000 - $5,000/mo',
    description: 'Harness the power of artificial intelligence to stay ahead of algorithm updates and build topical authority faster.',
  },
  {
    icon: '💰',
    name: 'PPC Advertising',
    category: 'PPC',
    priceRange: '$2,000 - $6,000/mo',
    description: 'Maximize every dollar with laser-targeted PPC campaigns across Google, Meta, and LinkedIn. Stop wasting budget.',
  },
  {
    icon: '💻',
    name: 'Web Development',
    category: 'Web Dev',
    priceRange: '$3,500 - $12,000',
    description: 'Get a blazing-fast, conversion-optimized website built on Next.js and React. Sites that rank and convert.',
  },
  {
    icon: '🔗',
    name: 'Link Building',
    category: 'Link Building',
    priceRange: '$1,200 - $3,500/mo',
    description: 'Earn high-authority backlinks that boost your domain strength and push you to the top of Google\'s search results.',
  },
  {
    icon: '📱',
    name: 'Social Media Marketing',
    category: 'Social',
    priceRange: '$1,500 - $4,000/mo',
    description: 'Build a loyal community and drive real business results through strategic social media marketing.',
  }
];

export default function ServicesSection() {
  const [allServices, setAllServices] = useState<SiteService[]>([]);

  useEffect(() => {
    const custom = getServices();
    const list = [...custom];
    defaultServices.forEach(def => {
      if (!list.some(c => c.name.toLowerCase() === def.name.toLowerCase())) {
        list.push({
          id: def.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: def.name,
          category: def.category,
          status: 'Active',
          priceRange: def.priceRange,
          description: def.description
        });
      }
    });
    setAllServices(list);
  }, []);

  return (
    <section className="section-padding mesh-bg" id="services">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge mb-4">Our Services</span>
          <h2 className="text-4xl md:text-5xl font-black mb-5">
            Everything You Need to{' '}
            <span className="gradient-text">Dominate Online</span>
          </h2>
          <p className="text-[hsl(215,20%,60%)] text-lg max-w-2xl mx-auto">
            We don't offer cookie-cutter solutions. Every strategy is custom-built to your business goals, market, and competition.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allServices.map((service) => (
            <div
              key={service.id}
              className="glass-card p-7 group block flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)] flex items-center justify-center text-xl shadow-lg shadow-[hsl(217,91%,54%)]/20">
                    🚀
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[hsl(217,91%,54%)]/15 text-[hsl(217,91%,70%)] text-xs font-bold font-mono">
                    {service.priceRange}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[hsl(217,91%,75%)] transition-colors">
                  {service.name}
                </h3>
                <p className="text-[hsl(215,20%,60%)] text-sm mb-5 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[hsl(215,25%,22%)]/40 flex items-center justify-between">
                <span className="text-xs font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider">{service.category}</span>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-xs font-bold text-[hsl(217,91%,65%)] hover:gap-3 transition-all"
                >
                  Get Audit →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/services" className="btn-outline">
            <span>View All Services</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
