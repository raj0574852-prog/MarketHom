'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminWebsitesPage() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const fetchWebsites = async () => {
    try {
      const res = await fetch('/api/websites');
      if (res.ok) {
        const data = await res.json();
        setWebsites(data);
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

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
                    <th className="p-5 font-semibold">Name</th>
                    <th className="p-5 font-semibold">Domain</th>
                    <th className="p-5 font-semibold">Category</th>
                    <th className="p-5 font-semibold">Source</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                  {websites.map((website) => (
                    <tr key={website.id} className="hover:bg-slate-800/30 transition-colors group">
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
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          website.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          website.status === 'archived' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {website.status}
                        </span>
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
                  {websites.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-16">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
