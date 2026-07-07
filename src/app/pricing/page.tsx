import type { Metadata } from 'next';
import Link from 'next/link';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Pricing Plans | Scalable Marketing Packages',
  description: 'Choose the perfect digital marketing package for your business. Transparent pricing for SEO, PPC, and full-service growth engines.',
};

const tiers = [
  {
    name: 'Starter',
    price: '$997',
    period: '/month',
    description: 'Essential SEO and marketing for small businesses and startups.',
    cta: 'Get Started',
    color: 'hsl(217, 91%, 54%)',
    features: [
      { name: 'Target Keywords', value: '5' },
      { name: 'On-Page Optimization', value: '10 Pages' },
      { name: 'Content Marketing', value: '2 Posts/mo' },
      { name: 'Technical SEO Audit', value: 'Quarterly' },
      { name: 'Backlink Building', value: '2 Links/mo' },
      { name: 'Reporting', value: 'Monthly' },
      { name: 'Support', value: 'Email' },
    ],
    included: [
      'Google Analytics Setup',
      'Google Search Console Setup',
      'Local Business Profile Opt.',
      'Basic Site Speed Audit',
    ]
  },
  {
    name: 'Growth',
    price: '$2,497',
    period: '/month',
    description: 'Our most popular plan for businesses ready to dominate their niche.',
    cta: 'Most Popular',
    color: 'hsl(270, 80%, 60%)',
    popular: true,
    features: [
      { name: 'Target Keywords', value: '25' },
      { name: 'On-Page Optimization', value: 'Unlimited' },
      { name: 'Content Marketing', value: '4 Posts/mo' },
      { name: 'Technical SEO Audit', value: 'Monthly' },
      { name: 'Backlink Building', value: '6 Links/mo' },
      { name: 'Reporting', value: 'Bi-Weekly' },
      { name: 'Support', value: 'Priority Slack' },
    ],
    included: [
      'Everything in Starter',
      'Competitor Analysis',
      'Conversion Rate Optimization',
      'Schema Markup Implementation',
      'PPC Campaign Management',
      'Lead Tracking Dashboard',
    ]
  },
  {
    name: 'Domination',
    price: '$4,997',
    period: '/month',
    description: 'Aggressive marketing for enterprises and high-growth brands.',
    cta: 'Scale Now',
    color: 'hsl(39, 100%, 58%)',
    features: [
      { name: 'Target Keywords', value: 'Unlimited' },
      { name: 'On-Page Optimization', value: 'Unlimited' },
      { name: 'Content Marketing', value: '8 Posts/mo' },
      { name: 'Technical SEO Audit', value: 'Continuous' },
      { name: 'Backlink Building', value: '15 Links/mo' },
      { name: 'Reporting', value: 'Weekly Strategy' },
      { name: 'Support', value: 'Dedicated Manager' },
    ],
    included: [
      'Everything in Growth',
      'AI-Powered SEO Strategy',
      'Custom Content Production',
      'Digital PR & HARO Outreach',
      'Quarterly Market Forecasting',
      'White-Label Dashboard',
    ]
  }
];

const faqs = [
  {
    q: "Are there any long-term contracts?",
    a: "No. All our plans are month-to-month. You can upgrade, downgrade, or cancel at any time with a 30-day notice."
  },
  {
    q: "Can I customize a package?",
    a: "Absolutely. We work with many enterprise clients who require custom strategies. Contact us for a tailored quote."
  },
  {
    q: "How soon will I see results?",
    a: "While SEO is a long-term game, most clients see measurable improvements in rankings and traffic within the first 60-90 days."
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "We guarantee the quality of our work and the completion of all deliverables. If we don't hit our agreed KPIs, we work for free until we do."
  }
];

export default function PricingPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,54%)]/5 via-transparent to-[hsl(270,80%,60%)]/5" />
        <div className="container-custom relative z-10 text-center">
          <span className="badge mb-4">Pricing Plans</span>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Invest in Your <span className="gradient-text">Growth.</span>
          </h1>
          <p className="text-[hsl(215,20%,65%)] text-xl max-w-3xl mx-auto">
            Transparent, results-driven pricing with no hidden fees or long-term contracts.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div 
                key={tier.name}
                className={`glass-card p-8 flex flex-col relative ${tier.popular ? 'border-[hsl(270,80%,60%)]/50 scale-105 z-10 shadow-2xl' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-[hsl(215,20%,55%)] mb-6">{tier.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{tier.price}</span>
                    <span className="text-[hsl(215,20%,50%)]">{tier.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feat) => (
                    <div key={feat.name} className="flex items-center justify-between py-2 border-b border-[hsl(215,25%,22%)]/40 text-sm">
                      <span className="text-[hsl(215,20%,70%)]">{feat.name}</span>
                      <span className="font-bold text-white">{feat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[hsl(215,20%,40%)] mb-4">What's Included</h4>
                  <ul className="space-y-3">
                    {tier.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-[hsl(215,20%,65%)]">
                        <svg className="w-5 h-5 text-[hsl(152,69%,46%)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  href="/contact" 
                  className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)] text-white hover:opacity-90 shadow-lg' 
                      : 'bg-white/5 border border-[hsl(215,25%,22%)] text-white hover:bg-white/10'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section could be added here for extra detail */}

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
            <p className="text-[hsl(215,20%,60%)]">Everything you need to know about our pricing and services.</p>
          </div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="font-bold text-lg mb-3 text-white">{faq.q}</h3>
                <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
