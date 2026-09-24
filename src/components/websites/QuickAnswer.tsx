import React from 'react';
import { WebsiteListing } from './types';

export default function QuickAnswer({ website }: { website: WebsiteListing }) {
  if (!website) return null;

  const { domain, name, category_id, content_placement_selling_price } = website;
  const displayName = name || domain;
  
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8">
      <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-[hsl(217,91%,54%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Quick Answer
      </h2>
      <div className="text-slate-700 leading-relaxed text-base">
        <strong>{displayName}</strong> is a publishing platform covering {displayCategory}. 
        EducationHom lists this publisher for guest posts and SEO content placements, with available publishing options shown below.
        {content_placement_selling_price ? (
          <> Placements are currently available starting at ${content_placement_selling_price} USD.</>
        ) : null}
      </div>
    </div>
  );
}
