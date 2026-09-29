import React from 'react';
import { WebsiteListing } from './types';

export default function QuickAnswer({ website }: { website: WebsiteListing }) {
  if (!website) return null;

  const { domain, name, category_id, content_placement_selling_price } = website;
  const displayName = name && name.toLowerCase() !== domain.toLowerCase() ? name : domain;
  
  const categories = [];
  if (category_id && category_id !== 'General') {
    categories.push(category_id);
  }
  if (website.accepted_niches && website.accepted_niches.length > 0) {
    const niches = website.accepted_niches.filter((n: string) => n !== 'General Niches' && n !== category_id);
    categories.push(...niches);
  }
  
  const uniqueCategories = Array.from(new Set(categories));
  let displayCategory = 'various topics';
  if (uniqueCategories.length > 0) {
    const topTopics = uniqueCategories.slice(0, 3);
    if (topTopics.length === 1) {
      displayCategory = topTopics[0];
    } else if (topTopics.length === 2) {
      displayCategory = `${topTopics[0]} and ${topTopics[1]}`;
    } else {
      displayCategory = `${topTopics.slice(0, -1).join(', ')} and ${topTopics[topTopics.length - 1]}`;
    }
  }

  // Constructing a factual, AEO-friendly quick answer
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8" aria-label="Quick Answer">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Answer
      </h2>
      <div className="text-slate-700 leading-relaxed text-lg">
        <strong>{domain}</strong> is a {displayCategory}-focused publishing opportunity available through EducationHom. 
        Guest post placements are available for this publisher. Publisher metrics and content requirements are provided below.
      </div>
    </div>
  );
}
