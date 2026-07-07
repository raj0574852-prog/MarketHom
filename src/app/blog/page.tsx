import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Marketing Insights & Blog | MarketHom Agency',
  description: 'Stay ahead of the curve with our latest insights on SEO, AI, PPC, and digital marketing strategies. Expert advice for growing your business.',
};

const blogPosts = [
  {
    slug: 'ai-seo-strategies-2025',
    title: '10 AI SEO Strategies That Will Dominate Search in 2025',
    excerpt: 'Artificial intelligence is reshaping how Google ranks content. Here are the 10 AI-powered SEO strategies that top agencies are using right now.',
    category: 'AI SEO',
    author: 'Alex Rivera',
    date: 'Apr 28, 2025',
    readTime: '8 min read',
    icon: '🤖'
  },
  {
    slug: 'ppc-mistakes-killing-roi',
    title: '7 PPC Mistakes That Are Silently Killing Your ROI',
    excerpt: 'Most businesses are flushing 40-60% of their ad budget down the drain. Discover the seven most common PPC mistakes and how to fix them.',
    category: 'PPC',
    author: 'Priya Sharma',
    date: 'Apr 21, 2025',
    readTime: '6 min read',
    icon: '💰'
  },
  {
    slug: 'local-seo-guide-2025',
    title: 'The Ultimate Local SEO Guide for 2025: Rank #1 in Your City',
    excerpt: 'Local search has never been more competitive. This comprehensive guide walks you through every step to dominate local search results.',
    category: 'Local SEO',
    author: 'Marcus Chen',
    date: 'Apr 14, 2025',
    readTime: '12 min read',
    icon: '📍'
  },
  {
    slug: 'future-of-link-building',
    title: 'The Future of Link Building: Beyond Guest Posting',
    excerpt: 'Digital PR and brand mentions are the new backlinks. Learn how to build a natural link profile that Google loves.',
    category: 'Link Building',
    author: 'Sofia Laurent',
    date: 'Apr 07, 2025',
    readTime: '10 min read',
    icon: '🔗'
  },
  {
    slug: 'nextjs-for-seo',
    title: 'Why Next.js is the Best Framework for SEO in 2025',
    excerpt: 'Performance is a ranking factor. Discover why Next.js is the preferred choice for high-performance, SEO-first websites.',
    category: 'Web Dev',
    author: 'James O\'Brien',
    date: 'Mar 31, 2025',
    readTime: '7 min read',
    icon: '⚛️'
  },
  {
    slug: 'conversion-rate-optimization-tips',
    title: '15 CRO Tips to Double Your Website Conversions',
    excerpt: 'Traffic is vanity, conversions are sanity. Use these 15 tested tips to turn more of your visitors into paying customers.',
    category: 'CRO',
    author: 'Aisha Patel',
    date: 'Mar 24, 2025',
    readTime: '9 min read',
    icon: '📈'
  }
];

export default function BlogIndexPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Blog' }]} />
          <div className="max-w-3xl">
            <span className="badge mb-4">Latest Insights</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Marketing <span className="gradient-text">Knowledge.</span>
            </h1>
            <p className="text-[hsl(215,20%,65%)] text-xl leading-relaxed">
              Expert advice, strategy guides, and industry news to help you navigate the ever-changing digital landscape.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
          {/* Categories Filter (Placeholder) */}
          <div className="flex flex-wrap gap-3 mb-12">
            {['All', 'SEO', 'AI SEO', 'PPC', 'Web Dev', 'Link Building', 'CRO'].map(cat => (
              <button key={cat} className="px-5 py-2 rounded-full border border-[hsl(215,25%,22%)] text-xs font-semibold text-[hsl(215,20%,50%)] hover:border-[hsl(217,91%,54%)] hover:text-white transition-all">
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-card flex flex-col group overflow-hidden">
                <div className="h-48 bg-[hsl(215,25%,14%)] flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                  {post.icon}
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-[hsl(215,20%,40%)] mb-4">
                    <span className="text-[hsl(217,91%,70%)]">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-4 text-white group-hover:text-[hsl(217,91%,75%)] transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-[hsl(215,25%,22%)]/40">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-[hsl(217,91%,54%)]/20 flex items-center justify-center text-[10px] font-bold text-white">
                          {post.author.split(' ').map(n => n[0]).join('')}
                       </div>
                       <span className="text-[10px] font-bold text-[hsl(215,20%,50%)]">{post.author}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[hsl(215,20%,40%)]">{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Pagination (Placeholder) */}
          <div className="flex justify-center mt-16 gap-2">
             <button className="w-10 h-10 rounded-lg border border-[hsl(217,91%,54%)] bg-[hsl(217,91%,54%)] text-white font-bold">1</button>
             <button className="w-10 h-10 rounded-lg border border-[hsl(215,25%,22%)] text-[hsl(215,20%,50%)] hover:text-white transition-colors">2</button>
             <button className="w-10 h-10 rounded-lg border border-[hsl(215,25%,22%)] text-[hsl(215,20%,50%)] hover:text-white transition-colors">3</button>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
