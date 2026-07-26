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
  const [formContent, setFormContent] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
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
  }, []);

  const loadData = () => {
    setPosts(getStoredPosts());
    setServices(getServices());
    setLeads(getLeads());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('markethom_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid passcode. Use "admin123" to access.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('markethom_admin_auth');
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingPostId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(generatedSlug);
    }
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) {
      alert('Please fill out the article title and content.');
      return;
    }

    const categoryToUse = formCategory === 'Custom' ? (formCustomCategory || 'General') : formCategory;

    const saved = savePost({
      id: editingPostId || undefined,
      title: formTitle,
      slug: formSlug || 'article-' + Date.now(),
      excerpt: formExcerpt || formTitle,
      category: categoryToUse,
      author: formAuthor,
      authorRole: formAuthorRole,
      readTime: formReadTime,
      icon: formIcon,
      content: formContent,
      featured: formFeatured,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    });

    setPublishSuccessMsg(editingPostId ? 'Article updated successfully!' : '🎉 Article published live to the Blog section!');
    loadData();

    // Reset form after short delay
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
    setFormFeatured(false);
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
    setFormContent(post.content);
    setFormFeatured(!!post.featured);
    setActiveTab('publish');
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deletePost(id);
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

  // Filtered articles
  const filteredArticles = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(articleSearch.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(articleSearch.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || post.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Login Screen Render
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
              <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Admin Passcode</label>
              <input 
                type="password" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (default: admin123)" 
                className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)] text-sm transition-all"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-medium text-center">{loginError}</p>
            )}

            <button type="submit" className="w-full btn-primary py-3 justify-center text-sm font-bold shadow-lg shadow-[hsl(217,91%,54%)]/20">
              Access Admin Panel →
            </button>

            <button 
              type="button" 
              onClick={() => { setPasscode('admin123'); setIsAuthenticated(true); localStorage.setItem('markethom_admin_auth', 'true'); }}
              className="w-full text-xs text-[hsl(215,20%,50%)] hover:text-[hsl(217,91%,70%)] transition-colors py-2 text-center"
            >
              ⚡ Quick Demo Login (Auto-fill admin123)
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
            {/* Stats Cards */}
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

            {/* Quick Actions & Recent Articles */}
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

              {/* Inbound Leads Summary */}
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
          <div className="glass-card p-8 border border-[hsl(217,91%,54%)]/20">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[hsl(215,25%,22%)]/40">
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
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold text-center animate-bounce">
                {publishSuccessMsg}
              </div>
            )}

            <form onSubmit={handlePublishPost} className="space-y-6">
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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider">Article Content (HTML/Rich text)</label>
                  <span className="text-[10px] text-[hsl(215,20%,50%)]">Supports &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt;, etc.</span>
                </div>
                <textarea
                  rows={10}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="<p>Write your detailed blog post content here...</p>"
                  className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white font-mono text-sm placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)]"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-[hsl(222,47%,9%)] border-[hsl(215,25%,22%)] text-[hsl(217,91%,54%)] focus:ring-0"
                />
                <label htmlFor="featuredCheck" className="text-xs font-bold text-white cursor-pointer">
                  Feature this article at the top of the blog page
                </label>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[hsl(215,25%,22%)]/40">
                {editingPostId && (
                  <button type="button" onClick={resetArticleForm} className="px-6 py-3 rounded-xl border border-[hsl(215,25%,22%)] text-xs font-bold text-[hsl(215,20%,60%)] hover:text-white transition-all">
                    Cancel Edit
                  </button>
                )}
                <button type="submit" className="btn-primary px-8 py-3 text-sm font-bold shadow-lg shadow-[hsl(217,91%,54%)]/25">
                  {editingPostId ? 'Update Article →' : 'Publish Article Live →'}
                </button>
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
                    <th className="pb-3 px-4">Author</th>
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
                      <td className="py-4 px-4 text-[hsl(215,20%,60%)] font-medium">{post.author}</td>
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
