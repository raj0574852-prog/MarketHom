import type { Metadata } from 'next';
import Link from 'next/link';
import CTASection from '@/components/home/CTASection';
import { ShoppingBag, BarChart3, Activity, Cpu, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Client Case Studies & Verified Results | MarketHom Agency',
  description: 'Explore verified commercial results across SaaS, E-Commerce, and enterprise brands. See how our strategic SEO, link building, and paid media drive revenue growth.',
};

const caseStudies = [
  {
    slug: 'stylevault-fashion-seo',
    company: 'StyleVault Luxury',
    industry: 'E-Commerce / Direct-to-Consumer',
    results: '+342% Organic Revenue',
    metrics: [
      { label: 'Monthly GMV', value: '$48k ➔ $138k' },
      { label: 'Page 1 Keywords', value: '412 Active' },
      { label: 'Timeframe', value: '8 Months' }
    ],
    desc: 'Executed category architecture restructuring, high-velocity digital PR backlink acquisition, and programmatic collection page optimization.',
    icon: <ShoppingBag className="w-6 h-6 text-purple-400" />,
    badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
  },
  {
    slug: 'dataflow-pro-ppc',
    company: 'DataFlow Systems',
    industry: 'Enterprise B2B SaaS',
    results: '-69% Acquisition Cost',
    metrics: [
      { label: 'Demo Bookings', value: '3.4x Increase' },
      { label: 'Cost Per Lead', value: '$284 ➔ $88' },
      { label: 'Timeframe', value: '90 Days' }
    ],
    desc: 'Re-engineered high-intent Google Search campaigns and instituted Conversion API server-side tracking paired with high-converting interactive demo funnels.',
    icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30'
  },
  {
    slug: 'primecare-dental-local',
    company: 'PrimeCare Clinical Network',
    industry: 'Healthcare / Multi-Location',
    results: '#1 Google Map Pack',
    metrics: [
      { label: 'Inbound Patient Calls', value: '+539%' },
      { label: 'High-Ticket Treatments', value: '42 / month' },
      { label: 'Timeframe', value: '5 Months' }
    ],
    desc: 'Local authority dominance via regional citation rebuilding, hyper-local editorial link acquisition, and multi-location medical schema markup.',
    icon: <Activity className="w-6 h-6 text-emerald-400" />,
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
  },
  {
    slug: 'techbridge-ai-seo',
    company: 'TechBridge Cloud',
    industry: 'Cloud Infrastructure & DevOps',
    results: '+1,450 Ranked Keyword Clusters',
    metrics: [
      { label: 'AI Citations (Perplexity)', value: '89 Citations' },
      { label: 'Organic Inbound Leads', value: '+215%' },
      { label: 'Timeframe', value: '6 Months' }
    ],
    desc: 'Constructed an automated technical content cluster strategy, building deep entity authority recognized by both traditional and LLM-powered search engines.',
    icon: <Cpu className="w-6 h-6 text-cyan-400" />,
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
  }
];

export default function CaseStudiesPage() {
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
            <span>Documented Commercial Transformations</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            Proven Campaigns.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Measurable ROI.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
            We don’t celebrate vanity impressions. Here are the verifiable traffic, revenue, and customer acquisition metrics we engineer for our clients.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="pb-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((cs) => (
              <div 
                key={cs.slug}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(56,189,248,0.2)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/30 transition-colors">
                      {cs.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cs.badgeColor}`}>
                      {cs.industry}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {cs.company}
                  </h3>

                  <div className="inline-flex items-center gap-2 mb-4 text-emerald-400 font-extrabold text-lg">
                    <TrendingUp className="w-5 h-5" />
                    <span>{cs.results}</span>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                    {cs.desc}
                  </p>

                  {/* Metrics 3-box Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                    {cs.metrics.map((m, idx) => (
                      <div key={idx} className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">{m.label}</span>
                        <span className="text-xs sm:text-sm font-black text-white">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Full Implementation Breakdown</span>
                  <Link 
                    href={`/case-studies/${cs.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
