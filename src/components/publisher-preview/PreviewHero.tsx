import React from 'react';

export function PreviewHero() {
  return (
    <div className="relative w-full rounded-t-2xl overflow-hidden bg-white shadow-sm border border-slate-200 mb-8">
      {/* Hero Image */}
      <div className="w-full h-[200px] md:h-[280px] bg-slate-900 relative">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          alt="Technology Publisher" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative px-6 pb-8 md:px-10 md:pb-10 -mt-12 md:-mt-16 flex flex-col md:flex-row gap-6">
        {/* Logo Container */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative z-10">
          {/* Mock Logo */}
          <span className="text-3xl font-black text-blue-600">R</span>
        </div>

        <div className="flex-1 pt-2 md:pt-16">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-md">
              DoFollow
            </span>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 rounded-md">
              General
            </span>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 rounded-md flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Worldwide
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">
            Publish Guest Post on <span className="text-blue-600">reibootpro.com</span>
          </h1>
          
          <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
}
