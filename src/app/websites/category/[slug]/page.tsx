import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { getCategoryNameFromSlug } from '@/lib/seo/categories';
import { CANONICAL_SITE_URL } from '@/lib/constants';
import Pagination from '@/components/websites/Pagination';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await searchParams;
  const categoryName = getCategoryNameFromSlug(slug);

  if (!categoryName) {
    return {
      title: 'Category Not Found',
    };
  }

  const pageNum = typeof page === 'string' ? parseInt(page, 10) : 1;
  const titleSuffix = pageNum > 1 ? ` - Page ${pageNum}` : '';
  
  return {
    title: `${categoryName} Guest Posting Sites & SEO Placements${titleSuffix} | EducationHom`,
    description: `Discover premium ${categoryName} websites accepting guest posts and niche edits. Boost your search rankings with high-quality ${categoryName} backlinks and placements.`,
    alternates: {
      canonical: `${CANONICAL_SITE_URL}/websites/category/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export const revalidate = 3600; // Cache for 1 hour to ensure fast delivery to Googlebot

export default async function CategoryHubPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  const categoryName = getCategoryNameFromSlug(slug);

  if (!categoryName) {
    notFound();
  }

  const supabase = getServiceSupabase();
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : 1;
  const limit = 30; // Increased limit for category hubs to flatten architecture faster
  const offset = (pageNum - 1) * limit;

  let query = supabase
    .from('website_listings')
    .select('id, slug, name, domain, price, currency, short_description, content_placement_price, content_placement_selling_price', { count: 'exact' })
    .eq('status', 'published')
    .eq('is_listed', true)
    .eq('category_id', categoryName);

  let { data: websitesRaw, error, count: filteredCount } = await query
    .order('featured', { ascending: false })
    .range(offset, offset + limit - 1);

  const websites = websitesRaw || [];
  const totalPages = Math.ceil((filteredCount || 0) / limit);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24">
      {/* Category Hero Section */}
      <div className="bg-[hsl(222,47%,7%)] text-white pt-36 pb-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-sm font-semibold text-[hsl(217,91%,54%)] uppercase tracking-wider mb-2">
            SEO Placement Category
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            {categoryName} Guest Posting Sites
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed mb-6">
            Browse our curated list of high-quality {categoryName} websites accepting guest posts, sponsored content, and niche edits. Secure permanent backlinks on authentic {categoryName} publishers to dominate your SERPs.
          </p>
          
          {/* Breadcrumbs for internal linking */}
          <nav className="text-sm text-slate-400 font-medium flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/websites" className="hover:text-white transition-colors">Marketplace</Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {!websites || websites.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Publishers Found</h2>
            <p className="text-slate-500">Check back later as we add new {categoryName} websites.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-slate-500 font-medium">
              Showing {offset + 1}–{Math.min(offset + limit, filteredCount || 0)} of {filteredCount || 0} verified {categoryName} publishers
            </div>
            
            {/* Using a grid to maximize internal links per page above the fold */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {websites.map(site => (
                <Link key={site.id} href={`/websites/${site.slug}`} className="bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-5 flex flex-col group hover:border-[hsl(217,91%,54%)]/50 cursor-pointer">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[hsl(217,91%,54%)] transition-colors line-clamp-1">{site.name}</h3>
                  <div className="text-xs text-slate-500 mb-3">{site.domain}</div>
                  
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                    {site.short_description || `Premium publishing opportunity on ${site.domain}.`}
                  </p>
                  
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-auto">
                    <div className="font-extrabold text-slate-900">
                      {site.content_placement_selling_price ? (
                        <>{site.currency === 'USD' ? '$' : site.currency}{site.content_placement_selling_price}</>
                      ) : (
                        <span className="text-sm text-[hsl(217,91%,54%)]">View details</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        
        {websites && websites.length > 0 && (
          <div className="mt-8">
             <Pagination currentPage={pageNum} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}
