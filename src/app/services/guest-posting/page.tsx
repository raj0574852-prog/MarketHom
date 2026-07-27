import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Premium Guest Posting & AI Content Intelligence Services | MarketHom Agency',
  description: 'High-authority guest posts published on DA 40-90+ real websites. Every article is written using AI Content Intelligence—optimized for Google SEO, AEO, GEO, and LLM Chatbots.',
  keywords: [
    'guest posting',
    'AEO guest blogging',
    'GEO link building',
    'AI Content Intelligence',
    'niche outreach',
    'authority backlinks',
    'semantic anchor links'
  ],
};

const FEATURES = [
  {
    icon: '📊',
    title: 'DA 40-90+ Real Organic Traffic',
    desc: 'Zero PBNs or link farms. We secure guest placements exclusively on real, active websites with at least 5,000+ monthly Google organic visitors.'
  },
  {
    icon: '🧠',
    title: 'AI Content Intelligence & Semantic EEAT',
    desc: 'Articles are engineered with entity-rich semantic graphs so search engines (Google) and AI models (Perplexity, ChatGPT) recognize your brand authority.'
  },
  {
    icon: '🤖',
    title: 'AEO & GEO Citation Injection',
    desc: 'We format anchor text and surrounding context to trigger direct LLM citations, training AI chatbots to recommend your domain.'
  },
  {
    icon: '🛡️',
    title: 'Safe from Google Algorithm Updates',
    desc: 'Natural, contextual placements with permanent dofollow links that withstand all core Google spam and link quality updates.'
  }
];

const CONTENT_INTELLIGENCE_HIGHLIGHTS = [
  {
    pillar: 'Google SEO & Entity Authority',
    detail: 'Targeted LSI entities and natural anchor placements that build lasting domain authority.'
  },
  {
    pillar: 'AEO (Answer Engine Optimization)',
    detail: 'Formatted with direct answer blocks so Perplexity & AI Overviews summarize your linked article.'
  },
  {
    pillar: 'GEO (Generative Engine Optimization)',
    detail: 'Embedded with real industry stats so ChatGPT & Claude cite your website as primary source truth.'
  },
  {
    pillar: '100% Expert Human Tone',
    detail: 'Written by industry specialists—bypassing robotic AI cliches and passing human EEAT reviews.'
  }
];

const PROCESS_STEPS = [
  { step: '01', title: 'Publisher & Traffic Vetting', desc: 'We screen 10,000+ niche-relevant domains for organic traffic, DA/DR, and zero spam footprints.' },
  { step: '02', title: 'Content Intelligence Blueprint', desc: 'Our platform generates a semantic topic outline optimized for Google SEO, AEO, and GEO.' },
  { step: '03', title: 'Expert Content Writing', desc: 'Articles are written with expert authority, real data points, and natural contextual anchors.' },
  { step: '04', title: 'Publisher Pitch & Live Placement', desc: 'We negotiate directly with editors to publish your article permanently with dofollow links.' }
];

export default function GuestPostingPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="pt-36 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,54%)]/10 via-transparent to-[hsl(270,80%,60%)]/10" />
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'Guest Posting' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="badge mb-4">Quality Outreach & Content Intelligence</span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-white">
                Guest Posts on <span className="gradient-text">Top-Tier Sites.</span>
              </h1>
              <p className="text-[hsl(215,20%,65%)] text-lg md:text-xl mb-8 leading-relaxed">
                No PBNs. No spam. Just high-quality guest posts on real websites with real traffic. Every article is written using <strong className="text-white">AI Content Intelligence</strong>—optimized for Google SEO, AEO, GEO, and LLM Chatbots while reading like an industry expert.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary py-4 px-8 text-base font-bold shadow-xl shadow-[hsl(217,91%,54%)]/25">
                  Get Publisher Inventory List →
                </Link>
                <Link href="#intelligence" className="btn-outline py-4 px-6 text-sm font-semibold">
                  Content Intelligence Engine ↓
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-5">
               <div className="glass-card p-8 border border-[hsl(217,91%,54%)]/30 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[hsl(215,25%,22%)]">
                    <h3 className="font-black text-lg text-white">Publisher Quality Standards</h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">Strict Vetting</span>
                  </div>

                  <ul className="space-y-3.5">
                     {[
                       'DA 40–90+ & DR 50+ Guaranteed',
                       'Minimum 5,000+ Monthly Organic Traffic',
                       'Strict Niche-Relevant Context',
                       'No "Write for Us" or PBN Footprints',
                       'Permanent Dofollow In-Content Links',
                       'AI Content Intelligence (SEO + AEO + GEO)',
                       'Safe for All Google Core Updates'
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-3 text-xs text-[hsl(215,20%,70%)] font-medium">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
                            ✓
                          </div>
                          {item}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI CONTENT INTELLIGENCE SECTION */}
      <section className="section-padding bg-[hsl(222,47%,5%)] border-y border-[hsl(215,25%,22%)]/40" id="intelligence">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge mb-4">AI Content Intelligence</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Written for <span className="gradient-text">Google, AEO, GEO & Real Humans</span>
            </h2>
            <p className="text-[hsl(215,20%,60%)] text-base md:text-lg">
              Generic AI guest posts get rejected by publishers and ignored by Google. Our platform creates content optimized across all modern discovery engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTENT_INTELLIGENCE_HIGHLIGHTS.map((h, i) => (
              <div key={i} className="glass-card p-6 border border-[hsl(217,91%,54%)]/20 hover:border-[hsl(217,91%,54%)]/50 transition-all">
                <div className="text-xs font-bold font-mono text-[hsl(217,91%,70%)] uppercase tracking-wider mb-2">Pillar 0{i + 1}</div>
                <h3 className="text-lg font-bold text-white mb-3">{h.pillar}</h3>
                <p className="text-xs text-[hsl(215,20%,60%)] leading-relaxed">{h.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="section-padding bg-[hsl(222,47%,7%)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card p-8 border hover:border-[hsl(217,91%,54%)]/40 transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-[hsl(215,20%,65%)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge mb-4">Outreach & Creation</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Our 4-Step <span className="gradient-text">Guest Posting Process</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((s) => (
              <div key={s.step} className="glass-card p-6 border border-[hsl(215,25%,20%)]">
                <div className="text-3xl font-black gradient-text mb-4">{s.step}</div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-[hsl(215,20%,60%)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
