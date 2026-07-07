const steps = [
  {
    number: '01',
    title: 'Discovery & Audit',
    description: 'We deep-dive into your business, competitors, and current digital footprint. Our comprehensive audit uncovers hidden opportunities and critical gaps.',
    icon: '🔎',
  },
  {
    number: '02',
    title: 'Custom Strategy',
    description: 'No templates here. We craft a bespoke growth strategy tailored to your goals, timeline, and budget — with clear KPIs from day one.',
    icon: '📋',
  },
  {
    number: '03',
    title: 'Execution & Optimization',
    description: 'Our expert team executes relentlessly, testing and iterating every week. We optimize continuously to maximize performance.',
    icon: '⚡',
  },
  {
    number: '04',
    title: 'Measure & Scale',
    description: 'Track every metric that matters with live reporting dashboards. When something works, we scale it hard and fast.',
    icon: '📈',
  },
];

export default function ProcessSection() {
  return (
    <section className="section-padding bg-[hsl(222,47%,5%)]" id="process">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="badge mb-4">Our Process</span>
          <h2 className="text-4xl md:text-5xl font-black mb-5">
            How We Deliver{' '}
            <span className="gradient-text">Consistent Results</span>
          </h2>
          <p className="text-[hsl(215,20%,60%)] text-lg max-w-2xl mx-auto">
            A proven 4-step framework that takes you from zero to dominating your niche.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[60px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[hsl(217,91%,54%)]/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center group">
                {/* Number circle */}
                <div className="relative inline-flex mb-6">
                  <div className="w-[120px] h-[120px] rounded-full bg-[hsl(215,25%,14%)] border border-[hsl(215,25%,22%)]/50 flex flex-col items-center justify-center group-hover:border-[hsl(217,91%,54%)]/60 transition-all duration-300 mx-auto">
                    <span className="text-3xl mb-1">{step.icon}</span>
                    <span className="text-xs font-bold text-[hsl(217,91%,65%)] tracking-widest">{step.number}</span>
                  </div>
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-full bg-[hsl(217,91%,54%)]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-[hsl(217,91%,75%)] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[hsl(215,20%,60%)] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
