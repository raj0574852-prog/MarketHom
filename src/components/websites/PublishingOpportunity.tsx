import React from 'react';
import { WebsiteListing } from './types';

export default function PublishingOpportunity({ website }: { website: WebsiteListing }) {
  const categoryName = website.category_id || 'General';
  
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Publishing Opportunity</h2>
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 leading-relaxed">
          Through the EducationHom marketplace, you can secure a {website.publication_type ? website.publication_type.toLowerCase() : 'content placement'} on <strong>{website.domain}</strong>. 
          This listing is categorized under the <strong>{categoryName}</strong> sector.
        </p>
        <p className="text-slate-700 leading-relaxed mt-4">
          According to verified listing data, this opportunity {website.link_validity ? `provides a ${website.link_validity.toLowerCase()} link` : 'allows link placement'}{website.max_dofollow_links ? ` with up to ${website.max_dofollow_links} dofollow links permitted per post` : ''}.
          {website.turnaround_time && ` The typical turnaround time for publication is estimated at ${website.turnaround_time}.`}
        </p>
        <p className="text-slate-700 leading-relaxed mt-4 text-sm text-slate-500">
          <em>Please note: EducationHom acts as a marketplace facilitator. This listing does not imply a direct editorial affiliation with the publisher. Search engine rankings and traffic metrics are estimates and are not guaranteed.</em>
        </p>
      </div>
    </div>
  );
}
