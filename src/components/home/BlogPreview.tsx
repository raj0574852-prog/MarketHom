import Link from 'next/link';

const posts = [
  {
    slug: 'ai-seo-strategies-2025',
    category: 'AI SEO',
    categoryColor: 'hsl(270,80%,60%)',
    title: '10 AI SEO Strategies That Will Dominate Search in 2025',
    excerpt: 'Artificial intelligence is reshaping how Google ranks content. Here are the 10 AI-powered SEO strategies that top agencies are using right now to leapfrog the competition.',
    readTime: '8 min read',
    date: 'Apr 28, 2025',
    author: 'Alex Rivera',
  },
  {
    slug: 'ppc-mistakes-killing-roi',
    category: 'PPC',
    categoryColor: 'hsl(39,100%,58%)',
    title: '7 PPC Mistakes That Are Silently Killing Your ROI (And How to Fix Them)',
    excerpt: 'Most businesses are flushing 40-60% of their ad budget down the drain. Discover the seven most common PPC mistakes and the exact fixes that can double your return.',
    readTime: '6 min read',
    date: 'Apr 21, 2025',
    author: 'Priya Sharma',
  },
  {
    slug: 'local-seo-guide-2025',
    category: 'Local SEO',
    categoryColor: 'hsl(152,69%,46%)',
    title: 'The Ultimate Local SEO Guide for 2025: Rank #1 in Your City',
    excerpt: 'Local search has never been more competitive — or more important. This comprehensive guide walks you through every step to dominate local search results and Google Maps.',
    readTime: '12 min read',
    date: 'Apr 14, 2025',
    author: 'Marcus Chen',
  },
];

export default function BlogPreview() {
  return (
    <section className="section-padding bg-[hsl(222,47%,5%)]" id="blog">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="badge mb-4">Latest Insights</span>
            <h2 className="text-4xl md:text-5xl font-black">
              Expert Marketing{' '}
              <span className="gradient-text">Knowledge</span>
            </h2>
          </div>
          <Link href="/blog" className="btn-outline whitespace-nowrap">
            View All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="glass-card overflow-hidden group"
            >
              {/* Image placeholder with gradient */}
              <div
                className="h-44 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${post.categoryColor}20, hsl(222,47%,12%))`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl opacity-30">
                    {post.category === 'AI SEO' ? '🤖' : post.category === 'PPC' ? '💰' : '📍'}
                  </span>
                </div>
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: `${post.categoryColor}25`, color: post.categoryColor }}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-[hsl(215,20%,50%)] mb-3">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                  <span>·</span>
                  <span>{post.author}</span>
                </div>

                <h3 className="text-base font-bold mb-3 group-hover:text-[hsl(217,91%,75%)] transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-[hsl(217,91%,65%)] group-hover:gap-4 transition-all duration-200">
                  Read Article
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
