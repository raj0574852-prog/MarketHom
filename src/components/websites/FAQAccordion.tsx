'use client';

import React from 'react';
import { WebsiteFAQ } from './types';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQAccordion({ faqs }: { faqs: WebsiteFAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden mb-8">
      <div className="p-6 sm:p-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Answers on indexing, anchor policy, Turnaround SLA, and placement permanence
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 self-start sm:self-auto">
          {faqs.length} Verified Answers
        </span>
      </div>

      <div className="divide-y divide-white/5">
        {faqs
          .sort((a, b) => a.display_order - b.display_order)
          .map((faq, index) => (
            <details
              key={faq.id || index}
              className="group bg-transparent [&_summary::-webkit-details-marker]:hidden transition-all duration-200"
            >
              <summary className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-white/5 transition-colors cursor-pointer outline-none select-none">
                <span className="text-sm sm:text-base font-semibold text-slate-200 group-open:text-cyan-400 transition-colors pr-4">
                  {faq.question}
                </span>
                <span className="shrink-0 text-slate-400 group-open:text-cyan-400 transition-transform duration-300 group-open:rotate-180 p-1.5 rounded-lg bg-white/5">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>

              <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-sm sm:text-[15px] text-slate-300 leading-relaxed bg-slate-950/40 border-t border-white/5 pt-4 font-light">
                {faq.answer}
              </div>
            </details>
          ))}
      </div>
    </div>
  );
}
