import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'White-Hat Link Building Services | Build Domain Authority | MarketHom Agency',
  description: 'Earn high-quality, high-authority backlinks with our manual outreach and digital PR services. Safe, effective, and results-driven link building.',
  keywords: ['link building', 'backlinks', 'digital PR', 'domain authority', 'guest posting', 'HARO'],
};

export default function LinkBuildingPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'Link Building' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4">Authority Building</span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Backlinks that <span className="gradient-text">Actually Work.</span>
              </h1>
              <p className="text-[hsl(215,20%,65%)] text-xl mb-8 leading-relaxed">
                Backlinks are still the #1 ranking factor. But low-quality links can kill your rankings. We provide 100% manual outreach and digital PR to earn you links from real, high-authority sites in your niche.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">Start Building Authority</Link>
              </div>
            </div>
            
            <div className="relative">
               <div className="glass-card p-8 flex flex-col gap-4">
                  {[
                    { site: 'Forbes.com', da: '95', niche: 'Business' },
                    { site: 'TechCrunch.com', da: '93', niche: 'Technology' },
                    { site: 'HubSpot.com', da: '91', niche: 'Marketing' },
                    { site: 'Entrepreneur.com', da: '92', niche: 'Business' },
                  ].map((link, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[hsl(215,25%,14%)] rounded-xl border border-[hsl(215,25%,22%)]/40">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[hsl(152,69%,46%)]" />
                          <span className="font-bold text-white">{link.site}</span>
                       </div>
                       <div className="flex gap-4">
                          <span className="text-[10px] text-[hsl(215,20%,40%)] uppercase tracking-widest font-bold">DA {link.da}</span>
                          <span className="text-[10px] text-[hsl(217,91%,70%)] uppercase tracking-widest font-bold">{link.niche}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
