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

  // Concise factual fallback
  const facts = [];
  
  if (website.category_id && website.category_id !== 'General') {
    facts.push(<span key="cat">{website.domain} is listed in the <strong>{website.category_id}</strong> category.</span>);
  } else {
    facts.push(<span key="cat"><strong>{website.domain}</strong> is a listed publisher in our marketplace.</span>);
  }

  if (website.language && website.language.toLowerCase() !== 'not specified') {
    facts.push(<span key="lang">The listed language is <strong>{website.language}</strong>.</span>);
  }

  if (website.location && website.location.toLowerCase() !== 'not specified' && website.location.toLowerCase() !== 'worldwide') {
    facts.push(<span key="loc">The listed location is <strong>{website.location}</strong>.</span>);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Publisher Overview</h2>
      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
        <p className="flex flex-wrap gap-1">
          {facts.map((fact, i) => (
            <React.Fragment key={i}>
              {fact} {i < facts.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
