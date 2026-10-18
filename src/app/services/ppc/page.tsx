import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'PPC Management Services | Maximize Your Ad ROI | EducationHom',
  description: 'Drive immediate results with expert PPC management. We optimize Google Ads, Meta Ads, and LinkedIn campaigns for maximum conversions.',

};

const ppcStats = [
  { label: 'Avg. ROI', value: '450%' },
  { label: 'CPA Reduction', value: '-35%' },
  { label: 'Ads Managed', value: '$50M+' },
];

export default function PpcPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(39,100%,58%)]/5 via-transparent to-transparent" />
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'PPC Advertising' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4 border-[hsl(39,100%,58%)]/30 text-[hsl(39,100%,70%)] bg-[hsl(39,100%,58%)]/10">Paid Media Experts</span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Turn Clicks into <span className="gradient-text-gold">Customers.</span>
              </h1>
              <p className="text-[hsl(215,20%,65%)] text-xl mb-8 leading-relaxed">
                Most businesses waste 40% of their ad spend on broad keywords and poor targeting. We stop the bleeding and build laser-focused campaigns that deliver high-quality leads at a lower cost.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary" style={{ background: 'linear-gradient(135deg, hsl(39, 100%, 58%), hsl(25, 100%, 50%))' }}>
                  Get Your Free PPC Audit
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {ppcStats.map((s, i) => (
                 <div key={i} className="glass-card p-8 text-center border-[hsl(39,100%,58%)]/20">
                    <div className="text-4xl font-black text-[hsl(39,100%,58%)] mb-2">{s.value}</div>
                    <div className="text-sm text-[hsl(215,20%,50%)] uppercase tracking-widest">{s.label}</div>
                 </div>
               ))}
               <div className="glass-card p-8 flex items-center justify-center bg-gradient-to-br from-[hsl(39,100%,58%)]/20 to-transparent">
                  <span className="text-4xl">ðŸ’°</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Our <span className="gradient-text-gold">PPC Ecosystem</span></h2>
            <p className="text-[hsl(215,20%,60%)]">Full-funnel paid media management across all major platforms.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8">
               <h3 className="text-xl font-bold mb-4 text-white">Google Search & Shopping</h3>
               <p className="text-[hsl(215,20%,60%)] text-sm mb-6">Capture intent exactly when users are looking for your solution. We optimize for quality score to lower your CPC.</p>
               <ul className="space-y-2 text-xs text-[hsl(215,20%,50%)]">
                  <li>â€¢ Keyword Research</li>
                  <li>â€¢ Negative Keyword Management</li>
                  <li>â€¢ Ad Copy A/B Testing</li>
                  <li>â€¢ Shopping Feed Optimization</li>
               </ul>
            </div>
            <div className="glass-card p-8">
               <h3 className="text-xl font-bold mb-4 text-white">Social Media Advertising</h3>
               <p className="text-[hsl(215,20%,60%)] text-sm mb-6">Interrupt the scroll with thumb-stopping creative and precision audience targeting on Meta, LinkedIn, and TikTok.</p>
               <ul className="space-y-2 text-xs text-[hsl(215,20%,50%)]">
                  <li>â€¢ Custom Audience Building</li>
                  <li>â€¢ Lookalike Modeling</li>
                  <li>â€¢ Creative Production</li>
                  <li>â€¢ Lead Gen Forms</li>
               </ul>
            </div>
            <div className="glass-card p-8">
               <h3 className="text-xl font-bold mb-4 text-white">Retargeting & LPO</h3>
               <p className="text-[hsl(215,20%,60%)] text-sm mb-6">Bring back lost visitors and convert them on landing pages built specifically to drive action and maximize ROI.</p>
               <ul className="space-y-2 text-xs text-[hsl(215,20%,50%)]">
                  <li>â€¢ Dynamic Retargeting</li>
                  <li>â€¢ Landing Page Design</li>
                  <li>â€¢ Conversion Tracking</li>
                  <li>â€¢ Heatmap Analysis</li>
               </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
