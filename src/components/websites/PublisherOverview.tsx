import React from 'react';
import { WebsiteListing } from './types';
import { BookOpen } from 'lucide-react';

export default function PublisherOverview({ website }: { website: WebsiteListing }) {
  const hasEditorialContent = website.long_description || website.editorial_description || website.audience_description;

  if (hasEditorialContent) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            About {website.name || website.domain}
          </h2>
        </div>

        <div className="space-y-6 text-slate-300 font-light leading-relaxed">
          {website.long_description && (
            <p className="whitespace-pre-wrap text-base sm:text-lg text-slate-200">
              {website.long_description}
            </p>
          )}
          
          {website.editorial_description && (
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-base font-bold text-white mb-2">Editorial Guidelines & Focus</h3>
              <p className="whitespace-pre-wrap text-slate-300">{website.editorial_description}</p>
            </div>
          )}
          
          {website.audience_description && (
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-base font-bold text-white mb-2">Target Readership & Audience</h3>
              <p className="whitespace-pre-wrap text-slate-300">{website.audience_description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
