import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

interface CaseStudyMetric {
  label: string;
  before: string;
  after: string;
}

interface CaseStudy {
  company: string;
  industry: string;
  results: string;
  icon: string;
  color: string;
  challenge: string;
  solution: string;
  metrics: CaseStudyMetric[];
}

const caseStudiesData: Record<string, CaseStudy> = {
  'stylevault-fashion-seo': {
    company: 'StyleVault Fashion',
    industry: 'E-Commerce',
    results: '+342% Organic Traffic',
    icon: '🛍️',
    color: 'hsl(270, 80%, 60%)',
    challenge: 'StyleVault was struggling with stagnant organic traffic and a high reliance on expensive paid ads. Their technical SEO was poor, and they lacked a cohesive content strategy.',
    solution: 'We performed a deep technical audit, fixed site architecture issues, and implemented an AI-driven content strategy focusing on high-intent fashion keywords. We also built a premium backlink profile through digital PR.',
    metrics: [
      { label: 'Monthly Traffic', before: '12,500', after: '53,200' },
      { label: 'Monthly Revenue', before: '$48,000', after: '$138,500' },
      { label: 'Keyword Rankings', before: '245', after: '1,840' },
    ]
  },
  'dataflow-pro-ppc': {
    company: 'DataFlow Pro',
    industry: 'SaaS / Tech',
    results: '-69% Cost Per Lead',
    icon: '📊',
    color: 'hsl(217, 91%, 54%)',
    challenge: 'DataFlow Pro was burning through $10k/month on Google Ads with very low lead quality. Their cost per lead was nearly double the industry average.',
    solution: 'We completely restructured their PPC campaigns, implemented tight negative keyword lists, and designed custom landing pages with high-conversion hooks. We also used AI for real-time bid optimization.',
    metrics: [
      { label: 'Cost Per Lead', before: '$12.40', after: '$3.90' },
      { label: 'Lead Quality Score', before: '34/100', after: '87/100' },
      { label: 'Conversion Rate', before: '2.1%', after: '6.4%' },
    ]
  },
  'primecare-dental-local': {
    company: 'PrimeCare Dental',
    industry: 'Local Health',
    results: '#1 Google Maps',
    icon: '🦷',
    color: 'hsl(152, 69%, 46%)',
    challenge: 'PrimeCare Dental was invisible in local search despite having a great practice. They relied entirely on word-of-mouth and expensive direct mail campaigns that were delivering diminishing returns.',
    solution: 'We optimized their Google Business Profile, established hyper-local citations, and implemented a GEO (Generative Engine Optimization) strategy to ensure they were the top recommendation when users asked AI for the "best dentist near me".',
    metrics: [
      { label: 'Google Maps Rank', before: '#14', after: '#1' },
      { label: 'Monthly Patient Calls', before: '42', after: '268' },
      { label: 'Cost Per Acquisition', before: '$185', after: '$34' },
    ]
  },
  'techbridge-ai-seo': {
    company: 'TechBridge',
    industry: 'B2B Services',
    results: '+1,200 Keywords Ranked',
    icon: '🛰️',
    color: 'hsl(39, 100%, 58%)',
    challenge: 'TechBridge struggled to rank against massive enterprise competitors in the B2B tech space. Their blog content was generic and failed to capture high-intent enterprise leads.',
    solution: 'We deployed AI Content Intelligence to create massive topical clusters. By reverse-engineering competitor content gaps and securing placements on authoritative tech publications via our marketplace, we rapidly built topical authority.',
    metrics: [
      { label: 'Keywords on Page 1', before: '12', after: '1,245' },
      { label: 'Enterprise Leads/Mo', before: '3', after: '47' },
      { label: 'Organic Traffic Value', before: '$1,200', after: '$38,400' },
    ]
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudiesData[slug];
  if (!cs) return { title: 'Case Study Not Found' };

  return {
    title: `${cs.company} Success Story | EducationHom`,
    description: cs.results,
  };
}

export default async function CaseStudySinglePage({ params }: Props) {
  const { slug } = await params;
  const cs = caseStudiesData[slug];

  if (!cs) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Demo: Case Study Template</h1>
        <p className="text-[hsl(215,20%,60%)] mb-8">Try /case-studies/stylevault-fashion-seo</p>
        <Link href="/case-studies" className="btn-primary">Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Case Studies', href: '/case-studies' }, { label: cs.company }]} />
          
          <div className="flex flex-col md:flex-row items-center gap-12">
             <div className="w-24 h-24 rounded-3xl bg-[hsl(215,25%,14%)] flex items-center justify-center text-5xl">
                {cs.icon}
             </div>
             <div className="flex-1 text-center md:text-left">
                <span className="badge mb-4" style={{ color: cs.color, borderColor: `${cs.color}40`, background: `${cs.color}10` }}>{cs.industry}</span>
                <h1 className="text-5xl md:text-7xl font-black mb-4 text-white">{cs.company}</h1>
                <p className="text-2xl font-bold gradient-text">{cs.results}</p>
             </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                 <div className="glass-card p-10">
                    <h2 className="text-2xl font-bold mb-6 text-white">The Challenge</h2>
                    <p className="text-[hsl(215,20%,65%)] leading-relaxed text-lg">{cs.challenge}</p>
                 </div>
                 <div className="glass-card p-10 border-[hsl(217,91%,54%)]/20">
                    <h2 className="text-2xl font-bold mb-6 text-white">The EducationHom Solution</h2>
                    <p className="text-[hsl(215,20%,65%)] leading-relaxed text-lg">{cs.solution}</p>
                 </div>
              </div>
              
              <div className="lg:col-span-1">
                 <div className="glass-card p-8 sticky top-24">
                    <h3 className="text-xl font-bold mb-8 text-white">Key Performance Indicators</h3>
                    <div className="space-y-8">
                       {cs.metrics.map((m: CaseStudyMetric) => (
                         <div key={m.label}>
                            <div className="text-xs text-[hsl(215,20%,50%)] uppercase tracking-widest font-bold mb-2">{m.label}</div>
                            <div className="flex items-center gap-4">
                               <span className="text-[hsl(215,20%,40%)] line-through">{m.before}</span>
                               <span className="text-white font-black text-2xl">→ {m.after}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="mt-12 pt-8 border-t border-[hsl(215,25%,22%)]">
                       <Link href="/contact" className="btn-primary w-full justify-center">Get Results Like These</Link>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
