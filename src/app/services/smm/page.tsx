import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Social Media Marketing | Build Your Brand Community | MarketHom Agency',
  description: 'Scale your brand on social media with strategic content and community management. We handle Meta, LinkedIn, Instagram, and TikTok for high-growth brands.',
  keywords: ['SMM', 'Social Media Marketing', 'Instagram marketing', 'LinkedIn strategy', 'brand awareness'],
};

export default function SmmPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'Social Media Marketing' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4">Community & Brand</span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Social that <span className="gradient-text">Converts.</span>
              </h1>
              <p className="text-[hsl(215,20%,65%)] text-xl mb-8 leading-relaxed">
                Social media isn't just about likes and follows—it's about building a loyal community that drives real business results. We combine thumb-stopping creative with data-driven strategy to turn your social channels into growth engines.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">Get Your Social Strategy</Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {[
                 { platform: 'Instagram', reach: '+1.2M' },
                 { platform: 'LinkedIn', reach: '+850K' },
                 { platform: 'TikTok', reach: '+2.4M' },
                 { platform: 'Meta', reach: '+5.1M' },
               ].map((p, i) => (
                 <div key={i} className="glass-card p-6 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{p.reach}</div>
                    <div className="text-[10px] text-[hsl(215,20%,50%)] uppercase tracking-widest">{p.platform} Reach</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
