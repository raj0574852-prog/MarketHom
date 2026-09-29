import React from 'react';
import { WebsiteListing } from './types';

export default function PublisherOverview({ website }: { website: WebsiteListing }) {
  const hasEditorialContent = website.long_description || website.editorial_description || website.audience_description;

  if (hasEditorialContent) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">About {website.name || website.domain}</h2>
        <div className="prose prose-slate max-w-none">
          {website.long_description && (
            <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
              {website.long_description}
            </p>
          )}
          
          {website.editorial_description && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Editorial Focus</h3>
              <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{website.editorial_description}</p>
            </div>
          )}
          
          {website.audience_description && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Target Audience</h3>
              <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{website.audience_description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If there is no verified editorial content, omit the generated overview entirely
  // to avoid programmatic duplication and filler text.
  return null;
}
