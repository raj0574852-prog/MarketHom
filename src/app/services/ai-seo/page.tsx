import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'AI Content Intelligence Platform | SEO, AEO, GEO & LLM Optimization | MarketHom',
  description: 'Engineer high-converting content optimized for Google SEO, Answer Engines (AEO), Generative Engines (GEO), and LLM Chatbots. Written with deep expert authority.',
  keywords: [
    'AI Content Intelligence',
    'AEO Engine',
    'GEO Optimization',
    'Generative Engine Optimization',
    'Answer Engine Optimization',
    'LLM Content Strategy',
    'Semantic Search Engine',
    'EEAT Content Platform'
  ],
};

const PILLARS = [
  {
    icon: '🎯',
    title: 'Google SEO & Semantic Search',
    subtitle: 'Entity Graphs & LSI Intent',
    description: 'We construct deep entity relationship graphs and LSI keyword clusters so Google algorithmically recognizes your brand as the #1 topical authority.',
    bullets: ['Entity-based LSI mapping', 'Schema.org JSON-LD integration', 'Search intent alignment', 'Core Web Vitals friendly HTML']
  },
  {
    icon: '🤖',
    title: 'AEO (Answer Engine Optimization)',
    subtitle: 'Perplexity & AI Overviews',
    description: 'Structure your content to win Google AI Overviews, Perplexity answers, and Bing Copilot direct summaries with conversational Q&A snippets.',
    bullets: ['Direct answer snippet formatting', 'Structured Q&A accordions', 'Concise zero-click summaries', 'Fact-checked citation blocks']
  },
  {
    icon: '⚡',
    title: 'GEO (Generative Engine Optimization)',
    subtitle: 'LLM Citation & Retrieval',
    description: 'Train Large Language Models (LLMs) to cite your domain as the primary source of truth when users ask ChatGPT, Claude, or Gemini for recommendations.',
    bullets: ['Brand citation scaffolding', 'Source authority references', 'Statistic & data embedding', 'Prompt-retrieval optimization']
  },
  {
    icon: '👤',
    title: 'Human Expert EEAT & Voice',
    subtitle: 'Zero Robotic AI Footprints',
    description: 'Every article undergoes deep expert tone calibration—injecting real case studies, industry nuances, and authentic perspectives that bypass AI detectors.',
    bullets: ['100% human-expert tone', 'No robotic AI cliches or filler', 'E-E-A-T trust signals', 'Subject-matter specialist review']
  }
];

const COMPARISON_MATRIX = [
  { feature: 'Search Engine Optimization', traditional: 'Basic Keywords', platform: 'Deep Entity Graph & Semantic Search' },
  { feature: 'AI Overviews & AEO', traditional: '❌ Ignored', platform: '✅ Optimized for Perplexity & AI Overviews' },
  { feature: 'LLM Citation (GEO)', traditional: '❌ Not Supported', platform: '✅ Formatted for ChatGPT & Claude Citations' },
  { feature: 'Tone & Quality', traditional: 'Robotic & Repetitive AI Text', platform: '✨ Authentic 100% Human Expert Voice' },
  { feature: 'Topical Authority', traditional: 'Isolated Articles', platform: '🕸️ Multi-Layer Topic Universe Clusters' },
  { feature: 'Search Engine Indexing', traditional: 'High Risk of Penalties', platform: '🛡️ Safe, Google EEAT Compliant' },
];

const WORKFLOW_STEPS = [
  { step: '01', title: 'Topical & Entity Mining', desc: 'Our AI engine scans top-ranking SERP entities, semantic gaps, and audience questions across your industry.' },
  { step: '02', title: 'AEO & GEO Scaffolding', desc: 'We structure content headers and direct answers specifically designed to trigger AI Overviews and LLM citations.' },
  { step: '03', title: 'Expert Knowledge Injection', desc: 'Real industry insights, data points, and specialized terminology are added so the content reads like a seasoned authority.' },
  { step: '04', title: 'Multi-Engine Optimization', desc: 'Simultaneous optimization for Google Search, Perplexity, ChatGPT, Claude, and mobile user engagement.' },
  { step: '05', title: 'Human Editorial Polish', desc: 'Senior strategists review and refine every line before publishing live to your website.' }
];

