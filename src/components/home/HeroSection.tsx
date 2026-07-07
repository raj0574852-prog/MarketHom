'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FloatingOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      heroRef.current.style.setProperty('--mouse-x', `${x}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[hsl(222,47%,7%)] pt-20"
    >
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 grayscale pointer-events-none">
        <Image 
          src="/hero-bg.png" 
          alt="Growth Background" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,7%)] via-transparent to-[hsl(222,47%,7%)]" />
      </div>

      {/* Animated background orbs */}
      <FloatingOrb className="w-[600px] h-[600px] bg-[hsl(217,91%,54%)]/10 top-[-100px] left-[-200px] animate-pulse-glow" />
      <FloatingOrb className="w-[500px] h-[500px] bg-[hsl(270,80%,60%)]/8 bottom-[-150px] right-[-100px] animate-float" />
      <FloatingOrb className="w-[300px] h-[300px] bg-[hsl(39,100%,58%)]/5 top-[30%] right-[20%]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(217,91%,54%) 1px, transparent 1px), linear-gradient(90deg, hsl(217,91%,54%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-custom relative z-10 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 animate-fade-in-up opacity-0 delay-100">
            <span className="badge">
              <span className="w-2 h-2 rounded-full bg-[hsl(152,69%,46%)] animate-pulse inline-block" />
              Trusted by 500+ Growing Businesses
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 animate-fade-in-up opacity-0 delay-200 leading-[1.05]">
            Dominate Search.
            <br />
            <span className="gradient-text">Grow Revenue.</span>
            <br />
            Win Online.
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-[hsl(215,20%,65%)] max-w-3xl mx-auto mb-10 animate-fade-in-up opacity-0 delay-300 leading-relaxed">
            MarketHom Agency is your growth partner — combining AI-powered SEO, precision PPC, and conversion-focused web development to put your brand on the map and keep it there.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up opacity-0 delay-400">
            <Link href="/contact" className="btn-primary text-base px-8 py-4 shadow-2xl shadow-[hsl(217,91%,54%)]/30">
              <span>Get Your Free Audit</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/case-studies" className="btn-outline text-base px-8 py-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>See Our Results</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up opacity-0 delay-500">
            <p className="text-xs text-[hsl(215,20%,45%)] mb-5 uppercase tracking-widest font-medium">Trusted partners & platforms</p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-40">
              {['Google Partner', 'Meta Business', 'HubSpot', 'Semrush', 'Ahrefs', 'Moz'].map((brand) => (
                <span key={brand} className="text-sm font-bold text-[hsl(215,20%,70%)] tracking-wide uppercase">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="mt-20 max-w-4xl mx-auto animate-fade-in-up opacity-0 delay-600">
          <div className="glass-card p-1 shadow-2xl shadow-black/50">
            <div className="bg-[hsl(222,47%,9%)] rounded-2xl overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(215,25%,22%)]/50">
                <div className="w-3 h-3 rounded-full bg-[hsl(0,80%,60%)]" />
                <div className="w-3 h-3 rounded-full bg-[hsl(39,100%,58%)]" />
                <div className="w-3 h-3 rounded-full bg-[hsl(152,69%,46%)]" />
                <div className="flex-1 mx-4 bg-[hsl(215,25%,18%)] rounded-full px-4 py-1.5 text-xs text-[hsl(215,20%,50%)]">
                  markethom.agency/dashboard
                </div>
              </div>
              {/* Dashboard content */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Organic Traffic', value: '+247%', color: 'hsl(152,69%,46%)' },
                  { label: 'Keyword Rankings', value: '#1–3', color: 'hsl(217,91%,54%)' },
                  { label: 'Lead Conversion', value: '+89%', color: 'hsl(39,100%,58%)' },
                  { label: 'ROI Generated', value: '12.4x', color: 'hsl(270,80%,60%)' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[hsl(215,25%,14%)] rounded-xl p-4 text-center">
                    <div className="text-2xl font-black mb-1" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-[hsl(215,20%,55%)]">{stat.label}</div>
                  </div>
                ))}
              </div>
              {/* Progress bars */}
              <div className="px-6 pb-6 space-y-3">
                {[
                  { label: 'SEO Performance Score', pct: 94 },
                  { label: 'Core Web Vitals', pct: 98 },
                  { label: 'Domain Authority Growth', pct: 78 },
                ].map((bar) => (
                  <div key={bar.label} className="flex items-center gap-4">
                    <span className="text-xs text-[hsl(215,20%,55%)] w-44 flex-shrink-0">{bar.label}</span>
                    <div className="flex-1 bg-[hsl(215,25%,18%)] rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)]"
                        style={{ width: `${bar.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[hsl(217,91%,75%)]">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
