import Link from 'next/link';

const caseStudies = [
  {
    industry: 'E-Commerce',
    company: 'StyleVault Fashion',
    logo: '🛍️',
    challenge: 'Stuck at 12K monthly organic visitors with <2% conversion rate.',
    result: '+342% organic traffic, +189% revenue in 8 months',
    metrics: [
      { label: 'Organic Traffic', before: '12K', after: '53K', growth: '+342%' },
      { label: 'Revenue', before: '$48K/mo', after: '$138K/mo', growth: '+188%' },
      { label: 'Keywords Ranked', before: '245', after: '1,840', growth: '+651%' },
    ],
    service: 'SEO + CRO',
    color: 'hsl(270,80%,60%)',
  },
  {
    industry: 'SaaS / Tech',
    company: 'DataFlow Pro',
    logo: '📊',
    challenge: 'High CPC with poor quality leads and $12 cost per lead.',
    result: 'Reduced CPC by 67% while tripling lead quality in 3 months',
    metrics: [
      { label: 'Cost Per Lead', before: '$12.40', after: '$3.90', growth: '-69%' },
      { label: 'Lead Quality Score', before: '34%', after: '87%', growth: '+156%' },
      { label: 'Monthly Leads', before: '89', after: '312', growth: '+250%' },
    ],
    service: 'PPC + Landing CRO',
    color: 'hsl(217,91%,54%)',
  },
  {
    industry: 'Local Business',
    company: 'PrimeCare Dental',
    logo: '🦷',
    challenge: 'No Google visibility in local market, losing to competitors.',
    result: '#1 Google Maps ranking, 5x appointment bookings',
    metrics: [
      { label: 'Google Maps Position', before: 'Not Listed', after: '#1', growth: 'Top 3' },
      { label: 'Monthly Calls', before: '23', after: '147', growth: '+539%' },
      { label: 'Patient Bookings', before: '18/mo', after: '94/mo', growth: '+422%' },
    ],
    service: 'Local SEO + GMB',
    color: 'hsl(152,69%,46%)',
  },
];

export default function ResultsSection() {
  return (
    <section className="section-padding mesh-bg" id="results">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="badge mb-4">Proven Results</span>
          <h2 className="text-4xl md:text-5xl font-black mb-5">
            Real Businesses.{' '}
            <span className="gradient-text">Real Results.</span>
          </h2>
          <p className="text-[hsl(215,20%,60%)] text-lg max-w-2xl mx-auto">
            Don't take our word for it. Here's what we've achieved for businesses just like yours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {caseStudies.map((cs, i) => (
            <div key={i} className="glass-card p-7">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="text-xs font-semibold text-[hsl(215,20%,50%)] uppercase tracking-wider">{cs.industry}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl">{cs.logo}</span>
                    <h3 className="text-lg font-bold">{cs.company}</h3>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: `${cs.color}22`, color: cs.color }}
                >
                  {cs.service}
                </span>
              </div>

              {/* Challenge */}
              <div className="bg-[hsl(0,60%,55%)]/8 border border-[hsl(0,60%,55%)]/20 rounded-xl p-3 mb-4">
                <span className="text-xs font-bold text-[hsl(0,60%,65%)] uppercase tracking-wider">Challenge</span>
                <p className="text-sm text-[hsl(215,20%,65%)] mt-1">{cs.challenge}</p>
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-5">
                {cs.metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(215,20%,55%)]">{m.label}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[hsl(215,20%,45%)] line-through">{m.before}</span>
                      <span className="text-[hsl(215,20%,70%)]">→</span>
                      <span className="font-bold text-white">{m.after}</span>
                      <span
                        className="font-bold px-1.5 py-0.5 rounded"
                        style={{ color: cs.color, background: `${cs.color}18` }}
                      >
                        {m.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Result Banner */}
              <div
                className="rounded-xl p-3 text-center text-sm font-semibold"
                style={{ background: `${cs.color}15`, border: `1px solid ${cs.color}30`, color: cs.color }}
              >
                ✅ {cs.result}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/case-studies" className="btn-primary">
            <span>View All Case Studies</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
