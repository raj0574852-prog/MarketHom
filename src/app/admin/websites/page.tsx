'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminWebsitesPage() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchWebsites = async (currentPage = page, query = searchQuery, status = statusFilter) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/websites?page=${currentPage}&limit=500&q=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}`);
      if (res.ok) {
        const result = await res.json();
        setWebsites(result.data || []);
        setHasNextPage(result.hasNextPage || false);
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use a debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchWebsites(1, searchQuery, statusFilter);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchWebsites(page, searchQuery, statusFilter);
  }, [page]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing with Google Sheets...');
    try {
      const res = await fetch('/api/admin/websites/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSyncStatus(`Sync successful: ${data.stats?.created} created, ${data.stats?.updated} updated, ${data.stats?.archived} archived.`);
        fetchWebsites();
      } else {
        setSyncStatus(`Sync failed: ${data.message}`);
      }
    } catch (error: any) {
      console.error('Error syncing:', error);
      setSyncStatus(`Sync error: ${error.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 8000);
    }
  };

  const handleCreateNew = async () => {
    const defaultName = 'New Website ' + Date.now();
    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: defaultName, domain: 'example.com', website_url: 'https://example.com', category_id: 'general' }),
      });
      if (res.ok) {
        const newWebsite = await res.json();
        window.location.href = `/admin/websites/${newWebsite.id}`;
      }
    } catch (error) {
      console.error('Error creating new website:', error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingStatusId(id);
    try {
      const res = await fetch(`/api/websites/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setWebsites(websites.map(w => w.id === id ? { ...w, status: newStatus } : w));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedIds.length === 0) return;
    setIsBulkUpdating(true);
    try {
      const res = await fetch('/api/websites/bulk-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status: newStatus })
      });
      if (res.ok) {
        setWebsites(websites.map(w => selectedIds.includes(w.id) ? { ...w, status: newStatus } : w));
        setSelectedIds([]);
      } else {
        alert('Failed to update status for selected websites');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status for selected websites');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Client-side filtering is removed, we use server-side search instead
  const filteredWebsites = websites;

  return (
    <div className="p-8 pt-32 text-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Website Listings</h1>
            <p className="text-slate-400 mt-1">Manage and publish your marketplace inventory</p>
            {syncStatus && (
              <p className={`mt-2 text-sm ${syncStatus.includes('failed') || syncStatus.includes('error') ? 'text-rose-400' : 'text-emerald-400'}`}>
                {syncStatus}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="px-5 py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSyncing ? (
                <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              )}
              {isSyncing ? 'Syncing...' : 'Sync with Google Sheets'}
            </button>
            <button 
              onClick={handleCreateNew}
              className="px-5 py-2.5 bg-[hsl(217,91%,54%)] hover:bg-[hsl(217,91%,45%)] text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Create New Listing
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {selectedIds.length > 0 && (
            <div className="p-4 border-b border-blue-500/30 bg-blue-500/10 flex justify-between items-center transition-all">
              <div className="text-sm font-medium text-blue-400">
                {selectedIds.length} {selectedIds.length === 1 ? 'website' : 'websites'} selected
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBulkStatusChange('published')}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg transition-colors border border-emerald-500/20 disabled:opacity-50"
                >
                  Publish Selected
                </button>
                <button 
                  onClick={() => handleBulkStatusChange('draft')}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-semibold rounded-lg transition-colors border border-amber-500/20 disabled:opacity-50"
                >
                  Draft Selected
                </button>
                <button 
                  onClick={() => handleBulkStatusChange('archived')}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg transition-colors border border-rose-500/20 disabled:opacity-50"
                >
                  Archive Selected
                </button>
              </div>
            </div>
          )}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex w-full sm:w-auto gap-3">
              <div className="relative w-full sm:w-64">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="text" 
                  placeholder="Search by domain or name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="text-sm text-slate-400 font-medium whitespace-nowrap">
              Showing {filteredWebsites.length} {filteredWebsites.length === 1 ? 'website' : 'websites'}
            </div>
          </div>
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
              <p>Loading listings...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-sm">
                    <th className="p-5 w-12">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-950 cursor-pointer"
                        checked={filteredWebsites.length > 0 && selectedIds.length === filteredWebsites.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(filteredWebsites.map(w => w.id));
                          else setSelectedIds([]);
                        }}
                      />
                    </th>
                    <th className="p-5 font-semibold">Name</th>
                    <th className="p-5 font-semibold">Domain</th>
                    <th className="p-5 font-semibold">Category</th>
                    <th className="p-5 font-semibold">Source</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                  {filteredWebsites.map((website) => (
                    <tr key={website.id} className={`hover:bg-slate-800/30 transition-colors group ${selectedIds.includes(website.id) ? 'bg-blue-500/5' : ''}`}>
                      <td className="p-5">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-900 cursor-pointer"
                          checked={selectedIds.includes(website.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, website.id]);
                            else setSelectedIds(selectedIds.filter(id => id !== website.id));
                          }}
                        />
                      </td>
                      <td className="p-5 font-medium text-white">{website.name}</td>
                      <td className="p-5 text-slate-400 flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        {website.domain}
                      </td>
                      <td className="p-5 text-slate-400 capitalize">{website.category_id}</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          website.source === 'google_sheets' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {website.source === 'google_sheets' ? 'Google Sheets' : 'Manual'}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="relative inline-block">
                          <select 
                            value={website.status}
                            onChange={(e) => handleStatusChange(website.id, e.target.value)}
                            disabled={updatingStatusId === website.id}
                            className={`appearance-none px-3 py-1.5 pr-8 rounded-full text-xs font-bold cursor-pointer border focus:outline-none transition-colors ${
                              website.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' :
                              website.status === 'archived' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                            } ${updatingStatusId === website.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <option value="draft" className="bg-slate-900 text-amber-400">Draft</option>
                            <option value="published" className="bg-slate-900 text-emerald-400">Published</option>
                            <option value="archived" className="bg-slate-900 text-rose-400">Archived</option>
                          </select>
                          <svg className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none transition-opacity ${updatingStatusId === website.id ? 'opacity-0' : 'opacity-70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                          {updatingStatusId === website.id && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin opacity-70"></div>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-right flex items-center justify-end gap-2">
                        {website.status === 'published' && (
                          <Link 
                            href={`/websites/${website.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg font-medium transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            View Live
                          </Link>
                        )}
                        <Link 
                          href={`/admin/websites/${website.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[hsl(217,91%,54%)] bg-[hsl(217,91%,54%)]/10 hover:bg-[hsl(217,91%,54%)]/20 rounded-lg font-medium transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredWebsites.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
                            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          </div>
                          <h3 className="text-lg font-medium text-white mb-2">No Websites Found</h3>
                          <p className="text-slate-400 max-w-sm mb-6">Your marketplace inventory is currently empty. Start by adding your first premium website listing.</p>
                          <button 
                            onClick={handleCreateNew}
                            className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-semibold transition-colors flex items-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Add First Listing
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {filteredWebsites.length > 0 && (
                <div className="p-6 flex items-center justify-between border-t border-slate-800 bg-slate-950/50">
                  <div className="text-sm text-slate-400">
                    Page <span className="font-medium text-white">{page}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1 || loading}
                      className="px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={!hasNextPage || loading}
                      className="px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
