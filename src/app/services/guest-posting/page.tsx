import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Premium Guest Posting Services | High DA Sites | MarketHom Agency',
  description: 'Boost your rankings with high-quality guest posts on premium, niche-relevant websites. We handle everything from content creation to publisher outreach.',
  keywords: ['guest posting', 'guest blogging', 'white hat links', 'niche edits', 'authority links'],
};

export default function GuestPostingPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'Guest Posting' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4">Quality Outreach</span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Guest Posts on <span className="gradient-text">Top-Tier Sites.</span>
              </h1>
              <p className="text-[hsl(215,20%,65%)] text-xl mb-8 leading-relaxed">
                No PBNs. No spam. Just high-quality guest posts on real websites with real traffic. We handle the entire process: niche research, content creation, and publisher negotiation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">View Publisher List</Link>
              </div>
            </div>
            
            <div className="relative">
               <div className="glass-card p-8">
                  <h3 className="font-bold mb-6">Our Publisher Requirements</h3>
                  <ul className="space-y-4">
                     {[
                       'DA 40-90+ Guaranteed',
                       'Minimum 5K Monthly Organic Traffic',
                       'Niche-Relevant Context',
                       'No "Write for Us" Footprints',
                       'Permanent Dofollow Links',
                       'Safe for All Google Updates'
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-3 text-sm text-[hsl(215,20%,60%)]">
                          <svg className="w-5 h-5 text-[hsl(152,69%,46%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
