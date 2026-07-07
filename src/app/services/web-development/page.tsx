import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Next.js & React Web Development | High-Performance Sites | MarketHom Agency',
  description: 'We build blazing-fast, SEO-optimized websites using Next.js and React. Sites that rank, load in milliseconds, and convert visitors into customers.',
  keywords: ['web development', 'Next.js developer', 'React development', 'headless CMS', 'Core Web Vitals', 'CRO'],
};

export default function WebDevPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'Web Development' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4">High Performance</span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Websites Built for <span className="gradient-text">Speed & Profit.</span>
              </h1>
              <p className="text-[hsl(215,20%,65%)] text-xl mb-8 leading-relaxed">
                A slow website is a conversion killer. We build modern, headless web applications that load instantly, score 100 on Core Web Vitals, and provide a seamless experience that drives sales.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">Build My High-Speed Site</Link>
              </div>
            </div>
            
            <div className="relative">
               <div className="glass-card p-1 shadow-2xl shadow-[hsl(217,91%,54%)]/10">
                  <div className="bg-[hsl(222,47%,10%)] rounded-xl overflow-hidden">
                     <div className="flex items-center gap-2 p-3 bg-[hsl(215,25%,14%)] border-b border-[hsl(215,25%,22%)]">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <div className="ml-4 bg-[hsl(222,47%,7%)] px-4 py-1 rounded-full text-[10px] text-[hsl(215,20%,40%)]">https://your-new-site.com</div>
                     </div>
                     <div className="p-8">
                        <div className="grid grid-cols-4 gap-4 mb-8">
                           {[1, 2, 3, 4].map(i => (
                             <div key={i} className="h-10 bg-[hsl(215,25%,18%)] rounded-lg animate-pulse" />
                           ))}
                        </div>
                        <div className="space-y-4">
                           <div className="h-32 bg-[hsl(215,25%,18%)] rounded-xl animate-pulse" />
                           <div className="grid grid-cols-2 gap-4">
                              <div className="h-20 bg-[hsl(215,25%,18%)] rounded-xl animate-pulse" />
                              <div className="h-20 bg-[hsl(215,25%,18%)] rounded-xl animate-pulse" />
                           </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                           <div className="w-24 h-24 rounded-full border-4 border-[hsl(152,69%,46%)] flex items-center justify-center">
                              <span className="text-2xl font-black text-[hsl(152,69%,46%)]">100</span>
                           </div>
                        </div>
                        <p className="text-center text-[10px] text-[hsl(215,20%,50%)] mt-4 font-bold uppercase tracking-widest">Lighthouse Performance Score</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Next.js & React', desc: 'The fastest frontend framework on the planet for SEO and performance.', icon: '⚛️' },
              { title: 'Headless CMS', desc: 'Manage content effortlessly with Sanity, Strapi, or Contentful.', icon: '🏗️' },
              { title: 'Core Web Vitals', desc: 'We guarantee green scores for LCP, FID, and CLS on every project.', icon: '🚀' },
              { title: 'Conversion-Led', desc: 'Design that guides users toward your goals and maximizes ROI.', icon: '📈' },
            ].map((f, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-xs text-[hsl(215,20%,60%)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
