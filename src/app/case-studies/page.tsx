import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Case Studies | Real Results for Real Businesses | MarketHom Agency',
  description: 'Explore our portfolio of success stories. See how we helped e-commerce brands, SaaS companies, and local businesses scale with SEO, PPC, and AI.',
};

const caseStudies = [
  {
    slug: 'stylevault-fashion-seo',
    company: 'StyleVault Fashion',
    industry: 'E-Commerce',
    results: '+342% Organic Traffic',
    desc: 'How we helped a struggling fashion brand increase monthly revenue from $48K to $138K in just 8 months.',
    icon: '🛍️',
    color: 'hsl(270, 80%, 60%)'
  },
  {
    slug: 'dataflow-pro-ppc',
    company: 'DataFlow Pro',
    industry: 'SaaS / Tech',
    results: '-69% Cost Per Lead',
    desc: 'Optimizing a complex B2B PPC campaign to tripple lead quality while slashing acquisition costs.',
    icon: '📊',
    color: 'hsl(217, 91%, 54%)'
  },
  {
    slug: 'primecare-dental-local',
    company: 'PrimeCare Dental',
    industry: 'Local Health',
    results: '#1 Google Maps',
    desc: 'Dominating local search results and driving a 539% increase in monthly patient phone calls.',
    icon: '🦷',
    color: 'hsl(152, 69%, 46%)'
  },
  {
    slug: 'techbridge-ai-seo',
    company: 'TechBridge',
    industry: 'B2B Services',
    results: '+1,200 Keywords Ranked',
    desc: 'Leveraging AI-powered content clustering to establish topical authority in a highly competitive niche.',
    icon: '🛰️',
    color: 'hsl(39, 100%, 58%)'
  }
];

export default function CaseStudiesPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Case Studies' }]} />
          <div className="max-w-3xl">
            <span className="badge mb-4">Our Portfolio</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Proven <span className="gradient-text">Success.</span>
            </h1>
            <p className="text-[hsl(215,20%,65%)] text-xl leading-relaxed">
              We don't just promise growth; we deliver it. Explore our collection of case studies to see the measurable impact we've had on businesses worldwide.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((cs) => (
              <div key={cs.slug} className="glass-card group overflow-hidden flex flex-col md:flex-row">
                 <div className="md:w-1/3 bg-[hsl(215,25%,14%)] flex items-center justify-center text-6xl py-12 md:py-0">
                    {cs.icon}
                 </div>
                 <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(215,20%,40%)]">{cs.industry}</span>
                       <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${cs.color}15`, color: cs.color, border: `1px solid ${cs.color}30` }}>
                          {cs.results}
                       </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-[hsl(217,91%,75%)] transition-colors">{cs.company}</h2>
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed mb-8 flex-1">{cs.desc}</p>
                    
                    <Link href={`/case-studies/${cs.slug}`} className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">
                       Read Case Study <span>→</span>
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
