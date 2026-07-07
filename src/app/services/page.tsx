import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Our Services | Full-Stack Digital Growth Solutions',
  description: 'Explore our range of digital marketing services including SEO, AI SEO, PPC, Link Building, and Web Development. Tailored strategies for every stage of growth.',
};

const services = [
  {
    title: 'Search Engine Optimization',
    slug: 'seo',
    icon: '🔍',
    desc: 'Dominate organic search results with data-driven strategies that build long-term authority and drive qualified traffic.',
    features: ['Technical Audits', 'Keyword Research', 'On-Page SEO', 'Local SEO']
  },
  {
    title: 'AI-Powered SEO',
    slug: 'ai-seo',
    icon: '🤖',
    desc: 'Harness the power of artificial intelligence to scale content production and gain a competitive edge in modern search.',
    features: ['AI Content Strategy', 'Topical Authority', 'Entity Optimization', 'SERP Analysis']
  },
  {
    title: 'PPC Advertising',
    slug: 'ppc',
    icon: '💰',
    desc: 'Laser-targeted paid campaigns across Google, Meta, and LinkedIn designed to maximize ROI and lower acquisition costs.',
    features: ['Google Ads', 'Meta Ads', 'Remarketing', 'Landing Page CRO']
  },
  {
    title: 'Web Development',
    slug: 'web-development',
    icon: '💻',
    desc: 'Fast, secure, and conversion-optimized websites built on Next.js and React. Sites that look great and rank even better.',
    features: ['Next.js / React', 'Core Web Vitals', 'CMS Integration', 'Mobile-First Design']
  },
  {
    title: 'Link Building',
    slug: 'link-building',
    icon: '🔗',
    desc: 'Build a powerful backlink profile with white-hat outreach and digital PR. High-authority links that move the needle.',
    features: ['Digital PR', 'Guest Posting', 'Niche Outreach', 'HARO Services']
  },
  {
    title: 'Social Media Marketing',
    slug: 'smm',
    icon: '📱',
    desc: 'Strategic social media management that builds community, increases brand awareness, and drives meaningful engagement.',
    features: ['Content Creation', 'Community Management', 'Paid Social', 'Brand Strategy']
  }
];

export default function ServicesPage() {
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
            {services.map((s) => (
              <div key={s.slug} className="glass-card p-8 group hover:border-[hsl(217,91%,54%)]/40 transition-all flex flex-col">
                <div className="text-4xl mb-6">{s.icon}</div>
                <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-[hsl(217,91%,75%)] transition-colors">{s.title}</h2>
                <p className="text-[hsl(215,20%,60%)] text-sm leading-relaxed mb-6 flex-1">{s.desc}</p>
                
                <ul className="space-y-2 mb-8">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[hsl(215,20%,50%)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[hsl(217,91%,54%)]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={`/services/${s.slug}`} className="btn-outline w-full justify-center text-xs">
                  Learn More About {s.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
