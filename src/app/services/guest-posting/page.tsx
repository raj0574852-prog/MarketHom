'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTASection from '@/components/home/CTASection';
import { getGuestPosts, GuestPostListing } from '@/lib/guestPostStore';
import { addLead } from '@/lib/resourcesStore';

export default function GuestPostingPage() {
  const [listings, setListings] = useState<GuestPostListing[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<string>('All');
  const [minDa, setMinDa] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for Client Order Placement
  const [selectedListing, setSelectedListing] = useState<GuestPostListing | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [anchorText, setAnchorText] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setListings(getGuestPosts());
    fetch('/api/guest-posts')
      .then(res => res.json())
      .then(data => {
        if (data.listings && Array.isArray(data.listings)) {
          setListings(data.listings);
        }
      })
      .catch(() => {});
  }, []);

  const niches = ['All', 'AI & Tech', 'SaaS & Marketing', 'Finance & Crypto', 'E-Commerce'];

  const filteredListings = listings.filter(item => {
    const matchesNiche = selectedNiche === 'All' || item.niche.toLowerCase() === selectedNiche.toLowerCase();
    const matchesDa = item.da >= minDa;
    const matchesSearch = item.domainName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.niche.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNiche && matchesDa && matchesSearch;
  });

  const handleOpenOrderModal = (listing: GuestPostListing) => {
    setSelectedListing(listing);
    setOrderSuccess(false);
  };

  const handleCloseOrderModal = () => {
    setSelectedListing(null);
    setOrderSuccess(false);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !targetUrl || !anchorText || !selectedListing) {
      alert('Please fill out all required order fields.');
      return;
    }

    setIsSubmitting(true);

    const leadMessage = `🛒 GUEST POST ORDER FOR: ${selectedListing.domainName} ($${selectedListing.price})\nTarget URL: ${targetUrl}\nAnchor Text: ${anchorText}\nNiche: ${selectedListing.niche}\nInstructions: ${instructions || 'N/A'}`;

    addLead({
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      website: targetUrl,
      serviceRequested: `Guest Post Order: ${selectedListing.domainName} ($${selectedListing.price})`,
      message: leadMessage,
      budget: `$${selectedListing.price}`
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
    }, 600);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="pt-36 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,54%)]/10 via-transparent to-[hsl(270,80%,60%)]/10" />
        <div className="container-custom relative z-10">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: 'Guest Posting Marketplace' }]} />
          
          <div className="max-w-4xl">
            <span className="badge mb-4">Live Guest Post Marketplace</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-white">
              Buy Premium <span className="gradient-text">Guest Posts & Backlinks</span>
            </h1>
            <p className="text-[hsl(215,20%,65%)] text-lg md:text-xl mb-8 leading-relaxed">
              Browse our verified network of <strong className="text-white">DA 60-90+ domains</strong>. Select a publication, submit your target link and anchor text, and place your order directly live on this page.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#marketplace" className="btn-primary py-4 px-8 text-base font-bold shadow-xl shadow-[hsl(217,91%,54%)]/25">
                🛒 Browse Available Websites & Order ↓
              </a>
              <Link href="/contact" className="btn-outline py-4 px-6 text-sm font-semibold">
                Custom Bulk Package Request →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACE CATALOG SECTION */}
      <section className="section-padding bg-[hsl(222,47%,5%)] border-y border-[hsl(215,25%,22%)]/40" id="marketplace">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="badge mb-3">Verified Publishers</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Available Guest Post <span className="gradient-text">Websites</span>
              </h2>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search domain or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-xs placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)] w-60"
              />

              <select
                value={minDa}
                onChange={(e) => setMinDa(Number(e.target.value))}
                className="px-3 py-2 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-xs font-semibold focus:outline-none"
              >
                <option value={0}>All DA Ratings</option>
                <option value={60}>DA 60+ Minimum</option>
                <option value={70}>DA 70+ Minimum</option>
                <option value={80}>DA 80+ Minimum</option>
              </select>
            </div>
          </div>

          {/* NICHE FILTER TABS */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {niches.map(niche => (
              <button
                key={niche}
                onClick={() => setSelectedNiche(niche)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedNiche === niche
                    ? 'bg-[hsl(217,91%,54%)] border-[hsl(217,91%,54%)] text-white shadow-lg shadow-[hsl(217,91%,54%)]/20'
                    : 'bg-[hsl(222,47%,9%)] border-[hsl(215,25%,22%)] text-[hsl(215,20%,60%)] hover:border-[hsl(217,91%,54%)] hover:text-white'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>

          {/* LISTINGS GRID */}
          {filteredListings.length === 0 ? (
            <div className="glass-card p-12 text-center border border-[hsl(215,25%,20%)]">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="text-xl font-bold text-white mb-2">No Matching Websites Found</h3>
              <p className="text-sm text-[hsl(215,20%,60%)]">Try adjusting your search query or selecting a different niche filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((item) => (
                <div key={item.id} className="glass-card p-6 border border-[hsl(215,25%,22%)] hover:border-[hsl(217,91%,54%)]/50 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-[hsl(217,91%,54%)]/20 text-[hsl(217,91%,70%)] font-mono font-bold text-[11px]">
                        {item.niche}
                      </span>
                      {item.featured && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                          ⭐ High Traffic
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-white group-hover:text-[hsl(217,91%,75%)] transition-colors mb-1">
                      {item.title}
                    </h3>
                    <div className="text-xs font-mono text-cyan-400 font-bold mb-4">
                      🌐 {item.domainName}
                    </div>

                    <p className="text-xs text-[hsl(215,20%,65%)] leading-relaxed mb-6">
                      {item.description}
                    </p>

                    {/* METRICS METERS */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,20%)] rounded-xl text-center mb-6">
                      <div>
                        <div className="text-[10px] text-[hsl(215,20%,50%)] uppercase font-bold">DA</div>
                        <div className="text-base font-black text-emerald-400">{item.da}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[hsl(215,20%,50%)] uppercase font-bold">DR</div>
                        <div className="text-base font-black text-cyan-400">{item.dr}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[hsl(215,20%,50%)] uppercase font-bold">Traffic</div>
                        <div className="text-xs font-black text-amber-300 mt-1">{item.traffic}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4 pt-3 border-t border-[hsl(215,25%,20%)]">
                      <div className="text-xs text-[hsl(215,20%,60%)]">
                        Turnaround: <span className="text-white font-bold">{item.turnaround}</span>
                      </div>
                      <div className="text-2xl font-black text-white">
                        ${item.price}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenOrderModal(item)}
                      className="w-full py-3.5 px-4 bg-[hsl(217,91%,54%)] hover:bg-[hsl(217,91%,60%)] text-white font-bold text-sm rounded-xl shadow-lg shadow-[hsl(217,91%,54%)]/25 transition-all flex items-center justify-center gap-2"
                    >
                      <span>🛒 Order Guest Post Placement</span>
                      <span>(${item.price})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GUEST POST ORDER MODAL */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[hsl(222,47%,9%)] border border-[hsl(217,91%,54%)]/40 rounded-2xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative">
            <button
              onClick={handleCloseOrderModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[hsl(215,25%,20%)] text-[hsl(215,20%,70%)] hover:text-white flex items-center justify-center font-bold"
            >
              ✕
            </button>

            {orderSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl font-bold flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white mb-2">🎉 Guest Post Order Placed!</h3>
                <p className="text-sm text-[hsl(215,20%,65%)] leading-relaxed mb-6">
                  Thank you! Your guest post order for <strong className="text-cyan-300">{selectedListing.domainName}</strong> has been received by our editorial team. We will review your target link (<span className="text-white font-bold">{targetUrl}</span>) and contact you at <strong className="text-white">{clientEmail}</strong> within 12 hours.
                </p>
                <button
                  onClick={handleCloseOrderModal}
                  className="btn-primary py-3 px-8 text-xs font-bold"
                >
                  Done & Close
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder}>
                <div className="mb-6 border-b border-[hsl(215,25%,20%)] pb-4">
                  <span className="badge mb-2">Order Placement</span>
                  <h3 className="text-2xl font-black text-white">
                    Order Link on <span className="gradient-text">{selectedListing.domainName}</span>
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[hsl(215,20%,60%)] mt-2 font-mono">
                    <span>DA {selectedListing.da}</span> • <span>DR {selectedListing.dr}</span> • <span className="text-amber-300 font-bold">${selectedListing.price} Single Placement</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Alex Johnson"
                        className="w-full px-4 py-2.5 bg-[hsl(222,47%,6%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-sm focus:outline-none focus:border-[hsl(217,91%,54%)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-1.5">
                        Your Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-2.5 bg-[hsl(222,47%,6%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-sm focus:outline-none focus:border-[hsl(217,91%,54%)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                        Target Page URL (Your Link) *
                      </label>
                      <input
                        type="url"
                        required
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://yourwebsite.com/target-page"
                        className="w-full px-4 py-2.5 bg-[hsl(222,47%,6%)] border border-[hsl(217,91%,54%)]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[hsl(217,91%,54%)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                        Desired Anchor Text *
                      </label>
                      <input
                        type="text"
                        required
                        value={anchorText}
                        onChange={(e) => setAnchorText(e.target.value)}
                        placeholder="e.g. Best AI SEO Agency"
                        className="w-full px-4 py-2.5 bg-[hsl(222,47%,6%)] border border-[hsl(217,91%,54%)]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[hsl(217,91%,54%)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 bg-[hsl(222,47%,6%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-sm focus:outline-none focus:border-[hsl(217,91%,54%)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-1.5">
                      Special Requirements or Article Topic Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Specify preferred article focus, keywords to include, or publishing timelines..."
                      className="w-full px-4 py-2.5 bg-[hsl(222,47%,6%)] border border-[hsl(215,25%,22%)] rounded-xl text-white text-sm focus:outline-none focus:border-[hsl(217,91%,54%)]"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[hsl(215,25%,20%)] flex items-center justify-between">
                  <div className="text-xs text-[hsl(215,20%,60%)]">
                    Total: <strong className="text-xl font-black text-white ml-1">${selectedListing.price}</strong>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary py-3.5 px-8 text-sm font-bold shadow-lg shadow-[hsl(217,91%,54%)]/25"
                  >
                    {isSubmitting ? 'Processing Order...' : `Confirm Order ($${selectedListing.price}) →`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <CTASection />
    </>
  );
}
