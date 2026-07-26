'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';
import { getStoredPosts, BlogPost } from '@/lib/blogStore';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    setPosts(getStoredPosts());
  }, []);

  const categories = ['All', 'SEO', 'AI SEO', 'PPC', 'Web Dev', 'Link Building', 'CRO', 'Local SEO'];

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());

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
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full border text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[hsl(217,91%,54%)] border-[hsl(217,91%,54%)] text-white shadow-lg shadow-[hsl(217,91%,54%)]/25'
                    : 'border-[hsl(215,25%,22%)] text-[hsl(215,20%,50%)] hover:border-[hsl(217,91%,54%)] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 glass-card">
              <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-sm text-[hsl(215,20%,60%)]">No posts currently exist under the "{selectedCategory}" category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id || post.slug} href={`/blog/${post.slug}`} className="glass-card flex flex-col group overflow-hidden">
                  <div className="h-48 bg-[hsl(215,25%,14%)] flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                    {post.icon || '📝'}
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
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed mb-6 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-[hsl(215,25%,22%)]/40">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[hsl(217,91%,54%)]/20 flex items-center justify-center text-[10px] font-bold text-white">
                          {post.author ? post.author.split(' ').map(n => n[0]).join('') : 'MH'}
                        </div>
                        <span className="text-[10px] font-bold text-[hsl(215,20%,50%)]">{post.author}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[hsl(215,20%,40%)]">{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
