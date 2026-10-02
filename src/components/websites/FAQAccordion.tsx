import { WebsiteFAQ } from './types';

export default function FAQAccordion({ faqs }: { faqs: WebsiteFAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {faqs.sort((a, b) => a.display_order - b.display_order).map((faq, index) => (
          <details 
            key={faq.id || index} 
            className="group bg-white [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500">
              <span className="text-sm font-semibold text-slate-800">{faq.question}</span>
              <span className="ml-6 shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors">
                <svg
                  className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            
            <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed bg-white">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
