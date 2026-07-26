export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole?: string;
  date: string;
  readTime: string;
  icon: string;
  featured?: boolean;
}

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'ai-seo-strategies-2025',
    title: '10 AI SEO Strategies That Will Dominate Search in 2025',
    excerpt: 'Artificial intelligence is reshaping how Google ranks content. Here are the 10 AI-powered SEO strategies that top agencies are using right now.',
    category: 'AI SEO',
    author: 'Alex Rivera',
    authorRole: 'Head of AI Search',
    date: 'Apr 28, 2025',
    readTime: '8 min read',
    icon: '🤖',
    featured: true,
    content: `
      <p className="text-lg leading-relaxed mb-6">The landscape of search is changing faster than ever. With the rise of AI-powered search engines like Google's SGE and Perplexity, traditional SEO tactics are being challenged. To stay ahead in 2025, agencies and brands must embrace AI not just for content creation, but for strategy, analysis, and optimization.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">1. AI-Powered Topical Authority Mapping</h2>
      <p className="mb-6 leading-relaxed">Search engines are moving away from individual keywords and toward entities and topics. AI tools can now analyze the entire "topical universe" of your niche, identifying the exact clusters of content you need to create to be seen as an authority by Google.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">2. Semantic Content Optimization with NLP</h2>
      <p className="mb-6 leading-relaxed">Natural Language Processing (NLP) allows us to understand the latent semantic indexing (LSI) keywords and entities that top-ranking pages share. By optimizing your content for these semantic signals, you increase your chances of ranking significantly.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">3. Automated Technical SEO Monitoring</h2>
      <p className="mb-6 leading-relaxed">AI can now monitor your site 24/7 for technical issues like broken links, crawl errors, and Core Web Vital drops, fixing them automatically or alerting your team before they impact rankings.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">4. User Intent Analysis at Scale</h2>
      <p className="mb-6 leading-relaxed">AI models can categorize thousands of keywords by intent (Informational, Navigational, Transactional, Commercial) in seconds, allowing you to map content perfectly to every stage of the buyer's journey.</p>
    `
  },
  {
    id: '2',
    slug: 'ppc-mistakes-killing-roi',
    title: '7 PPC Mistakes That Are Silently Killing Your ROI',
    excerpt: 'Most businesses are flushing 40-60% of their ad budget down the drain. Discover the seven most common PPC mistakes and how to fix them.',
    category: 'PPC',
    author: 'Priya Sharma',
    authorRole: 'PPC Lead',
    date: 'Apr 21, 2025',
    readTime: '6 min read',
    icon: '💰',
    featured: false,
    content: `
      <p className="text-lg leading-relaxed mb-6">PPC campaigns require constant monitoring and precision targeting. A single negative keyword oversight can cost thousands in wasted ad spend.</p>
      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">The Danger of Broad Match Without Negatives</h2>
      <p className="mb-6 leading-relaxed">Broad match can drive impression volume, but without an aggressive negative keyword list, you will pay for unqualified clicks. Always pair broad match with smart bidding and robust negative lists.</p>
    `
  },
  {
    id: '3',
    slug: 'local-seo-guide-2025',
    title: 'The Ultimate Local SEO Guide for 2025: Rank #1 in Your City',
    excerpt: 'Local search has never been more competitive. This comprehensive guide walks you through every step to dominate local search results.',
    category: 'Local SEO',
    author: 'Marcus Chen',
    authorRole: 'Local Search Lead',
    date: 'Apr 14, 2025',
    readTime: '12 min read',
    icon: '📍',
    featured: false,
    content: `
      <p className="text-lg leading-relaxed mb-6">Dominating local search means optimizing your Google Business Profile, accumulating high-quality local reviews, and building geo-targeted citations.</p>
    `
  },
  {
    id: '4',
    slug: 'future-of-link-building',
    title: 'The Future of Link Building: Beyond Guest Posting',
    excerpt: 'Digital PR and brand mentions are the new backlinks. Learn how to build a natural link profile that Google loves.',
    category: 'Link Building',
    author: 'Sofia Laurent',
    authorRole: 'Digital PR Director',
    date: 'Apr 07, 2025',
    readTime: '10 min read',
    icon: '🔗',
    featured: false,
    content: `
      <p className="text-lg leading-relaxed mb-6">Traditional guest posts are losing impact. Today's search engines value earned editorial links from authoritative news outlets and industry publications.</p>
    `
  },
  {
    id: '5',
    slug: 'nextjs-for-seo',
    title: 'Why Next.js is the Best Framework for SEO in 2025',
    excerpt: 'Performance is a ranking factor. Discover why Next.js is the preferred choice for high-performance, SEO-first websites.',
    category: 'Web Dev',
    author: 'James O\'Brien',
    authorRole: 'Technical Lead',
    date: 'Mar 31, 2025',
    readTime: '7 min read',
    icon: '⚛️',
    featured: false,
    content: `
      <p className="text-lg leading-relaxed mb-6">Server-Side Rendering (SSR) and Static Site Generation (SSG) in Next.js give search engine crawlers instant access to fully rendered HTML, boosting indexing speed and Core Web Vitals score.</p>
    `
  },
  {
    id: '6',
    slug: 'conversion-rate-optimization-tips',
    title: '15 CRO Tips to Double Your Website Conversions',
    excerpt: 'Traffic is vanity, conversions are sanity. Use these 15 tested tips to turn more of your visitors into paying customers.',
    category: 'CRO',
    author: 'Aisha Patel',
    authorRole: 'CRO Specialist',
    date: 'Mar 24, 2025',
    readTime: '9 min read',
    icon: '📈',
    featured: false,
    content: `
      <p className="text-lg leading-relaxed mb-6">Optimizing your call to action, shortening friction points in forms, and displaying social proof can dramatically increase your landing page conversion rates.</p>
    `
  }
];

const STORAGE_KEY = 'markethom_blog_posts';

export function getStoredPosts(): BlogPost[] {
  if (typeof window === 'undefined') return INITIAL_POSTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading blog posts from storage:', e);
    return INITIAL_POSTS;
  }
}

export function savePost(post: Omit<BlogPost, 'id'> & { id?: string }): BlogPost {
  const posts = getStoredPosts();
  const dateStr = post.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  
  if (post.id) {
    // Update existing
    const updated = posts.map(p => p.id === post.id ? { ...p, ...post, date: dateStr } : p);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return { ...post, id: post.id, date: dateStr } as BlogPost;
  } else {
    // Create new
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      date: dateStr,
    };
    const updated = [newPost, ...posts];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return newPost;
  }
}

export function deletePost(id: string): void {
  const posts = getStoredPosts();
  const updated = posts.filter(p => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getStoredPosts();
  return posts.find(p => p.slug === slug);
}
