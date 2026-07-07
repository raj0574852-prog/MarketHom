import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="section-padding-sm relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,40%)] via-[hsl(240,70%,35%)] to-[hsl(270,80%,40%)]" />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="container-custom relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 tracking-wider uppercase">
            🚀 Ready to Scale Your Business?
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Let's Build Your
            <br />
            Growth Engine Today
          </h2>

          <p className="text-white/75 text-lg mb-10 leading-relaxed">
            Join 500+ businesses that trust MarketHom Agency to drive traffic, generate leads, and grow revenue. Your free audit is just one click away.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-[hsl(217,91%,40%)] px-8 py-4 rounded-full font-bold text-base hover:bg-white/90 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              Get Your Free SEO Audit
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/15 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/25 border border-white/30 transition-all duration-300"
            >
              View Pricing Plans
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              '✓ No long-term contracts',
              '✓ Results in 30 days',
              '✓ Free strategy call',
              '✓ Cancel anytime',
            ].map((item) => (
              <span key={item} className="text-sm text-white/70 font-medium">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
