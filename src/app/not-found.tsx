import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Home } from 'lucide-react';
import { BorderBeam } from '@/components/ui/BorderBeam';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 relative overflow-hidden py-32">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-xl w-full p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl text-center">
        <BorderBeam size={180} duration={10} colorFrom="#3b82f6" colorTo="#a855f7" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Compass className="w-3.5 h-3.5" />
          <span>Error 404 &bull; Page Not Found</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Lost in Digital Space
        </h1>

        <p className="text-slate-400 text-base leading-relaxed mb-8">
          The requested page could not be found. It may have been retired, moved, or never existed in our directory. Let us guide you back to our high-performance agency solutions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all hover:-translate-y-0.5"
          >
            <span>Explore Agency Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
