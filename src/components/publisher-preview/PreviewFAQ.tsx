'use client';

import React, { useState } from 'react';

export function PreviewFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { q: "What is the turnaround time?", a: "The publisher typically completes placements within 2–3 Days." },
    { q: "Are links permanent?", a: "Yes, this publisher offers permanent link placements." },
    { q: "How many links can I include?", a: "You can include up to 2 links per article." },
    { q: "What type of content is accepted?", a: "This publisher accepts General category content." },
    { q: "Can I submit my own article?", a: "Yes, you must provide your own written article of at least 800+ Words." },
    { q: "Is the link DoFollow?", a: "This publisher offers DoFollow / NoFollow links depending on the content." }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {faqs.map((faq, idx) => (
          <div key={idx} className="group">
            <button 
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="text-sm font-semibold text-slate-800">{faq.q}</span>
              <span className="ml-6 shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors">
                {openIndex === idx ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed bg-white">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
