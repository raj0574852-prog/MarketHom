import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CATEGORY_SLUGS } from '@/lib/seo/categories';
import { CANONICAL_SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'All Website Categories | EducationHom SEO Marketplace',
  description: 'Browse our complete directory of website categories for guest posting and niche edits. Find the perfect niche-relevant websites to boost your SEO.',
  alternates: {
    canonical: `${CANONICAL_SITE_URL}/websites/category`,
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function CategoryIndexPage() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24">
      <div className="bg-[hsl(222,47%,7%)] text-white pt-36 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Browse by Category
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed mb-6">
            Find highly relevant publishers in your exact niche. We have categorized our premium guest posting sites to help you build contextually powerful backlinks.
          </p>
          <nav className="text-sm text-slate-400 font-medium flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/websites" className="hover:text-white transition-colors">Marketplace</Link>
            <span>/</span>
            <span className="text-white">Categories</span>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORY_SLUGS.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/websites/category/${cat.slug}`}
              className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[hsl(217,91%,54%)] p-6 rounded-xl flex items-center justify-between group transition-all"
            >
              <span className="font-bold text-slate-800 group-hover:text-[hsl(217,91%,54%)] transition-colors">
                {cat.name}
              </span>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-[hsl(217,91%,54%)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
