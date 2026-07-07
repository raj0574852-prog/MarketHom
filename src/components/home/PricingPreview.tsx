import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: '$997',
    period: '/mo',
    description: 'Perfect for small businesses ready to start growing online.',
    features: [
      'SEO Audit & Strategy',
      'On-Page SEO (10 pages)',
      'Monthly Reporting',
      '5 Target Keywords',
      '2 Blog Posts/Month',
      'Google Analytics Setup',
    ],
    cta: 'Get Started',
    popular: false,
    color: 'hsl(215,25%,22%)',
  },
  {
    name: 'Growth',
    price: '$2,497',
    period: '/mo',
    description: 'For businesses serious about dominating their market.',
    features: [
      'Everything in Starter',
      '25 Target Keywords',
      'Link Building (5 links/mo)',
      '4 Blog Posts/Month',
      'PPC Campaign Management',
      'Social Media (2 platforms)',
      'CRO Consultation',
      'Priority Support',
    ],
    cta: 'Most Popular',
    popular: true,
    color: 'hsl(217,91%,54%)',
  },
  {
    name: 'Domination',
    price: '$4,997',
    period: '/mo',
    description: 'Full-service digital marketing for aggressive growth targets.',
    features: [
      'Everything in Growth',
      'Unlimited Keywords',
      'Link Building (15 links/mo)',
      '8 Blog Posts/Month',
      'AI SEO Strategy',
      'Full Social Media (4 platforms)',
      'Dedicated Account Manager',
      'Weekly Strategy Calls',
      'Custom Reporting Dashboard',
    ],
    cta: 'Scale Now',
    popular: false,
    color: 'hsl(270,80%,60%)',
  },
];

export default function PricingPreview() {
  return (
    <section className="section-padding mesh-bg" id="pricing">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="badge mb-4">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black mb-5">
            Transparent Pricing.{' '}
            <span className="gradient-text">No Hidden Fees.</span>
          </h2>
          <p className="text-[hsl(215,20%,60%)] text-lg max-w-2xl mx-auto">
            Choose the plan that fits your ambition. All plans include a free onboarding audit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-7 transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-[hsl(217,91%,54%)]/10 to-[hsl(270,80%,60%)]/5 border-[hsl(217,91%,54%)]/50 shadow-2xl shadow-[hsl(217,91%,54%)]/20 scale-105'
                  : 'bg-[hsl(215,25%,12%)] border-[hsl(215,25%,22%)]/50 hover:border-[hsl(215,25%,30%)]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="badge bg-gradient-to-r from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)] text-white border-0 text-xs">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xl font-bold mb-1" style={{ color: plan.popular ? 'white' : 'hsl(215,20%,85%)' }}>
                  {plan.name}
                </h3>
                <p className="text-sm text-[hsl(215,20%,55%)]">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-[hsl(215,20%,55%)] text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-[hsl(215,20%,70%)]">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      style={{ color: plan.popular ? 'hsl(152,69%,46%)' : 'hsl(217,91%,54%)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={plan.popular ? 'btn-primary w-full justify-center' : 'btn-outline w-full justify-center'}
              >
                <span>{plan.cta} →</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-[hsl(215,20%,55%)] text-sm mb-4">Need a custom plan? We build tailored packages for enterprises.</p>
          <Link href="/pricing" className="text-[hsl(217,91%,65%)] font-semibold hover:text-white transition-colors text-sm">
            See Full Pricing Details →
          </Link>
        </div>
      </div>
    </section>
  );
}
