"use client";

import React, { useState } from 'react';

interface PublisherLogoProps {
  domain: string;
  name?: string;
  className?: string;
}

export default function PublisherLogo({ domain, name, className = "w-24 h-24" }: PublisherLogoProps) {
  const [error, setError] = useState(false);

  const displayName = name || domain || 'W';
  
  // As per strict requirement: ALL publisher logos MUST use Google favicon endpoint
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;

  if (!faviconUrl || error) {
    // Local fallback requirement
    return (
      <div className={`${className} rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-slate-400 shadow-sm overflow-hidden p-2`}>
        <svg className="w-1/2 h-1/2 opacity-30 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-semibold tracking-wider uppercase truncate w-full text-center">{displayName.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img
      src={faviconUrl}
      alt={`${displayName} publisher logo`}
      className={`${className} rounded-xl border border-slate-100 object-contain shadow-sm bg-white`}
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
