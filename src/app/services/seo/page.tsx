import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Premium SEO Services | Rank #1 on Google | MarketHom Agency',
  description: 'Drive qualified traffic and dominate search results with our expert SEO services. Technical audits, keyword research, and white-hat link building.',
  keywords: ['SEO services', 'Search Engine Optimization', 'organic growth', 'technical SEO', 'keyword research', 'local SEO'],
};

const seoFeatures = [
  {
    title: 'Technical SEO Audits',
    desc: 'We go deep into your site\'s architecture to fix crawl errors, improve site speed, and ensure Google can index your pages perfectly.',
    icon: '⚙️'
  },
  {
    title: 'Precision Keyword Research',
    desc: 'We don\'t just look for high volume. We find high-intent keywords that actually lead to conversions and revenue.',
    icon: '🎯'
  },
  {
    title: 'On-Page Optimization',
    desc: 'Content is king, but structure is queen. We optimize your titles, headings, and copy for both users and algorithms.',
    icon: '📝'
  },
  {
    title: 'High-Authority Link Building',
    desc: 'Earn high-quality, white-hat backlinks that build domain authority and push your rankings to the first page.',
    icon: '🔗'
  },
  {
    title: 'Local SEO Domination',
    desc: 'Own your city. We optimize your Google Business Profile and local citations to capture "near me" searches.',
    icon: '📍'
  },
  {
    title: 'Data-Driven Content Strategy',
    desc: 'We create content that answers user intent, builds topical authority, and ranks for hundreds of long-tail keywords.',
    icon: '📊'
  }
];

const seoFaqs = [
  {
    q: "How long does it take to see SEO results?",
    a: "SEO is a long-term investment. While some technical improvements can have immediate effects, most clients see significant ranking growth within 3 to 6 months."
  },
  {
    q: "Do you guarantee #1 rankings?",
    a: "No ethical SEO agency can guarantee #1 rankings because we don't own Google. However, we have a 100% success rate in improving our clients' organic visibility and traffic."
  },
  {
    q: "What is the difference between On-Page and Off-Page SEO?",
    a: "On-Page SEO involves optimizing elements on your website (content, HTML, speed). Off-Page SEO focuses on external signals like backlinks and social mentions that build your site's authority."
  },
  {
    q: "Is SEO better than PPC?",
    a: "PPC is great for immediate traffic, but SEO builds an asset that grows in value over time. For sustainable growth, we usually recommend a combined approach."
  }
];

export default function SeoServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            'name': 'Search Engine Optimization (SEO) Services',
            'description': 'Comprehensive SEO strategies to improve search engine rankings, drive traffic, and increase revenue.',
            'provider': {
              '@type': 'Organization',
              'name': 'MarketHom Agency'
            },
            'areaServed': 'Worldwide',
            'hasOfferCatalog': {
              '@type': 'OfferCatalog',
              'name': 'SEO Services',
              'itemListElement': [
                {
                  '@type': 'Offer',
                  'itemOffered': {
                    '@type': 'Service',
                    'name': 'Technical SEO Audit'
                  }
                },
                {
                  '@type': 'Offer',
                  'itemOffered': {
                    '@type': 'Service',
                    'name': 'Link Building'
                  }
                }
              ]
            }
          }),
        }}
      />
      
      <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-b from-[hsl(222,47%,7%)] to-[hsl(222,47%,5%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'SEO Services' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4">Core Service</span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Dominate the <span className="gradient-text">Search Results.</span>
              </h1>
              <p className="text-[hsl(215,20%,65%)] text-xl mb-8 leading-relaxed">
                Ranking on Google isn't about gaming the system—it's about becoming the most relevant, authoritative answer to your customers' questions. Our SEO experts build high-performance growth engines that scale with your business.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">Get Your Free Audit</Link>
                <Link href="/pricing" className="btn-outline">View SEO Packages</Link>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card p-4 aspect-video flex flex-col justify-center items-center text-center">
                 <div className="text-6xl mb-4 animate-float">🚀</div>
                 <div className="stat-number text-5xl mb-2">94%</div>
                 <p className="text-[hsl(215,20%,50%)]">Average Increase in Organic Traffic for Our Clients</p>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[hsl(217,91%,54%)]/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[hsl(270,80%,60%)]/20 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Our <span className="gradient-text">SEO Strategy</span></h2>
            <p className="text-[hsl(215,20%,60%)] max-w-2xl mx-auto">We use a data-driven, holistic approach to SEO that covers every signal Google looks for.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seoFeatures.map((feature, i) => (
              <div key={i} className="glass-card p-8 group hover:border-[hsl(217,91%,54%)]/40 transition-all">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[hsl(217,91%,75%)] transition-colors">{feature.title}</h3>
                <p className="text-[hsl(215,20%,60%)] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="glass-card p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <svg className="w-64 h-64" viewBox="0 0 200 200" fill="currentColor">
                <path d="M100 0L122.5 77.5H200L137.5 122.5L160 200L100 155L40 200L62.5 122.5L0 77.5H77.5L100 0Z" />
              </svg>
            </div>
            
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black mb-6">Why SEO is Non-Negotiable in 2025</h2>
              <div className="prose-dark space-y-4">
                <p>Over 70% of clicks go to the first three organic results on Google. If you're not there, you're invisible. But SEO has changed. It's no longer just about keywords and backlinks—it's about <strong>User Experience</strong>, <strong>Core Web Vitals</strong>, and <strong>Topical Authority</strong>.</p>
                <p>At MarketHom Agency, we stay at the cutting edge of algorithm updates. We don't just react to Google's changes; we anticipate them. Our white-hat strategies are designed to build long-term value that keeps you at the top for years, not just weeks.</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-4">
                  <li>Increase Domain Authority</li>
                  <li>Lower Customer Acquisition Cost</li>
                  <li>Build Brand Trust</li>
                  <li>Drive Targeted High-Intent Leads</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">SEO <span className="gradient-text">FAQs</span></h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {seoFaqs.map((faq, i) => (
              <div key={i} className="faq-item p-6 bg-[hsl(215,25%,12%)]">
                <h3 className="font-bold text-lg mb-2 text-white">{faq.q}</h3>
                <p className="text-[hsl(215,20%,60%)] text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
