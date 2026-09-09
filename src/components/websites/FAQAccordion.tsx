import { WebsiteFAQ } from './types';

export default function FAQAccordion({ faqs }: { faqs: WebsiteFAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mt-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.sort((a, b) => a.display_order - b.display_order).map((faq, index) => (
          <details 
            key={faq.id || index} 
            className="group border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 bg-slate-50 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-100 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <span className="font-semibold text-slate-900 pr-8">{faq.question}</span>
              <svg
                className="w-5 h-5 text-slate-500 transform transition-transform duration-200 flex-shrink-0 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            
            <div className="p-4 bg-white text-slate-700 leading-relaxed border-t border-slate-100">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
