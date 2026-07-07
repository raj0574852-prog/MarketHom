import Link from 'next/link';

const services = [
  {
    icon: '🔍',
    title: 'SEO Services',
    slug: 'seo',
    description: 'Dominate organic search results with our data-driven SEO strategies. From technical audits to content optimization, we rank you where it matters.',
    features: ['Technical SEO Audits', 'Keyword Research', 'On-Page Optimization', 'Local SEO'],
    color: 'from-[hsl(217,91%,54%)] to-[hsl(217,91%,40%)]',
    glow: 'hsl(217,91%,54%)',
  },
  {
    icon: '🤖',
    title: 'AI SEO',
    slug: 'ai-seo',
    description: 'Harness the power of artificial intelligence to stay ahead of algorithm updates and build topical authority faster than ever before.',
    features: ['AI Content Strategy', 'Semantic SEO', 'Entity Optimization', 'SERP Domination'],
    color: 'from-[hsl(270,80%,60%)] to-[hsl(270,80%,45%)]',
    glow: 'hsl(270,80%,60%)',
  },
  {
    icon: '💰',
    title: 'PPC Advertising',
    slug: 'ppc',
    description: 'Maximize every dollar with laser-targeted PPC campaigns across Google, Meta, and LinkedIn. Stop wasting budget — start generating ROI.',
    features: ['Google Ads Management', 'Meta Ads', 'Landing Page CRO', 'A/B Testing'],
    color: 'from-[hsl(39,100%,58%)] to-[hsl(25,100%,50%)]',
    glow: 'hsl(39,100%,58%)',
  },
  {
    icon: '📱',
    title: 'Social Media Marketing',
    slug: 'smm',
    description: 'Build a loyal community and drive real business results through strategic social media marketing that converts followers into customers.',
    features: ['Strategy & Planning', 'Content Creation', 'Community Management', 'Paid Social'],
    color: 'from-[hsl(340,80%,58%)] to-[hsl(270,80%,60%)]',
    glow: 'hsl(340,80%,58%)',
  },
  {
    icon: '🔗',
    title: 'Link Building',
    slug: 'link-building',
    description: 'Earn high-authority backlinks that boost your domain strength and push you to the top of Google\'s search results — white-hat, every time.',
    features: ['High-DA Links', 'Digital PR', 'HARO Outreach', 'Niche Edits'],
    color: 'from-[hsl(152,69%,46%)] to-[hsl(152,69%,32%)]',
    glow: 'hsl(152,69%,46%)',
  },
  {
    icon: '✍️',
    title: 'Guest Posting',
    slug: 'guest-posting',
    description: 'Place authoritative articles on premium, niche-relevant publications to build brand authority and drive referral traffic at scale.',
    features: ['Premium Publishers', 'Niche-Relevant Sites', 'SEO-Optimized Content', 'DA 40-90+ Sites'],
    color: 'from-[hsl(190,80%,50%)] to-[hsl(217,91%,54%)]',
    glow: 'hsl(190,80%,50%)',
  },
  {
    icon: '💻',
    title: 'Web Development',
    slug: 'web-development',
    description: 'Get a blazing-fast, conversion-optimized website built on Next.js and React. We build sites that rank, load in milliseconds, and convert.',
    features: ['Next.js & React', 'Core Web Vitals', 'CRO Design', 'CMS Integration'],
    color: 'from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)]',
    glow: 'hsl(217,91%,54%)',
  },
];

export default function ServicesSection() {
  return (
    <section className="section-padding mesh-bg" id="services">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge mb-4">Our Services</span>
          <h2 className="text-4xl md:text-5xl font-black mb-5">
            Everything You Need to{' '}
            <span className="gradient-text">Dominate Online</span>
          </h2>
          <p className="text-[hsl(215,20%,60%)] text-lg max-w-2xl mx-auto">
            We don't offer cookie-cutter solutions. Every strategy is custom-built to your business goals, market, and competition.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="glass-card p-7 group block"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}
                style={{ boxShadow: `0 8px 24px ${service.glow}33` }}
              >
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-[hsl(217,91%,75%)] transition-colors">
                {service.title}
              </h3>
              <p className="text-[hsl(215,20%,60%)] text-sm mb-5 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-1.5 mb-5">
                {service.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-[hsl(215,20%,70%)]">
                    <svg className="w-4 h-4 text-[hsl(152,69%,46%)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-semibold text-[hsl(217,91%,65%)] group-hover:gap-4 transition-all duration-200">
                Learn More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/services" className="btn-outline">
            <span>View All Services</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
