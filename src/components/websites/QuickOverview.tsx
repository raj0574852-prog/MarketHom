import React from 'react';
import { WebsiteListing } from './types';
import { Globe, Tag, Link2, Languages, MapPin, Clock, DollarSign, Building } from 'lucide-react';

export default function QuickOverview({ website }: { website: WebsiteListing }) {
  const categoryName = website.category_id || 'General';
  const displayPrice = website.content_placement_selling_price || website.price || 49;
  const currency = website.currency === 'USD' || !website.currency ? '$' : website.currency;

  const specs = [
    {
      icon: <Building className="w-4 h-4 text-cyan-400" />,
      label: 'Publisher Name',
      value: website.name || website.domain
    },
    {
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      label: 'Domain URL',
      value: website.domain
    },
    {
      icon: <Tag className="w-4 h-4 text-indigo-400" />,
      label: 'Primary Category',
      value: categoryName
    },
    {
      icon: <Link2 className="w-4 h-4 text-emerald-400" />,
      label: 'Backlink Equity',
      value: website.link_validity || 'DoFollow (Permanent)'
    },
    {
      icon: <Languages className="w-4 h-4 text-purple-400" />,
      label: 'Primary Language',
      value: website.language && website.language.toLowerCase() !== 'not specified' ? website.language : 'English'
    },
    {
      icon: <MapPin className="w-4 h-4 text-rose-400" />,
      label: 'Target Geography',
      value: website.location && website.location.toLowerCase() !== 'not specified' ? website.location : 'Worldwide'
    },
    {
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      label: 'Turnaround Time',
      value: website.turnaround_time ? `${website.turnaround_time} Business Days` : '3-5 Days'
    },
    {
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      label: 'Placement Fee',
      value: `${currency}${displayPrice} USD`
    }
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <h2 className="text-xl font-bold text-white tracking-tight">Publisher Specification</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {specs.map((spec, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-white/15 transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {spec.icon}
              <span>{spec.label}</span>
            </div>
            <div className="text-white font-medium text-sm sm:text-base break-words group-hover:text-cyan-300 transition-colors">
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
