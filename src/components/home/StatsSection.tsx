const stats = [
  { value: '500+', label: 'Clients Served', description: 'Across 30+ industries' },
  { value: '$120M+', label: 'Revenue Generated', description: 'For our clients' },
  { value: '98%', label: 'Retention Rate', description: 'Clients who stay with us' },
  { value: '10x', label: 'Average ROI', description: 'Return on marketing spend' },
  { value: '4.2B+', label: 'Impressions Earned', description: 'Organic search impressions' },
  { value: '15+', label: 'Years Experience', description: 'In digital marketing' },
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
