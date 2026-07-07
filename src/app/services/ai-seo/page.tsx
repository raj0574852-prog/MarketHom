import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'AI-Powered SEO Services | Future-Proof Your Growth | MarketHom Agency',
  description: 'Scale your content and dominate search with our AI SEO services. We combine human expertise with cutting-edge AI tools for maximum results.',
  keywords: ['AI SEO', 'Artificial Intelligence SEO', 'content automation', 'topical authority', 'semantic search'],
};

const aiFeatures = [
  {
    title: 'AI-Driven Topic Clustering',
    desc: 'Our proprietary AI models map out entire topical universes to ensure you build maximum authority in your niche.',
    icon: '🕸️'
  },
  {
    title: 'Semantic Content Optimization',
    desc: 'We use NLP (Natural Language Processing) to ensure your content perfectly matches the entities and intent Google expects.',
    icon: '🧠'
  },
  {
    title: 'AI Content Production at Scale',
    desc: 'Generate thousands of high-quality, human-edited articles to capture long-tail traffic that competitors ignore.',
    icon: '⚡'
  },
  {
    title: 'Automated SERP Monitoring',
    desc: 'Real-time monitoring of algorithm shifts and competitor moves, powered by machine learning algorithms.',
    icon: '👁️'
  }
];

export default function AiSeoPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'AI SEO' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4">The Future of Search</span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                SEO Powered by <span className="gradient-text">Intelligence.</span>
              </h1>
              <p className="text-[hsl(215,20%,65%)] text-xl mb-8 leading-relaxed">
                Traditional SEO is slow. AI-powered SEO is exponential. We combine the world's most advanced AI models with human strategic oversight to deliver results 3x faster than traditional methods.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">Get Your AI Audit</Link>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card p-8 border-[hsl(270,80%,60%)]/30 animate-pulse-glow">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[hsl(270,80%,60%)] flex items-center justify-center text-xl">🤖</div>
                    <div>
                      <div className="text-xs text-[hsl(215,20%,50%)] uppercase tracking-widest">AI Status</div>
                      <div className="font-bold text-white">System Optimized</div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-2 bg-[hsl(215,25%,18%)] rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)] w-[88%]" />
                    </div>
                    <div className="h-2 bg-[hsl(215,25%,18%)] rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)] w-[94%]" />
                    </div>
                    <div className="h-2 bg-[hsl(215,25%,18%)] rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)] w-[76%]" />
                    </div>
                 </div>
                 <div className="mt-8 pt-8 border-t border-[hsl(215,25%,22%)]">
                    <p className="text-xs text-[hsl(215,20%,50%)] italic">"AI doesn't replace SEO strategy; it amplifies it. Our clients are seeing results in weeks, not months."</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiFeatures.map((f, i) => (
              <div key={i} className="glass-card p-10 group">
                <div className="text-5xl mb-6">{f.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-[hsl(215,20%,65%)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
