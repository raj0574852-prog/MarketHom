'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getStoredPosts, 
  savePost, 
  deletePost, 
  BlogPost 
} from '@/lib/blogStore';
import { 
  getServices, 
  saveService, 
  deleteService, 
  getLeads, 
  updateLeadStatus, 
  SiteService, 
  LeadInquiry 
} from '@/lib/resourcesStore';

const PRESET_COVER_IMAGES = [
  { label: '🤖 AI & Tech', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop' },
  { label: '📈 Marketing Growth', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop' },
  { label: '📍 SEO & Search', url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=1200&auto=format&fit=crop' },
  { label: '💻 Web Development', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop' },
  { label: '💰 PPC Advertising', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop' },
  { label: '🔗 Link Building', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop' }
];

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'dashboard' | 'publish' | 'articles' | 'resources' | 'leads'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'publish' | 'articles' | 'resources' | 'leads'>('dashboard');

  // Data states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<SiteService[]>([]);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);

  // Search & Filter
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Article Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formCategory, setFormCategory] = useState('AI SEO');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formAuthor, setFormAuthor] = useState('Admin Editor');
  const [formAuthorRole, setFormAuthorRole] = useState('Senior Strategist');
  const [formReadTime, setFormReadTime] = useState('5 min read');
  const [formIcon, setFormIcon] = useState('🚀');
  const [formFeaturedImage, setFormFeaturedImage] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [editorMode, setEditorMode] = useState<'html' | 'plain' | 'preview'>('html');

  // SEO Form State
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDescription, setFormMetaDescription] = useState('');
  const [formNoIndex, setFormNoIndex] = useState(false);
  const [formNoFollow, setFormNoFollow] = useState(false);
  const [formCanonicalUrl, setFormCanonicalUrl] = useState('');

  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');

  // Service Form State
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('SEO');
  const [servicePrice, setServicePrice] = useState('$1,500 - $3,500/mo');
  const [serviceDesc, setServiceDesc] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('markethom_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    loadData();

    // Real-time polling for new client lead inquiries & blog posts every 4 seconds
    const interval = setInterval(() => {
      fetchLeadsFromApi();
      fetchPostsFromApi();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setPosts(getStoredPosts());
    setServices(getServices());
    setLeads(getLeads());
    fetchLeadsFromApi();
    fetchPostsFromApi();
  };

  const fetchPostsFromApi = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
          if (typeof window !== 'undefined') {
            localStorage.setItem('markethom_blog_posts', JSON.stringify(data.posts));
          }
        }
      }
    } catch (err) {}
  };

  const fetchLeadsFromApi = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        if (data.leads && Array.isArray(data.leads)) {
          // Merge local and server leads by ID
          const localLeads = getLeads();
          const mergedMap = new Map<string, LeadInquiry>();
          data.leads.forEach((l: LeadInquiry) => mergedMap.set(l.id, l));
          localLeads.forEach((l: LeadInquiry) => {
            if (!mergedMap.has(l.id)) mergedMap.set(l.id, l);
          });
          const mergedList = Array.from(mergedMap.values());
          setLeads(mergedList);
          if (typeof window !== 'undefined') {
            localStorage.setItem('markethom_leads', JSON.stringify(mergedList));
          }
        }
      }
    } catch (err) {
      // fallback to local leads
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'Rajjesh@123') {
      setIsAuthenticated(true);
      localStorage.setItem('markethom_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid admin password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('markethom_admin_auth');
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingPostId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(generatedSlug);
      if (!formMetaTitle) {
        setFormMetaTitle(`${val} | MarketHom`);
      }
    }
  };

  const autoFormatPlainTextToHTML = () => {
    if (!formContent.trim()) return;

    if (formContent.includes('<p>') || formContent.includes('<h2>')) {
      alert('Content is already formatted with HTML tags!');
      return;
    }

    const lines = formContent.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const formattedBlocks: string[] = [];

    lines.forEach((line) => {
      const isHeadingPattern = /^(Why|What|How|The|1\.|2\.|3\.|4\.|5\.|6\.|7\.|8\.|9\.|10\.|Step|Guide)/i.test(line) && line.length < 80;
      const isShortHeading = line.length < 60 && !line.endsWith('.') && !line.endsWith(',');

      if (isHeadingPattern || isShortHeading) {
        formattedBlocks.push(`<h2>${line.replace(/^[0-9]+\.\s*/, '')}</h2>`);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        formattedBlocks.push(`<ul><li>${line.substring(2)}</li></ul>`);
      } else {
        formattedBlocks.push(`<p>${line}</p>`);
      }
    });

    setFormContent(formattedBlocks.join('\n\n'));
  };

  const generateAIPrompt = () => {
    const topic = formTitle || 'Digital Marketing Strategy 2026';
    const cat = formCategory === 'Custom' ? (formCustomCategory || 'Marketing') : formCategory;
    const promptText = `Write a comprehensive, expert-level 1,500-word article on "${topic}" under the category "${cat}".
Optimized for:
1. Google SEO (Topical authority, semantic LSI keywords, structured H2/H3 headings).
2. Answer Engine Optimization (AEO - Perplexity/Google AI Overviews direct answer blocks).
3. Generative Engine Optimization (GEO - ChatGPT/Claude citations with industry statistics).
4. Tone: 100% Expert Human, actionable, and engaging without robotic AI cliches.

Include:
- Clear <h2> headings
- Actionable bulleted lists <ul><li>...</li></ul>
- Direct summary paragraphs <p>...</p>`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(promptText);
      alert('🤖 AI Content Prompt copied to clipboard! Paste into ChatGPT or Claude to generate your article instantly.');
    } else {
      prompt('Copy this AI Prompt for ChatGPT:', promptText);
    }
  };

  const exportArticlesJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `markethom_articles_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Calculate Live Content Metrics
  const cleanText = formContent.replace(/<[^>]*>/g, '').trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = cleanText.length;
  const headingCount = (formContent.match(/<h[23]/gi) || []).length;

  // Live SEO Quality Score Calculation
  let seoScore = 0;
  if (formTitle.length >= 25 && formTitle.length <= 75) seoScore += 25;
  if (formMetaDescription.length >= 80 && formMetaDescription.length <= 170) seoScore += 25;
  if (formExcerpt.trim().length >= 20) seoScore += 15;
  if (formFeaturedImage) seoScore += 15;
  if (headingCount >= 2) seoScore += 20;

  const insertTag = (tag: string) => {
    if (tag === 'h2') {
      setFormContent(prev => prev + '\n\n<h2>Section Heading</h2>\n<p>Write section text here...</p>');
    } else if (tag === 'h3') {
      setFormContent(prev => prev + '\n\n<h3>Sub-heading</h3>');
    } else if (tag === 'p') {
      setFormContent(prev => prev + '\n\n<p>Write paragraph text here...</p>');
    } else if (tag === 'bold') {
      setFormContent(prev => prev + ' <strong>bold text</strong> ');
    } else if (tag === 'ul') {
      setFormContent(prev => prev + '\n\n<ul>\n  <li>Key point 1</li>\n  <li>Key point 2</li>\n  <li>Key point 3</li>\n</ul>');
    } else if (tag === 'link') {
      const url = prompt('Enter Hyperlink Target URL:', 'https://educationhom.com');
      if (url) {
        const text = prompt('Enter Clickable Anchor Text:', 'Click Here');
        if (text) {
          setFormContent(prev => prev + ` <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[hsl(217,91%,70%)] underline font-bold hover:text-white transition-colors">${text}</a> `);
        }
      }
    } else if (tag === 'img') {
      const url = prompt('Enter Image URL (or select from presets):', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200');
      if (url) {
        setFormContent(prev => prev + `\n\n<img src="${url}" alt="Article Image" class="rounded-2xl my-8 w-full h-80 object-cover shadow-2xl border border-[hsl(215,25%,22%)]" />\n\n`);
      }
    }
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) {
      alert('Please fill out the article title and content.');
      return;
    }

    const categoryToUse = formCategory === 'Custom' ? (formCustomCategory || 'General') : formCategory;

    let finalContent = formContent;
    if (!finalContent.includes('<p>') && !finalContent.includes('<h2>') && !finalContent.includes('<div>')) {
      finalContent = finalContent
        .split(/\n\n+/)
        .map(p => `<p>${p.trim()}</p>`)
        .join('\n\n');
    }

    const newPostData = {
      id: editingPostId || undefined,
      title: formTitle,
      slug: formSlug || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: formExcerpt || formTitle,
      category: categoryToUse,
      author: formAuthor,
      authorRole: formAuthorRole,
      readTime: formReadTime,
      icon: formIcon,
      featuredImage: formFeaturedImage,
      content: finalContent,
      featured: formFeatured,
      metaTitle: formMetaTitle || formTitle,
      metaDescription: formMetaDescription || formExcerpt,
      noIndex: formNoIndex,
      noFollow: formNoFollow,
      canonicalUrl: formCanonicalUrl,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    const saved = savePost(newPostData);

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saved)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
          if (typeof window !== 'undefined') {
            localStorage.setItem('markethom_blog_posts', JSON.stringify(data.posts));
          }
        }
      }
    } catch (err) {}

    setPublishSuccessMsg(editingPostId ? 'Article updated successfully!' : '🎉 Article published live to the Blog section!');
    loadData();

    setTimeout(() => {
      setPublishSuccessMsg('');
      if (!editingPostId) {
        resetArticleForm();
      }
    }, 2000);
  };

  const resetArticleForm = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormSlug('');
    setFormExcerpt('');
    setFormCategory('AI SEO');
    setFormCustomCategory('');
    setFormContent('');
    setFormIcon('🚀');
    setFormFeaturedImage('');
    setFormFeatured(false);
    setFormMetaTitle('');
    setFormMetaDescription('');
    setFormNoIndex(false);
    setFormNoFollow(false);
    setFormCanonicalUrl('');
  };

  const startEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormCategory(post.category);
    setFormAuthor(post.author);
    setFormAuthorRole(post.authorRole || 'Senior Strategist');
    setFormReadTime(post.readTime);
    setFormIcon(post.icon || '🚀');
    setFormFeaturedImage(post.featuredImage || '');
    setFormContent(post.content);
    setFormFeatured(!!post.featured);
    setFormMetaTitle(post.metaTitle || post.title);
    setFormMetaDescription(post.metaDescription || post.excerpt);
    setFormNoIndex(!!post.noIndex);
    setFormNoFollow(!!post.noFollow);
    setFormCanonicalUrl(post.canonicalUrl || '');
    setActiveTab('publish');
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deletePost(id);
      // Immediately filter local state
      setPosts(prev => prev.filter(p => p.id !== id && p.slug !== id));
      try {
        const res = await fetch(`/api/blog?id=${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          const data = await res.json();
          if (data.posts && Array.isArray(data.posts)) {
            setPosts(data.posts);
            if (typeof window !== 'undefined') {
              localStorage.setItem('markethom_blog_posts', JSON.stringify(data.posts));
            }
          }
        }
      } catch (err) {}
      loadData();
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName) return;
    saveService({
      name: serviceName,
      category: serviceCategory,
      priceRange: servicePrice,
      description: serviceDesc,
      status: 'Active'
    });
    setServiceName('');
    setServiceDesc('');
    loadData();
  };

  const handleDeleteServiceItem = (id: string) => {
    deleteService(id);
    loadData();
  };

  const handleUpdateLead = (id: string, status: LeadInquiry['status']) => {
    updateLeadStatus(id, status);
    loadData();
  };

  const filteredArticles = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(articleSearch.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(articleSearch.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || post.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[hsl(222,47%,5%)] text-white flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md glass-card p-8 border border-[hsl(217,91%,54%)]/30 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(217,91%,54%)]/10 rounded-full blur-3xl" />
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[hsl(217,91%,54%)] to-[hsl(270,91%,65%)] flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-lg shadow-[hsl(217,91%,54%)]/30">
              M
            </div>
            <h1 className="text-3xl font-black text-white mb-2">MarketHom Admin</h1>
            <p className="text-xs text-[hsl(215,20%,60%)]">Control Panel & Content Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Admin Password</label>
              <input 
                type="password" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin password" 
                className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)] text-sm transition-all"
                required
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-medium text-center">{loginError}</p>
            )}

            <button type="submit" className="w-full btn-primary py-3 justify-center text-sm font-bold shadow-lg shadow-[hsl(217,91%,54%)]/20">
              Access Admin Panel →
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(222,47%,5%)] text-white pt-24 pb-16">
      <div className="container-custom">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-[hsl(215,25%,22%)]/60">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Admin Online</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">
              Website <span className="gradient-text">Control Panel</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="px-4 py-2 rounded-xl border border-[hsl(215,25%,22%)] text-xs font-semibold hover:border-[hsl(217,91%,54%)] transition-all">
              🌐 View Live Site
            </Link>
            <Link href="/blog" target="_blank" className="px-4 py-2 rounded-xl border border-[hsl(215,25%,22%)] text-xs font-semibold hover:border-[hsl(217,91%,54%)] transition-all">
              📚 View Blog Section
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all">
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-[hsl(222,47%,8%)] border border-[hsl(215,25%,18%)] rounded-2xl">
          {[
            { id: 'dashboard', label: '📊 Dashboard Overview' },
            { id: 'publish', label: editingPostId ? '✏️ Edit Article' : '✍️ Publish Article' },
            { id: 'articles', label: `📚 Manage Articles (${posts.length})` },
            { id: 'resources', label: `🛠️ Site Services (${services.length})` },
            { id: 'leads', label: `📬 Client Leads (${leads.filter(l => l.status === 'New').length} New)` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[hsl(217,91%,54%)] text-white shadow-lg shadow-[hsl(217,91%,54%)]/25'
                  : 'text-[hsl(215,20%,60%)] hover:text-white hover:bg-[hsl(222,47%,12%)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 border-l-4 border-l-[hsl(217,91%,54%)]">
                <div className="text-xs font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider mb-1">Published Articles</div>
                <div className="text-3xl font-black text-white">{posts.length}</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-2">Active on /blog</div>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-purple-500">
                <div className="text-xs font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider mb-1">Active Services</div>
                <div className="text-3xl font-black text-white">{services.length}</div>
                <div className="text-[10px] text-purple-400 font-semibold mt-2">Managed Services</div>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-amber-500">
                <div className="text-xs font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider mb-1">Total Inbound Leads</div>
                <div className="text-3xl font-black text-white">{leads.length}</div>
                <div className="text-[10px] text-amber-400 font-semibold mt-2">{leads.filter(l => l.status === 'New').length} Requires Action</div>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-cyan-500">
                <div className="text-xs font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider mb-1">Website Status</div>
                <div className="text-3xl font-black text-emerald-400">Live</div>
                <div className="text-[10px] text-cyan-400 font-semibold mt-2">Vercel Auto-Sync Enabled</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Recent Published Articles</h3>
                  <button onClick={() => { resetArticleForm(); setActiveTab('publish'); }} className="text-xs text-[hsl(217,91%,70%)] hover:underline font-semibold">
                    + Publish New
                  </button>
                </div>

                <div className="space-y-4">
                  {posts.slice(0, 4).map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 rounded-xl bg-[hsl(222,47%,8%)] border border-[hsl(215,25%,18%)] hover:border-[hsl(217,91%,54%)]/40 transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{post.icon || '📝'}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white line-clamp-1">{post.title}</h4>
                          <div className="flex items-center gap-3 text-[10px] text-[hsl(215,20%,50%)] mt-1">
                            <span className="text-[hsl(217,91%,70%)] font-semibold">{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.author}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEditPost(post)} className="px-3 py-1.5 rounded-lg bg-[hsl(215,25%,20%)] text-[10px] font-bold text-white hover:bg-[hsl(217,91%,54%)] transition-colors">
                          Edit
                        </button>
                        <Link href={`/blog/${post.slug}`} target="_blank" className="px-3 py-1.5 rounded-lg border border-[hsl(215,25%,22%)] text-[10px] font-bold text-[hsl(215,20%,60%)] hover:text-white transition-colors">
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-6">Latest Audit Inquiries</h3>
                <div className="space-y-4">
                  {leads.map(lead => (
                    <div key={lead.id} className="p-4 rounded-xl bg-[hsl(222,47%,8%)] border border-[hsl(215,25%,18%)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{lead.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          lead.status === 'New' ? 'bg-amber-500/20 text-amber-300' :
                          lead.status === 'Contacted' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(215,20%,60%)] mb-2">{lead.email}</p>
                      <div className="text-[10px] text-[hsl(215,20%,40%)] flex justify-between">
                        <span>{lead.serviceRequested}</span>
                        <span>{lead.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PUBLISH / EDIT ARTICLE */}
        {activeTab === 'publish' && (
          <div className="glass-card p-8 border border-[hsl(217,91%,54%)]/20 space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[hsl(215,25%,22%)]/40">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingPostId ? 'Edit Blog Article' : 'Publish New Article to Blog'}
                </h2>
                <p className="text-xs text-[hsl(215,20%,60%)] mt-1">
                  Articles published here immediately post to the live <span className="text-white font-semibold">/blog</span> and <span className="text-white font-semibold">/blog/[slug]</span> routes.
                </p>
              </div>

              {editingPostId && (
                <button onClick={resetArticleForm} className="px-4 py-2 rounded-xl bg-[hsl(215,25%,20%)] text-xs font-bold text-white hover:bg-[hsl(215,25%,30%)] transition-all">
                  + Switch to New Article
                </button>
              )}
            </div>

            {publishSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold text-center animate-bounce">
                {publishSuccessMsg}
              </div>
            )}

            <form onSubmit={handlePublishPost} className="space-y-8">
              {/* SECTION 1: ARTICLE ESSENTIALS */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-[hsl(217,91%,70%)] uppercase tracking-widest flex items-center gap-2">
                  <span>📝</span> Article Details & Title
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Article Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. 10 AI SEO Strategies That Will Dominate Search in 2026"
                      className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)] text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">URL Slug</label>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="ai-seo-strategies-2026"
                      className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)] text-sm font-mono text-xs"
                      required
                    />
                  </div>
                </div>

                {/* DEDICATED FEATURED BANNER & IMAGE SELECTOR SECTION */}
                <div className="p-6 rounded-2xl bg-[hsl(222,47%,8%)] border border-[hsl(217,91%,54%)]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[hsl(217,91%,70%)] uppercase tracking-wider">
                      🖼️ Featured Banner Cover Image
                    </label>
                    <span className="text-[10px] text-[hsl(215,20%,50%)]">Single-click preset picker or custom URL</span>
                  </div>

                  <input
                    type="text"
                    value={formFeaturedImage}
                    onChange={(e) => setFormFeaturedImage(e.target.value)}
                    placeholder="Enter custom image URL (e.g. https://images.unsplash.com/...)"
                    className="w-full px-4 py-3 bg-[hsl(222,47%,10%)] border border-[hsl(215,25%,22%)] rounded-xl text-white placeholder-[hsl(215,20%,40%)] text-xs font-mono"
                  />

                  {/* 1-CLICK QUICK IMAGE PRESETS */}
                  <div>
                    <span className="block text-[10px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider mb-2">
                      ⚡ Quick 1-Click Cover Image Presets:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COVER_IMAGES.map((img) => (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => setFormFeaturedImage(img.url)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            formFeaturedImage === img.url
                              ? 'bg-[hsl(217,91%,54%)] border-[hsl(217,91%,54%)] text-white shadow-md'
                              : 'bg-[hsl(222,47%,12%)] border-[hsl(215,25%,22%)] text-[hsl(215,20%,60%)] hover:text-white hover:border-[hsl(217,91%,54%)]'
                          }`}
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LIVE IMAGE PREVIEW CARD */}
                  {formFeaturedImage ? (
                    <div className="relative h-40 w-full rounded-xl overflow-hidden border border-[hsl(217,91%,54%)]/40 bg-black/40">
                      <img src={formFeaturedImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          Banner Ready
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormFeaturedImage('')}
                          className="px-2.5 py-1 rounded bg-red-500/80 text-white text-[10px] font-bold hover:bg-red-600 transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-[hsl(215,25%,25%)] text-center text-xs text-[hsl(215,20%,50%)]">
                      📷 Select a preset image above or paste your custom image link
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white focus:outline-none focus:border-[hsl(217,91%,54%)] text-sm"
                    >
                      <option value="AI SEO">AI SEO</option>
                      <option value="SEO">SEO</option>
                      <option value="PPC">PPC</option>
                      <option value="Web Dev">Web Dev</option>
                      <option value="Link Building">Link Building</option>
                      <option value="CRO">CRO</option>
                      <option value="Local SEO">Local SEO</option>
                      <option value="Custom">Custom...</option>
                    </select>
                  </div>

                  {formCategory === 'Custom' && (
                    <div>
                      <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Custom Category</label>
                      <input
                        type="text"
                        value={formCustomCategory}
                        onChange={(e) => setFormCustomCategory(e.target.value)}
                        placeholder="e.g. Social Media"
                        className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Author Name</label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Read Time & Icon</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formReadTime}
                        onChange={(e) => setFormReadTime(e.target.value)}
                        placeholder="6 min read"
                        className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-sm"
                      />
                      <input
                        type="text"
                        value={formIcon}
                        onChange={(e) => setFormIcon(e.target.value)}
                        placeholder="🚀"
                        className="w-16 px-2 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-center text-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Short Excerpt</label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence summary of the article..."
                    className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)] text-sm"
                  />
                </div>

                {/* LIVE SEO SCORE & AI PROMPT TOOLBAR */}
                <div className="p-4 rounded-xl bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider">SEO Score:</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono ${
                        seoScore >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        seoScore >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {seoScore} / 100%
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-[hsl(215,20%,60%)]">
                      <span><strong>{wordCount}</strong> Words</span>
                      <span>•</span>
                      <span><strong>{charCount}</strong> Chars</span>
                      <span>•</span>
                      <span><strong>{headingCount}</strong> Headings</span>
                      <span>•</span>
                      <span className="text-[hsl(217,91%,70%)] font-bold">{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={generateAIPrompt}
                    className="px-3.5 py-1.5 rounded-lg bg-[hsl(217,91%,54%)]/20 text-[hsl(217,91%,70%)] border border-[hsl(217,91%,54%)]/40 text-xs font-bold hover:bg-[hsl(217,91%,54%)]/30 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>🤖 Copy AI Content Prompt</span>
                  </button>
                </div>

                {/* ARTICLE CONTENT WITH HTML CODE / PLAIN TEXT MODE & HYPERLINK TOOLBAR */}
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider">Article Content</label>
                      {/* Editor Mode Selector */}
                      <div className="flex items-center gap-1 p-1 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-lg text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setEditorMode('html')}
                          className={`px-3 py-1 rounded-md transition-all ${
                            editorMode === 'html' ? 'bg-[hsl(217,91%,54%)] text-white' : 'text-[hsl(215,20%,60%)] hover:text-white'
                          }`}
                        >
                          💻 Direct HTML Code Mode
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorMode('plain')}
                          className={`px-3 py-1 rounded-md transition-all ${
                            editorMode === 'plain' ? 'bg-[hsl(217,91%,54%)] text-white' : 'text-[hsl(215,20%,60%)] hover:text-white'
                          }`}
                        >
                          📄 Sample / Plain Text Mode
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorMode('preview')}
                          className={`px-3 py-1 rounded-md transition-all ${
                            editorMode === 'preview' ? 'bg-purple-600 text-white' : 'text-[hsl(215,20%,60%)] hover:text-white'
                          }`}
                        >
                          👁️ Live Article Preview
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {editorMode === 'plain' && (
                        <button
                          type="button"
                          onClick={autoFormatPlainTextToHTML}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                          title="Click to automatically convert plain text into clean HTML paragraphs and headings!"
                        >
                          <span>✨ Auto-Format Plain Text to HTML</span>
                        </button>
                      )}

                      {editorMode !== 'preview' && (
                        <div className="flex items-center gap-1 bg-[hsl(222,47%,9%)] p-1 rounded-lg border border-[hsl(215,25%,22%)] text-[11px]">
                          <button type="button" onClick={() => insertTag('h2')} className="px-2 py-0.5 rounded text-[hsl(215,20%,70%)] hover:text-white hover:bg-[hsl(215,25%,20%)] font-bold">
                            + H2
                          </button>
                          <button type="button" onClick={() => insertTag('h3')} className="px-2 py-0.5 rounded text-[hsl(215,20%,70%)] hover:text-white hover:bg-[hsl(215,25%,20%)] font-bold">
                            + H3
                          </button>
                          <button type="button" onClick={() => insertTag('p')} className="px-2 py-0.5 rounded text-[hsl(215,20%,70%)] hover:text-white hover:bg-[hsl(215,25%,20%)] font-bold">
                            + Para
                          </button>
                          <button type="button" onClick={() => insertTag('bold')} className="px-2 py-0.5 rounded text-[hsl(215,20%,70%)] hover:text-white hover:bg-[hsl(215,25%,20%)] font-bold">
                            + Bold
                          </button>
                          <button type="button" onClick={() => insertTag('link')} className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 font-bold border border-cyan-500/30">
                            🔗 + Add Link
                          </button>
                          <button type="button" onClick={() => insertTag('ul')} className="px-2 py-0.5 rounded text-[hsl(215,20%,70%)] hover:text-white hover:bg-[hsl(215,25%,20%)] font-bold">
                            + List
                          </button>
                          <button type="button" onClick={() => insertTag('img')} className="px-2 py-0.5 rounded bg-[hsl(217,91%,54%)]/20 text-[hsl(217,91%,70%)] hover:bg-[hsl(217,91%,54%)]/40 font-bold">
                            🖼️ + Image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-[hsl(215,20%,50%)] mb-2">
                    💡 <span className="text-white font-semibold">Tip:</span> Use <span className="text-cyan-300 font-bold">"🔗 + Add Link"</span> to add clickable hyperlinks to any URL, or switch to <span className="text-purple-400 font-bold">"👁️ Live Article Preview"</span> to check how it looks!
                  </p>

                  {editorMode === 'preview' ? (
                    <div className="w-full p-6 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl min-h-[300px]">
                      <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Live Rendered Article Preview</div>
                      <div className="prose-dark max-w-none space-y-4" dangerouslySetInnerHTML={{ __html: formContent || '<p className="text-[hsl(215,20%,50%)] italic">No content written yet. Switch back to HTML or Plain Text mode to type your article...</p>' }} />
                    </div>
                  ) : (
                    <textarea
                      rows={13}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder={
                        editorMode === 'plain'
                          ? "Paste plain text here (e.g. paragraph 1\n\nSection Heading\n\nparagraph 2), then click '✨ Auto-Format Plain Text'..."
                          : "Write or paste full HTML code here (e.g. <h2>Title</h2><p>Content with <a href='https://...'>Hyperlink</a>...</p>)..."
                      }
                      className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white font-mono text-sm placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)] leading-relaxed"
                      required
                    />
                  )}
                </div>
              </div>

              {/* SECTION 2: ADVANCED SEO CONTROLS */}
              <div className="p-6 rounded-2xl bg-[hsl(222,47%,7%)] border border-[hsl(217,91%,54%)]/30 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[hsl(217,91%,70%)] uppercase tracking-widest flex items-center gap-2">
                    <span>🔍</span> Advanced Search Engine Optimization (SEO)
                  </h3>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[hsl(217,91%,54%)]/20 text-[hsl(217,91%,70%)] font-bold">Google & Meta Tags</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider">Meta Title</label>
                      <span className={`text-[10px] font-mono ${formMetaTitle.length > 60 ? 'text-amber-400' : 'text-[hsl(215,20%,50%)]'}`}>
                        {formMetaTitle.length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formMetaTitle}
                      onChange={(e) => setFormMetaTitle(e.target.value)}
                      placeholder="Custom SEO Title for Google (defaults to title)"
                      className="w-full px-4 py-2.5 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-xs placeholder-[hsl(215,20%,40%)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Canonical URL</label>
                    <input
                      type="text"
                      value={formCanonicalUrl}
                      onChange={(e) => setFormCanonicalUrl(e.target.value)}
                      placeholder="https://educationhom.com/blog/custom-canonical"
                      className="w-full px-4 py-2.5 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-xs font-mono placeholder-[hsl(215,20%,40%)]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider">Meta Description</label>
                    <span className={`text-[10px] font-mono ${formMetaDescription.length > 160 ? 'text-amber-400' : 'text-[hsl(215,20%,50%)]'}`}>
                      {formMetaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formMetaDescription}
                    onChange={(e) => setFormMetaDescription(e.target.value)}
                    placeholder="Snippet description displayed in Google Search engine results..."
                    className="w-full px-4 py-2.5 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-xs placeholder-[hsl(215,20%,40%)]"
                  />
                </div>

                {/* Robots Link Directives */}
                <div className="pt-4 border-t border-[hsl(215,25%,22%)]/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)]">
                    <input
                      type="checkbox"
                      id="noIndexCheck"
                      checked={formNoIndex}
                      onChange={(e) => setFormNoIndex(e.target.checked)}
                      className="w-4 h-4 rounded bg-[hsl(222,47%,12%)] border-[hsl(215,25%,22%)] text-[hsl(217,91%,54%)]"
                    />
                    <label htmlFor="noIndexCheck" className="text-xs font-bold text-white cursor-pointer">
                      noindex <span className="text-[10px] text-[hsl(215,20%,50%)] block font-normal">(Hide from Google search index)</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)]">
                    <input
                      type="checkbox"
                      id="noFollowCheck"
                      checked={formNoFollow}
                      onChange={(e) => setFormNoFollow(e.target.checked)}
                      className="w-4 h-4 rounded bg-[hsl(222,47%,12%)] border-[hsl(215,25%,22%)] text-[hsl(217,91%,54%)]"
                    />
                    <label htmlFor="noFollowCheck" className="text-xs font-bold text-white cursor-pointer">
                      nofollow <span className="text-[10px] text-[hsl(215,20%,50%)] block font-normal">(Instruct crawlers not to follow links)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 3: OPTIONS & PUBLISH BUTTON */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[hsl(215,25%,22%)]/40">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded bg-[hsl(222,47%,9%)] border-[hsl(215,25%,22%)] text-[hsl(217,91%,54%)]"
                  />
                  <label htmlFor="featuredCheck" className="text-xs font-bold text-white cursor-pointer">
                    Feature this article at the top of the blog page
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  {editingPostId && (
                    <button type="button" onClick={resetArticleForm} className="px-6 py-3 rounded-xl border border-[hsl(215,25%,22%)] text-xs font-bold text-[hsl(215,20%,60%)] hover:text-white transition-all">
                      Cancel Edit
                    </button>
                  )}
                  <button type="submit" className="btn-primary px-8 py-3 text-sm font-bold shadow-lg shadow-[hsl(217,91%,54%)]/25">
                    {editingPostId ? 'Update Article →' : 'Publish Article Live →'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: MANAGE ARTICLES */}
        {activeTab === 'articles' && (
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">All Published Articles ({posts.length})</h2>
              
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="px-4 py-2 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-xs text-white placeholder-[hsl(215,20%,40%)]"
                />
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-xs text-white"
                >
                  <option value="All">All Categories</option>
                  <option value="AI SEO">AI SEO</option>
                  <option value="SEO">SEO</option>
                  <option value="PPC">PPC</option>
                  <option value="Web Dev">Web Dev</option>
                  <option value="Link Building">Link Building</option>
                  <option value="CRO">CRO</option>
                  <option value="Local SEO">Local SEO</option>
                </select>
                <button
                  type="button"
                  onClick={exportArticlesJson}
                  className="px-4 py-2 rounded-xl bg-[hsl(215,25%,20%)] text-xs font-bold text-white hover:bg-[hsl(215,25%,30%)] transition-all flex items-center gap-1.5"
                  title="Export backup JSON of all published articles"
                >
                  <span>📥 Backup JSON</span>
                </button>
                <button onClick={() => { resetArticleForm(); setActiveTab('publish'); }} className="btn-primary px-4 py-2 text-xs font-bold">
                  + Create Article
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[hsl(215,25%,22%)] text-[10px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider">
                    <th className="pb-3 px-4">Article</th>
                    <th className="pb-3 px-4">Category</th>
                    <th className="pb-3 px-4">SEO Robots</th>
                    <th className="pb-3 px-4">Published Date</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(215,25%,22%)]/40 text-xs">
                  {filteredArticles.map((post) => (
                    <tr key={post.id} className="hover:bg-[hsl(222,47%,8%)] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{post.icon || '📝'}</span>
                          <div>
                            <div className="font-bold text-white max-w-md line-clamp-1">{post.title}</div>
                            <div className="text-[10px] font-mono text-[hsl(215,20%,40%)]">/blog/{post.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[hsl(217,91%,54%)]/10 text-[hsl(217,91%,70%)] font-bold text-[10px]">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${post.noIndex ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {post.noIndex ? 'noindex' : 'index'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${post.noFollow ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {post.noFollow ? 'nofollow' : 'follow'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[hsl(215,20%,60%)] font-medium">{post.date}</td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button onClick={() => startEditPost(post)} className="px-3 py-1.5 rounded-lg bg-[hsl(215,25%,20%)] text-white hover:bg-[hsl(217,91%,54%)] font-bold transition-colors">
                          Edit
                        </button>
                        <Link href={`/blog/${post.slug}`} target="_blank" className="px-3 py-1.5 rounded-lg border border-[hsl(215,25%,22%)] text-[hsl(215,20%,60%)] hover:text-white font-bold transition-colors">
                          View
                        </Link>
                        <button onClick={() => handleDeletePost(post.id)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SITE RESOURCES & SERVICES */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-6">Add New Agency Service</h3>
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Service Name</label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. Conversational AI Chatbots"
                    className="w-full px-4 py-2.5 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-xs text-white"
                  >
                    <option value="SEO">SEO</option>
                    <option value="PPC">PPC</option>
                    <option value="Web Dev">Web Dev</option>
                    <option value="Link Building">Link Building</option>
                    <option value="AI Solutions">AI Solutions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Price Range</label>
                  <input
                    type="text"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Short Description</label>
                  <textarea
                    rows={3}
                    value={serviceDesc}
                    onChange={(e) => setServiceDesc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-xs text-white"
                  />
                </div>
                <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold justify-center">
                  + Save Service Resource
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-6">Managed Agency Resources</h3>
              <div className="space-y-4">
                {services.map(service => (
                  <div key={service.id} className="p-4 rounded-xl bg-[hsl(222,47%,8%)] border border-[hsl(215,25%,18%)] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-white text-sm">{service.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[hsl(217,91%,54%)]/20 text-[hsl(217,91%,70%)] text-[10px] font-bold">
                          {service.category}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(215,20%,60%)] mb-2">{service.description}</p>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{service.priceRange}</span>
                    </div>
                    <button onClick={() => handleDeleteServiceItem(service.id)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CLIENT LEADS */}
        {activeTab === 'leads' && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6">Inbound Audit Leads & Inquiries ({leads.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[hsl(215,25%,22%)] text-[10px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider">
                    <th className="pb-3 px-4">Contact Name</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4">Website</th>
                    <th className="pb-3 px-4">Requested Service</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(215,25%,22%)]/40 text-xs">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[hsl(222,47%,8%)] transition-colors">
                      <td className="py-4 px-4 font-bold text-white">{lead.name}</td>
                      <td className="py-4 px-4 text-[hsl(215,20%,60%)]">{lead.email}</td>
                      <td className="py-4 px-4 font-mono text-[hsl(217,91%,70%)]">{lead.website || 'N/A'}</td>
                      <td className="py-4 px-4 text-white font-medium">{lead.serviceRequested}</td>
                      <td className="py-4 px-4 text-[hsl(215,20%,60%)]">{lead.date}</td>
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLead(lead.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] text-xs text-white font-bold"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