export default function AiSeoPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="pt-36 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,54%)]/10 via-transparent to-[hsl(270,80%,60%)]/10" />
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'AI Content Intelligence' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="badge mb-4">🚀 Next-Gen AI Content Intelligence</span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-white">
                Content Engine Built for <span className="gradient-text">Google, AEO & LLMs.</span>
              </h1>
              <p className="text-[hsl(215,20%,70%)] text-lg md:text-xl mb-8 leading-relaxed">
                Publish content engineered for <strong className="text-white">Google SEO</strong>, <strong className="text-white">Answer Engines (AEO)</strong>, and <strong className="text-white">Generative Search (GEO)</strong> like ChatGPT & Perplexity—producing articles that feel written by an expert rather than AI.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary py-4 px-8 text-base font-bold shadow-xl shadow-[hsl(217,91%,54%)]/25">
                  Get Free AI Content Audit →
                </Link>
                <Link href="#comparison" className="btn-outline py-4 px-6 text-sm font-semibold">
                  Compare Features ↓
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-xs text-[hsl(215,20%,55%)]">
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Google EEAT Compliant</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Perplexity & ChatGPT Ready</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> 0% Robotic AI Cliches</span>
              </div>
            </div>

            {/* INTERACTIVE DASHBOARD CARD PREVIEW */}
            <div className="lg:col-span-5">
              <div className="glass-card p-8 border-[hsl(270,80%,60%)]/40 relative overflow-hidden shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[hsl(215,25%,22%)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[hsl(217,91%,54%)] to-[hsl(270,91%,65%)] flex items-center justify-center font-bold text-white text-lg">
                      🤖
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">MarketHom AI Intelligence Engine</div>
                      <div className="text-[10px] text-emerald-400 font-mono">Status: 100% Multi-Engine Optimized</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Live</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-white mb-1.5">
                      <span>Google Search EEAT Score</span>
                      <span className="text-[hsl(217,91%,70%)]">98 / 100</span>
                    </div>
                    <div className="h-2 bg-[hsl(222,47%,12%)] rounded-full overflow-hidden">
                      <div className="h-full bg-[hsl(217,91%,54%)] w-[98%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-white mb-1.5">
                      <span>Perplexity & AEO Direct Answer Indexing</span>
                      <span className="text-purple-400">95% Citation Rate</span>
                    </div>
                    <div className="h-2 bg-[hsl(222,47%,12%)] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[95%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-white mb-1.5">
                      <span>LLM Chatbot Knowledge Graph (GEO)</span>
                      <span className="text-emerald-400">Optimal Match</span>
                    </div>
                    <div className="h-2 bg-[hsl(222,47%,12%)] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[92%]" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,20%)] text-[11px] text-[hsl(215,20%,65%)] leading-relaxed italic">
                  "Our platform doesn't just generate text; it engineers semantic authority that both Google algorithms and ChatGPT recommendations trust completely."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE OPTIMIZATION PILLARS */}
      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge mb-4">Core Architecture</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Optimized for <span className="gradient-text">Every Search Engine & AI Model</span>
            </h2>
            <p className="text-[hsl(215,20%,60%)] text-base md:text-lg">
              Search has evolved. Your content must now perform across Google Search, AI Overviews, LLMs, and direct conversational bots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PILLARS.map((pillar, i) => (
              <div key={i} className="glass-card p-8 border hover:border-[hsl(217,91%,54%)]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{pillar.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                      <span className="text-xs text-[hsl(217,91%,70%)] font-semibold font-mono">{pillar.subtitle}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[hsl(215,20%,65%)] leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-[hsl(215,25%,22%)]/40 text-xs text-white">
                  {pillar.bullets.map(b => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="section-padding bg-[hsl(222,47%,7%)] border-y border-[hsl(215,25%,22%)]/40" id="comparison">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge mb-4">Why MarketHom</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Traditional AI Content vs. <span className="gradient-text">MarketHom Intelligence</span>
            </h2>
            <p className="text-[hsl(215,20%,60%)] text-base">
              Why generic AI content gets ignored by Google and how our multi-engine platform wins rankings.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[hsl(215,25%,22%)] text-xs font-bold uppercase tracking-wider text-[hsl(215,20%,50%)]">
                  <th className="pb-4 px-4">Feature / Capability</th>
                  <th className="pb-4 px-4 text-red-400">Generic AI Generators</th>
                  <th className="pb-4 px-4 text-emerald-400 font-black">MarketHom Content Intelligence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(215,25%,22%)]/40 text-sm">
                {COMPARISON_MATRIX.map((row, i) => (
                  <tr key={i} className="hover:bg-[hsl(222,47%,9%)] transition-colors">
                    <td className="py-4 px-4 font-bold text-white">{row.feature}</td>
                    <td className="py-4 px-4 text-[hsl(215,20%,60%)]">{row.traditional}</td>
                    <td className="py-4 px-4 font-bold text-emerald-300">{row.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WORKFLOW STEPS */}
      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge mb-4">Our Workflow</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              How the <span className="gradient-text">Intelligence Engine</span> Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {WORKFLOW_STEPS.map((w) => (
              <div key={w.step} className="glass-card p-6 border border-[hsl(215,25%,20%)] flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black gradient-text mb-4">{w.step}</div>
                  <h3 className="text-base font-bold text-white mb-2">{w.title}</h3>
                  <p className="text-xs text-[hsl(215,20%,60%)] leading-relaxed">{w.desc}</p>
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
