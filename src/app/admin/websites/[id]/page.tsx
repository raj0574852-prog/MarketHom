'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminWebsiteEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [website, setWebsite] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/websites/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setWebsite(data);
          setMetrics(data.website_metrics || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleChange = (field: string, value: any) => {
    setWebsite({ ...website, [field]: value });
  };

  const handleArrayChange = (field: string, text: string) => {
    const arr = text.split(',').map(s => s.trim()).filter(Boolean);
    setWebsite({ ...website, [field]: arr });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...website };
      delete payload.website_metrics; // don't send metrics with the main update
      
      const res = await fetch(`/api/websites/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Saved successfully!');
      } else {
        alert('Failed to save.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleMetricSave = async (metricType: string, value: string, unit: string, provider: string) => {
    try {
      const res = await fetch(`/api/websites/${params.id}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric_type: metricType,
          value: value ? parseFloat(value) : null,
          unit,
          provider
        })
      });
      if (res.ok) {
        const newMetric = await res.json();
        setMetrics(prev => {
          const filtered = prev.filter(m => m.metric_type !== metricType);
          return [...filtered, newMetric];
        });
        alert('Metric saved!');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving metric.');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!website) return <div className="p-8 text-white">Not found</div>;

  const seoScore = [
    !!website.seo_title,
    !!website.seo_description,
    !!website.short_description,
    !!website.category_id,
    !!website.canonical_url,
    metrics.length > 0,
    !!website.turnaround_time, // proxy for guidelines
    (website.accepted_niches && website.accepted_niches.length > 0)
  ];
  const seoCompleteness = Math.round((seoScore.filter(Boolean).length / seoScore.length) * 100);

  return (
    <div className="p-8 text-white min-h-screen bg-slate-950 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/websites" className="text-sm text-slate-400 hover:text-white mb-2 inline-block">&larr; Back to Listings</Link>
            <h1 className="text-3xl font-bold">Edit: {website.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href={`/websites/${website.slug}`} 
              target="_blank"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              Preview Public Page
            </Link>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 text-slate-300 uppercase text-xs tracking-wider">Navigation</h3>
              <nav className="space-y-1">
                {['basic', 'content', 'guidelines', 'policies', 'seo', 'metrics', 'advanced_pricing'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 text-slate-300 uppercase text-xs tracking-wider">SEO Readiness</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center font-bold relative">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125" strokeDashoffset={125 - (125 * seoCompleteness) / 100} className="text-blue-500 transition-all duration-1000" />
                  </svg>
                  <span className="relative z-10 text-xs">{seoCompleteness}%</span>
                </div>
                <span className="text-sm text-slate-400">Completion Score</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2"><span className={website.seo_title ? "text-green-400" : ""}>{website.seo_title ? "✓" : "○"}</span> SEO Title</li>
                <li className="flex items-center gap-2"><span className={website.seo_description ? "text-green-400" : ""}>{website.seo_description ? "✓" : "○"}</span> Meta Description</li>
                <li className="flex items-center gap-2"><span className={website.short_description ? "text-green-400" : ""}>{website.short_description ? "✓" : "○"}</span> Short Description</li>
                <li className="flex items-center gap-2"><span className={website.category_id ? "text-green-400" : ""}>{website.category_id ? "✓" : "○"}</span> Category</li>
                <li className="flex items-center gap-2"><span className={website.canonical_url ? "text-green-400" : ""}>{website.canonical_url ? "✓" : "○"}</span> Canonical URL</li>
                <li className="flex items-center gap-2"><span className={metrics.length > 0 ? "text-green-400" : ""}>{metrics.length > 0 ? "✓" : "○"}</span> Metrics (≥1)</li>
                <li className="flex items-center gap-2"><span className={website.turnaround_time ? "text-green-400" : ""}>{website.turnaround_time ? "✓" : "○"}</span> Publishing Guidelines</li>
                <li className="flex items-center gap-2"><span className={(website.accepted_niches?.length || 0) > 0 ? "text-green-400" : ""}>{(website.accepted_niches?.length || 0) > 0 ? "✓" : "○"}</span> Accepted Niches</li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-slate-800 pb-4">Basic Information</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm text-slate-400 mb-1">Name</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.name || ''} onChange={e => handleChange('name', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Slug</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.slug || ''} onChange={e => handleChange('slug', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Domain</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.domain || ''} onChange={e => handleChange('domain', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Website URL</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.website_url || ''} onChange={e => handleChange('website_url', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Logo URL</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.logo_url || ''} onChange={e => handleChange('logo_url', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Category</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.category_id || ''} onChange={e => handleChange('category_id', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Price (Numeric)</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.price || ''} onChange={e => handleChange('price', e.target.value)} /></div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Status</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.status || 'draft'} onChange={e => handleChange('status', e.target.value)}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div><label className="block text-sm text-slate-400 mb-1">Location</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.location || ''} onChange={e => handleChange('location', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Language</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.language || ''} onChange={e => handleChange('language', e.target.value)} /></div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-slate-800 pb-4">Descriptions & Content</h2>
                  <div><label className="block text-sm text-slate-400 mb-1">Short Description</label><textarea rows={3} className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.short_description || ''} onChange={e => handleChange('short_description', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-400 mb-1">Long Description</label><textarea rows={5} className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.long_description || ''} onChange={e => handleChange('long_description', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-400 mb-1">Editorial Description</label><textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.editorial_description || ''} onChange={e => handleChange('editorial_description', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-400 mb-1">Audience Description</label><textarea rows={3} className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.audience_description || ''} onChange={e => handleChange('audience_description', e.target.value)} /></div>
                  
                  <div><label className="block text-sm text-slate-400 mb-1">Accepted Niches (comma separated)</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={(website.accepted_niches || []).join(', ')} onChange={e => handleArrayChange('accepted_niches', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-400 mb-1">Rejected Niches (comma separated)</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={(website.rejected_niches || []).join(', ')} onChange={e => handleArrayChange('rejected_niches', e.target.value)} /></div>
                </div>
              )}

              {activeTab === 'guidelines' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-slate-800 pb-4">Publishing Guidelines</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm text-slate-400 mb-1">Turnaround Time</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.turnaround_time || ''} onChange={e => handleChange('turnaround_time', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Article Length</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.article_length || ''} onChange={e => handleChange('article_length', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Link Validity</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.link_validity || ''} onChange={e => handleChange('link_validity', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Publication Type</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.publication_type || ''} onChange={e => handleChange('publication_type', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Max Dofollow Links</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.max_dofollow_links || ''} onChange={e => handleChange('max_dofollow_links', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Max Nofollow Links</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.max_nofollow_links || ''} onChange={e => handleChange('max_nofollow_links', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Content Review</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.content_review || ''} onChange={e => handleChange('content_review', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Image Requirements</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.image_requirements || ''} onChange={e => handleChange('image_requirements', e.target.value)} /></div>
                  </div>
                </div>
              )}

              {activeTab === 'policies' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-slate-800 pb-4">Editorial & Policies</h2>
                  <div><label className="block text-sm text-slate-400 mb-1">Editorial Review Policy</label><textarea rows={3} className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.editorial_review || ''} onChange={e => handleChange('editorial_review', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-400 mb-1">AI Content Policy</label><textarea rows={2} className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.ai_content_policy || ''} onChange={e => handleChange('ai_content_policy', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-400 mb-1">Link Policy</label><textarea rows={2} className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.link_policy || ''} onChange={e => handleChange('link_policy', e.target.value)} /></div>
                  
                  <div className="flex flex-col gap-3 mt-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={website.original_content_required || false} onChange={e => handleChange('original_content_required', e.target.checked)} />
                      Original Content Required
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={website.sponsored_label || false} onChange={e => handleChange('sponsored_label', e.target.checked)} />
                      Requires Sponsored Label
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={website.disclosure_required || false} onChange={e => handleChange('disclosure_required', e.target.checked)} />
                      Disclosure Required
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-slate-800 pb-4">SEO Metadata</h2>
                  <div><label className="block text-sm text-slate-400 mb-1">SEO Title</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.seo_title || ''} onChange={e => handleChange('seo_title', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-400 mb-1">SEO Description</label><textarea rows={3} className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.seo_description || ''} onChange={e => handleChange('seo_description', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-400 mb-1">Canonical URL</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.canonical_url || ''} onChange={e => handleChange('canonical_url', e.target.value)} /></div>
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-slate-800 pb-4">SEO Metrics</h2>
                  <div className="space-y-4">
                    {[
                      'DA', 'PA', 'DR', 'ORGANIC_TRAFFIC', 'SEMRUSH_AUTHORITY', 'SPAM_SCORE', 'TOTAL_BACKLINKS', 'REFERRING_DOMAINS', 'AHREFS_TRAFFIC'
                    ].map(metricType => {
                      const m = metrics.find(x => x.metric_type === metricType) || { metric_type: metricType, value: '', unit: '', provider: '' };
                      return (
                        <div key={metricType} className="grid grid-cols-12 gap-4 items-center bg-slate-950 p-3 rounded border border-slate-800">
                          <div className="col-span-3 font-semibold text-sm">{metricType}</div>
                          <div className="col-span-3">
                            <input 
                              type="number" 
                              placeholder="Value (empty=N/A)" 
                              className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-sm" 
                              value={m.value ?? ''}
                              onChange={e => {
                                const newM = [...metrics];
                                const idx = newM.findIndex(x => x.metric_type === metricType);
                                if (idx > -1) newM[idx].value = e.target.value;
                                else newM.push({ metric_type: metricType, value: e.target.value, unit: '', provider: '' });
                                setMetrics(newM);
                              }}
                            />
                          </div>
                          <div className="col-span-2">
                             <input 
                              type="text" 
                              placeholder="Unit (e.g., K, %)" 
                              className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-sm" 
                              value={m.unit || ''}
                              onChange={e => {
                                const newM = [...metrics];
                                const idx = newM.findIndex(x => x.metric_type === metricType);
                                if (idx > -1) newM[idx].unit = e.target.value;
                                else newM.push({ metric_type: metricType, value: '', unit: e.target.value, provider: '' });
                                setMetrics(newM);
                              }}
                            />
                          </div>
                          <div className="col-span-2">
                             <input 
                              type="text" 
                              placeholder="Provider" 
                              className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-sm" 
                              value={m.provider || ''}
                              onChange={e => {
                                const newM = [...metrics];
                                const idx = newM.findIndex(x => x.metric_type === metricType);
                                if (idx > -1) newM[idx].provider = e.target.value;
                                else newM.push({ metric_type: metricType, value: '', unit: '', provider: e.target.value });
                                setMetrics(newM);
                              }}
                            />
                          </div>
                          <div className="col-span-2">
                            <button 
                              onClick={() => handleMetricSave(metricType, m.value, m.unit, m.provider)}
                              className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded"
                            >
                              Save Metric
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'advanced_pricing' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-slate-800 pb-4">Advanced Pricing & Deals</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm text-slate-400 mb-1">Total Deals</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.total_deals || ''} onChange={e => handleChange('total_deals', e.target.value ? parseInt(e.target.value) : null)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Sample Link</label><input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.sample_link || ''} onChange={e => handleChange('sample_link', e.target.value)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Content Placement Price ($) <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded ml-2">Original</span></label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.content_placement_price || ''} onChange={e => handleChange('content_placement_price', e.target.value ? parseFloat(e.target.value) : null)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Selling Price ($) <span className="text-[10px] bg-[hsl(217,91%,54%)]/20 text-[hsl(217,91%,54%)] px-2 py-0.5 rounded ml-2">Auto-Calculated</span></label><input type="number" readOnly className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white cursor-not-allowed" value={website.content_placement_selling_price || ''} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Markup Percentage (%) <span className="text-[10px] bg-[hsl(217,91%,54%)]/20 text-[hsl(217,91%,54%)] px-2 py-0.5 rounded ml-2">Auto-Calculated</span></label><input type="number" readOnly className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white cursor-not-allowed" value={website.content_placement_markup_percentage || ''} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Link Insert Price ($)</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.link_insert_price || ''} onChange={e => handleChange('link_insert_price', e.target.value ? parseFloat(e.target.value) : null)} /></div>
                    
                    <div className="col-span-2 mt-4"><h3 className="text-lg font-semibold text-blue-400">CBD Pricing</h3></div>
                    <div><label className="block text-sm text-slate-400 mb-1">CBD Content Placement Price ($)</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.cbd_content_placement_price || ''} onChange={e => handleChange('cbd_content_placement_price', e.target.value ? parseFloat(e.target.value) : null)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">CBD Content Creation & Placement Price ($)</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.cbd_content_creation_placement_price || ''} onChange={e => handleChange('cbd_content_creation_placement_price', e.target.value ? parseFloat(e.target.value) : null)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">CBD Link Insert Price ($)</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.cbd_link_insert_price || ''} onChange={e => handleChange('cbd_link_insert_price', e.target.value ? parseFloat(e.target.value) : null)} /></div>
                    
                    <div className="col-span-2 mt-4"><h3 className="text-lg font-semibold text-pink-400">Adult Pricing</h3></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Adult Content Placement Price ($)</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.adult_content_placement_price || ''} onChange={e => handleChange('adult_content_placement_price', e.target.value ? parseFloat(e.target.value) : null)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Adult Content Creation & Placement Price ($)</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.adult_content_creation_placement_price || ''} onChange={e => handleChange('adult_content_creation_placement_price', e.target.value ? parseFloat(e.target.value) : null)} /></div>
                    <div><label className="block text-sm text-slate-400 mb-1">Adult Link Insert Price ($)</label><input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={website.adult_link_insert_price || ''} onChange={e => handleChange('adult_link_insert_price', e.target.value ? parseFloat(e.target.value) : null)} /></div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
