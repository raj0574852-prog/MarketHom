'use client';

import React, { useState } from 'react';
import { WebsiteListing } from './types';
import MarketplaceInquiryModal from './MarketplaceInquiryModal';
import { ArrowRight, ExternalLink, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';

export function PublisherOrderSummary({ website }: { website: WebsiteListing }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actualPrice = website.content_placement_selling_price || website.price || 49;
  const currency = website.currency === 'USD' || !website.currency ? '$' : website.currency;

  return (
    <>
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden lg:sticky lg:top-24 min-w-0">
        {/* Accent top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

        <div className="p-6 sm:p-7 border-b border-white/10 min-w-0 break-words">
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Editorial Order
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Active Placement
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-medium text-slate-300">Permanent Guest Post</span>
              <div className="text-right">
                <span className="text-3xl font-black text-white tracking-tight">
                  {currency}{actualPrice}
                </span>
                <span className="text-xs text-slate-400 block">one-time payment</span>
              </div>
            </div>

            {website.discount_price && (
              <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                <span>Standard Catalog Rate</span>
                <span className="line-through text-slate-500">{currency}{website.discount_price}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Guaranteed editorial publishing on <strong className="text-slate-200">{website.domain}</strong> with permanent contextual DoFollow link equity.
          </p>
        </div>
        
        <div className="p-6 sm:p-7 bg-slate-950/40">
          <div className="space-y-3 mb-6">
            <button 
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-base"
            >
              <span>Order Placement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          
            <a 
              href={website.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium rounded-xl border border-white/10 transition-all duration-200 text-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Inspect Live Domain</span>
            </a>
          </div>

          {/* Guaranteed Safeguards */}
          <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Indexation Guarantee or full refund</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Turnaround within {website.turnaround_time || '4'} business days</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Permanent DoFollow link preservation</span>
            </div>
          </div>
        </div>
      </div>

      <MarketplaceInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        website={website}
      />
    </>
  );
}
