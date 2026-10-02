import React from 'react';
import Link from 'next/link';

export function PreviewBreadcrumb() {
  return (
    <nav className="flex text-xs text-slate-500 font-medium mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-3 h-3 text-slate-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/websites" className="hover:text-blue-600 transition-colors">
              Marketplace
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <svg className="w-3 h-3 text-slate-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold">reibootpro.com</span>
          </div>
        </li>
      </ol>
    </nav>
  );
}
