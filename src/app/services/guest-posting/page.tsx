import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'How Guest Posting Helps You Rank #1 on Google & AI Search | MarketHom Agency',
  description: 'Learn how premium guest posting on DA 40-90+ sites passes PageRank link equity, accelerates Google rankings, and trains AI chatbots (AEO & GEO) to recommend your clients.',
  keywords: [
    'how guest posting helps ranking',
    'guest post SEO strategy',
    'AEO link building',
    'GEO citations',
    'PageRank link equity',
    'high DA backlinks',
    'client ranking case study'
  ],
};

const HOW_GUEST_POSTS_BOOST_RANKINGS = [
  {
    icon: '⚡',
    title: '1. Direct PageRank & Link Equity Transfer',
    subtitle: 'Pass High-Authority Link Juice',
    description: 'When a DA 40-90+ site with strong Google trust links to your client’s target landing page, Google transfers authority ("PageRank"). This directly pushes your page up the search engine results pages (SERPs) for competitive keywords.',
    impact: 'Increases Keyword Rankings by 40%–120% within 30–60 days.'
  },
  {
    icon: '🎯',
    title: '2. Topical Relevance & Google Entity Signals',
    subtitle: 'Niche Contextual Alignment',
    description: 'Google does not just count links; it evaluates the topic of the publisher. By publishing articles on tightly matched niche sites, Google tags your client’s domain as a verified topical authority.',
    impact: 'Establishes instant domain trust and protects against algorithm shifts.'
  },
  {
    icon: '🤖',
    title: '3. Generative Engine (GEO) & LLM Citation Training',
    subtitle: 'Train ChatGPT & Perplexity',
    description: 'Modern AI search tools like ChatGPT, Claude, and Perplexity index high-authority publications. When your brand is referenced on top sites, LLMs cite your client as the top recommended vendor in AI chat responses.',
    impact: 'Drives zero-click AI recommendations and direct referral traffic.'
  },
  {
    icon: '📈',
    title: '4. High-Intent Referral Traffic & Direct Client Leads',
    subtitle: 'Real Readers, Real Sales',
    description: 'Unlike standard spam links, guest posts on active websites with 5,000+ monthly visitors send targeted, high-intent readers straight to your client’s site who are ready to purchase.',
    impact: 'Generates immediate referral leads while SEO rankings build.'
  }
];

const CLIENT_OPTIMIZATION_BLUEPRINT = [
  {
    phase: 'Step 1',
    title: 'Competitor Backlink & Gap Analysis',
    detail: 'We reverse-engineer the top 3 ranking competitors for your client’s target keywords to identify exact DA levels, anchor text distribution, and publisher gap opportunities.'
  },
  {
    phase: 'Step 2',
    title: 'Target Page & Anchor Text Strategy',
    detail: 'We craft a natural anchor text mix (Brand + Partial Match + LSI Entity) that signals keyword relevance without triggering Google keyword-stuffing filters.'
  },
  {
    phase: 'Step 3',
    title: 'AI Content Intelligence Drafting',
    detail: 'Every guest article is written using AI Content Intelligence—optimized for Google SEO, AEO, and GEO, and styled in a 100% human-expert voice.'
  },
  {
    phase: 'Step 4',
    title: 'Manual Outreach & Editorial Review',
    detail: 'We pitch verified editors directly, securing permanent dofollow placements inside contextual article paragraphs on real websites.'
  },
  {
    phase: 'Step 5',
    title: 'Indexing & Ranking Monitor',
    detail: 'We monitor Google Search Console and SERP trackers to verify fast indexing and track page rank improvements for your client.'
  }
];

