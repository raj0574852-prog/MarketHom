import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

// In a real app, you'd fetch this from a CMS
const postsData: Record<string, any> = {
  'ai-seo-strategies-2025': {
    title: '10 AI SEO Strategies That Will Dominate Search in 2025',
    category: 'AI SEO',
    date: 'April 28, 2025',
    readTime: '8 min read',
    author: 'Alex Rivera',
    content: `
      <p>The landscape of search is changing faster than ever. With the rise of AI-powered search engines like Google's SGE and Perplexity, traditional SEO tactics are being challenged. To stay ahead in 2025, agencies and brands must embrace AI not just for content creation, but for strategy, analysis, and optimization.</p>
      
      <h2>1. AI-Powered Topical Authority Mapping</h2>
      <p>Search engines are moving away from individual keywords and toward entities and topics. AI tools can now analyze the entire "topical universe" of your niche, identifying the exact clusters of content you need to create to be seen as an authority by Google.</p>
      
      <h2>2. Semantic Content Optimization with NLP</h2>
      <p>Natural Language Processing (NLP) allows us to understand the latent semantic indexing (LSI) keywords and entities that top-ranking pages share. By optimizing your content for these semantic signals, you increase your chances of ranking significantly.</p>
      
      <h2>3. Automated Technical SEO Monitoring</h2>
      <p>AI can now monitor your site 24/7 for technical issues like broken links, crawl errors, and Core Web Vital drops, fixing them automatically or alerting your team before they impact rankings.</p>
      
      <h2>4. User Intent Analysis at Scale</h2>
      <p>AI models can categorize thousands of keywords by intent (Informational, Navigational, Transactional, Commercial) in seconds, allowing you to map content perfectly to every stage of the buyer's journey.</p>
    `
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postsData[slug];
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | MarketHom Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = postsData[slug];

  if (!post) {
    // For demo purposes, we'll just show the first post if not found, 
    // but in a real app we'd use notFound()
    // notFound();
    return (
      <div className="pt-40 pb-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Demo: Blog Post Template</h1>
        <p className="text-[hsl(215,20%,60%)] mb-8">This is a dynamic route. Try /blog/ai-seo-strategies-2025</p>
        <Link href="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <article className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.category }]} />
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
               <span className="badge mb-6">{post.category}</span>
               <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-white">{post.title}</h1>
               
               <div className="flex items-center justify-center gap-6 py-8 border-y border-[hsl(215,25%,22%)]/40">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-[hsl(217,91%,54%)] flex items-center justify-center font-bold text-white">
                        {post.author.split(' ').map((n: string) => n[0]).join('')}
                     </div>
                     <div className="text-left">
                        <div className="text-sm font-bold text-white">{post.author}</div>
                        <div className="text-[10px] text-[hsl(215,20%,50%)] uppercase tracking-widest font-bold">Expert Strategist</div>
                     </div>
                  </div>
                  <div className="h-10 w-px bg-[hsl(215,25%,22%)]/40" />
                  <div className="text-left">
                     <div className="text-xs font-bold text-white">{post.date}</div>
                     <div className="text-[10px] text-[hsl(215,20%,50%)] uppercase tracking-widest font-bold">{post.readTime}</div>
                  </div>
               </div>
            </div>

            <div className="prose-dark max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="mt-16 p-8 glass-card border-[hsl(217,91%,54%)]/20 flex flex-col md:flex-row items-center gap-8">
               <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Want results like these?</h3>
                  <p className="text-sm text-[hsl(215,20%,60%)]">Download our full 2025 AI SEO Strategy Guide for free and learn how to outrank your competitors in weeks.</p>
               </div>
               <Link href="/contact" className="btn-primary whitespace-nowrap">Get My Free Audit</Link>
            </div>
          </div>
        </div>
      </article>

      <section className="section-padding bg-[hsl(222,47%,5%)]">
        <div className="container-custom">
           <h2 className="text-3xl font-black mb-8">Related <span className="gradient-text">Insights</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
              <div className="glass-card p-6 h-32"></div>
              <div className="glass-card p-6 h-32"></div>
              <div className="glass-card p-6 h-32"></div>
           </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
