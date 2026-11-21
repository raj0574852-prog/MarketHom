import type { Metadata } from 'next';
import Link from 'next/link';
import CTASection from '@/components/home/CTASection';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { Check, Sparkles, HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Investment Packages & Pricing | MarketHom Agency',
  description: 'Transparent, results-driven pricing for organic search dominance, editorial links, and custom digital marketing solutions.',
};

const tiers = [
  {
    name: 'Starter Foundation',
    price: '$997',
    period: '/month',
    description: 'Essential technical SEO and initial link equity for early-stage brands and local challengers.',
    cta: 'Select Starter Plan',
    popular: false,
    features: [
      { name: 'Target Keywords Managed', value: '10 Strategic Clusters' },
      { name: 'On-Page Optimization', value: 'Up to 15 Core Pages' },
      { name: 'Technical SEO Audit', value: 'Monthly Continuous' },
      { name: 'Editorial Backlinks', value: '2 Tier-1 Links / mo' },
      { name: 'Executive Reporting', value: 'Bi-Weekly Dashboards' },
      { name: 'Dedicated Communication', value: 'Slack & Email' },
    ],
    included: [
      'Comprehensive Core Web Vitals Audit',
      'Google Search Console Optimization',
      'Structured Schema Markup Injection',
      'Competitor Keyword Gap Analysis',
    ]
  },
  {
    name: 'Growth Engine',
    price: '$2,497',
    period: '/month',
    description: 'Our flagship full-stack growth program for businesses ready to capture competitive industry terms.',
    cta: 'Claim Growth Engine',
    popular: true,
    features: [
      { name: 'Target Keywords Managed', value: '35 High-Intent Clusters' },
      { name: 'On-Page Optimization', value: 'Full Domain Architecture' },
      { name: 'Technical SEO Audit', value: 'Continuous Real-Time' },
      { name: 'Editorial Backlinks', value: '6 Tier-1 Publications / mo' },
      { name: 'AI Search Optimization', value: 'ChatGPT / Perplexity GEO' },
      { name: 'Executive Reporting', value: 'Weekly Strategy Calls' },
      { name: 'Dedicated Communication', value: 'Direct Private Slack Channel' },
    ],
    included: [
      'Everything in Starter Foundation',
      'High-Impact Digital PR Link Acquisition',
      'Generative Engine Optimization (GEO)',
      'Conversion Rate Optimization (CRO)',
      'Quarterly In-Depth Market Audits',
    ]
  },
  {
    name: 'Market Dominance',
    price: '$4,997',
    period: '/month',
    description: 'Bespoke enterprise marketing infrastructure for category leaders demanding total SERP authority.',
    cta: 'Schedule Executive Brief',
    popular: false,
    features: [
      { name: 'Target Keywords Managed', value: 'Unlimited Enterprise Scope' },
      { name: 'On-Page Optimization', value: 'Multi-Region & Global i18n' },
      { name: 'Technical SEO Audit', value: 'Real-Time Automated Monitor' },
      { name: 'Editorial Backlinks', value: '14+ Premium Placements / mo' },
      { name: 'AI Search Optimization', value: 'Full Entity Knowledge Graph' },
      { name: 'Executive Reporting', value: 'Executive Boardroom Deliverables' },
      { name: 'Dedicated Communication', value: '24/7 Priority Partner Desk' },
    ],
    included: [
      'Everything in Growth Engine',
      'Guaranteed DA 60-90+ Placements',
      'Dedicated Senior SEO Director',
      'Custom React/Next.js Landing Pages',
      'SLA Indexation & Revenue Commitments',
    ]
  }
];

const faqs = [
  {
    q: "Are there long-term contractual lock-ins?",
    a: "No. All agency retainers operate on a rolling month-to-month agreement. You may upgrade, pause, or terminate with a standard 30-day notice."
  },
  {
    q: "How soon do commercial ranking improvements register?",
    a: "While organic search compounds over time, clients typically register initial momentum and keyword velocity within 45 to 60 days following technical remediation and initial Tier-1 links."
  },
  {
    q: "What guarantee do you provide on editorial links?",
    a: "Every link placement secured through MarketHom is guaranteed permanent DoFollow with 100% Google indexation SLA. If a publisher drops an article, we replace it free of charge."
  },
  {
    q: "Can we build a custom hybrid tier?",
    a: "Yes. Many enterprise teams require tailored mixes of publisher syndication, content engineering, and web development. Contact our strategy team for a customized blueprint."
  }
];

export default function PricingPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Hero Header */}
      <section className="pt-36 pb-16 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Investment Plans</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            Invest in Measurable{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Commercial Growth.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
            Fixed monthly pricing, no hidden retainers, and zero long-term commitments. Every dollar aligned directly with pipeline value.
          </p>
        </div>
      </section>

      {/* Tiers Grid */}
      <section className="pb-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier) => (
              <div 
                key={tier.name}
                className={`relative bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 sm:p-9 border flex flex-col justify-between transition-all duration-300 ${
                  tier.popular 
                    ? 'border-cyan-400/50 shadow-[0_0_40px_rgba(56,189,248,0.25)] lg:-translate-y-3 z-10' 
                    : 'border-white/10 hover:border-white/20 shadow-2xl'
                }`}
              >
                {tier.popular && (
                  <BorderBeam size={250} duration={10} delay={0} colorFrom="#38bdf8" colorTo="#6366f1" />
                )}

                <div>
                  {tier.popular && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Most Selected Tier
                      </span>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <p className="text-sm text-slate-400 mb-6 font-light leading-relaxed">{tier.description}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-5xl font-black text-white tracking-tight">{tier.price}</span>
                      <span className="text-slate-400 font-medium text-sm">{tier.period}</span>
                    </div>
                  </div>

                  {/* Core Features */}
                  <div className="space-y-3 mb-8 pt-6 border-t border-white/10">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Deliverables</span>
                    {tier.features.map((feat) => (
                      <div key={feat.name} className="flex items-center justify-between py-1.5 text-xs sm:text-sm">
                        <span className="text-slate-300">{feat.name}</span>
                        <span className="font-bold text-white">{feat.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Included Items */}
                  <div className="mb-8 pt-6 border-t border-white/10">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Included Capabilities</span>
                    <ul className="space-y-2.5">
                      {tier.included.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link 
                  href="/contact" 
                  className={`w-full py-4 rounded-2xl font-bold text-center text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(56,189,248,0.4)]' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Pricing FAQ Section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Pricing FAQ</h2>
              <p className="text-slate-400 text-sm">Frequently asked questions regarding onboarding, deliverables, and service scope.</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 divide-y divide-white/5 overflow-hidden shadow-2xl">
              {faqs.map((faq, i) => (
                <details key={i} className="group p-6 select-none cursor-pointer">
                  <summary className="flex items-center justify-between text-base font-semibold text-white group-open:text-cyan-400 transition-colors">
                    <span>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:text-cyan-400 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <p className="mt-4 text-sm text-slate-300 font-light leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