const CLIENT_RESULTS = [
  { metric: '+340%', label: 'Organic Traffic Increase', desc: 'Average client growth in 90 days after launching 5 high-DA guest posts' },
  { metric: 'DA 40–90+', label: 'Guaranteed Domain Authority', desc: 'Placements exclusively on real websites with proven Google trust' },
  { metric: '#1 SERP', label: 'Top Google Rankings Achieved', desc: 'Over 85% of target client landing pages hit page 1 within 60 days' },
  { metric: '100% Safe', label: 'White-Hat & Future-Proof', desc: 'Zero PBNs, zero spam, 100% compliant with Google EEAT guidelines' }
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
              <span className="badge mb-4">SEO & AEO Ranking Accelerator</span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-white">
                How Guest Posts <span className="gradient-text">Rank Clients #1</span> on Google.
              </h1>
              <p className="text-[hsl(215,20%,65%)] text-lg md:text-xl mb-8 leading-relaxed">
                Guest posting isn't just about links—it's the fastest way to transfer <strong className="text-white">PageRank authority</strong>, build <strong className="text-white">topical trust</strong>, and train <strong className="text-white">AI engines (ChatGPT & Perplexity)</strong> to recommend your clients.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary py-4 px-8 text-base font-bold shadow-xl shadow-[hsl(217,91%,54%)]/25">
                  Get Free Client Strategy Audit →
                </Link>
                <Link href="#ranking-system" className="btn-outline py-4 px-6 text-sm font-semibold">
                  How Rankings Work ↓
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-5">
               <div className="glass-card p-8 border border-[hsl(217,91%,54%)]/30 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[hsl(215,25%,22%)]">
                    <h3 className="font-black text-lg text-white">Client Ranking Checklist</h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">100% Proven</span>
                  </div>

                  <ul className="space-y-3.5">
                     {[
                       'Transfers Powerful PageRank Link Equity',
                       'Boosts Target Keywords to Page 1 of Google',
                       'Trains ChatGPT & Perplexity to Cite Your Brand (GEO)',
                       'Drives High-Converting Niche Referral Traffic',
                       'Permanent Contextual In-Article Links',
                       'Written with AI Content Intelligence & Expert Tone',
                       '100% Safe from Penalty Updates'
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

      {/* HOW GUEST POSTING HELPS CLIENTS RANK */}
      <section className="section-padding bg-[hsl(222,47%,5%)] border-y border-[hsl(215,25%,22%)]/40" id="ranking-system">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge mb-4">Ranking Science</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              How Guest Posting <span className="gradient-text">Drives Client Growth</span>
            </h2>
            <p className="text-[hsl(215,20%,60%)] text-base md:text-lg">
              Here is the exact mechanism of how high-DA guest posts transform search rankings and deliver measurable client ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HOW_GUEST_POSTS_BOOST_RANKINGS.map((item, i) => (
              <div key={i} className="glass-card p-8 border hover:border-[hsl(217,91%,54%)]/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-xs font-bold text-[hsl(217,91%,70%)] font-mono uppercase tracking-wider mb-1">{item.subtitle}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-[hsl(215,20%,65%)] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[hsl(222,47%,9%)] border border-[hsl(217,91%,54%)]/20 text-xs font-bold text-emerald-300">
                  ⚡ Client Result: {item.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT ROI METRICS */}
      <section className="section-padding bg-[hsl(222,47%,7%)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLIENT_RESULTS.map((res, i) => (
              <div key={i} className="glass-card p-8 text-center border border-[hsl(217,91%,54%)]/20">
                <div className="text-4xl font-black gradient-text mb-2">{res.metric}</div>
                <div className="text-sm font-bold text-white mb-2">{res.label}</div>
                <p className="text-xs text-[hsl(215,20%,60%)] leading-relaxed">{res.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEP BY STEP CLIENT OPTIMIZATION BLUEPRINT */}
      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge mb-4">Client Optimization Blueprint</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Our 5-Step <span className="gradient-text">Client Ranking Blueprint</span>
            </h2>
            <p className="text-[hsl(215,20%,60%)] text-base">
              How we take your target keywords from page 5 to #1 on Google.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {CLIENT_OPTIMIZATION_BLUEPRINT.map((b) => (
              <div key={b.phase} className="glass-card p-6 border border-[hsl(215,25%,20%)] flex flex-col md:flex-row items-start md:items-center gap-6">
                <span className="px-3 py-1.5 rounded-xl bg-[hsl(217,91%,54%)]/20 text-[hsl(217,91%,70%)] font-mono font-bold text-xs whitespace-nowrap">
                  {b.phase}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{b.title}</h3>
                  <p className="text-xs text-[hsl(215,20%,60%)] leading-relaxed">{b.detail}</p>
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
