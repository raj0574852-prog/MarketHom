import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About EducationHom | Our Story, Mission & Team',
  description:
    'Learn about EducationHom — a results-driven digital marketing agency and premium SEO marketplace.',
};

// Fictional team removed per FIND-023B

const values = [
  { icon: '🎯', title: 'Results-First', desc: 'We measure success by your growth, not vanity metrics. Every strategy is tied to real business outcomes.' },
  { icon: '🔍', title: 'Radical Transparency', desc: 'No black boxes. You always know exactly what we\'re doing, why, and what results it\'s generating.' },
  { icon: '🚀', title: 'Relentless Innovation', desc: 'We stay ahead of algorithm changes and industry shifts so you never fall behind.' },
  { icon: '🤝', title: 'True Partnership', desc: 'We treat your business as our own. Your wins are our wins. We\'re invested in your long-term success.' },
];

const milestones = [
  { year: 'Launch', event: 'Founded with a mission: help businesses grow online.' },
  { year: 'Expansion', event: 'Expanded to full-service digital marketing and marketplace offerings.' },
  { year: 'Platform', event: 'Launched proprietary SEO audit and publisher marketplace platform.' },
  { year: 'Growth', event: 'Integrated AI-powered SEO tools for faster keyword domination.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,54%)]/8 via-transparent to-[hsl(270,80%,60%)]/5" />
        <div className="container-custom relative z-10 text-center">
          <span className="badge mb-6">Our Story</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            We Don&apos;t Just Market.
            <br />
            <span className="gradient-text">We Build Empires.</span>
          </h1>
          <p className="text-[hsl(215,20%,60%)] text-xl max-w-3xl mx-auto leading-relaxed">
            EducationHom was built on a single belief: every business deserves access to world-class digital marketing and premium SEO placements.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge mb-4">Our Mission</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Democratizing <span className="gradient-text">Elite Marketing</span>
              </h2>
              <p className="text-[hsl(215,20%,65%)] text-lg leading-relaxed mb-6">
                For too long, top-tier digital marketing was reserved for companies with massive budgets. We founded EducationHom to change that. Whether you&apos;re a local business trying to get found on Google or a SaaS company scaling up, you deserve the same sophisticated strategies as the biggest players in your industry.
              </p>
              <p className="text-[hsl(215,20%,65%)] text-lg leading-relaxed mb-8">
                Our specialists bring battle-tested expertise across SEO, PPC, social media, content, and web development — all under one roof, working in perfect sync toward your growth goals.
              </p>
              <Link href="/contact" className="btn-primary">
                <span>Work With Us</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'Premium', label: 'Quality Standards', icon: '🎯' },
                { value: 'Verified', label: 'Publisher Network', icon: '✅' },
                { value: 'Data-Driven', label: 'Strategies', icon: '📊' },
                { value: 'Transparent', label: 'Reporting', icon: '🔍' },
              ].map((s) => (
                <div key={s.label} className="glass-card p-6 text-center">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <div className="stat-number text-xl mb-1">{s.value}</div>
                  <div className="text-sm text-[hsl(215,20%,60%)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding mesh-bg">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="badge mb-4">Our Values</span>
            <h2 className="text-4xl font-black mb-4">What Drives <span className="gradient-text">Everything We Do</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="glass-card p-6 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-lg font-bold mb-3">{v.title}</h3>
                <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="badge mb-4">Our Journey</span>
            <h2 className="text-4xl font-black mb-4">Focused on <span className="gradient-text">Growth</span></h2>
          </div>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-[60px] top-0 bottom-0 w-px bg-gradient-to-b from-[hsl(217,91%,54%)] via-[hsl(270,80%,60%)] to-[hsl(152,69%,46%)]" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="text-right w-16 flex-shrink-0">
                    <span className="text-sm font-bold text-[hsl(217,91%,65%)]">{m.year}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)] border-2 border-[hsl(222,47%,7%)]" />
                  </div>
                  <div className="glass-card p-4 flex-1">
                    <p className="text-sm text-[hsl(215,20%,65%)] leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="section-padding-sm bg-[hsl(222,47%,5%)]">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-black mb-4">Ready to <span className="gradient-text">Partner With Us?</span></h2>
          <p className="text-[hsl(215,20%,60%)] mb-8 max-w-xl mx-auto">
            Partner with EducationHom to drive your digital growth today.
          </p>
          <Link href="/contact" className="btn-primary">
            <span>Get Your Free Strategy Call</span>
          </Link>
        </div>
      </section>
    </>
  );
}
