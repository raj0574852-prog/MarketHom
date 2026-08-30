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
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
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
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    metaTitle: '10 AI SEO Strategies for 2025 | MarketHom Agency',
    metaDescription: 'Discover the top 10 AI-powered SEO strategies for 2025. Learn how to optimize for SGE, ChatGPT, and semantic topical authority.',
    noIndex: false,
    noFollow: false,
    content: `
      <p className="text-lg leading-relaxed mb-6">The landscape of search is changing faster than ever. With the rise of AI-powered search engines like Google's SGE and Perplexity, traditional SEO tactics are being challenged. To stay ahead in 2025, agencies and brands must embrace AI not just for content creation, but for strategy, analysis, and optimization.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">1. AI-Powered Topical Authority Mapping</h2>
      <p className="mb-6 leading-relaxed">Search engines are moving away from individual keywords and toward entities and topics. AI tools can now analyze the entire "topical universe" of your niche, identifying the exact clusters of content you need to create to be seen as an authority by Google.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">2. Semantic Content Optimization with NLP</h2>
      <p className="mb-6 leading-relaxed">Natural Language Processing (NLP) allows us to understand the latent semantic indexing (LSI) keywords and entities that top-ranking pages share. By optimizing your content for these semantic signals, you increase your chances of ranking significantly.</p>

      <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop" alt="AI SEO Data Visualization" className="rounded-2xl my-8 w-full h-80 object-cover shadow-2xl border border-[hsl(215,25%,22%)]" />

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
      <p className="text-lg leading-relaxed mb-6">Running Google or Meta ads without a rigorous strategy is the fastest way to burn through your marketing budget. Over the past year, our team audited over $5M in ad spend across 100+ accounts. Here are the 7 most frequent (and expensive) mistakes we uncover.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">1. Broad Match Without Negative Keyword Lists</h2>
      <p className="mb-6 leading-relaxed">Broad match keywords can bring in traffic, but without an aggressive, updated list of negative keywords, you will end up paying for irrelevant searches that never convert.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">2. Sending Paid Traffic to Generic Homepages</h2>
      <p className="mb-6 leading-relaxed">Never send ad clicks to your homepage. Dedicated, high-converting landing pages tailored specifically to the ad copy increase conversion rates by up to 300%.</p>
    `
  }
];

const STORAGE_KEY = 'markethom_blog_posts';

export function getStoredPosts(): BlogPost[] {
  if (typeof window === 'undefined') return INITIAL_POSTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data === null) {
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
  const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  let savedPost: BlogPost;

  if (post.id) {
    savedPost = { ...post, id: post.id, date: dateStr, slug } as BlogPost;
    const updated = posts.map(p => (p.id === post.id || p.slug === slug) ? savedPost : p);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } else {
    savedPost = {
      ...post,
      id: 'post-' + Date.now(),
      date: dateStr,
      slug
    };
    const updated = [savedPost, ...posts];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  // Sync with Server API /api/blog
  if (typeof window !== 'undefined') {
    fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedPost)
    }).catch(() => {});
  }

  return savedPost;
}

export function deletePost(id: string): void {
  const posts = getStoredPosts();
  const updated = posts.filter(p => p.id !== id && p.slug !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Sync delete with Server API /api/blog
  if (typeof window !== 'undefined') {
    fetch(`/api/blog?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getStoredPosts();
  const found = posts.find(p => p.slug === slug);
  if (found) return found;
  return INITIAL_POSTS.find(p => p.slug === slug);
}
