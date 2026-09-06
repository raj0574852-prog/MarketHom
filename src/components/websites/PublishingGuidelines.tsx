import React from 'react';
import { WebsiteListing } from './types';

export default function PublishingGuidelines({ website }: { website: WebsiteListing }) {
  const guidelines = [
    { label: 'Turnaround Time', value: website.turnaround_time },
    { label: 'Article Length', value: website.article_length },
    { label: 'Link Validity', value: website.link_validity },
    { label: 'Publication Type', value: website.publication_type },
    { label: 'Max Dofollow Links', value: website.max_dofollow_links },
    { label: 'Max Nofollow Links', value: website.max_nofollow_links },
    { label: 'Content Review', value: website.content_review },
    { label: 'Image Requirements', value: website.image_requirements }
  ];

  const policies = [
    { label: 'Editorial Review Policy', value: website.editorial_review },
    { label: 'AI Content Policy', value: website.ai_content_policy },
    { label: 'Link Policy', value: website.link_policy },
    { label: 'Anchor Text Policy', value: website.anchor_text_policy },
    { label: 'Destination URL Policy', value: website.destination_url_policy },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Publishing Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guidelines.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-semibold text-slate-900">{item.value || 'Not specified'}</span>
            </div>
          ))}
        </div>
      </div>

      {(policies.some(p => p.value) || website.original_content_required || website.sponsored_label || website.disclosure_required) && (
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Editorial Policies</h3>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {website.original_content_required && <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-md font-medium">Original Content Required</span>}
            {website.sponsored_label && <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-md font-medium">Sponsored Label Applied</span>}
            {website.disclosure_required && <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-md font-medium">Disclosure Required</span>}
          </div>

          <div className="space-y-4">
            {policies.filter(p => p.value).map((item, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-slate-800 mb-1">{item.label}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
