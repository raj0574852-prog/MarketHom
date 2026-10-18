'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { MarketplaceLead, MarketplaceLeadStatus } from '@/lib/marketplaceLeads';

export default function MarketplaceLeadsTab() {
  const [leads, setLeads] = useState<MarketplaceLead[]>([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal
  const [selectedLead, setSelectedLead] = useState<MarketplaceLead | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchLeads = useCallback(async (currentPage = page, currentSearch = search, currentStatus = statusFilter) => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '15',
        status: currentStatus,
        search: currentSearch
      });

      const res = await fetch(`/api/marketplace/leads?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setTotalPages(data.totalPages || 1);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Failed to load marketplace leads.');
      }
    } catch {
      setError('Network error while loading marketplace leads.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  // Load leads with debouncing on search/filter changes
  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(() => {
      if (!ignore) {
        fetchLeads(page, search, statusFilter);
      }
    }, 300);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [page, search, statusFilter, fetchLeads]);

  const handleStatusChange = async (leadId: string, newStatus: MarketplaceLeadStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch('/api/marketplace/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedLead = data.lead;

        setLeads(prev => prev.map(l => l.id === leadId ? updatedLead : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updatedLead);
        }

        // Refresh metrics
        fetchLeads(page, search, statusFilter);
      } else {
        alert('Failed to update lead status.');
      }
    } catch {
      alert('Network error while updating lead status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: MarketplaceLeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Contacted':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'In Discussion':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Converted':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Closed':
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const createWhatsAppUrl = (lead: MarketplaceLead) => {
    if (!lead.whatsapp) return null;
    const digitsOnly = lead.whatsapp.replace(/\D/g, '');
    if (!digitsOnly) return null;
    const text = encodeURIComponent(
      `Hello ${lead.full_name}, thank you for your inquiry about ${lead.publisher_domain} on EducationHom. I am contacting you regarding your placement request.`
    );
    return `https://wa.me/${digitsOnly}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-[hsl(215,25%,22%)]">
          <span className="text-xs font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider">Total Inquiries</span>
          <div className="text-3xl font-black text-white mt-1">{metrics.total}</div>
          <span className="text-[11px] text-[hsl(215,20%,60%)]">All marketplace leads</span>
        </div>
        <div className="glass-card p-5 border border-emerald-500/30 bg-emerald-500/5">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">New Inquiries</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">{metrics.newLeads}</div>
          <span className="text-[11px] text-emerald-300/70">Awaiting contact</span>
        </div>
        <div className="glass-card p-5 border border-blue-500/30 bg-blue-500/5">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Contacted</span>
          <div className="text-3xl font-black text-blue-400 mt-1">{metrics.contacted}</div>
          <span className="text-[11px] text-blue-300/70">Outreach initiated</span>
        </div>
        <div className="glass-card p-5 border border-amber-500/30 bg-amber-500/5">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Converted</span>
          <div className="text-3xl font-black text-amber-400 mt-1">{metrics.converted}</div>
          <span className="text-[11px] text-amber-300/70">Deals completed</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-card p-6">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🛒</span> Marketplace Placement Leads
            </h2>
            <p className="text-xs text-[hsl(215,20%,60%)] mt-0.5">
              Inquiries generated directly from publisher listing detail pages
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="Search name, email, domain..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2 pl-9 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-xs text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)]"
              />
              <svg className="w-4 h-4 text-[hsl(215,20%,40%)] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-xs text-white focus:outline-none focus:border-[hsl(217,91%,54%)]"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Refresh */}
            <button
              onClick={() => fetchLeads(page, search, statusFilter)}
              className="p-2 border border-[hsl(215,25%,22%)] rounded-xl text-xs hover:border-[hsl(217,91%,54%)] text-white transition-colors"
              title="Refresh leads"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[hsl(215,25%,22%)] text-[10px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider">
                <th className="pb-3 px-4">Client</th>
                <th className="pb-3 px-4">Contact Info</th>
                <th className="pb-3 px-4">Publisher Domain</th>
                <th className="pb-3 px-4">Verified Price</th>
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(215,25%,22%)]/40 text-xs">
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2" />
                    <div>Loading marketplace leads...</div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="text-3xl mb-2">📭</div>
                    <div className="font-semibold text-white">No marketplace inquiries found</div>
                    <div className="text-xs text-[hsl(215,20%,50%)] mt-1">
                      {search || statusFilter !== 'All' ? 'Try adjusting your filters' : 'Inquiries submitted from publisher pages will appear here'}
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const waUrl = createWhatsAppUrl(lead);
                  return (
                    <tr key={lead.id} className="hover:bg-[hsl(222,47%,8%)] transition-colors">
                      {/* Client */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{lead.full_name}</div>
                        {lead.message && (
                          <div className="text-[11px] text-[hsl(215,20%,50%)] max-w-xs truncate" title={lead.message}>
                            &ldquo;{lead.message}&rdquo;
                          </div>
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4 space-y-1">
                        {lead.email ? (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <span className="text-[10px] text-blue-400">✉️</span>
                            <span className="font-mono text-[11px]">{lead.email}</span>
                          </div>
                        ) : null}
                        {lead.whatsapp ? (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <span className="text-[10px] text-emerald-400">💬</span>
                            <span className="font-mono text-[11px]">{lead.whatsapp}</span>
                          </div>
                        ) : null}
                      </td>

                      {/* Publisher Domain & URL */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{lead.publisher_domain}</div>
                        <a
                          href={lead.listing_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-[hsl(217,91%,70%)] hover:underline flex items-center gap-1"
                        >
                          View Listing ↗
                        </a>
                      </td>

                      {/* Verified Price */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-emerald-400">
                          {lead.price ? `${lead.currency === 'USD' ? '$' : lead.currency}${lead.price}` : 'Quote'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-[hsl(215,20%,60%)] whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          disabled={isUpdatingStatus}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as MarketplaceLeadStatus)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-bold bg-[hsl(222,47%,9%)] ${getStatusBadge(lead.status)}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}?subject=${encodeURIComponent(`Placement Inquiry: ${lead.publisher_domain} - EducationHom`)}`}
                            className="px-2.5 py-1.5 rounded-lg border border-[hsl(215,25%,22%)] text-blue-400 hover:border-blue-400 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-colors"
                            title="Send Email"
                          >
                            ✉️ Email
                          </a>
                        )}

                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-colors"
                            title="Open WhatsApp chat with prefilled message"
                          >
                            💬 WhatsApp
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1.5 rounded-lg bg-[hsl(215,25%,20%)] text-white hover:bg-[hsl(217,91%,54%)] text-xs font-bold transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-[hsl(215,25%,22%)]/60 text-xs">
            <span className="text-[hsl(215,20%,50%)]">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[hsl(215,25%,22%)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[hsl(217,91%,54%)]"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-[hsl(215,25%,22%)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[hsl(217,91%,54%)]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[hsl(222,47%,8%)] border border-[hsl(215,25%,22%)] rounded-2xl shadow-2xl overflow-hidden p-6 text-white space-y-4">
            <div className="flex justify-between items-start border-b border-[hsl(215,25%,22%)] pb-3">
              <div>
                <h3 className="text-lg font-bold">Marketplace Inquiry Details</h3>
                <p className="text-xs text-[hsl(215,20%,50%)]">ID: {selectedLead.id}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[hsl(222,47%,6%)] rounded-xl border border-[hsl(215,25%,18%)]">
                <div>
                  <span className="text-[hsl(215,20%,50%)] block">Client Name</span>
                  <span className="font-bold text-white text-sm">{selectedLead.full_name}</span>
                </div>
                <div>
                  <span className="text-[hsl(215,20%,50%)] block">Status</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                </div>
                <div>
                  <span className="text-[hsl(215,20%,50%)] block">Email</span>
                  <span className="font-mono text-white">{selectedLead.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[hsl(215,20%,50%)] block">WhatsApp</span>
                  <span className="font-mono text-white">{selectedLead.whatsapp || 'Not provided'}</span>
                </div>
              </div>

              <div className="p-3 bg-[hsl(222,47%,6%)] rounded-xl border border-[hsl(215,25%,18%)] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[hsl(215,20%,50%)]">Publisher Target:</span>
                  <span className="font-bold text-white">{selectedLead.publisher_domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(215,20%,50%)]">Placement Price:</span>
                  <span className="font-bold text-emerald-400">
                    {selectedLead.price ? `${selectedLead.currency === 'USD' ? '$' : selectedLead.currency}${selectedLead.price}` : 'Quote Request'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(215,20%,50%)]">Listing URL:</span>
                  <a
                    href={selectedLead.listing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline max-w-[200px] truncate font-mono text-[11px]"
                  >
                    {selectedLead.listing_url}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(215,20%,50%)]">Submitted On:</span>
                  <span className="text-white">{new Date(selectedLead.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-[hsl(215,20%,50%)] block mb-1 font-bold uppercase tracking-wider text-[10px]">Client Instructions / Message:</span>
                <div className="p-3 bg-[hsl(222,47%,6%)] rounded-xl border border-[hsl(215,25%,18%)] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedLead.message || 'No special instructions submitted.'}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[hsl(215,25%,22%)]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[hsl(215,20%,50%)]">Update Status:</span>
                <select
                  value={selectedLead.status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as MarketplaceLeadStatus)}
                  className="px-2 py-1 rounded bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] text-xs text-white font-bold"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(`Placement Inquiry: ${selectedLead.publisher_domain} - EducationHom`)}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Send Email
                  </a>
                )}
                {createWhatsAppUrl(selectedLead) && (
                  <a
                    href={createWhatsAppUrl(selectedLead)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Open WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
