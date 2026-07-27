'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';
import { getPostBySlug, BlogPost } from '@/lib/blogStore';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = getPostBySlug(slug);
    if (found) {
      setPost(found);
      if (typeof document !== 'undefined') {
        document.title = found.metaTitle || `${found.title} | MarketHom Agency`;
      }
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[hsl(217,91%,54%)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[hsl(215,20%,60%)]">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-40 pb-20 text-center container-custom min-h-[60vh] flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">🔍</span>
        <h1 className="text-4xl font-bold mb-4 text-white">Article Not Found</h1>
        <p className="text-[hsl(215,20%,60%)] mb-8 max-w-md">
          The requested article "<span className="text-white">{slug}</span>" could not be located. It may have been renamed or removed.
        </p>
        <Link href="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    );
  }

  const robotsDirective = `${post.noIndex ? 'noindex' : 'index'}, ${post.noFollow ? 'nofollow' : 'follow'}`;

  return (
    <>
      <Head>
        <title>{post.metaTitle || `${post.title} | MarketHom Agency`}</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta name="robots" content={robotsDirective} />
        {post.canonicalUrl && <link rel="canonical" href={post.canonicalUrl} />}
      </Head>

      <article className="pt-40 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.category }]} />
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
               <div className="text-6xl mb-6">{post.icon || '📝'}</div>
               <span className="badge mb-6">{post.category}</span>

               {/* Robots Directive Badge */}
               {(post.noIndex || post.noFollow) && (
                 <div className="mb-4 flex items-center justify-center gap-2">
                   <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-bold">
                     SEO Meta Robots: {robotsDirective}
                   </span>
                 </div>
               )}

               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight text-white">{post.title}</h1>
               
               <div className="flex items-center justify-center gap-6 py-8 border-y border-[hsl(215,25%,22%)]/40">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-[hsl(217,91%,54%)] flex items-center justify-center font-bold text-white">
                        {post.author ? post.author.split(' ').map((n: string) => n[0]).join('') : 'MH'}
                     </div>
                     <div className="text-left">
                        <div className="text-sm font-bold text-white">{post.author}</div>
                        <div className="text-[10px] text-[hsl(215,20%,50%)] uppercase tracking-widest font-bold">
                          {post.authorRole || 'Expert Strategist'}
                        </div>
                     </div>
                  </div>
                  <div className="h-10 w-px bg-[hsl(215,25%,22%)]/40" />
                  <div className="text-left">
                     <div className="text-xs font-bold text-white">{post.date}</div>
                     <div className="text-[10px] text-[hsl(215,20%,50%)] uppercase tracking-widest font-bold">{post.readTime}</div>
                  </div>
               </div>
            </div>

            {/* Featured Cover Banner Image */}
            {post.featuredImage && (
              <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-[hsl(215,25%,22%)] bg-[hsl(222,47%,9%)] p-2">
                <img 
                  src={post.featuredImage} 
                  alt={post.title} 
                  className="w-full h-auto max-h-[600px] object-contain rounded-2xl mx-auto" 
                />
              </div>
            )}

            <div className="prose-dark max-w-none space-y-6" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="mt-16 p-8 glass-card border-[hsl(217,91%,54%)]/20 flex flex-col md:flex-row items-center gap-8">
               <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Want results like these for your business?</h3>
                  <p className="text-sm text-[hsl(215,20%,60%)]">Book a consultation with our agency specialists and start outranking your competitors today.</p>
               </div>
               <Link href="/contact" className="btn-primary whitespace-nowrap">Get Free Audit</Link>
            </div>
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
