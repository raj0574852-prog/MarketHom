import React from 'react';
import { WebsiteListing } from './types';
import { Sparkles } from 'lucide-react';

export default function QuickAnswer({ website }: { website: WebsiteListing }) {
  if (!website) return null;

  const { domain, name, category_id } = website;
  const categories = [];
  if (category_id && category_id !== 'General') {
    categories.push(category_id);
  }
  if (website.accepted_niches && website.accepted_niches.length > 0) {
    const niches = website.accepted_niches.filter((n: string) => n !== 'General Niches' && n !== category_id);
    categories.push(...niches);
  }
  
  const uniqueCategories = Array.from(new Set(categories));
  let displayCategory = 'digital lifestyle and business';
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

  return (
    <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 mb-8 overflow-hidden" aria-label="Quick Answer">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-500" />
      
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white tracking-tight">Executive Summary</h2>
      </div>

      <div className="text-slate-300 leading-relaxed text-base font-light">
        <strong className="text-white font-semibold">{domain}</strong> is a high-authority <span className="text-cyan-300">{displayCategory}</span> publication accessible for verified sponsored guest posts and contextual brand editorial links through MarketHom Agency. Placements include permanent DoFollow attribution, guaranteed Google indexing, and fast editorial approval within {website.turnaround_time || '4'} business days.
      </div>
    </div>
  );
}
