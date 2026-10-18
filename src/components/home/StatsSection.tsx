const stats = [
  { value: 'Premium', label: 'Quality Standards', description: 'Stringent verification' },
  { value: 'Verified', label: 'Publisher Network', description: 'Manual vetting' },
  { value: 'Data-Driven', label: 'SEO Strategies', description: 'Backed by analytics' },
  { value: 'Transparent', label: 'Reporting', description: 'Clear deliverables' },
  { value: 'Dedicated', label: 'Support Team', description: 'Always here to help' },
  { value: 'Targeted', label: 'Audience Reach', description: 'Niche specific content' },
];

export default function StatsSection() {
  return (
    <section className="relative bg-[hsl(222,47%,5%)] border-y border-[hsl(215,25%,22%)]/40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(217,91%,54%)]/5 via-transparent to-[hsl(270,80%,60%)]/5" />
      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="stat-number mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-xs text-[hsl(215,20%,50%)]">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
