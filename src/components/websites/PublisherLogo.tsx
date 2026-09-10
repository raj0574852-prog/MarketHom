"use client";

import React, { useState } from 'react';

interface PublisherLogoProps {
  logoUrl?: string | null;
  name: string;
}

export default function PublisherLogo({ logoUrl, name }: PublisherLogoProps) {
  const [error, setError] = useState(false);

  if (!logoUrl || error) {
    return (
      <div className="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl shadow-sm">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className="w-24 h-24 rounded-xl border border-slate-100 object-contain shadow-sm bg-white"
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
