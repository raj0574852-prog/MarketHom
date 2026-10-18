'use client';

import React from 'react';
import { WebsiteFAQ } from './types';

export default function FAQAccordion({ faqs }: { faqs: WebsiteFAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>❓</span> Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Key details on pricing, backlink guidelines, SEO authority, and publishing timeline
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 self-start sm:self-auto">
          {faqs.length} Answers
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {faqs
          .sort((a, b) => a.display_order - b.display_order)
          .map((faq, index) => (
            <details
              key={faq.id || index}
              className="group bg-white [&_summary::-webkit-details-marker]:hidden transition-all duration-200"
            >
              <summary className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500">
                <span className="text-sm font-bold text-slate-800 group-open:text-blue-600 transition-colors pr-4">
                  {faq.question}
                </span>
                <span className="shrink-0 text-slate-400 group-hover:text-blue-600 group-open:text-blue-600 transition-colors p-1 rounded-lg bg-slate-50 group-open:bg-blue-50">
                  <svg
                    className="w-4 h-4 transform transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>

              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed bg-slate-50/40 border-t border-slate-100/60 pt-3">
                {faq.answer}
              </div>
            </details>
          ))}
      </div>
    </div>
  );
}
