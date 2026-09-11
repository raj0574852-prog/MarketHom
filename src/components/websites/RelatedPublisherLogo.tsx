"use client";

import React, { useState } from 'react';

interface RelatedPublisherLogoProps {
  logoUrl?: string | null;
  name: string;
}

export default function RelatedPublisherLogo({ logoUrl, name }: RelatedPublisherLogoProps) {
  const [error, setError] = useState(false);
  const initial = (name || 'W').charAt(0).toUpperCase();

  if (!logoUrl || error) {
    return (
      <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl mb-4 shadow-sm">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name || 'Website'} logo`}
      className="w-16 h-16 rounded-lg object-contain bg-slate-50 mb-4 shadow-sm"
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
